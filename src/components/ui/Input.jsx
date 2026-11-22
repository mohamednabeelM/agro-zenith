// src/components/ui/Input.jsx
import C from "../../constants/colors";

export default function Input({ label, type = "text", value, onChange, placeholder, required, style = {}, options, hint }) {
  const s = {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: `1px solid ${C.border}`, fontSize: 13.5, outline: "none",
    background: C.white, boxSizing: "border-box", fontFamily: "inherit", ...style,
  };
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label style={{ fontSize: 12.5, color: C.muted, display: "block", marginBottom: 4, fontWeight: 500 }}>
          {label}{required && <span style={{ color: C.red }}> *</span>}
        </label>
      )}
      {options && Array.isArray(options)
        ? (
          <select value={value} onChange={onChange} style={s}>
            <option value="">Select…</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        )
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={s} />
      }
      {hint && <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{hint}</div>}
    </div>
  );
}