/**
 * CakeDetail Page
 * Product detail page for individual cakes
 * Matches the provided design mockup
 */

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Star,
  Heart,
  Truck,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { useCakeBySlug, useCakes } from "../hooks/cake/useCakes";
import ProductCard from "../components/menu/ProductCard";
import { toast } from "react-toastify";
import useWishlistStore from "../stores/wishlistStore";
import useCartStore from "../stores/cartStore";
import useAuthStore from "../stores/authStore";

// Badge display mapping
const BADGE_LABELS = {
  bestSeller: "BEST SELLER",
  organic: "100% ORGANIC",
  newArrival: "NEW ARRIVAL",
  limitedEdition: "LIMITED EDITION",
  sugarFree: "SUGAR FREE",
  vegan: "VEGAN",
};

// Accordion Item Component
function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-dark/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm sm:text-base text-dark">{title}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-dark/40" />
        ) : (
          <ChevronDown size={20} className="text-dark/40" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        <div className="text-sm text-dark/60 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// Review Card Component
function ReviewCard({ rating, comment, author, date }) {
  return (
    <div className="bg-cream/50 rounded-xl p-5">
      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= rating ? "fill-amber-400 text-amber-400" : "text-dark/20"
            }
          />
        ))}
      </div>
      {/* Comment */}
      <p className="text-sm text-dark/70 mb-4 leading-relaxed">"{comment}"</p>
      {/* Author & Date */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-dark">{author}</span>
        <span className="text-xs text-dark/40">{date}</span>
      </div>
    </div>
  );
}

