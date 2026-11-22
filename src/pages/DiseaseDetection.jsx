// src/pages/DiseaseDetection.jsx
import { useRef, useState } from "react";
import C from "../constants/colors";
import S from "../utils/storage";
import { CROPS_ALL } from "../constants/crops";
import { DISEASE_TEMPLATES, SHOPS_DATA } from "../constants/data";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Btn from "../components/ui/Btn";

// ─── Disease list per crop ────────────────────────────────────────────────────
const CROP_DISEASES = {
  "Tomato":     ["Early Blight","Late Blight","Yellow Leaf Curl Virus","Mosaic Virus","Target Spot","Leaf Mold","Septoria Leaf Spot","Healthy"],
  "Rice":       ["Blast Disease","Brown Spot","Sheath Blight","Sheath Rot","Bacterial Leaf Streak","Rice Tungro Virus","False Smut","Healthy"],
  "Wheat":      ["Yellow Rust","Brown Rust","Alternaria Leaf Blight","Loose Smut","Powdery Mildew","Wheat Blast","Foot Rot","Healthy"],
  "Maize":      ["Turcicum Leaf Blight","Gray Leaf Spot","Bacterial Stalk Rot","Fusarium Rot","Common Smut","Brown Spot","Maize Dwarf Mosaic","Healthy"],
  "Potato":     ["Late Blight","Early Blight","Black Scurf","Fusarium Dry Rot","Verticillium Wilt","Common Scab","Potato Virus Y","Healthy"],
  "Banana":     ["Sigatoka Leaf Spot","Panama Disease","Black Sigatoka","Banana Bunchy Top","Bract Mosaic Virus","Anthracnose","Erwinia Rot","Healthy"],
  "Sugarcane":  ["Red Rot","Whip Smut","Pokkah Boeng","Pineapple Disease","Gummosis","Grassy Shoot","Mosaic Virus","Healthy"],
  "Okra":       ["Yellow Vein Mosaic Virus","Enation Leaf Curl","Damping-off","Charcoal Rot","Anthracnose","Cercospora Leaf Spot","Fusarium Wilt","Healthy"],
  "Brinjal":    ["Bacterial Wilt","Shoot and Fruit Borer","Phomopsis Blight","Cercospora Leaf Spot","Damping-off","Fruit Rot","Little Leaf of Brinjal","Healthy"],
  "Cotton":     ["Bacterial Blight","Cotton Leaf Curl","Fusarium Wilt","Verticillium Wilt","Areolate Mildew","Root-knot Nematode","Seedling Disease Complex","Healthy"],
  "Onion":      ["Purple Blotch","Downy Mildew","Twister Disease","White Rot","Pink Root","Bacterial Soft Rot","Onion Yellow Dwarf","Healthy"],
  "Groundnut":  ["Tikka Leaf Spot","Groundnut Rust","Web Blotch","Bud Necrosis","Rosette Disease","Collar Rot","Stem Rot","Healthy"],
  "Turmeric":   ["Rhizome Rot","Leaf Blotch","Leaf Spot","Dry Rot","Bacterial Wilt","Leaf Blight","Root-Knot Nematodes","Healthy"],
  "Mango":      ["Mango Anthracnose","Powdery Mildew","Mango Malformation","Die-back","Bacterial Canker","Sooty Mould","Red Rust","Healthy"],
  "Coconut":    ["Bud Rot","Tanjore Wilt","Stem Bleeding","Root Wilt","Leaf Rot","Leaf Blight","Healthy"],
  "Ragi":       ["Ragi Blast","Seedling Blight","Foot Rot","Downy Mildew","Smut","Mosaic Virus","Healthy"],
};

const CROP_VISUAL_CLUES = {
  Tomato:     "Look for: brown rings on leaves (Early Blight), dark water-soaked patches (Late Blight), yellow leaf curling (TYLCV).",
  Rice:       "Look for: diamond-shaped grey spots (Blast), small brown oval spots (Brown Spot), orange discoloration.",
  Wheat:      "Look for: yellow/orange powder in stripes (Yellow Rust), orange pustules (Brown Rust), white powdery coating.",
  Maize:      "Look for: long cigar-shaped tan lesions (Turcicum Blight), rectangular grey spots (Gray Leaf Spot).",
  Potato:     "Look for: dark water-soaked patches (Late Blight), concentric brown rings (Early Blight).",
  Banana:     "Look for: yellow streaks turning brown oval spots (Sigatoka), yellowing of outer leaves collar (Panama).",
  Sugarcane:  "Look for: red internal stalk with white patches (Red Rot), black whip from top (Smut).",
  Okra:       "Look for: bright yellow vein network (YVMV), downward leaf curl with enations below (Enation Curl).",
  Brinjal:    "Look for: wilting with green leaves (Bacterial Wilt), entry holes in shoots/fruits (Fruit Borer).",
  Cotton:     "Look for: angular water-soaked leaf spots (Bacterial Blight), upward curling with vein thickening (Leaf Curl).",
  Onion:      "Look for: purple-brown spots (Purple Blotch), violet-grey fuzzy growth (Downy Mildew).",
  Groundnut:  "Look for: brown spots with yellow halo (Tikka), orange rust pustules on leaf underside.",
  Turmeric:   "Look for: yellowing and foul-smelling rhizome rot (Soft Rot), brown-grey leaf blotches.",
  Mango:      "Look for: black sunken lesions (Anthracnose), white powdery coating on flowers (Powdery Mildew).",
  Coconut:    "Look for: rotting spindle leaf with foul smell (Bud Rot), reddish-brown bleeding at trunk base.",
  Ragi:       "Look for: grey spindle spots on leaves (Blast), brown neck causing ear to break (Neck Blast).",
};

// ─── Crop name translations ───────────────────────────────────────────────────
const CROP_NAME_TRANSLATIONS = {
  ta: {
    Tomato:    "தக்காளி",   Rice:      "நெல்",       Wheat:     "கோதுமை",
    Maize:     "மக்காச்சோளம்", Potato:    "உருளைக்கிழங்கு", Banana:    "வாழை",
    Sugarcane: "கரும்பு",  Okra:      "வெண்டை",     Brinjal:   "கத்திரி",
    Cotton:    "பருத்தி",   Onion:     "வெங்காயம்",  Groundnut: "நிலக்கடலை",
    Turmeric:  "மஞ்சள்",   Mango:     "மாம்பழம்",   Coconut:   "தேங்காய்",
    Ragi:      "ராகி",
  },
  hi: {
    Tomato:    "टमाटर",     Rice:      "धान",         Wheat:     "गेहूँ",
    Maize:     "मक्का",     Potato:    "आलू",          Banana:    "केला",
    Sugarcane: "गन्ना",     Okra:      "भिंडी",        Brinjal:   "बैंगन",
    Cotton:    "कपास",      Onion:     "प्याज",        Groundnut: "मूंगफली",
    Turmeric:  "हल्दी",     Mango:     "आम",           Coconut:   "नारियल",
    Ragi:      "रागी",
  },
};

