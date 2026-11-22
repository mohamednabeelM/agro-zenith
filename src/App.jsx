// src/App.jsx
import React, { useState, useEffect } from "react";
import S from "./utils/storage";
import T from "./constants/translates";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/Footer";
import { fetchAgriNews } from "./utils/api";

// Pages
import Dashboard        from "./pages/Dashboard";
import AgroBot          from "./pages/AgroBot";
import DiseaseDetection from "./pages/DiseaseDetection";
import FarmMap          from "./pages/FarmMap";
import MarketPrices     from "./pages/MarketPrices";
import Marketplace      from "./pages/Marketplace";
import Community        from "./pages/Community";
import Schemes          from "./pages/Schemes";
import Shops            from "./pages/Shops";
import Profile          from "./pages/Profile";
import AuthPage         from "./pages/AuthPage";

// ─────────────────────────────────────────────────────────────────────────────
// Language config
// ─────────────────────────────────────────────────────────────────────────────
export const LANGUAGES = [
  { code: "en", label: "English", native: "English", flag: "🌿" },
  { code: "ta", label: "Tamil",   native: "தமிழ்",   flag: "🌿" },
  { code: "hi", label: "Hindi",   native: "हिंदी",   flag: "🌿" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Responsive hook
// ─────────────────────────────────────────────────────────────────────────────
function useBreakpoint() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return {
    isMobile:  width < 640,
    isTablet:  width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Language Switcher — used in TopBar, Sidebar, Profile
// ─────────────────────────────────────────────────────────────────────────────
export function LanguageSwitcher({ lang, setLang, dark = false }) {
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Change language"
        style={{
          display:        "flex",
          alignItems:     "center",
          gap:            5,
          padding:        "5px 10px",
          borderRadius:   20,
          border:         dark ? "1px solid rgba(255,255,255,0.25)" : "1px solid #d0e4d0",
          background:     dark ? "rgba(255,255,255,0.12)" : "#fff",
          cursor:         "pointer",
          fontSize:       12,
          fontWeight:     600,
          color:          dark ? "#fff" : "#1a5a30",
          whiteSpace:     "nowrap",
        }}
      >
        <span style={{ fontSize: 14 }}>{current.flag}</span>
        <span>{current.native}</span>
        <span style={{ fontSize: 9, opacity: 0.7 }}>▼</span>
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 998 }}
          />
          <div style={{
            position:     "absolute",
            top:          36,
            right:        0,
            zIndex:       999,
            background:   "#fff",
            borderRadius: 10,
            boxShadow:    "0 6px 24px rgba(0,0,0,0.14)",
            overflow:     "hidden",
            minWidth:     140,
          }}>
            {LANGUAGES.map(l => (
              <div
                key={l.code}
                onClick={() => { setLang(l.code); S.set("app_lang", l.code); setOpen(false); }}
                style={{
                  padding:    "10px 14px",
                  display:    "flex",
                  alignItems: "center",
                  gap:        8,
                  cursor:     "pointer",
                  background: lang === l.code ? "#f0fff4" : "#fff",
                  borderLeft: lang === l.code ? "3px solid #1a5a30" : "3px solid transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fdf8"}
                onMouseLeave={e => e.currentTarget.style.background = lang === l.code ? "#f0fff4" : "#fff"}
              >
                <span style={{ fontSize: 16 }}>{l.flag}</span>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1a2e1a" }}>{l.native}</div>
                  <div style={{ fontSize: 10.5, color: "#888" }}>{l.label}</div>
                </div>
                {lang === l.code && <span style={{ marginLeft: "auto", color: "#1a5a30", fontSize: 12 }}>✓</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Bottom Navigation
// ─────────────────────────────────────────────────────────────────────────────
function MobileBottomNav({ page, setPage, t }) {
  const NAV = [
    { page: "dashboard", icon: "🏠", labelKey: "nav.dashboard" },
    { page: "bot",       icon: "🤖", labelKey: "nav.bot"       },
    { page: "disease",   icon: "🔬", labelKey: "nav.disease"   },
    { page: "market",    icon: "📈", labelKey: "nav.market"    },
    { page: "profile",   icon: "👤", labelKey: "nav.profile"   },
  ];

  return (
    <nav style={{
      position:       "fixed",
      bottom:         0,
      left:           0,
      right:          0,
      zIndex:         900,
      background:     "#fff",
      borderTop:      "1px solid #e0eae0",
      display:        "flex",
      justifyContent: "space-around",
      alignItems:     "center",
      height:         60,
      paddingBottom:  "env(safe-area-inset-bottom)",
      boxShadow:      "0 -2px 12px rgba(0,0,0,0.07)",
    }}>
      {NAV.map(n => (
        <button
          key={n.page}
          onClick={() => setPage(n.page)}
          style={{
            flex:           1,
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            gap:            2,
            background:     "none",
            border:         "none",
            cursor:         "pointer",
            padding:        "6px 0",
            position:       "relative",
          }}
        >
          <span style={{ fontSize: 20 }}>{n.icon}</span>
          <span style={{
            fontSize:   9,
            fontWeight: page === n.page ? 700 : 400,
            color:      page === n.page ? "#1a5a30" : "#999",
          }}>
            {t(n.labelKey)?.slice(0, 8)}
          </span>
          {page === n.page && (
            <div style={{
              position:     "absolute",
              bottom:       2,
              width:        4,
              height:       4,
              borderRadius: "50%",
              background:   "#1a5a30",
            }} />
          )}
        </button>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Top Bar
// ─────────────────────────────────────────────────────────────────────────────
function MobileTopBar({ page, bell, lang, setLang, t }) {
  const PAGE_LABELS = {
    dashboard: "🌿 Agro Zenith",
    bot:       `🤖 ${t("nav.bot")}`,
    disease:   `🔬 ${t("nav.disease")}`,
    map:       `🗺️ ${t("nav.map")}`,
    market:    `📈 ${t("nav.market")}`,
    marketplace: `🌾 ${t("nav.marketplace")}`,
    community: `👥 ${t("nav.community")}`,
    schemes:   `🏛️ ${t("nav.schemes")}`,
    shops:     `🏪 ${t("nav.shops")}`,
    profile:   `👤 ${t("nav.profile")}`,
  };

  return (
    <header style={{
      position:       "fixed",
      top:            0,
      left:           0,
      right:          0,
      zIndex:         900,
      height:         54,
      background:     "linear-gradient(135deg, #062010, #0e3a1c)",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "space-between",
      padding:        "0 12px",
      boxShadow:      "0 2px 8px rgba(0,0,0,0.18)",
      gap:            8,
    }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {PAGE_LABELS[page] || "🌿 Agro Zenith"}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <LanguageSwitcher lang={lang} setLang={setLang} dark />
        <div style={{ position: "relative" }}>{bell}</div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tablet Menu Button
// ─────────────────────────────────────────────────────────────────────────────
function TabletMenuBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      position:       "fixed",
      top:            12,
      left:           12,
      zIndex:         1001,
      width:          36,
      height:         36,
      borderRadius:   8,
      background:     "#1a5a30",
      border:         "none",
      cursor:         "pointer",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      boxShadow:      "0 2px 8px rgba(0,0,0,0.2)",
      color:          "#fff",
      fontSize:       18,
    }}>
      ☰
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Notification Bell
// ─────────────────────────────────────────────────────────────────────────────
const AGRICULTURE_SOURCES = "Times Now, CNN-News18, NDTV 24x7, Republic TV";

function NotificationBell({ isMobile }) {
  const [open,        setOpen]        = useState(false);
  const [read,        setRead]        = useState(false);
  const [news,        setNews]        = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [lastFetched, setLastFetched] = useState(null);

  const loadNews = async () => {
    if (lastFetched && Date.now() - lastFetched < 10 * 60 * 1000) return;
    setLoading(true);
    setError("");
    try {
      const parsed = await fetchAgriNews();
      setNews(parsed);
      setRead(false);
      setLastFetched(Date.now());
    } catch (err) {
      setError(err.message || "Failed to load news");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next && news.length === 0) loadNews();
  };

  const severityColor = s => s === "high" ? "#e53e3e" : s === "medium" ? "#d97706" : "#2e9b4e";
  const severityBg    = s => s === "high" ? "#fff5f5" : s === "medium" ? "#fffbeb" : "#f0fff4";

  const dropdownStyle = isMobile
    ? { position: "fixed", top: 54, left: 0, right: 0, width: "100%", borderRadius: "0 0 14px 14px" }
    : { position: "absolute", top: 46, right: 0, width: 330, borderRadius: 14 };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={handleOpen}
        style={{
          width:          38,
          height:         38,
          borderRadius:   "50%",
          background:     isMobile ? "rgba(255,255,255,0.15)" : "#fff",
          border:         isMobile ? "1px solid rgba(255,255,255,0.3)" : "1px solid #e0eae0",
          cursor:         "pointer",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          boxShadow:      "0 2px 8px rgba(0,0,0,0.08)",
          position:       "relative",
        }}
      >
        <span style={{ fontSize: 17 }}>🔔</span>
        {!read && news.length > 0 && (
          <span style={{
            position: "absolute", top: 4, right: 4,
            width: 15, height: 15, borderRadius: "50%",
            background: "#e53e3e", border: "2px solid #fff",
            fontSize: 8, fontWeight: 700, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {news.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 998 }} />
          <div style={{ ...dropdownStyle, background: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", zIndex: 999, overflow: "hidden", fontFamily: "Inter, sans-serif" }}>
            <div style={{ padding: "12px 14px", background: "linear-gradient(135deg, #062010, #0e3a1c)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>🌾 Agriculture News</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{AGRICULTURE_SOURCES}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={e => { e.stopPropagation(); setLastFetched(null); loadNews(); }}
                  style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11, color: "#fff" }}>
                  {loading ? "⏳" : "🔄"}
                </button>
                {!read && news.length > 0 && (
                  <span onClick={() => setRead(true)} style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>Mark read</span>
                )}
              </div>
            </div>

            <div style={{ maxHeight: isMobile ? "60vh" : 380, overflowY: "auto" }}>
              {loading && (
                <div style={{ padding: "28px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🌿</div>
                  <div style={{ fontSize: 12, color: "#888" }}>Fetching live agriculture news…</div>
                </div>
              )}
              {!loading && error && (
                <div style={{ padding: "16px 14px" }}>
                  <div style={{ fontSize: 12, color: "#e53e3e", marginBottom: 8, fontWeight: 600 }}>❌ Failed to load news</div>
                  <div style={{ fontSize: 11, color: "#888", background: "#fff5f5", padding: "8px 10px", borderRadius: 6, wordBreak: "break-word" }}>{error}</div>
                  <button onClick={e => { e.stopPropagation(); setLastFetched(null); loadNews(); }}
                    style={{ marginTop: 10, width: "100%", padding: "7px", background: "#062010", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12 }}>
                    🔄 Retry
                  </button>
                </div>
              )}
              {!loading && !error && news.length === 0 && (
                <div style={{ padding: "24px 14px", textAlign: "center", fontSize: 12, color: "#999" }}>
                  No news loaded yet. Click 🔄 to fetch.
                </div>
              )}
              {!loading && !error && news.map((item, i) => (
                <div key={i} onClick={() => item.url && window.open(item.url, "_blank")}
                  style={{ padding: "10px 14px", borderBottom: "1px solid #f0f5f0", background: severityBg(item.severity), cursor: item.url ? "pointer" : "default" }}
                  onMouseEnter={e => e.currentTarget.style.filter = "brightness(0.97)"}
                  onMouseLeave={e => e.currentTarget.style.filter = "none"}
                >
                  <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: read ? "#ccc" : severityColor(item.severity), marginTop: 4 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, color: "#1a2e1a", lineHeight: 1.45, margin: "0 0 4px" }}>{item.title}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: severityColor(item.severity), background: `${severityColor(item.severity)}18`, padding: "1px 6px", borderRadius: 4 }}>
                          {item.source}
                        </span>
                        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3,
                            background: item.lang === "TA" ? "#e8f4fd" : item.lang === "HI" ? "#fef3e2" : "#f0f0f0",
                            color:      item.lang === "TA" ? "#1565c0" : item.lang === "HI" ? "#e65100" : "#666" }}>
                            {item.lang === "TA" ? "தமிழ்" : item.lang === "HI" ? "हिंदी" : "EN"}
                          </span>
                          <time style={{ fontSize: 10, color: "#aaa" }}>{item.time}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!loading && news.length > 0 && (
              <div style={{ padding: "8px 14px", fontSize: 10, color: "#bbb", textAlign: "center", borderTop: "1px solid #f0f0f0" }}>
                {lastFetched && `Updated ${new Date(lastFetched).toLocaleTimeString()} · `}Refreshes every 10 min
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]           = useState(() => S.get("current_user") || null);
  const [page, setPage]           = useState("dashboard");
  const [sidebarOpen, setSidebar] = useState(false);

  // ── Language: persisted in localStorage, also saved on user object ──────────
  const [lang, setLangState] = useState(() => {
    // Priority: user preference → saved app lang → browser lang → "en"
    const saved = S.get("app_lang");
    if (saved && ["en","ta","hi"].includes(saved)) return saved;
    const browser = navigator.language?.slice(0,2).toLowerCase();
    if (browser === "ta") return "ta";
    if (browser === "hi") return "hi";
    return "en";
  });

  const setLang = (code) => {
    setLangState(code);
    S.set("app_lang", code);
    // Also update user's stored language preference
    if (user) {
      const updated = { ...user, language: code };
      setUser(updated);
      S.set("current_user", updated);
      const users = S.get("users") || [];
      S.set("users", users.map(u => u.id === updated.id ? updated : u));
    }
  };

  // ── Translation helper ────────────────────────────────────────────────────
  const t = (path) => {
    try {
      const val = path.split(".").reduce((obj, key) => obj[key], T[lang]);
      return val || path;
    } catch { return path; }
  };

  const { isMobile, isTablet } = useBreakpoint();

  const handleLogout = () => { S.del("current_user"); setUser(null); };
  const handleSetPage = (p) => { setPage(p); setSidebar(false); };
  
  // Handle user profile updates
  const handleUpdate = (updatedUser) => {
    setUser(updatedUser);
    S.set("current_user", updatedUser);
    const users = S.get("users") || [];
    S.set("users", users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // On login: restore user's saved language preference
  const handleLogin = (u) => {
    if (u.language && ["en","ta","hi"].includes(u.language)) {
      setLangState(u.language);
      S.set("app_lang", u.language);
    }
    setUser(u);
  };

  // ── Auth page (not logged in) — pass lang + setLang so picker works there too
  if (!user) {
    return <AuthPage onLogin={handleLogin} lang={lang} setLang={setLang} />;
  }

  const pages = {
    dashboard: <Dashboard        user={user} setPage={handleSetPage} t={t} lang={lang} />,
    bot:       <AgroBot          user={user} setPage={handleSetPage} t={t} lang={lang} />,
    disease:   <DiseaseDetection user={user} setPage={handleSetPage} t={t} lang={lang} />,
    map:       <FarmMap          user={user} setPage={handleSetPage} t={t} lang={lang} />,
    market:    <MarketPrices     user={user} setPage={handleSetPage} t={t} lang={lang} />,
    marketplace: <Marketplace    user={user} setPage={handleSetPage} t={t} lang={lang} />,
    community: <Community        user={user} setPage={handleSetPage} t={t} lang={lang} />,
    schemes:   <Schemes          user={user} setPage={handleSetPage} t={t} lang={lang} />,
    shops:     <Shops            user={user} setPage={handleSetPage} t={t} lang={lang} />,
    profile:   <Profile          user={user} setPage={handleSetPage} t={t} lang={lang} setLang={setLang} onLogout={handleLogout} onUpdate={handleUpdate} />,
  };

  const bell = <NotificationBell isMobile={isMobile} />;

  // ── MOBILE ────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
        <MobileTopBar page={page} bell={bell} lang={lang} setLang={setLang} t={t} />
        <div style={{ paddingTop: 54, paddingBottom: 68, minHeight: "100vh" }}>
          <div style={{ padding: "16px 14px" }}>{pages[page]}</div>
        </div>
        <MobileBottomNav page={page} setPage={handleSetPage} t={t} />
      </div>
    );
  }

  // ── TABLET ────────────────────────────────────────────────────────────────
  if (isTablet) {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
        <TabletMenuBtn onClick={() => setSidebar(o => !o)} />

        {sidebarOpen && (
          <>
            <div onClick={() => setSidebar(false)}
              style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.4)" }} />
            <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 1000, width: 220, boxShadow: "4px 0 24px rgba(0,0,0,0.2)" }}>
              <Sidebar user={user} page={page} setPage={handleSetPage} t={t} />
            </div>
          </>
        )}

        {/* Top-right: language switcher + bell */}
        <div style={{ position: "fixed", top: 12, right: 16, zIndex: 900, display: "flex", gap: 8, alignItems: "center" }}>
          <LanguageSwitcher lang={lang} setLang={setLang} />
          <div style={{ position: "relative" }}>{bell}</div>
        </div>

        <div style={{ padding: "24px 20px 32px" }}>{pages[page]}</div>
      </div>
    );
  }

  // ── DESKTOP ───────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", background: "#f8fafc" }}>
      <Sidebar user={user} page={page} setPage={handleSetPage} t={t} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
        {/* Top bar — language switcher + bell */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, padding: "12px 28px 0", position: "relative" }}>
          <LanguageSwitcher lang={lang} setLang={setLang} />
          {bell}
        </div>

        <main style={{ flex: 1, padding: "16px 32px 32px" }}>
          {pages[page]}
        </main>

        <Footer t={t} />
      </div>
    </div>
  );
}