// src/components/ui/Card.jsx
import C from "../../constants/colors";

export default function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{ background: C.white, borderRadius: 12, padding: 16, border: `1px solid ${C.border}`, ...style }}>
      {children}
    </div>
  );
}