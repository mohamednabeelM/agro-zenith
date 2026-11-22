// Listing Detail Modal
import React from "react";
import C from "../../constants/colors";
import { getCropIcon, getSeller } from "../../utils/marketplaceData";

export default function ListingDetail({ listing, onClose, onContact }) {
  if (!listing) return null;
  const seller = getSeller(listing.sellerId);
  const icon = getCropIcon(listing.cropName);
  const sold = listing.availability === "sold";

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9996, backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 9997, background: "#fff", borderRadius: 18, width: "min(580px, 94vw)",
        maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        {/* Hero */}
        <div style={{
          height: 200, background: `linear-gradient(135deg, ${C.pale}, #c6f6d5)`,
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
        }}>
          {listing.cropImage ? (
            <img src={listing.cropImage} alt={listing.cropName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 72 }}>{icon}</span>
          )}
          <button onClick={onClose} style={{
            position: "absolute", top: 14, right: 14, width: 36, height: 36,
            borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none",
            color: "#fff", fontSize: 16, cursor: "pointer",
          }}>✕</button>
          <div style={{
            position: "absolute", bottom: 14, left: 14, display: "flex", gap: 8,
          }}>
            <span style={{
              padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: sold ? "#b83232" : "#16a34a", color: "#fff",
            }}>{sold ? "Sold Out" : "Available"}</span>
            {listing.featured && (
              <span style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: "#f59e0b", color: "#fff" }}>⭐ Featured</span>
            )}
          </div>
        </div>

        <div style={{ padding: "24px 28px" }}>
          {/* Title & Price */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.text, display: "flex", alignItems: "center", gap: 10 }}>
                <span>{icon}</span> {listing.cropName}
              </h2>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>📍 {listing.location}</div>
            </div>
            <div style={{
              background: `linear-gradient(135deg, ${C.dark}, ${C.bg1})`,
              color: "#fff", padding: "10px 18px", borderRadius: 12,
              fontSize: 22, fontWeight: 800,
            }}>
              ₹{listing.price}<span style={{ fontSize: 12, fontWeight: 400, opacity: 0.7 }}>/kg</span>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Quantity", value: `${listing.quantity} ${listing.unit}`, icon: "📦" },
              { label: "Category", value: listing.category || "General", icon: "🏷️" },
              { label: "Harvest Date", value: listing.harvestDate || "N/A", icon: "📅" },
              { label: "Listed", value: new Date(listing.createdAt).toLocaleDateString(), icon: "🕐" },
            ].map((item, i) => (
              <div key={i} style={{
                padding: 14, background: "#f8fdf9", borderRadius: 10,
                border: `1px solid ${C.border}`,
              }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{item.icon} {item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>📝 Description</h4>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>
              {listing.description || "No description provided."}
            </p>
          </div>

          {/* Seller card */}
          {seller && (
            <div style={{
              padding: 18, background: C.pale, borderRadius: 14,
              border: `1px solid ${C.border}`, marginBottom: 20,
            }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>👨‍🌾 Seller Information</h4>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.bg2}, ${C.light})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 18, fontWeight: 700,
                }}>{seller.name?.slice(0, 2).toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{seller.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>📍 {seller.location}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>📞 +91 {seller.phone}</div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => { onContact(listing); }} disabled={sold} style={{
              flex: 1, padding: "14px 20px", borderRadius: 12, border: "none",
              cursor: sold ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14,
              background: sold ? "#e5e7eb" : `linear-gradient(135deg, #25D366, #128C7E)`,
              color: sold ? "#999" : "#fff", minWidth: 140,
              boxShadow: sold ? "none" : "0 4px 14px rgba(37,211,102,0.3)",
            }}>💬 WhatsApp Seller</button>
            <button onClick={onClose} style={{
              flex: 1, padding: "14px 20px", borderRadius: 12, minWidth: 100,
              border: `2px solid ${C.border}`, background: "#fff",
              color: C.text, fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
}