// ─── Visual clues translated (shown in UI hint) ───────────────────────────────
const CROP_VISUAL_CLUES_TX = {
  ta: {
    Tomato:    "கவனிக்கவும்: இலைகளில் பழுப்பு வளையங்கள் (Early Blight), கருமை நீர் ஊறிய திட்டுகள் (Late Blight), மஞ்சள் இலை சுருட்டல் (TYLCV).",
    Rice:      "கவனிக்கவும்: வைரம் வடிவ சாம்பல் திட்டுகள் (Blast), சிறிய பழுப்பு நீள்வட்ட திட்டுகள் (Brown Spot), ஆரஞ்சு நிறமாற்றம்.",
    Wheat:     "கவனிக்கவும்: மஞ்சள்/ஆரஞ்சு தூள் கோடுகளில் (Yellow Rust), ஆரஞ்சு சிரங்கு (Brown Rust), வெண்மை தூள் பூச்சு.",
    Maize:     "கவனிக்கவும்: நீண்ட சிகார் வடிவ புள்ளிகள் (Turcicum Blight), சதுர சாம்பல் திட்டுகள் (Gray Leaf Spot).",
    Potato:    "கவனிக்கவும்: கருமை நீர் ஊறிய திட்டுகள் (Late Blight), வளையக் கோடுகளுடன் பழுப்பு திட்டுகள் (Early Blight).",
    Banana:    "கவனிக்கவும்: மஞ்சள் கோடுகள் பழுப்பு நீள்வட்டமாக மாறும் (Sigatoka), வெளிப்புற இலைகள் மஞ்சளாகும் (Panama).",
    Sugarcane: "கவனிக்கவும்: தண்டு உள்ளே சிவப்பு வெள்ளை திட்டுகள் (Red Rot), மேலிருந்து கருப்பு சாட்டை (Smut).",
    Okra:      "கவனிக்கவும்: இலை நரம்பில் பளிச்சிடும் மஞ்சள் (YVMV), கீழே சிறு கட்டிகளுடன் இலை சுருட்டல்.",
    Brinjal:   "கவனிக்கவும்: பச்சை இலையுடன் வாடல் (Bacterial Wilt), தண்டு/காய்களில் நுழைவு துளைகள் (Fruit Borer).",
    Cotton:    "கவனிக்கவும்: கோண நீர் ஊறிய இலை திட்டுகள் (Bacterial Blight), நரம்பு தடித்து மேல்நோக்கி சுருட்டல் (Leaf Curl).",
    Onion:     "கவனிக்கவும்: ஊதா-பழுப்பு திட்டுகள் (Purple Blotch), ஊதா-சாம்பல் மெல்லிய வளர்ச்சி (Downy Mildew).",
    Groundnut: "கவனிக்கவும்: மஞ்சள் ஹேலோவுடன் பழுப்பு திட்டுகள் (Tikka), இலை அடியில் ஆரஞ்சு துரு சிரங்கு.",
    Turmeric:  "கவனிக்கவும்: கழுவுவதற்கு தகுதியற்ற கந்தமூல சொழுகல் (Soft Rot), பழுப்பு-சாம்பல் இலை திட்டுகள்.",
    Mango:     "கவனிக்கவும்: கருமை அழுகிய புண்கள் (Anthracnose), பூக்களில் வெண்மை தூள் பூச்சு (Powdery Mildew).",
    Coconut:   "கவனிக்கவும்: துர்நாற்றத்துடன் அழுகிய கண் இலை (Bud Rot), தண்டு அடியில் சிவப்பு-பழுப்பு கசிவு.",
    Ragi:      "கவனிக்கவும்: இலைகளில் சாம்பல் வைர திட்டுகள் (Blast), கழுத்து முறிந்து கதிர் விழும் (Neck Blast).",
  },
  hi: {
    Tomato:    "देखें: पत्तियों पर भूरे छल्ले (Early Blight), काले पानी से भीगे धब्बे (Late Blight), पीली पत्ती मुड़ना (TYLCV).",
    Rice:      "देखें: हीरे के आकार के धूसर धब्बे (Blast), छोटे भूरे अंडाकार धब्बे (Brown Spot), नारंगी रंग परिवर्तन.",
    Wheat:     "देखें: धारियों में पीला/नारंगी पाउडर (Yellow Rust), नारंगी फुंसी (Brown Rust), सफेद पाउडर परत.",
    Maize:     "देखें: लंबे सिगार जैसे भूरे धब्बे (Turcicum Blight), आयताकार धूसर धब्बे (Gray Leaf Spot).",
    Potato:    "देखें: काले पानी से भीगे धब्बे (Late Blight), गोल भूरे छल्ले (Early Blight).",
    Banana:    "देखें: पीली धारियां भूरे अंडाकार में बदलती हैं (Sigatoka), बाहरी पत्तियां पीली होती हैं (Panama).",
    Sugarcane: "देखें: तने के अंदर लाल-सफेद धब्बे (Red Rot), ऊपर से काला कोड़ा (Smut).",
    Okra:      "देखें: नसों में चमकीला पीला रंग (YVMV), नीचे उभार के साथ पत्ती मुड़ना.",
    Brinjal:   "देखें: हरी पत्तियों के साथ मुरझाना (Bacterial Wilt), तने/फल में प्रवेश छेद (Fruit Borer).",
    Cotton:    "देखें: कोणीय पानी से भीगे धब्बे (Bacterial Blight), नसें मोटी होकर ऊपर मुड़ना (Leaf Curl).",
    Onion:     "देखें: बैंगनी-भूरे धब्बे (Purple Blotch), बैंगनी-धूसर रोयेंदार वृद्धि (Downy Mildew).",
    Groundnut: "देखें: पीले घेरे के साथ भूरे धब्बे (Tikka), पत्ती नीचे नारंगी जंग के उभार.",
    Turmeric:  "देखें: दुर्गंध के साथ प्रकंद सड़न (Soft Rot), भूरे-धूसर पत्ती धब्बे.",
    Mango:     "देखें: काले धंसे हुए घाव (Anthracnose), फूलों पर सफेद पाउडर (Powdery Mildew).",
    Coconut:   "देखें: दुर्गंध के साथ सड़ी आंख की पत्ती (Bud Rot), तने के आधार पर लाल-भूरा रिसाव.",
    Ragi:      "देखें: पत्तियों पर धूसर हीरे के धब्बे (Blast), गर्दन टूटकर बाली गिरना (Neck Blast).",
  },
};

// ─── Full UI label translations for ta / hi ───────────────────────────────────
const UI_LABELS = {
  ta: {
    title:       "பயிர் நோய் கண்டறிதல்",
    subtitle:    "AI தொழில்நுட்ப பார்வை பகுப்பாய்வு • உடனடி சிகிச்சை திட்டம்",
    selectCrop:  "1. உங்கள் பயிரை தேர்ந்தெடுக்கவும்",
    uploadHint:  "பாதிக்கப்பட்ட இலை/தண்டின் தெளிவான க்ளோஸ்-அப் • JPG/PNG • அதிகபட்சம் 10MB",
    uploadBtn:   "📷 தாவர புகைப்படம் ஸ்கேன் செய்க",
    demoBtn:     "டெமோ படத்தை பயன்படுத்துக",
    howTitle:    "இது எவ்வாறு செயல்படுகிறது",
    detected:    "கண்டறியப்பட்டது",
    symptoms:    "அறிகுறிகள்",
    causes:      "காரணங்கள்",
    treatment:   "சிகிச்சை திட்டம்",
    medicines:   "மருந்துகள் & அளவு",
    organic:     "இயற்கை மாற்றுகள்",
    sprayTime:   "தெளிக்க சிறந்த நேரம்",
    prevention:  "தடுப்பு ஆலோசனைகள்",
    scanAnother: "🔄 மீண்டும் ஸ்கேன் செய்க",
    shareReport: "📤 அறிக்கையை பகிர்க",
    analyzing:   "ஆய்வு செய்கிறது",
    healthy:     "ஆரோக்கியமான தாவரம்",
    urgency:     "அவசர தன்மை",
    confidence:  "நம்பகத்தன்மை",
    progress: [
      "படத்தை செயலாக்குகிறது…",
      "நோய் வடிவங்களை அடையாளம் காண்கிறது…",
      "நோய் கையொப்பத்தை பொருத்துகிறது…",
      "சிகிச்சை திட்டம் தயாரிக்கிறது…",
    ],
    steps: [
      { t: "பயிர் தேர்வு & புகைப்படம் பதிவேற்றவும்",  d: "பாதிக்கப்பட்ட பகுதியை பகல் வெளிச்சத்தில் தெளிவான க்ளோஸ்-அப் எடுக்கவும்." },
      { t: "AI காட்சி ஆய்வு",                           d: "Claude AI நிறங்கள், வடிவங்கள் & புண் வடிவங்களை சரிபார்க்கிறது." },
      { t: "துல்லியமான நோய் கண்டறிதல்",                d: "நோய் பெயர், நம்பகத்தன்மை %, தீவிரம்." },
      { t: "முழு சிகிச்சை திட்டம்",                    d: "மருந்து பெயர்கள், லிட்டர்/ஏக்கருக்கு அளவு, தெளிக்கும் நேரம்." },
      { t: "அருகில் வாங்குங்கள்",                      d: "மருந்துகள் வாங்க உங்களுக்கு அருகில் உள்ள வேளாண் கடைகளை கண்டறியுங்கள்." },
    ],
  },
  hi: {
    title:       "फसल रोग पहचान",
    subtitle:    "AI दृष्टि विश्लेषण • तत्काल उपचार योजना",
    selectCrop:  "1. अपनी फसल चुनें",
    uploadHint:  "प्रभावित पत्ती/तने का स्पष्ट क्लोज़-अप • JPG/PNG • अधिकतम 10MB",
    uploadBtn:   "📷 पौधे की फोटो स्कैन करें",
    demoBtn:     "डेमो छवि का उपयोग करें",
    howTitle:    "यह कैसे काम करता है",
    detected:    "पहचाना गया",
    symptoms:    "लक्षण",
    causes:      "कारण",
    treatment:   "उपचार योजना",
    medicines:   "दवाइयां और खुराक",
    organic:     "जैविक विकल्प",
    sprayTime:   "छिड़काव का सबसे अच्छा समय",
    prevention:  "बचाव के उपाय",
    scanAnother: "🔄 फिर से स्कैन करें",
    shareReport: "📤 रिपोर्ट शेयर करें",
    analyzing:   "विश्लेषण हो रहा है",
    healthy:     "स्वस्थ पौधा",
    urgency:     "तात्कालिकता",
    confidence:  "विश्वास स्तर",
    progress: [
      "छवि प्रसंस्करण हो रहा है…",
      "रोग के पैटर्न पहचाने जा रहे हैं…",
      "रोग की पहचान मिलाई जा रही है…",
      "उपचार योजना तैयार हो रही है…",
    ],
    steps: [
      { t: "फसल चुनें और फोटो अपलोड करें",   d: "प्रभावित हिस्से का दिन की रोशनी में स्पष्ट क्लोज़-अप लें।" },
      { t: "AI दृष्टि निरीक्षण",              d: "Claude AI रंग, पैटर्न और घाव के आकार जांचता है।" },
      { t: "सटीक रोग निदान",                  d: "रोग का नाम, विश्वास %, गंभीरता स्तर।" },
      { t: "पूरी उपचार योजना",                d: "दवाओं के नाम, प्रति लीटर/एकड़ खुराक, छिड़काव समय।" },
      { t: "पास में खरीदें",                   d: "दवाइयां खरीदने के लिए नजदीकी कृषि दुकानें खोजें।" },
    ],
  },
};

