/**
 * Cake Configurator Constants and Configuration
 * Contains all options, pricing, and configuration data for the 3D cake customizer
 */

// Cake shapes. `inner` is the usable top-surface radius as a fraction of the
// tier radius (a heart has far less flat area than a round cake).
export const SHAPE_OPTIONS = {
  Round: { price: 0, inner: 1, centerZ: 0, description: "Classic round" },
  Heart: { price: 150, inner: 0.6, centerZ: -0.08, description: "For someone special" },
  Square: { price: 0, inner: 0.95, centerZ: 0, description: "Modern and sharp" },
};

// Tier options with pricing multipliers
export const TIER_OPTIONS = {
  "1 Tier": { count: 1, priceMultiplier: 1, label: "Single Tier" },
  "2 Tiers": { count: 2, priceMultiplier: 1.8, label: "Double Tier" },
  "3 Tiers": { count: 3, priceMultiplier: 2.5, label: "Triple Tier" },
};

// Cake sizes with pricing and servings. `scale` nudges the 3D model so a
// heavier cake reads bigger without breaking the camera framing.
export const SIZE_OPTIONS = {
  "1 kg": { scale: 0.92, price: 1200, serves: "4-6", label: "1 kg", weight: 1 },
  "1.5 kg": { scale: 1, price: 1700, serves: "8-10", label: "1.5 kg", weight: 1.5 },
  "2 kg": { scale: 1.07, price: 2200, serves: "12-15", label: "2 kg", weight: 2 },
  "3 kg": { scale: 1.16, price: 3200, serves: "20-25", label: "3 kg", weight: 3 },
};

// Flavor options with colors for 3D rendering
export const FLAVOR_OPTIONS = {
  Vanilla: {
    color: "#F3E9C6",
    roughness: 0.4,
    nameNepali: "भ्यानिला",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=400",
  },
  Chocolate: {
    color: "#4A2E24",
    roughness: 0.6,
    nameNepali: "चकलेट",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400",
  },
  "Black Forest": {
    color: "#33201A",
    roughness: 0.5,
    nameNepali: "ब्ल्याक फरेस्ट",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=400",
  },
  "Red Velvet": {
    color: "#9B1B30",
    roughness: 0.45,
    nameNepali: "रेड भेल्भेट",
    image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&q=80&w=400",
  },
  Butterscotch: {
    color: "#E0A050",
    roughness: 0.4,
    nameNepali: "बटरस्कच",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=400",
  },
  Pineapple: {
    color: "#F6DD5A",
    roughness: 0.4,
    nameNepali: "पाइनएप्पल",
    image: "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?auto=format&fit=crop&q=80&w=400",
  },
  Mango: {
    color: "#FF9A4D",
    roughness: 0.45,
    nameNepali: "आँप",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400",
  },
  Strawberry: {
    color: "#F7B8B5",
    roughness: 0.45,
    nameNepali: "स्ट्रबेरी",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400",
  },
};

// Fillings between the sponge layers (visible in the "peek inside" slice)
export const FILLING_OPTIONS = {
  "Vanilla Cream": { color: "#FFF4D6", price: 0, description: "Light whipped cream" },
  "Chocolate Ganache": { color: "#3B241C", price: 150, description: "Dark and glossy" },
  "Strawberry Jam": { color: "#C9184A", price: 120, description: "Fruity and bright" },
  "Salted Caramel": { color: "#C68642", price: 150, description: "Buttery and rich" },
  "Mango Cream": { color: "#FFB347", price: 150, description: "Sunny and smooth" },
  "Cream Cheese": { color: "#FFF9EE", price: 120, description: "Tangy and soft" },
};

// Frosting color options
export const COLOR_OPTIONS = {
  "Classic White": "#FFFFFF",
  "Pastel Pink": "#FFD1DC",
  "Baby Blue": "#AEC6CF",
  "Mint Green": "#77DD77",
  Cream: "#FFFDD0",
  Lavender: "#E6E6FA",
  Peach: "#FFDAB9",
  Golden: "#FFD700",
};

// Topper options. `kind` tells the 3D layout planner how to place them:
// ring = evenly around the edge, band = scattered near the edge, candles = arc/cluster
export const TOPPER_OPTIONS = {
  None: { price: 0, kind: "none", label: "No Topper", description: "Simple and elegant" },
  "Fresh Fruits": { price: 200, kind: "band", label: "Fresh Seasonal Fruits", description: "Strawberries around the edge" },
  "Chocolate Shavings": { price: 150, kind: "band", label: "Chocolate Shavings", description: "Premium chocolate curls" },
  Candles: { price: 50, kind: "candles", label: "Birthday Candles", description: "Five celebration candles" },
  "Edible Flowers": { price: 300, kind: "ring", label: "Edible Flowers", description: "A floral ring" },
  Macarons: { price: 400, kind: "ring", label: "French Macarons", description: "Gourmet macaron ring" },
};

