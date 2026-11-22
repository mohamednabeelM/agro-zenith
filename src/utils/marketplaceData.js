// src/utils/marketplaceData.js — Marketplace localStorage helpers
import S from "./storage";

const LISTINGS_KEY = "marketplace_listings";
const SELLERS_KEY = "marketplace_sellers";
const FAVORITES_KEY = "marketplace_favorites";

// ── Seed data (demo listings shown on first visit) ─────────────────────────
const SEED_LISTINGS = [
  {
    id: "seed_1", cropName: "Tomato", category: "Vegetables",
    cropImage: "", quantity: 500, unit: "kg", price: 28,
    description: "Fresh organic tomatoes, firm and ripe. Grown without pesticides. Ideal for wholesale buyers.",
    harvestDate: "2026-05-15", location: "Dindigul, Tamil Nadu",
    sellerId: "seed_seller_1", availability: "available", featured: true,
    createdAt: Date.now() - 86400000,
  },
  {
    id: "seed_2", cropName: "Onion", category: "Vegetables",
    cropImage: "", quantity: 2, unit: "ton", price: 22,
    description: "Red onions, medium size, properly cured and dried. Ready for transport.",
    harvestDate: "2026-05-10", location: "Nashik, Maharashtra",
    sellerId: "seed_seller_2", availability: "available", featured: true,
    createdAt: Date.now() - 172800000,
  },
  {
    id: "seed_3", cropName: "Potato", category: "Vegetables",
    cropImage: "", quantity: 1000, unit: "kg", price: 18,
    description: "Fresh Kufri Jyoti potatoes. Clean, sorted, and graded. No damage.",
    harvestDate: "2026-05-12", location: "Coimbatore, Tamil Nadu",
    sellerId: "seed_seller_3", availability: "available", featured: false,
    createdAt: Date.now() - 259200000,
  },
  {
    id: "seed_4", cropName: "Rice (Paddy)", category: "Grains",
    cropImage: "", quantity: 5, unit: "ton", price: 32,
    description: "Samba rice paddy, premium quality. Moisture content below 14%.",
    harvestDate: "2026-05-01", location: "Thanjavur, Tamil Nadu",
    sellerId: "seed_seller_4", availability: "available", featured: true,
    createdAt: Date.now() - 345600000,
  },
  {
    id: "seed_5", cropName: "Carrot", category: "Vegetables",
    cropImage: "", quantity: 300, unit: "kg", price: 35,
    description: "Ooty carrots, fresh from hill farms. Bright orange, sweet variety.",
    harvestDate: "2026-05-18", location: "Nilgiris, Tamil Nadu",
    sellerId: "seed_seller_3", availability: "available", featured: false,
    createdAt: Date.now() - 432000000,
  },
  {
    id: "seed_6", cropName: "Banana", category: "Fruits",
    cropImage: "", quantity: 800, unit: "kg", price: 25,
    description: "Nendran banana, ideal for chips making. Uniform size, green stage.",
    harvestDate: "2026-05-14", location: "Trichy, Tamil Nadu",
    sellerId: "seed_seller_2", availability: "available", featured: false,
    createdAt: Date.now() - 518400000,
  },
  {
    id: "seed_7", cropName: "Brinjal", category: "Vegetables",
    cropImage: "", quantity: 200, unit: "kg", price: 30,
    description: "Purple round brinjal, pest-free. Harvested this morning.",
    harvestDate: "2026-05-19", location: "Madurai, Tamil Nadu",
    sellerId: "seed_seller_1", availability: "sold", featured: false,
    createdAt: Date.now() - 604800000,
  },
  {
    id: "seed_8", cropName: "Coconut", category: "Fruits",
    cropImage: "", quantity: 2000, unit: "kg", price: 15,
    description: "Mature coconuts, high oil content. Copra-grade quality.",
    harvestDate: "2026-05-08", location: "Pollachi, Tamil Nadu",
    sellerId: "seed_seller_4", availability: "available", featured: true,
    createdAt: Date.now() - 691200000,
  },
  {
    id: "seed_9", cropName: "Chilli", category: "Spices",
    cropImage: "", quantity: 150, unit: "kg", price: 120,
    description: "Fresh chillies, vibrant color. Ideal for cooking.",
    harvestDate: "2026-05-20", location: "Chennai, Tamil Nadu",
    sellerId: "seed_seller_4", availability: "available", featured: false,
    createdAt: Date.now() - 777600000,
  },
  {
    id: "seed_10", cropName: "Mango", category: "Fruits",
    cropImage: "", quantity: 500, unit: "kg", price: 40,
    description: "Fresh mangoes, sweet and juicy. Perfect for eating and making juices.",
    harvestDate: "2026-05-25", location: "Chennai, Tamil Nadu",
    sellerId: "seed_seller_4", availability: "available", featured: false,
    createdAt: Date.now() - 864000000,
  },
  {
    id: "seed_11", cropName: "Rose", category: "Flowers",
    cropImage: "", quantity: 100, unit: "bunch", price: 50,
    description: "Fresh roses, vibrant color. Perfect for bouquets and decorations.",
    harvestDate: "2026-05-25", location: "Chennai, Tamil Nadu",
    sellerId: "seed_seller_4", availability: "available", featured: false,
    createdAt: Date.now() - 950400000,
  },

  // ── Vegetables ────────────────────────────────────────────────────────────
  {
    id: "seed_12", cropName: "Cabbage", category: "Vegetables",
    cropImage: "", quantity: 400, unit: "kg", price: 16,
    description: "Fresh green cabbage, tightly packed heads. No pesticides. Ideal for salads and cooking.",
    harvestDate: "2026-05-17", location: "Nilgiris, Tamil Nadu",
    sellerId: "seed_seller_3", availability: "available", featured: false,
    createdAt: Date.now() - 1036800000,
  },
  {
    id: "seed_13", cropName: "Cauliflower", category: "Vegetables",
    cropImage: "", quantity: 250, unit: "kg", price: 24,
    description: "White, firm cauliflower heads. Freshly harvested from hill farms. Good shelf life.",
    harvestDate: "2026-05-18", location: "Coimbatore, Tamil Nadu",
    sellerId: "seed_seller_3", availability: "available", featured: false,
    createdAt: Date.now() - 1123200000,
  },
  {
    id: "seed_14", cropName: "Ladies Finger", category: "Vegetables",
    cropImage: "", quantity: 180, unit: "kg", price: 32,
    description: "Tender okra pods, 3–4 inch size. Harvested at peak freshness. Ideal for stir-fry.",
    harvestDate: "2026-05-21", location: "Madurai, Tamil Nadu",
    sellerId: "seed_seller_1", availability: "available", featured: false,
    createdAt: Date.now() - 1209600000,
  },

  // ── Fruits ────────────────────────────────────────────────────────────────
  {
    id: "seed_15", cropName: "Papaya", category: "Fruits",
    cropImage: "", quantity: 600, unit: "kg", price: 18,
    description: "Red Lady papaya, ripe and sweet. Rich in vitamins. Ready for direct consumption or processing.",
    harvestDate: "2026-05-22", location: "Trichy, Tamil Nadu",
    sellerId: "seed_seller_2", availability: "available", featured: false,
    createdAt: Date.now() - 1296000000,
  },
  {
    id: "seed_16", cropName: "Guava", category: "Fruits",
    cropImage: "", quantity: 350, unit: "kg", price: 30,
    description: "Allahabad Safeda guava, white flesh, highly fragrant. Organically grown.",
    harvestDate: "2026-05-19", location: "Salem, Tamil Nadu",
    sellerId: "seed_seller_5", availability: "available", featured: false,
    createdAt: Date.now() - 1382400000,
  },
  {
    id: "seed_17", cropName: "Pomegranate", category: "Fruits",
    cropImage: "", quantity: 450, unit: "kg", price: 85,
    description: "Bhagwa pomegranate, deep red arils, sweet and juicy. Export quality, hand sorted.",
    harvestDate: "2026-05-16", location: "Nashik, Maharashtra",
    sellerId: "seed_seller_2", availability: "available", featured: true,
    createdAt: Date.now() - 1468800000,
  },
  {
    id: "seed_18", cropName: "Coconut", category: "Fruits",
    cropImage: "", quantity: 1500, unit: "kg", price: 22,
    description: "Fresh tender coconuts, full of water. Ideal for retail and juice stalls.",
    harvestDate: "2026-05-20", location: "Pollachi, Tamil Nadu",
    sellerId: "seed_seller_5", availability: "available", featured: false,
    createdAt: Date.now() - 1555200000,
  },

  // ── Grains ────────────────────────────────────────────────────────────────
  {
    id: "seed_19", cropName: "Wheat", category: "Grains",
    cropImage: "", quantity: 4, unit: "ton", price: 28,
    description: "Lok-1 wheat variety. Clean, moisture below 12%. Machine-harvested and packed.",
    harvestDate: "2026-05-05", location: "Pune, Maharashtra",
    sellerId: "seed_seller_2", availability: "available", featured: false,
    createdAt: Date.now() - 1641600000,
  },
  {
    id: "seed_20", cropName: "Maize", category: "Grains",
    cropImage: "", quantity: 3, unit: "ton", price: 22,
    description: "Yellow hybrid maize, moisture 13%. Suitable for poultry feed and flour milling.",
    harvestDate: "2026-05-10", location: "Erode, Tamil Nadu",
    sellerId: "seed_seller_5", availability: "available", featured: false,
    createdAt: Date.now() - 1728000000,
  },
  {
    id: "seed_21", cropName: "Millets", category: "Grains",
    cropImage: "", quantity: 800, unit: "kg", price: 45,
    description: "Finger millet (Ragi), naturally dried, free from impurities. High nutritional value.",
    harvestDate: "2026-05-08", location: "Dindigul, Tamil Nadu",
    sellerId: "seed_seller_1", availability: "available", featured: true,
    createdAt: Date.now() - 1814400000,
  },

  // ── Pulses ────────────────────────────────────────────────────────────────
  {
    id: "seed_22", cropName: "Black Gram", category: "Pulses",
    cropImage: "", quantity: 500, unit: "kg", price: 92,
    description: "Whole black gram (urad), bold seed, clean and dry. Ideal for dal and papad making.",
    harvestDate: "2026-05-06", location: "Trichy, Tamil Nadu",
    sellerId: "seed_seller_1", availability: "available", featured: false,
    createdAt: Date.now() - 1900800000,
  },
  {
    id: "seed_23", cropName: "Green Gram", category: "Pulses",
    cropImage: "", quantity: 400, unit: "kg", price: 88,
    description: "Whole green gram (moong), sorted and machine cleaned. High germination rate.",
    harvestDate: "2026-05-09", location: "Coimbatore, Tamil Nadu",
    sellerId: "seed_seller_3", availability: "available", featured: false,
    createdAt: Date.now() - 1987200000,
  },
  {
    id: "seed_24", cropName: "Red Gram", category: "Pulses",
    cropImage: "", quantity: 600, unit: "kg", price: 105,
    description: "Arhar/Tur dal, bold grain, low moisture. Premium quality from Kharif harvest.",
    harvestDate: "2026-05-03", location: "Salem, Tamil Nadu",
    sellerId: "seed_seller_5", availability: "available", featured: true,
    createdAt: Date.now() - 2073600000,
  },
  {
    id: "seed_25", cropName: "Bengal Gram", category: "Pulses",
    cropImage: "", quantity: 350, unit: "kg", price: 78,
    description: "Desi chickpea (chana), bold seed, sorted. Suitable for dal, roasting, and flour.",
    harvestDate: "2026-05-04", location: "Erode, Tamil Nadu",
    sellerId: "seed_seller_5", availability: "available", featured: false,
    createdAt: Date.now() - 2160000000,
  },

  // ── Spices ────────────────────────────────────────────────────────────────
  {
    id: "seed_26", cropName: "Turmeric", category: "Spices",
    cropImage: "", quantity: 200, unit: "kg", price: 140,
    description: "Erode turmeric, high curcumin content (4%+). Naturally dried, bright yellow. Bulk available.",
    harvestDate: "2026-05-02", location: "Erode, Tamil Nadu",
    sellerId: "seed_seller_5", availability: "available", featured: true,
    createdAt: Date.now() - 2246400000,
  },
  {
    id: "seed_27", cropName: "Ginger", category: "Spices",
    cropImage: "", quantity: 300, unit: "kg", price: 95,
    description: "Fresh green ginger, strong aroma and pungency. Ideal for cooking, tea, and export.",
    harvestDate: "2026-05-11", location: "Nilgiris, Tamil Nadu",
    sellerId: "seed_seller_3", availability: "available", featured: false,
    createdAt: Date.now() - 2332800000,
  },
  {
    id: "seed_28", cropName: "Coriander", category: "Spices",
    cropImage: "", quantity: 120, unit: "kg", price: 110,
    description: "Whole coriander seeds, machine cleaned. Rich fragrance, bold size. Ideal for spice blends.",
    harvestDate: "2026-05-07", location: "Dindigul, Tamil Nadu",
    sellerId: "seed_seller_1", availability: "available", featured: false,
    createdAt: Date.now() - 2419200000,
  },

  // ── Oilseeds ──────────────────────────────────────────────────────────────
  {
    id: "seed_29", cropName: "Groundnut", category: "Oilseeds",
    cropImage: "", quantity: 1000, unit: "kg", price: 65,
    description: "Bold Java groundnuts, shelled and dried. Oil content 48%+. Suitable for oil mills and snacks.",
    harvestDate: "2026-05-01", location: "Tirunelveli, Tamil Nadu",
    sellerId: "seed_seller_1", availability: "available", featured: true,
    createdAt: Date.now() - 2505600000,
  },
  {
    id: "seed_30", cropName: "Sesame", category: "Oilseeds",
    cropImage: "", quantity: 250, unit: "kg", price: 180,
    description: "White sesame seeds, hulled, food-grade quality. Low moisture. Excellent for tahini and oil.",
    harvestDate: "2026-05-03", location: "Erode, Tamil Nadu",
    sellerId: "seed_seller_5", availability: "available", featured: false,
    createdAt: Date.now() - 2592000000,
  },
  {
    id: "seed_31", cropName: "Mustard", category: "Oilseeds",
    cropImage: "", quantity: 400, unit: "kg", price: 75,
    description: "Black mustard seeds, pungent aroma. Machine cleaned. Ideal for oil extraction and pickling.",
    harvestDate: "2026-04-28", location: "Coimbatore, Tamil Nadu",
    sellerId: "seed_seller_3", availability: "available", featured: false,
    createdAt: Date.now() - 2678400000,
  },
  {
    id: "seed_32", cropName: "Sunflower", category: "Oilseeds",
    cropImage: "", quantity: 600, unit: "kg", price: 58,
    description: "Hybrid sunflower seeds, high oil yield. Dried and cleaned. Ready for oil mill delivery.",
    harvestDate: "2026-04-30", location: "Nashik, Maharashtra",
    sellerId: "seed_seller_2", availability: "available", featured: false,
    createdAt: Date.now() - 2764800000,
  },

  // ── Flowers ───────────────────────────────────────────────────────────────
  {
    id: "seed_33", cropName: "Jasmine", category: "Flowers",
    cropImage: "", quantity: 80, unit: "kg", price: 350,
    description: "Madurai malli jasmine, intensely fragrant. Harvested pre-dawn for peak scent. Temple-grade quality.",
    harvestDate: "2026-05-22", location: "Madurai, Tamil Nadu",
    sellerId: "seed_seller_1", availability: "available", featured: true,
    createdAt: Date.now() - 2851200000,
  },
  {
    id: "seed_34", cropName: "Marigold", category: "Flowers",
    cropImage: "", quantity: 200, unit: "kg", price: 40,
    description: "African marigold, large golden blooms. Freshly picked. Ideal for garlands and festivals.",
    harvestDate: "2026-05-21", location: "Coimbatore, Tamil Nadu",
    sellerId: "seed_seller_3", availability: "available", featured: false,
    createdAt: Date.now() - 2937600000,
  },
  {
    id: "seed_35", cropName: "Jasmine", category: "Flowers",
    cropImage: "", quantity: 60, unit: "bunch", price: 120,
    description: "Bundled jasmine strings, retail-ready. Fresh and fragrant. Supplied daily to flower markets.",
    harvestDate: "2026-05-23", location: "Trichy, Tamil Nadu",
    sellerId: "seed_seller_2", availability: "available", featured: false,
    createdAt: Date.now() - 3024000000,
  },

  // ── Others ────────────────────────────────────────────────────────────────
  {
    id: "seed_36", cropName: "Sugarcane", category: "Others",
    cropImage: "", quantity: 10, unit: "ton", price: 3,
    description: "CO-86032 sugarcane variety, brix 18%+. Freshly cut. Suitable for crushers and jaggery making.",
    harvestDate: "2026-05-14", location: "Thanjavur, Tamil Nadu",
    sellerId: "seed_seller_4", availability: "available", featured: false,
    createdAt: Date.now() - 3110400000,
  },
  {
    id: "seed_37", cropName: "Cotton", category: "Others",
    cropImage: "", quantity: 2, unit: "ton", price: 65,
    description: "Bt cotton, long staple, fully ginned and pressed into bales. Staple length 29mm. Mill-grade quality.",
    harvestDate: "2026-05-08", location: "Erode, Tamil Nadu",
    sellerId: "seed_seller_5", availability: "available", featured: false,
    createdAt: Date.now() - 3196800000,
  },
  {
    id: "seed_38", cropName: "Other", category: "Others",
    cropImage: "", quantity: 500, unit: "kg", price: 55,
    description: "Dry tamarind (Imli), seedless variety, good acidity and color. Ready for food processing and export.",
    harvestDate: "2026-05-01", location: "Tirunelveli, Tamil Nadu",
    sellerId: "seed_seller_1", availability: "available", featured: false,
    createdAt: Date.now() - 3283200000,
  },
];

