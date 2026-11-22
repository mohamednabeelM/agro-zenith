// src/pages/Profile.jsx
import { useState } from "react";
import C from "../constants/colors";
import S from "../utils/storage";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Btn from "../components/ui/Btn";
import Input from "../components/ui/Input";

const TN_DISTRICTS = [
  "Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri",
  "Dindigul","Erode","Kallakurichi","Kancheepuram","Kanyakumari","Karur",
  "Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Nilgiris",
  "Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivaganga",
  "Tenkasi","Thanjavur","Theni","Thoothukudi","Tirunelveli","Tirupattur",
  "Tiruchirappalli","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur",
  "Vellore","Viluppuram","Virudhunagar",
];

// ── District name translations ────────────────────────────────────────────────
const DISTRICT_TX = {
  ta: {
    "Ariyalur":        "அரியலூர்",
    "Chengalpattu":    "செங்கல்பட்டு",
    "Chennai":         "சென்னை",
    "Coimbatore":      "கோயம்புத்தூர்",
    "Cuddalore":       "கடலூர்",
    "Dharmapuri":      "தர்மபுரி",
    "Dindigul":        "திண்டுக்கல்",
    "Erode":           "ஈரோடு",
    "Kallakurichi":    "கள்ளக்குறிச்சி",
    "Kancheepuram":    "காஞ்சிபுரம்",
    "Kanyakumari":     "கன்னியாகுமரி",
    "Karur":           "கரூர்",
    "Krishnagiri":     "கிருஷ்ணகிரி",
    "Madurai":         "மதுரை",
    "Mayiladuthurai":  "மயிலாடுதுறை",
    "Nagapattinam":    "நாகப்பட்டினம்",
    "Namakkal":        "நாமக்கல்",
    "Nilgiris":        "நீலகிரி",
    "Perambalur":      "பெரம்பலூர்",
    "Pudukkottai":     "புதுக்கோட்டை",
    "Ramanathapuram":  "ராமநாதபுரம்",
    "Ranipet":         "ராணிப்பேட்டை",
    "Salem":           "சேலம்",
    "Sivaganga":       "சிவகங்கை",
    "Tenkasi":         "தென்காசி",
    "Thanjavur":       "தஞ்சாவூர்",
    "Theni":           "தேனி",
    "Thoothukudi":     "தூத்துக்குடி",
    "Tirunelveli":     "திருநெல்வேலி",
    "Tirupattur":      "திருப்பத்தூர்",
    "Tiruchirappalli": "திருச்சிராப்பள்ளி",
    "Tiruppur":        "திருப்பூர்",
    "Tiruvallur":      "திருவள்ளூர்",
    "Tiruvannamalai":  "திருவண்ணாமலை",
    "Tiruvarur":       "திருவாரூர்",
    "Vellore":         "வேலூர்",
    "Viluppuram":      "விழுப்புரம்",
    "Virudhunagar":    "விருதுநகர்",
  },
  hi: {
    "Ariyalur":        "अरियलूर",
    "Chengalpattu":    "चेंगलपट्टू",
    "Chennai":         "चेन्नई",
    "Coimbatore":      "कोयंबटूर",
    "Cuddalore":       "कड्डलोर",
    "Dharmapuri":      "धर्मपुरी",
    "Dindigul":        "डिंडीगुल",
    "Erode":           "इरोड",
    "Kallakurichi":    "कल्लाकुरिची",
    "Kancheepuram":    "कांचीपुरम",
    "Kanyakumari":     "कन्याकुमारी",
    "Karur":           "करूर",
    "Krishnagiri":     "कृष्णगिरि",
    "Madurai":         "मदुरई",
    "Mayiladuthurai":  "मयिलादुतुरई",
    "Nagapattinam":    "नागपट्टिनम",
    "Namakkal":        "नमक्कल",
    "Nilgiris":        "नीलगिरि",
    "Perambalur":      "पेरम्बलूर",
    "Pudukkottai":     "पुदुक्कोट्टई",
    "Ramanathapuram":  "रामनाथपुरम",
    "Ranipet":         "रानीपेट",
    "Salem":           "सेलम",
    "Sivaganga":       "शिवगंगा",
    "Tenkasi":         "तेनकासी",
    "Thanjavur":       "तंजावुर",
    "Theni":           "थेनी",
    "Thoothukudi":     "तूतुकुडी",
    "Tirunelveli":     "तिरुनेलवेली",
    "Tirupattur":      "तिरुपत्तूर",
    "Tiruchirappalli": "तिरुचिरापल्ली",
    "Tiruppur":        "तिरुप्पूर",
    "Tiruvallur":      "तिरुवल्लूर",
    "Tiruvannamalai":  "तिरुवन्नामलई",
    "Tiruvarur":       "तिरुवारूर",
    "Vellore":         "वेल्लोर",
    "Viluppuram":      "विलुप्पुरम",
    "Virudhunagar":    "विरुधुनगर",
  },
};

