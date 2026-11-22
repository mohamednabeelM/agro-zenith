"""
Agro Zenith — FastAPI Backend
==============================
Run:     uvicorn main:app --reload --port 8000
Install: pip install fastapi uvicorn httpx python-multipart pillow google-generativeai python-dotenv

Endpoints:
  POST /detect-disease   — Gemini Vision crop disease analysis
  GET  /weather          — OpenWeatherMap current weather
  GET  /forecast         — OpenWeatherMap 5-day forecast
  GET  /market-prices    — Agmarknet / data.gov.in live mandi prices
  POST /chat             — Gemini AI Agro Bot (Tamil / English / Hindi)
  POST /soil-analysis    — Gemini AI NPK soil report + fertilizer plan
  POST /predict-yield    — Gemini AI yield + revenue prediction
  GET  /schemes          — Government scheme eligibility matcher
  GET  /health           — Health check
"""

import os, base64, json
import httpx
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from both the backend/.env and root .env files.
# backend/.env often contains placeholders; prefer the root .env values.
project_root = Path(__file__).resolve().parent.parent
load_dotenv(Path(__file__).resolve().parent / ".env", override=False)
load_dotenv(project_root / ".env", override=True)

# ─── App setup ────────────────────────────────────────────────────────────────
app = FastAPI(
    title       = "Agro Zenith API",
    description = "AI-powered agricultural backend for Tamil Nadu farmers",
    version     = "1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins  = ["*"],   # tighten to ["http://localhost:3000"] in production
    allow_methods  = ["*"],
    allow_headers  = ["*"],
)

# ─── API clients ──────────────────────────────────────────────────────────────
GEMINI_KEY    = os.environ.get("GEMINI_API_KEY", "")
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)

WEATHER_KEY   = os.environ.get("OPENWEATHER_API_KEY") or os.environ.get("REACT_APP_WEATHER_API_KEY", "")
AGMARKNET_KEY = os.environ.get("AGMARKNET_API_KEY") or os.environ.get("REACT_APP_AGMARKNET_KEY", "")

GEMINI_MODEL  = "gemini-2.0-flash"


# ══════════════════════════════════════════════════════════════════════════════
#  HEALTH CHECK
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/health")
async def health():
    return {
        "status":   "ok",
        "version":  "1.0.0",
        "services": {
            "gemini":       bool(GEMINI_KEY),
            "weather":      bool(WEATHER_KEY),
            "agmarknet":    bool(AGMARKNET_KEY),
        },
    }


# ══════════════════════════════════════════════════════════════════════════════
#  1. DISEASE DETECTION  (Gemini Vision)
# ══════════════════════════════════════════════════════════════════════════════

@app.post("/detect-disease")
async def detect_disease(
    file:     UploadFile = File(...),
    crop:     str        = "Tomato",
    language: str        = "English",
):
    """
    Upload a plant leaf/stem photo → returns disease name, severity,
    treatment plan with dosages, and optional Tamil summary.
    """
    contents = await file.read()
    b64      = base64.b64encode(contents).decode()

    tamil_field = ', "tamil_summary":"Tamil 2-line diagnosis summary"' \
                  if language == "Tamil" else ""

    prompt = f"""You are an expert agricultural pathologist for Indian farmers, especially Tamil Nadu.
Analyze this {crop} plant image carefully.

Respond ONLY in valid JSON (no markdown, no backticks, no extra text):
{{
  "disease":      "disease name or Healthy",
  "confidence":   0-100,
  "severity":     "Low / Medium / High / Healthy",
  "symptoms":     ["symptom 1", "symptom 2", "symptom 3"],
  "causes":       ["cause 1", "cause 2"],
  "treatment":    ["treatment 1 with exact dosage", "treatment 2", "treatment 3"],
  "prevention":   ["prevention tip 1", "prevention tip 2", "prevention tip 3"],
  "medicines":    ["Mancozeb 75WP @ 2g per litre", "medicine 2 @ dosage"],
  "organic":      ["neem oil 3ml/L + soap 1ml/L", "other organic option"],
  "sprayTime":    "best time to spray (e.g. Early morning 6–8 AM)",
  "urgency":      "treat within X days / hours"{tamil_field}
}}"""

    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        # Build multimodal content: image + text prompt
        image_part = {
            "inline_data": {
                "mime_type": file.content_type or "image/jpeg",
                "data": b64,
            }
        }
        response = model.generate_content([image_part, prompt])
        raw = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(raw)

    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="Gemini returned non-JSON response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════════════
