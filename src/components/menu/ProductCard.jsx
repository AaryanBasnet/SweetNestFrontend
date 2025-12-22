/**
 * ProductCard Component
 * Matches exact design from screenshot
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
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#E8E4DD] rounded-t-2xl">

        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name & Price */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-dark text-base font-medium leading-tight line-clamp-1">
            {name}
          </h3>
          <span className="text-accent font-medium text-base whitespace-nowrap">
            Rs. {basePrice}
          </span>
        </div>

        {/* Description */}
        <p className="text-dark/50 text-sm leading-relaxed line-clamp-2 mb-3">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={
                  star <= Math.round(ratingsAverage)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-dark/20'
                }
              />
            ))}
          </div>
          <span className="text-dark/40 text-sm">
            ({ratingsCount} Reviews)
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-dark text-white text-sm font-medium rounded-full hover:bg-dark/90 transition-colors"
          >
            Add to Cart
            <ShoppingBag size={16} />
          </button>
          <button
            onClick={handleWishlist}
            className="w-10 h-10 flex items-center justify-center border border-dark/15 rounded-full text-dark/40 hover:border-accent hover:text-accent transition-colors"
          >
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
