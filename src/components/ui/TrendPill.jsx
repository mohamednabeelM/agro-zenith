// src/components/ui/TrendPill.jsx
import C from "../../constants/colors";

export default function TrendPill({ trend, change }) {
  if (trend === "flat") return <span style={{ color: C.muted, fontSize: 12 }}>— Stable</span>;
  return (
    <span style={{ color: trend === "up" ? C.trendUp : C.trendDn, fontWeight: 600, fontSize: 12 }}>
      {trend === "up" ? "▲" : "▼"} {change}%
    </span>
  );
}