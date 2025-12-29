/**
 * Cart Page
 * Shopping cart with order summary
 * Hybrid: localStorage for guests, server-synced for logged-in users
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Gift,
  ShoppingBag,
  ChevronRight,
  Truck,
  Store,
} from "lucide-react";
import { toast } from "react-toastify";
import useCartStore from "../stores/cartStore";
import useAuthStore from "../stores/authStore";

// Cart Item Component - Enhanced Design
function CartItem({ item, onUpdateQuantity, onRemove, isLoading }) {
  const cakeData = item.cake || {};
  const imageUrl =
    cakeData.images?.[0]?.url ||
    "https://via.placeholder.com/150x150?text=Cake";
  const itemPrice = item.selectedWeight?.price || cakeData.basePrice || 0;
  const totalPrice = itemPrice * (item.quantity || 1);

  // Format details string (e.g., "6-inch • Matcha")
  const weightLabel = item.selectedWeight?.label || "";
  const category = cakeData.category?.name || "";
  const detailsText = [weightLabel, category].filter(Boolean).join(" • ");

  return (
    <div className="group relative flex items-start sm:items-center gap-4 sm:gap-5 p-4 sm:p-5 bg-cream/30 rounded-2xl hover:bg-cream/50 transition-colors">
      {/* Product Image */}
      <Link to={`/cake/${cakeData.slug}`} className="shrink-0">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={imageUrl}
            alt={cakeData.name}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Product Info & Controls */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Name & Details */}
        <div className="flex-1 min-w-0">
          <Link to={`/cake/${cakeData.slug}`}>
            <h3 className="font-medium text-dark hover:text-accent transition-colors line-clamp-1">
              {cakeData.name || "Cake"}
            </h3>
          </Link>
          {detailsText && (
            <p className="text-sm text-dark/50 mt-0.5">{detailsText}</p>
          )}

          {/* Mobile Price */}
          <p className="sm:hidden text-accent font-semibold mt-2">
            Rs. {totalPrice}
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center bg-white border border-dark/10 rounded-full shadow-sm">
          <button
            onClick={() =>
              onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))
            }
            disabled={isLoading || item.quantity <= 1}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-dark/40 hover:text-dark disabled:opacity-30 transition-colors rounded-full hover:bg-cream/50"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 sm:w-10 text-center text-sm font-semibold text-dark">
            {item.quantity || 1}
          </span>
          <button
            onClick={() =>
              onUpdateQuantity(item._id, Math.min(10, item.quantity + 1))
            }
            disabled={isLoading || item.quantity >= 10}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-dark/40 hover:text-dark disabled:opacity-30 transition-colors rounded-full hover:bg-cream/50"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Desktop Price */}
        <p className="hidden sm:block text-accent font-semibold text-lg min-w-[90px] text-right">
          Rs. {totalPrice}
        </p>

        {/* Delete Button */}
        <button
          onClick={() => onRemove(item._id)}
          disabled={isLoading}
          className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto w-8 h-8 flex items-center justify-center text-dark/25 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

// Delivery Type Toggle - Enhanced
function DeliveryToggle({ deliveryType, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 p-1.5 bg-cream/50 rounded-2xl">
      <button
        onClick={() => onChange("delivery")}
        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
          deliveryType === "delivery"
            ? "bg-white text-dark shadow-sm"
            : "text-dark/40 hover:text-dark/60"
        }`}
      >
        <Truck
          size={16}
          className={deliveryType === "delivery" ? "text-accent" : ""}
        />
        Delivery
      </button>
      <button
        onClick={() => onChange("pickup")}
        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
          deliveryType === "pickup"
            ? "bg-white text-dark shadow-sm"
            : "text-dark/40 hover:text-dark/60"
        }`}
      >
        <Store
          size={16}
          className={deliveryType === "pickup" ? "text-accent" : ""}
        />
        Pickup
      </button>
    </div>
  );
}

// Price Row Component
function PriceRow({ label, value, isAccent = false, isBold = false }) {
  return (
    <div className="flex justify-between items-center">
      <span
        className={`text-sm ${
          isBold ? "font-medium text-dark" : "text-dark/60"
        }`}
      >
        {label}
      </span>
      <span
        className={`${
          isBold ? "text-lg font-semibold" : "text-sm font-medium"
        } ${isAccent ? "text-accent" : "text-dark"}`}
      >
        {typeof value === "number" ? `Rs. ${value}` : value}
      </span>
    </div>
  );
}

