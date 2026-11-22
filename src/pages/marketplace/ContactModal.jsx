// Contact Seller Modal
import React from "react";
import C from "../../constants/colors";
import { getSeller } from "../../utils/marketplaceData";

export default function ContactModal({ listing, onClose }) {
  const seller = getSeller(listing?.sellerId);
  if (!seller) return null;

  const phone = seller.phone?.replace(/\D/g, "");
  const waMsg = encodeURIComponent(
    `Hi ${seller.name}, I'm interested in your ${listing.cropName} listing on Agro Zenith Marketplace.\n\nQuantity: ${listing.quantity} ${listing.unit}\nPrice: ₹${listing.price}/kg\nLocation: ${listing.location}\n\nIs this still available?`
  );
  const waLink = `https://wa.me/91${phone}?text=${waMsg}`;
  const telLink = `tel:+91${phone}`;
  const mailLink = seller.email ? `mailto:${seller.email}?subject=Inquiry: ${listing.cropName} on Agro Zenith&body=Hi ${seller.name},%0A%0AI am interested in your ${listing.cropName} listing.` : null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9998, backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        zIndex: 9999, background: "#fff", borderRadius: 16, width: "min(420px, 92vw)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden",
        animation: "scaleIn 0.25s ease-out",
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${C.dark}, ${C.bg1})`,
          padding: "20px 24px", color: "#fff",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>📞 Contact Seller</div>
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>Reach out directly to the farmer</div>
            </div>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
              borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14,
            }}>✕</button>
          </div>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {/* Seller info */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14, padding: 16,
            background: C.pale, borderRadius: 12, marginBottom: 20,
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg, ${C.bg2}, ${C.light})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 18, fontWeight: 700, flexShrink: 0,
            }}>
              {seller.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{seller.name}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>📍 {seller.location}</div>
            </div>
          </div>

          {/* Crop summary */}
          <div style={{
            padding: 14, background: "#f8fdf9", borderRadius: 10,
            border: `1px solid ${C.border}`, marginBottom: 20, fontSize: 13,
          }}>
            <div style={{ fontWeight: 600, color: C.text, marginBottom: 6 }}>
              Inquiry about: {listing.cropName}
            </div>
            <div style={{ color: C.muted }}>
              {listing.quantity} {listing.unit} · ₹{listing.price}/kg · {listing.location}
            </div>
          </div>

          {/* Contact buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "14px 20px", borderRadius: 12, textDecoration: "none",
              background: "linear-gradient(135deg, #25D366, #128C7E)", color: "#fff",
              fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(37,211,102,0.3)", transition: "transform 0.2s",
            }}>
              <span style={{ fontSize: 20 }}>💬</span> Chat on WhatsApp
            </a>

            <a href={telLink} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "14px 20px", borderRadius: 12, textDecoration: "none",
              background: `linear-gradient(135deg, ${C.bg2}, ${C.light})`, color: "#fff",
              fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
              boxShadow: `0 4px 14px ${C.bg2}44`,
            }}>
              <span style={{ fontSize: 20 }}>📱</span> Call: +91 {phone}
            </a>

            {mailLink && (
              <a href={mailLink} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                padding: "14px 20px", borderRadius: 12, textDecoration: "none",
                background: `linear-gradient(135deg, ${C.blue}, #2980b9)`, color: "#fff",
                fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
                boxShadow: `0 4px 14px ${C.blue}44`,
              }}>
                <span style={{ fontSize: 20 }}>📧</span> Email Seller
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
