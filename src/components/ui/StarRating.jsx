// src/components/ui/StarRating.jsx
import C from "../../constants/colors";

export default function StarRating({ n }) {
  return (
    <span style={{ color: "#e0960a", fontSize: 12.5 }}>
      {"★".repeat(Math.floor(n))}{"☆".repeat(5 - Math.floor(n))}{" "}
      <span style={{ color: C.muted, fontSize: 11 }}>{n}</span>
    </span>
  );
}