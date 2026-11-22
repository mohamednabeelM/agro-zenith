// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import C from "../constants/colors";
import Card from "../components/ui/Card";
import TrendPill from "../components/ui/TrendPill";
import { generateMarketPrices } from "../utils/marketData";

// ── Inline translations (no i18n dependency) ──────────────────────────────────
const STRINGS = {
  en: {
    greeting:        "Welcome",
    district:        "Tamil Nadu",
    humidity:        "humidity",
    confluenceScore: "Confluence Score",
    mediumRisk:      "Medium Risk",
    activeAlerts:    "Active Alerts",
    highPriority:    "2 High Priority",
    cropsTracked:    "Crops Tracked",
    registered:      "Registered",
    farmPlots:       "Farm Plots",
    mappedGPS:       "Mapped on GPS",
    alertsTitle:     "Active Farm Alerts",
    riskAnalysis:    "Risk Analysis",
    weatherRisk:     "Weather Risk",
    diseasePressure: "Disease Pressure",
    soilHealth:      "Soil Health",
    pestAlert:       "Pest Alert",
    todayMarket:     "Today's Market Highlights",
    viewAll:         "View All",
    quickActions:    "Quick Actions",
    yourCrops:       "Your Crops",
    ago:             "ago",
    bot:             "AI Agro Bot",
    botSub:          "Ask anything",
    disease:         "Disease Detect",
    diseaseSub:      "Upload photo",
    map:             "Farm Map",
    mapSub:          "View land",
    market:          "Market Prices",
    marketSub:       "Live rates",
    alerts: [
      "Pest: Fall Armyworm spotted in Dindigul — check maize immediately",
      "High humidity next 48hrs — blight risk HIGH for tomato & chilli",
      "PM-KISAN 19th installment released — check your bank account",
    ],
  },
  ta: {
    greeting:        "வணக்கம்",
    district:        "தமிழ்நாடு",
    humidity:        "ஈரப்பதம்",
    confluenceScore: "ஒருங்கிணைப்பு மதிப்பெண்",
    mediumRisk:      "நடுத்தர ஆபத்து",
    activeAlerts:    "செயலில் உள்ள எச்சரிக்கைகள்",
    highPriority:    "2 அதிக முன்னுரிமை",
    cropsTracked:    "கண்காணிக்கப்படும் பயிர்கள்",
    registered:      "பதிவு செய்யப்பட்டது",
    farmPlots:       "வயல் பிரிவுகள்",
    mappedGPS:       "GPS-ல் வரைபடமிடப்பட்டது",
    alertsTitle:     "செயலில் உள்ள வேளாண் எச்சரிக்கைகள்",
    riskAnalysis:    "ஆபத்து பகுப்பாய்வு",
    weatherRisk:     "வானிலை ஆபத்து",
    diseasePressure: "நோய் அழுத்தம்",
    soilHealth:      "மண் ஆரோக்கியம்",
    pestAlert:       "பூச்சி எச்சரிக்கை",
    todayMarket:     "இன்றைய சந்தை சிறப்பம்சங்கள்",
    viewAll:         "அனைத்தும் காண்க",
    quickActions:    "விரைவு செயல்கள்",
    yourCrops:       "உங்கள் பயிர்கள்",
    ago:             "முன்பு",
    bot:             "AI வேளாண் உதவியாளர்",
    botSub:          "எதையும் கேளுங்கள்",
    disease:         "நோய் கண்டறிதல்",
    diseaseSub:      "புகைப்படம் பதிவேற்றுக",
    map:             "வயல் வரைபடம்",
    mapSub:          "நிலத்தை பார்க்க",
    market:          "சந்தை விலைகள்",
    marketSub:       "நேரடி விலைகள்",
    alerts: [
      "பூச்சி: டிண்டுக்கல்லில் Fall Armyworm கண்டறியப்பட்டது — மக்காச்சோளத்தை உடனே சோதிக்கவும்",
      "அடுத்த 48 மணிநேரம் அதிக ஈரப்பதம் — தக்காளி & மிளகாய்க்கு blight ஆபத்து அதிகம்",
      "PM-KISAN 19வது தவணை வெளியிடப்பட்டது — உங்கள் வங்கி கணக்கை சரிபாருங்கள்",
    ],
  },
  hi: {
    greeting:        "स्वागत है",
    district:        "तमिलनाडु",
    humidity:        "आर्द्रता",
    confluenceScore: "संगम स्कोर",
    mediumRisk:      "मध्यम जोखिम",
    activeAlerts:    "सक्रिय अलर्ट",
    highPriority:    "2 उच्च प्राथमिकता",
    cropsTracked:    "ट्रैक की गई फसलें",
    registered:      "पंजीकृत",
    farmPlots:       "खेत के भूखंड",
    mappedGPS:       "GPS पर मैप किया गया",
    alertsTitle:     "सक्रिय कृषि अलर्ट",
    riskAnalysis:    "जोखिम विश्लेषण",
    weatherRisk:     "मौसम जोखिम",
    diseasePressure: "रोग दबाव",
    soilHealth:      "मिट्टी स्वास्थ्य",
    pestAlert:       "कीट अलर्ट",
    todayMarket:     "आज की बाजार हाइलाइट्स",
    viewAll:         "सब देखें",
    quickActions:    "त्वरित क्रियाएं",
    yourCrops:       "आपकी फसलें",
    ago:             "पहले",
    bot:             "AI कृषि सहायक",
    botSub:          "कुछ भी पूछें",
    disease:         "रोग पहचान",
    diseaseSub:      "फोटो अपलोड करें",
    map:             "खेत का नक्शा",
    mapSub:          "जमीन देखें",
    market:          "बाजार भाव",
    marketSub:       "लाइव दरें",
    alerts: [
      "कीट: डिंडीगुल में Fall Armyworm मिला — मक्का तुरंत जांचें",
      "अगले 48 घंटे अधिक नमी — टमाटर और मिर्च में blight का खतरा अधिक",
      "PM-KISAN 19वीं किस्त जारी — अपना बैंक खाता जांचें",
    ],
  },
};

