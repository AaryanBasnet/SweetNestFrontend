/**
 * ProductCardSkeleton Component
 * Loading placeholder matching ProductCard design
 */

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-[#E8E4DD]/50 rounded-t-2xl" />

      {/* Content skeleton */}
      <div className="p-4">
        {/* Title & price */}
        <div className="flex justify-between gap-2 mb-2">
          <div className="h-5 bg-dark/10 rounded w-2/3" />
          <div className="h-5 bg-dark/10 rounded w-16" />
        </div>

        {/* Description */}
        <div className="space-y-1.5 mb-3">
          <div className="h-4 bg-dark/10 rounded w-full" />
          <div className="h-4 bg-dark/10 rounded w-4/5" />
        </div>

        {/* Rating */}
        <div className="h-4 bg-dark/10 rounded w-28 mb-4" />

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-10 bg-dark/10 rounded-full" />
          <div className="w-10 h-10 bg-dark/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