#  2. WEATHER  (OpenWeatherMap)
# ══════════════════════════════════════════════════════════════════════════════

MOCK_WEATHER = {
    "temp": 32, "humidity": 72, "description": "Partly cloudy",
    "city": "", "windSpeed": 3.2, "rain": 0, "icon": "02d",
}

MOCK_FORECAST = [
    {"date": "Today", "temp": 32, "humidity": 72, "desc": "Partly cloudy",  "rain": 0  },
    {"date": "Tue",   "temp": 31, "humidity": 80, "desc": "Light rain",     "rain": 4  },
    {"date": "Wed",   "temp": 29, "humidity": 85, "desc": "Moderate rain",  "rain": 12 },
    {"date": "Thu",   "temp": 33, "humidity": 68, "desc": "Clear sky",      "rain": 0  },
    {"date": "Fri",   "temp": 34, "humidity": 65, "desc": "Sunny",          "rain": 0  },
]


@app.get("/weather")
async def get_weather(lat: float, lon: float):
    """Current weather at given GPS coordinates. Falls back to static mock if no API key or on error."""
    if not WEATHER_KEY:
        return MOCK_WEATHER
    try:
        async with httpx.AsyncClient(timeout=8) as http:
            r = await http.get(
                f"https://api.openweathermap.org/data/2.5/weather"
                f"?lat={lat}&lon={lon}&appid={WEATHER_KEY}&units=metric"
            )
            d = r.json()
            return {
                "temp":        round(d["main"]["temp"]),
                "humidity":    d["main"]["humidity"],
                "description": d["weather"][0]["description"],
                "icon":        d["weather"][0]["icon"],
                "city":        d["name"],
                "windSpeed":   d["wind"]["speed"],
                "rain":        d.get("rain", {}).get("1h", 0),
            }
    except Exception:
        return MOCK_WEATHER


@app.get("/forecast")
async def get_forecast(lat: float, lon: float):
    """5-day weather forecast. Falls back to static mock."""
    if not WEATHER_KEY:
        return MOCK_FORECAST
    try:
        async with httpx.AsyncClient(timeout=8) as http:
            r = await http.get(
                f"https://api.openweathermap.org/data/2.5/forecast"
                f"?lat={lat}&lon={lon}&appid={WEATHER_KEY}&units=metric&cnt=5"
            )
            d = r.json()
            return [
                {
                    "date":     item["dt_txt"].split(" ")[0],
                    "temp":     round(item["main"]["temp"]),
                    "humidity": item["main"]["humidity"],
                    "desc":     item["weather"][0]["description"],
                    "rain":     item.get("rain", {}).get("3h", 0),
                }
                for item in d.get("list", [])
            ]
    except Exception:
        return MOCK_FORECAST


