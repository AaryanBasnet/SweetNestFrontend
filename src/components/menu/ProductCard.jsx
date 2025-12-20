/**
 * ProductCard Component
 * Standalone cake product card
 * Receives all data via props (loosely coupled)
 */

import { Heart, ShoppingBag, Star } from 'lucide-react';

export default function ProductCard({
  name,
  slug,
  description,
  basePrice,
  images = [],
  ratingsAverage = 0,
  ratingsCount = 0,
  onAddToCart,
  onWishlist,
  onClick,
}) {
  const imageUrl = images[0]?.url || 'https://via.placeholder.com/300x300?text=Cake';
  const displayRating = ratingsAverage.toFixed(1);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart?.();
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    onWishlist?.();
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Name & Price - same row */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-serif text-base sm:text-lg text-dark group-hover:text-dark/80 transition-colors line-clamp-1 flex-1">
            {name}
          </h3>
          <span className="text-accent font-medium text-base sm:text-lg whitespace-nowrap">
            Rs. {basePrice}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-dark/60 line-clamp-2 mb-3 leading-relaxed">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={`sm:w-[18px] sm:h-[18px] ${
                  star <= Math.round(ratingsAverage)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-dark/20'
                }`}
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-dark/50 ml-1">
            ({ratingsCount} Reviews)
          </span>
        </div>

        {/* Buttons Row - Add to Cart + Wishlist */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-dark text-white text-sm sm:text-base font-medium rounded-full hover:bg-dark/90 transition-colors"
          >
            Add to Cart
            <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleWishlist}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border border-dark/20 rounded-full hover:border-red-400 hover:text-red-500 transition-colors"
          >
            <Heart size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
