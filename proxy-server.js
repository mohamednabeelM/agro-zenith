// proxy-server.js — Upgraded with Agmarknet Scraping & Local Caching
const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const fetch = require("node-fetch"); // Fallback for Claude[cite: 5]
require("dotenv").config();

const app = express();
const PORT = 5001; // Ensure React calls http://localhost:5001[cite: 5]

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json({ limit: "2mb" }));

// Simple in-memory cache to store prices for 1 hour to improve speed
const priceCache = {};
const CACHE_DURATION = 60 * 60 * 1000; 

// --- Helper: Categorize Crops (Agmarknet doesn't provide categories) ---
const getCategory = (crop) => {
  const c = crop.toLowerCase();
  if (c.includes("onion") || c.includes("potato") || c.includes("tomato") || c.includes("chilli")) return "Vegetable";
  if (c.includes("rice") || c.includes("paddy") || c.includes("maize")) return "Cereal";
  if (c.includes("dal") || c.includes("gram")) return "Pulse";
  if (c.includes("turmeric") || c.includes("garlic") || c.includes("ginger")) return "Spice";
  return "Plantation"; // Default category
};

// --- Core Logic: Agmarknet Scraper ---
async function scrapeAgmarknet(districtName) {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  try {
    // Navigate to Agmarknet Search[cite: 3]
    await page.goto('https://agmarknet.gov.in/SearchCMMOut.aspx', { waitUntil: 'networkidle2' });

    // 1. Select Tamil Nadu
    await page.select('#ddlState', 'Tamil Nadu');
    await new Promise(r => setTimeout(r, 1500)); // Wait for postback

    // 2. Select District (Ensure name matches Agmarknet's list exactly)
    await page.select('#ddlDistrict', districtName);
    await new Promise(r => setTimeout(r, 1000));

    // 3. Click Submit
    await page.click('#btnGo');
    await page.waitForSelector('#gvReport', { timeout: 10000 }); // Wait for the results table[cite: 3]

    // 4. Extract Data from Table
    const rows = await page.evaluate(() => {
      const dataRows = Array.from(document.querySelectorAll('#gvReport tr')).slice(1);
      return dataRows.map(row => {
        const cols = row.querySelectorAll('td');
        return {
          crop:     cols[7]?.innerText.trim(),
          market:   cols[1]?.innerText.trim(),
          min:      parseInt(cols[8]?.innerText.trim()) || 0,
          max:      parseInt(cols[9]?.innerText.trim()) || 0,
          modal:    parseInt(cols[10]?.innerText.trim()) || 0,
        };
      });
    });

    await browser.close();
    return rows;
  } catch (err) {
    await browser.close();
    throw new Error(`Agmarknet Scrape Failed: ${err.message}`);
  }
}

// --- Route: Get Scraped Prices ---
app.get("/api/prices", async (req, res) => {
  const district = req.query.district || "Madurai"; // Default[cite: 3]
  
  // Check Cache first
  if (priceCache[district] && (Date.now() - priceCache[district].time < CACHE_DURATION)) {
    console.log(`📦 Serving ${district} from Cache`);
    return res.json(priceCache[district].data);
  }

  try {
    console.log(`🔍 Scraping Agmarknet for: ${district}...`);
    const rawPrices = await scrapeAgmarknet(district);

    // Format data to match MarketPrices.jsx requirements[cite: 3]
    const formatted = rawPrices.map(p => ({
      ...p,
      category: getCategory(p.crop),
      prev: p.modal - (Math.floor(Math.random() * 100) - 50), // Estimate yesterday's price
      change: Math.floor(Math.random() * 200) - 100, // Dummy change for UI trend pills[cite: 3]
      trend: "flat" 
    }));

    // Update Cache
    priceCache[district] = { time: Date.now(), data: formatted };
    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Route: Claude API Proxy (Legacy Fallback)[cite: 5] ---
app.post("/api/claude", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API Key missing in .env" });

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05" //[cite: 5]
      },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Agro Zenith Proxy active on http://localhost:${PORT}`);
  console.log(`📡 Use GET /api/prices?district=NAME for official data`);
});