# ══════════════════════════════════════════════════════════════════════════════
#  3. MARKET PRICES  (Agmarknet / data.gov.in)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/market-prices")
async def get_market_prices(
    state:     str           = "Tamil Nadu",
    commodity: Optional[str] = None,
    limit:     int           = Query(default=100, le=500),
):
    """
    Live mandi prices from data.gov.in Agmarknet API.
    Returns [] if no key — React frontend uses its own static fallback.
    """
    if not AGMARKNET_KEY:
        return []
    try:
        url = (
            f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
            f"?api-key={AGMARKNET_KEY}&format=json"
            f"&filters[State]={state}&limit={limit}"
        )
        if commodity:
            url += f"&filters[Commodity]={commodity}"

        async with httpx.AsyncClient(timeout=10) as http:
            r  = await http.get(url)
            d  = r.json()
            return [
                {
                    "crop":   rec.get("Commodity",         ""),
                    "market": rec.get("Market",            ""),
                    "min":    float(rec.get("Min_x0020_Price",   0) or 0),
                    "max":    float(rec.get("Max_x0020_Price",   0) or 0),
                    "modal":  float(rec.get("Modal_x0020_Price", 0) or 0),
                    "date":   rec.get("Arrival_Date",      ""),
                    "grade":  rec.get("Grade",             "FAQ"),
                }
                for rec in d.get("records", [])
            ]
    except Exception:
        return []


# ══════════════════════════════════════════════════════════════════════════════
#  4. AI AGRO BOT  (Gemini Chat)
# ══════════════════════════════════════════════════════════════════════════════

class ChatRequest(BaseModel):
    model:       Optional[str] = None
    messages:    List[dict]
    language:    str       = "English"
    farmer_name: str       = ""
    district:    str       = ""
    crops:       List[str] = []
    land_size:   float     = 0.0


@app.post("/chat")
async def chat(req: ChatRequest):
    """
    AI Agro Bot powered by Gemini.
    Responds in Tamil / English / Hindi based on farmer preference.
    Gives specific dosages, scheme URLs, market sell/hold advice.
    """
    lang_instruction = {
        "Tamil":   "Respond primarily in Tamil (தமிழ்). Use English only for medicine/chemical names.",
        "Hindi":   "Respond primarily in Hindi. Use English only for medicine/chemical names.",
        "English": "Respond primarily in English.",
    }.get(req.language, "Respond in English.")

    system = f"""You are Agro AI Bot — expert agricultural assistant for Indian farmers, especially Tamil Nadu smallholder farmers.

Farmer Profile:
  Name:     {req.farmer_name}
  District: {req.district}, Tamil Nadu
  Crops:    {', '.join(req.crops) if req.crops else 'various'}
  Land:     {req.land_size} acres

Language: {lang_instruction}

EXPERTISE AREAS:
- Crop diseases: name + exact medicine dosage (per litre AND per acre) + brand names
- Fertilizers: NPK schedules, micronutrient deficiency, basal vs top-dressing timing
- Irrigation: scheduling, drip vs flood, water stress signs
- Pest management: IPM approach, chemical + biological options
- Market timing: buy / sell / hold advice with reasons
- Government schemes: PM-KISAN, PMFBY, KCC, Soil Health Card, PM Sinchayee, TN state schemes — include portal URLs
- Organic farming: bio-inputs, Jeevamrutham, Panchagavya recipes

RESPONSE RULES:
- Always give SPECIFIC advice (not generic). Exact dosage, timing, product names.
- Keep under 200 words but complete. Use emojis for mobile readability.
- For schemes: always mention the portal URL.
- If unsure, say so — never guess on medicine dosages."""

    if not GEMINI_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key is not configured")

    try:
        model = genai.GenerativeModel(
            model_name=GEMINI_MODEL,
            system_instruction=system,
        )

        # Convert messages to Gemini format
        # Gemini uses "user" and "model" roles (not "assistant")
        gemini_history = []
        for msg in req.messages[:-1]:  # all except last
            role = "model" if msg["role"] == "assistant" else "user"
            gemini_history.append({"role": role, "parts": [msg["content"]]})

        chat_session = model.start_chat(history=gemini_history)

        # Send the last message
        last_msg = req.messages[-1]["content"] if req.messages else ""
        response = chat_session.send_message(last_msg)

        reply = response.text.strip()
        return {"reply": reply}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════════════
#  5. SOIL ANALYSIS  (Gemini AI)
# ══════════════════════════════════════════════════════════════════════════════

class SoilData(BaseModel):
    nitrogen:       float
    phosphorus:     float
    potassium:      float
    ph:             float
    organic_carbon: float
    crop:           str
    district:       str


