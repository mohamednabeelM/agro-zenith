// Seller Dashboard — manage listings, profile, etc.
import React, { useState } from "react";
import C from "../../constants/colors";
import { getSellerListings, deleteListing, updateListing, updateSeller, getCropIcon } from "../../utils/marketplaceData";

export default function SellerDashboard({ seller, onAddNew, onEditListing, onEditProfile, showToast }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const listings = getSellerListings(seller.id);
  const available = listings.filter(l => l.availability === "available").length;
  const soldOut = listings.filter(l => l.availability === "sold").length;

  const handleDelete = (id) => {
    if (!window.confirm("Delete this listing permanently?")) return;
    deleteListing(id);
    showToast("Listing deleted", "info");
    setRefreshKey(k => k + 1);
  };

  const handleToggleSold = (listing) => {
    const newStatus = listing.availability === "available" ? "sold" : "available";
    updateListing(listing.id, { availability: newStatus });
    showToast(newStatus === "sold" ? "Marked as Sold Out" : "Marked as Available", "success");
    setRefreshKey(k => k + 1);
  };

  return (
    <div key={refreshKey}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${C.dark}, ${C.bg1})`,
        borderRadius: 16, padding: "24px 28px", color: "#fff", marginBottom: 24,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: seller.profileImage ? `url(${seller.profileImage}) center/cover` : `linear-gradient(135deg, ${C.bg2}, ${C.light})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 20, fontWeight: 700, border: "3px solid rgba(255,255,255,0.2)",
            }}>{!seller.profileImage && seller.name?.slice(0, 2).toUpperCase()}</div>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>👨‍🌾 {seller.name}</h2>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>📍 {seller.location} · 📞 {seller.phone}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onEditProfile} style={{
              padding: "10px 18px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer",
              fontWeight: 600, fontSize: 13,
            }}>✏️ Edit Profile</button>
            <button onClick={onAddNew} style={{
              padding: "10px 18px", borderRadius: 10, border: "none",
              background: "#fff", color: C.dark, cursor: "pointer",
              fontWeight: 700, fontSize: 13, boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}>➕ New Listing</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Listings", value: listings.length, icon: "📦", color: C.bg2, bg: C.pale },
          { label: "Available", value: available, icon: "✅", color: "#16a34a", bg: "#f0fdf4" },
          { label: "Sold Out", value: soldOut, icon: "🔴", color: C.red, bg: C.redPale },
        ].map((s, i) => (
          <div key={i} style={{
            padding: 18, borderRadius: 14, background: s.bg,
            border: `1px solid ${s.color}22`, textAlign: "center",
          }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Listings table */}
      <div style={{
        background: "#fff", borderRadius: 14, border: `1px solid ${C.border}`,
        overflow: "hidden",
      }}>
        <div style={{
          padding: "16px 20px", borderBottom: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.text }}>📋 My Listings</h3>
        </div>

        {listings.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>No listings yet</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>Create your first listing to start selling</div>
            <button onClick={onAddNew} style={{
              padding: "12px 24px", borderRadius: 10, border: "none",
              background: `linear-gradient(135deg, ${C.bg2}, ${C.light})`, color: "#fff",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>➕ Create Listing</button>
          </div>
        ) : (
          <div>
            {listings.map((l, i) => (
              <div key={l.id} style={{
                padding: "14px 20px", borderBottom: i < listings.length - 1 ? `1px solid ${C.border}` : "none",
                display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
              }}>
                {/* Crop icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: C.pale, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, flexShrink: 0,
                }}>{getCropIcon(l.cropName)}</div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{l.cropName}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>
                    {l.quantity} {l.unit} · ₹{l.price}/kg · {l.location?.split(",")[0]}
                  </div>
                </div>

                {/* Status badge */}
                <span style={{
                  padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: l.availability === "available" ? "#dcfce7" : "#fee2e2",
                  color: l.availability === "available" ? "#16a34a" : "#b83232",
                }}>{l.availability === "available" ? "Available" : "Sold"}</span>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => handleToggleSold(l)} title={l.availability === "available" ? "Mark Sold" : "Mark Available"}
                    style={{
                      width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.border}`,
                      background: "#fff", cursor: "pointer", fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{l.availability === "available" ? "🔴" : "🟢"}</button>
                  <button onClick={() => onEditListing(l)} title="Edit"
                    style={{
                      width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.border}`,
                      background: "#fff", cursor: "pointer", fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✏️</button>
                  <button onClick={() => handleDelete(l.id)} title="Delete"
                    style={{
                      width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.red}33`,
                      background: C.redPale, cursor: "pointer", fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