const SEED_SELLERS = [
  {
    id: "seed_seller_1", name: "Rajesh Kumar", phone: "9876543210",
    email: "rajesh@farm.in", location: "Dindigul, Tamil Nadu",
    profileImage: "", joinedAt: Date.now() - 2592000000,
  },
  {
    id: "seed_seller_2", name: "Priya Devi", phone: "9123456789",
    email: "", location: "Nashik, Maharashtra",
    profileImage: "", joinedAt: Date.now() - 5184000000,
  },
  {
    id: "seed_seller_3", name: "Murugan S", phone: "9988776655",
    email: "murugan@agri.co", location: "Coimbatore, Tamil Nadu",
    profileImage: "", joinedAt: Date.now() - 7776000000,
  },
  {
    id: "seed_seller_4", name: "Anjali R", phone: "9876501234",
    email: "anjali@agri.co", location: "Chennai, Tamil Nadu",
    profileImage: "", joinedAt: Date.now() - 10368000000,
  },
  {
    id: "seed_seller_5", name: "Surya", phone: "9123456780",
    email: "surya@agri.co", location: "Bangalore, Karnataka",
    profileImage: "", joinedAt: Date.now() - 12960000000,
  }
];

// ── Seed versioning — bump this whenever SEED_LISTINGS / SEED_SELLERS change ─
const SEED_VERSION = "v2";
const SEED_VERSION_KEY = "marketplace_seed_version";