// ─── Fallback template translations (ta / hi) ────────────────────────────────
// Medicines keep English product names. All other fields are translated.
const DISEASE_TEMPLATES_TX = {
  ta: {
    Tomato: {
      symptoms:   ["கீழ் இலைகளில் கருமை வளைய வடிவ திட்டுகள்","புண்களைச் சுற்றி மஞ்சள் ஹேலோ","படிப்படியாக மேல்நோக்கி இலை உதிர்தல்"],
      treatment:  ["Mancozeb 75WP @ 2கி/லி — 7 நாட்களுக்கு ஒரு முறை தெளிக்கவும்","Chlorothalonil 75WP @ 2கி/லி பாதுகாப்பாக தெளிக்கவும்","பாதிக்கப்பட்ட கீழ் இலைகளை உடனே நீக்கவும்"],
      organic:    ["வேப்ப எண்ணெய் 3மிலி/லி + சோப்பு 1மிலி/லி","Trichoderma viride 4கி/லி மண் தெளிப்பு"],
      prevention: ["சான்றிதழ் நோய் இல்லாத விதைகள் பயன்படுத்தவும்","60செமீ செடி இடைவெளி பராமரிக்கவும்","மேல்நோக்கி நீர்ப்பாசனம் தவிர்க்கவும்"],
      sprayTime:  "காலை 6–8 மணி அல்லது மாலை 4 மணிக்கு பின்",
      urgency:    "24–48 மணி நேரத்தில் சிகிச்சை அளிக்கவும்",
    },
    Rice: {
      symptoms:   ["இலைகளில் வைரம் வடிவ புண்கள்","வெண்மை-சாம்பல் மையம் பழுப்பு விளிம்புடன்","கதிர்களில் கழுத்து அழுகல்"],
      treatment:  ["Tricyclazole 75WP @ 0.6கி/லி தெளிக்கவும்","Isoprothiolane 40EC @ 1.5மிலி/லி","3–5 நாட்கள் வடிகட்டி மீண்டும் நீர் பாய்ச்சவும்"],
      organic:    ["Pseudomonas fluorescens 10கி/லி","வேப்பம் புண்ணாக்கு மண் இடுதல்"],
      prevention: ["நோய் எதிர்ப்பு ரகங்களை பயன்படுத்தவும்","அதிக நைட்ரஜன் தவிர்க்கவும்","சரியான நீர் மட்டம் பராமரிக்கவும்"],
      sprayTime:  "காலை 8 மணிக்கு முன்",
      urgency:    "48 மணி நேரத்தில் சிகிச்சை அளிக்கவும்",
    },
    Wheat: {
      symptoms:   ["இலைகளில் மஞ்சள்-ஆரஞ்சு தூள் கோடுகளாக","மஞ்சள் நிற விதை குவியல்கள்","இலைகள் முன்கூட்டியே காய்ந்து விடுதல்"],
      treatment:  ["Propiconazole 25EC @ 1மிலி/லி தெளிக்கவும்","Tebuconazole 25EC @ 1மிலி/லி வாராந்திர","அருகே உள்ள தன்னிச்சையான கோதுமை செடிகளை நீக்கவும்"],
      organic:    ["கந்தக தூள் 25கி/ஏக்கர்","போர்டோ கலவை 1%"],
      prevention: ["துரு எதிர்ப்பு ரகங்களை பயன்படுத்தவும்","தாமதமான விதைப்பு தவிர்க்கவும்","சமநிலையான உர பயன்பாடு"],
      sprayTime:  "காலை 7–10 மணி",
      urgency:    "3–4 நாட்களில் சிகிச்சை அளிக்கவும்",
    },
    Maize: {
      symptoms:   ["இலைகளில் நீண்ட சிகார் வடிவ புண்கள்","பழுப்பு-சாம்பல் நிற திட்டுகள்","இலைகள் கீழிருந்து மேலாக காய்தல்"],
      treatment:  ["Mancozeb 75WP @ 2கி/லி","Propiconazole @ 1மிலி/லி","பாதிக்கப்பட்ட இலைகளை நீக்கி அழிக்கவும்"],
      organic:    ["வேப்ப எண்ணெய் 3மிலி/லி","Trichoderma viride மண் தெளிப்பு 4கி/லி"],
      prevention: ["நோய் எதிர்ப்பு கலப்பின ரகங்களை பயன்படுத்தவும்","பயிர் சுழற்சி பின்பற்றவும்","பயிர் கழிவுகளை தண்டிலே அகற்றவும்"],
      sprayTime:  "காலை 6–9 மணி",
      urgency:    "3–5 நாட்களில் சிகிச்சை அளிக்கவும்",
    },
    Potato: {
      symptoms:   ["கருமை நீர் ஊறிய திட்டுகள்","இலை அடியில் வெள்ளை மெல்லிய வளர்ச்சி","தண்டு மற்றும் கிழங்கு வேகமாக அழுகல்"],
      treatment:  ["Metalaxyl 8% + Mancozeb 64% @ 2கி/லி","Cymoxanil 8% + Mancozeb 64% @ 2கி/லி","பாதிக்கப்பட்ட செடிகளை உடனே அகற்றவும்"],
      organic:    ["போர்டோ கலவை 1%","Pseudomonas fluorescens 5கி/லி"],
      prevention: ["பயிர் சுழற்சி பின்பற்றவும்","பாதிக்கப்பட்ட கழிவுகளை அழிக்கவும்","வயல் வடிகால் சரியாக இருக்கட்டும்"],
      sprayTime:  "காலை பனி காயும் முன்",
      urgency:    "உடனடி நடவடிக்கை தேவை",
    },
    Banana: {
      symptoms:   ["இலைகளில் மஞ்சள் கோடுகள் பழுப்பாக மாறுதல்","இலை அடி கழுத்தில் மஞ்சள் நிறமாற்றம்","வேர் அழுகல் மற்றும் தண்டு வாடல்"],
      treatment:  ["Mancozeb @ 2.5கி/லி 10 நாட்களுக்கு ஒரு முறை","Carbendazim @ 1கி/லி மண் தெளிப்பு","பாதிக்கப்பட்ட இலைகளை கத்தியால் வெட்டி அகற்றவும்"],
      organic:    ["Pseudomonas fluorescens 10கி/லி மண் தெளிப்பு","வேப்பம் புண்ணாக்கு 250கி/செடிக்கு"],
      prevention: ["நோய் இல்லாத நாற்றுகளை பயன்படுத்தவும்","நல்ல வடிகால் வசதி உறுதி செய்யவும்","பாதிக்கப்பட்ட தோட்டங்களில் கருவிகளை சுத்தப்படுத்தவும்"],
      sprayTime:  "காலை 7–9 மணி",
      urgency:    "48–72 மணி நேரத்தில் சிகிச்சை அளிக்கவும்",
    },
    Sugarcane: {
      symptoms:   ["தண்டு உட்புறம் சிவப்பு நிற அழுகல்","மேலிருந்து கருப்பு சாட்டை போன்று வளர்தல்","இலைகள் மஞ்சளாகி காய்தல்"],
      treatment:  ["Carbendazim 50WP @ 1கி/லி","Trichoderma viride 4கி/லி மண் தெளிப்பு","பாதிக்கப்பட்ட தண்டுகளை வேரோடு அகற்றவும்"],
      organic:    ["Trichoderma harzianum மண் இடுதல்","வேப்பம் புண்ணாக்கு 500கி/ஏக்கர்"],
      prevention: ["நோய் இல்லாத கண் கட்டு பயன்படுத்தவும்","3 வருட பயிர் சுழற்சி பின்பற்றவும்","நல்ல வடிகால் வசதி உறுதி செய்யவும்"],
      sprayTime:  "காலை 6–8 மணி",
      urgency:    "24–48 மணி நேரத்தில் சிகிச்சை அளிக்கவும்",
    },
    Okra: {
      symptoms:   ["இலை நரம்புகளில் பளிச்சிடும் மஞ்சள் வலை","இலை கீழ்புறம் சிறு கட்டிகளுடன் சுருட்டல்","வளர்ச்சி குன்றல் மற்றும் காய் காய்க்காமை"],
      treatment:  ["வெள்ளை ஈக்களை கட்டுப்படுத்த Imidacloprid @ 0.5மிலி/லி","பாதிக்கப்பட்ட செடிகளை உடனே பிடுங்கி அழிக்கவும்","Acetamiprid 20SP @ 0.5கி/லி"],
      organic:    ["மஞ்சள் ஒட்டும் பொறி (10/ஏக்கர்)","வேப்ப எண்ணெய் 3மிலி/லி தெளிப்பு"],
      prevention: ["நைலான் வலை நாற்றங்கால் (40–60 மெஷ்) பயன்படுத்தவும்","வயல் அருகே உள்ள களைகளை அகற்றவும்","வைரஸ் எதிர்ப்பு ரகங்களை தேர்ந்தெடுக்கவும்"],
      sprayTime:  "மாலை வேளையில் பூச்சிகள் சுறுசுறுப்பாக இருக்கும் நேரம்",
      urgency:    "பாதிக்கப்பட்ட செடிகளை உடனே நீக்கவும்",
    },
    Brinjal: {
      symptoms:   ["பச்சை இலையுடன் திடீர் வாடல்","தண்டு மற்றும் காய்களில் நுழைவு துளைகள்","காய்களில் அழுகல் மற்றும் புழுக்கள்"],
      treatment:  ["Chlorpyrifos 20EC @ 2மிலி/லி","Emamectin Benzoate @ 0.5கி/லி","பாதிக்கப்பட்ட காய்களை பறித்து அழிக்கவும்"],
      organic:    ["வேப்ப எண்ணெய் 5மிலி/லி தெளிப்பு","Bacillus thuringiensis @ 2கி/லி"],
      prevention: ["ஃபெரோமோன் பொறிகள் 5/ஏக்கர் வைக்கவும்","பாதிக்கப்பட்ட காய்களை வாரம் ஒரு முறை அகற்றவும்","பயிர் சுழற்சி பின்பற்றவும்"],
      sprayTime:  "காலை 6–8 மணி",
      urgency:    "3–5 நாட்களில் சிகிச்சை அளிக்கவும்",
    },
    Cotton: {
      symptoms:   ["இலைகளில் கோண நிற நீர் ஊறிய திட்டுகள்","இலை நரம்பு தடித்து மேல்நோக்கி சுருட்டல்","வளர்ச்சி குன்றல் மற்றும் பூ உதிர்தல்"],
      treatment:  ["Copper Oxychloride @ 3கி/லி","Imidacloprid @ 0.5மிலி/லி வெள்ளை ஈ கட்டுப்பாட்டிற்கு","பாதிக்கப்பட்ட செடிகளை நீக்கி அழிக்கவும்"],
      organic:    ["வேப்ப எண்ணெய் 3மிலி/லி","வெள்ளை / மஞ்சள் ஒட்டும் பொறி 8/ஏக்கர்"],
      prevention: ["வைரஸ் எதிர்ப்பு Bt பருத்தி ரகங்களை பயன்படுத்தவும்","களை கட்டுப்பாடு தொடர்ந்து செய்யவும்","விதைப்பு காலம் கடைப்பிடிக்கவும்"],
      sprayTime:  "காலை 7–9 மணி",
      urgency:    "48 மணி நேரத்தில் சிகிச்சை அளிக்கவும்",
    },
    Onion: {
      symptoms:   ["இலைகளில் ஊதா-பழுப்பு திட்டுகள்","ஊதா-சாம்பல் மெல்லிய பூஞ்சை வளர்ச்சி","இலைகள் தரையில் விழுந்து காய்தல்"],
      treatment:  ["Mancozeb @ 2.5கி/லி","Metalaxyl + Mancozeb @ 2கி/லி","பாதிக்கப்பட்ட இலைகளை நீக்கி அழிக்கவும்"],
      organic:    ["Trichoderma viride 4கி/லி மண் தெளிப்பு","வேப்ப எண்ணெய் 3மிலி/லி"],
      prevention: ["நோய் இல்லாத நாற்றுகளை பயன்படுத்தவும்","நடவு முன் விதை சிகிச்சை செய்யவும்","நல்ல வடிகால் வசதி உறுதி செய்யவும்"],
      sprayTime:  "காலை 7–9 மணி",
      urgency:    "3–5 நாட்களில் சிகிச்சை அளிக்கவும்",
    },
    Groundnut: {
      symptoms:   ["மஞ்சள் ஹேலோவுடன் பழுப்பு திட்டுகள்","இலை அடியில் ஆரஞ்சு துரு புள்ளிகள்","இலைகள் முன்கூட்டியே உதிர்தல்"],
      treatment:  ["Chlorothalonil @ 2கி/லி","Mancozeb @ 2.5கி/லி","Tebuconazole @ 1மிலி/லி"],
      organic:    ["வேப்ப எண்ணெய் 3மிலி/லி","Trichoderma viride 4கி/லி மண் தெளிப்பு"],
      prevention: ["நோய் எதிர்ப்பு ரகங்களை பயன்படுத்தவும்","பயிர் சுழற்சி பின்பற்றவும்","அறுவடைக்கு பின் கழிவுகளை அகற்றவும்"],
      sprayTime:  "காலை 7–9 மணி",
      urgency:    "3–5 நாட்களில் சிகிச்சை அளிக்கவும்",
    },
    Turmeric: {
      symptoms:   ["கிழங்கு துர்நாற்றத்துடன் அழுகல்","இலைகளில் பழுப்பு-சாம்பல் திட்டுகள்","செடி வாடி காய்தல்"],
      treatment:  ["Metalaxyl + Mancozeb @ 2கி/லி","Copper Oxychloride @ 3கி/லி","பாதிக்கப்பட்ட கிழங்குகளை நீக்கி அழிக்கவும்"],
      organic:    ["Trichoderma harzianum 4கி/லி மண் தெளிப்பு","வேப்பம் புண்ணாக்கு 250கி/செடிக்கு"],
      prevention: ["நோய் இல்லாத விதை கிழங்குகளை பயன்படுத்தவும்","3 வருட பயிர் சுழற்சி பின்பற்றவும்","நல்ல வடிகால் வசதி உறுதி செய்யவும்"],
      sprayTime:  "காலை 7–9 மணி",
      urgency:    "24–48 மணி நேரத்தில் சிகிச்சை அளிக்கவும்",
    },
    Mango: {
      symptoms:   ["கிளைகளில் கருமை அழுகிய புண்கள்","பூக்களில் வெண்மை தூள் பூச்சு","இளம் காய்கள் உதிர்தல்"],
      treatment:  ["Copper Oxychloride @ 3கி/லி","Wettable Sulphur @ 3கி/லி","Carbendazim @ 1கி/லி"],
      organic:    ["போர்டோ கலவை 1%","வேப்ப எண்ணெய் 3மிலி/லி"],
      prevention: ["காற்று போக்குவரத்துக்கு கிளைகளை ஒழுங்காக கத்தரிக்கவும்","வீழ்ந்த இலைகளை தொடர்ந்து அகற்றவும்","பூக்கும் முன் தடுப்பு தெளிப்பு செய்யவும்"],
      sprayTime:  "காலை 7–9 மணி",
      urgency:    "3–5 நாட்களில் சிகிச்சை அளிக்கவும்",
    },
    Coconut: {
      symptoms:   ["கண் இலை துர்நாற்றத்துடன் அழுகல்","தண்டு அடியில் சிவப்பு-பழுப்பு நிற கசிவு","இலைகள் மஞ்சளாகி உதிர்தல்"],
      treatment:  ["Metalaxyl + Mancozeb @ 3கி/லி மண் தெளிப்பு","Copper Oxychloride 50WP @ 3கி/லி","Trichoderma viride @ 50கி மண்ணில் இடவும்"],
      organic:    ["Pseudomonas fluorescens 50கி மண் இடுதல்","வேப்பம் புண்ணாக்கு 5கி/மரம் தண்டு அடியில்"],
      prevention: ["வடிகால் வசதி சரியாக இருக்கட்டும்","Trichoderma-சிகிச்சை கலவையால் விதை நடவு செய்யவும்","தேங்காய் தோட்டத்தை சுத்தமாக வைக்கவும்"],
      sprayTime:  "காலை 7–9 மணி",
      urgency:    "48 மணி நேரத்தில் சிகிச்சை அளிக்கவும்",
    },
    Ragi: {
      symptoms:   ["இலைகளில் சாம்பல் வைர வடிவ திட்டுகள்","கழுத்து முறிந்து கதிர் விழுதல்","விதைகள் காலியாக பதர் ஆதல்"],
      treatment:  ["Tricyclazole 75WP @ 0.6கி/லி","Isoprothiolane @ 1.5மிலி/லி","விதை சிகிச்சை: Carbendazim @ 2கி/கி"],
      organic:    ["Pseudomonas fluorescens 10கி/லி","வேப்பம் புண்ணாக்கு மண் இடுதல்"],
      prevention: ["நோய் எதிர்ப்பு ரகங்களை பயன்படுத்தவும்","அதிக நைட்ரஜன் தவிர்க்கவும்","சரியான நீர் மட்டம் பராமரிக்கவும்"],
      sprayTime:  "காலை 8 மணிக்கு முன்",
      urgency:    "48 மணி நேரத்தில் சிகிச்சை அளிக்கவும்",
    },
  },

  hi: {
    Tomato: {
      symptoms:   ["निचली पत्तियों पर गहरे भूरे गोल धब्बे","घावों के चारों ओर पीला घेरा","पत्तियों का नीचे से ऊपर की ओर झड़ना"],
      treatment:  ["Mancozeb 75WP @ 2ग्रा/लि — 7 दिन में एक बार छिड़काव","Chlorothalonil 75WP @ 2ग्रा/लि सुरक्षात्मक छिड़काव","नीचे की प्रभावित पत्तियां तुरंत हटाएं"],
      organic:    ["नीम का तेल 3मिली/लि + साबुन 1मिली/लि","Trichoderma viride 4ग्रा/लि मिट्टी में डालें"],
      prevention: ["प्रमाणित रोगमुक्त बीज उपयोग करें","60सेमी पौध अंतराल बनाए रखें","ऊपर से सिंचाई से बचें"],
      sprayTime:  "सुबह 6–8 बजे या शाम 4 बजे के बाद",
      urgency:    "24–48 घंटे में उपचार करें",
    },
    Rice: {
      symptoms:   ["पत्तियों पर हीरे के आकार के घाव","सफेद-धूसर केंद्र के साथ भूरी किनारी","बालियों में गर्दन सड़न"],
      treatment:  ["Tricyclazole 75WP @ 0.6ग्रा/लि छिड़काव","Isoprothiolane 40EC @ 1.5मिली/लि","3–5 दिन खेत सुखाकर फिर सिंचाई करें"],
      organic:    ["Pseudomonas fluorescens 10ग्रा/लि","नीम की खली मिट्टी में मिलाएं"],
      prevention: ["ब्लास्ट प्रतिरोधी किस्में उपयोग करें","अधिक नाइट्रोजन से बचें","उचित जल स्तर बनाए रखें"],
      sprayTime:  "सुबह 8 बजे से पहले",
      urgency:    "48 घंटे में उपचार करें",
    },
    Wheat: {
      symptoms:   ["पत्तियों पर धारियों में पीला-नारंगी पाउडर","पीले रंग के बीजाणु के ढेर","पत्तियों का असमय सूखना"],
      treatment:  ["Propiconazole 25EC @ 1मिली/लि छिड़काव","Tebuconazole 25EC @ 1मिली/लि साप्ताहिक","आसपास के जंगली गेहूं पौधे हटाएं"],
      organic:    ["सल्फर पाउडर 25किग्रा/एकड़","बोर्डो मिश्रण 1%"],
      prevention: ["जंग प्रतिरोधी किस्में उपयोग करें","देर से बुवाई से बचें","संतुलित उर्वरक उपयोग"],
      sprayTime:  "सुबह 7–10 बजे",
      urgency:    "3–4 दिन में उपचार करें",
    },
    Maize: {
      symptoms:   ["पत्तियों पर लंबे सिगार जैसे धब्बे","भूरे-धूसर रंग के धब्बे","नीचे से ऊपर की ओर पत्तियों का सूखना"],
      treatment:  ["Mancozeb 75WP @ 2ग्रा/लि","Propiconazole @ 1मिली/लि","प्रभावित पत्तियां हटाकर नष्ट करें"],
      organic:    ["नीम का तेल 3मिली/लि","Trichoderma viride मिट्टी में 4ग्रा/लि"],
      prevention: ["रोग प्रतिरोधी हाइब्रिड किस्में उपयोग करें","फसल चक्र अपनाएं","फसल अवशेष तुरंत नष्ट करें"],
      sprayTime:  "सुबह 6–9 बजे",
      urgency:    "3–5 दिन में उपचार करें",
    },
    Potato: {
      symptoms:   ["काले पानी से भीगे धब्बे","पत्ती नीचे सफेद रोयेंदार वृद्धि","तना और कंद का तेज़ी से सड़ना"],
      treatment:  ["Metalaxyl 8% + Mancozeb 64% @ 2ग्रा/लि","Cymoxanil 8% + Mancozeb 64% @ 2ग्रा/लि","प्रभावित पौधे तुरंत उखाड़ें"],
      organic:    ["बोर्डो मिश्रण 1%","Pseudomonas fluorescens 5ग्रा/लि"],
      prevention: ["फसल चक्र अपनाएं","प्रभावित अवशेष नष्ट करें","खेत में उचित जल निकासी रखें"],
      sprayTime:  "सुबह ओस सूखने से पहले",
      urgency:    "तत्काल कार्रवाई आवश्यक",
    },
    Banana: {
      symptoms:   ["पत्तियों पर पीली धारियां जो भूरी हो जाती हैं","बाहरी पत्ती गर्दन का पीला पड़ना","जड़ सड़न और तने का मुरझाना"],
      treatment:  ["Mancozeb @ 2.5ग्रा/लि 10 दिन में एक बार","Carbendazim @ 1ग्रा/लि मिट्टी में डालें","प्रभावित पत्तियां काटकर हटाएं"],
      organic:    ["Pseudomonas fluorescens 10ग्रा/लि मिट्टी में","नीम की खली 250ग्रा/पौधा"],
      prevention: ["रोगमुक्त पौधे उपयोग करें","अच्छी जल निकासी सुनिश्चित करें","औजार खेतों के बीच साफ रखें"],
      sprayTime:  "सुबह 7–9 बजे",
      urgency:    "48–72 घंटे में उपचार करें",
    },
    Sugarcane: {
      symptoms:   ["तने के अंदर लाल सड़न","ऊपर से काले कोड़े जैसी वृद्धि","पत्तियां पीली होकर सूखना"],
      treatment:  ["Carbendazim 50WP @ 1ग्रा/लि","Trichoderma viride 4ग्रा/लि मिट्टी में","प्रभावित तने जड़ सहित हटाएं"],
      organic:    ["Trichoderma harzianum मिट्टी में मिलाएं","नीम की खली 500ग्रा/एकड़"],
      prevention: ["रोगमुक्त बड (आंख) उपयोग करें","3 वर्षीय फसल चक्र अपनाएं","उचित जल निकासी सुनिश्चित करें"],
      sprayTime:  "सुबह 6–8 बजे",
      urgency:    "24–48 घंटे में उपचार करें",
    },
    Okra: {
      symptoms:   ["पत्ती नसों में चमकीला पीला जाल","नीचे उभार के साथ पत्ती का मुड़ना","विकास रुकना और फल न लगना"],
      treatment:  ["सफेद मक्खी नियंत्रण: Imidacloprid @ 0.5मिली/लि","प्रभावित पौधे तुरंत उखाड़कर जलाएं","Acetamiprid 20SP @ 0.5ग्रा/लि"],
      organic:    ["पीले चिपचिपे जाल (10/एकड़)","नीम का तेल 3मिली/लि छिड़काव"],
      prevention: ["नायलॉन नेट नर्सरी (40–60 मेश) उपयोग करें","खेत के पास खरपतवार हटाएं","वायरस प्रतिरोधी किस्में चुनें"],
      sprayTime:  "शाम को जब कीड़े सक्रिय हों",
      urgency:    "प्रभावित पौधे तुरंत हटाएं",
    },
    Brinjal: {
      symptoms:   ["हरी पत्तियों के साथ अचानक मुरझाना","तने और फल में प्रवेश छेद","फल में सड़न और कीड़े"],
      treatment:  ["Chlorpyrifos 20EC @ 2मिली/लि","Emamectin Benzoate @ 0.5ग्रा/लि","प्रभावित फल तोड़कर नष्ट करें"],
      organic:    ["नीम का तेल 5मिली/लि छिड़काव","Bacillus thuringiensis @ 2ग्रा/लि"],
      prevention: ["फेरोमोन जाल 5/एकड़ लगाएं","प्रभावित फल हर हफ्ते हटाएं","फसल चक्र अपनाएं"],
      sprayTime:  "सुबह 6–8 बजे",
      urgency:    "3–5 दिन में उपचार करें",
    },
    Cotton: {
      symptoms:   ["पत्तियों पर कोणीय पानी से भीगे धब्बे","नसें मोटी होकर ऊपर की ओर मुड़ना","वृद्धि रुकना और फूलों का झड़ना"],
      treatment:  ["Copper Oxychloride @ 3ग्रा/लि","Imidacloprid @ 0.5मिली/लि सफेद मक्खी नियंत्रण","प्रभावित पौधे हटाकर नष्ट करें"],
      organic:    ["नीम का तेल 3मिली/लि","सफेद/पीले चिपचिपे जाल 8/एकड़"],
      prevention: ["वायरस प्रतिरोधी Bt कपास किस्में उपयोग करें","निरंतर खरपतवार नियंत्रण करें","बुवाई का समय सही रखें"],
      sprayTime:  "सुबह 7–9 बजे",
      urgency:    "48 घंटे में उपचार करें",
    },
    Onion: {
      symptoms:   ["पत्तियों पर बैंगनी-भूरे धब्बे","बैंगनी-धूसर रोयेंदार फफूंदी वृद्धि","पत्तियां जमीन पर गिरकर सूखना"],
      treatment:  ["Mancozeb @ 2.5ग्रा/लि","Metalaxyl + Mancozeb @ 2ग्रा/लि","प्रभावित पत्तियां हटाकर नष्ट करें"],
      organic:    ["Trichoderma viride 4ग्रा/लि मिट्टी में","नीम का तेल 3मिली/लि"],
      prevention: ["रोगमुक्त पौधे उपयोग करें","रोपाई से पहले बीज उपचार करें","उचित जल निकासी सुनिश्चित करें"],
      sprayTime:  "सुबह 7–9 बजे",
      urgency:    "3–5 दिन में उपचार करें",
    },
    Groundnut: {
      symptoms:   ["पीले घेरे के साथ भूरे धब्बे","पत्ती नीचे नारंगी जंग के उभार","पत्तियों का असमय झड़ना"],
      treatment:  ["Chlorothalonil @ 2ग्रा/लि","Mancozeb @ 2.5ग्रा/लि","Tebuconazole @ 1मिली/लि"],
      organic:    ["नीम का तेल 3मिली/लि","Trichoderma viride 4ग्रा/लि मिट्टी में"],
      prevention: ["रोग प्रतिरोधी किस्में उपयोग करें","फसल चक्र अपनाएं","कटाई के बाद अवशेष हटाएं"],
      sprayTime:  "सुबह 7–9 बजे",
      urgency:    "3–5 दिन में उपचार करें",
    },
    Turmeric: {
      symptoms:   ["प्रकंद में दुर्गंध के साथ सड़न","पत्तियों पर भूरे-धूसर धब्बे","पौधा मुरझाकर सूखना"],
      treatment:  ["Metalaxyl + Mancozeb @ 2ग्रा/लि","Copper Oxychloride @ 3ग्रा/लि","प्रभावित प्रकंद हटाकर नष्ट करें"],
      organic:    ["Trichoderma harzianum 4ग्रा/लि मिट्टी में","नीम की खली 250ग्रा/पौधा"],
      prevention: ["रोगमुक्त बीज प्रकंद उपयोग करें","3 वर्षीय फसल चक्र अपनाएं","उचित जल निकासी सुनिश्चित करें"],
      sprayTime:  "सुबह 7–9 बजे",
      urgency:    "24–48 घंटे में उपचार करें",
    },
    Mango: {
      symptoms:   ["शाखाओं पर काले धंसे हुए घाव","फूलों पर सफेद पाउडर की परत","छोटे फलों का झड़ना"],
      treatment:  ["Copper Oxychloride @ 3ग्रा/लि","Wettable Sulphur @ 3ग्रा/लि","Carbendazim @ 1ग्रा/लि"],
      organic:    ["बोर्डो मिश्रण 1%","नीम का तेल 3मिली/लि"],
      prevention: ["हवा की आवाजाही के लिए शाखाएं काटें","गिरी हुई पत्तियां नियमित हटाएं","फूल आने से पहले रोकथाम छिड़काव करें"],
      sprayTime:  "सुबह 7–9 बजे",
      urgency:    "3–5 दिन में उपचार करें",
    },
    Coconut: {
      symptoms:   ["दुर्गंध के साथ आंख की पत्ती का सड़ना","तने के आधार पर लाल-भूरा रिसाव","पत्तियां पीली होकर झड़ना"],
      treatment:  ["Metalaxyl + Mancozeb @ 3ग्रा/लि मिट्टी में","Copper Oxychloride 50WP @ 3ग्रा/लि","Trichoderma viride @ 50ग्रा मिट्टी में"],
      organic:    ["Pseudomonas fluorescens 50ग्रा मिट्टी में","नीम की खली 5किग्रा/पेड़ जड़ के पास"],
      prevention: ["जल निकासी उचित रखें","Trichoderma-उपचारित मिट्टी से रोपाई करें","नारियल बाग साफ रखें"],
      sprayTime:  "सुबह 7–9 बजे",
      urgency:    "48 घंटे में उपचार करें",
    },
    Ragi: {
      symptoms:   ["पत्तियों पर धूसर हीरे के आकार के धब्बे","गर्दन टूटकर बाली का गिरना","बीज खोखले और पतले होना"],
      treatment:  ["Tricyclazole 75WP @ 0.6ग्रा/लि","Isoprothiolane @ 1.5मिली/लि","बीज उपचार: Carbendazim @ 2ग्रा/किग्रा"],
      organic:    ["Pseudomonas fluorescens 10ग्रा/लि","नीम की खली मिट्टी में मिलाएं"],
      prevention: ["रोग प्रतिरोधी किस्में उपयोग करें","अधिक नाइट्रोजन से बचें","उचित जल स्तर बनाए रखें"],
      sprayTime:  "सुबह 8 बजे से पहले",
      urgency:    "48 घंटे में उपचार करें",
    },
  },
};

