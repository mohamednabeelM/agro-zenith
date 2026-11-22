// src/pages/Shops.jsx
import { useState } from "react";
import C from "../constants/colors";
import { SHOPS_DATA } from "../constants/data";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";

// ── Product name translations ─────────────────────────────────────────────────
const PRODUCTS_TX = {
  ta: {
    "Mancozeb":                       "மேன்கோஜெப்",
    "Urea":                           "யூரியா",
    "DAP":                            "டிஏபி",
    "NPK mixtures":                   "NPK கலவைகள்",
    "Neem oil":                       "வேப்ப எண்ணெய்",
    "Pesticides":                     "பூச்சிக்கொல்லிகள்",
    "Fungicides":                     "பூஞ்சைக்கொல்லிகள்",
    "Seeds":                          "விதைகள்",
    "Sprayers":                       "தெளிப்பான்கள்",
    "Organic fertilizers":            "இயற்கை உரங்கள்",
    "Bio pesticides":                 "உயிரி பூச்சிக்கொல்லிகள்",
    "Drip equipment":                 "சொட்டு நீர் உபகரணங்கள்",
    "Saplings":                       "நாற்றுகள்",
    "Soil testing kits":              "மண் பரிசோதனை கிட்",
    "Tools":                          "கருவிகள்",
    "All agri inputs":                "அனைத்து விவசாய உள்ளீடுகள்",
    "Irrigation equipment":           "நீர்ப்பாசன உபகரணங்கள்",
    "Tractors on rent":               "வாடகை டிராக்டர்கள்",
    "Vegetable Seeds":                "காய்கறி விதைகள்",
    "Flower Seeds":                   "பூ விதைகள்",
    "plants seeds":                   "செடி விதைகள்",
    "garden tools":                   "தோட்ட கருவிகள்",
    "Fertilizers":                    "உரங்கள்",
    "Agricultural Crops Services":    "வேளாண் பயிர் சேவைகள்",
    "Agricultural Fertilizer Services":"வேளாண் உர சேவைகள்",
    "Agricultural Irrigation Service":"வேளாண் நீர்ப்பாசன சேவை",
  },
  hi: {
    "Mancozeb":                       "मैन्कोजेब",
    "Urea":                           "यूरिया",
    "DAP":                            "डीएपी",
    "NPK mixtures":                   "NPK मिश्रण",
    "Neem oil":                       "नीम का तेल",
    "Pesticides":                     "कीटनाशक",
    "Fungicides":                     "फफूंदनाशक",
    "Seeds":                          "बीज",
    "Sprayers":                       "स्प्रेयर",
    "Organic fertilizers":            "जैविक उर्वरक",
    "Bio pesticides":                 "जैव कीटनाशक",
    "Drip equipment":                 "ड्रिप उपकरण",
    "Saplings":                       "पौधे",
    "Soil testing kits":              "मिट्टी परीक्षण किट",
    "Tools":                          "औजार",
    "All agri inputs":                "सभी कृषि सामग्री",
    "Irrigation equipment":           "सिंचाई उपकरण",
    "Tractors on rent":               "किराए पर ट्रैक्टर",
    "Vegetable Seeds":                "सब्जी के बीज",
    "Flower Seeds":                   "फूलों के बीज",
    "plants seeds":                   "पौध बीज",
    "garden tools":                   "बगीचे के औजार",
    "Fertilizers":                    "उर्वरक",
    "Agricultural Crops Services":    "कृषि फसल सेवाएं",
    "Agricultural Fertilizer Services":"कृषि उर्वरक सेवाएं",
    "Agricultural Irrigation Service":"कृषि सिंचाई सेवा",
  },
};

// ── Static translations for Shops page ───────────────────────────────────────
const SHOPS_TX = {
  ta: {
    title:      "உங்களுக்கு அருகில் விவசாய கடைகள்",
    subtitle:   "விவசாய கடைகள், உர விற்பனையாளர்கள் மற்றும் கால்நடை மருத்துவமனைகளை கண்டறியுங்கள்",
    search:     "கடைகளை தேடுக…",
    open:       "திறந்திருக்கிறது",
    closed:     "மூடியிருக்கிறது",
    call:       "அழைக்கவும்",
    distance:   "கி.மீ தொலைவில்",
    rating:     "மதிப்பீடு",
    products:   "தயாரிப்புகள்",
    directions: "📍 வழிகாட்டல் பெறு",
    noResults:  "கடைகள் எதுவும் கிடைக்கவில்லை",
    notAvail:   "கிடைக்கவில்லை",
  },
  hi: {
    title:      "आपके पास कृषि दुकानें",
    subtitle:   "कृषि दुकानें, उर्वरक डीलर और पशु चिकित्सा क्लीनिक खोजें",
    search:     "दुकानें खोजें…",
    open:       "खुला है",
    closed:     "बंद है",
    call:       "कॉल करें",
    distance:   "किमी दूर",
    rating:     "रेटिंग",
    products:   "उत्पाद",
    directions: "📍 दिशा-निर्देश पाएं",
    noResults:  "कोई दुकान नहीं मिली",
    notAvail:   "उपलब्ध नहीं",
  },
};

