// src/pages/Marketplace.jsx — Farmer Marketplace Main Page
import React, { useState, useEffect } from "react";
import C from "../constants/colors";
import {
  getListings,
  getSellerByUserId,
  CROP_CATEGORIES,
  CROP_NAMES,
  LOCATIONS,
  getCropIcon,
  getSeller,
} from "../utils/marketplaceData";

// Components
import CropCard from "./marketplace/CropCard";
import ContactModal from "./marketplace/ContactModal";
import ListingDetail from "./marketplace/ListingDetail";
import SellerRegistration from "./marketplace/SellerRegistration";
import AddListingForm from "./marketplace/AddListingForm";
import SellerDashboard from "./marketplace/SellerDashboard";
import MarketplaceToast from "./marketplace/MarketplaceToast";

export default function Marketplace({ user, setPage, t, lang }) {
  // ── States ──────────────────────────────────────────────────────────────
  const [view, setView] = useState("browse"); // browse | dashboard | register | add | edit
  const [listings, setListings] = useState([]);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals
  const [activeContact, setActiveContact] = useState(null);
  const [activeDetail, setActiveDetail] = useState(null);
  const [editingListing, setEditingListing] = useState(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All Locations");
  const [maxPrice, setMaxPrice] = useState(100);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); // newest | priceAsc | priceDesc
  const [showFavsOnly, setShowFavsOnly] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Dark Mode support locally
  const [darkMode, setDarkMode] = useState(false);

  // ── Load Data ───────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    // Simulate loading skeleton
    const timer = setTimeout(() => {
      setListings(getListings());
      setSeller(getSellerByUserId(user?.id));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [user, refreshKey]);

  // ── Toast Helper ────────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // ── Filtered & Sorted listings ──────────────────────────────────────────
  const getFilteredListings = () => {
    let result = [...listings];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.cropName.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== "All") {
      result = result.filter((l) => l.category === category);
    }

    // Location
    if (location !== "All Locations") {
      result = result.filter((l) => l.location.includes(location));
    }

    // Price range
    result = result.filter((l) => l.price <= maxPrice);

    // Only Available
    if (onlyAvailable) {
      result = result.filter((l) => l.availability === "available");
    }

    // Favorites
    if (showFavsOnly) {
      const favs = JSON.parse(localStorage.getItem("az_marketplace_favorites") || "[]");
      result = result.filter((l) => favs.includes(l.id));
    }

    // Sorting
    if (sortBy === "newest") {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === "priceAsc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  };

  const filteredListings = getFilteredListings();

  // Pagination Slice
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Recently Added
  const recentlyAdded = [...listings]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  // Featured
  const featuredListings = listings.filter((l) => l.featured && l.availability === "available");

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleSellerRegistered = (newSeller) => {
    setSeller(newSeller);
    setView("dashboard");
    showToast("Successfully registered as a seller! Welcome onboard. 🌱", "success");
    setRefreshKey((k) => k + 1);
  };

  const handleListingSaved = (action) => {
    setView("dashboard");
    showToast(
      action === "added" ? "Listing created successfully!" : "Listing updated successfully!",
      "success"
    );
    setRefreshKey((k) => k + 1);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    showToast(`${!darkMode ? "Dark mode" : "Light mode"} activated!`, "info");
  };

  // ── Styles based on theme ───────────────────────────────────────────────
  const themeBg = darkMode ? "#0c1510" : C.bg;
  const themeCardBg = darkMode ? "#16281e" : "#fff";
  const themeText = darkMode ? "#e8f5ee" : C.text;
  const themeMuted = darkMode ? "#8dbda2" : C.muted;
  const themeBorder = darkMode ? "rgba(255,255,255,0.08)" : C.border;

  // ── Render components ───────────────────────────────────────────────────
  return (
    <div style={{ background: themeBg, color: themeText, minHeight: "100%", paddingBottom: 60, transition: "background 0.3s" }}>
      {/* Toast Notification */}
      {toast && (
        <MarketplaceToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modals */}
      {activeContact && (
        <ContactModal
          listing={activeContact}
          onClose={() => setActiveContact(null)}
        />
      )}

      {activeDetail && (
        <ListingDetail
          listing={activeDetail}
          onClose={() => setActiveDetail(null)}
          onContact={(l) => {
            setActiveDetail(null);
            setActiveContact(l);
          }}
        />
      )}

      {/* Top Banner Navigation */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 20, flexWrap: "wrap", gap: 12, borderBottom: `1px solid ${themeBorder}`,
        paddingBottom: 16,
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.bg2, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🌾</span> Farmer Marketplace
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: themeMuted }}>
            Buy fresh crops directly from farmers with no middlemen
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Dark Mode toggle */}
          <button
            onClick={toggleDarkMode}
            style={{
              padding: "10px 14px", borderRadius: 20, border: `1.5px solid ${themeBorder}`,
              background: themeCardBg, color: themeText, cursor: "pointer", fontSize: 13,
              fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          {view !== "browse" && (
            <button
              onClick={() => setView("browse")}
              style={{
                padding: "10px 18px", borderRadius: 20, border: `1.5px solid ${C.bg2}`,
                background: "transparent", color: C.bg2, cursor: "pointer", fontSize: 13,
                fontWeight: 700,
              }}
            >
              🛍️ Browse Marketplace
            </button>
          )}

          {seller ? (
            view !== "dashboard" && (
              <button
                onClick={() => setView("dashboard")}
                style={{
                  padding: "10px 18px", borderRadius: 20, border: "none",
                  background: `linear-gradient(135deg, ${C.bg2}, ${C.light})`,
                  color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700,
                  boxShadow: `0 4px 12px ${C.bg2}44`,
                }}
              >
                👨‍🌾 My Dashboard
              </button>
            )
          ) : (
            <button
              onClick={() => setView("register")}
              style={{
                padding: "10px 18px", borderRadius: 20, border: "none",
                background: `linear-gradient(135deg, ${C.bg2}, ${C.light})`,
                color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700,
                boxShadow: `0 4px 12px ${C.bg2}44`,
              }}
            >
              🚜 Sell Your Crops
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
          <div style={{ height: 60, background: themeCardBg, borderRadius: 12, border: `1px solid ${themeBorder}`, animation: "pulse 1.5s infinite" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{
                height: 340, background: themeCardBg, borderRadius: 16, border: `1px solid ${themeBorder}`,
                padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between",
                animation: "pulse 1.5s infinite",
              }}>
                <div style={{ height: 160, background: darkMode ? "#223b2c" : "#e2ebd9", borderRadius: 12 }} />
                <div style={{ height: 20, background: darkMode ? "#223b2c" : "#e2ebd9", width: "60%", borderRadius: 4 }} />
                <div style={{ height: 40, background: darkMode ? "#223b2c" : "#e2ebd9", borderRadius: 4 }} />
                <div style={{ height: 30, background: darkMode ? "#223b2c" : "#e2ebd9", borderRadius: 4 }} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ── VIEWS ─────────────────────────────────────────────────────────────
        <>
          {/* Register View */}
          {view === "register" && (
            <SellerRegistration
              user={user}
              onRegistered={handleSellerRegistered}
              onCancel={() => setView("browse")}
            />
          )}

          {/* Add / Edit Listing View */}
          {(view === "add" || view === "edit") && (
            <AddListingForm
              seller={seller}
              existingListing={editingListing}
              onSaved={handleListingSaved}
              onCancel={() => setView("dashboard")}
            />
          )}

          {/* Dashboard View */}
          {view === "dashboard" && seller && (
            <SellerDashboard
              seller={seller}
              onAddNew={() => {
                setEditingListing(null);
                setView("add");
              }}
              onEditListing={(l) => {
                setEditingListing(l);
                setView("edit");
              }}
              onEditProfile={() => setView("register")}
              showToast={showToast}
            />
          )}

          {/* Browse View */}
          {view === "browse" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
              {/* Featured Section */}
              {featuredListings.length > 0 && (
                <div style={{ padding: "0 0 8px" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: themeText, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>⭐</span> Featured Crops
                  </h3>
                  <div style={{
                    display: "flex", gap: 16, overflowX: "auto", paddingBottom: 12,
                    scrollbarWidth: "thin", WebkitOverflowScrolling: "touch",
                  }}>
                    {featuredListings.map((l) => (
                      <div key={l.id} style={{ minWidth: 280, maxWidth: 300, flexShrink: 0 }}>
                        <CropCard
                          listing={l}
                          onContact={setActiveContact}
                          onViewDetails={setActiveDetail}
                          onFavToggle={() => setRefreshKey((k) => k + 1)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main browse container with sidebar */}
              <div style={{ display: "flex", gap: 24, flexDirection: window.innerWidth < 768 ? "column" : "row" }}>
                {/* Search / Filter Sidebar */}
                <div style={{
                  width: window.innerWidth < 768 ? "100%" : 260, flexShrink: 0,
                  background: themeCardBg, borderRadius: 16, padding: 20,
                  border: `1px solid ${themeBorder}`, alignSelf: "flex-start",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: themeText, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>🔍</span> Filters & Sorting
                  </h3>

                  {/* Search */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: themeMuted, marginBottom: 6 }}>Search Crop</label>
                    <input
                      type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search onion, tomato..."
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 13,
                        border: `1.5px solid ${themeBorder}`, background: darkMode ? "#0c1510" : "#fff",
                        color: themeText, boxSizing: "border-box",
                      }}
                    />
                  </div>

                  {/* Category */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: themeMuted, marginBottom: 6 }}>Category</label>
                    <select
                      value={category} onChange={(e) => setCategory(e.target.value)}
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 13,
                        border: `1.5px solid ${themeBorder}`, background: darkMode ? "#0c1510" : "#fff",
                        color: themeText, cursor: "pointer",
                      }}
                    >
                      {CROP_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: themeMuted, marginBottom: 6 }}>Location</label>
                    <select
                      value={location} onChange={(e) => setLocation(e.target.value)}
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 13,
                        border: `1.5px solid ${themeBorder}`, background: darkMode ? "#0c1510" : "#fff",
                        color: themeText, cursor: "pointer",
                      }}
                    >
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price range */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, color: themeMuted, marginBottom: 6 }}>
                      <span>Max Price / kg</span>
                      <span style={{ color: C.bg2, fontWeight: 800 }}>₹{maxPrice}</span>
                    </div>
                    <input
                      type="range" min="10" max="200" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                      style={{ width: "100%", cursor: "pointer", accentColor: C.bg2 }}
                    />
                  </div>

                  {/* Show only Available toggle */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <input
                      type="checkbox" id="only-avail" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: C.bg2, cursor: "pointer" }}
                    />
                    <label htmlFor="only-avail" style={{ fontSize: 12, fontWeight: 600, color: themeText, cursor: "pointer" }}>
                      Only Available Crops
                    </label>
                  </div>

                  {/* Show Favorites Only */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <input
                      type="checkbox" id="fav-only" checked={showFavsOnly} onChange={(e) => setShowFavsOnly(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: "#e53e3e", cursor: "pointer" }}
                    />
                    <label htmlFor="fav-only" style={{ fontSize: 12, fontWeight: 600, color: themeText, cursor: "pointer" }}>
                      ❤️ Favorites Only
                    </label>
                  </div>

                  {/* Sorting */}
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: themeMuted, marginBottom: 6 }}>Sort By</label>
                    <select
                      value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 13,
                        border: `1.5px solid ${themeBorder}`, background: darkMode ? "#0c1510" : "#fff",
                        color: themeText, cursor: "pointer",
                      }}
                    >
                      <option value="newest">Recently Added</option>
                      <option value="priceAsc">Price: Low to High</option>
                      <option value="priceDesc">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Main Listings Grid */}
                <div style={{ flex: 1 }}>
                  {filteredListings.length === 0 ? (
                    <div style={{
                      background: themeCardBg, borderRadius: 16, padding: "64px 20px",
                      textAlign: "center", border: `1px solid ${themeBorder}`,
                    }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🌾</div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: themeText, margin: 0 }}>No matches found</h4>
                      <p style={{ fontSize: 12, color: themeMuted, margin: "6px 0 0" }}>
                        Try modifying your search or filter values to find listings.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* Grid */}
                      <div style={{
                        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                        gap: 20, marginBottom: 24,
                      }}>
                        {paginatedListings.map((l) => (
                          <CropCard
                            key={l.id}
                            listing={l}
                            onContact={setActiveContact}
                            onViewDetails={setActiveDetail}
                            onFavToggle={() => setRefreshKey((k) => k + 1)}
                          />
                        ))}
                      </div>

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            style={{
                              padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${themeBorder}`,
                              background: themeCardBg, color: themeText, cursor: "pointer",
                              opacity: currentPage === 1 ? 0.5 : 1, fontSize: 12, fontWeight: 600,
                            }}
                          >
                            ◀ Previous
                          </button>
                          <span style={{ fontSize: 12, fontWeight: 700, color: themeMuted }}>
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{
                              padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${themeBorder}`,
                              background: themeCardBg, color: themeText, cursor: "pointer",
                              opacity: currentPage === totalPages ? 0.5 : 1, fontSize: 12, fontWeight: 600,
                            }}
                          >
                            Next ▶
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
