// src/pages/MarketPrices.jsx
// ✅ No API key • No CORS • No proxy • Works fully offline
// ✅ Full Tamil & Hindi translation support
// Prices change daily, district-wise variation, with day-over-day delta

import { useState, useMemo } from "react";
import C from "../constants/colors";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import TrendPill from "../components/ui/TrendPill";
import { generateMarketPrices, getTodayString } from "../utils/marketData";

// ── Inline Strings (en / ta / hi) ────────────────────────────────────────────
const STRINGS = {
  en: {
    title:       "Market Prices",
    subtitle:    "District-wise daily mandi prices",
    crops:       "crops",
    district:    "District",
    mandi:       "Mandi",
    rising:      "Rising",
    falling:     "Falling",
    unchanged:   "Unchanged",
    search:      "Search crop…",
    colCrop:     "Crop",
    colToday:    "₹/Kg (Today)",
    colYest:     "Yesterday",
    colChange:   "Change",
    colMinMax:   "Min / Max",
    colCat:      "Category",
    colTrend:    "Trend",
    noData:      "No crops found",
    aiTitle:     "💡 AI Market Intelligence",
    cats: ["All","Vegetable","Cereal","Pulse","Oilseed","Cash Crop","Fruit","Flower","Spice","Plantation"],
    catLabels: {
      All: "All", Vegetable: "Vegetable", Cereal: "Cereal",
      Pulse: "Pulse", Oilseed: "Oilseed", "Cash Crop": "Cash Crop",
      Fruit: "Fruit", Flower: "Flower", Spice: "Spice", Plantation: "Plantation",
    },
  },
  ta: {
    title:       "சந்தை விலைகள்",
    subtitle:    "மாவட்டம் வாரியான தினசரி மண்டி விலைகள்",
    crops:       "பயிர்கள்",
    district:    "மாவட்டம்",
    mandi:       "மண்டி",
    rising:      "உயர்கிறது",
    falling:     "குறைகிறது",
    unchanged:   "மாற்றமில்லை",
    search:      "பயிர் தேடுக…",
    colCrop:     "பயிர்",
    colToday:    "₹/கிலோ (இன்று)",
    colYest:     "நேற்று",
    colChange:   "மாற்றம்",
    colMinMax:   "குறை / அதிக",
    colCat:      "வகை",
    colTrend:    "போக்கு",
    noData:      "பயிர்கள் எதுவும் இல்லை",
    aiTitle:     "💡 AI சந்தை நுண்ணறிவு",
    cats: ["All","Vegetable","Cereal","Pulse","Oilseed","Cash Crop","Fruit","Flower","Spice","Plantation"],
    catLabels: {
      All: "அனைத்தும்", Vegetable: "காய்கறி", Cereal: "தானியம்",
      Pulse: "பருப்பு", Oilseed: "எண்ணெய் வித்து", "Cash Crop": "பணப்பயிர்",
      Fruit: "பழம்", Flower: "பூ", Spice: "மசாலா", Plantation: "தோட்டப்பயிர்",
    },
  },
  hi: {
    title:       "बाजार भाव",
    subtitle:    "जिलेवार दैनिक मंडी भाव",
    crops:       "फसलें",
    district:    "जिला",
    mandi:       "मंडी",
    rising:      "बढ़ रहा है",
    falling:     "घट रहा है",
    unchanged:   "अपरिवर्तित",
    search:      "फसल खोजें…",
    colCrop:     "फसल",
    colToday:    "₹/किलो (आज)",
    colYest:     "कल",
    colChange:   "बदलाव",
    colMinMax:   "न्यूनतम / अधिकतम",
    colCat:      "श्रेणी",
    colTrend:    "रुझान",
    noData:      "कोई फसल नहीं मिली",
    aiTitle:     "💡 AI बाजार बुद्धिमत्ता",
    cats: ["All","Vegetable","Cereal","Pulse","Oilseed","Cash Crop","Fruit","Flower","Spice","Plantation"],
    catLabels: {
      All: "सभी", Vegetable: "सब्जी", Cereal: "अनाज",
      Pulse: "दाल", Oilseed: "तिलहन", "Cash Crop": "नकदी फसल",
      Fruit: "फल", Flower: "फूल", Spice: "मसाला", Plantation: "बागान",
    },
  },
};

