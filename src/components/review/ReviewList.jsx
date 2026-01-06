/**
 * ReviewList Component
 * Container for fetching and displaying reviews with pagination
 */

import { useState } from 'react';
import { useCakeReviews } from '../../hooks/review/useReviews';
import ReviewCard from './ReviewCard';
import ReviewPagination from './ReviewPagination';
import useAuthStore from '../../stores/authStore';
import { Loader2 } from 'lucide-react';

export default function ReviewList({
  cakeId,
  onEditReview,
  onDeleteReview,
  onMarkHelpful,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuthStore();

  const { data, isLoading, isError, error } = useCakeReviews(
    cakeId,
    currentPage
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-dark/60 mb-4">
          {error?.message || 'Failed to load reviews'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-accent hover:underline text-sm font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  const reviews = data?.data || [];
  const pagination = data?.pagination;

  // Empty state
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-dark/60">
          No reviews yet. Be the first to review this cake!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Reviews Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
            currentUserId={user?._id}
            onEdit={onEditReview}
            onDelete={onDeleteReview}
            onMarkHelpful={onMarkHelpful}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <ReviewPagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
