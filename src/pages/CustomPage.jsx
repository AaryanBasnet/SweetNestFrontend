import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CakeConfigurator } from "../components/cake/configurator";
import { Sparkles, ArrowRight, Check } from "lucide-react";

/**
 * CustomPage - Dedicated page for 3D cake customization
 * Accessible at /custompage
 */
export default function CustomPage() {
  const [showConfigurator, setShowConfigurator] = useState(false);
  const navigate = useNavigate();

  // If configurator is open, show it full screen
  if (showConfigurator) {
    return (
      <CakeConfigurator
        onClose={() => setShowConfigurator(false)}
      />
    );
  }

  // Landing page with call-to-action
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles size={16} />
              <span>New Feature</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-medium text-dark mb-4">
              Design Your Dream Cake in 3D
            </h1>
            <p className="text-lg text-dark/70 max-w-2xl mx-auto">
              Create a custom cake that's uniquely yours with our interactive 3D designer.
              Choose flavors, colors, decorations, and see it come to life before your eyes.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-dark/10 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-medium text-dark mb-2">Customize Everything</h3>
              <p className="text-dark/60 text-sm">
                Pick from 8 flavors, 8 colors, multiple tiers, sizes, and decorations.
                Add a personal message to make it special.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-dark/10 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👁️</span>
              </div>
              <h3 className="text-xl font-medium text-dark mb-2">See It in 3D</h3>
              <p className="text-dark/60 text-sm">
                Rotate, zoom, and explore your cake from every angle with our
                interactive 3D preview. What you see is what you get.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-dark/10 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-medium text-dark mb-2">Fast Delivery</h3>
              <p className="text-dark/60 text-sm">
                Order by 4 PM for next-day delivery anywhere in Kathmandu Valley.
                We bake fresh to order.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={() => setShowConfigurator(true)}
              className="inline-flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start Designing Now
              <ArrowRight size={20} />
            </button>
            <p className="text-sm text-dark/50 mt-4">
              No account required • Free to use • Save to cart anytime
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-medium text-dark text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
            {/* Step 1 */}
            <div className="md:col-span-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent font-medium text-xl mb-4">
                1
              </div>
              <h4 className="font-medium text-dark mb-2">Choose Tiers</h4>
              <p className="text-sm text-dark/60">
                Select 1, 2, or 3 tiers for your cake
              </p>
            </div>

            {/* Step 2 */}
            <div className="md:col-span-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent font-medium text-xl mb-4">
                2
              </div>
              <h4 className="font-medium text-dark mb-2">Pick Size</h4>
              <p className="text-sm text-dark/60">
                Choose from 1kg to 3kg based on servings
              </p>
            </div>

            {/* Step 3 */}
            <div className="md:col-span-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent font-medium text-xl mb-4">
                3
              </div>
              <h4 className="font-medium text-dark mb-2">Select Flavor</h4>
              <p className="text-sm text-dark/60">
                8 delicious flavors to choose from
              </p>
            </div>

            {/* Step 4 */}
            <div className="md:col-span-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent font-medium text-xl mb-4">
                4
              </div>
              <h4 className="font-medium text-dark mb-2">Choose Color</h4>
              <p className="text-sm text-dark/60">
                Pick your frosting color from 8 options
              </p>
            </div>

            {/* Step 5 */}
            <div className="md:col-span-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent font-medium text-xl mb-4">
                5
              </div>
              <h4 className="font-medium text-dark mb-2">Add Topper</h4>
              <p className="text-sm text-dark/60">
                Fruits, chocolate, candles, flowers, or macarons
              </p>
            </div>

            {/* Step 6 */}
            <div className="md:col-span-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent font-medium text-xl mb-4">
                6
              </div>
              <h4 className="font-medium text-dark mb-2">Add Message</h4>
              <p className="text-sm text-dark/60">
                Personalize with a custom message
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setShowConfigurator(true)}
              className="inline-flex items-center gap-2 border-2 border-accent text-accent px-6 py-3 rounded-lg font-medium hover:bg-accent/5 transition-colors"
            >
              Try It Now
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-6 bg-cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-medium text-dark text-center mb-4">
            Transparent Pricing
          </h2>
          <p className="text-dark/70 text-center mb-12">
            See the price update in real-time as you design
          </p>

          <div className="bg-white p-8 rounded-2xl border border-dark/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-dark mb-4">Base Prices</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-dark/70">1 kg (4-6 servings)</span>
                    <span className="font-medium text-dark">Rs. 1,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-dark/70">1.5 kg (8-10 servings)</span>
                    <span className="font-medium text-dark">Rs. 1,700</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-dark/70">2 kg (12-15 servings)</span>
                    <span className="font-medium text-dark">Rs. 2,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-dark/70">3 kg (20-25 servings)</span>
                    <span className="font-medium text-dark">Rs. 3,200</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-dark mb-4">Add-ons</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-dark/70">2 Tiers</span>
                    <span className="font-medium text-accent">×1.8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-dark/70">3 Tiers</span>
                    <span className="font-medium text-accent">×2.5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-dark/70">Fresh Fruits</span>
                    <span className="font-medium text-accent">+Rs. 200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-dark/70">Edible Flowers</span>
                    <span className="font-medium text-accent">+Rs. 300</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-dark/10">
              <div className="flex items-start gap-3 text-sm text-dark/60">
                <Check size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <p>
                  <strong className="text-dark">What's Included:</strong> Premium ingredients,
                  professional decoration, custom message card, elegant packaging, and
                  next-day delivery in Kathmandu Valley
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-medium text-white mb-4">
            Ready to Create Your Perfect Cake?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join hundreds of satisfied customers who designed their dream cakes with us
          </p>
          <button
            onClick={() => setShowConfigurator(true)}
            className="inline-flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl"
          >
            Start Your Design
            <Sparkles size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}