// ── Districts ─────────────────────────────────────────────────────────────────
const TN_DISTRICTS = [
  { district: "Chennai",          city: "Koyambedu",      mandi: "Koyambedu CMDA Market"         },
  { district: "Coimbatore",       city: "Coimbatore",     mandi: "Coimbatore Agricultural Market" },
  { district: "Madurai",          city: "Madurai",        mandi: "Mattuthavani Market"            },
  { district: "Salem",            city: "Salem",          mandi: "Salem Agricultural Market"      },
  { district: "Tiruchirappalli",  city: "Trichy",         mandi: "Ariyamangalam Market"           },
  { district: "Thanjavur",        city: "Thanjavur",      mandi: "Thanjavur Rice Market"          },
  { district: "Erode",            city: "Erode",          mandi: "Erode Agricultural Market"      },
  { district: "Tirunelveli",      city: "Tirunelveli",    mandi: "Tirunelveli Market"             },
  { district: "Vellore",          city: "Vellore",        mandi: "Vellore Market"                 },
  { district: "Tiruppur",         city: "Tiruppur",       mandi: "Tiruppur Market"                },
  { district: "Dindigul",         city: "Dindigul",       mandi: "Dindigul Market"                },
  { district: "Krishnagiri",      city: "Krishnagiri",    mandi: "Krishnagiri Tomato Market"      },
  { district: "Nilgiris",         city: "Ooty",           mandi: "Ooty Vegetable Market"          },
  { district: "Kancheepuram",     city: "Kancheepuram",   mandi: "Kancheepuram Market"            },
  { district: "Villupuram",       city: "Villupuram",     mandi: "Villupuram Market"              },
  { district: "Cuddalore",        city: "Cuddalore",      mandi: "Cuddalore Market"               },
  { district: "Nagapattinam",     city: "Nagapattinam",   mandi: "Nagapattinam Market"            },
  { district: "Tiruvannamalai",   city: "Tiruvannamalai", mandi: "Tiruvannamalai Market"          },
  { district: "Virudhunagar",     city: "Virudhunagar",   mandi: "Virudhunagar Market"            },
  { district: "Ramanathapuram",   city: "Ramanathapuram", mandi: "Ramanathapuram Market"          },
  { district: "Sivagangai",       city: "Sivagangai",     mandi: "Sivagangai Market"              },
  { district: "Pudukkottai",      city: "Pudukkottai",    mandi: "Pudukkottai Market"             },
  { district: "Karur",            city: "Karur",          mandi: "Karur Market"                   },
  { district: "Namakkal",         city: "Namakkal",       mandi: "Namakkal Agri Market"           },
  { district: "Dharmapuri",       city: "Dharmapuri",     mandi: "Dharmapuri Market"              },
  { district: "Thoothukudi",      city: "Thoothukudi",    mandi: "Thoothukudi Market"             },
  { district: "Chengalpattu",     city: "Chengalpattu",   mandi: "Chengalpattu Market"            },
  { district: "Ranipet",          city: "Ranipet",        mandi: "Ranipet Market"                 },
  { district: "Tenkasi",          city: "Tenkasi",        mandi: "Tenkasi Market"                 },
  { district: "Mayiladuthurai",   city: "Mayiladuthurai", mandi: "Mayiladuthurai Market"          },
  { district: "Kallakurichi",     city: "Kallakurichi",   mandi: "Kallakurichi Market"            },
  { district: "Perambalur",       city: "Perambalur",     mandi: "Perambalur Market"              },
  { district: "Ariyalur",         city: "Ariyalur",       mandi: "Ariyalur Market"                },
  { district: "Tirupattur",       city: "Tirupattur",     mandi: "Tirupattur Market"              },
];

