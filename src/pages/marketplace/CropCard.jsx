// Crop listing card for marketplace grid
import React, { useState } from "react";
import C from "../../constants/colors";
import { getCropIcon, getSeller, isFavorite, toggleFavorite } from "../../utils/marketplaceData";

export default function CropCard({ listing, onContact, onViewDetails, onFavToggle }) {
  const [hovered, setHovered] = useState(false);
  const seller = getSeller(listing.sellerId);
  const fav = isFavorite(listing.id);
  const sold = listing.availability === "sold";
  const icon = getCropIcon(listing.cropName);

  const handleFav = (e) => {
    e.stopPropagation();
    toggleFavorite(listing.id);
    onFavToggle?.();
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onViewDetails(listing)}
      style={{
        background: "#fff", borderRadius: 16, overflow: "hidden",
        border: `1px solid ${hovered ? C.bg2 : C.border}`,
        boxShadow: hovered ? "0 12px 36px rgba(26,107,50,0.15)" : "0 2px 10px rgba(0,0,0,0.06)",
        cursor: "pointer", transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        opacity: sold ? 0.75 : 1, position: "relative",
      }}
    >
      {/* Image area */}
      <div style={{
        height: 160, background: `linear-gradient(135deg, ${C.pale}, #d4edda)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        {listing.cropImage ? (
          <img src={listing.cropImage} alt={listing.cropName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 56, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>{icon}</span>
        )}

        {/* Badges */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
          <span style={{
            padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: sold ? "#b83232" : "#16a34a", color: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}>
            {sold ? "Sold Out" : "Available"}
          </span>
          {listing.featured && (
            <span style={{
              padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
              background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}>⭐ Featured</span>
          )}
        </div>

        {/* Favorite button */}
        <button onClick={handleFav} style={{
          position: "absolute", top: 10, right: 10, width: 34, height: 34,
          borderRadius: "50%", border: "none", cursor: "pointer",
          background: fav ? "#e53e3e" : "rgba(255,255,255,0.9)",
          color: fav ? "#fff" : "#999", fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transition: "all 0.2s",
        }}>
          {fav ? "❤️" : "🤍"}
        </button>

        {/* Price tag */}
        <div style={{
          position: "absolute", bottom: 10, right: 10,
          background: `linear-gradient(135deg, ${C.dark}, ${C.bg1})`,
          color: "#fff", padding: "6px 12px", borderRadius: 10,
          fontSize: 15, fontWeight: 800, boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        }}>
          ₹{listing.price}<span style={{ fontSize: 10, fontWeight: 400, opacity: 0.7 }}>/kg</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{listing.cropName}</h3>
        </div>

        <div style={{ fontSize: 12, color: C.muted, marginBottom: 10, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {listing.description}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: C.pale, color: C.bg2, fontWeight: 600 }}>
            📦 {listing.quantity} {listing.unit}
          </span>
          <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: C.bluePale, color: C.blue, fontWeight: 600 }}>
            📍 {listing.location?.split(",")[0]}
          </span>
        </div>

        {/* Seller info */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 0 0", borderTop: `1px solid ${C.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.bg2}, ${C.light})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 10, fontWeight: 700,
            }}>
              {seller?.name?.slice(0, 2).toUpperCase() || "??"}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{seller?.name || "Unknown"}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{seller?.location?.split(",")[0]}</div>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onContact(listing); }}
            disabled={sold}
            style={{
              padding: "7px 14px", borderRadius: 8, border: "none", cursor: sold ? "not-allowed" : "pointer",
              background: sold ? "#e5e7eb" : `linear-gradient(135deg, ${C.bg2}, ${C.light})`,
              color: sold ? "#999" : "#fff", fontSize: 11, fontWeight: 700,
              boxShadow: sold ? "none" : `0 3px 10px ${C.bg2}44`,
              transition: "all 0.2s",
            }}
          >
            {sold ? "Sold" : "📞 Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}
