/**
 * Example Usage - Cake Configurator Integration
 *
 * This file demonstrates different ways to integrate the CakeConfigurator
 * into your existing SweetNest application.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CakeConfigurator, DEFAULT_CONFIG } from "./index";

// ============================================================
// Example 1: Modal-style Integration
// ============================================================

export function ModalConfiguratorExample() {
  const [showConfigurator, setShowConfigurator] = useState(false);

  return (
    <div className="p-6">
      <button
        onClick={() => setShowConfigurator(true)}
        className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
      >
        Customize Your Cake
      </button>

      {showConfigurator && (
        <CakeConfigurator
          onClose={() => setShowConfigurator(false)}
        />
      )}
    </div>
  );
}

// ============================================================
// Example 2: Full Page Integration with Routing
// ============================================================

export function PageConfiguratorExample() {
  const navigate = useNavigate();

  return (
    <CakeConfigurator
      onClose={() => navigate(-1)} // Go back to previous page
    />
  );
}

// Usage in your router:
// <Route path="/customize-cake" element={<PageConfiguratorExample />} />

// ============================================================
// Example 3: Product Detail Page Integration
// ============================================================

export function ProductDetailWithCustomize() {
  const [showConfigurator, setShowConfigurator] = useState(false);
  const navigate = useNavigate();

  // Sample product data
  const product = {
    name: "Chocolate Delight Cake",
    basePrice: 1700,
    image: "https://example.com/cake.jpg",
  };

  const handleCustomize = () => {
    setShowConfigurator(true);
  };

  if (showConfigurator) {
    return (
      <CakeConfigurator
        onClose={() => setShowConfigurator(false)}
        initialConfig={{
          ...DEFAULT_CONFIG,
          flavor: "Chocolate", // Pre-select based on product
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="rounded-2xl overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full" />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-medium text-dark mb-4">
            {product.name}
          </h1>
          <p className="text-2xl text-accent mb-6">रू {product.basePrice}</p>

          <div className="space-y-3">
            <button
              onClick={() => {/* Regular add to cart */}}
              className="w-full bg-dark text-white py-3 rounded-lg font-medium hover:bg-dark/90 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleCustomize}
              className="w-full border border-accent text-accent py-3 rounded-lg font-medium hover:bg-accent/5 transition-colors"
            >
              Customize This Design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Example 4: Homepage Quick Access
// ============================================================

export function HomepageCustomizeSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-cream py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-medium text-dark mb-4">
          Design Your Dream Cake
        </h2>
        <p className="text-lg text-dark/70 mb-8">
          Create a custom cake in 3D with our interactive designer
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-medium text-dark mb-2">Choose Your Style</h3>
            <p className="text-sm text-dark/60">
              Pick flavors, colors, and decorations
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl">
            <div className="text-4xl mb-3">👁️</div>
            <h3 className="font-medium text-dark mb-2">See It in 3D</h3>
            <p className="text-sm text-dark/60">
              Preview your cake from every angle
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-medium text-dark mb-2">Order & Deliver</h3>
            <p className="text-sm text-dark/60">
              Next-day delivery in Kathmandu Valley
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/customize-cake")}
          className="bg-accent text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-accent/90 transition-colors shadow-lg hover:shadow-xl"
        >
          Start Designing
        </button>
      </div>
    </section>
  );
}

// ============================================================
// Example 5: Category Page Integration
// ============================================================

export function CategoryPageWithCustomOption() {
  const [showConfigurator, setShowConfigurator] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 bg-gradient-to-r from-accent/10 to-cream p-6 rounded-2xl border border-accent/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-dark mb-2">
              Can't find what you're looking for?
            </h2>
            <p className="text-dark/70">
              Design your own custom cake with our 3D designer
            </p>
          </div>
          <button
            onClick={() => setShowConfigurator(true)}
            className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors whitespace-nowrap"
          >
            Custom Design
          </button>
        </div>
      </div>

      {showConfigurator && (
        <CakeConfigurator onClose={() => setShowConfigurator(false)} />
      )}

      {/* Rest of category products */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product cards... */}
      </div>
    </div>
  );
}

// ============================================================
// Example 6: Cart Page Upsell
// ============================================================

export function CartPageWithUpsell() {
  const [showConfigurator, setShowConfigurator] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-medium text-dark mb-6">Your Cart</h1>

      {/* Cart items... */}

      {/* Upsell Section */}
      <div className="mt-8 bg-cream border border-dark/10 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🎂</div>
          <div className="flex-1">
            <h3 className="font-medium text-dark mb-2">
              Add a Custom Cake to Your Order
            </h3>
            <p className="text-sm text-dark/60 mb-4">
              Design a personalized cake for your special occasion
            </p>
            <button
              onClick={() => setShowConfigurator(true)}
              className="bg-accent text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Design Now
            </button>
          </div>
        </div>
      </div>

      {showConfigurator && (
        <CakeConfigurator onClose={() => setShowConfigurator(false)} />
      )}
    </div>
  );
}

