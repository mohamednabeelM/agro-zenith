// src/components/ui/Badge.jsx
import C from "../../constants/colors";

export default function Badge({ children, color = C.bg2, bg = C.pale }) {
  return (
    <span style={{ background: bg, color, padding: "3px 9px", borderRadius: 12, fontSize: 11.5, fontWeight: 500, display: "inline-block" }}>
      {children}
    </span>
  );
}