// ── Delta Pill ─────────────────────────────────────────────────────────────────
function DeltaPill({ change, prev }) {
  const pct   = prev > 0 ? ((change / prev) * 100).toFixed(1) : "0.0";
  const isUp  = change > 0;
  const isDn  = change < 0;
  const bg    = isUp ? "#e6f9f0" : isDn ? "#fdecea" : "#f5f5f5";
  const color = isUp ? "#1a7a4a" : isDn ? "#c0392b" : "#888";
  const arrow = isUp ? "▲" : isDn ? "▼" : "—";
  const sign  = isUp ? "+" : "";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 3,
        padding: "2px 8px", borderRadius: 99, fontSize: 12,
        fontWeight: 600, background: bg, color, width: "fit-content",
      }}>
        {arrow} {sign}{Math.abs(change).toLocaleString()}
      </span>
      <span style={{ fontSize: 10.5, color, marginLeft: 2 }}>{sign}{pct}%</span>
    </div>
  );
}

// ── Sortable Header ────────────────────────────────────────────────────────────
function Th({ label, k, sortKey, sortDir, onSort }) {
  return (
    <span onClick={() => onSort(k)} style={{ cursor: "pointer", userSelect: "none" }}>
      {label}
      {sortKey === k && (
        <span style={{ color: C.bg2, marginLeft: 2 }}>
          {sortDir === -1 ? "↓" : "↑"}
        </span>
      )}
    </span>
  );
}

