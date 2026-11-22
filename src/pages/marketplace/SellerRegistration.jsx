// Seller Registration Form
import React, { useState } from "react";
import C from "../../constants/colors";
import { registerSeller } from "../../utils/marketplaceData";

export default function SellerRegistration({ user, onRegistered, onCancel }) {
  const [form, setForm] = useState({
    name: user?.name || "", phone: user?.phone || "",
    email: "", location: user?.district ? `${user.district}, Tamil Nadu` : "",
    profileImage: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) e.phone = "Valid 10-digit phone required";
    if (!form.location.trim()) e.location = "Location is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const seller = registerSeller({ ...form, userId: user?.id });
    onRegistered(seller);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, profileImage: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const field = (label, key, placeholder, type = "text", required = true) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>
        {label} {required && <span style={{ color: C.red }}>*</span>}
      </label>
      <input
        type={type} value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 13,
          border: `1.5px solid ${errors[key] ? C.red : C.border}`,
          background: "#fff", transition: "border 0.2s", boxSizing: "border-box",
        }}
      />
      {errors[key] && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{errors[key]}</div>}
    </div>
  );

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{
        background: `linear-gradient(135deg, ${C.dark}, ${C.bg1})`,
        borderRadius: "16px 16px 0 0", padding: "24px 28px", color: "#fff",
      }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>👨‍🌾 Register as Seller</h2>
        <p style={{ margin: "6px 0 0", fontSize: 12, opacity: 0.7 }}>
          Start selling your crops directly to buyers
        </p>
      </div>

      <div style={{
        background: "#fff", borderRadius: "0 0 16px 16px", padding: "24px 28px",
        border: `1px solid ${C.border}`, borderTop: "none",
      }}>
        {/* Profile image */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", margin: "0 auto 10px",
            background: form.profileImage ? `url(${form.profileImage}) center/cover` : `linear-gradient(135deg, ${C.bg2}, ${C.light})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 28, fontWeight: 700,
            border: `3px solid ${C.pale}`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}>
            {!form.profileImage && (form.name?.slice(0, 2).toUpperCase() || "👤")}
          </div>
          <label style={{
            fontSize: 12, color: C.bg2, cursor: "pointer", fontWeight: 600,
            padding: "4px 12px", borderRadius: 6, background: C.pale,
          }}>
            📷 Upload Photo (optional)
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
          </label>
        </div>

        {field("Full Name", "name", "Enter your full name")}
        {field("Phone Number", "phone", "10-digit mobile number", "tel")}
        {field("Email Address", "email", "email@example.com (optional)", "email", false)}
        {field("Farm Location", "location", "Village / District / State")}

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "13px", borderRadius: 10, border: `2px solid ${C.border}`,
            background: "#fff", color: C.text, fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>Cancel</button>
          <button onClick={handleSubmit} style={{
            flex: 2, padding: "13px", borderRadius: 10, border: "none",
            background: `linear-gradient(135deg, ${C.bg2}, ${C.light})`, color: "#fff",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
            boxShadow: `0 4px 14px ${C.bg2}44`,
          }}>🌱 Register & Start Selling</button>
        </div>
      </div>
    </div>
  );
}