// Order Summary Component - Enhanced Design
function OrderSummary({
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
                <p className="text-sm font-medium text-green-700">
                  {promoCode}
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
          <div className="flex gap-">
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
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          Secure checkout powered by Esewa
        </p>
      </div>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();

  // Stores
  const { isAuthenticated } = useAuthStore();
  const isLoggedIn = isAuthenticated();

  const {
    items,
    deliveryType,
    promoCode,
    isLoading,
    getSubtotal,
    getShipping,
    getTotal,
    getItemCount,
    updateQuantity,
    removeFromCart,
    setDeliveryType,
    applyPromo,
    removePromo,
    fetchCart,
  } = useCartStore();

  // Fetch cart from server on mount if logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn, fetchCart]);

  // Handle quantity update
  const handleUpdateQuantity = async (itemId, quantity) => {
    const result = await updateQuantity(itemId, quantity, isLoggedIn);
    if (!result.success) {
      toast.error(result.message || "Failed to update quantity");
    }
  };

  // Handle remove item
  const handleRemove = async (itemId) => {
    const result = await removeFromCart(itemId, isLoggedIn);
    if (result.success) {
      toast.success("Item removed from cart");
    } else {
      toast.error(result.message || "Failed to remove item");
    }
  };

  // Handle delivery type change
  const handleDeliveryChange = (type) => {
    setDeliveryType(type, isLoggedIn);
  };

  // Handle promo code apply
  const handleApplyPromo = async (code) => {
    const result = await applyPromo(code, isLoggedIn);
    if (result.success) {
      toast.success("Promo code applied!");
    } else {
      toast.error(result.message || "Invalid promo code");
    }
  };

  // Handle promo code remove
  const handleRemovePromo = () => {
    removePromo(isLoggedIn);
    toast.success("Promo code removed");
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast.info("Please login to proceed to checkout");
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  const itemCount = getItemCount();

  // Empty cart state
  if (!isLoading && items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white">
        <div className=" mx-auto px-4 sm:px-6 lg:px-20 py-8">
          {/* Continue Shopping */}
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm text-dark/50 hover:text-dark transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            <span className="uppercase tracking-wide text-xs font-medium">
              Continue Shopping
            </span>
          </Link>

          {/* Header */}
          <h1 className="text-3xl sm:text-4xl text-center mb-12">
            <span className="font-serif text-dark">Your </span>
            <span className="font-serif italic text-accent">Basket</span>
          </h1>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={36} className="text-dark/25" />
            </div>
            <h2 className="text-xl font-serif text-dark mb-2">
              Your cart is empty
            </h2>
            <p className="text-dark/50 text-center max-w-sm mb-8">
              Looks like you haven't added any delicious cakes yet. Start
              browsing!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-dark text-white font-medium rounded-full hover:bg-dark/90 transition-all shadow-lg shadow-dark/10"
            >
              Explore Menu
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-20 py-4">
        

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl text-center mt-4 mb-8">
          <span className="font-serif text-dark">Your </span>
          <span className="font-serif italic text-accent">Basket</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-6">
              <span className="text-accent font-medium">Cart</span>
              <ChevronRight size={14} className="text-dark/20" />
              <span className="text-dark/35">Details</span>
              <ChevronRight size={14} className="text-dark/20" />
              <span className="text-dark/35">Payment</span>
            </nav>

            {/* Items List */}
            <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-sm">
              {isLoading ? (
                // Loading skeleton
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-5 p-4 bg-cream/30 rounded-2xl animate-pulse"
                    >
                      <div className="w-24 h-24 bg-dark/10 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-dark/10 rounded w-3/4" />
                        <div className="h-4 bg-dark/10 rounded w-1/3" />
                      </div>
                      <div className="h-9 bg-dark/10 rounded-full w-24" />
                      <div className="h-5 bg-dark/10 rounded w-20" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItem
                      key={item._id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemove}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary
              subtotal={getSubtotal()}
              shipping={getShipping()}
              total={getTotal()}
              deliveryType={deliveryType}
              promoCode={promoCode}
              onDeliveryChange={handleDeliveryChange}
              onApplyPromo={handleApplyPromo}
              onRemovePromo={handleRemovePromo}
              onCheckout={handleCheckout}
              isLoading={isLoading}
              itemCount={itemCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
