// src/pages/FarmMap.jsx
// ✅ Fixes: map stays alive after picker close | crop selector in analysis | Tamil/Hindi

import { useRef, useState, useEffect, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import C from "../constants/colors";
import S from "../utils/storage";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import Btn from "../components/ui/Btn";

// ── Language strings ───────────────────────────────────────────────────────────
const L10N = {
  en: {
    title:         "Farm Map",
    subtitle:      "GPS mapping of your farm plots",
    addPlot:       "+ Add Farm",
    yourFarms:     "My Farm Plots",
    noFarms:       "No farms added yet",
    addFirst:      "Click '+ Add Farm' to start",
    area:          "Area",
    crop:          "Crop",
    plotName:      "Plot Name",
    loading:       "Loading map…",
    acres:         "acres",
    fieldConds:    "🌡️ Field Conditions Today",
    temp:          "Temperature",
    humidity:      "Humidity",
    pestRisk:      "Pest Risk",
    diseaseRisk:   "Disease Risk",
    irrigation:    "Irrigation Need",
    ndvi:          "📡 NDVI Satellite Status",
    soilType:      "Soil Type",
    status:        "Status",
    analyse:       "📊 Analyse",
    remove:        "🗑 Remove",
    confirmDelete: "Yes, Delete",
    no:            "No",
    selectFarm:    "📌 Select Farm Location",
    pickerHint:    "Slide the map so the pin lands on your farm · or use search / GPS",
    searchPlaceholder: "Search village, town, college, landmark…",
    detecting:     "Reading map position…",
    farmDetails:   "Farm Details",
    confirm:       "✅ Confirm Location & Save Farm",
    cancel:        "Cancel",
    analysisTitle: "📊 Farm Input Analysis",
    analyseCrop:   "Crop to Analyse",
    noSize:        "⚠️ No land size recorded. Edit the farm and enter the size in acres.",
    classification:"Field Classification",
    duration:      "Crop Duration",
    days:          "days",
    seeds:         "Seeds Needed",
    waterDay:      "Water / Day",
    spacing:       "Plant Spacing",
    seedsMaterial: "🌱 Seeds / Planting Material",
    qtyReq:        "Quantity Required",
    seedCost:      "Estimated Seed Cost",
    fertilisers:   "🧪 Chemical Fertilisers",
    urea:          "Urea (Nitrogen)",
    dap:           "DAP (Phosphorus)",
    mop:           "MOP (Potassium)",
    fertCost:      "Fertiliser Cost",
    organic:       "🍃 Organic Manure (FYM)",
    orgQty:        "Quantity Required",
    orgBags:       "No. of 50 kg Bags",
    orgCost:       "Organic Cost",
    water:         "💧 Water Requirement",
    dailyIrr:      "Daily Irrigation",
    totalWater:    "Total Season Water",
    totalCost:     "Total Estimated Input Cost",
    costNote:      "Seeds + Fertiliser + Organic Manure",
    back:          "←",
    myLocation:    "📡 My Location",
    locating:      "⏳ Locating…",
    located:       "✅ Located!",
    locFailed:     "❌ Allow location",
    gps:           "GPS",
    notFound:      "No results found",
    flyingTo:      "Navigating to",
    searching:     "Searching…",
    splitNote:     "split into 3 applications",
    applyAtSow:    "apply at sowing",
    bags50:        "1 tonne ≈ 20 bags of 50 kg",
    overCropPeriod:"Over {d}-day crop period",
    healthy:       "Healthy",
    diseaseAlert:  "Disease Alert",
    monitor:       "Monitor",
    harvested:     "Harvested",
    fallow:        "Fallow",
    ndviHealthIdx: "Crop health index",
    ndviGood:      "Good",
    ndviExcellent: "Excellent",
    ndviFair:      "Fair",
    ndviPoor:      "Poor",
    ndviStress:    "Stress",
    ndviLastPass:  "Last satellite pass",
    ndviToday:     "Today",
    ndviCloud:     "Cloud cover",
    pinMoving:     "🚜 Moving…",
    pinHere:       "📍 Your Farm Here",
    searchHint:    "Search above or slide the map",
    sizeLabelSmall:      "Small Plot (< 1 acre)",
    sizeLabelMedium:     "Medium Farm (1–5 acres)",
    sizeLabelLarge:      "Large Farm (5–15 acres)",
    sizeLabelCommercial: "Commercial Farm (15+ acres)",
    pestMod:       "Moderate",
    riskHigh:      "High",
    irrigTomorrow: "Tomorrow 6 AM",
    tonnes:        "tonnes",
    bags:          "bags",
  },
  ta: {
    title:         "வயல் வரைபடம்",
    subtitle:      "உங்கள் வயல் தகவல்களை GPS மூலம் பதிவிடுங்கள்",
    addPlot:       "+ வயல் சேர்க்க",
    yourFarms:     "என் வயல்கள்",
    noFarms:       "இன்னும் வயல்கள் சேர்க்கப்படவில்லை",
    addFirst:      "'+ வயல் சேர்க்க' கிளிக் செய்யுங்கள்",
    area:          "பரப்பளவு",
    crop:          "பயிர்",
    plotName:      "வயல் பெயர்",
    loading:       "வரைபடம் ஏற்றுகிறது…",
    acres:         "ஏக்கர்",
    fieldConds:    "🌡️ இன்றைய வயல் நிலைமை",
    temp:          "வெப்பநிலை",
    humidity:      "ஈரப்பதம்",
    pestRisk:      "பூச்சி அபாயம்",
    diseaseRisk:   "நோய் அபாயம்",
    irrigation:    "நீர்ப்பாசன தேவை",
    ndvi:          "📡 NDVI செயற்கைக்கோள் நிலை",
    soilType:      "மண் வகை",
    status:        "நிலை",
    analyse:       "📊 பகுப்பாய்வு",
    remove:        "🗑 நீக்கு",
    confirmDelete: "ஆம், நீக்கு",
    no:            "இல்லை",
    selectFarm:    "📌 வயல் இடத்தை தேர்ந்தெடுக்கவும்",
    pickerHint:    "வரைபடத்தை நகர்த்தி pin-ஐ உங்கள் வயலில் வையுங்கள்",
    searchPlaceholder: "கிராமம், நகரம், கல்லூரி, இடம் தேடுக…",
    detecting:     "இடம் கண்டறிகிறது…",
    farmDetails:   "வயல் விவரங்கள்",
    confirm:       "✅ இடத்தை உறுதிப்படுத்தி சேமிக்கவும்",
    cancel:        "ரத்து",
    analysisTitle: "📊 வயல் உள்ளீட்டு பகுப்பாய்வு",
    analyseCrop:   "பகுப்பாய்வுக்கான பயிர்",
    noSize:        "⚠️ நில அளவு பதிவு இல்லை. வயலை திருத்தி ஏக்கர் அளவை உள்ளிடுங்கள்.",
    classification:"வயல் வகை",
    duration:      "பயிர் காலம்",
    days:          "நாட்கள்",
    seeds:         "தேவையான விதை",
    waterDay:      "தினசரி நீர்",
    spacing:       "செடி இடைவெளி",
    seedsMaterial: "🌱 விதை / நடவு பொருள்",
    qtyReq:        "தேவையான அளவு",
    seedCost:      "மதிப்பிடப்பட்ட விதை செலவு",
    fertilisers:   "🧪 ரசாயன உரங்கள்",
    urea:          "யூரியா (நைட்ரஜன்)",
    dap:           "DAP (பாஸ்பரஸ்)",
    mop:           "MOP (பொட்டாசியம்)",
    fertCost:      "உர செலவு",
    organic:       "🍃 இயற்கை உரம் (FYM)",
    orgQty:        "தேவையான அளவு",
    orgBags:       "50 கி.கி. பைகள் எண்ணிக்கை",
    orgCost:       "இயற்கை உர செலவு",
    water:         "💧 நீர் தேவை",
    dailyIrr:      "தினசரி நீர்ப்பாசனம்",
    totalWater:    "மொத்த பருவ நீர்",
    totalCost:     "மொத்த மதிப்பிடப்பட்ட செலவு",
    costNote:      "விதை + உரம் + இயற்கை உரம்",
    back:          "←",
    myLocation:    "📡 என் இடம்",
    locating:      "⏳ கண்டறிகிறது…",
    located:       "✅ கண்டறியப்பட்டது!",
    locFailed:     "❌ அனுமதி தேவை",
    gps:           "GPS",
    notFound:      "முடிவுகள் இல்லை",
    flyingTo:      "செல்கிறது",
    searching:     "தேடுகிறது…",
    splitNote:     "3 தவணைகளில் பயன்படுத்தவும்",
    applyAtSow:    "விதைப்பின்போது பயன்படுத்தவும்",
    bags50:        "1 டன் ≈ 20 பைகள் (50 கி.கி.)",
    overCropPeriod:"{d} நாள் பயிர் காலத்தில்",
    healthy:       "ஆரோக்கியம்",
    diseaseAlert:  "நோய் எச்சரிக்கை",
    monitor:       "கண்காணிக்கவும்",
    harvested:     "அறுவடை செய்யப்பட்டது",
    fallow:        "தரிசு நிலம்",
    ndviHealthIdx: "பயிர் ஆரோக்கிய குறியீடு",
    ndviGood:      "நல்லது",
    ndviExcellent: "சிறந்தது",
    ndviFair:      "சராசரி",
    ndviPoor:      "மோசம்",
    ndviStress:    "அழுத்தம்",
    ndviLastPass:  "கடைசி செயற்கைக்கோள் கடப்பு",
    ndviToday:     "இன்று",
    ndviCloud:     "மேக மூட்டம்",
    pinMoving:     "🚜 நகர்கிறது…",
    pinHere:       "📍 உங்கள் வயல் இங்கே",
    searchHint:    "மேலே தேடுக அல்லது வரைபடம் நகர்த்துக",
    sizeLabelSmall:      "சிறிய வயல் (< 1 ஏக்கர்)",
    sizeLabelMedium:     "நடுத்தர வயல் (1–5 ஏக்கர்)",
    sizeLabelLarge:      "பெரிய வயல் (5–15 ஏக்கர்)",
    sizeLabelCommercial: "வணிக வயல் (15+ ஏக்கர்)",
    pestMod:       "மிதமான",
    riskHigh:      "அதிகம்",
    irrigTomorrow: "நாளை காலை 6",
    tonnes:        "டன்",
    bags:          "பைகள்",
  },
  hi: {
    title:         "खेत का नक्शा",
    subtitle:      "अपने खेतों को GPS से मैप करें",
    addPlot:       "+ खेत जोड़ें",
    yourFarms:     "मेरे खेत",
    noFarms:       "अभी कोई खेत नहीं जोड़ा गया",
    addFirst:      "'+ खेत जोड़ें' पर क्लिक करें",
    area:          "क्षेत्रफल",
    crop:          "फसल",
    plotName:      "खेत का नाम",
    loading:       "नक्शा लोड हो रहा है…",
    acres:         "एकड़",
    fieldConds:    "🌡️ आज की खेत स्थिति",
    temp:          "तापमान",
    humidity:      "आर्द्रता",
    pestRisk:      "कीट जोखिम",
    diseaseRisk:   "रोग जोखिम",
    irrigation:    "सिंचाई आवश्यकता",
    ndvi:          "📡 NDVI उपग्रह स्थिति",
    soilType:      "मिट्टी का प्रकार",
    status:        "स्थिति",
    analyse:       "📊 विश्लेषण",
    remove:        "🗑 हटाएं",
    confirmDelete: "हाँ, हटाएं",
    no:            "नहीं",
    selectFarm:    "📌 खेत का स्थान चुनें",
    pickerHint:    "नक्शा खिसकाएं ताकि pin आपके खेत पर आए",
    searchPlaceholder: "गाँव, शहर, कॉलेज, स्थान खोजें…",
    detecting:     "स्थान पहचाना जा रहा है…",
    farmDetails:   "खेत विवरण",
    confirm:       "✅ स्थान पुष्टि करें और खेत सहेजें",
    cancel:        "रद्द करें",
    analysisTitle: "📊 खेत इनपुट विश्लेषण",
    analyseCrop:   "विश्लेषण के लिए फसल",
    noSize:        "⚠️ भूमि का आकार दर्ज नहीं है। खेत संपादित करें और एकड़ में आकार दर्ज करें।",
    classification:"खेत वर्गीकरण",
    duration:      "फसल अवधि",
    days:          "दिन",
    seeds:         "आवश्यक बीज",
    waterDay:      "पानी / दिन",
    spacing:       "पौधों की दूरी",
    seedsMaterial: "🌱 बीज / रोपण सामग्री",
    qtyReq:        "आवश्यक मात्रा",
    seedCost:      "अनुमानित बीज लागत",
    fertilisers:   "🧪 रासायनिक उर्वरक",
    urea:          "यूरिया (नाइट्रोजन)",
    dap:           "DAP (फास्फोरस)",
    mop:           "MOP (पोटेशियम)",
    fertCost:      "उर्वरक लागत",
    organic:       "🍃 जैविक खाद (FYM)",
    orgQty:        "आवश्यक मात्रा",
    orgBags:       "50 किलो बोरों की संख्या",
    orgCost:       "जैविक खाद लागत",
    water:         "💧 जल आवश्यकता",
    dailyIrr:      "दैनिक सिंचाई",
    totalWater:    "कुल मौसम जल",
    totalCost:     "कुल अनुमानित लागत",
    costNote:      "बीज + उर्वरक + जैविक खाद",
    back:          "←",
    myLocation:    "📡 मेरा स्थान",
    locating:      "⏳ पता लगा रहे हैं…",
    located:       "✅ मिल गया!",
    locFailed:     "❌ अनुमति दें",
    gps:           "GPS",
    notFound:      "कोई परिणाम नहीं",
    flyingTo:      "जा रहे हैं",
    searching:     "खोज रहे हैं…",
    splitNote:     "3 बार में डालें",
    applyAtSow:    "बुवाई के समय डालें",
    bags50:        "1 टन ≈ 20 बोरे (50 किलो)",
    overCropPeriod:"{d} दिन की फसल अवधि में",
    healthy:       "स्वस्थ",
    diseaseAlert:  "रोग चेतावनी",
    monitor:       "निगरानी करें",
    harvested:     "कटाई हो गई",
    fallow:        "परती भूमि",
    ndviHealthIdx: "फसल स्वास्थ्य सूचकांक",
    ndviGood:      "अच्छा",
    ndviExcellent: "उत्कृष्ट",
    ndviFair:      "ठीक-ठाक",
    ndviPoor:      "खराब",
    ndviStress:    "तनाव",
    ndviLastPass:  "अंतिम उपग्रह गुजरना",
    ndviToday:     "आज",
    ndviCloud:     "बादल छाव",
    pinMoving:     "🚜 हिल रहा है…",
    pinHere:       "📍 आपका खेत यहाँ",
    searchHint:    "ऊपर खोजें या नक्शा खिसकाएं",
    sizeLabelSmall:      "छोटा खेत (< 1 एकड़)",
    sizeLabelMedium:     "मध्यम खेत (1–5 एकड़)",
    sizeLabelLarge:      "बड़ा खेत (5–15 एकड़)",
    sizeLabelCommercial: "व्यावसायिक खेत (15+ एकड़)",
    pestMod:       "मध्यम",
    riskHigh:      "अधिक",
    irrigTomorrow: "कल सुबह 6 बजे",
    tonnes:        "टन",
    bags:          "बोरे",
  },
};

const CROP_OPTIONS = [
  "Tomato","Rice","Wheat","Maize","Cotton","Onion","Potato","Brinjal","Okra",
  "Groundnut","Sugarcane","Turmeric","Banana","Mango","Coconut","Ragi","Bajra",
  "Toor Dal","Urad Dal","Moong Dal","Sesame","Green Chilli","Carrot","Cauliflower",
];

const SOIL_TYPES    = ["Red","Black","Loamy","Sandy","Clay","Alluvial"];
const FARM_STATUSES = ["Healthy","Disease Alert","Monitor","Harvested","Fallow"];

// ── Crop / Soil / Status translations ─────────────────────────────────────────
const CROP_TX = {
  ta: {
    "Tomato":"தக்காளி","Rice":"நெல்","Wheat":"கோதுமை","Maize":"மக்காச்சோளம்",
    "Cotton":"பருத்தி","Onion":"வெங்காயம்","Potato":"உருளைக்கிழங்கு","Brinjal":"கத்திரி",
    "Okra":"வெண்டை","Groundnut":"நிலக்கடலை","Sugarcane":"கரும்பு","Turmeric":"மஞ்சள்",
    "Banana":"வாழை","Mango":"மாம்பழம்","Coconut":"தேங்காய்","Ragi":"ராகி",
    "Bajra":"கம்பு","Toor Dal":"துவரை","Urad Dal":"உளுந்து","Moong Dal":"பாசிப்பருப்பு",
    "Sesame":"எள்","Green Chilli":"பச்சை மிளகாய்","Carrot":"கேரட்","Cauliflower":"காளிஃபிளவர்",
  },
  hi: {
    "Tomato":"टमाटर","Rice":"धान","Wheat":"गेहूँ","Maize":"मक्का",
    "Cotton":"कपास","Onion":"प्याज","Potato":"आलू","Brinjal":"बैंगन",
    "Okra":"भिंडी","Groundnut":"मूंगफली","Sugarcane":"गन्ना","Turmeric":"हल्दी",
    "Banana":"केला","Mango":"आम","Coconut":"नारियल","Ragi":"रागी",
    "Bajra":"बाजरा","Toor Dal":"तुअर दाल","Urad Dal":"उड़द दाल","Moong Dal":"मूंग दाल",
    "Sesame":"तिल","Green Chilli":"हरी मिर्च","Carrot":"गाजर","Cauliflower":"फूलगोभी",
  },
};

const SOIL_TX = {
  ta: { "Red":"சிவப்பு","Black":"கருப்பு","Loamy":"வண்டல்","Sandy":"மணல்","Clay":"களிமண்","Alluvial":"வண்டல் மண்" },
  hi: { "Red":"लाल","Black":"काली","Loamy":"दोमट","Sandy":"बलुई","Clay":"मिट्टी","Alluvial":"जलोढ़" },
};

const STATUS_TX = {
  ta: { "Healthy":"ஆரோக்கியம்","Disease Alert":"நோய் எச்சரிக்கை","Monitor":"கண்காணிக்கவும்","Harvested":"அறுவடை","Fallow":"தரிசு நிலம்" },
  hi: { "Healthy":"स्वस्थ","Disease Alert":"रोग चेतावनी","Monitor":"निगरानी","Harvested":"कटाई","Fallow":"परती" },
};

const CROP_REQUIREMENTS = {
  Tomato:        { seeds: 0.15, N: 120, P: 60,  K: 60,  organic: 10, spacing: "60×45 cm",  waterLpD: 2000, duration: 90,  seedUnit: "g" },
  Rice:          { seeds: 20,   N: 120, P: 60,  K: 60,  organic: 5,  spacing: "20×15 cm",  waterLpD: 6000, duration: 120, seedUnit: "kg" },
  Wheat:         { seeds: 40,   N: 120, P: 60,  K: 40,  organic: 5,  spacing: "22×5 cm",   waterLpD: 3000, duration: 120, seedUnit: "kg" },
  Maize:         { seeds: 8,    N: 120, P: 60,  K: 40,  organic: 6,  spacing: "60×25 cm",  waterLpD: 3500, duration: 90,  seedUnit: "kg" },
  Cotton:        { seeds: 1.5,  N: 100, P: 50,  K: 50,  organic: 8,  spacing: "90×60 cm",  waterLpD: 2500, duration: 180, seedUnit: "kg" },
  Onion:         { seeds: 8,    N: 100, P: 50,  K: 50,  organic: 12, spacing: "15×10 cm",  waterLpD: 2000, duration: 120, seedUnit: "kg" },
  Potato:        { seeds: 1200, N: 150, P: 80,  K: 100, organic: 15, spacing: "60×20 cm",  waterLpD: 3000, duration: 90,  seedUnit: "kg" },
  Brinjal:       { seeds: 0.2,  N: 120, P: 60,  K: 60,  organic: 10, spacing: "75×60 cm",  waterLpD: 2000, duration: 120, seedUnit: "g" },
  Okra:          { seeds: 5,    N: 100, P: 50,  K: 50,  organic: 8,  spacing: "45×30 cm",  waterLpD: 2000, duration: 60,  seedUnit: "kg" },
  Groundnut:     { seeds: 60,   N: 25,  P: 50,  K: 50,  organic: 5,  spacing: "30×10 cm",  waterLpD: 2500, duration: 120, seedUnit: "kg" },
  Sugarcane:     { seeds: 5000, N: 250, P: 100, K: 120, organic: 20, spacing: "90×30 cm",  waterLpD: 8000, duration: 365, seedUnit: "setts" },
  Turmeric:      { seeds: 800,  N: 60,  P: 30,  K: 60,  organic: 15, spacing: "45×30 cm",  waterLpD: 3000, duration: 240, seedUnit: "kg" },
  Banana:        { seeds: 1100, N: 200, P: 60,  K: 300, organic: 20, spacing: "1.8×1.5 m", waterLpD: 5000, duration: 365, seedUnit: "suckers" },
  Mango:         { seeds: 100,  N: 500, P: 250, K: 500, organic: 25, spacing: "10×10 m",   waterLpD: 2000, duration: 1825,seedUnit: "plants" },
  Coconut:       { seeds: 60,   N: 500, P: 320, K: 1200,organic: 50, spacing: "7.5×7.5 m", waterLpD: 1500, duration: 2190,seedUnit: "nuts" },
  Ragi:          { seeds: 5,    N: 60,  P: 30,  K: 30,  organic: 4,  spacing: "22×10 cm",  waterLpD: 1500, duration: 120, seedUnit: "kg" },
  Bajra:         { seeds: 3,    N: 80,  P: 40,  K: 40,  organic: 4,  spacing: "45×15 cm",  waterLpD: 1500, duration: 90,  seedUnit: "kg" },
  "Toor Dal":    { seeds: 12,   N: 20,  P: 50,  K: 30,  organic: 5,  spacing: "90×30 cm",  waterLpD: 1800, duration: 150, seedUnit: "kg" },
  "Urad Dal":    { seeds: 10,   N: 20,  P: 40,  K: 20,  organic: 4,  spacing: "30×10 cm",  waterLpD: 1500, duration: 90,  seedUnit: "kg" },
  "Moong Dal":   { seeds: 8,    N: 20,  P: 40,  K: 20,  organic: 4,  spacing: "30×10 cm",  waterLpD: 1500, duration: 65,  seedUnit: "kg" },
  Sesame:        { seeds: 2,    N: 30,  P: 25,  K: 25,  organic: 3,  spacing: "30×10 cm",  waterLpD: 1200, duration: 90,  seedUnit: "kg" },
  "Green Chilli":{ seeds: 0.5,  N: 120, P: 60,  K: 60,  organic: 10, spacing: "60×45 cm",  waterLpD: 2000, duration: 90,  seedUnit: "g" },
  Carrot:        { seeds: 3,    N: 60,  P: 40,  K: 60,  organic: 8,  spacing: "30×10 cm",  waterLpD: 2000, duration: 90,  seedUnit: "kg" },
  Cauliflower:   { seeds: 0.4,  N: 120, P: 60,  K: 60,  organic: 12, spacing: "60×45 cm",  waterLpD: 2000, duration: 90,  seedUnit: "g" },
};

function calcRequirements(crop, acres) {
  const r = CROP_REQUIREMENTS[crop];
  if (!r || !acres || acres <= 0) return null;
  const a = parseFloat(acres);

  const sizeLabelKey =
    a < 1   ? "sizeLabelSmall"      :
    a < 5   ? "sizeLabelMedium"     :
    a < 15  ? "sizeLabelLarge"      :
              "sizeLabelCommercial";

  const totalN = +(r.N * a).toFixed(1);
  const totalP = +(r.P * a).toFixed(1);
  const totalK = +(r.K * a).toFixed(1);
  const urea   = +(totalN * 2.17).toFixed(1);
  const dap    = +(totalP * 2.17).toFixed(1);
  const mop    = +(totalK * 1.67).toFixed(1);

  const seedQty = r.seedUnit === "g"
    ? +((r.seeds * a) * 1000).toFixed(0) + " g"
    : +(r.seeds * a).toFixed(1) + " " + r.seedUnit;

  const organicT  = +(r.organic * a).toFixed(1);
  const organicB  = +(organicT * 20).toFixed(1);
  const waterPerDay = +(r.waterLpD * a / 1000).toFixed(1);

  const seedCost    = r.seedUnit === "g"
    ? Math.round((r.seeds * a * 1000) * 0.8)
    : Math.round(r.seeds * a * 80);
  const fertCost    = Math.round((urea * 7) + (dap * 27) + (mop * 18));
  const organicCost = Math.round(organicT * 1200);
  const totalCost   = seedCost + fertCost + organicCost;

  return {
    crop, acres: a, sizeLabelKey,
    seeds: seedQty, urea, dap, mop, totalN, totalP, totalK,
    organic: organicT, organicBags: organicB,
    waterPerDay, duration: r.duration, spacing: r.spacing,
    seedCost, fertCost, organicCost, totalCost,
  };
}

const TILE_LAYERS = {
  street:    { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",                                                                   attribution: "© OpenStreetMap contributors",          label: "🗺️ Map"       },
  satellite: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attribution: "© Esri, Maxar, Earthstar Geographics", label: "🛰️ Satellite" },
};

async function reverseGeocode(lat, lon) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      { headers: { "Accept-Language": "en" } }
    );
    return r.json();
  } catch { return null; }
}

