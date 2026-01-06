/**
 * ReviewStats Component
 * Displays rating summary and review count
 * Presentational component - fully controlled via props
 */

import { Star } from 'lucide-react';

export default function ReviewStats({
  averageRating = 0,
  totalReviews = 0,
  onWriteReview,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      {/* Rating Display */}
      <div className="flex items-center gap-4">
        {/* Average Rating */}
        <div className="flex flex-col items-center">
          <div className="text-4xl font-serif text-dark mb-1">
            {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
          </div>
          <div className="flex gap-0.5 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={
                  star <= Math.round(averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-dark/20'
                }
              />
            ))}
          </div>
          <p className="text-xs text-dark/40">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-16 bg-dark/10" />

        {/* Review Count Text */}
        <div>
          <h3 className="text-xl font-serif text-dark mb-1">
            Customer Reviews
          </h3>
          <p className="text-sm text-dark/60">
            {totalReviews > 0
              ? `Based on ${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'}`
              : 'No reviews yet'}
          </p>
        </div>
      </div>

      {/* Write Review Button */}
      <button
        onClick={onWriteReview}
        className="px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors whitespace-nowrap self-start sm:self-auto"
      >
        Write a Review
      </button>
    </div>
  );
}