// ── CRUD helpers ───────────────────────────────────────────────────────────
function ensureSeeded() {
  const storedVersion = S.get(SEED_VERSION_KEY);

  if (storedVersion !== SEED_VERSION) {
    // Merge: keep any user-created listings (id starts with "listing_"), replace all seed_ entries
    const existing = S.get(LISTINGS_KEY) || [];
    const userListings = existing.filter(l => !l.id.startsWith("seed_"));
    S.set(LISTINGS_KEY, [...SEED_LISTINGS, ...userListings]);

    // Merge sellers: keep user-created sellers, replace seed_ entries
    const existingSellers = S.get(SELLERS_KEY) || [];
    const userSellers = existingSellers.filter(s => !s.id.startsWith("seed_"));
    S.set(SELLERS_KEY, [...SEED_SELLERS, ...userSellers]);

    S.set(SEED_VERSION_KEY, SEED_VERSION);
    return;
  }

  if (!S.get(LISTINGS_KEY)) S.set(LISTINGS_KEY, SEED_LISTINGS);
  if (!S.get(SELLERS_KEY)) S.set(SELLERS_KEY, SEED_SELLERS);
}

export function getListings() {
  ensureSeeded();
  return S.get(LISTINGS_KEY) || [];
}

export function getListing(id) {
  return getListings().find(l => l.id === id) || null;
}

