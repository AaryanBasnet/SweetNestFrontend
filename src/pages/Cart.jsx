import { useEffect, useState } from "react";
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
import DeleteConfirmationModal from "../components/common/DeleteModal"; // Import the modal

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const isLoggedIn = isAuthenticated();

  const {
    items,
    deliveryType,
    promoCode,
    isLoading: isGlobalLoading, // Rename to distinguish usage
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

  // --- Local States ---
  // Track which specific item is updating (to avoid global skeleton)
  const [updatingItemId, setUpdatingItemId] = useState(null);
  
  // Delete Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // Fetch cart on mount
  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn, fetchCart]);

  // --- Handlers ---

  // 1. Fixed Quantity Handler (Removes Skeleton flash)
  const handleUpdateQuantity = async (itemId, quantity) => {
    setUpdatingItemId(itemId); // Set local loading
    
    // We pass 'false' to updateQuantity if your store supports a "silent" mode, 
    // otherwise the store might trigger global loading. 
    // But since we changed the JSX logic below, even if store triggers loading, it won't flash.
    const result = await updateQuantity(itemId, quantity, isLoggedIn);
    
    setUpdatingItemId(null); // Clear local loading

    if (!result.success) {
      toast.error(result.message || "Failed to update quantity");
    }
  };

  // 2. Delete Handlers (Modal)
  const initiateDelete = (itemId) => {
    setItemToDelete(itemId);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsRemoving(true);
    const result = await removeFromCart(itemToDelete, isLoggedIn);
    setIsRemoving(false);

    if (result.success) {
      setIsDeleteOpen(false);
      setItemToDelete(null);
      toast.success("Item removed from cart", { icon: "🗑️" });
    } else {
      toast.error(result.message || "Failed to remove item");
    }
  };

  // Other handlers
  const handleDeliveryChange = (type) => setDeliveryType(type, isLoggedIn);
  const handleRemovePromo = () => { removePromo(isLoggedIn); toast.success("Promo code removed"); };
  const handleApplyPromo = async (code) => {
    const result = await applyPromo(code, isLoggedIn);
    result.success ? toast.success("Promo code applied!") : toast.error(result.message || "Invalid promo code");
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

  // --- Render Logic ---

  // 1. Initial Loading State (Only show skeleton if we have NO data yet)
  if (isGlobalLoading && items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white mx-auto px-4 sm:px-6 lg:px-20 py-4">
        <CartSkeleton />
      </div>
    );
  }

  // 2. Empty State
  if (!isGlobalLoading && items.length === 0) {
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
              <div className="space-y-3">
                {items.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={initiateDelete} // Use the modal initiator
                    
                    // Pass specific loading state to the item
                    isLoading={updatingItemId === item._id} 
                    
                    // Disable interactions if *any* item is updating to prevent conflicts
                    disabled={updatingItemId !== null}
                  />
                ))}
              </div>
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
              isLoading={isGlobalLoading} // Keep summary loading if needed
              itemCount={itemCount}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        isLoading={isRemoving}
      />
    </div>
  );
}