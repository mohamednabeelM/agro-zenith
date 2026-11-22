// src/components/ui/LanguageSwitcher.jsx
// Standalone component — import this everywhere instead of importing from App.jsx

import { useState } from "react";
import S from "../../utils/storage";

export const LANGUAGES = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "ta", label: "Tamil",   native: "தமிழ்",   flag: "🌿"  },
  { code: "hi", label: "Hindi",   native: "हिंदी",   flag: "🇮🇳" },
];

export default function LanguageSwitcher({ lang, setLang, dark = false }) {
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
                onClick={() => {
                  setLang(l.code);
                  S.set("app_lang", l.code);
                  setOpen(false);
                }}
                style={{
                  padding:    "10px 14px",
                  display:    "flex",
                  alignItems: "center",
                  gap:        8,
                  cursor:     "pointer",
                  background: lang === l.code ? "#f0fff4" : "#fff",
                  borderLeft: lang === l.code ? "3px solid #1a5a30" : "3px solid transparent",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fdf8"}
                onMouseLeave={e => e.currentTarget.style.background = lang === l.code ? "#f0fff4" : "#fff"}
              >
                <span style={{ fontSize: 16 }}>{l.flag}</span>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1a2e1a" }}>{l.native}</div>
                  <div style={{ fontSize: 10.5, color: "#888" }}>{l.label}</div>
                </div>
                {lang === l.code && (
                  <span style={{ marginLeft: "auto", color: "#1a5a30", fontSize: 12 }}>✓</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}