// Drip finish options (rendered as glossy ganache cascading down each tier)
export const DRIP_OPTIONS = {
  None: { color: null, price: 0, description: "Clean frosting" },
  "Dark Chocolate": { color: "#3E2723", price: 250, description: "Rich ganache drip" },
  Caramel: { color: "#C68642", price: 250, description: "Golden salted caramel" },
  "White Chocolate": { color: "#FFF8DC", price: 300, description: "Silky white ganache" },
  Strawberry: { color: "#C21E56", price: 250, description: "Berry glaze drip" },
  Matcha: { color: "#77DD77", price: 300, description: "Green tea ganache" },
};

// Finishing touches (instanced scatter decorations)
export const FINISH_OPTIONS = {
  None: { price: 0, swatch: null, description: "Keep it clean" },
  "Rainbow Sprinkles": { price: 100, swatch: "linear-gradient(135deg,#FF5C8A,#FFB800,#3FB6FF,#7ED957)", description: "Playful confetti scatter" },
  "Gold Leaf": { price: 350, swatch: "linear-gradient(135deg,#FFF1B8,#E8B923 55%,#B8860B)", description: "Hand-torn edible gold" },
  "Edible Pearls": { price: 250, swatch: "radial-gradient(circle at 35% 35%,#fff,#E9E4DC 60%,#CFC7BB)", description: "Pearl border on every tier" },
};

// Flat extras
export const EXTRA_PRICES = {
  eggless: 100,
  photo: 400,
  candleNumber: 80,
};

// Configuration steps
export const CONFIG_STEPS = [
  { id: "base", label: "Shape & Size", short: "Shape", icon: "Layers", description: "Shape, tiers and weight" },
  { id: "flavor", label: "Flavor", short: "Flavor", icon: "Cake", description: "Sponge, filling and dietary needs" },
  { id: "frosting", label: "Frosting", short: "Frosting", icon: "Palette", description: "Colour and drip finish" },
  { id: "decorate", label: "Decorate", short: "Decorate", icon: "Sparkles", description: "Toppers and finishing touches" },
  { id: "personalize", label: "Personalize", short: "Message", icon: "MessageSquare", description: "Message, photo and candles" },
];

// Default configuration
export const DEFAULT_CONFIG = {
  shape: "Round",
  tiers: "1 Tier",
  size: "1.5 kg",
  flavor: "Chocolate",
  filling: "Vanilla Cream",
  eggless: false,
  color: "Classic White",
  drip: "None",
  topper: "None",
  finish: "None",
  candleNumber: "",
  message: "",
  photo: null,
};

// Message suggestions
export const MESSAGE_SUGGESTIONS = [
  "Happy Birthday!",
  "Congratulations!",
  "Best Wishes!",
  "Happy Anniversary!",
  "Celebrate!",
  "With Love",
];

// Message length limit (fits the top surface at a readable size)
export const MESSAGE_MAX_LENGTH = 24;

/**
 * Itemised price lines for a configuration.
 */
export const buildPriceLines = (config) => {
  const lines = [];
  const base = SIZE_OPTIONS[config.size]?.price || 0;
  const mult = TIER_OPTIONS[config.tiers]?.priceMultiplier || 1;
  lines.push({ key: "base", label: `${config.size} ${config.flavor} cake`, amount: base });
  if (mult !== 1) {
    lines.push({ key: "tiers", label: `${config.tiers} (×${mult})`, amount: Math.round(base * (mult - 1)) });
  }
  const add = (key, label, amount) => {
    if (amount > 0) lines.push({ key, label, amount });
  };
  add("shape", `${config.shape} shape`, SHAPE_OPTIONS[config.shape]?.price || 0);
  add("filling", `${config.filling} filling`, FILLING_OPTIONS[config.filling]?.price || 0);
  if (config.eggless) add("eggless", "Eggless recipe", EXTRA_PRICES.eggless);
  add("drip", `${config.drip} drip`, DRIP_OPTIONS[config.drip]?.price || 0);
  add("topper", TOPPER_OPTIONS[config.topper]?.label || config.topper, TOPPER_OPTIONS[config.topper]?.price || 0);
  add("finish", config.finish, FINISH_OPTIONS[config.finish]?.price || 0);
  if (config.candleNumber) add("candleNumber", `Number candles "${config.candleNumber}"`, EXTRA_PRICES.candleNumber);
  if (config.photo) add("photo", "Edible photo print", EXTRA_PRICES.photo);
  return lines;
};

// Helper function to calculate total price
export const calculateTotalPrice = (config) =>
  buildPriceLines(config).reduce((sum, l) => sum + l.amount, 0);

// Helper function to format NPR currency
export const formatNPR = (amount) => {
  return `Rs. ${amount.toLocaleString("en-NP")}`;
};