function Shops({ t, lang }) {
  const [search, setSearch] = useState("");

  // ── Safe data ─────────────────────────────────────────────────────────────
  const shops = Array.isArray(SHOPS_DATA) ? SHOPS_DATA : [];

  // ── Translations ──────────────────────────────────────────────────────────
  const L  = SHOPS_TX[lang] || {};
  const TX = {
    title:      L.title      || t("shops.title")    || "Agri Shops Near You",
    subtitle:   L.subtitle   || t("shops.subtitle") || "Find agricultural shops, fertilizer dealers and veterinary clinics",
    search:     L.search     || t("shops.search")   || "Search shops…",
    open:       L.open       || t("shops.open")     || "Open",
    closed:     L.closed     || t("shops.closed")   || "Closed",
    call:       L.call       || t("shops.call")     || "Call",
    distance:   L.distance   || t("shops.distance") || "km away",
    rating:     L.rating     || t("shops.rating")   || "Rating",
    products:   L.products   || t("shops.products") || "Products",
    directions: L.directions || "📍 Get Directions",
    noResults:  L.noResults  || t("common.noData")  || "No shops found",
    notAvail:   L.notAvail   || "Not available",
  };

  // Returns the language-specific field from a shop object, falls back to English.
  // Expects shop data to optionally have: name_ta / name_hi / address_ta / address_hi
  const shopVal = (shop, field) =>
    (lang && lang !== "en" ? shop[`${field}_${lang}`] : null) || shop[field] || "";

  // Translates a product name tag
  const productTx = (name) => PRODUCTS_TX[lang]?.[name] || name;

  const filtered = shops.filter(s => {
    const q = search.toLowerCase();
    return (
      (shopVal(s, "name")    ).toLowerCase().includes(q) ||
      (shopVal(s, "address") ).toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ padding: 22 }}>
      <h1 style={{ fontSize: 21, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>
        🏪 {TX.title}
      </h1>
      <p style={{ color: C.muted, fontSize: 13, margin: "0 0 14px" }}>{TX.subtitle}</p>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={TX.search}
        style={{
          width: "100%", maxWidth: 320, padding: "10px 12px",
          borderRadius: 8, border: `1px solid ${C.border}`,
          fontSize: 13, outline: "none", marginBottom: 14, color: C.text,
        }}
      />

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.muted, fontSize: 14 }}>
          {TX.noResults}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {filtered.map((shop, i) => {
          const products = Array.isArray(shop.products) ? shop.products : [];
          return (
            <Card key={`${shop.name}-${i}`} style={{ padding: 14 }}>
              {/* Name + open/closed */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{shopVal(shop, "name")}</div>
                {shop.isOpen !== undefined && (
                  <span style={{
                    fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 10,
                    background: shop.isOpen ? "#e8f8ee" : "#fff0f0",
                    color:      shop.isOpen ? C.bg2 : C.red,
                  }}>
                    {shop.isOpen ? TX.open : TX.closed}
                  </span>
                )}
              </div>

              {/* Details */}
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 10, lineHeight: 1.7 }}>
                📍 {shopVal(shop, "address") || TX.notAvail}<br />
                📞 {shop.phone   || TX.notAvail}<br />
                ⭐ {TX.rating}: {shop.rating || "N/A"}
                {shop.distance ? <><br />📏 {shop.distance} {TX.distance}</> : null}
              </div>

              {/* Products */}
              {products.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {TX.products}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {products.slice(0, 4).map((p, idx) => (
                      <span key={`${p}-${idx}`} style={{ fontSize: 11, padding: "2px 7px", background: C.pale, borderRadius: 10, color: C.bg2 }}>{productTx(p)}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: 7 }}>
                <Btn
                  style={{ flex: 1, padding: "8px", fontSize: 12 }}
                  onClick={() => {
                    const q = encodeURIComponent(`${shopVal(shop, "name")}, ${shopVal(shop, "address")}`);
                    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank");
                  }}
                >
                  {TX.directions}
                </Btn>
                {shop.phone && (
                  <Btn variant="outline" onClick={() => window.open(`tel:${shop.phone}`)} style={{ padding: "8px 12px", fontSize: 12 }}>
                    📞 {TX.call}
                  </Btn>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Shops;