// ── Crop name translations ────────────────────────────────────────────────────
const CROP_TX = {
  ta: {
    "Tomato":"தக்காளி","Rice":"நெல்","Wheat":"கோதுமை","Maize":"மக்காச்சோளம்",
    "Cotton":"பருத்தி","Onion":"வெங்காயம்","Potato":"உருளைக்கிழங்கு","Brinjal":"கத்திரி",
    "Okra":"வெண்டை","Groundnut":"நிலக்கடலை","Sugarcane":"கரும்பு","Turmeric":"மஞ்சள்",
    "Banana":"வாழை","Mango":"மாம்பழம்","Coconut":"தேங்காய்","Ragi":"ராகி",
    "Bajra":"கம்பு","Toor Dal":"துவரை","Urad Dal":"உளுந்து","Moong Dal":"பாசிப்பருப்பு",
    "Sesame":"எள்","Green Chilli":"பச்சை மிளகாய்","Carrot":"கேரட்",
    "Cauliflower":"காளிஃபிளவர்","Cabbage":"முட்டைக்கோஸ்","Jowar":"சோளம்",
    "Chana":"கொண்டைக்கடலை","Sunflower":"சூரியகாந்தி","Papaya":"பப்பாளி",
    "Guava":"கொய்யா","Pomegranate":"மாதுளை","Jasmine":"மல்லிகை",
    "Rose":"ரோஜா","Marigold":"சாமந்தி","Pepper":"மிளகு",
    "Cardamom":"ஏலக்காய்","Cumin":"சீரகம்","Tea":"தேயிலை",
    "Coffee":"காபி","Areca Nut":"பாக்கு","Dry Chilli":"காய்ந்த மிளகாய்",
  },
  hi: {
    "Tomato":"टमाटर","Rice":"धान","Wheat":"गेहूँ","Maize":"मक्का",
    "Cotton":"कपास","Onion":"प्याज","Potato":"आलू","Brinjal":"बैंगन",
    "Okra":"भिंडी","Groundnut":"मूंगफली","Sugarcane":"गन्ना","Turmeric":"हल्दी",
    "Banana":"केला","Mango":"आम","Coconut":"नारियल","Ragi":"रागी",
    "Bajra":"बाजरा","Toor Dal":"तुअर दाल","Urad Dal":"उड़द दाल","Moong Dal":"मूंग दाल",
    "Sesame":"तिल","Green Chilli":"हरी मिर्च","Carrot":"गाजर",
    "Cauliflower":"फूलगोभी","Cabbage":"पत्तागोभी","Jowar":"ज्वार",
    "Chana":"चना","Sunflower":"सूरजमुखी","Papaya":"पपीता",
    "Guava":"अमरूद","Pomegranate":"अनार","Jasmine":"चमेली",
    "Rose":"गुलाब","Marigold":"गेंदा","Pepper":"काली मिर्च",
    "Cardamom":"इलायची","Cumin":"जीरा","Tea":"चाय",
    "Coffee":"कॉफी","Areca Nut":"सुपारी","Dry Chilli":"सूखी मिर्च",
  },
};