// ============================================================
// Example 7: With Pre-configured Options
// ============================================================

export function PreConfiguredExample() {
  const [showConfigurator, setShowConfigurator] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: "birthday",
      name: "Birthday Special",
      config: {
        ...DEFAULT_CONFIG,
        tiers: "2 Tiers",
        flavor: "Vanilla",
        color: "Pastel Pink",
        topper: "Candles",
        message: "Happy Birthday!",
      },
    },
    {
      id: "wedding",
      name: "Wedding Elegance",
      config: {
        ...DEFAULT_CONFIG,
        tiers: "3 Tiers",
        size: "3 kg",
        flavor: "Vanilla",
        color: "Classic White",
        topper: "Edible Flowers",
      },
    },
    {
      id: "anniversary",
      name: "Anniversary Delight",
      config: {
        ...DEFAULT_CONFIG,
        tiers: "2 Tiers",
        flavor: "Red Velvet",
        color: "Pastel Pink",
        topper: "Fresh Fruits",
        message: "Happy Anniversary!",
      },
    },
  ];

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setShowConfigurator(true);
  };

  if (showConfigurator && selectedTemplate) {
    return (
      <CakeConfigurator
        onClose={() => {
          setShowConfigurator(false);
          setSelectedTemplate(null);
        }}
        initialConfig={selectedTemplate.config}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-medium text-dark mb-8">
        Start with a Template
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white border border-dark/10 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-medium text-dark mb-4">
              {template.name}
            </h3>
            <ul className="text-sm text-dark/60 space-y-2 mb-6">
              <li>• {template.config.tiers}</li>
              <li>• {template.config.size}</li>
              <li>• {template.config.flavor} Flavor</li>
              <li>• {template.config.color}</li>
            </ul>
            <button
              onClick={() => handleSelectTemplate(template)}
              className="w-full bg-accent text-white py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Customize This
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Example 8: Admin/Dashboard Integration
// ============================================================

export function AdminCustomCakePreview() {
  const [showConfigurator, setShowConfigurator] = useState(false);
  const [orderConfig, setOrderConfig] = useState(null);

  // Sample order data
  const customOrder = {
    orderId: "ORD-12345",
    customerName: "Ramesh Kumar",
    configuration: {
      tiers: "2 Tiers",
      size: "2 kg",
      flavor: "Chocolate",
      color: "Golden",
      topper: "Fresh Fruits",
      message: "Happy Birthday Mom!",
    },
  };

  const handleViewDesign = () => {
    setOrderConfig(customOrder.configuration);
    setShowConfigurator(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white border border-dark/10 rounded-xl p-6">
        <h3 className="text-xl font-medium text-dark mb-4">
          Custom Cake Order - {customOrder.orderId}
        </h3>
        <p className="text-dark/70 mb-4">Customer: {customOrder.customerName}</p>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div>
            <span className="text-dark/60">Tiers:</span>{" "}
            <span className="font-medium">{customOrder.configuration.tiers}</span>
          </div>
          <div>
            <span className="text-dark/60">Size:</span>{" "}
            <span className="font-medium">{customOrder.configuration.size}</span>
          </div>
          <div>
            <span className="text-dark/60">Flavor:</span>{" "}
            <span className="font-medium">{customOrder.configuration.flavor}</span>
          </div>
          <div>
            <span className="text-dark/60">Color:</span>{" "}
            <span className="font-medium">{customOrder.configuration.color}</span>
          </div>
        </div>

        <button
          onClick={handleViewDesign}
          className="bg-accent text-white px-5 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors"
        >
          View 3D Preview
        </button>
      </div>

      {showConfigurator && orderConfig && (
        <CakeConfigurator
          onClose={() => {
            setShowConfigurator(false);
            setOrderConfig(null);
          }}
          initialConfig={orderConfig}
        />
      )}
    </div>
  );
}

// ============================================================
// How to use these examples:
// ============================================================

/*

1. Modal Style (Example 1):
   - Import and use <ModalConfiguratorExample /> anywhere
   - Opens configurator as full-screen overlay

2. Page Style (Example 2):
   - Add route: <Route path="/customize" element={<PageConfiguratorExample />} />
   - Navigate to /customize to open configurator

3. Product Detail (Example 3):
   - Add to your CakeDetail page
   - Allows customization from product page

4. Homepage (Example 4):
   - Add to your home page
   - Highlights the custom cake feature

5. Category Page (Example 5):
   - Add to category listings
   - Offers custom option when browsing

6. Cart Upsell (Example 6):
   - Add to cart page
   - Encourages adding custom cake to order

7. Templates (Example 7):
   - Offers pre-configured starting points
   - Users can start from a template and modify

8. Admin Preview (Example 8):
   - View customer's custom cake design
   - Useful for order fulfillment

*/
