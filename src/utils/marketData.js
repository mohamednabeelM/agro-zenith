// src/utils/marketData.js
// ─────────────────────────────────────────────────────────────────────────────
// Tamil Nadu Mandi Price Generator
// • No API key needed • No CORS • Works offline
// • Prices change daily (date-seeded) • District-wise variation
// • Full Tamil & Hindi crop name + category translation support
// ─────────────────────────────────────────────────────────────────────────────

// ── Seeded random (same seed = same numbers) ──────────────────────────────────
function seededRand(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Crop name translations ────────────────────────────────────────────────────
const CROP_NAMES = {
  en: {
    "Tomato": "Tomato", "Onion": "Onion", "Potato": "Potato",
    "Brinjal": "Brinjal", "Green Chilli": "Green Chilli", "Carrot": "Carrot",
    "Beans": "Beans", "Cabbage": "Cabbage", "Cauliflower": "Cauliflower",
    "Drumstick": "Drumstick", "Bitter Gourd": "Bitter Gourd", "Ash Gourd": "Ash Gourd",
    "Pumpkin": "Pumpkin", "Lady's Finger": "Lady's Finger",
    "Paddy (Rice)": "Paddy (Rice)", "Maize": "Maize", "Ragi": "Ragi",
    "Bajra": "Bajra", "Wheat": "Wheat",
    "Toor Dal": "Toor Dal", "Urad Dal": "Urad Dal", "Moong Dal": "Moong Dal",
    "Chickpea": "Chickpea", "Horse Gram": "Horse Gram",
    "Groundnut": "Groundnut", "Sesame": "Sesame", "Sunflower": "Sunflower", "Coconut": "Coconut",
    "Cotton": "Cotton", "Sugarcane": "Sugarcane",
    "Banana": "Banana", "Mango": "Mango", "Pomegranate": "Pomegranate",
    "Guava": "Guava", "Papaya": "Papaya", "Sapota": "Sapota",
    "Jasmine": "Jasmine", "Rose": "Rose", "Marigold": "Marigold", "Chrysanthemum": "Chrysanthemum",
    "Turmeric": "Turmeric", "Dry Chilli": "Dry Chilli", "Ginger": "Ginger",
    "Garlic": "Garlic", "Pepper": "Pepper", "Cumin": "Cumin",
    "Cardamom": "Cardamom", "Coriander": "Coriander",
  },
  ta: {
    "Tomato": "தக்காளி", "Onion": "வெங்காயம்", "Potato": "உருளைக்கிழங்கு",
    "Brinjal": "கத்திரிக்காய்", "Green Chilli": "பச்சை மிளகாய்", "Carrot": "கேரட்",
    "Beans": "பீன்ஸ்", "Cabbage": "முட்டைக்கோஸ்", "Cauliflower": "காலிஃப்ளவர்",
    "Drumstick": "முருங்கைக்காய்", "Bitter Gourd": "பாவக்காய்", "Ash Gourd": "பூசணிக்காய்",
    "Pumpkin": "மஞ்சள் பூசணி", "Lady's Finger": "வெண்டைக்காய்",
    "Paddy (Rice)": "நெல் (அரிசி)", "Maize": "மக்காச்சோளம்", "Ragi": "கேழ்வரகு",
    "Bajra": "கம்பு", "Wheat": "கோதுமை",
    "Toor Dal": "தூவரம் பருப்பு", "Urad Dal": "உளுந்து", "Moong Dal": "பாசிப்பருப்பு",
    "Chickpea": "கொண்டைக்கடலை", "Horse Gram": "கொள்ளு",
    "Groundnut": "வேர்க்கடலை", "Sesame": "எள்", "Sunflower": "சூரியகாந்தி", "Coconut": "தேங்காய்",
    "Cotton": "பருத்தி", "Sugarcane": "கரும்பு",
    "Banana": "வாழைப்பழம்", "Mango": "மாம்பழம்", "Pomegranate": "மாதுளை",
    "Guava": "கொய்யா", "Papaya": "பப்பாளி", "Sapota": "சப்போட்டா",
    "Jasmine": "மல்லிகை", "Rose": "ரோஜா", "Marigold": "சாமந்தி", "Chrysanthemum": "சாமந்தி வகை",
    "Turmeric": "மஞ்சள்", "Dry Chilli": "வற்றல் மிளகாய்", "Ginger": "இஞ்சி",
    "Garlic": "பூண்டு", "Pepper": "மிளகு", "Cumin": "சீரகம்",
    "Cardamom": "ஏலக்காய்", "Coriander": "கொத்தமல்லி",
  },
  hi: {
    "Tomato": "टमाटर", "Onion": "प्याज", "Potato": "आलू",
    "Brinjal": "बैंगन", "Green Chilli": "हरी मिर्च", "Carrot": "गाजर",
    "Beans": "सेम", "Cabbage": "पत्तागोभी", "Cauliflower": "फूलगोभी",
    "Drumstick": "सहजन", "Bitter Gourd": "करेला", "Ash Gourd": "पेठा",
    "Pumpkin": "कद्दू", "Lady's Finger": "भिंडी",
    "Paddy (Rice)": "धान (चावल)", "Maize": "मक्का", "Ragi": "रागी",
    "Bajra": "बाजरा", "Wheat": "गेहूं",
    "Toor Dal": "तूर दाल", "Urad Dal": "उड़द दाल", "Moong Dal": "मूंग दाल",
    "Chickpea": "चना", "Horse Gram": "कुल्थी",
    "Groundnut": "मूंगफली", "Sesame": "तिल", "Sunflower": "सूरजमुखी", "Coconut": "नारियल",
    "Cotton": "कपास", "Sugarcane": "गन्ना",
    "Banana": "केला", "Mango": "आम", "Pomegranate": "अनार",
    "Guava": "अमरूद", "Papaya": "पपीता", "Sapota": "चीकू",
    "Jasmine": "चमेली", "Rose": "गुलाब", "Marigold": "गेंदा", "Chrysanthemum": "गुलदाउदी",
    "Turmeric": "हल्दी", "Dry Chilli": "सूखी मिर्च", "Ginger": "अदरक",
    "Garlic": "लहसुन", "Pepper": "काली मिर्च", "Cumin": "जीरा",
    "Cardamom": "इलायची", "Coriander": "धनिया",
  },
};

// ── Category translations ─────────────────────────────────────────────────────
const CATEGORY_NAMES = {
  en: {
    Vegetable: "Vegetable", Cereal: "Cereal", Pulse: "Pulse",
    Oilseed: "Oilseed", "Cash Crop": "Cash Crop", Fruit: "Fruit",
    Flower: "Flower", Spice: "Spice", Plantation: "Plantation",
  },
  ta: {
    Vegetable: "காய்கறி", Cereal: "தானியம்", Pulse: "பருப்பு வகை",
    Oilseed: "எண்ணெய் வித்து", "Cash Crop": "பணப்பயிர்", Fruit: "பழம்",
    Flower: "பூ", Spice: "மசாலா", Plantation: "தோட்டப்பயிர்",
  },
  hi: {
    Vegetable: "सब्जी", Cereal: "अनाज", Pulse: "दाल",
    Oilseed: "तिलहन", "Cash Crop": "नकदी फसल", Fruit: "फल",
    Flower: "फूल", Spice: "मसाला", Plantation: "बागान",
  },
};

// ── Base crop data: realistic TN price ranges ─────────────────────────────────
// [crop_key, category, baseMin, baseMax]  (₹ per quintal)
const CROPS = [
  // Vegetables
  ["Tomato",          "Vegetable",   400,   3500],
  ["Onion",           "Vegetable",   800,   3200],
  ["Potato",          "Vegetable",  1000,   2800],
  ["Brinjal",         "Vegetable",   400,   1800],
  ["Green Chilli",    "Vegetable",  1500,   8000],
  ["Carrot",          "Vegetable",  1200,   4000],
  ["Beans",           "Vegetable",  1500,   5000],
  ["Cabbage",         "Vegetable",   300,   1200],
  ["Cauliflower",     "Vegetable",   500,   2000],
  ["Drumstick",       "Vegetable",  2000,   8000],
  ["Bitter Gourd",    "Vegetable",   800,   3000],
  ["Ash Gourd",       "Vegetable",   400,   1200],
  ["Pumpkin",         "Vegetable",   300,   1000],
  ["Lady's Finger",   "Vegetable",   800,   3500],
  // Cereals
  ["Paddy (Rice)",    "Cereal",     1800,   2500],
  ["Maize",           "Cereal",     1400,   2200],
  ["Ragi",            "Cereal",     2500,   4000],
  ["Bajra",           "Cereal",     1500,   2500],
  ["Wheat",           "Cereal",     2000,   2800],
  // Pulses
  ["Toor Dal",        "Pulse",      8000,  14000],
  ["Urad Dal",        "Pulse",      7000,  12000],
  ["Moong Dal",       "Pulse",      7500,  13000],
  ["Chickpea",        "Pulse",      5000,   9000],
  ["Horse Gram",      "Pulse",      4000,   7000],
  // Oilseeds
  ["Groundnut",       "Oilseed",    4500,   7000],
  ["Sesame",          "Oilseed",   10000,  18000],
  ["Sunflower",       "Oilseed",    4000,   6500],
  ["Coconut",         "Oilseed",    1800,   3500],
  // Cash Crops
  ["Cotton",          "Cash Crop",  6000,   9000],
  ["Sugarcane",       "Cash Crop",   280,    380],
  // Fruits
  ["Banana",          "Fruit",       800,   3000],
  ["Mango",           "Fruit",      2000,   8000],
  ["Pomegranate",     "Fruit",      4000,  10000],
  ["Guava",           "Fruit",      1500,   4000],
  ["Papaya",          "Fruit",       600,   2000],
  ["Sapota",          "Fruit",      1500,   4500],
  // Flowers
  ["Jasmine",         "Flower",     4000,  25000],
  ["Rose",            "Flower",     2000,  12000],
  ["Marigold",        "Flower",      800,   4000],
  ["Chrysanthemum",   "Flower",     1200,   5000],
  // Spices
  ["Turmeric",        "Spice",      6000,  14000],
  ["Dry Chilli",      "Spice",      8000,  20000],
  ["Ginger",          "Spice",      3000,  12000],
  ["Garlic",          "Spice",      4000,  16000],
  ["Pepper",          "Spice",     30000,  60000],
  ["Cumin",           "Spice",     15000,  30000],
  ["Cardamom",        "Plantation",80000, 150000],
  ["Coriander",       "Spice",      4000,  10000],
];

// ── District-specific crop selection ─────────────────────────────────────────
const DISTRICT_FOCUS = {
  "Chennai":         ["Tomato","Onion","Potato","Brinjal","Green Chilli","Carrot","Beans","Cabbage","Cauliflower","Lady's Finger","Paddy (Rice)","Toor Dal","Urad Dal","Groundnut","Banana","Mango","Jasmine","Rose","Marigold","Turmeric","Dry Chilli","Garlic","Ginger","Coconut","Ragi","Maize","Chickpea","Pomegranate"],
  "Coimbatore":      ["Tomato","Onion","Carrot","Beans","Cabbage","Cauliflower","Green Chilli","Coconut","Turmeric","Dry Chilli","Groundnut","Maize","Toor Dal","Cotton","Banana","Jasmine","Rose","Marigold","Sugarcane","Ragi","Bajra","Garlic","Ginger","Pepper","Sesame","Guava","Pomegranate","Horse Gram"],
  "Madurai":         ["Jasmine","Rose","Marigold","Chrysanthemum","Banana","Turmeric","Dry Chilli","Onion","Tomato","Brinjal","Drumstick","Paddy (Rice)","Toor Dal","Groundnut","Sesame","Cotton","Maize","Ragi","Bitter Gourd","Lady's Finger","Garlic","Ginger","Coconut","Mango","Papaya","Sapota","Urad Dal","Chickpea"],
  "Salem":           ["Tomato","Onion","Beans","Carrot","Cabbage","Turmeric","Banana","Mango","Maize","Ragi","Toor Dal","Groundnut","Sesame","Sugarcane","Coconut","Cotton","Pomegranate","Jasmine","Rose","Drumstick","Green Chilli","Garlic","Dry Chilli","Paddy (Rice)","Bajra","Bitter Gourd","Ash Gourd","Guava"],
  "Tiruchirappalli": ["Paddy (Rice)","Banana","Coconut","Sugarcane","Turmeric","Maize","Toor Dal","Groundnut","Cotton","Jasmine","Rose","Onion","Tomato","Brinjal","Drumstick","Lady's Finger","Bitter Gourd","Ragi","Urad Dal","Moong Dal","Garlic","Dry Chilli","Sesame","Mango","Papaya","Sapota","Pumpkin","Ash Gourd"],
  "Thanjavur":       ["Paddy (Rice)","Banana","Coconut","Sugarcane","Toor Dal","Urad Dal","Groundnut","Sesame","Maize","Jasmine","Turmeric","Onion","Tomato","Brinjal","Drumstick","Lady's Finger","Bitter Gourd","Ragi","Moong Dal","Garlic","Dry Chilli","Mango","Papaya","Sapota","Pumpkin","Ash Gourd","Rose","Marigold"],
  "Erode":           ["Turmeric","Coconut","Banana","Cotton","Sugarcane","Groundnut","Sesame","Maize","Toor Dal","Jasmine","Rose","Onion","Tomato","Brinjal","Drumstick","Lady's Finger","Ragi","Urad Dal","Moong Dal","Garlic","Dry Chilli","Mango","Papaya","Green Chilli","Bitter Gourd","Ash Gourd","Marigold","Chrysanthemum"],
  "Nilgiris":        ["Carrot","Beans","Cabbage","Cauliflower","Potato","Tomato","Pepper","Cardamom","Ginger","Garlic","Banana","Pumpkin","Bitter Gourd","Lady's Finger","Maize","Ragi","Toor Dal","Groundnut","Sesame","Rose","Marigold","Chrysanthemum","Mango","Guava","Sapota","Turmeric","Cumin","Coriander"],
  "Krishnagiri":     ["Tomato","Mango","Groundnut","Maize","Toor Dal","Onion","Brinjal","Green Chilli","Banana","Coconut","Ragi","Bajra","Cotton","Sesame","Garlic","Ginger","Turmeric","Dry Chilli","Jasmine","Rose","Lady's Finger","Bitter Gourd","Drumstick","Urad Dal","Chickpea","Horse Gram","Pumpkin","Sapota"],
  "Dindigul":        ["Banana","Turmeric","Jasmine","Rose","Marigold","Coconut","Groundnut","Cotton","Toor Dal","Maize","Onion","Tomato","Brinjal","Drumstick","Ragi","Sesame","Garlic","Dry Chilli","Ginger","Lady's Finger","Bitter Gourd","Mango","Papaya","Sapota","Urad Dal","Moong Dal","Paddy (Rice)","Sugarcane"],
  "default":         CROPS.slice(0, 28).map(c => c[0]),
};

// ── Main generator ─────────────────────────────────────────────────────────────
// lang: "en" | "ta" | "hi"
export function generateMarketPrices(districtName, cityName, lang = "en") {
  const cropNames = CROP_NAMES[lang]     || CROP_NAMES.en;
  const catNames  = CATEGORY_NAMES[lang] || CATEGORY_NAMES.en;

  // Seed = district + today's date → same prices all day, different every day
  const dateStr = new Date().toDateString();
  const seedStr = `${districtName}-${dateStr}`;
  let seedNum   = 0;
  for (let i = 0; i < seedStr.length; i++) seedNum += seedStr.charCodeAt(i) * (i + 1);
  const rand = seededRand(seedNum >>> 0);

  // Yesterday seed for prev price
  const yDate    = new Date(); yDate.setDate(yDate.getDate() - 1);
  const ySeedStr = `${districtName}-${yDate.toDateString()}`;
  let ySeedNum   = 0;
  for (let i = 0; i < ySeedStr.length; i++) ySeedNum += ySeedStr.charCodeAt(i) * (i + 1);
  const randY = seededRand(ySeedNum >>> 0);

  // Get crop list for this district
  const focusCrops = DISTRICT_FOCUS[districtName] || DISTRICT_FOCUS["default"];

  return focusCrops.map(cropKey => {
    const base = CROPS.find(c => c[0] === cropKey) || [cropKey, "Vegetable", 500, 3000];
    const [, category, lo, hi] = base;
    const range = hi - lo;

    // Today's modal
    const todayFrac = rand();
    const modal     = Math.round(lo + todayFrac * range);
    const spread    = Math.round(modal * (0.05 + rand() * 0.12));
    const minP      = Math.max(lo, modal - spread);
    const maxP      = Math.min(hi, modal + spread);

    // Yesterday's modal
    const yFrac = randY();
    const prev  = Math.round(lo + yFrac * range);

    const change = modal - prev;
    const trend  = change > 0 ? "up" : change < 0 ? "down" : "flat";

    return {
      crop:         cropNames[cropKey] || cropKey,   // translated crop name
      cropKey,                                        // always English key (for filtering)
      category:     catNames[category] || category,  // translated category
      categoryKey:  category,                         // always English key (for filtering)
      modal,
      min:          minP,
      max:          maxP,
      prev,
      change,
      market:       cityName.slice(0, 12),
      trend,
    };
  });
}

// ── Today's date string (locale-aware) ────────────────────────────────────────
export function getTodayString(lang = "en") {
  const locale = lang === "ta" ? "ta-IN" : lang === "hi" ? "hi-IN" : "en-IN";
  return new Date().toLocaleDateString(locale, {
    day: "numeric", month: "long", year: "numeric",
  });
}

// ── Export helpers for components ─────────────────────────────────────────────
export { CROP_NAMES, CATEGORY_NAMES };