// Merges translated fields onto a fallback result (only for ta/hi; en passes through unchanged)
const translateResult = (result, lang) => {
  if (!result || !lang || lang === "en") return result;
  const cropKey = Object.keys(DISEASE_TEMPLATES_TX[lang] || {}).find(
    k => result.disease?.toLowerCase().includes(k.toLowerCase()) ||
         Object.keys(DISEASE_TEMPLATES_TX[lang]).find(k2 => k2 === k)
  );
  // Match by disease key or crop name embedded in disease string
  const txCrop = Object.keys(DISEASE_TEMPLATES_TX[lang] || {}).find(k =>
    result._crop === k
  ) || Object.keys(DISEASE_TEMPLATES_TX[lang] || {})[0];
  const tx = DISEASE_TEMPLATES_TX[lang]?.[result._crop] || {};
  return {
    ...result,
    symptoms:   tx.symptoms   || result.symptoms,
    treatment:  tx.treatment  || result.treatment,
    organic:    tx.organic    || result.organic,
    prevention: tx.prevention || result.prevention,
    sprayTime:  tx.sprayTime  || result.sprayTime,
    urgency:    tx.urgency    || result.urgency,
  };
};

const getFallback = (crop, diseaseName) => {
  if (diseaseName && DISEASE_TEMPLATES[diseaseName]) return { ...DISEASE_TEMPLATES[diseaseName], _crop: crop };
  const cropKey = Object.keys(DISEASE_TEMPLATES).find(k => k.toLowerCase() === crop.toLowerCase());
  const base = cropKey ? DISEASE_TEMPLATES[cropKey] : Object.values(DISEASE_TEMPLATES)[0];
  return { ...base, _crop: crop };
};

