# Farmer Marketplace Setup & Integration Guide

Welcome to the **Farmer Marketplace** module for Agro-Zenith! This module allows farmers to register as sellers, post crop listings (quantity, price, location, photos), and connect directly with wholesale buyers via automated WhatsApp deep-links.

We have structured this modularly so it works instantly with both local mock database (localStorage for easy preview) and is ready for database connection.

---

## 📂 Marketplace Folder Structure

All created/modified files are listed below:

```bash
agro-zenith/
├── backend-node/                 # Production-Ready Express & MongoDB Backend
│   ├── middleware/
│   │   └── auth.js               # JWT Auth Middleware
│   ├── models/
│   │   ├── Farmer.js             # Farmer Schema (name, phone, hashed password, location)
│   │   └── CropListing.js        # Crop Listing Schema (name, price, quantity, location)
│   ├── package.json              # Backend Dependencies (Express, Mongoose, JWT, Bcrypt)
│   └── server.js                 # API Endpoints (Auth, CRUD, Image Uploads, Filters)
│
├── src/
│   ├── pages/
│   │   ├── Marketplace.jsx       # Main Marketplace Page Component
│   │   └── marketplace/
│   │       ├── CropCard.jsx      # Individual Crop Card Component
│   │       ├── ContactModal.jsx  # Call/WhatsApp Deep-Link Handler
│   │       ├── ListingDetail.jsx # Pop-up Detailed View Modal
│   │       ├── SellerDashboard.jsx# Seller CRUD & Status Dashboard
│   │       ├── SellerRegistration.jsx# Seller Onboarding Form
│   │       ├── AddListingForm.jsx# Crop Listing Creator & Editor
│   │       └── MarketplaceToast.jsx# Glassmorphism Micro-Notifications
│   │
│   ├── utils/
│   │   └── marketplaceData.js    # LocalStorage CRUD & Seed Data (Fallback)
│   └── constants/
│       └── translates.js         # Multilingual support (EN / TA / HI)
```

---

## ⚡ Setup & Launch Instructions

### 1. Run the Frontend (React / Vite)

To run the frontend app:
```bash
# Go to workspace directory
cd agro-zenith

# Install any missing package dependencies
npm install

# Start the Vite development server
npm run dev
```

The application will run locally, and you will see the new **🌾 Marketplace** tab in the Sidebar, as well as the **🌾 Marketplace** card under **Quick Actions** on the main Dashboard page.

### 2. Run the Node.js + Express Backend

To configure the MongoDB and JWT REST API backend:

```bash
# Navigate to backend-node
cd backend-node

# Install dependencies (express, mongoose, bcryptjs, jsonwebtoken, multer, cors, dotenv)
npm install

# (Optional) Install nodemon for live reload
npm install -g nodemon
```

#### Environment Configuration
Create a `.env` file inside `backend-node/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agrozenith
JWT_SECRET=your_ultra_secure_jwt_secret_key
```

#### Start Backend:
```bash
# Run backend in dev mode with nodemon
npm run dev

# Or run in production
npm start
```
The server will boot up on `http://localhost:5000` and output:
`Connected to MongoDB successfully!`

---

## 🚀 Key Features Built

1. **Farmer Onboarding**: Custom onboarding form pre-filling user's name & district, allowing custom profile images and password creation.
2. **Crop Listings Form**: Upload crop photos, specify quantities (kg/ton/quintal), price/kg, harvest date, location, and description.
3. **Advanced Filter Sidebar**: Dynamic search by crop name, category select, location filter, real-time price slider, availability badge, and favorites toggle.
4. **WhatsApp Communication**: Automatically generates standard deep-link to instantly message the seller with listing details: `https://wa.me/91XXXXXXXXXX?text=Hi...`
5. **Farmer Dashboard**: View total listings, track sales stats, mark crops as Sold Out, edit quantity/price, delete items, and manage profile photos.
6. **Local Storage Seeding**: If the backend is off, the app automatically loads pre-seeded high-quality dummy crops (Tomato, Onion, Rice, Carrots) so you can test features instantly.
7. **Premium Styling**: Glassmorphic dark/light mode toggle, custom green/earth gradients, loading skeletons, slide-in toasts, and smooth hover translations.