async function forwardSearch(query) {
  try {
    const base = "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=in&limit=8";
    const [structured, freetext] = await Promise.all([
      fetch(`${base}&city=${encodeURIComponent(query)}&state=Tamil+Nadu`, { headers: { "Accept-Language": "en" } }).then(r => r.json()).catch(() => []),
      fetch(`${base}&q=${encodeURIComponent(query + " Tamil Nadu")}`,     { headers: { "Accept-Language": "en" } }).then(r => r.json()).catch(() => []),
    ]);
    const seen = new Set();
    const unique = [...structured, ...freetext].filter(r => {
      if (seen.has(r.place_id)) return false;
      seen.add(r.place_id); return true;
    });
    const q = query.toLowerCase();
    return unique.sort((a, b) => {
      const aName = (a.address?.city || a.address?.town || a.address?.village || a.display_name.split(",")[0]).toLowerCase();
      const bName = (b.address?.city || b.address?.town || b.address?.village || b.display_name.split(",")[0]).toLowerCase();
      const aE = aName === q ? 0 : aName.startsWith(q) ? 1 : 2;
      const bE = bName === q ? 0 : bName.startsWith(q) ? 1 : 2;
      if (aE !== bE) return aE - bE;
      const rank = { city: 0, town: 1, village: 2, suburb: 3, hamlet: 4 };
      return (rank[a.type] ?? 5) - (rank[b.type] ?? 5);
    });
  } catch { return []; }
}

