/**
 * ProductGrid Component
 * Grid layout for product cards
 * Responsive: 1 col mobile, 2 cols tablet, 3 cols desktop
 */

import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function ProductGrid({
  products = [],
  isLoading = false,
  onProductClick,
  onAddToCart,
  onWishlist,
  skeletonCount = 8,
}) {
  // Loading state
  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="w-20 h-20 mb-5 bg-cream rounded-full flex items-center justify-center">
          <span className="text-3xl">🎂</span>
        </div>
        <h3 className="text-lg font-serif text-dark mb-2">No cakes found</h3>
        <p className="text-dark/50 text-sm max-w-xs">
          Try adjusting your filters or search to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
