// src/pages/AuthPage.jsx
import { useState } from "react";
import S from "../utils/storage";
import C from "../constants/colors";
import T from "../constants/translates";
import { CROPS_ALL, STATES_TN_DISTRICTS } from "../constants/crops";
import { LANGUAGES } from "../App";
import Input from "../components/ui/Input";
import Btn from "../components/ui/Btn";

// ─── Language Pill selector shown inside auth card ────────────────────────────
function AuthLangPicker({ lang, setLang }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 20 }}>
      {LANGUAGES.map(l => (
        <button
          key={l.code}
          onClick={() => { setLang(l.code); S.set("app_lang", l.code); }}
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          5,
            padding:      "6px 13px",
            borderRadius: 20,
            border:       lang === l.code ? "2px solid #1a5a30" : "2px solid #dce8dc",
            background:   lang === l.code ? "#eaf5ea" : "#f5fbf5",
            cursor:       "pointer",
            fontSize:     12.5,
            fontWeight:   lang === l.code ? 700 : 400,
            color:        lang === l.code ? "#1a5a30" : "#666",
            transition:   "all 0.18s",
            boxShadow:    lang === l.code ? "0 1px 6px rgba(26,90,48,0.15)" : "none",
          }}
        >
          <span style={{ fontSize: 15 }}>{l.flag}</span>
          <span>{l.native}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Main AuthPage ─────────────────────────────────────────────────────────────
function AuthPage({ onLogin, lang, setLang }) {
  const [mode,    setMode]    = useState("login");
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "", phone: "", password: "", confirm: "",
    district: "", state: "Tamil Nadu",
    landSize: "", crops: [],
  });

  // Translation shortcut using current lang
  const t = (path) => {
    try {
      const val = path.split(".").reduce((obj, key) => obj[key], T[lang]);
      return val || path;
    } catch { return path; }
  };

  const f = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setErr(""); };

  const handleLogin = () => {
    setErr("");
    if (!form.phone || !form.password) return setErr(t("Phone and password required") || "Phone and password required");
    const users = S.get("users") || [];
    const found = users.find(u => u.phone === form.phone && u.password === form.password);
    if (!found) return setErr(t("Invalid phone number or password") || "Invalid phone number or password");
    S.set("current_user", found);
    onLogin(found);
  };

  const handleRegister = () => {
    setErr("");
    if (step === 1) {
      if (!form.name || !form.phone || !form.password) return setErr(t("Phone and password required") || "Phone and password required");
      if (form.phone.length < 10) return setErr(t("Enter valid 10-digit mobile number") || "Enter valid 10-digit mobile number");
      if (form.password !== form.confirm) return setErr(t("Passwords do not match") || "Passwords do not match");
      if (form.password.length < 6) return setErr("Password must be at least 6 characters");
      const users = S.get("users") || [];
      if (users.find(u => u.phone === form.phone)) return setErr(t("auth.phone_taken") || "Phone already registered.");
      setStep(2);
    } else {
      setLoading(true);
      const users = S.get("users") || [];
      const newUser = {
        id: Date.now().toString(),
        name: form.name, phone: form.phone, password: form.password,
        district: form.district, state: form.state,
        landSize: parseFloat(form.landSize) || 0,
        crops: form.crops,
        language: lang,        // ← save chosen language with account
        lat: 9.9252, lon: 78.1198,
        farms: [], cropHistory: [], diseaseHistory: [],
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      S.set("users", users);
      S.set("current_user", newUser);
      setTimeout(() => { setLoading(false); onLogin(newUser); }, 800);
    }
  };

  const cropToggle = (c) =>
    setForm(p => ({ ...p, crops: p.crops.includes(c) ? p.crops.filter(x => x !== c) : [...p.crops, c] }));

  const switchMode = (m) => { setMode(m); setErr(""); setSuccess(""); setStep(1); };

  // ── Label strings (from T or fallbacks) ─────────────────────────────────────
  const L = {
    welcome:       t("Welcome to Agro Zenith")       || "Welcome to Agro Zenith",
    tagline:       t("AI-powered farming assistant")      || "AI-powered farming assistant",
    chooseLang:    t("Choose your language")   || "Choose your language",
    loginTab:      t("signIn")        || "Login",
    registerTab:   t("Register")      || "Register",
    phone:         t("Phone Number")         || "Phone Number",
    password:      t("Password")      || "Password",
    loginBtn:      t("Login")      || "Login",
    name:          t("Full Name")          || "Full Name",
    confirmPwd:    t("Confirm Password") || "Confirm Password",
    district:      t("District")      || "District",
    landSize:      t("Farm Size")      || "Farm Size (acres)",
    crops:         t("Your Crops")         || "Your Crops",
    registerBtn:   t("Create Account")   || "Create Account",
    hasAccount:    t("Already")    || "Already have an account?",
    noAccount:     t("Don't have an account?")     || "Don't have an account?",
    step1:         "Step 1 of 2 — Personal Details",
    step2:         "Step 2 of 2 — Farm Details",
    nextBtn:       "Next →",
    backBtn:       "← Back",
    creating:      "Creating account…",
    selectCrops:   t("Select your crops")   || "Select your crops",
  };

  return (
    <div style={{
      minHeight:      "100vh",
      background:     `linear-gradient(145deg, ${C.dark} 0%, ${C.bg1} 50%, #0a4020 100%)`,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      padding:        16,
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🌿</div>
          <div style={{ color: "#fff", fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Agro Zenith
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 3 }}>
            {L.tagline}
          </div>
        </div>

        {/* Auth Card */}
        <div style={{
          background:   "rgba(255,255,255,0.97)",
          borderRadius: 18,
          padding:      "24px 26px 28px",
          boxShadow:    "0 20px 60px rgba(0,0,0,0.3)",
        }}>

          {/* ── Language Selector — always visible at top of card ────────────── */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 11, color: C.muted, textAlign: "center", marginBottom: 8, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              🌐 {L.chooseLang}
            </div>
            <AuthLangPicker lang={lang} setLang={setLang} />
          </div>

          <div style={{ height: 1, background: C.border, marginBottom: 18 }} />

          {/* ── Login / Register Tabs ────────────────────────────────────────── */}
          <div style={{ display: "flex", marginBottom: 20, background: C.bg, borderRadius: 10, padding: 3 }}>
            {[
              { id: "login",    icon: "🔑", label: L.loginTab    },
              { id: "register", icon: "✨", label: L.registerTab },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => switchMode(tab.id)}
                style={{
                  flex:       1,
                  padding:    "9px",
                  borderRadius: 8,
                  fontSize:   13.5,
                  fontWeight: 500,
                  cursor:     "pointer",
                  background: mode === tab.id ? "#fff" : "transparent",
                  color:      mode === tab.id ? C.text : C.muted,
                  border:     "none",
                  boxShadow:  mode === tab.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* ── Error / Success ──────────────────────────────────────────────── */}
          {err && (
            <div style={{ background: "#fff5f5", color: C.red, padding: "10px 12px", borderRadius: 8, fontSize: 13, marginBottom: 14, border: "1px solid #f5c6c6" }}>
              ⚠️ {err}
            </div>
          )}
          {success && (
            <div style={{ background: "#f0fff4", color: "#1a5a30", padding: "10px 12px", borderRadius: 8, fontSize: 13, marginBottom: 14, border: "1px solid #b2dfdb" }}>
              ✅ {success}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              LOGIN FORM
          ════════════════════════════════════════════════════════════════════ */}
          {mode === "login" && (
            <>
              <Input label={L.phone}    type="tel"      value={form.phone}    onChange={f("phone")}    placeholder="10-digit mobile number" required />
              <Input label={L.password} type="password" value={form.password} onChange={f("password")} placeholder="Enter password" required />
              <Btn onClick={handleLogin} style={{ width: "100%", padding: 12, fontSize: 15, marginTop: 4 }}>
                {L.loginBtn} →
              </Btn>
              <div style={{ textAlign: "center", marginTop: 14, fontSize: 12.5, color: C.muted }}>
                {L.noAccount}{" "}
                <span onClick={() => switchMode("register")} style={{ color: C.bg2, cursor: "pointer", fontWeight: 600 }}>
                  {L.registerTab}
                </span>
              </div>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              REGISTER — STEP 1
          ════════════════════════════════════════════════════════════════════ */}
          {mode === "register" && step === 1 && (
            <>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 14, padding: "8px 12px", background: C.pale, borderRadius: 7 }}>
                📱 {L.step1}
              </div>
              <Input label={L.name}       value={form.name}     onChange={f("name")}     placeholder="Your full name" required />
              <Input label={L.phone}      type="tel"    value={form.phone}    onChange={f("phone")}    placeholder="10-digit number" required />
              <Input label={L.password}   type="password" value={form.password} onChange={f("password")} placeholder="Minimum 6 characters" required />
              <Input label={L.confirmPwd} type="password" value={form.confirm}  onChange={f("confirm")}  placeholder="Repeat password" required />
              <Btn onClick={handleRegister} style={{ width: "100%", padding: 12 }}>
                {L.nextBtn}
              </Btn>
              <div style={{ textAlign: "center", marginTop: 14, fontSize: 12.5, color: C.muted }}>
                {L.hasAccount}{" "}
                <span onClick={() => switchMode("login")} style={{ color: C.bg2, cursor: "pointer", fontWeight: 600 }}>
                  {L.loginTab}
                </span>
              </div>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              REGISTER — STEP 2
          ════════════════════════════════════════════════════════════════════ */}
          {mode === "register" && step === 2 && (
            <>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 14, padding: "8px 12px", background: C.pale, borderRadius: 7 }}>
                🌾 {L.step2}
              </div>

              {/* District select */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12.5, color: C.muted, display: "block", marginBottom: 5, fontWeight: 500 }}>
                  {L.district} *
                </label>
                <select
                  value={form.district}
                  onChange={f("district")}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13.5, color: C.text, background: "#fff", outline: "none" }}
                >
                  {(STATES_TN_DISTRICTS || ["Madurai","Chennai","Coimbatore","Trichy","Salem","Tirunelveli","Erode","Vellore","Dindigul","Thanjavur","Pollachi","Ooty"]).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Land size */}
              <Input label={L.landSize} type="number" value={form.landSize} onChange={f("landSize")} placeholder="e.g. 3.5" hint="1 hectare = 2.47 acres" />

              {/* Crop picker */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12.5, color: C.muted, display: "block", marginBottom: 6, fontWeight: 500 }}>
                  {L.selectCrops}
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 130, overflowY: "auto", padding: "2px 0" }}>
                  {(CROPS_ALL || [
                    "Tomato","Rice","Wheat","Maize","Cotton","Onion","Potato",
                    "Groundnut","Sugarcane","Turmeric","Banana","Mango","Coconut",
                    "Ragi","Toor Dal","Urad Dal","Sesame","Green Chilli","Carrot","Cauliflower",
                  ]).slice(0, 24).map(c => (
                    <button
                      key={c}
                      onClick={() => cropToggle(c)}
                      style={{
                        padding:    "5px 10px",
                        borderRadius: 16,
                        fontSize:   12,
                        cursor:     "pointer",
                        background: form.crops.includes(c) ? C.bg2 : C.bg,
                        color:      form.crops.includes(c) ? "#fff" : C.text,
                        border:     `1.5px solid ${form.crops.includes(c) ? C.bg2 : C.border}`,
                        transition: "all 0.15s",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language saved note */}
              <div style={{ fontSize: 11.5, color: "#1a5a30", background: "#eaf5ea", padding: "7px 11px", borderRadius: 7, marginBottom: 14, display: "flex", gap: 6, alignItems: "center" }}>
                🌐 {lang === "ta" ? "தமிழ்" : lang === "hi" ? "हिंदी" : "English"} — {lang === "ta" ? "இந்த மொழி உங்கள் கணக்கில் சேமிக்கப்படும்" : lang === "hi" ? "यह भाषा आपके खाते में सहेजी जाएगी" : "This language will be saved to your account"}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>
                  {L.backBtn}
                </Btn>
                <Btn onClick={handleRegister} disabled={loading} style={{ flex: 2 }}>
                  {loading ? L.creating : `✅ ${L.registerBtn}`}
                </Btn>
              </div>
            </>
          )}
        </div>

        {/* Footer note */}
        <div style={{ textAlign: "center", marginTop: 14, color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
          🌿 Agro Zenith — SRM MCET, Sivagangai
        </div>
      </div>
    </div>
  );
}

export default AuthPage;