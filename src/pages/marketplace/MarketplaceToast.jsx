// Toast notification component for Marketplace
import React, { useEffect } from "react";

export default function MarketplaceToast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { bg: "linear-gradient(135deg, #0e3a1c, #1a6b32)", border: "#2e9b4e", icon: "✅" },
    error:   { bg: "linear-gradient(135deg, #7f1d1d, #b83232)", border: "#ef4444", icon: "❌" },
    info:    { bg: "linear-gradient(135deg, #1e3a5f, #1a5e90)", border: "#3b82f6", icon: "ℹ️" },
    warning: { bg: "linear-gradient(135deg, #78350f, #c87010)", border: "#f59e0b", icon: "⚠️" },
  };
  const c = colors[type] || colors.success;

  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 10000,
      background: c.bg, color: "#fff", padding: "14px 20px",
      borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      border: `1px solid ${c.border}`, display: "flex", alignItems: "center", gap: 10,
      animation: "slideInRight 0.3s ease-out", maxWidth: 380,
      backdropFilter: "blur(10px)", fontSize: 13, fontWeight: 500,
    }}>
      <span style={{ fontSize: 18 }}>{c.icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{
        background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
        borderRadius: 6, width: 24, height: 24, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
      }}>✕</button>
    </div>
  );
}
