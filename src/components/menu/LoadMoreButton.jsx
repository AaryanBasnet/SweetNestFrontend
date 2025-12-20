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
  const progress = totalCount > 0 ? (currentCount / totalCount) * 100 : 0;

  if (totalCount === 0) return null;

  return (
    <div className="flex flex-col items-center py-8">
      {/* Progress text */}
      <p className="text-sm text-dark/50 mb-3">
        You've viewed <span className="font-medium text-dark">{currentCount}</span> of{' '}
        <span className="font-medium text-dark">{totalCount}</span> items
      </p>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-dark/10 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Load more button */}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="px-8 py-3 border-2 border-dark text-dark font-medium rounded-lg hover:bg-dark hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
