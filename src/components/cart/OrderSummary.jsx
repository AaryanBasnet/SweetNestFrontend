import React, { useState } from "react";
import { ArrowRight, Gift, Tag, X } from "lucide-react"; // Added Tag, X
import DeliveryToggle from "./DeliveryToggle";
import PriceRow from "./PriceRow";

export default function OrderSummary({
  subtotal,
  shipping,
  total,
  deliveryType,
  promoCode,
  onDeliveryChange,
  onApplyPromo,
  onRemovePromo,
  onCheckout,
  isLoading,
  itemCount,
}) {
  const [code, setCode] = useState("");

  const handleApplyPromo = () => {
    if (code.trim()) {
      onApplyPromo(code.trim());
      setCode("");
    }
  };

  // Helper to safely get the code string
  const getPromoCodeLabel = () => {
    if (!promoCode) return "";
    return typeof promoCode === "object" ? promoCode.code : promoCode;
  };

  // Calculate discount for display
  const discountAmount = subtotal + shipping - total;

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-lg font-serif text-dark">Order Summary</h2>
        <p className="text-sm text-dark/40 mt-0.5">
          {itemCount} {itemCount === 1 ? "item" : "items"} in cart
        </p>
      </div>

      {/* Delivery Toggle */}
      <div className="px-6 pb-5">
        <DeliveryToggle
          deliveryType={deliveryType}
          onChange={onDeliveryChange}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-dark/5 mx-6" />

      {/* Price Breakdown */}
      <div className="px-6 py-5 space-y-3">
        <PriceRow label="Subtotal" value={subtotal} />
        <PriceRow
          label="Shipping"
          value={shipping === 0 ? "FREE" : shipping}
          isAccent={shipping > 0}
        />

        {/* ✅ NEW: Discount Row (Only visible if discount > 0) */}
        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-sm text-green-600 bg-green-50 p-2 rounded-lg">
             <div className="flex items-center gap-2">
                <Tag size={14} />
                <span>Discount ({getPromoCodeLabel()})</span>
             </div>
             <span className="font-medium">- Rs. {discountAmount.toLocaleString()}</span>
          </div>
        )}

        {/* Free Shipping Progress */}
        {deliveryType === "delivery" && subtotal < 1000 && (
          <div className="pt-2">
            <div className="flex justify-between text-xs text-dark/50 mb-1.5">
              <span>Free shipping progress</span>
              <span>Rs. {1000 - subtotal} away</span>
            </div>
            <div className="h-1.5 bg-cream rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-dark/40 mt-1.5">
              Add Rs. {1000 - subtotal} more for free delivery!
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-dark/5 mx-6" />

      {/* Total */}
      <div className="px-6 py-4">
        <PriceRow label="Total" value={total} isAccent isBold />
      </div>

      {/* Divider */}
      <div className="h-px bg-dark/5 mx-6" />

      {/* Promo Code Section */}
      <div className="px-6 py-5">
        {promoCode ? (
          <div className="flex items-center justify-between p-3.5 bg-green-50 border border-green-100 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Gift size={14} className="text-green-600" />
              </div>
              <div>
                {/* ✅ FIXED: Access .code safely here */}
                <p className="text-sm font-medium text-green-700">
                  {getPromoCodeLabel()}
                </p>
                <p className="text-xs text-green-600/70">Code applied</p>
              </div>
            </div>
            <button
              onClick={onRemovePromo}
              className="text-xs font-medium text-green-600 hover:text-green-800 transition-colors"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-cream/40 rounded-lg border border-transparent focus-within:border-accent/30 focus-within:bg-white transition-all">
              <Gift size={16} className="text-dark/30 shrink-0" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Promo Code"
                className="flex-1 bg-transparent text-sm text-dark placeholder:text-dark/40 focus:outline-none"
              />
            </div>
            <button
              onClick={handleApplyPromo}
              disabled={!code.trim() || isLoading}
              className="px-4 py-3 text-sm font-medium text-dark hover:text-dark hover:bg-cream/50 rounded-xl disabled:opacity-40 transition-all"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Checkout Button */}
      <div className="px-6 pb-6">
        <button
          onClick={onCheckout}
          disabled={isLoading || itemCount === 0}
          className="w-full flex items-center justify-center gap-2.5 py-4 bg-dark text-white font-medium rounded-2xl hover:bg-dark/90 disabled:opacity-50 transition-all shadow-lg shadow-dark/10 hover:shadow-xl hover:shadow-dark/15"
        >
          Proceed to Checkout
          <ArrowRight size={18} />
        </button>

        {/* Security Note */}
        <p className="text-xs text-dark/35 text-center mt-4 flex items-center justify-center gap-1.5">
          <Shield size={14} className="text-emerald-500" /> {/* Replaced SVG with Icon */}
          Secure checkout powered by Esewa
        </p>
      </div>
    </div>
  );
}

// Simple internal component for the Security Icon if you don't want to import Shield
function Shield({ size, className }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    )
}