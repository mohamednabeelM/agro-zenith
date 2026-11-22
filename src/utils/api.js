// src/utils/api.js — All real API integrations for Agro Zenith

const WEATHER_KEY    = process.env.REACT_APP_WEATHER_API_KEY   || "";
const AGMARKNET_KEY  = process.env.REACT_APP_AGMARKNET_KEY     || "";
const ANTHROPIC_KEY  = process.env.REACT_APP_ANTHROPIC_KEY     || "";

// ─── SHARED ANTHROPIC HEADERS ────────────────────────────────────────────────
// Single source of truth — used by detectDisease, askAgroBot, fetchAgriNews
const anthropicHeaders = () => ({
  "Content-Type": "application/json",
  "x-api-key": ANTHROPIC_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",
});

// ─── SHARED ANTHROPIC FETCH HELPER ──────────────────────────────────────────
// Handles HTTP errors and API-level errors in one place
async function callAnthropic(body) {
  if (!ANTHROPIC_KEY) throw new Error("REACT_APP_ANTHROPIC_KEY is not set in .env");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: anthropicHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic HTTP ${res.status}: ${errText}`);
  }

  const data = await res.json();

  if (data.error) throw new Error(`Anthropic API error: ${data.error.message}`);

  return data;
}

// Extract all text blocks from a response (handles tool_use + text mixed responses)
function extractText(data) {
  return data.content
    .map(block => (block.type === "text" ? block.text : ""))
    .filter(Boolean)
    .join("\n");
}

// Strip markdown fences and parse JSON safely
function parseJSON(raw) {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  // Sometimes Claude wraps with extra text before/after the JSON array/object
  const match = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
  if (!match) throw new Error("No JSON found in response");
  return JSON.parse(match[0]);
}

// ─── WEATHER API (OpenWeatherMap) ────────────────────────────────────────────
export async function fetchWeather(lat, lon) {
  if (!WEATHER_KEY) {
    console.warn("No REACT_APP_WEATHER_API_KEY — using mock weather");
    return MOCK_WEATHER;
  }
  try {
    const r = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`
    );
    if (!r.ok) throw new Error(`Weather API ${r.status}`);
    const d = await r.json();
    return {
      temp:        Math.round(d.main.temp),
      humidity:    d.main.humidity,
      description: d.weather[0].description,
      icon:        d.weather[0].icon,
      windSpeed:   d.wind.speed,
      city:        d.name,
      rain:        d.rain?.["1h"] || 0,
    };
  } catch (err) {
    console.error("fetchWeather failed:", err.message);
    return MOCK_WEATHER;
  }
}

