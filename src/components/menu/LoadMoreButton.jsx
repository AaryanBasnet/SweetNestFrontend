/**
 * LoadMoreButton Component
 * Shows progress and load more functionality
 */

export default function LoadMoreButton({
  currentCount = 0,
  totalCount = 0,
  isLoading = false,
  onLoadMore,
  hasMore = true,
}) {
  if (totalCount === 0) return null;

  return (
    <div className="flex flex-col items-center py-10">
      {/* Progress text */}
      <p className="text-sm text-dark/40 mb-4">
        You've viewed {currentCount} of {totalCount} items
      </p>

      {/* Load more button */}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="px-8 py-3 border border-dark text-dark font-medium text-sm tracking-wide rounded-full hover:bg-dark hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </span>
          ) : (
            'LOAD MORE'
          )}
        </button>
      )}
    </div>
  );
}