function formatAddr(data) {
  if (!data?.address) return null;
  const a = data.address;
  const line1 = [a.hamlet, a.village, a.suburb, a.neighbourhood, a.road].filter(Boolean).join(", ") || data.display_name?.split(",")[0];
  const line2 = [a.town || a.city || a.county, a.state_district || a.district].filter(Boolean).join(", ");
  const line3 = [a.state, a.postcode].filter(Boolean).join(" – ");
  return { line1, line2, line3 };
}

// ─────────────────────────────────────────────────────────────────────────────
function FarmMap({ user, t, lang }) {
  const TX = L10N[lang] || L10N.en;

  // Translation helpers — fall back to English key if no translation
  const cropTx   = (key) => CROP_TX[lang]?.[key]   || key;
  const soilTx   = (key) => SOIL_TX[lang]?.[key]   || key;
  const statusTx = (key) => STATUS_TX[lang]?.[key] || TX[key.replace(" ","").toLowerCase()] || key;

  // ── Refs ────────────────────────────────────────────────────────────────────
  const mapRef       = useRef(null);
  const pickerMapRef = useRef(null);
  const mapInst      = useRef(null);
  const pickerInst   = useRef(null);
  const tileRef      = useRef(null);
  const pickerTile   = useRef(null);
  const farmMarkers  = useRef({});
  const rgTimer      = useRef(null);
  const srTimer      = useRef(null);
  const mainSrTimer  = useRef(null);
  const searchInputRef = useRef(null);

  // ── State ───────────────────────────────────────────────────────────────────
  const [farms,           setFarms]           = useState(() => Array.isArray(user?.farms) ? user.farms : []);
  const [pickerOpen,      setPickerOpen]       = useState(false);
  const [tileMode,        setTileMode]         = useState("street");
  const [confirmRemove,   setConfirmRemove]    = useState(null);
  const [analyseFarm,     setAnalyseFarm]      = useState(null);
  const [analyseCrop,     setAnalyseCrop]      = useState(""); // crop override in analysis

  const [mainSearch,      setMainSearch]       = useState("");
  const [mainResults,     setMainResults]      = useState([]);
  const [mainSearching,   setMainSearching]    = useState(false);
  const [mainShowSuggest, setMainShowSuggest]  = useState(false);
  const [mainFlownTo,     setMainFlownTo]      = useState(null);

  const [pickerLoaded,    setPickerLoaded]     = useState(false);
  const [pinMoving,       setPinMoving]        = useState(false);
  const [detectedAddr,    setDetectedAddr]     = useState(null);
  const [rgLoading,       setRgLoading]        = useState(false);
  const [gpsStatus,       setGpsStatus]        = useState("idle");
  const [searchQuery,     setSearchQuery]      = useState("");
  const [searchResults,   setSearchResults]    = useState([]);
  const [searching,       setSearching]        = useState(false);
  const [showSuggestions, setShowSuggestions]  = useState(false);
  const [pickerCoords,    setPickerCoords]     = useState(null);

  const [formFarm, setFormFarm] = useState({
    name: "", crop: CROP_OPTIONS[0], size: "", soilType: "Red", status: "Healthy",
  });

  // ── Open picker — destroy main map so it can re-init on close ──────────────
  const openPicker = useCallback(() => {
    if (mapInst.current) {
      mapInst.current.remove();
      mapInst.current = null;
    }
    setPickerOpen(true);
  }, []);

  // ── Init/re-init main map (runs on mount and when picker closes) ────────────
  const initMainMap = useCallback(() => {
    if (!mapRef.current || mapInst.current) return;
    const fallLat = user?.lat || 9.9252;
    const fallLon = user?.lon || 78.1198;
    const map     = L.map(mapRef.current, { zoomControl: true }).setView([fallLat, fallLon], 14);
    tileRef.current = L.tileLayer(TILE_LAYERS.street.url, {
      attribution: TILE_LAYERS.street.attribution, maxZoom: 21,
    }).addTo(map);

    const dotIcon = (pulse) => L.divIcon({
      html: pulse
        ? `<div style="position:relative;width:20px;height:20px">
             <div style="position:absolute;inset:0;border-radius:50%;background:rgba(26,122,58,.25);animation:gps-pulse 1.4s ease-out infinite"></div>
             <div style="position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:#1a7a3a;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.5)"></div>
           </div>
           <style>@keyframes gps-pulse{0%{transform:scale(1);opacity:.8}100%{transform:scale(2.8);opacity:0}}</style>`
        : `<div style="background:#1a7a3a;width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.5)"></div>`,
      iconSize: [20, 20], iconAnchor: [10, 10], className: "",
    });

    const userMarker = L.marker([fallLat, fallLon], { icon: dotIcon(false) })
      .addTo(map)
      .bindPopup(`<b>📍 ${user?.name || "Your Location"}</b><br>${user?.district || ""}`);

    farms.forEach(f => { if (f?.lat && f?.lon) _addViewMarker(L, map, f); });
    mapInst.current = map;

    if (navigator.geolocation) {
      userMarker.setIcon(dotIcon(true));
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude: gLat, longitude: gLon, accuracy } = pos.coords;
          userMarker.setLatLng([gLat, gLon]);
          userMarker.setIcon(dotIcon(false));
          userMarker.bindPopup(
            `<b>📍 ${user?.name || "You"}</b><br>${user?.district || ""}<br>` +
            `<span style="font-size:10px;color:#888">GPS accuracy: ±${Math.round(accuracy)}m</span>`
          );
          if (map._gpsCircle) map._gpsCircle.remove();
          map._gpsCircle = L.circle([gLat, gLon], {
            radius: accuracy, color: "#1a7a3a", fillColor: "#1a7a3a",
            fillOpacity: 0.08, weight: 1.5, dashArray: "4 4",
          }).addTo(map);
          map.flyTo([gLat, gLon], 16, { animate: true, duration: 1.6 });
        },
        () => userMarker.setIcon(dotIcon(false)),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
    }
  }, [farms, user]); // eslint-disable-line

  // Trigger map init on first load
  useEffect(() => { initMainMap(); }, [initMainMap]);

  // ── Re-init main map after picker closes ───────────────────────────────────
  useEffect(() => {
    if (!pickerOpen) {
      // Small delay for React to re-render the map div
      const t = setTimeout(() => { initMainMap(); }, 80);
      return () => clearTimeout(t);
    }
  }, [pickerOpen, initMainMap]);

  // ── Main map tile toggle ────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapInst.current;
    if (!map) return;
    tileRef.current?.remove();
    tileRef.current = L.tileLayer(TILE_LAYERS[tileMode].url, {
      attribution: TILE_LAYERS[tileMode].attribution, maxZoom: 21,
    }).addTo(map);
  }, [tileMode]);

  // ── Picker map init ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!pickerOpen) return;
    const tid = setTimeout(async () => {
      if (!pickerMapRef.current || pickerInst.current) return;
      const lastFarm = farms.length > 0 ? farms[farms.length - 1] : null;
      let startLat = lastFarm?.lat ?? user?.lat ?? null;
      let startLon = lastFarm?.lon ?? user?.lon ?? null;
      let startZoom = lastFarm ? 16 : 14;

      if (!startLat && user?.district) {
        try {
          const res  = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(user.district + ", Tamil Nadu, India")}&limit=1`, { headers: { "Accept-Language": "en" } });
          const data = await res.json();
          if (data[0]) { startLat = parseFloat(data[0].lat); startLon = parseFloat(data[0].lon); startZoom = 13; }
        } catch (_) {}
      }
      startLat = startLat ?? 10.8505;
      startLon = startLon ?? 77.0;

      const map = L.map(pickerMapRef.current, { zoomControl: false }).setView([startLat, startLon], startZoom);
      map.on("movestart", () => setPinMoving(true));
      map.on("moveend", () => {
        setPinMoving(false);
        const { lat: la, lng: lo } = map.getCenter();
        setPickerCoords({ lat: la, lon: lo });
        clearTimeout(rgTimer.current);
        setRgLoading(true);
        rgTimer.current = setTimeout(async () => {
          const r = await reverseGeocode(la, lo);
          setDetectedAddr(r); setRgLoading(false);
        }, 400);
      });

      pickerTile.current = L.tileLayer(TILE_LAYERS[tileMode].url, {
        attribution: TILE_LAYERS[tileMode].attribution, maxZoom: 21,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      pickerInst.current = map;
      setPickerLoaded(true);
      setGpsStatus("idle");
      setRgLoading(true);
      setPickerCoords({ lat: startLat, lon: startLon });
      reverseGeocode(startLat, startLon).then(r => { setDetectedAddr(r); setRgLoading(false); });
      setTimeout(() => searchInputRef.current?.focus(), 300);
    }, 80);
    return () => clearTimeout(tid);
  }, [pickerOpen]); // eslint-disable-line

  // ── Picker tile toggle ──────────────────────────────────────────────────────
  useEffect(() => {
    const map = pickerInst.current;
    if (!map) return;
    pickerTile.current?.remove();
    pickerTile.current = L.tileLayer(TILE_LAYERS[tileMode].url, {
      attribution: TILE_LAYERS[tileMode].attribution, maxZoom: 21,
    }).addTo(map);
  }, [tileMode]);

  // ── Destroy picker on close ─────────────────────────────────────────────────
  useEffect(() => {
    if (!pickerOpen && pickerInst.current) {
      pickerInst.current.remove();
      pickerInst.current = null;
      setPickerLoaded(false);
      setDetectedAddr(null);
      setPickerCoords(null);
      setSearchQuery("");
      setSearchResults([]);
      setShowSuggestions(false);
      setGpsStatus("idle");
    }
  }, [pickerOpen]);

  // ── Invalidate map size when analysis panel closes ────────────────────────
  // When analyseFarm is set the map div is display:none — Leaflet loses
  // its container dimensions. When analyseFarm → null the div is display:block
  // again but Leaflet doesn't know, so we call invalidateSize after repaint.
  useEffect(() => {
    if (!analyseFarm && mapInst.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          mapInst.current?.invalidateSize({ animate: false });
        });
      });
    }
  }, [analyseFarm]);

  // ── GPS ─────────────────────────────────────────────────────────────────────
  const handleGPS = useCallback(() => {
    if (!navigator.geolocation) { setGpsStatus("error"); return; }
    setGpsStatus("loading");
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGpsStatus("done");
        pickerInst.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 18, { animate: true, duration: 1.2 });
        setTimeout(() => setGpsStatus("idle"), 2500);
      },
      () => { setGpsStatus("error"); setTimeout(() => setGpsStatus("idle"), 2500); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // ── Picker search ───────────────────────────────────────────────────────────
  const handleSearchInput = val => {
    setSearchQuery(val);
    clearTimeout(srTimer.current);
    if (val.length < 3) { setSearchResults([]); setShowSuggestions(false); return; }
    setSearching(true);
    srTimer.current = setTimeout(async () => {
      const r = await forwardSearch(val);
      setSearchResults(r); setShowSuggestions(true); setSearching(false);
    }, 450);
  };

  const selectResult = r => {
    pickerInst.current?.flyTo([parseFloat(r.lat), parseFloat(r.lon)], 17, { animate: true, duration: 1 });
    setSearchQuery(r.display_name.split(",")[0]);
    setSearchResults([]); setShowSuggestions(false);
  };

  // ── Main map search ─────────────────────────────────────────────────────────
  const handleMainSearch = val => {
    setMainSearch(val); setMainFlownTo(null); clearTimeout(mainSrTimer.current);
    if (val.length < 2) { setMainResults([]); setMainShowSuggest(false); return; }
    setMainSearching(true);
    mainSrTimer.current = setTimeout(async () => {
      const r = await forwardSearch(val);
      setMainResults(r); setMainShowSuggest(true); setMainSearching(false);
    }, 400);
  };

  const selectMainResult = r => {
    const lat = parseFloat(r.lat), lon = parseFloat(r.lon);
    mapInst.current?.flyTo([lat, lon], 16, { animate: true, duration: 1.5 });
    setMainSearch(r.display_name.split(",")[0]);
    setMainResults([]); setMainShowSuggest(false);
    setMainFlownTo(r.display_name.split(",")[0]);
  };

  // ── Save farm ───────────────────────────────────────────────────────────────
  const confirmSave = () => {
    if (!formFarm.name || !formFarm.crop || !pickerCoords) return;
    const addr = formatAddr(detectedAddr);
    const farm = {
      id: Date.now(), ...formFarm,
      lat: pickerCoords.lat, lon: pickerCoords.lon,
      address: addr ? `${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}` : "",
      addedOn: new Date().toLocaleDateString("en-IN"),
    };
    const updated = [...farms, farm];
    setFarms(updated);
    const users = S.get("users") || [];
    const idx   = users.findIndex(u => u.id === user?.id);
    if (idx >= 0) { users[idx].farms = updated; S.set("users", users); S.set("current_user", users[idx]); }
    setFormFarm({ name: "", crop: CROP_OPTIONS[0], size: "", soilType: "Red", status: "Healthy" });
    setPickerOpen(false); // map will re-init via useEffect
  };

  const _addViewMarker = (L, map, farm) => {
    const fc = farm.status === "Healthy" ? "#1a7a3a" : farm.status === "Disease Alert" ? "#b83232" : "#c87010";
    const m  = L.marker([farm.lat, farm.lon], {
      icon: L.divIcon({
        html: `<div style="background:${fc};color:#fff;padding:4px 9px;border-radius:6px;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.35)">${cropTx(farm.crop)}</div>`,
        className: "",
      }),
    }).addTo(map).bindPopup(
      `<b>${farm.name}</b><br>` +
      (farm.address ? `<span style="color:#555;font-size:11px">📍 ${farm.address}</span><br>` : "") +
      `${TX.crop}: ${cropTx(farm.crop)} · ${farm.size} ${TX.acres}<br>${TX.status}: ${statusTx(farm.status)}<br>` +
      `<span style="font-size:10px;color:#aaa">${farm.lat.toFixed(5)}, ${farm.lon.toFixed(5)}</span>`
    );
    farmMarkers.current[farm.id] = m;
  };

  const removeFarm = id => {
    farmMarkers.current[id]?.remove();
    delete farmMarkers.current[id];
    const updated = farms.filter(f => f.id !== id);
    setFarms(updated); setConfirmRemove(null);
    const users = S.get("users") || [];
    const idx   = users.findIndex(u => u.id === user?.id);
    if (idx >= 0) { users[idx].farms = updated; S.set("users", users); S.set("current_user", users[idx]); }
  };

  const statusColor = { Healthy: C.bg2, "Disease Alert": C.red, Monitor: C.orange };
  const statusBg    = { Healthy: C.pale, "Disease Alert": "#fff0f0", Monitor: "#fff8ee" };
  const addr        = formatAddr(detectedAddr);

  const gpsLabel = {
    idle:    TX.myLocation,
    loading: TX.locating,
    done:    TX.located,
    error:   TX.locFailed,
  };

  const fieldConditions = [
    { label: TX.temp,        val: "32°C",              risk: "Low"    },
    { label: TX.humidity,    val: "72%",               risk: "Medium" },
    { label: TX.pestRisk,    val: TX.pestMod,          risk: "Medium" },
    { label: TX.diseaseRisk, val: TX.riskHigh,         risk: "High"   },
    { label: TX.irrigation,  val: TX.irrigTomorrow,    risk: ""       },
  ];

  // Analysis
  const effectiveCrop = analyseCrop || analyseFarm?.crop || CROP_OPTIONS[0];
  const analysisReq   = analyseFarm ? calcRequirements(effectiveCrop, analyseFarm.size) : null;

  const AnalysisROW = ({ label, val, sub, color }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.border || "#eee"}` }}>
      <div>
        <div style={{ fontSize: 13, color: C.muted }}>{label}</div>
        {sub && <div style={{ fontSize: 10.5, color: "#bbb", marginTop: 1 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: color || C.text }}>{val}</div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // PICKER SCREEN (full page, separate from main)
  // ═══════════════════════════════════════════════════════════════════════════
  if (pickerOpen) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f4f6f8" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#fff", borderBottom: "1px solid #e8e8e8", boxShadow: "0 2px 6px rgba(0,0,0,.08)", flexShrink: 0 }}>
          <button onClick={() => setPickerOpen(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#333", lineHeight: 1, padding: "2px 6px 2px 0" }}>
            {TX.back}
          </button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{TX.selectFarm}</div>
            <div style={{ fontSize: 11.5, color: "#999" }}>{TX.pickerHint}</div>
          </div>
        </div>

        {/* Map */}
        <div style={{ position: "relative", flex: "0 0 420px" }}>
          <div ref={pickerMapRef} style={{ width: "100%", height: 420 }} />

          {/* Floating search */}
          <div style={{ position: "absolute", top: 12, left: 12, right: 12, zIndex: 1000 }}>
            <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 14, padding: "0 14px", boxShadow: "0 4px 20px rgba(0,0,0,.18)", border: "1px solid #e4e4e4" }}>
              <span style={{ fontSize: 16, color: "#aaa", marginRight: 8 }}>🔍</span>
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={e => handleSearchInput(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSuggestions(true)}
                placeholder={TX.searchPlaceholder}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 13.5, padding: "13px 0", background: "transparent", color: "#222" }}
              />
              {searching && <span style={{ fontSize: 11, color: "#ccc" }}>…</span>}
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setSearchResults([]); setShowSuggestions(false); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 17 }}>✕</button>
              )}
            </div>

            {showSuggestions && searchResults.length > 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0, background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,.16)", zIndex: 9999, maxHeight: 260, overflowY: "auto" }}>
                {searchResults.map((r, i) => {
                  const a    = r.address || {};
                  const name = a.hamlet || a.village || a.town || a.city || r.display_name.split(",")[0];
                  const sub  = [a.county || a.district, a.state].filter(Boolean).join(", ");
                  return (
                    <div key={i} onClick={() => selectResult(r)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", borderBottom: i < searchResults.length - 1 ? "1px solid #f2f2f2" : "none" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f6fdf7"}
                      onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📍</div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1a1a" }}>{name}</div>
                        <div style={{ fontSize: 11.5, color: "#999", marginTop: 1 }}>{sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tile toggle */}
          <div style={{ position: "absolute", bottom: 52, left: 12, zIndex: 999, display: "flex", gap: 6 }}>
            {Object.entries(TILE_LAYERS).map(([key, layer]) => (
              <button key={key} onClick={() => setTileMode(key)} style={{ padding: "5px 11px", borderRadius: 8, fontSize: 11.5, fontWeight: 600, border: "none", cursor: "pointer", background: tileMode === key ? "#1a7a3a" : "rgba(255,255,255,.93)", color: tileMode === key ? "#fff" : "#333", boxShadow: "0 2px 8px rgba(0,0,0,.18)" }}>
                {layer.label}
              </button>
            ))}
          </div>

          {/* GPS button */}
          <button onClick={handleGPS} disabled={gpsStatus === "loading"} style={{ position: "absolute", bottom: 96, right: 12, zIndex: 999, background: gpsStatus === "done" ? "#1a7a3a" : gpsStatus === "error" ? "#b83232" : "#fff", color: gpsStatus === "idle" ? "#1a7a3a" : "#fff", border: "none", borderRadius: 12, padding: "10px 14px", fontSize: 12.5, fontWeight: 700, cursor: gpsStatus === "loading" ? "wait" : "pointer", boxShadow: "0 3px 12px rgba(0,0,0,.2)" }}>
            {gpsLabel[gpsStatus] || TX.myLocation}
          </button>

          {/* Center pin */}
          {pickerLoaded && (
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, -100%) ${pinMoving ? "translateY(-8px)" : ""}`, zIndex: 1000, pointerEvents: "none", transition: "transform 0.15s cubic-bezier(.4,0,.2,1)" }}>
              <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: pinMoving ? 16 : 10, height: pinMoving ? 6 : 4, borderRadius: "50%", background: "rgba(0,0,0,.22)", filter: "blur(3px)", transition: "all .15s ease" }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ background: "#1a7a3a", color: "#fff", padding: "7px 12px", borderRadius: 10, fontSize: 12.5, fontWeight: 700, boxShadow: "0 4px 16px rgba(0,0,0,.28)", whiteSpace: "nowrap", opacity: pinMoving ? 0.75 : 1, transition: "opacity .15s" }}>
                  {pinMoving ? TX.pinMoving : TX.pinHere}
                </div>
                <div style={{ width: 2.5, height: 16, background: "#1a7a3a" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a7a3a", marginTop: -1, boxShadow: "0 0 0 3px rgba(26,122,58,.3)" }} />
              </div>
            </div>
          )}
          {pickerLoaded && (
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 999 }}>
              {[70, 38].map(sz => (
                <div key={sz} style={{ width: sz, height: sz, borderRadius: "50%", border: "1px solid rgba(26,122,58,0.3)", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
              ))}
            </div>
          )}
        </div>

        {/* Form panel */}
        <div style={{ background: "#fff", flex: 1, padding: "0 16px 30px", overflowY: "auto" }}>
          {/* Detected address */}
          <div style={{ margin: "12px 0 12px", padding: "12px 14px", borderRadius: 12, background: "#f7fdf9", border: "1px solid #c8e6c9", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ fontSize: 22, marginTop: 2 }}>📍</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {rgLoading
                ? <div style={{ color: "#aaa", fontSize: 12.5 }}>{TX.detecting}</div>
                : addr
                  ? <>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#133320" }}>{addr.line1}</div>
                      <div style={{ fontSize: 12, color: "#3a6e50", marginTop: 1 }}>{addr.line2}</div>
                      <div style={{ fontSize: 11.5, color: "#888", marginTop: 1 }}>{addr.line3}</div>
                    </>
                  : <div style={{ color: "#aaa", fontSize: 12.5 }}>{TX.searchHint}</div>
              }
              {pickerCoords && (
                <div style={{ fontSize: 10, color: "#bbb", marginTop: 4, fontFamily: "monospace" }}>
                  {pickerCoords.lat.toFixed(6)}, {pickerCoords.lon.toFixed(6)}
                </div>
              )}
            </div>
            <button onClick={handleGPS} style={{ flexShrink: 0, background: "#f5f5f5", border: "1px solid #ddd", borderRadius: 8, padding: "7px 10px", fontSize: 11, fontWeight: 700, color: "#666", cursor: "pointer", lineHeight: 1.3, textAlign: "center" }}>
              📡<br />{TX.gps}
            </button>
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 10 }}>{TX.farmDetails}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <Input label={TX.plotName} value={formFarm.name}
              onChange={e => setFormFarm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. North Field" />

            {/* Crop — native select so we can show translated labels */}
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{TX.crop}</div>
              <select
                value={formFarm.crop}
                onChange={e => setFormFarm(p => ({ ...p, crop: e.target.value }))}
                style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, background: "#fff", color: C.text, outline: "none" }}
              >
                {CROP_OPTIONS.map(c => <option key={c} value={c}>{cropTx(c)}</option>)}
              </select>
            </div>

            <Input label={`${TX.area} (${TX.acres})`} value={formFarm.size} type="number"
              onChange={e => setFormFarm(p => ({ ...p, size: e.target.value }))}
              placeholder="e.g. 2.5" />

            {/* Soil Type — native select */}
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{TX.soilType}</div>
              <select
                value={formFarm.soilType}
                onChange={e => setFormFarm(p => ({ ...p, soilType: e.target.value }))}
                style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, background: "#fff", color: C.text, outline: "none" }}
              >
                {SOIL_TYPES.map(s => <option key={s} value={s}>{soilTx(s)}</option>)}
              </select>
            </div>

            {/* Status — native select */}
            <div style={{ gridColumn: "span 2" }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{TX.status}</div>
              <select
                value={formFarm.status}
                onChange={e => setFormFarm(p => ({ ...p, status: e.target.value }))}
                style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, background: "#fff", color: C.text, outline: "none" }}
              >
                {FARM_STATUSES.map(s => <option key={s} value={s}>{statusTx(s)}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button
              onClick={confirmSave}
              disabled={!formFarm.name || !pickerCoords}
              style={{ flex: 1, padding: "15px", borderRadius: 13, border: "none", background: formFarm.name && pickerCoords ? "#1a7a3a" : "#d0d0d0", color: "#fff", fontSize: 15, fontWeight: 700, cursor: formFarm.name && pickerCoords ? "pointer" : "not-allowed", boxShadow: formFarm.name && pickerCoords ? "0 5px 14px rgba(26,122,58,.35)" : "none", transition: "all .2s" }}
            >
              {TX.confirm}
            </button>
            <button onClick={() => setPickerOpen(false)} style={{ padding: "15px 20px", borderRadius: 13, border: "1px solid #ddd", background: "#fff", fontSize: 14, fontWeight: 600, color: "#666", cursor: "pointer" }}>
              {TX.cancel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ padding: 20 }}>

      {/* ── ANALYSIS PANEL ──────────────────────────────────────────────────── */}
      {analyseFarm && (
        <div style={{ maxWidth: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <button onClick={() => { setAnalyseFarm(null); setAnalyseCrop(""); }}
              style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.text, padding: "2px 6px 2px 0" }}>
              {TX.back}
            </button>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>{TX.analysisTitle}</h2>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                {analyseFarm.name} · {analyseFarm.size} {TX.acres}
              </div>
            </div>
          </div>

          {/* ── Crop selector for analysis ─────────────────────────────────── */}
          <Card style={{ padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>
              🌾 {TX.analyseCrop}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
              {CROP_OPTIONS.map(c => (
                <button key={c} onClick={() => setAnalyseCrop(c)} style={{
                  padding: "6px 4px", borderRadius: 7, fontSize: 11.5, cursor: "pointer",
                  border:     `1.5px solid ${effectiveCrop === c ? "#1a7a3a" : C.border}`,
                  background: effectiveCrop === c ? "#e8f5e9" : C.white,
                  color:      effectiveCrop === c ? "#1a7a3a" : C.muted,
                  fontWeight: effectiveCrop === c ? 700 : 400,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {cropTx(c)}
                </button>
              ))}
            </div>
          </Card>

          {/* Classification banner */}
          <div style={{ background: "linear-gradient(135deg,#1a7a3a,#0e4a22)", borderRadius: 14, padding: "16px 20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>{TX.classification}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 3 }}>
                {analysisReq ? TX[analysisReq.sizeLabelKey] : "—"}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginTop: 4 }}>
                {TX.crop}: <b style={{ color: "#5de87a" }}>{cropTx(effectiveCrop)}</b>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>{TX.duration}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#5de87a", marginTop: 3 }}>
                {analysisReq ? `${analysisReq.duration} ${TX.days}` : "—"}
              </div>
            </div>
          </div>

          {!analysisReq ? (
            <div style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 12, padding: 18, fontSize: 13, color: "#7a5800", textAlign: "center" }}>
              {TX.noSize}
            </div>
          ) : (
            <>
              {/* 3-chip summary */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[
                  { emoji: "🌱", label: TX.seeds,    val: analysisReq.seeds,              bg: "#dbf2dd", col: "#1a7a3a" },
                  { emoji: "💧", label: TX.waterDay,  val: `${analysisReq.waterPerDay} kL`, bg: "#d4e6f4", col: "#1565c0" },
                  { emoji: "📐", label: TX.spacing,   val: analysisReq.spacing,            bg: "#f3e5f5", col: "#6a1b9a" },
                ].map(c => (
                  <div key={c.label} style={{ background: c.bg, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 22 }}>{c.emoji}</div>
                    <div style={{ fontSize: 10.5, color: "#888", marginTop: 4 }}>{c.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: c.col, marginTop: 3 }}>{c.val}</div>
                  </div>
                ))}
              </div>

              {/* Seeds */}
              <div style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 12, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a7a3a", marginBottom: 4 }}>{TX.seedsMaterial}</div>
                <AnalysisROW label={TX.qtyReq}    val={analysisReq.seeds} />
                <AnalysisROW label={TX.seedCost}  val={`₹${analysisReq.seedCost.toLocaleString("en-IN")}`} color="#c87010" />
              </div>

              {/* Fertilisers */}
              <div style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 12, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a7a3a", marginBottom: 4 }}>{TX.fertilisers}</div>
                <AnalysisROW label={TX.urea} val={`${analysisReq.urea} kg`}  sub={`${analysisReq.totalN} kg N — ${TX.splitNote}`} />
                <AnalysisROW label={TX.dap}  val={`${analysisReq.dap} kg`}   sub={`${analysisReq.totalP} kg P — ${TX.applyAtSow}`} />
                <AnalysisROW label={TX.mop}  val={`${analysisReq.mop} kg`}   sub={`${analysisReq.totalK} kg K — ${TX.applyAtSow}`} />
                <AnalysisROW label={TX.fertCost} val={`₹${analysisReq.fertCost.toLocaleString("en-IN")}`} color="#c87010" />
              </div>

              {/* Organic */}
              <div style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 12, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a7a3a", marginBottom: 4 }}>{TX.organic}</div>
                <AnalysisROW label={TX.orgQty}  val={`${analysisReq.organic} ${TX.tonnes}`} />
                <AnalysisROW label={TX.orgBags} val={`${analysisReq.organicBags} ${TX.bags}`} sub={TX.bags50} />
                <AnalysisROW label={TX.orgCost} val={`₹${analysisReq.organicCost.toLocaleString("en-IN")}`} color="#c87010" />
              </div>

              {/* Water */}
              <div style={{ background: "#e3f2fd", borderRadius: 12, padding: "14px 16px", marginBottom: 12, border: "1px solid #90caf9" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1565c0", marginBottom: 4 }}>{TX.water}</div>
                <AnalysisROW label={TX.dailyIrr}   val={`${analysisReq.waterPerDay} kL/day`} />
                <AnalysisROW label={TX.totalWater}  val={`${+(analysisReq.waterPerDay * analysisReq.duration).toFixed(0)} kL`}
                  sub={TX.overCropPeriod.replace("{d}", analysisReq.duration)} />
              </div>

              {/* Total cost */}
              <div style={{ background: "linear-gradient(135deg,#fff8e1,#fff3cd)", borderRadius: 12, padding: "16px 20px", marginBottom: 14, border: "1px solid #ffe082", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, color: "#7a5800", fontWeight: 600 }}>{TX.totalCost}</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{TX.costNote}</div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#e65100" }}>
                  ₹{analysisReq.totalCost.toLocaleString("en-IN")}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── MAIN MAP VIEW — display:none keeps mapRef in DOM so Leaflet never loses its container ── */}
      <div style={{ display: analyseFarm ? "none" : "block" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 600, color: C.text, margin: 0 }}>🗺️ {TX.title}</h1>
              <p style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>{TX.subtitle}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setTileMode(m => m === "street" ? "satellite" : "street")} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: tileMode === "satellite" ? "#1a1a2e" : "#fff", color: tileMode === "satellite" ? "#7dd87d" : C.text, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                {TILE_LAYERS[tileMode === "satellite" ? "street" : "satellite"].label}
              </button>
              <Btn onClick={openPicker} variant="primary">{TX.addPlot}</Btn>
            </div>
          </div>

          {/* Main map search bar */}
          <div style={{ position: "relative", marginBottom: 12, maxWidth: 420 }}>
            <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 12, border: `1.5px solid ${mainSearch ? C.bg2 : C.border}`, padding: "0 14px", boxShadow: mainSearch ? "0 2px 12px rgba(26,122,58,.15)" : "0 1px 4px rgba(0,0,0,.08)", transition: "all 0.2s" }}>
              <span style={{ fontSize: 16, color: mainSearch ? C.bg2 : "#bbb", marginRight: 8, flexShrink: 0 }}>🔍</span>
              <input
                value={mainSearch}
                onChange={e => handleMainSearch(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && mainResults.length > 0) selectMainResult(mainResults[0]); }}
                onFocus={() => mainResults.length > 0 && setMainShowSuggest(true)}
                onBlur={() => setTimeout(() => setMainShowSuggest(false), 180)}
                placeholder={TX.searchPlaceholder}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 13.5, padding: "11px 0", background: "transparent", color: "#222" }}
              />
              {mainSearching && <span style={{ fontSize: 12, color: C.muted }}>{TX.searching}</span>}
              {mainSearch && !mainSearching && (
                <button onClick={() => { setMainSearch(""); setMainResults([]); setMainShowSuggest(false); setMainFlownTo(null); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 17 }}>✕</button>
              )}
            </div>
            {mainFlownTo && (
              <div style={{ marginTop: 6, padding: "6px 12px", background: "#e8f5e9", borderRadius: 8, fontSize: 12.5, color: C.bg2, fontWeight: 500 }}>
                ✅ {TX.flyingTo}: <strong>{mainFlownTo}</strong>
              </div>
            )}
            {mainShowSuggest && mainResults.length > 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", borderRadius: 12, border: `1px solid ${C.border}`, boxShadow: "0 8px 24px rgba(0,0,0,.14)", zIndex: 9999, overflow: "hidden", maxHeight: 280, overflowY: "auto" }}>
                {mainResults.map((r, i) => {
                  const a    = r.address || {};
                  const name = a.hamlet || a.village || a.town || a.city || r.display_name.split(",")[0];
                  const sub  = [a.county || a.district, a.state_district, a.state].filter(Boolean).join(", ");
                  const icon = a.hamlet ? "🏘️" : a.village ? "🌾" : a.town ? "🏙️" : "📍";
                  return (
                    <div key={i} onMouseDown={() => selectMainResult(r)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", cursor: "pointer", borderBottom: i < mainResults.length - 1 ? `1px solid ${C.border}` : "none", background: "#fff", transition: "background 0.1s" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.pale}
                      onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: C.pale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{icon}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {mainShowSuggest && !mainSearching && mainResults.length === 0 && mainSearch.length >= 2 && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", borderRadius: 10, border: `1px solid ${C.border}`, padding: "14px 16px", fontSize: 13, color: C.muted, textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,.08)", zIndex: 9999 }}>
                {TX.notFound}
              </div>
            )}
          </div>

          {/* Map + Side panel */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14 }}>
            <Card style={{ padding: 0, overflow: "hidden", position: "relative" }}>
              <div ref={mapRef} style={{ height: 480 }} />
              <div style={{ position: "absolute", bottom: 12, left: 12, zIndex: 999, display: "flex", gap: 6 }}>
                {Object.entries(TILE_LAYERS).map(([key, layer]) => (
                  <button key={key} onClick={() => setTileMode(key)} style={{ padding: "5px 10px", borderRadius: 6, fontSize: 11.5, fontWeight: 600, border: "none", cursor: "pointer", background: tileMode === key ? "#1a7a3a" : "rgba(255,255,255,.9)", color: tileMode === key ? "#fff" : "#333", boxShadow: "0 2px 6px rgba(0,0,0,.2)" }}>
                    {layer.label}
                  </button>
                ))}
              </div>
            </Card>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Farm list */}
              <Card style={{ padding: 12 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, marginBottom: 8 }}>
                  {TX.yourFarms} ({farms.length})
                </div>
                {farms.length === 0 && (
                  <div style={{ fontSize: 12, color: C.muted, textAlign: "center", padding: "16px 0" }}>
                    {TX.noFarms}<br />
                    <span style={{ fontSize: 11.5 }}>{TX.addFirst}</span>
                  </div>
                )}
                {farms.map(f => (
                  <div key={f.id} style={{ padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{f.name}</div>
                        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>
                          {cropTx(f.crop)} · {f.size} {TX.acres} · {soilTx(f.soilType)}
                        </div>
                        {f.address && (
                          <div style={{ fontSize: 11, color: "#888", marginTop: 2, lineHeight: 1.4 }}>📍 {f.address}</div>
                        )}
                        <div style={{ fontSize: 10, color: "#ccc", marginTop: 2, fontFamily: "monospace" }}>
                          {f.lat?.toFixed(5)}, {f.lon?.toFixed(5)}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                        <Badge color={statusColor[f.status] || C.muted} bg={statusBg[f.status] || C.pale}>
                          {statusTx(f.status)}
                        </Badge>
                        {confirmRemove === f.id ? (
                          <div style={{ display: "flex", gap: 4 }}>
                            <button onClick={() => removeFarm(f.id)} style={{ padding: "3px 9px", borderRadius: 6, border: "none", background: "#b83232", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                              {TX.confirmDelete}
                            </button>
                            <button onClick={() => setConfirmRemove(null)} style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", fontSize: 11, cursor: "pointer", color: "#555" }}>
                              {TX.no}
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: 4 }}>
                            <button onClick={() => { setAnalyseFarm(f); setAnalyseCrop(f.crop); }} style={{ padding: "3px 9px", borderRadius: 6, border: "1px solid #b2dfdb", background: "#e8f5e9", color: "#1a7a3a", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                              {TX.analyse}
                            </button>
                            <button onClick={() => setConfirmRemove(f.id)} style={{ padding: "3px 9px", borderRadius: 6, border: "1px solid #f0c0c0", background: "#fff8f8", color: "#b83232", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
                              {TX.remove}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Field conditions */}
              <Card style={{ padding: 12, background: C.pale }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, marginBottom: 8 }}>{TX.fieldConds}</div>
                {fieldConditions.map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12.5 }}>
                    <span style={{ color: C.muted }}>{r.label}</span>
                    <span style={{ fontWeight: 500, color: r.risk === "High" ? C.red : r.risk === "Medium" ? C.orange : C.text }}>{r.val}</span>
                  </div>
                ))}
              </Card>

              {/* NDVI */}
              <Card style={{ padding: 12, background: "linear-gradient(135deg,#0e3a1c,#062010)", border: "none" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 6 }}>{TX.ndvi}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", lineHeight: 1.6 }}>
                  {TX.ndviHealthIdx}: <span style={{ color: "#5de87a", fontWeight: 600 }}>0.72 ({TX.ndviGood})</span><br />
                  {TX.ndviLastPass}: {TX.ndviToday} 10:32 AM<br />
                  {TX.ndviCloud}: 18%
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                  {[{ c: "#1a7a3a", l: TX.healthy }, { c: "#c87010", l: TX.ndviStress }, { c: "#b83232", l: TX.diseaseAlert }].map(s => (
                    <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, color: "rgba(255,255,255,.6)" }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: s.c }} />{s.l}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
      </div>{/* end main map view */}
    </div>
  );
}

export default FarmMap;