// ── Full UI translations ──────────────────────────────────────────────────────
const PROFILE_TX = {
  ta: {
    title:        "என் சுயவிவரம்",
    editProfile:  "சுயவிவரம் திருத்து",
    saveChanges:  "மாற்றங்களை சேமி",
    cancel:       "ரத்து",
    logout:       "வெளியேறு",
    farmerInfo:   "விவசாயி தகவல்",
    farmDetails:  "வயல் விவரங்கள்",
    myCrops:      "என் பயிர்கள்",
    diseaseHist:  "நோய் வரலாறு",
    noHistory:    "இன்னும் நோய் ஸ்கேன் இல்லை",
    noCrops:      "பயிர்கள் பதிவு இல்லை.",
    nameLabel:    "முழு பெயர்",
    phoneLabel:   "மொபைல்",
    districtLabel:"மாவட்டம்",
    stateLabel:   "மாநிலம்",
    landLabel:    "நில அளவு",
    joined:       "சேர்ந்த தேதி",
    acres:        "ஏக்கர்",
    notSet:       "பதிவு இல்லை",
    savedMsg:     "✅ சுயவிவரம் சேமிக்கப்பட்டது!",
    stateTN:      "தமிழ்நாடு",
  },
  hi: {
    title:        "मेरी प्रोफ़ाइल",
    editProfile:  "प्रोफ़ाइल संपादित करें",
    saveChanges:  "परिवर्तन सहेजें",
    cancel:       "रद्द करें",
    logout:       "लॉगआउट",
    farmerInfo:   "किसान जानकारी",
    farmDetails:  "खेत विवरण",
    myCrops:      "मेरी फसलें",
    diseaseHist:  "रोग इतिहास",
    noHistory:    "अभी तक कोई रोग स्कैन नहीं",
    noCrops:      "कोई फसल दर्ज नहीं।",
    nameLabel:    "पूरा नाम",
    phoneLabel:   "मोबाइल",
    districtLabel:"जिला",
    stateLabel:   "राज्य",
    landLabel:    "भूमि का आकार",
    joined:       "शामिल हुए",
    acres:        "एकड़",
    notSet:       "दर्ज नहीं",
    savedMsg:     "✅ प्रोफ़ाइल सहेजी गई!",
    stateTN:      "तमिलनाडु",
  },
};