export function addListing(listing) {
  const all = getListings();
  const newListing = { ...listing, id: "listing_" + Date.now(), createdAt: Date.now() };
  all.unshift(newListing);
  S.set(LISTINGS_KEY, all);
  return newListing;
}

export function updateListing(id, updates) {
  const all = getListings().map(l => l.id === id ? { ...l, ...updates } : l);
  S.set(LISTINGS_KEY, all);
}

export function deleteListing(id) {
  S.set(LISTINGS_KEY, getListings().filter(l => l.id !== id));
}

export function getSellerListings(sellerId) {
  return getListings().filter(l => l.sellerId === sellerId);
}

// ── Sellers ────────────────────────────────────────────────────────────────
export function getSellers() {
  ensureSeeded();
  return S.get(SELLERS_KEY) || [];
}

export function getSeller(id) {
  return getSellers().find(s => s.id === id) || null;
}

export function registerSeller(seller) {
  const all = getSellers();
  const newSeller = { ...seller, id: "seller_" + Date.now(), joinedAt: Date.now() };
  all.push(newSeller);
  S.set(SELLERS_KEY, all);
  return newSeller;
}

export function updateSeller(id, updates) {
  const all = getSellers().map(s => s.id === id ? { ...s, ...updates } : s);
  S.set(SELLERS_KEY, all);
}

