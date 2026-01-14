/**
 * ProductGrid Component
 * Grid layout for product cards
 * Responsive: 1 col mobile, 2 cols tablet, 3 cols desktop, 4 cols large screens
 */

import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function ProductGrid({
  products = [],
  isLoading = false,
  isFetching = false, // Controls dimming effect for updates
  onProductClick,
  onAddToCart,
  onWishlist,
  wishlistChecker, // Function to check if an item is favorited
  skeletonCount = 8,
}) {
  // 1. Initial Loading State (No products yet) -> Show Skeletons
  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // 2. Empty State (Loaded but found nothing)
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

  // 3. Data Grid with Smooth "Dimming" Effect
  return (
    <div className="relative min-h-[200px]">
      {/* Grid Container */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 transition-all duration-300 ease-in-out ${
          isFetching ? "opacity-50 grayscale-[0.5]" : "opacity-100"
        }`}
      >
        {products.map((product) => (
          <ProductCard
            key={product._id}
            {...product}
            onClick={() => onProductClick?.(product)}
            onAddToCart={() => onAddToCart?.(product)}
            onWishlist={() => onWishlist?.(product)}
            // Use the checker function to set true/false
            isWishlisted={wishlistChecker ? wishlistChecker(product._id) : false}
          />
        ))}
      </div>

      {/* "Updating" Indicator Overlay */}
      {isFetching && products.length > 0 && (
        <div className="absolute inset-0 flex items-start justify-center pt-20 pointer-events-none z-10">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-dark/10">
            <span className="text-xs font-medium text-dark animate-pulse flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-dark rounded-full animate-bounce" />
              Updating results...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}