@app.post("/soil-analysis")
async def soil_analysis(data: SoilData):
    """
    Takes NPK + pH + OC readings → returns deficiency diagnosis,
    fertilizer recommendation per acre, and organic alternatives.
    """
    prompt = f"""You are an expert agricultural soil scientist for Tamil Nadu, India.
Analyze the following soil test report and give actionable recommendations.

Soil Report:
  Nitrogen (N):       {data.nitrogen} kg/ha
  Phosphorus (P):     {data.phosphorus} kg/ha
  Potassium (K):      {data.potassium} kg/ha
  pH:                 {data.ph}
  Organic Carbon:     {data.organic_carbon}%
  Intended Crop:      {data.crop}
  District:           {data.district}, Tamil Nadu

Respond ONLY in valid JSON (no markdown):
{{
  "soil_health":        "Good / Average / Poor",
  "deficiencies":       ["list of deficient nutrients"],
  "ph_status":          "Acidic / Neutral / Alkaline — brief note",
  "ph_correction":      "lime/gypsum recommendation if needed, else null",
  "recommendations": [
    {{
      "nutrient":  "N / P / K / micronutrient name",
      "quantity":  "exact kg or g per acre",
      "product":   "fertilizer brand/generic name",
      "timing":    "basal / top-dressing / foliar + when exactly"
    }}
  ],
  "organic_suggestion": "Jeevamrutham / FYM / Vermicompost — quantity per acre",
  "yield_impact":       "estimated % improvement with these recommendations",
  "summary":            "2-sentence plain-language summary for farmer"
}}"""

    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = model.generate_content(prompt)
        raw = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="Could not parse Gemini response as JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════════════
#  6. YIELD PREDICTION  (Gemini AI)
# ══════════════════════════════════════════════════════════════════════════════

class YieldRequest(BaseModel):
    crop:         str
    area_acres:   float
    soil_type:    str
    district:     str
    irrigation:   str   # "Drip" / "Flood" / "Rainfed" / "Sprinkler"
    season:       str   # "Kharif" / "Rabi" / "Summer" / "Perennial"


@app.post("/predict-yield")
async def predict_yield(req: YieldRequest):
    """
    Predicts expected yield range, estimated revenue, risk factors,
    and best variety recommendation for Tamil Nadu conditions.
    """
    prompt = f"""You are an expert agricultural yield prediction specialist for Tamil Nadu, India.

Farm Details:
  Crop:       {req.crop}
  Area:       {req.area_acres} acres
  Soil Type:  {req.soil_type}
  District:   {req.district}, Tamil Nadu
  Irrigation: {req.irrigation}
  Season:     {req.season}

Respond ONLY in valid JSON (no markdown):
{{
  "expected_yield_Kg": {{
    "min":     0,
    "max":     0,
    "average": 0
  }},
  "yield_per_acre":       0,
  "estimated_revenue_inr": 0,
  "market_price_used":    "₹X per Kg (current average)",
  "risk_factors":         ["risk 1", "risk 2", "risk 3"],
  "improvement_tips":     ["tip with expected % gain", "tip 2"],
  "best_variety":         "recommended variety name for this district + season",
  "harvest_duration":     "X months from sowing",
  "break_even_cost":      "estimated input cost per acre in INR"
}}"""

    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = model.generate_content(prompt)
        raw = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="Could not parse Gemini response as JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════════════
#  7. GOVERNMENT SCHEMES  (Static — no API key needed)
# ══════════════════════════════════════════════════════════════════════════════

