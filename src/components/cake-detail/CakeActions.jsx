import React from "react";
import { ArrowRight } from "lucide-react";

export default function CakeActions({
  weightOptions,
  selectedWeight,
  setSelectedWeight,
  quantity,
  setQuantity,
  onAddToCart,
  cartLoading,
  currentPrice,
  isCustomizable,
}) {
  return (
    <>
      {/* Weight Selector */}
      {weightOptions?.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-dark/60">Select Weight</span>
            {/* <button className="text-sm text-accent hover:underline">
              Weight Guide
            </button> */}
          </div>
          <div className="flex flex-wrap gap-3">
            {weightOptions.map((option) => (
              <button
                key={option.weightInKg}
                onClick={() => setSelectedWeight(option)}
                className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  selectedWeight?.weightInKg === option.weightInKg
                    ? "border-accent text-accent"
                    : "border-dark/20 text-dark/70 hover:border-dark/40"
                }`}
              >
                {option.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="flex items-center gap-4 mb-6">
        {/* Quantity Selector */}
        <div className="flex items-center border border-dark/20 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-11 flex items-center justify-center text-dark/60 hover:text-dark transition-colors"
          >
            −
          </button>
          <span className="w-8 text-center text-dark font-medium">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="w-10 h-11 flex items-center justify-center text-dark/60 hover:text-dark transition-colors"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          disabled={cartLoading}
          className="flex-1 flex items-center justify-center gap-3 py-3 bg-dark text-white font-medium rounded-lg hover:bg-dark/90 disabled:opacity-50 transition-colors"
        >
          <span>{cartLoading ? "Adding..." : "Add to Cart"}</span>
          <span className="text-white/60">•</span>
          <span>Rs. {currentPrice}</span>
        </button>
      </div>

      {/* Customization Option */}
      {isCustomizable && (
        <div className="flex items-center justify-between p-4 bg-cream/50 rounded-xl mb-6">
          <div>
            <p className="text-sm font-medium text-dark">
              Want to customize this design?
            </p>
            <p className="text-xs text-dark/50">
              Change colors, toppings, and add a message.
            </p>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
            Customize
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </>
  );
}