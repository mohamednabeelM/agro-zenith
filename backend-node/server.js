const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Models
const Farmer = require("./models/Farmer");
const CropListing = require("./models/CropListing");

// Middleware
const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "agro_zenith_secret_key_123";

// ── MIDDLEWARES ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Support base64 image uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer Storage Configuration for Image Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Create uploads directory if not exists
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/agrozenith")
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// ── REST API ROUTES ────────────────────────────────────────────────────────

// 1. Seller Authentication & Registration
app.post("/api/sellers/register", async (req, res) => {
  const { name, phone, email, location, password } = req.body;

  try {
    let farmer = await Farmer.findOne({ phone });
    if (farmer) {
      return res.status(400).json({ msg: "Farmer with this phone number already registered" });
    }

    farmer = new Farmer({ name, phone, email, location, password });
    await farmer.save();

    // Create JWT Token
    const payload = { farmer: { id: farmer.id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        token,
        seller: { id: farmer.id, name: farmer.name, phone: farmer.phone, location: farmer.location },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Seller Login
app.post("/api/sellers/login", async (req, res) => {
  const { phone, password } = req.body;

  try {
    const farmer = await Farmer.findOne({ phone });
    if (!farmer) {
      return res.status(400).json({ msg: "Invalid phone number or password" });
    }

    const isMatch = await farmer.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid phone number or password" });
    }

    // Create JWT Token
    const payload = { farmer: { id: farmer.id } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        seller: { id: farmer.id, name: farmer.name, phone: farmer.phone, location: farmer.location },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Get Current Seller Profile (Authenticated)
app.get("/api/sellers/profile", auth, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmer.id).select("-password");
    res.json(farmer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Update Seller Profile
app.put("/api/sellers/profile", auth, async (req, res) => {
  const { name, phone, email, location, profileImage } = req.body;
  try {
    const farmer = await Farmer.findById(req.farmer.id);
    if (!farmer) return res.status(404).json({ msg: "Farmer profile not found" });

    if (name) farmer.name = name;
    if (phone) farmer.phone = phone;
    if (email !== undefined) farmer.email = email;
    if (location) farmer.location = location;
    if (profileImage !== undefined) farmer.profileImage = profileImage;

    await farmer.save();
    res.json(farmer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// 2. Crop Listings APIs (Public & Authenticated)

// Get All Listings with Advanced Filtering, Search & Sorting
app.get("/api/listings", async (req, res) => {
  const { search, category, location, maxPrice, onlyAvailable, sortBy } = req.query;

  try {
    let query = {};

    // Filters
    if (search) {
      query.$or = [
        { cropName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (location && location !== "All Locations") {
      query.location = { $regex: location, $options: "i" };
    }

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    if (onlyAvailable === "true") {
      query.availability = "available";
    }

    let sort = { createdAt: -1 }; // Default: Newest first
    if (sortBy === "priceAsc") sort = { price: 1 };
    if (sortBy === "priceDesc") sort = { price: -1 };

    const listings = await CropListing.find(query).populate("sellerId", "name phone location profileImage").sort(sort);
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get Single Listing Detail
app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await CropListing.findById(req.params.id).populate("sellerId", "name phone location email profileImage");
    if (!listing) return res.status(404).json({ msg: "Listing not found" });
    res.json(listing);
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") return res.status(404).json({ msg: "Listing not found" });
    res.status(500).send("Server error");
  }
});

// Create Listing (Authenticated)
app.post("/api/listings", auth, async (req, res) => {
  const { cropName, cropImage, quantity, unit, price, description, harvestDate, location } = req.body;

  try {
    const newListing = new CropListing({
      cropName,
      cropImage,
      quantity,
      unit,
      price,
      description,
      harvestDate,
      location,
      sellerId: req.farmer.id,
    });

    const listing = await newListing.save();
    res.status(201).json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Update Listing (Authenticated & Authorized)
app.put("/api/listings/:id", auth, async (req, res) => {
  const { cropName, cropImage, quantity, unit, price, description, harvestDate, location, availability } = req.body;

  try {
    let listing = await CropListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: "Listing not found" });

    // Check ownership
    if (listing.sellerId.toString() !== req.farmer.id) {
      return res.status(401).json({ msg: "Unauthorized action" });
    }

    if (cropName) listing.cropName = cropName;
    if (cropImage !== undefined) listing.cropImage = cropImage;
    if (quantity !== undefined) listing.quantity = quantity;
    if (unit) listing.unit = unit;
    if (price !== undefined) listing.price = price;
    if (description !== undefined) listing.description = description;
    if (harvestDate !== undefined) listing.harvestDate = harvestDate;
    if (location) listing.location = location;
    if (availability) listing.availability = availability;

    await listing.save();
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete Listing (Authenticated & Authorized)
app.delete("/api/listings/:id", auth, async (req, res) => {
  try {
    const listing = await CropListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: "Listing not found" });

    // Check ownership
    if (listing.sellerId.toString() !== req.farmer.id) {
      return res.status(401).json({ msg: "Unauthorized action" });
    }

    await CropListing.findByIdAndDelete(req.params.id);
    res.json({ msg: "Listing deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Image Upload Endpoint via Multer (returns URL)
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: "No image file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong! Please try again later." });
});

// Start server
app.listen(PORT, () => {
  console.log(`Express Backend running on port ${PORT}`);
});
