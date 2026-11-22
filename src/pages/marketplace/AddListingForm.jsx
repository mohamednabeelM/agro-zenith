// Add/Edit Listing Form
import React, { useState } from "react";
import C from "../../constants/colors";
import { CROP_NAMES, CROP_CATEGORIES, getCropIcon, addListing, updateListing } from "../../utils/marketplaceData";

export default function AddListingForm({ seller, existingListing, onSaved, onCancel }) {
  const isEdit = !!existingListing;
  const [form, setForm] = useState(existingListing || {
    cropName: "", category: "Vegetables", cropImage: "",
    quantity: "", unit: "kg", price: "",
    description: "", harvestDate: "", location: seller?.location || "",
    availability: "available", featured: false,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.cropName) e.cropName = "Select a crop";
    if (!form.quantity || Number(form.quantity) <= 0) e.quantity = "Enter valid quantity";
    if (!form.price || Number(form.price) <= 0) e.price = "Enter valid price";
    if (!form.location.trim()) e.location = "Location required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const data = { ...form, quantity: Number(form.quantity), price: Number(form.price), sellerId: seller.id };
    if (isEdit) {
      updateListing(existingListing.id, data);
      onSaved("updated");
    } else {
      addListing(data);
      onSaved("added");
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, cropImage: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const inputStyle = (key) => ({
    width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 13,
    border: `1.5px solid ${errors[key] ? C.red : C.border}`,
    background: "#fff", boxSizing: "border-box", transition: "border 0.2s",
  });

  return (
    <div style={{ maxWidth: 580, margin: "0 auto" }}>
      <div style={{
        background: `linear-gradient(135deg, ${C.dark}, ${C.bg1})`,
        borderRadius: "16px 16px 0 0", padding: "24px 28px", color: "#fff",
      }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
          {isEdit ? "✏️ Edit Listing" : "🌾 Create New Listing"}
        </h2>
        <p style={{ margin: "6px 0 0", fontSize: 12, opacity: 0.7 }}>
          {isEdit ? "Update your crop listing details" : "List your crop for buyers to find"}
        </p>
      </div>

      <div style={{
        background: "#fff", borderRadius: "0 0 16px 16px", padding: "24px 28px",
        border: `1px solid ${C.border}`, borderTop: "none",
      }}>
        {/* Crop image upload */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>
            Crop Photo
          </label>
          <div style={{
            height: 140, borderRadius: 12, border: `2px dashed ${C.border}`,
            background: form.cropImage ? `url(${form.cropImage}) center/cover` : C.pale,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", position: "relative", overflow: "hidden",
          }} onClick={() => document.getElementById("crop-image-input").click()}>
            {!form.cropImage && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>📷</div>
                <div style={{ fontSize: 12, color: C.muted }}>Click to upload crop photo</div>
              </div>
            )}
            {form.cropImage && (
              <button onClick={(e) => { e.stopPropagation(); setForm(f => ({ ...f, cropImage: "" })); }}
                style={{
                  position: "absolute", top: 8, right: 8, width: 28, height: 28,
                  borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none",
                  color: "#fff", cursor: "pointer", fontSize: 12,
                }}>✕</button>
            )}
          </div>
          <input id="crop-image-input" type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
        </div>

        {/* Crop name selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>
            Crop Name <span style={{ color: C.red }}>*</span>
          </label>
          <select value={form.cropName} onChange={e => setForm(f => ({ ...f, cropName: e.target.value }))}
            style={{ ...inputStyle("cropName"), cursor: "pointer" }}>
            <option value="">— Select Crop —</option>
            {CROP_NAMES.map(c => (
              <option key={c} value={c}>{getCropIcon(c)} {c}</option>
            ))}
          </select>
          {errors.cropName && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{errors.cropName}</div>}
        </div>

        {/* Category */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>Category</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            style={{ ...inputStyle("category"), cursor: "pointer" }}>
            {CROP_CATEGORIES.filter(c => c !== "All").map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Quantity + Unit */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>
              Quantity <span style={{ color: C.red }}>*</span>
            </label>
            <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
              placeholder="e.g. 500" style={inputStyle("quantity")} min="0" />
            {errors.quantity && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{errors.quantity}</div>}
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>Unit</label>
            <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
              style={{ ...inputStyle("unit"), cursor: "pointer" }}>
              <option value="kg">Kilogram (kg)</option>
              <option value="ton">Ton</option>
              <option value="quintal">Quintal</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>
            Price per kg (₹) <span style={{ color: C.red }}>*</span>
          </label>
          <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            placeholder="e.g. 28" style={inputStyle("price")} min="0" />
          {errors.price && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{errors.price}</div>}
        </div>

        {/* Harvest date */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>Harvest Date</label>
          <input type="date" value={form.harvestDate} onChange={e => setForm(f => ({ ...f, harvestDate: e.target.value }))}
            style={inputStyle("harvestDate")} />
        </div>

        {/* Location */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>
            Location <span style={{ color: C.red }}>*</span>
          </label>
          <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            placeholder="Village, District, State" style={inputStyle("location")} />
          {errors.location && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{errors.location}</div>}
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe quality, variety, organic status, etc."
            rows={3} style={{ ...inputStyle("description"), resize: "vertical", fontFamily: "inherit" }} />
        </div>

        {/* Availability */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>Status</label>
          <div style={{ display: "flex", gap: 10 }}>
            {["available", "sold"].map(s => (
              <button key={s} onClick={() => setForm(f => ({ ...f, availability: s }))}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                  border: `2px solid ${form.availability === s ? (s === "available" ? C.bg2 : C.red) : C.border}`,
                  background: form.availability === s ? (s === "available" ? C.pale : C.redPale) : "#fff",
                  color: form.availability === s ? (s === "available" ? C.bg2 : C.red) : C.muted,
                  fontWeight: 700, fontSize: 13, transition: "all 0.2s",
                }}>
                {s === "available" ? "✅ Available" : "🚫 Sold Out"}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "13px", borderRadius: 10, border: `2px solid ${C.border}`,
            background: "#fff", color: C.text, fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>Cancel</button>
          <button onClick={handleSubmit} style={{
            flex: 2, padding: "13px", borderRadius: 10, border: "none",
            background: `linear-gradient(135deg, ${C.bg2}, ${C.light})`, color: "#fff",
            fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: `0 4px 14px ${C.bg2}44`,
          }}>{isEdit ? "💾 Update Listing" : "🚀 Publish Listing"}</button>
        </div>
      </div>
    </div>
  );
}