function Dashboard({ user, setPage, t, lang }) {
  // ── Pick language strings ──────────────────────────────────────────────────
  const S = STRINGS[lang] || STRINGS.en;

  const [weather, setWeather] = useState({
    temp: 32, humidity: 72,
    description: lang === "ta" ? "பகுதியளவு மேகமூட்டம்" : lang === "hi" ? "आंशिक बादल" : "Partly cloudy",
    icon: "⛅",
    city: user.district || "",
    windSpeed: 3.2, rain: 0,
  });

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        try {
          const [weatherRes, geoRes] = await Promise.all([
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
              `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation`
            ),
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`),
          ]);
          const w = await weatherRes.json();
          const g = await geoRes.json();
          const cur = w.current;

          // Weather descriptions per language
          const getWeatherMeta = (code, temp) => {
            const descs = {
              en: ["Clear sky","Mostly clear","Overcast","Foggy","Drizzle","Rainy","Snowy","Showers","Thunderstorm","Unknown"],
              ta: ["தெளிவான வானம்","பெரும்பாலும் தெளிவான","மேகமூட்டம்","மூடுபனி","தூறல்","மழை","பனி","சாரல்","இடிமழை","தெரியவில்லை"],
              hi: ["साफ आसमान","ज्यादातर साफ","흐림","कोहरा","बूंदाबांदी","बारिश","बर्फ","बौछारें","तूफान","अज्ञात"],
            };
            const d = descs[lang] || descs.en;
            if (code === 0)  return { desc: d[0], icon: temp >= 30 ? "☀️" : "🌙" };
            if (code <= 2)   return { desc: d[1], icon: "🌤️" };
            if (code === 3)  return { desc: d[2], icon: "☁️" };
            if (code <= 49)  return { desc: d[3], icon: "🌫️" };
            if (code <= 55)  return { desc: d[4], icon: "🌦️" };
            if (code <= 67)  return { desc: d[5], icon: "🌧️" };
            if (code <= 77)  return { desc: d[6], icon: "❄️" };
            if (code <= 82)  return { desc: d[7], icon: "🌨️" };
            if (code <= 99)  return { desc: d[8], icon: "⛈️" };
            return               { desc: d[9], icon: "🌡️" };
          };

          const { desc, icon } = getWeatherMeta(cur.weather_code, cur.temperature_2m);
          setWeather({
            temp:        Math.round(cur.temperature_2m),
            humidity:    cur.relative_humidity_2m,
            description: desc,
            icon,
            city:        g.address?.city || g.address?.town || g.address?.village || user.district,
            windSpeed:   cur.wind_speed_10m,
            rain:        cur.precipitation ?? 0,
          });
        } catch (err) {
          console.warn("Weather fetch failed:", err);
        }
      },
      () => console.warn("Geolocation denied — using defaults")
    );
  }, [lang]);

  // ── Market data from local generator ─────────────────────────────────────
  const marketHighlights = generateMarketPrices(user.district || "Madurai", user.district || "Madurai")
    .filter(p => p.trend !== "flat")
    .slice(0, 6);

  // ── Data ──────────────────────────────────────────────────────────────────
  const alerts = [
    { type: "danger",  msg: S.alerts[0], time: `2h ${S.ago}` },
    { type: "warning", msg: S.alerts[1], time: `5h ${S.ago}` },
    { type: "success", msg: S.alerts[2], time: `1d ${S.ago}` },
  ];

  const bars = [
    { label: S.weatherRisk,     val: 65, c: C.orange },
    { label: S.diseasePressure, val: 78, c: C.red    },
    { label: S.soilHealth,      val: 82, c: C.bg2    },
    { label: S.pestAlert,       val: 55, c: C.amber  },
  ];

  const quickActions = [
    { icon: "🤖", label: S.bot,     sub: S.botSub,     page: "bot",     bg: `linear-gradient(135deg,${C.bg1},${C.dark})`         },
    { icon: "🔬", label: S.disease, sub: S.diseaseSub, page: "disease", bg: "linear-gradient(135deg,#1a5090,#0d2d5e)"            },
    { icon: "🗺️", label: S.map,     sub: S.mapSub,     page: "map",     bg: "linear-gradient(135deg,#1a5a40,#0a2e1e)"            },
    { icon: "📈", label: S.market,  sub: S.marketSub,  page: "market",  bg: "linear-gradient(135deg,#8a4a10,#4a2408)"            },
    { icon: "🌾", label: lang === "ta" ? "பயிர் சந்தை" : lang === "hi" ? "फसल बाज़ार" : "Marketplace", sub: lang === "ta" ? "விற்க/வாங்க" : lang === "hi" ? "खरीदें और बेचें" : "Buy & Sell crops", page: "marketplace", bg: "linear-gradient(135deg,#1c522f,#072412)" },
  ];

  return (
    <div style={{ padding: 22 }}>

      {/* ── Greeting ─────────────────────────────────────────────────────── */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
        👋 {S.greeting}, {user.name}!
      </h1>

      {/* ── Location + Weather ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>
          {user.district}, {S.district} • {new Date().toLocaleDateString(
            lang === "ta" ? "ta-IN" : lang === "hi" ? "hi-IN" : "en-IN",
            { day: "numeric", month: "long", year: "numeric" }
          )}
        </p>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>
            {weather.temp}°C {weather.icon}
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>
            {weather.humidity}% {S.humidity} • {weather.description}
          </div>
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
        {[
          { l: S.confluenceScore, v: "72%",                   s: S.mediumRisk,   c: C.orange },
          { l: S.activeAlerts,    v: "3",                     s: S.highPriority, c: C.red    },
          { l: S.cropsTracked,    v: user.crops?.length || 0, s: S.registered,   c: C.bg2    },
          { l: S.farmPlots,       v: user.farms?.length || 0, s: S.mappedGPS,    c: C.blue   },
        ].map(s => (
          <Card key={s.l} style={{ padding: "12px 14px" }}>
            <div style={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{s.l}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{s.s}</div>
          </Card>
        ))}
      </div>

      {/* ── Alerts + Risk ─────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 14, marginBottom: 14 }}>

        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>
            ⚠️ {S.alertsTitle}
          </div>
          {alerts.map((a, i) => (
            <div key={i} style={{
              display: "flex", gap: 9, padding: "8px 0",
              borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                background: a.type === "danger" ? C.red : a.type === "warning" ? C.orange : C.bg2,
              }} />
              <div>
                <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.4 }}>{a.msg}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>
            🎯 {S.riskAnalysis}
          </div>
          {bars.map(b => (
            <div key={b.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                <span style={{ color: C.text }}>{b.label}</span>
                <span style={{ color: b.c, fontWeight: 600 }}>{b.val}%</span>
              </div>
              <div style={{ height: 5, background: "#e0ead4", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${b.val}%`, background: b.c, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* ── Market Highlights ─────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
            📊 {S.todayMarket}
          </div>
          <button
            onClick={() => setPage("market")}
            style={{ fontSize: 12, color: C.bg2, background: "none", border: "none", cursor: "pointer" }}
          >
            {S.viewAll} →
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
          {marketHighlights.map((p, i) => (
            <div key={p.crop + i} style={{ textAlign: "center", padding: "10px 6px", background: C.bg, borderRadius: 8 }}>
              <div style={{ fontSize: 10.5, color: C.muted, marginBottom: 2 }}>{p.crop}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>₹{p.modal.toLocaleString()}</div>
              <TrendPill trend={p.trend} change={p.change} />
            </div>
          ))}
        </div>
      </Card>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>
        ⚡ {S.quickActions}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        {quickActions.map(c => (
          <div
            key={c.page}
            onClick={() => setPage(c.page)}
            style={{ background: c.bg, borderRadius: 12, padding: "16px 14px", cursor: "pointer" }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{c.label}</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{c.sub} →</div>
          </div>
        ))}
      </div>

      {/* ── Your Crops ───────────────────────────────────────────────────── */}
      {user.crops?.length > 0 && (
        <Card style={{ marginTop: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>
            🌾 {S.yourCrops}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {user.crops.map(c => (
              <span key={c} style={{
                padding: "5px 12px", background: C.pale, borderRadius: 16,
                fontSize: 12.5, color: C.bg2, border: `1px solid ${C.border}`,
              }}>
                {c}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export default Dashboard;