export default function CakeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: cake, isLoading, isError, error } = useCakeBySlug(slug);

  // Fetch related cakes from same category
  const { data: relatedData } = useCakes(
    { category: cake?.category?.slug, limit: 5 },
    { enabled: !!cake?.category?.slug }
  );

  // Filter out current cake from related products
  const relatedCakes =
    relatedData?.data?.filter((c) => c.slug !== slug)?.slice(0, 4) || [];

  // Stores
  const { isAuthenticated } = useAuthStore();
  const isLoggedIn = isAuthenticated();
  const {
    isInWishlist,
    toggleWishlist,
    isLoading: wishlistLoading,
  } = useWishlistStore();
  const { addToCart, isLoading: cartLoading } = useCartStore();

  // Local state
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Check if current cake is in wishlist
  const isWishlisted = cake ? isInWishlist(cake._id) : false;

  // Set default weight when cake data loads
  useEffect(() => {
    if (cake?.weightOptions?.length > 0) {
      const defaultOption =
        cake.weightOptions.find((opt) => opt.isDefault) ||
        cake.weightOptions[0];
      setSelectedWeight(defaultOption);
    }
  }, [cake]);

  // Reset state when slug changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [slug]);

  // Get current price based on selected weight
  const getCurrentPrice = () => {
    if (selectedWeight) return selectedWeight.price;
    if (cake?.weightOptions?.length > 0) {
      const defaultOption =
        cake.weightOptions.find((opt) => opt.isDefault) ||
        cake.weightOptions[0];
      return defaultOption.price;
    }
    return cake?.basePrice || 0;
  };

  // Get primary badge for display
  const getPrimaryBadge = () => {
    if (cake?.badges?.length > 0) {
      return BADGE_LABELS[cake.badges[0]] || cake.badges[0];
    }
    return null;
  };

  // Check if organic badge exists
  const hasOrganicBadge = () => {
    return cake?.badges?.includes("organic");
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedWeight) {
      toast.error("Please select a weight");
      return;
    }

    const result = await addToCart(
      {
        cakeId: cake._id,
        cake: cake,
        quantity,
        selectedWeight,
      },
      isLoggedIn
    );

    if (result.success) {
      toast.success(`Added ${quantity}x ${cake.name} to cart!`);
    } else {
      toast.error(result.message || "Failed to add to cart");
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    const result = await toggleWishlist(cake._id, isLoggedIn);
    if (result.success) {
      toast.success(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist"
      );
    } else {
      toast.error(result.message || "Failed to update wishlist");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="animate-pulse">
          <div className="h-4 w-48 bg-dark/10 rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div>
              <div className="aspect-4/3 bg-dark/10 rounded-2xl mb-4" />
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-dark/10 rounded-lg" />
                <div className="w-20 h-20 bg-dark/10 rounded-lg" />
                <div className="w-20 h-20 bg-dark/10 rounded-lg" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-10 w-3/4 bg-dark/10 rounded" />
              <div className="h-6 w-48 bg-dark/10 rounded" />
              <div className="h-16 w-full bg-dark/10 rounded" />
              <div className="h-12 w-full bg-dark/10 rounded" />
              <div className="h-14 w-full bg-dark/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-serif text-dark mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-dark/60 mb-6">
          {error?.message || "Failed to load cake details"}
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 bg-dark text-white rounded-lg hover:bg-dark/90 transition-colors"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  // Not found state
  if (!cake) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-serif text-dark mb-4">Cake not found</h2>
        <p className="text-dark/60 mb-6">
          The cake you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 bg-dark text-white rounded-lg hover:bg-dark/90 transition-colors"
        >
          Browse Our Menu
        </Link>
      </div>
    );
  }

  const images =
    cake.images?.length > 0
      ? cake.images
      : [{ url: "https://via.placeholder.com/600x600?text=Cake" }];

  return (
    <div className="max-w-9xl bg-white mx-auto px-4 sm:px-6 lg:px-20 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8 sm:mb-10">
        <Link
          to="/menu"
          className="text-dark/50 hover:text-dark transition-colors"
        >
          Shop
        </Link>
        <span className="text-dark/30">/</span>
        {cake.category && (
          <>
            <Link
              to={`/menu?category=${cake.category.slug}`}
              className="text-dark/50 hover:text-dark transition-colors uppercase text-xs tracking-wide"
            >
              {cake.category.name}
            </Link>
            <span className="text-dark/30">/</span>
          </>
        )}
        <span className="text-accent font-medium uppercase text-xs tracking-wide truncate max-w-[200px]">
          {cake.name}
        </span>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left: Image Gallery */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-cream mb-4">
            {getPrimaryBadge() && (
              <span className="absolute top-4 left-4 bg-dark/80 text-white text-xs font-medium px-3 py-1.5 rounded-md z-10">
                {getPrimaryBadge()}
              </span>
            )}
            <img
              src={images[selectedImageIndex]?.url}
              alt={cake.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all ${
                    selectedImageIndex === index
                      ? "ring-2 ring-dark"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${cake.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div>
          {/* Title & Wishlist */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl sm:text-4xl font-serif text-dark leading-tight">
              {cake.name}
            </h1>
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className="p-2 -mr-2 mt-1 disabled:opacity-50"
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart
                size={24}
                className={
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-dark/30 hover:text-dark/50"
                }
              />
            </button>
          </div>

          {/* Price & Rating */}
          <div className="flex items-center gap-4 mb-3">
            <span className="text-2xl font-heading font-bold   text-accent">
              Rs. {cake.basePrice}
            </span>
            <span className="text-dark/20">|</span>
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= Math.round(cake.ratingsAverage || 0)
                        ? "fill-amber-400 text-amber-400"
                        : "text-dark/20"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-dark/60">
                {cake.ratingsCount || 0} Reviews
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-dark/60 leading-relaxed mb-6">
            {cake.description}
          </p>

          {/* Weight Selector */}
          {cake.weightOptions?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-dark/60">Select Weight</span>
                <button className="text-sm text-accent hover:underline">
                  Weight Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {cake.weightOptions.map((option) => (
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
              onClick={handleAddToCart}
              disabled={cartLoading}
              className="flex-1 flex items-center justify-center gap-3 py-3 bg-dark text-white font-medium rounded-lg hover:bg-dark/90 disabled:opacity-50 transition-colors"
            >
              <span>{cartLoading ? "Adding..." : "Add to Cart"}</span>
              <span className="text-white/60">•</span>
              <span>Rs. {getCurrentPrice()}</span>
            </button>
          </div>

          {/* Customization Option */}
          {cake.isCustomizable && (
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

          {/* Accordion Sections */}
          <div className="border-t border-dark/10">
            {cake.ingredients?.length > 0 && (
              <AccordionItem title="Ingredients" defaultOpen>
                {cake.ingredients.join(", ")}
              </AccordionItem>
            )}

            {cake.storageAndCare && (
              <AccordionItem title="Storage & Care">
                {cake.storageAndCare}
              </AccordionItem>
            )}

            <AccordionItem title="Delivery Info">
              {cake.deliveryInfo?.deliveryNote ||
                "Standard delivery within 2-3 business days. Express delivery available for orders placed before 2 PM."}
            </AccordionItem>
          </div>

          {/* Info Badges */}
          <div className="flex items-center gap-8 mt-6 pt-6 border-t border-dark/10">
            {cake.deliveryInfo?.nextDayAvailable && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Truck size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-dark/50 uppercase tracking-wide">
                    Delivery
                  </p>
                  <p className="text-sm font-medium text-dark">
                    Next Day Available
                  </p>
                </div>
              </div>
            )}
            {hasOrganicBadge() && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle size={18} className="text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-dark/50 uppercase tracking-wide">
                    Quality
                  </p>
                  <p className="text-sm font-medium text-dark">100% Organic</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-16 pt-10 border-t border-dark/10">
        <ReviewStats
          averageRating={cake.ratingsAverage || 0}
          totalReviews={cake.ratingsCount || 0}
          onWriteReview={() => {
            if (!isLoggedIn) {
              toast.error('Please login to write a review');
              navigate('/login');
              return;
            }
            setEditingReview(null);
            setIsReviewModalOpen(true);
          }}
        />

        <ReviewList
          cakeId={cake._id}
          onEditReview={(review) => {
            setEditingReview(review);
            setIsReviewModalOpen(true);
          }}
          onDeleteReview={async (reviewId) => {
            if (window.confirm('Are you sure you want to delete this review?')) {
              try {
                await deleteReview.mutateAsync(reviewId);
                toast.success('Review deleted successfully');
              } catch (error) {
                toast.error(
                  error.response?.data?.message || 'Failed to delete review'
                );
              }
            }
          }}
          onMarkHelpful={async (reviewId) => {
            try {
              await markHelpful.mutateAsync(reviewId);
            } catch (error) {
              toast.error(
                error.response?.data?.message || 'Failed to mark as helpful'
              );
            }
          }}
        />

        {/* Review Modal */}
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setEditingReview(null);
          }}
          cakeId={cake._id}
          existingReview={editingReview}
          onSuccess={() => {
            // Modal handles success toast and closing
          }}
        />
      </section>

      {/* Related Products */}
      {relatedCakes.length > 0 && (
        <section className="mt-16 pt-10 border-t border-dark/10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif text-dark">You May Also Like</h2>
            <Link
              to={`/menu?category=${cake.category?.slug}`}
              className="text-sm text-accent hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedCakes.map((relatedCake) => {
              const defaultWeight =
                relatedCake.weightOptions?.find((w) => w.isDefault) ||
                relatedCake.weightOptions?.[0];
              return (
                <ProductCard
                  key={relatedCake._id}
                  name={relatedCake.name}
                  slug={relatedCake.slug}
                  description={relatedCake.description}
                  basePrice={relatedCake.basePrice}
                  images={relatedCake.images}
                  ratingsAverage={relatedCake.ratingsAverage}
                  ratingsCount={relatedCake.ratingsCount}
                  onClick={() => navigate(`/cake/${relatedCake.slug}`)}
                  onAddToCart={async () => {
                    if (!defaultWeight) {
                      navigate(`/cake/${relatedCake.slug}`);
                      return;
                    }
                    const result = await addToCart(
                      {
                        cakeId: relatedCake._id,
                        cake: relatedCake,
                        quantity: 1,
                        selectedWeight: defaultWeight,
                      },
                      isLoggedIn
                    );
                    if (result.success) {
                      toast.success(`Added ${relatedCake.name} to cart!`);
                    } else {
                      toast.error(result.message || "Failed to add to cart");
                    }
                  }}
                  onWishlist={async () => {
                    const result = await toggleWishlist(
                      relatedCake._id,
                      isLoggedIn
                    );
                    if (result.success) {
                      toast.success(
                        isInWishlist(relatedCake._id)
                          ? "Removed from wishlist"
                          : "Added to wishlist"
                      );
                    }
                  }}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
