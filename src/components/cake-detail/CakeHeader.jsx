import React from "react";
import { Heart, Star } from "lucide-react";

export default function CakeHeader({
  name,
  price,
  rating,
  reviewsCount,
  description,
  isWishlisted,
  onWishlistToggle,
  wishlistLoading,
}) {
  return (
    <>
      {/* Title & Wishlist */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-3xl sm:text-4xl font-serif text-dark leading-tight">
          {name}
        </h1>
        <button
          onClick={onWishlistToggle}
          disabled={wishlistLoading}
          className="p-2 -mr-2 mt-1 disabled:opacity-50 transition-transform active:scale-95"
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
        <span className="text-2xl font-heading font-bold text-accent">
          Rs. {price}
        </span>
        <span className="text-dark/20">|</span>
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={
                  star <= Math.round(rating || 0)
                    ? "fill-amber-400 text-amber-400"
                    : "text-dark/20"
                }
              />
            ))}
          </div>
          <span className="text-sm text-dark/60">
            {reviewsCount || 0} Reviews
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-dark/60 leading-relaxed mb-6">{description}</p>
    </>
  );
}