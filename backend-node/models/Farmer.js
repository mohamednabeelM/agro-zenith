const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const FarmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  location: {
    type: String,
    required: [true, "Farm location / village / district is required"],
    trim: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Hash the password before saving
FarmerSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
FarmerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Farmer", FarmerSchema);
