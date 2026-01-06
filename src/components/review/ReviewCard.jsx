/**
 * ReviewCard Component
 * Displays a single review with actions
 * Fully controlled - receives all data via props
 */

import { Star, ThumbsUp, MoreVertical } from 'lucide-react';
import { useState } from 'react';

export default function ReviewCard({
  review,
  currentUserId,
  onEdit,
  onDelete,
  onMarkHelpful,
  className = '',
}) {
  const [showActions, setShowActions] = useState(false);

  const isOwner = currentUserId === review.user;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Track helpful in localStorage (simple client-side approach)
  const helpfulKey = `review-helpful-${review._id}`;
  const hasMarkedHelpful = localStorage.getItem(helpfulKey) === 'true';

  const handleMarkHelpful = () => {
    if (!hasMarkedHelpful) {
      localStorage.setItem(helpfulKey, 'true');
      onMarkHelpful?.(review._id);
    }
  };

  return (
    <div className={`bg-cream/50 rounded-xl p-5 ${className}`}>
      {/* Rating Stars */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={
                star <= review.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-dark/20'
              }
            />
          ))}
        </div>

        {/* Verified Purchase Badge */}
        {review.isVerifiedPurchase && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            Verified Purchase
          </span>
        )}
      </div>

      {/* Comment */}
      <p className="text-sm text-dark/70 mb-4 leading-relaxed">
        "{review.comment}"
      </p>

      {/* Footer: Author, Date, Actions */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-dark">
            {review.reviewerName}
          </span>
          <span className="text-xs text-dark/40">
            {formatDate(review.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Helpful Button */}
          <button
            onClick={handleMarkHelpful}
            disabled={hasMarkedHelpful}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              hasMarkedHelpful
                ? 'bg-accent/10 text-accent cursor-not-allowed'
                : 'bg-dark/5 text-dark/60 hover:bg-dark/10'
            }`}
            aria-label="Mark review as helpful"
          >
            <ThumbsUp size={12} />
            <span>{review.helpfulCount || 0}</span>
          </button>

          {/* Edit/Delete (owner only) */}
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1.5 hover:bg-dark/5 rounded-lg transition-colors"
                aria-label="Review actions"
              >
                <MoreVertical size={16} className="text-dark/60" />
              </button>

              {showActions && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowActions(false)}
                  />

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-dark/10 py-1 z-20 min-w-[120px]">
                    <button
                      onClick={() => {
                        setShowActions(false);
                        onEdit?.(review);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-dark/70 hover:bg-dark/5 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowActions(false);
                        onDelete?.(review._id);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
