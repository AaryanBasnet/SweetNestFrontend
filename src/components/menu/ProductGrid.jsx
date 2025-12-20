/**
 * ProductGrid Component
 * Grid layout for product cards
 * Handles loading and empty states
 */

import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function ProductGrid({
  products = [],
  isLoading = false,
  onProductClick,
  onAddToCart,
  onWishlist,
  skeletonCount = 6,
}) {
  // Loading state
  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6 bg-dark/5 rounded-full flex items-center justify-center">
          <span className="text-3xl sm:text-4xl">🎂</span>
        </div>
        <h3 className="text-lg sm:text-xl font-serif text-dark mb-2">No cakes found</h3>
        <p className="text-dark/50 text-xs sm:text-sm max-w-xs">
          Try adjusting your filters or search to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          {...product}
          onClick={() => onProductClick?.(product)}
          onAddToCart={() => onAddToCart?.(product)}
          onWishlist={() => onWishlist?.(product)}
        />
      ))}
    </div>
  );
}
