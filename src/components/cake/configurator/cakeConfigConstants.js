/**
 * Cake Configurator Constants and Configuration
 * Contains all options, pricing, and configuration data for the 3D cake customizer
 */

// Tier options with pricing multipliers
export const TIER_OPTIONS = {
  "1 Tier": { count: 1, priceMultiplier: 1, label: "Single Tier" },
  "2 Tiers": { count: 2, priceMultiplier: 1.8, label: "Double Tier" },
  "3 Tiers": { count: 3, priceMultiplier: 2.5, label: "Triple Tier" },
};

// Cake sizes with pricing and servings
export const SIZE_OPTIONS = {
  "1 kg": {
    scale: 1,
    price: 1200,
    serves: "4-6",
    label: "1 kg (4-6 servings)",
    weight: 1,
  },
  "1.5 kg": {
    scale: 1.2,
    price: 1700,
    serves: "8-10",
    label: "1.5 kg (8-10 servings)",
    weight: 1.5,
  },
  "2 kg": {
    scale: 1.4,
    price: 2200,
    serves: "12-15",
    label: "2 kg (12-15 servings)",
    weight: 2,
  },
  "3 kg": {
    scale: 1.6,
    price: 3200,
    serves: "20-25",
    label: "3 kg (20-25 servings)",
    weight: 3,
  },
};

// Flavor options with colors for 3D rendering
export const FLAVOR_OPTIONS = {
  Vanilla: {
    color: "#F5F5DC",
    roughness: 0.4,
    nameNepali: "भ्यानिला",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=400",
  },
  Chocolate: {
    color: "#3E2723",
    roughness: 0.6,
    nameNepali: "चकलेट",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400",
  },
  "Black Forest": {
    color: "#2D1B14",
    roughness: 0.5,
    nameNepali: "ब्ल्याक फरेस्ट",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=400",
  },
  "Red Velvet": {
    color: "#8B0000",
    roughness: 0.45,
    nameNepali: "रेड भेल्भेट",
    image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&q=80&w=400",
  },
  Butterscotch: {
    color: "#E09540",
    roughness: 0.4,
    nameNepali: "बटरस्कच",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=400",
  },
  Pineapple: {
    color: "#FFE135",
    roughness: 0.4,
    nameNepali: "पाइनएप्पल",
    image: "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?auto=format&fit=crop&q=80&w=400",
  },
  Mango: {
    color: "#FF8243",
    roughness: 0.45,
    nameNepali: "आँप",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400",
  },
  Strawberry: {
    color: "#FFB7B2",
    roughness: 0.45,
    nameNepali: "स्ट्रबेरी",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400",
  },
};

// Frosting color options
export const COLOR_OPTIONS = {
  "Classic White": "#FFFFFF",
  "Pastel Pink": "#FFD1DC",
  "Baby Blue": "#AEC6CF",
  "Mint Green": "#77DD77",
  "Cream": "#FFFDD0",
  "Lavender": "#E6E6FA",
  "Peach": "#FFDAB9",
  "Golden": "#FFD700",
};

// Topping options with pricing
export const TOPPER_OPTIONS = {
  None: {
    items: [],
    price: 0,
    label: "No Topper",
    description: "Simple and elegant"
  },
  "Fresh Fruits": {
    price: 200,
    label: "Fresh Seasonal Fruits",
    description: "Assorted fresh fruits",
    items: Array.from({ length: 12 }).map(() => ({
      pos: [Math.random() * 1.2 - 0.6, 0, Math.random() * 1.2 - 0.6],
      scale: 0.2 + Math.random() * 0.1,
      type: "fruit",
    })),
  },
  "Chocolate Shavings": {
    price: 150,
    label: "Chocolate Shavings",
    description: "Premium chocolate curls",
    items: Array.from({ length: 15 }).map(() => ({
      pos: [Math.random() * 1.4 - 0.7, 0, Math.random() * 1.4 - 0.7],
      scale: 0.15 + Math.random() * 0.1,
      type: "chocolate",
    })),
  },
  Candles: {
    price: 50,
    label: "Birthday Candles",
    description: "Celebration candles",
    items: [{ pos: [0, 0, 0], scale: 1, type: "candle" }],
  },
  "Edible Flowers": {
    price: 300,
    label: "Edible Flowers",
    description: "Beautiful floral decoration",
    items: Array.from({ length: 6 }).map((_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      return {
        pos: [Math.cos(angle) * 0.7, 0, Math.sin(angle) * 0.7],
        scale: 0.3,
        type: "flower",
      };
    }),
  },
  Macarons: {
    price: 400,
    label: "French Macarons",
    description: "Gourmet macarons",
    items: Array.from({ length: 6 }).map((_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      return {
        pos: [Math.cos(angle) * 0.8, 0, Math.sin(angle) * 0.8],
        scale: 0.4,
        type: "macaron",
      };
    }),
  },
};

// Configuration steps
export const CONFIG_STEPS = [
  {
    id: "tiers",
    label: "Tiers",
    icon: "Layers",
    description: "Choose tier count"
  },
  {
    id: "size",
    label: "Size",
    icon: "Ruler",
    description: "Select cake weight"
  },
  {
    id: "flavor",
    label: "Flavor",
    icon: "Cake",
    description: "Pick your favorite"
  },
  {
    id: "color",
    label: "Color",
    icon: "Palette",
    description: "Choose frosting color"
  },
  {
    id: "topper",
    label: "Topper",
    icon: "Sparkles",
    description: "Add decorations"
  },
  {
    id: "message",
    label: "Message",
    icon: "MessageSquare",
    description: "Personal message"
  },
];

// Effects options
export const EFFECT_OPTIONS = {
  drip: {
    enabled: false,
    type: "chocolate", // "chocolate", "caramel", "white-chocolate", "strawberry", "matcha"
    intensity: "medium", // "light", "medium", "heavy"
  },
  ribbon: {
    enabled: false,
    color: "#E74C3C",
    pattern: "satin", // "solid", "satin", "lace"
  },
  metallic: {
    enabled: false,
    type: "gold", // "gold", "silver", "rose-gold", "copper", "glitter"
  },
  ombre: {
    enabled: false,
    topColor: "#FFB7C5",
    bottomColor: "#C21E56",
  },
};

// Default configuration
export const DEFAULT_CONFIG = {
  tiers: "1 Tier",
  size: "1.5 kg",
  flavor: "Chocolate",
  color: "Classic White",
  topper: "None",
  message: "",
  effects: {
    drip: false,
    dripType: "chocolate",
    dripIntensity: "medium",
    ribbon: false,
    ribbonColor: "#E74C3C",
    ribbonPattern: "satin",
    metallic: false,
    metallicType: "gold",
    ombre: false,
    ombreTop: "#FFB7C5",
    ombreBottom: "#C21E56",
  },
  background: "studio",
  cameraPreset: "default",
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

// Helper function to calculate total price
export const calculateTotalPrice = (size, topper, tiers) => {
  const basePrice = SIZE_OPTIONS[size]?.price || 0;
  const topperPrice = TOPPER_OPTIONS[topper]?.price || 0;
  const tierMultiplier = TIER_OPTIONS[tiers]?.priceMultiplier || 1;
  return Math.round(basePrice * tierMultiplier + topperPrice);
};

// Helper function to format NPR currency
export const formatNPR = (amount) => {
  return `Rs. ${amount.toLocaleString("en-NP")}`;
};
