const mongoose = require("mongoose");

const CropListingSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: [true, "Crop name is required"],
    trim: true,
  },
  cropImage: {
    type: String,
    default: "",
  },
  quantity: {
    type: Number,
    required: [true, "Quantity available is required"],
    min: [0, "Quantity cannot be negative"],
  },
  unit: {
    type: String,
    enum: ["kg", "ton", "quintal"],
    default: "kg",
  },
  price: {
    type: Number,
    required: [true, "Price per kg is required"],
    min: [0, "Price cannot be negative"],
  },
  description: {
    type: String,
    trim: true,
  },
  harvestDate: {
    type: String, // Stored as ISO string or YYYY-MM-DD
  },
  location: {
    type: String,
    required: [true, "Crop location is required"],
    trim: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer",
    required: [true, "Seller reference is required"],
  },
  availability: {
    type: String,
    enum: ["available", "sold"],
    default: "available",
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("CropListing", CropListingSchema);
