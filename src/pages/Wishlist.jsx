/**
 * Wishlist Page
 * Displays user's saved/favorite items
 * Hybrid: localStorage for guests, server-synced for logged-in users
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Bell,
  ShoppingCart,
  Plus,
  Minus,
  Gift,
  Heart,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import useWishlistStore from "../stores/wishlistStore";
import useCartStore from "../stores/cartStore";
import useAuthStore from "../stores/authStore";

// Wishlist Item Card Component
function WishlistItemCard({ item, onRemove, onAddToCart, isLoading }) {
  const [quantity, setQuantity] = useState(1);

  // Get cake data - item could be an ID (guest) or object with cake data (logged in)
  const cakeData = typeof item === "string" ? null : item.cake;
  const cakeId = typeof item === "string" ? item : item.cake?._id || item.cake;

  // Get default weight
  const defaultWeight =
    cakeData?.weightOptions?.find((w) => w.isDefault) ||
    cakeData?.weightOptions?.[0];

  // If we don't have cake data yet (guest mode loading)
  if (!cakeData) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
        <div className="aspect-4/3 bg-dark/10" />
        <div className="p-4 space-y-3">
          <div className="h-5 bg-dark/10 rounded w-3/4" />
          <div className="h-4 bg-dark/10 rounded w-1/2" />
          <div className="h-10 bg-dark/10 rounded" />
        </div>
      </div>
    );
  }

  const imageUrl =
    cakeData.images?.[0]?.url ||
    "https://via.placeholder.com/400x300?text=Cake";
  const price = defaultWeight?.price || cakeData.basePrice || 0;
  const weightLabel = defaultWeight?.label || "1 Pound";

  const handleAddToCart = () => {
    onAddToCart({
      cakeId,
      cake: cakeData,
      quantity,
      selectedWeight: defaultWeight,
    });
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* Product Image */}
      <div className="relative">
        <Link to={`/cake/${cakeData.slug}`}>
          <img
            src={imageUrl}
            alt={cakeData.name}
            className="w-full aspect-4/3 object-cover"
          />
        </Link>
        {/* Delete Button */}
        <button
          onClick={() => onRemove(cakeId)}
          disabled={isLoading}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-dark/40 hover:text-red-500 hover:bg-white transition-colors shadow-sm"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Name & Price Row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <Link to={`/cake/${cakeData.slug}`}>
            <h3 className="font-medium text-dark hover:text-accent transition-colors">
              {cakeData.name}
            </h3>
          </Link>
          <span className="text-accent font-medium whitespace-nowrap">
            Rs. {price}
          </span>
        </div>

        {/* Quantity & Weight Row */}
        <div className="flex items-center gap-2 mb-4">
          {/* Quantity Selector */}
          <div className="flex items-center">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 flex items-center justify-center text-dark/60 hover:text-dark transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm font-medium text-dark">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="w-7 h-7 flex items-center justify-center text-dark/60 hover:text-dark transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="text-dark/30">·</span>
          <span className="text-sm text-dark/60">{weightLabel}</span>
        </div>

        {/* Add to Cart & Bell Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-dark text-white text-sm font-medium rounded-lg hover:bg-dark/90 disabled:opacity-50 transition-colors"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center border border-dark/15 rounded-lg text-dark/40 hover:text-accent hover:border-accent transition-colors"
            title="Set reminder"
          >
            <Bell size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Upcoming Celebrations Sidebar Component
function UpcomingCelebrations() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Gift size={18} className="text-accent" />
        <h3 className="font-medium text-dark">Upcoming Celebrations</h3>
      </div>

      {/* Empty State */}
      <div className="text-center py-4">
        <p className="text-accent text-sm mb-2">No reminders set.</p>
        <p className="text-dark/40 text-xs leading-relaxed">
          Click the bell icon on a cake to get
          <br />
          notified for special dates.
        </p>
      </div>
    </div>
  );
}

export default function Wishlist() {
  const navigate = useNavigate();

  // Stores
  const { isAuthenticated } = useAuthStore();
  const isLoggedIn = isAuthenticated();

  const {
    items: wishlistItems,
    isLoading: wishlistLoading,
    removeFromWishlist,
    fetchWishlist,
  } = useWishlistStore();

  const { addToCart, isLoading: cartLoading } = useCartStore();

  // Fetch wishlist from server on mount if logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist();
    }
  }, [isLoggedIn, fetchWishlist]);

  // Process items for display
  const displayItems = wishlistItems.filter((item) => {
    // Filter out items that are just IDs without cake data loaded
    if (typeof item === "string") return false;
    return item.cake != null;
  });

  const itemCount = displayItems.length;

  // Handle remove from wishlist
  const handleRemove = async (cakeId) => {
    const result = await removeFromWishlist(cakeId, isLoggedIn);
    if (result.success) {
      toast.success("Removed from wishlist");
    } else {
      toast.error(result.message || "Failed to remove");
    }
  };

  // Handle add to cart
  const handleAddToCart = async (cartItem) => {
    const result = await addToCart(cartItem, isLoggedIn);
    if (result.success) {
      toast.success(`Added ${cartItem.cake?.name || "item"} to cart!`);
    } else {
      toast.error(result.message || "Failed to add to cart");
    }
  };

  // Empty state
  if (!wishlistLoading && itemCount === 0) {
    return (
      <div className="min-h-[70vh] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <h1 className="text-3xl sm:text-4xl text-center mb-12">
            <span className="font-serif text-dark">MY </span>
            <span className="font-serif italic text-accent">Wishlist</span>
          </h1>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mb-6">
              <Heart size={32} className="text-dark/30" />
            </div>
            <h2 className="text-xl font-serif text-dark mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-dark/50 text-center max-w-sm mb-6">
              Start adding your favorite cakes to keep them handy for later!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-dark text-white font-medium rounded-lg hover:bg-dark/90 transition-colors"
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl text-center mb-12">
          <span className="font-serif text-dark">MY </span>
          <span className="font-serif italic text-accent">Wishlist</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-dark">Saved Delights</h2>
              <span className="text-sm text-dark/50">
                {itemCount} {itemCount === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* Loading State */}
            {wishlistLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl overflow-hidden animate-pulse"
                  >
                    <div className="aspect-4/3 bg-dark/10" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-dark/10 rounded w-3/4" />
                      <div className="h-4 bg-dark/10 rounded w-1/2" />
                      <div className="h-10 bg-dark/10 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {displayItems.map((item, index) => {
                  const itemId =
                    typeof item === "string"
                      ? item
                      : item.cake?._id || item._id;
                  return (
                    <WishlistItemCard
                      key={itemId || index}
                      item={item}
                      onRemove={handleRemove}
                      onAddToCart={handleAddToCart}
                      isLoading={wishlistLoading || cartLoading}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <UpcomingCelebrations />
          </div>
        </div>
      </div>
    </div>
  );
}