export default function Profile({ user, onLogout, setLang, lang, t }) {
  const [edit, setEdit] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name:     user?.name     || "",
    district: user?.district || "",
    landSize: user?.landSize || "",
  });

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = () => {
    const users   = S.get("users") || [];
    const idx     = users.findIndex(u => u.id === user.id);
    const updated = { ...user, ...form, landSize: parseFloat(form.landSize) || 0 };
    if (idx >= 0) {
      users[idx] = updated;
      S.set("users", users);
      S.set("current_user", updated);
    }
    setSaved(true);
    setEdit(false);
    setTimeout(() => setSaved(false), 2000);
  };

  // ── Translation strings ───────────────────────────────────────────────────
  const L  = PROFILE_TX[lang] || {};
  const TX = {
    title:        L.title        || t("profile.title")          || "My Profile",
    editProfile:  L.editProfile  || t("profile.editProfile")    || "Edit Profile",
    saveChanges:  L.saveChanges  || t("profile.saveChanges")    || "Save Changes",
    cancel:       L.cancel       || t("cancel")                 || "Cancel",
    logout:       L.logout       || t("profile.logout")         || "Logout",
    farmerInfo:   L.farmerInfo   || t("profile.farmerInfo")     || "Farmer Information",
    farmDetails:  L.farmDetails  || t("profile.farmDetails")    || "Farm Details",
    myCrops:      L.myCrops      || t("profile.myCrops")        || "My Crops",
    diseaseHist:  L.diseaseHist  || t("profile.diseaseHistory") || "Disease History",
    noHistory:    L.noHistory    || t("profile.noHistory")      || "No disease scans yet",
    noCrops:      L.noCrops      || "No crops registered.",
    nameLabel:    L.nameLabel    || t("auth.name")              || "Full Name",
    phoneLabel:   L.phoneLabel   || t("auth.phone")             || "Mobile",
    districtLabel:L.districtLabel|| t("auth.district")          || "District",
    stateLabel:   L.stateLabel   || "State",
    landLabel:    L.landLabel    || t("auth.farmSize")          || "Land Size",
    joined:       L.joined       || "Joined",
    acres:        L.acres        || t("acres")                  || "acres",
    notSet:       L.notSet       || "Not set",
    savedMsg:     L.savedMsg     || "✅ Profile saved!",
    stateTN:      L.stateTN      || "Tamil Nadu",
  };

  // Crop name translator
  const cropTx = (name) => CROP_TX[lang]?.[name] || name;
  // District name translator
  const districtTx = (name) => DISTRICT_TX[lang]?.[name] || name;

 

  // Safe user fields
  const crops         = Array.isArray(user?.crops)          ? user.crops          : [];
  const diseaseHistory= Array.isArray(user?.diseaseHistory) ? user.diseaseHistory : [];
  const joinedDate    = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN")
    : "—";

  return (
    <div style={{ padding: 22, maxWidth: 620 }}>
      <h1 style={{ fontSize: 21, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>
        👤 {TX.title}
      </h1>

      {saved && (
        <div style={{ background: "#f0fff4", color: "#1a5a30", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 12, border: "1px solid #b2dfdb" }}>
          {TX.savedMsg}
        </div>
      )}

      {/* ── Profile Card ─────────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 14 }}>
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: C.bg2, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700,
          }}>
            {(user?.name || "?").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.text }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: C.muted }}>
              {user?.phone} • {TX.joined} {joinedDate}
            </div>
            <Badge>{districtTx(user?.district)}, TN</Badge>
          </div>
        </div>

        {edit ? (
          <>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {TX.farmerInfo}
            </div>
            <Input label={TX.nameLabel}     value={form.name}     onChange={f("name")} />
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>
                {TX.districtLabel}
              </label>
              <select
                value={form.district}
                onChange={f("district")}
                style={{
                  width: "100%", padding: "8px 10px", borderRadius: 8,
                  border: "1px solid #ddd", fontSize: 13, background: "#fff",
                }}
              >
                <option value="">— {TX.districtLabel} —</option>
                {TN_DISTRICTS.map(d => (
                  <option key={d} value={d}>{districtTx(d)}</option>
                ))}
              </select>
            </div>
            <Input label={`${TX.landLabel} (${TX.acres})`} type="number" value={form.landSize} onChange={f("landSize")} placeholder="e.g. 3.5" />
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <Btn onClick={save}>✅ {TX.saveChanges}</Btn>
              <Btn variant="ghost" onClick={() => setEdit(false)}>{TX.cancel}</Btn>
            </div>
          </>
        ) : (
          <>
            {[
              [TX.phoneLabel,    user?.phone                                        ],
              [TX.districtLabel, districtTx(user?.district)                         ],
              [TX.stateLabel,    TX.stateTN                                         ],
              [TX.landLabel,     `${user?.landSize || TX.notSet} ${TX.acres}`       ],
            ].map(([label, value]) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between",
                padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13,
              }}>
                <span style={{ color: C.muted }}>{label}</span>
                <span style={{ color: C.text, fontWeight: 500 }}>{value}</span>
              </div>
            ))}
            <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Btn onClick={() => setEdit(true)} variant="outline">✏️ {TX.editProfile}</Btn>
              <Btn onClick={onLogout} variant="danger">🚪 {TX.logout}</Btn>
            </div>
          </>
        )}
      </Card>

      {/* ── My Crops ──────────────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>
          🌾 {TX.myCrops} ({crops.length})
        </div>
        {crops.length > 0
          ? <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {crops.map(c => <Badge key={c}>{cropTx(c)}</Badge>)}
            </div>
          : <div style={{ fontSize: 13, color: C.muted }}>{TX.noCrops}</div>
        }
      </Card>

      {/* ── Disease History ───────────────────────────────────────────────── */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>
          🔬 {TX.diseaseHist}
        </div>
        {diseaseHistory.length === 0
          ? <div style={{ fontSize: 13, color: C.muted }}>{TX.noHistory}</div>
          : diseaseHistory.slice(0, 5).map((d, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: i < Math.min(diseaseHistory.length, 5) - 1 ? `1px solid ${C.border}` : "none",
                fontSize: 12.5,
              }}>
                <span style={{ color: C.text }}>{cropTx(d.crop)} — {d.disease}</span>
                <span style={{ color: C.muted }}>{d.date}</span>
              </div>
            ))
        }
      </Card>
    </div>
  );
}