SCHEMES = [
    {
        "id": 1, "name": "PM-KISAN",
        "tag": "Income Support", "amount": "₹6,000/year",
        "desc": "Direct income support of ₹6,000 per year in 3 installments of ₹2,000 to all landholding farmer families.",
        "eligibility": "All farmers with cultivable land (excludes income taxpayers)",
        "docs": ["Aadhaar card", "Land records (Patta)", "DBT-enabled bank account"],
        "portal": "https://pmkisan.gov.in", "state": "Central",
    },
    {
        "id": 2, "name": "PM Fasal Bima Yojana",
        "tag": "Insurance", "amount": "2% premium (Kharif)",
        "desc": "Crop insurance against natural calamities, pests and diseases. Just 2% premium for Kharif, 1.5% for Rabi.",
        "eligibility": "All farmers including sharecroppers growing notified crops",
        "docs": ["Aadhaar", "Land records / lease agreement", "Bank account", "Sowing certificate"],
        "portal": "https://pmfby.gov.in", "state": "Central",
    },
    {
        "id": 3, "name": "Kisan Credit Card (KCC)",
        "tag": "Credit", "amount": "Up to ₹3 lakh @ 4%",
        "desc": "Short-term crop loan at 4% interest for cultivation, maintenance, and post-harvest expenses.",
        "eligibility": "Farmers, sharecroppers, oral lessees, self-help groups",
        "docs": ["Aadhaar", "Land records", "Passport photo", "Bank KYC"],
        "portal": "https://www.nabard.org/kcc", "state": "Central",
    },
    {
        "id": 4, "name": "Soil Health Card Scheme",
        "tag": "Free Testing", "amount": "Free",
        "desc": "Free soil test every 2 years — NPK + micronutrients + crop-wise fertilizer recommendations.",
        "eligibility": "All farmers",
        "docs": ["Aadhaar", "Land survey number"],
        "portal": "https://soilhealth.dac.gov.in", "state": "Central",
    },
    {
        "id": 5, "name": "PM Krishi Sinchayee Yojana",
        "tag": "Irrigation", "amount": "55–90% subsidy",
        "desc": "Drip and sprinkler irrigation subsidy up to 90% for small/marginal farmers.",
        "eligibility": "Farmers with own land; priority to SC/ST and small farmers (≤5 acres)",
        "docs": ["Aadhaar", "Land records", "Bank account", "Vendor estimate"],
        "portal": "https://pmksy.gov.in", "state": "Central",
    },
    {
        "id": 6, "name": "TN CM Uzhavar Pathukappu",
        "tag": "TN State Insurance", "amount": "100% premium paid by govt",
        "desc": "TN government pays full crop insurance premium for small and marginal farmers.",
        "eligibility": "TN farmers with ≤5 acres land",
        "docs": ["Aadhaar", "Patta", "Bank account", "Village officer certificate"],
        "portal": "https://www.tn.gov.in/agriculture", "state": "Tamil Nadu",
    },
    {
        "id": 7, "name": "eNAM — National Agriculture Market",
        "tag": "Market Access", "amount": "Free listing",
        "desc": "Sell produce directly on National Agriculture Market. 1,000+ mandis. No middlemen — best price.",
        "eligibility": "All farmers with produce to sell",
        "docs": ["Aadhaar", "Bank account", "Registration at nearest mandi"],
        "portal": "https://enam.gov.in", "state": "Central",
    },
    {
        "id": 8, "name": "Pradhan Mantri Kaushal Vikas",
        "tag": "Free Training", "amount": "Free + ₹8,000 stipend",
        "desc": "Free agricultural skill training — organic farming, drip irrigation, food processing, etc.",
        "eligibility": "Farmers aged 18–45",
        "docs": ["Aadhaar", "Passport photo", "Class 10 certificate"],
        "portal": "https://pmkvyofficial.org", "state": "Central",
    },
]


@app.get("/schemes")
async def get_schemes(
    state:     str            = "Tamil Nadu",
    land_size: Optional[float]= None,
):
    """
    Returns all government schemes.
    Optionally filters by land size eligibility (e.g. land_size=3 returns small-farmer schemes).
    """
    results = [s for s in SCHEMES if s["state"] in ("Central", state)]
    if land_size is not None and land_size <= 5:
        # Small/marginal farmer — all schemes apply, just return all
        return results
    return results

# ══════════════════════════════════════════════════════════════════════════════
#  Entry point
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)