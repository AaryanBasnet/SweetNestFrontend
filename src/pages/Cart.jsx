/**
 * Cart Page
 * Shopping cart with order summary
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

// Stores
import useCartStore from "../stores/cartStore";
import useAuthStore from "../stores/authStore";

// Components
import {
  CartItem,
  OrderSummary,
  CartEmpty,
  CartSkeleton,
} from "../components/cart";

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

  // Handlers
  const handleUpdateQuantity = async (itemId, quantity) => {
    const result = await updateQuantity(itemId, quantity, isLoggedIn);
    if (!result.success) {
      toast.error(result.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (itemId) => {
    const result = await removeFromCart(itemId, isLoggedIn);
    if (result.success) {
      toast.success("Item removed from cart");
    } else {
      toast.error(result.message || "Failed to remove item");
    }
  };

  const handleDeliveryChange = (type) => {
    setDeliveryType(type, isLoggedIn);
  };

  const handleApplyPromo = async (code) => {
    const result = await applyPromo(code, isLoggedIn);
    if (result.success) {
      toast.success("Promo code applied!");
    } else {
      toast.error(result.message || "Invalid promo code");
    }
  };

  const handleRemovePromo = () => {
    removePromo(isLoggedIn);
    toast.success("Promo code removed");
  };

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
    return <CartEmpty />;
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
          {/* Cart Items Column */}
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
                <CartSkeleton />
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

          {/* Order Summary Column */}
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