// ── AI Advice (multilingual) ───────────────────────────────────────────────────
const AI_ADVICE = {
  en: [
    { label: "Sell now", color: "#1a7a4a", text: "Jasmine (↑10.2%), Green Chilli (↑8.1%), Onion (↑8.1%) — festival season peak."   },
    { label: "Hold",     color: "#b8860b", text: "Turmeric (↑4.5%), Cardamom (↑3.2%) — uptrend continuing 2 more weeks."           },
    { label: "Wait",     color: "#c0392b", text: "Toor Dal (↓2.3%), Cotton (↓2.3%) — seasonal correction, hold 3 weeks."           },
    { label: "Rice tip", color: "#1a5090", text: "Pre-harvest demand rising — sell stored paddy stocks within 7 days."             },
  ],
  ta: [
    { label: "இப்போது விற்கவும்",   color: "#1a7a4a", text: "மல்லிகை (↑10.2%), பச்சை மிளகாய் (↑8.1%), வெங்காயம் (↑8.1%) — பண்டிகை கால உச்சம்." },
    { label: "தொடர்ந்து வைக்கவும்", color: "#b8860b", text: "மஞ்சள் (↑4.5%), ஏலக்காய் (↑3.2%) — இன்னும் 2 வாரம் விலை உயரும்."                   },
    { label: "காத்திருக்கவும்",     color: "#c0392b", text: "தூவரம் பருப்பு (↓2.3%), பருத்தி (↓2.3%) — 3 வாரம் காக்கவும்."                       },
    { label: "நெல் குறிப்பு",       color: "#1a5090", text: "அறுவடைக்கு முன் தேவை அதிகம் — 7 நாளில் சேமிப்பு நெல்லை விற்கவும்."                 },
  ],
  hi: [
    { label: "अभी बेचें",   color: "#1a7a4a", text: "चमेली (↑10.2%), हरी मिर्च (↑8.1%), प्याज (↑8.1%) — त्योहारी सीजन पीक।" },
    { label: "रोकें",       color: "#b8860b", text: "हल्दी (↑4.5%), इलायची (↑3.2%) — 2 हफ्ते और तेजी जारी रहेगी।"           },
    { label: "इंतजार करें", color: "#c0392b", text: "तूर दाल (↓2.3%), कपास (↓2.3%) — 3 हफ्ते रुकें।"                        },
    { label: "चावल सुझाव",  color: "#1a5090", text: "फसल से पहले मांग बढ़ रही है — 7 दिनों में स्टॉक बेचें।"                },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
function MarketPrices({ t, lang }) {
  const S = STRINGS[lang] || STRINGS.en;           // ← active language strings

  const [district, setDistrict] = useState(TN_DISTRICTS[2]); // Madurai default
  const [cat,      setCat]      = useState("All");
  const [search,   setSearch]   = useState("");
  const [sortKey,  setSortKey]  = useState("change");
  const [sortDir,  setSortDir]  = useState(-1);

// ✅ இப்படி இருக்கணும்:
const prices = useMemo(
  () => generateMarketPrices(district.district, district.city, lang),
  [district, lang]
);

  const advice = AI_ADVICE[lang] || AI_ADVICE.en;
  const today  = getTodayString(lang);

  // ── Sort handler ──────────────────────────────────────────────────────────
  const handleSort = (key) => {
    setSortDir(prev => sortKey === key ? prev * -1 : -1);
    setSortKey(key);
  };

  // ── Filter + Sort ─────────────────────────────────────────────────────────
  const filtered = prices
    .filter(p =>
      (cat === "All" || p.category === cat) &&
      (!search || p.crop.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return typeof av === "string"
        ? sortDir * av.localeCompare(bv)
        : sortDir * (av - bv);
    });

  // ── Summary stats ─────────────────────────────────────────────────────────
  const rising   = prices.filter(p => p.change > 0).length;
  const falling  = prices.filter(p => p.change < 0).length;
  const flat     = prices.filter(p => p.change === 0).length;
  const bigMover = [...prices].sort((a, b) => Math.abs(b.change) - Math.abs(a.change))[0];

  const thProps = { sortKey, sortDir, onSort: handleSort };

  return (
    <div style={{ padding: 22 }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <h1 style={{ fontSize: 21, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>
        📈 {S.title}
      </h1>
      <p style={{ color: C.muted, fontSize: 13, margin: "0 0 14px" }}>
        {S.subtitle} • {prices.length} {S.crops} • {today}
      </p>

      {/* ── District Selector + Stats ─────────────────────────────────────── */}
      <Card style={{ padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>

          {/* District dropdown */}
          <div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>
              {S.district}
            </div>
            <select
              value={district.district}
              onChange={e => {
                const d = TN_DISTRICTS.find(x => x.district === e.target.value);
                if (d) setDistrict(d);
              }}
              style={{
                padding: "8px 12px", borderRadius: 8,
                border: `1.5px solid ${C.border}`, fontSize: 13,
                color: C.text, background: C.white,
                cursor: "pointer", minWidth: 200, outline: "none",
              }}
            >
              {TN_DISTRICTS.map(d => (
                <option key={d.district} value={d.district}>{d.district}</option>
              ))}
            </select>
          </div>

          {/* Mandi info */}
          <div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>
              {S.mandi}
            </div>
            <span style={{
              padding: "8px 12px", borderRadius: 8, background: C.pale,
              border: `1px solid ${C.border}`, fontSize: 13, color: C.bg2, fontWeight: 500,
            }}>
              🏪 {district.mandi}
            </span>
          </div>

          {/* Summary badges */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ padding: "6px 12px", borderRadius: 8, background: "#e8f9f0", color: "#1a7a4a", fontSize: 12, fontWeight: 600 }}>
              ▲ {rising} {S.rising}
            </span>
            <span style={{ padding: "6px 12px", borderRadius: 8, background: "#fdecea", color: "#c0392b", fontSize: 12, fontWeight: 600 }}>
              ▼ {falling} {S.falling}
            </span>
            <span style={{ padding: "6px 12px", borderRadius: 8, background: C.bg, color: C.muted, fontSize: 12, fontWeight: 600 }}>
              — {flat} {S.unchanged}
            </span>
            {bigMover && (
              <span style={{ padding: "6px 12px", borderRadius: 8, background: C.amberPale, color: C.amber, fontSize: 12, fontWeight: 600 }}>
                🔥 {bigMover.crop} ({bigMover.change > 0 ? "+" : ""}{bigMover.change})
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* ── Category Filters + Search ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={S.search}
          style={{
            padding: "8px 12px", borderRadius: 8,
            border: `1px solid ${C.border}`, fontSize: 13,
            outline: "none", width: 200, color: C.text, background: C.white,
          }}
        />
        {S.cats.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            padding: "6px 13px", borderRadius: 16, fontSize: 12.5, cursor: "pointer",
            border:     `1.5px solid ${cat === c ? C.bg2 : C.border}`,
            background: cat === c ? C.pale  : C.white,
            color:      cat === c ? C.bg2   : C.muted,
            fontWeight: cat === c ? 600     : 400,
          }}>
            {S.catLabels[c] || c}
          </button>
        ))}
      </div>

      {/* ── Price Table ────────────────────────────────────────────────────── */}
      <Card style={{ padding: 0, overflow: "hidden", marginBottom: 14 }}>

        {/* Header row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.8fr 1fr 1fr 1fr 1fr 0.8fr 0.9fr",
          padding: "10px 16px", background: C.pale,
          fontSize: 11.5, fontWeight: 600, color: C.text,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <Th label={S.colCrop}   k="crop"   {...thProps} />
          <Th label={S.colToday}  k="modal"  {...thProps} />
          <span style={{ color: C.muted }}>{S.colYest}</span>
          <Th label={S.colChange} k="change" {...thProps} />
          <span>{S.colMinMax}</span>
          <span>{S.colCat}</span>
          <span>{S.colTrend}</span>
        </div>

        {/* Data rows */}
        <div style={{ maxHeight: 520, overflowY: "auto" }}>
          {filtered.length === 0 && (
            <div style={{ padding: 32, textAlign: "center", color: C.muted, fontSize: 13 }}>
              {S.noData}
            </div>
          )}
          {filtered.map((p, i) => {
            const rowBg = i % 2 ? C.bg : C.white;
            return (
              <div
                key={p.crop + i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 1fr 1fr 1fr 1fr 0.8fr 0.9fr",
                  padding: "12px 16px", alignItems: "center",
                  borderBottom: `1px solid ${C.border}`,
                  background: rowBg, transition: "background 0.1s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.pale}
                onMouseLeave={e => e.currentTarget.style.background = rowBg}
              >
                {/* Crop + market */}
                <div>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: C.text }}>{p.crop}</span>
                  <span style={{ fontSize: 10.5, color: C.muted, marginLeft: 6 }}>{p.market}</span>
                </div>
                {/* Today */}
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                  ₹{p.modal.toLocaleString()}
                </span>
                {/* Yesterday */}
                <span style={{ fontSize: 12.5, color: C.muted }}>
                  ₹{p.prev.toLocaleString()}
                </span>
                {/* Delta */}
                <DeltaPill change={p.change} prev={p.prev} />
                {/* Min / Max */}
                <span style={{ fontSize: 12, color: C.muted }}>
                  ₹{p.min.toLocaleString()}
                  <span style={{ color: C.border, margin: "0 4px" }}>/</span>
                  ₹{p.max.toLocaleString()}
                </span>
                {/* Category — translated label */}
                <Badge color={C.muted} bg={C.bg}>
                  {(S.catLabels[p.category] || p.category).split(" ")[0]}
                </Badge>
                {/* Trend */}
                <TrendPill trend={p.trend} change={p.change} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── AI Intelligence ───────────────────────────────────────────────── */}
      <Card style={{ background: C.amberPale, border: `1px solid #e0c060` }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.amber, marginBottom: 10 }}>
          {S.aiTitle}
          <span style={{
            marginLeft: 8, fontSize: 10.5, padding: "2px 8px", borderRadius: 99,
            background: "#fff8e0", border: `1px solid #e0c060`,
            color: C.amber, fontWeight: 400,
          }}>
            {district.district}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {advice.map((item, i) => (
            <div key={i} style={{ fontSize: 13, color: "#5c4000", lineHeight: 1.6 }}>
              <strong style={{ color: item.color }}>{item.label}:</strong> {item.text}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default MarketPrices;