export function getSellerByUserId(userId) {
  return getSellers().find(s => s.userId === userId) || null;
}

// ── Favorites ──────────────────────────────────────────────────────────────
export function getFavorites() {
  return S.get(FAVORITES_KEY) || [];
}

export function toggleFavorite(listingId) {
  const favs = getFavorites();
  const idx = favs.indexOf(listingId);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(listingId);
  S.set(FAVORITES_KEY, favs);
  return favs;
}

export function isFavorite(listingId) {
  return getFavorites().includes(listingId);
}

// ── Categories & Crops ─────────────────────────────────────────────────────
export const CROP_CATEGORIES = [
  "All", "Vegetables", "Fruits", "Grains", "Pulses", "Spices", "Oilseeds", "Flowers", "Others"
];

export const CROP_NAMES = [
  "Tomato", "Onion", "Potato", "Carrot", "Brinjal", "Cabbage", "Cauliflower",
  "Chilli", "Cucumber", "Drumstick", "Ladies Finger", "Beans",
  "Banana", "Mango", "Coconut", "Papaya", "Guava", "Pomegranate",
  "Rice (Paddy)", "Wheat", "Maize", "Millets", "Sorghum",
  "Groundnut", "Sesame", "Mustard", "Sunflower",
  "Black Gram", "Green Gram", "Red Gram", "Bengal Gram",
  "Turmeric", "Ginger", "Coriander", "Cumin",
  "Jasmine", "Marigold", "Rose",
  "Sugarcane", "Cotton", "Other"
];

export const CROP_ICONS = {
  Tomato: "🍅", Onion: "🧅", Potato: "🥔", Carrot: "🥕", Brinjal: "🍆",
  Cabbage: "🥬", Cauliflower: "🥦", Chilli: "🌶️", Cucumber: "🥒",
  Banana: "🍌", Mango: "🥭", Coconut: "🥥", Papaya: "🍈", Guava: "🍏",
  Pomegranate: "🍎", "Rice (Paddy)": "🌾", Wheat: "🌾", Maize: "🌽", Millets: "🌾", Sugarcane: "🎋",
  "Red Gram": "🫘", Cotton: "☁️", Groundnut: "🥜", Turmeric: "🟡", Ginger: "🫚",
  Jasmine: "🌸", Marigold: "🌻", Rose: "🌹",
  default: "🌱",
};

export function getCropIcon(name) {
  return CROP_ICONS[name] || CROP_ICONS.default;
}

export const LOCATIONS = [
  "All Locations", "Dindigul", "Coimbatore", "Madurai", "Trichy", "Thanjavur",
  "Salem", "Erode", "Tirunelveli", "Nilgiris", "Pollachi", "Nashik", "Pune",
];