import React, { useState } from 'react';

export default function NavItem({ icon, label, active, onClick, badge, id }) {
  // 1. State to track hover for the glow effect
  const [isHovered, setIsHovered] = useState(false);

  // 2. Define the glow color (matches your Agro Zenith green)
  const glowColor = "rgba(52, 211, 153, 0.4)"; 

  return (
    <button
      onClick={() => onClick(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display:       "flex",
        alignItems:    "center",
        gap:           10,
        padding:       "9px 12px",
        borderRadius:  8,
        cursor:        "pointer",
        width:         "100%",
        textAlign:     "left",
        border:        "none",
        position:      "relative",
        userSelect:    "none",
        transition:    "all 0.2s ease-in-out",
        
        // Background changes on active OR hover
        background:    active 
          ? "rgba(255,255,255,0.15)" 
          : isHovered ? "rgba(255,255,255,0.08)" : "transparent",
        
        color:         active || isHovered ? "#ffffff" : "rgba(255,255,255,0.6)",
        
        // 3. THE GLOW EFFECT
        // Uses box-shadow to create an outer green glow when active or hovered
        boxShadow:     active 
          ? `0 0 15px ${glowColor}, inset 0 0 0 1px rgba(255,255,255,0.2)` 
          : isHovered ? `0 0 10px rgba(240, 20, 20, 0.1)` : "none",
        
        fontSize:      13.5,
        fontWeight:    active ? 600 : 400,
        
        // Slight lift effect on hover
        transform:     isHovered && !active ? "translateX(4px)" : "none",
      }}
    >
      {/* Icon with its own subtle glow if active */}
      <span style={{ 
        fontSize: 16, 
        width: 22, 
        textAlign: "center", 
        flexShrink: 0,
        filter: active ? `drop-shadow(0 0 5px ${glowColor})` : "none"
      }}>
        {icon}
      </span>

      <span style={{ flex: 1 }}>{label}</span>

      {badge && (
        <span style={{
          background:   "#b83232",
          color:        "#fff",
          borderRadius: 10,
          fontSize:     10,
          padding:      "1px 5px",
          minWidth:     16,
          textAlign:    "center",
          flexShrink:   0,
          boxShadow:    "0 0 8px rgba(184, 50, 50, 0.5)"
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}