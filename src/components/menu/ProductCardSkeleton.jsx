/**
 * ProductCardSkeleton Component
 * Loading placeholder for product card
 */

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-dark/10" />

      {/* Content skeleton */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Title & price */}
        <div className="flex justify-between gap-2">
          <div className="h-5 sm:h-6 bg-dark/10 rounded w-2/3" />
          <div className="h-5 sm:h-6 bg-dark/10 rounded w-16" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-dark/10 rounded w-full" />
          <div className="h-4 bg-dark/10 rounded w-4/5" />
        </div>

        {/* Rating */}
        <div className="h-5 bg-dark/10 rounded w-32" />

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-12 sm:h-14 bg-dark/10 rounded-full" />
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-dark/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