export default function DiseaseDetection({ user, t, lang }) {
  const [crop,         setCrop]         = useState(user.crops?.[0] || "Tomato");
  const [step,         setStep]         = useState("upload");
  const [progress,     setProgress]     = useState(0);
  const [progressMsg,  setProgressMsg]  = useState("");
  const [result,       setResult]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);

  // Translate a crop key → display name for the current language
  const cropLabel = (key) => CROP_NAME_TRANSLATIONS[lang]?.[key] || key;

  // ── Translated strings — UI_LABELS for ta/hi, t() fallback for en ─────────
  const L = UI_LABELS[lang] || {};

  const TX = {
    title:       L.title       || t("disease.title")       || "Crop Disease Detection",
    subtitle:    L.subtitle    || t("disease.subtitle")    || "AI-powered vision analysis • Instant treatment plan",
    selectCrop:  L.selectCrop  || t("disease.selectCrop")  || "1. Select Your Crop",
    uploadHint:  L.uploadHint  || t("disease.uploadHint")  || "Close-up of affected leaf/stem • JPG/PNG • Max 10MB",
    uploadBtn:   L.uploadBtn   || t("disease.uploadBtn")   || "📷 Scan Plant Photo",
    demoBtn:     L.demoBtn     || t("disease.demoBtn")     || "Use demo image instead",
    howTitle:    L.howTitle    || t("disease.howTitle")    || "How It Works",
    detected:    L.detected    || t("disease.detected")    || "Detected",
    symptoms:    L.symptoms    || t("disease.symptoms")    || "Symptoms",
    causes:      L.causes      || t("disease.causes")      || "Causes",
    treatment:   L.treatment   || t("disease.treatment")   || "Treatment Plan",
    medicines:   L.medicines   || t("disease.medicines")   || "Medicines & Dosage",
    organic:     L.organic     || t("disease.organic")     || "Organic Alternatives",
    sprayTime:   L.sprayTime   || t("disease.sprayTime")   || "Best Time to Spray",
    prevention:  L.prevention  || t("disease.prevention")  || "Prevention Tips",
    scanAnother: L.scanAnother || t("disease.scanAnother") || "🔄 Scan Another",
    shareReport: L.shareReport || t("disease.shareReport") || "📤 Share Report",
    analyzing:   L.analyzing   || t("disease.analyzing")   || "Analyzing",
    healthy:     L.healthy     || t("disease.healthy")     || "Healthy Plant",
    urgency:     L.urgency     || t("disease.urgency")     || "Urgency",
    confidence:  L.confidence  || t("disease.confidence")  || "confidence",
  };

  const progressMsgs = L.progress || t("disease.progress") || [
    "Preprocessing image…",
    "Identifying lesion patterns…",
    "Matching disease signature…",
    "Generating treatment plan…",
  ];

  const steps = L.steps || t("disease.steps") || [
    { t: "Select crop & upload photo",  d: "Take a clear close-up in daylight showing the affected area." },
    { t: "AI Visual Inspection",         d: "Claude AI checks colors, patterns & lesion shapes." },
    { t: "Accurate diagnosis",           d: "Disease name, confidence %, severity level." },
    { t: "Full treatment plan",          d: "Exact medicine names, dosages per litre/acre, spray timing." },
    { t: "Buy nearby",                  d: "Locate agri shops near you to buy the medicines." },
  ];

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      analyzeImage(ev.target.result.split(",")[1], file.type || "image/jpeg");
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64, mimeType = "image/jpeg") => {
    setStep("analyzing");
    setProgress(0);
    let msgIdx = 0;
    setProgressMsg(progressMsgs[0]);

    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + 3;
        const newIdx = Math.min(Math.floor(next / 25), progressMsgs.length - 1);
        if (newIdx !== msgIdx) { msgIdx = newIdx; setProgressMsg(progressMsgs[newIdx]); }
        if (next >= 88) { clearInterval(interval); return 88; }
        return next;
      });
    }, 100);

    const diseaseList = (CROP_DISEASES[crop] || []).join(", ");
    const visualClues = CROP_VISUAL_CLUES_TX[lang]?.[crop] || CROP_VISUAL_CLUES[crop] || "";

    const LANG_INSTRUCTION = {
      ta: `IMPORTANT: You MUST write every value in Tamil (தமிழ்) language ONLY — this includes all symptoms, causes, treatment steps, prevention tips, organic options, sprayTime, and urgency fields. Do NOT use English for these fields. Keep only medicine/chemical product names (e.g. Mancozeb 75WP) and the disease name in English. The lang_summary field must be a 2-line Tamil summary.`,
      hi: `IMPORTANT: You MUST write every value in Hindi (हिंदी) language ONLY — this includes all symptoms, causes, treatment steps, prevention tips, organic options, sprayTime, and urgency fields. Do NOT use English for these fields. Keep only medicine/chemical product names (e.g. Mancozeb 75WP) and the disease name in English. The lang_summary field must be a 2-line Hindi summary.`,
      en: `Respond in English for all fields.`,
    };
    const langNote = LANG_INSTRUCTION[lang] || LANG_INSTRUCTION.en;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model:      "claude-sonnet-4-20250514",
          max_tokens: 1200,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
              {
                type: "text",
                text: `You are an expert agricultural pathologist for Indian farmers (Tamil Nadu).
Analyze this ${crop} plant image.

Visual clues for ${crop}: ${visualClues}
Known diseases for ${crop}: ${diseaseList}

${langNote}

Respond ONLY in valid JSON (no markdown, no backticks):
{
  "disease":      "disease name in English or Healthy",
  "confidence":   0-100,
  "severity":     "Low|Medium|High|Healthy",
  "symptoms":     ["symptom 1 in target language","symptom 2","symptom 3"],
  "causes":       ["cause 1 in target language","cause 2"],
  "treatment":    ["step 1 with dosage in target language","step 2","step 3"],
  "prevention":   ["tip 1 in target language","tip 2","tip 3"],
  "medicines":    ["Mancozeb 75WP @ 2g/L","medicine2 @ dosage"],
  "organic":      ["neem oil 3ml/L description in target language","option 2"],
  "sprayTime":    "spray timing description in target language",
  "urgency":      "urgency message in target language",
  "lang_summary": "2-line summary of diagnosis in target language"
}`,
              },
            ],
          }],
        }),
      });

      const d = await res.json();
      clearInterval(interval);
      setProgress(100);
      const raw    = d.content?.[0]?.text || "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      const offline = getFallback(crop, parsed.disease);
      setResult(translateResult({ ...offline, ...parsed, _crop: crop }, lang));
      setTimeout(() => setStep("result"), 400);
    } catch (err) {
      clearInterval(interval);
      setResult(translateResult(getFallback(crop, null), lang));
      setTimeout(() => setStep("result"), 400);
    }
  };

  const simulateAnalyze = () => {
    setStep("analyzing");
    setProgress(0);
    let p = 0;
    const timer = setInterval(() => {
      p += 4;
      setProgress(p);
      setProgressMsg(progressMsgs[Math.min(Math.floor(p / 25), progressMsgs.length - 1)]);
      if (p >= 100) {
        clearInterval(timer);
        setResult(translateResult(getFallback(crop, null), lang));
        setTimeout(() => setStep("result"), 200);
      }
    }, 80);
  };

  const sevColor = { High: C.red, Medium: C.orange, Low: C.bg2, Healthy: C.bg2, Critical: C.red };

  return (
    <div style={{ padding: 22 }}>
      <h1 style={{ fontSize: 21, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>
        🔬 {TX.title}
      </h1>
      <p style={{ color: C.muted, fontSize: 13, margin: "0 0 18px" }}>{TX.subtitle}</p>

      {/* ── UPLOAD STEP ─────────────────────────────────────────────────────── */}
      {step === "upload" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

          <div>
            {/* Crop selector */}
            <Card style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 9 }}>
                {TX.selectCrop}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
                {CROPS_ALL.slice(0, 16).map(c => (
                  <button key={c} onClick={() => setCrop(c)} style={{
                    padding: "7px 4px", borderRadius: 7, fontSize: 12, cursor: "pointer",
                    border:      `1.5px solid ${crop === c ? C.bg2 : C.border}`,
                    background:  crop === c ? C.pale : C.white,
                    color:       crop === c ? C.bg2 : C.text,
                  }}>{cropLabel(c)}</button>
                ))}
              </div>
            </Card>

            {/* Upload zone */}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            <div onClick={() => fileRef.current?.click()} style={{
              background: C.white, borderRadius: 12, padding: "28px 20px",
              border: `2px dashed ${C.border}`, textAlign: "center", cursor: "pointer",
            }}>
              {imagePreview
                ? <img src={imagePreview} alt="preview" style={{ maxHeight: 140, borderRadius: 8, marginBottom: 10 }} />
                : <div style={{ fontSize: 42, marginBottom: 8 }}>📸</div>
              }
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{TX.uploadHint}</div>
              <Btn onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>
                {TX.uploadBtn}
              </Btn>
            </div>
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <button onClick={simulateAnalyze}
                style={{ fontSize: 12, color: C.bg2, background: "none", border: "none", cursor: "pointer" }}>
                {TX.demoBtn}
              </button>
            </div>
          </div>

          {/* How it works */}
          <Card>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>
              📋 {TX.howTitle}
            </div>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.pale, color: C.bg2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{s.t}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{s.d}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── ANALYZING STEP ───────────────────────────────────────────────────── */}
      {step === "analyzing" && (
        <Card style={{ textAlign: "center", padding: "60px 40px" }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🔬</div>
          <div style={{ fontSize: 17, fontWeight: 500, color: C.text, marginBottom: 8 }}>
            {TX.analyzing} {cropLabel(crop)}…
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>{progressMsg}</div>
          <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: "hidden", maxWidth: 320, margin: "0 auto" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: C.bg2, borderRadius: 4, transition: "width 0.1s" }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: C.muted }}>{progress}%</div>
        </Card>
      )}

      {/* ── RESULT STEP ──────────────────────────────────────────────────────── */}
      {step === "result" && result && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>

            {/* Diagnosis card */}
            <Card style={{ border: `1.5px solid ${sevColor[result.severity] || C.border}` }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                <Badge color={sevColor[result.severity]} bg={C.pale}>{result.severity}</Badge>
                <span style={{ fontSize: 12, color: C.muted }}>{result.confidence}% {TX.confidence}</span>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 10px" }}>
                {result.disease === "Healthy" ? `✅ ${TX.healthy}` : result.disease}
              </h2>
              {(result.lang_summary || result.tamil_summary) && (
                <div style={{ background: C.pale, padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 12, lineHeight: 1.6 }}>
                  🌿 {result.lang_summary || result.tamil_summary}
                </div>
              )}
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, marginBottom: 5 }}>
                {TX.symptoms}:
              </div>
              {(result.symptoms || []).map((s, i) => (
                <div key={i} style={{ fontSize: 12, color: C.muted, marginBottom: 3 }}>• {s}</div>
              ))}
              {(result.causes || []).length > 0 && (
                <>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, margin: "10px 0 5px" }}>
                    {TX.causes}:
                  </div>
                  {(result.causes || []).map((c, i) => (
                    <div key={i} style={{ fontSize: 12, color: C.muted, marginBottom: 3 }}>• {c}</div>
                  ))}
                </>
              )}
            </Card>

            {/* Treatment card */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Card>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>
                  💊 {TX.treatment}
                </div>
                {(result.treatment || []).map((item, i) => (
                  <div key={i} style={{ fontSize: 12.5, color: C.text, marginBottom: 5 }}>• {item}</div>
                ))}
                <div style={{ marginTop: 10, padding: "7px 10px", background: C.pale, borderRadius: 7, fontSize: 12 }}>
                  ⏰ {TX.sprayTime}: <b>{result.sprayTime || result.bestTimeToSpray || "Early morning 6–8 AM"}</b>
                </div>
                {result.urgency && (
                  <div style={{ marginTop: 6, padding: "6px 10px", background: "#fff5f0", borderRadius: 7, fontSize: 12, color: C.red }}>
                    ⚠️ {TX.urgency}: {result.urgency}
                  </div>
                )}
              </Card>

              <Card>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>
                  🧪 {TX.medicines}
                </div>
                {(result.medicines || []).map((m, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.text, marginBottom: 4, padding: "4px 8px", background: C.bg, borderRadius: 6 }}>💊 {m}</div>
                ))}
                <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, margin: "10px 0 5px" }}>
                  🌿 {TX.organic}:
                </div>
                {(result.organic || []).map((o, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.bg2, marginBottom: 3 }}>🍃 {o}</div>
                ))}
              </Card>
            </div>
          </div>

          {/* Prevention */}
          {(result.prevention || []).length > 0 && (
            <Card style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>
                🛡️ {TX.prevention}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {(result.prevention || []).map((p, i) => (
                  <div key={i} style={{ padding: "8px 10px", background: C.pale, borderRadius: 8, fontSize: 12, color: C.text }}>
                    ✅ {p}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 9 }}>
            <Btn onClick={() => { setStep("upload"); setResult(null); setImagePreview(null); }}>
              {TX.scanAnother}
            </Btn>
            <Btn variant="outline">{TX.shareReport}</Btn>
          </div>
        </div>
      )}
    </div>
  );
}