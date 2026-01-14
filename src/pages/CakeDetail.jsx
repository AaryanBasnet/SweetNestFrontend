/**
 * CakeDetail Page
 * Product detail page for individual cakes
 */

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Hooks
import { useCakeBySlug, useCakes } from "../hooks/cake/useCakes";
import { useDeleteReview, useMarkHelpful } from "../hooks/review";

// Stores
import useWishlistStore from "../stores/wishlistStore";
import useCartStore from "../stores/cartStore";
import useAuthStore from "../stores/authStore";

// Components
import { ReviewStats, ReviewList, ReviewModal } from "../components/review";
import {
  CakeGallery,
  CakeHeader,
  CakeActions,
  CakeInfoAccordion,
  ServiceBadges,
  RelatedCakes,
} from "../components/cake-detail";

export default function CakeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Data Fetching
  const { data: cake, isLoading, isError, error } = useCakeBySlug(slug);
  const { data: relatedData } = useCakes(
    { category: cake?.category?.slug, limit: 5 },
    { enabled: !!cake?.category?.slug }
  );

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
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Review mutations
  const deleteReview = useDeleteReview(cake?._id);
  const markHelpful = useMarkHelpful();

  const isWishlisted = cake ? isInWishlist(cake._id) : false;

  // Effects
  useEffect(() => {
    if (cake?.weightOptions?.length > 0) {
      const defaultOption =
        cake.weightOptions.find((opt) => opt.isDefault) ||
        cake.weightOptions[0];
      setSelectedWeight(defaultOption);
    }
  }, [cake]);

  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [slug]);

  // Handlers
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

  const handleWishlistToggle = async () => {
    // 1. Capture the intended state BEFORE the toggle
    // If it was wishlisted, we are removing. If not, we are adding.
    const wasWishlisted = isWishlisted; 

    const result = await toggleWishlist(cake._id, isLoggedIn);

    if (result.success) {
      // 2. Use the result action if available, otherwise fallback to our calculated state
      let message = "";
      if (result.action) {
        message = result.action === "added" ? "Added to wishlist" : "Removed from wishlist";
      } else {
        // Fallback if store doesn't return 'action'
        message = !wasWishlisted ? "Added to wishlist" : "Removed from wishlist";
      }
      toast.success(message);
    } else {
      toast.error(result.message || "Failed to update wishlist");
    }
  };

  // Loading & Error States
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <ErrorState message={error?.message} />;
  }

  if (!cake) {
    return <NotFoundState />;
  }

  return (
    <div className="max-w-9xl bg-white mx-auto px-4 sm:px-6 lg:px-20 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8 sm:mb-10">
        <Link to="/menu" className="text-dark/50 hover:text-dark transition-colors">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        
        {/* Left: Gallery */}
        <CakeGallery
          images={cake.images}
          badges={cake.badges}
          selectedIndex={selectedImageIndex}
          setSelectedIndex={setSelectedImageIndex}
        />

        {/* Right: Product Info */}
        <div>
          <CakeHeader
            name={cake.name}
            price={cake.basePrice}
            rating={cake.ratingsAverage}
            reviewsCount={cake.ratingsCount}
            description={cake.description}
            isWishlisted={isWishlisted}
            onWishlistToggle={handleWishlistToggle}
            wishlistLoading={wishlistLoading}
          />

          <CakeActions
            weightOptions={cake.weightOptions}
            selectedWeight={selectedWeight}
            setSelectedWeight={setSelectedWeight}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
            cartLoading={cartLoading}
            currentPrice={getCurrentPrice()}
            isCustomizable={cake.isCustomizable}
          />

          <CakeInfoAccordion
            ingredients={cake.ingredients}
            storageAndCare={cake.storageAndCare}
            deliveryInfo={cake.deliveryInfo}
          />

          <ServiceBadges
            deliveryInfo={cake.deliveryInfo}
            badges={cake.badges}
          />
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-16 pt-10 border-t border-dark/10">
        <ReviewStats
          averageRating={cake.ratingsAverage || 0}
          totalReviews={cake.ratingsCount || 0}
          onWriteReview={() => {
            if (!isLoggedIn) {
              toast.error("Please login to write a review");
              navigate("/login");
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
            if (window.confirm("Are you sure you want to delete this review?")) {
              try {
                await deleteReview.mutateAsync(reviewId);
                toast.success("Review deleted successfully");
              } catch (error) {
                toast.error(
                  error.response?.data?.message || "Failed to delete review"
                );
              }
            }
          }}
          onMarkHelpful={async (reviewId) => {
            try {
              await markHelpful.mutateAsync(reviewId);
            } catch (error) {
              toast.error(
                error.response?.data?.message || "Failed to mark as helpful"
              );
            }
          }}
        />

        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setEditingReview(null);
          }}
          cakeId={cake._id}
          existingReview={editingReview}
          onSuccess={() => {}}
        />
      </section>

      {/* Related Products */}
      <RelatedCakes
        cakes={relatedCakes}
        categorySlug={cake.category?.slug}
        addToCart={addToCart}
        toggleWishlist={toggleWishlist}
        isInWishlist={isInWishlist}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}

// Sub-components for Loading/Error to keep main file clean
function LoadingSkeleton() {
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

function ErrorState({ message }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h2 className="text-2xl font-serif text-dark mb-4">
        Oops! Something went wrong
      </h2>
      <p className="text-dark/60 mb-6">
        {message || "Failed to load cake details"}
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

function NotFoundState() {
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