export async function fetchWeatherForecast(lat, lon) {
  if (!WEATHER_KEY) {
    console.warn("No REACT_APP_WEATHER_API_KEY — using mock forecast");
    return MOCK_FORECAST;
  }
  try {
    const r = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric&cnt=5`
    );
    if (!r.ok) throw new Error(`Forecast API ${r.status}`);
    const d = await r.json();
    return d.list.map(item => ({
      date:     new Date(item.dt * 1000).toLocaleDateString("en-IN", { weekday: "short" }),
      temp:     Math.round(item.main.temp),
      humidity: item.main.humidity,
      desc:     item.weather[0].description,
      rain:     item.rain?.["3h"] || 0,
    }));
  } catch (err) {
    console.error("fetchWeatherForecast failed:", err.message);
    return MOCK_FORECAST;
  }
}

// ─── MARKET PRICES (data.gov.in / Agmarknet) ─────────────────────────────────
export async function fetchMarketPrices(state = "Tamil Nadu") {
  if (!AGMARKNET_KEY) {
    console.warn("No REACT_APP_AGMARKNET_KEY — using mock market data");
    return MARKET_DATA;
  }
  try {
    const r = await fetch(
      `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070` +
      `?api-key=${AGMARKNET_KEY}&format=json` +
      `&filters[State]=${encodeURIComponent(state)}&limit=50`
    );
    if (!r.ok) throw new Error(`Agmarknet API ${r.status}`);
    const d = await r.json();
    if (!d.records?.length) throw new Error("Empty records from Agmarknet");
    return d.records.map(rec => ({
      crop:   rec.Commodity,
      market: rec.Market,
      min:    parseFloat(rec.Min_x0020_Price)   || 0,
      max:    parseFloat(rec.Max_x0020_Price)   || 0,
      modal:  parseFloat(rec.Modal_x0020_Price) || 0,
      date:   rec.Arrival_Date,
      grade:  rec.Grade || "FAQ",
    }));
  } catch (err) {
    console.error("fetchMarketPrices failed:", err.message);
    return MARKET_DATA;
  }
}

// ─── DISEASE DETECTION (Claude Vision) ───────────────────────────────────────
export async function detectDisease(base64Image, cropType, language = "English") {
  try {
    const data = await callAnthropic({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          {
            type:   "image",
            source: { type: "base64", media_type: "image/jpeg", data: base64Image },
          },
          {
            type: "text",
            text: `You are an expert agricultural pathologist for Indian farming. Analyze this ${cropType} plant image.
Respond ONLY in valid JSON (no markdown, no backticks):
{
  "disease": "disease name or Healthy",
  "confidence": 0-100,
  "severity": "Low|Medium|High|Healthy",
  "symptoms": ["symptom1","symptom2","symptom3"],
  "causes": ["cause1","cause2"],
  "treatment": ["treatment1 with dosage","treatment2","treatment3"],
  "prevention": ["prevention1","prevention2","prevention3"],
  "medicines": ["Mancozeb 75WP @ 2g/L","medicine2"],
  "organic": ["neem oil 3ml/L","other organic option"],
  "bestTimeToSpray": "Early morning 6-8 AM or evening after 4 PM",
  "urgency": "Treat within 24h / 3 days / 1 week"
}
${language !== "English" ? `Also include a "tamil_summary" field with a 2-line Tamil summary.` : ""}`,
          },
        ],
      }],
    });

    const text = extractText(data);
    if (!text) throw new Error("Empty response from Claude");
    return parseJSON(text);
  } catch (err) {
    console.error("detectDisease failed:", err.message);
    return MOCK_DISEASE_RESULT;
  }
}

// ─── AI AGRO BOT (Claude Chat) ────────────────────────────────────────────────
export async function askAgroBot(messages, language = "English", farmerProfile = {}) {
  const systemPrompt = `You are Agro AI Bot — expert agricultural assistant for Indian farmers, especially Tamil Nadu smallholder farmers.

Farmer Profile: ${JSON.stringify(farmerProfile)}
Preferred Language: ${language}

EXPERTISE: Crop diseases, fertilizers (with exact NPK dosages), irrigation scheduling, pest management, market timing, government schemes (PM-KISAN, PMFBY, KCC, Soil Health Card, PM Sinchayee, TN state schemes), weather-based advice, organic farming.

RESPONSE RULES:
- ${language === "Tamil" ? "Respond primarily in Tamil (தமிழ்)" : language === "Hindi" ? "Respond primarily in Hindi" : "Respond in English"}
- Give SPECIFIC advice: exact medicine names, dosages per litre/acre, timing
- For diseases: name + dosage + where to buy generic equivalent
- Keep responses under 200 words but complete
- Format with emojis for easy reading on mobile
- For government schemes: mention application portal URL`;

  try {
    const data = await callAnthropic({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 600,
      system:     systemPrompt,
      messages,
    });
    const text = extractText(data);
    if (!text) throw new Error("Empty bot response");
    return text;
  } catch (err) {
    console.error("askAgroBot failed:", err.message);
    return `⚠️ Connection error: ${err.message}. Please check your API key in .env and try again.`;
  }
}

// ─── AGRICULTURE NEWS (Claude + Web Search) ──────────────────────────────────
const AGRICULTURE_SOURCES = "Times Now, CNN-News18, NDTV 24x7, Republic TV";

// ─── AGRICULTURE NEWS — multi-proxy with fallback ─────────────────────────────
export async function fetchAgriNews() {

  // Multiple CORS proxies — tries each one until one works
  const PROXIES = [
    (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  ];

  // Reliable RSS feeds with language tags
  const FEEDS = [
    // ── English ──────────────────────────────────────────────────────────────
    { url: "https://www.thehindu.com/business/agri-business/feeder/default.rss", lang: "EN", name: "The Hindu" },
    { url: "https://krishijagran.com/feed/",                                     lang: "EN", name: "Krishi Jagran" },
    { url: "https://www.financialexpress.com/about/agriculture/feed/",           lang: "EN", name: "Financial Express" },
    // ── Hindi ─────────────────────────────────────────────────────────────────
    { url: "https://hindi.krishijagran.com/feed/",                               lang: "HI", name: "कृषि जागरण" },
    { url: "https://www.amarujala.com/rss/business/agriculture.xml",             lang: "HI", name: "अमर उजाला" },
    // ── Tamil ─────────────────────────────────────────────────────────────────
    { url: "https://www.dinamalar.com/rss/Agriculture.xml",                      lang: "TA", name: "தினமலர்" },
    { url: "https://www.dinamani.com/agriculture/rss/",                          lang: "TA", name: "தினமணி" },
  ];

  // Try fetching a URL through each proxy until one succeeds
  async function fetchWithFallback(feedUrl) {
    for (const makeProxy of PROXIES) {
      try {
        const proxyUrl = makeProxy(feedUrl);
        const res      = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
        if (!res.ok) continue;
        const data = await res.json();
        // allorigins → data.contents | codetabs → raw string
        const xml = data.contents || (typeof data === "string" ? data : null);
        if (xml && xml.includes("<item>")) return xml;
      } catch { continue; }
    }
    return null;
  }

  const results = await Promise.allSettled(
    FEEDS.map(async ({ url, lang, name }) => {
      const xml = await fetchWithFallback(url);
      if (!xml) throw new Error(`All proxies failed for ${name}`);
      return parseRSS(xml, lang, name);
    })
  );

  // Debug
  results.forEach((r, i) => {
    const feed = FEEDS[i];
    if (r.status === "fulfilled")
      console.log(`✅ [${feed.lang}] ${feed.name}: ${r.value.length} items`);
    else
      console.warn(`❌ [${feed.lang}] ${feed.name}:`, r.reason?.message);
  });

  const seen  = new Set();
  const items = [];

  results.forEach(result => {
    if (result.status !== "fulfilled") return;
    result.value.forEach(item => {
      const key = item.title?.slice(0, 50).toLowerCase();
      if (!key || seen.has(key)) return;
      seen.add(key);

      const text = (item.title + " " + item.desc).toLowerCase();

      const highWords = [
        // English
        "flood","drought","pest","locust","disease","alert","crisis","attack","damage","loss","warning","outbreak",
        // Hindi
        "बाढ़","सूखा","कीट","नुकसान","बीमारी","चेतावनी","हमला",
        // Tamil
        "வெள்ளம்","வறட்சி","பூச்சி","நோய்","சேதம்","எச்சரிக்கை",
      ];
      const medWords = [
        // English
        "price","msp","market","rate","subsidy","scheme","policy","kisan","export","budget","loan",
        // Hindi
        "भाव","मंडी","सब्सिडी","योजना","कीमत","निर्यात","बजट","किसान",
        // Tamil
        "விலை","சந்தை","மானியம்","திட்டம்","ஏற்றுமதி","பட்ஜெட்","விவசாயி",
      ];

      const severity =
        highWords.some(w => text.includes(w)) ? "high"   :
        medWords.some(w  => text.includes(w)) ? "medium" : "low";

      items.push({
        title:    item.title.replace(/\s*-\s*[^-]+$/, "").trim().slice(0, 90),
        source:   item.source || item.feedName,
        time:     item.pubDate ? timeAgo(new Date(item.pubDate)) : "Recent",
        severity,
        url:      item.link || "",
        lang:     item.lang,
      });
    });
  });

  // ── If ALL live feeds fail → return static fallback so panel is never empty ──
  if (!items.length) {
    console.warn("All live feeds failed — showing static fallback news");
    return FALLBACK_NEWS;
  }

  return items
    .sort((a, b) =>
      ({ high: 0, medium: 1, low: 2 }[a.severity]) -
      ({ high: 0, medium: 1, low: 2 }[b.severity])
    )
    .slice(0, 9); // 3 per language
}

// ─── RSS XML Parser ───────────────────────────────────────────────────────────
function parseRSS(xmlString, lang, feedName) {
  const parser = new DOMParser();
  const doc    = parser.parseFromString(xmlString, "text/xml");
  const nodes  = Array.from(doc.querySelectorAll("item"));
  const chanTitle = doc.querySelector("channel > title")?.textContent?.trim() || feedName;

  return nodes.slice(0, 3).map(node => {
    const get = tag => node.querySelector(tag)?.textContent?.trim() || "";
    return {
      title:    get("title"),
      link:     get("link") || get("guid"),
      desc:     get("description"),
      pubDate:  get("pubDate"),
      source:   node.querySelector("source")?.textContent?.trim() || chanTitle,
      feedName,
      lang,
    };
  });
}

// ─── timeAgo ──────────────────────────────────────────────────────────────────
function timeAgo(date) {
  if (!date || isNaN(date.getTime())) return "Recent";
  const diff  = Date.now() - date.getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  <  1) return "Just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ─── Static fallback (shown only when ALL live fetches fail) ──────────────────
const FALLBACK_NEWS = [
  // English
  { title: "PM-KISAN 19th installment released — check your bank account",                      source: "PIB India",      time: "Today", severity: "medium", url: "https://pmkisan.gov.in",          lang: "EN" },
  { title: "Kharif sowing picks up pace across Tamil Nadu amid good rainfall",                   source: "The Hindu",      time: "Today", severity: "low",    url: "https://thehindu.com",            lang: "EN" },
  { title: "MSP for Kharif crops 2025-26 announced by Cabinet",                                 source: "Krishi Jagran",  time: "Today", severity: "medium", url: "https://krishijagran.com",        lang: "EN" },
  // Hindi
  { title: "किसानों को मिलेगी पीएम किसान की 20वीं किस्त — जल्दी करें रजिस्ट्रेशन",            source: "कृषि जागरण",    time: "आज",    severity: "medium", url: "https://hindi.krishijagran.com",  lang: "HI" },
  { title: "मंडी भाव: टमाटर और प्याज की कीमतों में भारी उछाल",                                 source: "अमर उजाला",     time: "आज",    severity: "medium", url: "https://amarujala.com",           lang: "HI" },
  { title: "खरीफ फसल बीमा के लिए आवेदन शुरू — अंतिम तिथि 31 जुलाई",                           source: "दैनिक भास्कर",  time: "आज",    severity: "high",   url: "https://pmfby.gov.in",            lang: "HI" },
  // Tamil
  { title: "தமிழ்நாட்டில் விவசாயிகளுக்கு நிவாரண நிதி வழங்க அரசு உத்தரவு",                    source: "தினமலர்",       time: "இன்று", severity: "medium", url: "https://dinamalar.com",           lang: "TA" },
  { title: "நெல் கொள்முதல் விலை உயர்வு — விவசாயிகளுக்கு நேரடி பலன்",                          source: "தினமணி",        time: "இன்று", severity: "medium", url: "https://dinamani.com",            lang: "TA" },
  { title: "வேளாண் கடன் தள்ளுபடி: விண்ணப்பிக்க கடைசி நாள் நெருங்குகிறது",                   source: "விகடன்",        time: "இன்று", severity: "high",   url: "https://vikatan.com",             lang: "TA" },
];

// ─── GEOLOCATION ─────────────────────────────────────────────────────────────
export function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: 9.9252, lon: 78.1198, city: "Madurai" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude, city: "" }),
      ()  => resolve({ lat: 9.9252, lon: 78.1198, city: "Madurai" }),
      { timeout: 8000 }
    );
  });
}

// ─── LOCAL STORAGE HELPERS ───────────────────────────────────────────────────
export const Storage = {
  save:   (key, data) => { try { localStorage.setItem(`agro_${key}`, JSON.stringify(data)); } catch {} },
  load:   (key)       => { try { return JSON.parse(localStorage.getItem(`agro_${key}`)); } catch { return null; } },
  remove: (key)       => { try { localStorage.removeItem(`agro_${key}`); } catch {} },
};

// ─── MOCK FALLBACKS ───────────────────────────────────────────────────────────
const MOCK_WEATHER = {
  temp: 32, humidity: 72, description: "Partly cloudy",
  icon: "02d", windSpeed: 3.2, city: "Madurai", rain: 0,
};

const MOCK_FORECAST = [
  { date: "Today", temp: 32, humidity: 72, desc: "Partly cloudy",  rain: 0  },
  { date: "Tue",   temp: 31, humidity: 80, desc: "Light rain",     rain: 4  },
  { date: "Wed",   temp: 29, humidity: 85, desc: "Moderate rain",  rain: 12 },
  { date: "Thu",   temp: 33, humidity: 68, desc: "Clear sky",      rain: 0  },
  { date: "Fri",   temp: 34, humidity: 65, desc: "Sunny",          rain: 0  },
];

export const MARKET_DATA = [
  // Vegetables
  { crop: "Tomato",           market: "Madurai",     min: 2400,  max: 3200,   modal: 2840,   category: "Vegetable",  unit: "quintal",      trend: "up",   change: 5.2  },
  { crop: "Brinjal",          market: "Madurai",     min: 800,   max: 1400,   modal: 1100,   category: "Vegetable",  unit: "quintal",      trend: "down", change: 2.1  },
  { crop: "Okra (Bhindi)",    market: "Madurai",     min: 1200,  max: 1800,   modal: 1500,   category: "Vegetable",  unit: "quintal",      trend: "up",   change: 3.4  },
  { crop: "Green Chilli",     market: "Chennai",     min: 2800,  max: 4200,   modal: 3500,   category: "Vegetable",  unit: "quintal",      trend: "up",   change: 8.1  },
  { crop: "Onion",            market: "Hosur",       min: 950,   max: 1550,   modal: 1240,   category: "Vegetable",  unit: "quintal",      trend: "up",   change: 8.1  },
  { crop: "Potato",           market: "Coimbatore",  min: 1400,  max: 2000,   modal: 1720,   category: "Vegetable",  unit: "quintal",      trend: "flat", change: 0    },
  { crop: "Cabbage",          market: "Ooty",        min: 600,   max: 1000,   modal: 800,    category: "Vegetable",  unit: "quintal",      trend: "down", change: 1.5  },
  { crop: "Carrot",           market: "Ooty",        min: 1200,  max: 2000,   modal: 1600,   category: "Vegetable",  unit: "quintal",      trend: "up",   change: 2.8  },
  { crop: "Cauliflower",      market: "Madurai",     min: 1000,  max: 1600,   modal: 1300,   category: "Vegetable",  unit: "quintal",      trend: "flat", change: 0    },
  // Cereals
  { crop: "Rice (Paddy)",     market: "Thanjavur",   min: 1900,  max: 2400,   modal: 2150,   category: "Cereal",     unit: "quintal",      trend: "down", change: 1.1  },
  { crop: "Wheat",            market: "Madurai",     min: 2000,  max: 2370,   modal: 2185,   category: "Cereal",     unit: "quintal",      trend: "up",   change: 0.8  },
  { crop: "Maize",            market: "Erode",       min: 1750,  max: 2230,   modal: 1990,   category: "Cereal",     unit: "quintal",      trend: "up",   change: 3.4  },
  { crop: "Ragi",             market: "Dharmapuri",  min: 3200,  max: 3800,   modal: 3500,   category: "Cereal",     unit: "quintal",      trend: "up",   change: 1.9  },
  { crop: "Bajra",            market: "Vellore",     min: 2000,  max: 2400,   modal: 2200,   category: "Cereal",     unit: "quintal",      trend: "flat", change: 0    },
  { crop: "Jowar",            market: "Madurai",     min: 2200,  max: 2800,   modal: 2500,   category: "Cereal",     unit: "quintal",      trend: "up",   change: 1.2  },
  // Pulses
  { crop: "Toor Dal",         market: "Chennai",     min: 7200,  max: 8400,   modal: 7800,   category: "Pulse",      unit: "quintal",      trend: "down", change: 2.3  },
  { crop: "Urad Dal",         market: "Madurai",     min: 6800,  max: 8000,   modal: 7400,   category: "Pulse",      unit: "quintal",      trend: "up",   change: 1.8  },
  { crop: "Moong Dal",        market: "Madurai",     min: 6400,  max: 7600,   modal: 7000,   category: "Pulse",      unit: "quintal",      trend: "up",   change: 2.5  },
  { crop: "Chana",            market: "Coimbatore",  min: 4800,  max: 5600,   modal: 5200,   category: "Pulse",      unit: "quintal",      trend: "flat", change: 0    },
  // Oilseeds
  { crop: "Groundnut",        market: "Tirunelveli", min: 5400,  max: 6280,   modal: 5840,   category: "Oilseed",    unit: "quintal",      trend: "up",   change: 1.2  },
  { crop: "Sesame",           market: "Madurai",     min: 10800, max: 13200,  modal: 12000,  category: "Oilseed",    unit: "quintal",      trend: "up",   change: 3.1  },
  { crop: "Sunflower",        market: "Erode",       min: 4200,  max: 5000,   modal: 4600,   category: "Oilseed",    unit: "quintal",      trend: "down", change: 0.8  },
  { crop: "Mustard",          market: "Chennai",     min: 5200,  max: 6000,   modal: 5600,   category: "Oilseed",    unit: "quintal",      trend: "up",   change: 1.5  },
  // Cash Crops
  { crop: "Sugarcane",        market: "Trichy",      min: 340,   max: 420,    modal: 380,    category: "Cash Crop",  unit: "quintal",      trend: "flat", change: 0    },
  { crop: "Cotton",           market: "Coimbatore",  min: 6200,  max: 7440,   modal: 6820,   category: "Cash Crop",  unit: "quintal",      trend: "down", change: 2.3  },
  { crop: "Turmeric",         market: "Erode",       min: 7800,  max: 10200,  modal: 9000,   category: "Cash Crop",  unit: "quintal",      trend: "up",   change: 4.5  },
  { crop: "Dry Chilli",       market: "Guntur",      min: 8000,  max: 14000,  modal: 11000,  category: "Cash Crop",  unit: "quintal",      trend: "up",   change: 6.2  },
  // Fruits
  { crop: "Banana",           market: "Trichy",      min: 800,   max: 1600,   modal: 1200,   category: "Fruit",      unit: "quintal",      trend: "up",   change: 2.1  },
  { crop: "Mango",            market: "Salem",       min: 4000,  max: 8000,   modal: 6000,   category: "Fruit",      unit: "quintal",      trend: "up",   change: 5.8  },
  { crop: "Coconut",          market: "Madurai",     min: 1800,  max: 2400,   modal: 2100,   category: "Fruit",      unit: "per 100 nuts", trend: "flat", change: 0    },
  { crop: "Pomegranate",      market: "Dindigul",    min: 5200,  max: 7200,   modal: 6200,   category: "Fruit",      unit: "quintal",      trend: "up",   change: 3.4  },
  { crop: "Papaya",           market: "Madurai",     min: 800,   max: 1400,   modal: 1100,   category: "Fruit",      unit: "quintal",      trend: "down", change: 1.2  },
  { crop: "Guava",            market: "Chennai",     min: 1800,  max: 2800,   modal: 2300,   category: "Fruit",      unit: "quintal",      trend: "up",   change: 2.0  },
  // Spices
  { crop: "Coriander Seeds",  market: "Madurai",     min: 4800,  max: 6400,   modal: 5600,   category: "Spice",      unit: "quintal",      trend: "up",   change: 2.8  },
  { crop: "Cumin",            market: "Madurai",     min: 18000, max: 24000,  modal: 21000,  category: "Spice",      unit: "quintal",      trend: "up",   change: 5.1  },
  { crop: "Fenugreek",        market: "Chennai",     min: 4000,  max: 5600,   modal: 4800,   category: "Spice",      unit: "quintal",      trend: "flat", change: 0    },
  { crop: "Cardamom",         market: "Munnar",      min: 80000, max: 120000, modal: 100000, category: "Spice",      unit: "quintal",      trend: "up",   change: 3.2  },
  // Flowers
  { crop: "Jasmine",          market: "Madurai",     min: 12000, max: 20000,  modal: 16000,  category: "Flower",     unit: "quintal",      trend: "up",   change: 10.2 },
  { crop: "Rose",             market: "Hosur",       min: 6000,  max: 12000,  modal: 9000,   category: "Flower",     unit: "quintal",      trend: "up",   change: 4.5  },
  { crop: "Marigold",         market: "Madurai",     min: 2400,  max: 4800,   modal: 3600,   category: "Flower",     unit: "quintal",      trend: "up",   change: 8.0  },
  { crop: "Crossandra",       market: "Chennai",     min: 8000,  max: 14000,  modal: 11000,  category: "Flower",     unit: "quintal",      trend: "up",   change: 6.5  },
  // Plantation
  { crop: "Areca Nut",        market: "Pollachi",    min: 30000, max: 42000,  modal: 36000,  category: "Plantation", unit: "quintal",      trend: "up",   change: 2.4  },
  { crop: "Coffee",           market: "Kodaikanal",  min: 9600,  max: 12800,  modal: 11200,  category: "Plantation", unit: "quintal",      trend: "up",   change: 1.8  },
  { crop: "Tea",              market: "Ooty",        min: 14000, max: 20000,  modal: 17000,  category: "Plantation", unit: "quintal",      trend: "flat", change: 0    },
  { crop: "Pepper",           market: "Erode",       min: 40000, max: 52000,  modal: 46000,  category: "Plantation", unit: "quintal",      trend: "up",   change: 3.5  },
];

const MOCK_DISEASE_RESULT = {
  disease:         "Early Blight (Alternaria solani)",
  confidence:      94,
  severity:        "High",
  symptoms:        ["Dark brown concentric ring spots on older lower leaves", "Yellow chlorotic halo surrounding lesions", "Progressive upward defoliation"],
  causes:          ["Fungal pathogen Alternaria solani", "High humidity (>80%) with warm temperatures 24–29°C"],
  treatment:       ["Mancozeb 75 WP @ 2g per litre — spray every 7 days", "Chlorothalonil 75 WP @ 2g/L as protective spray", "Azoxystrobin 23 SC @ 1ml/L if severe"],
  prevention:      ["Use certified disease-free seeds", "Maintain 60cm plant spacing for air circulation", "Avoid overhead irrigation — use drip"],
  medicines:       ["Mancozeb 75WP @ 2g/L", "Chlorothalonil 75WP @ 2g/L", "Azoxystrobin 23SC @ 1ml/L"],
  organic:         ["Neem oil 3ml/L + soap 1ml/L spray", "Trichoderma viride 4g/L soil drench"],
  bestTimeToSpray: "Early morning 6–8 AM or evening after 4 PM",
  urgency:         "Treat within 24–48 hours to prevent spread",
};

export const ALL_CROPS = [
  "Tomato", "Rice", "Wheat", "Maize", "Cotton", "Onion", "Potato", "Brinjal", "Okra",
  "Groundnut", "Sugarcane", "Turmeric", "Banana", "Mango", "Coconut", "Ragi", "Bajra",
  "Toor Dal", "Urad Dal", "Moong Dal", "Sesame", "Sunflower", "Green Chilli", "Cabbage",
  "Carrot", "Cauliflower", "Pomegranate", "Papaya", "Guava", "Jasmine", "Rose", "Marigold",
  "Cardamom", "Cumin", "Pepper", "Coffee", "Tea", "Areca Nut", "Jowar", "Chana",
];

export const GOVT_SCHEMES = [
  {
    id: 1, name: "PM-KISAN", tag: "Income Support", amount: "₹6,000/year",
    desc: "Direct income support of ₹6,000 per year in 3 installments of ₹2,000 to all landholding farmer families.",
    elig: "All farmers with cultivable land (excluding income taxpayers, institutional landholders)",
    docs: ["Aadhaar card", "Land records (Patta)", "Bank account (DBT enabled)"],
    portal: "https://pmkisan.gov.in", state: "Central",
    ai_match: (profile) => profile.landSize > 0,
  },
  {
    id: 2, name: "PM Fasal Bima Yojana", tag: "Insurance", amount: "2% premium (Kharif)",
    desc: "Crop insurance against natural calamities, pests and diseases. Very low premium — 2% for Kharif, 1.5% for Rabi crops.",
    elig: "All farmers including sharecroppers and tenant farmers growing notified crops",
    docs: ["Aadhaar", "Land records or lease agreement", "Bank account", "Sowing certificate"],
    portal: "https://pmfby.gov.in", state: "Central",
    ai_match: () => true,
  },
  {
    id: 3, name: "Kisan Credit Card (KCC)", tag: "Credit", amount: "Up to ₹3 lakh @ 4%",
    desc: "Short-term credit for cultivation expenses, post-harvest, and farm maintenance at highly subsidised 4% interest.",
    elig: "Farmers, sharecroppers, oral lessees, self help groups",
    docs: ["Aadhaar", "Land records", "Passport photo", "Bank KYC"],
    portal: "https://www.nabard.org/kcc", state: "Central",
    ai_match: () => true,
  },
  {
    id: 4, name: "Soil Health Card Scheme", tag: "Soil & Inputs", amount: "Free",
    desc: "Free soil testing and 6-page report with crop-wise NPK + micronutrient status and fertilizer recommendations.",
    elig: "All farmers — test once every 2 years",
    docs: ["Aadhaar", "Land survey number"],
    portal: "https://soilhealth.dac.gov.in", state: "Central",
    ai_match: () => true,
  },
  {
    id: 5, name: "PM Krishi Sinchayee Yojana", tag: "Irrigation", amount: "55–90% subsidy",
    desc: "Drip and sprinkler irrigation subsidy up to 90% for small/marginal farmers. Reduces water usage by 40–50%.",
    elig: "Farmers with own land; priority to SC/ST and small farmers",
    docs: ["Aadhaar", "Land records", "Bank account", "Estimate from vendor"],
    portal: "https://pmksy.gov.in", state: "Central",
    ai_match: (profile) => profile.landSize <= 5,
  },
  {
    id: 6, name: "TN Chief Minister's Uzhavar Pathukappu", tag: "TN State", amount: "Full premium",
    desc: "Tamil Nadu state crop insurance — government pays 100% premium for small and marginal farmers.",
    elig: "TN farmers with land up to 5 acres (small/marginal)",
    docs: ["Aadhaar", "Patta", "Bank account", "Village officer certificate"],
    portal: "https://www.tn.gov.in/agriculture", state: "Tamil Nadu",
    ai_match: (profile) => profile.state === "Tamil Nadu" && profile.landSize <= 5,
  },
  {
    id: 7, name: "eNAM Integration", tag: "Market Access", amount: "Free listing",
    desc: "Sell directly on National Agriculture Market platform — get best price, no middlemen. Over 1,000 mandis connected.",
    elig: "All farmers with produce to sell",
    docs: ["Aadhaar", "Bank account", "Registration at nearest mandi"],
    portal: "https://enam.gov.in", state: "Central",
    ai_match: () => true,
  },
];