// src/components/ui/Btn.jsx
import C from "../../constants/colors";

export default function Btn({ children, onClick, variant = "primary", style = {}, disabled = false }) {
  const base = {
    padding: "10px 20px", borderRadius: 9, fontSize: 13.5, fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer", border: "none",
    transition: "opacity 0.15s", opacity: disabled ? 0.6 : 1, ...style,
  };
  const variants = {
    primary: { background: C.bg2, color: "#fff" },
    outline:  { background: "transparent", color: C.bg2, border: `1.5px solid ${C.bg2}` },
    ghost:    { background: "transparent", color: C.muted, border: `1px solid ${C.border}` },
    danger:   { background: C.red, color: "#fff" },
    amber:    { background: C.amber, color: "#fff" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  );
}