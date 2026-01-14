import React from "react";

export default function LoadMoreButton({
  currentCount,
  totalCount,
  isLoading,
  hasMore,
  onLoadMore,
}) {
  if (!hasMore && currentCount > 0) {
    return (
      <div className="mt-12 text-center pb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark/5 text-dark/40 text-sm">
          <span>You've viewed all {totalCount} items</span>
        </div>
      </div>
    );
  }

  if (hasMore) {
    return (
      <div className="mt-12 text-center pb-8">
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="px-8 py-3 bg-white border border-dark/20 rounded-full text-sm font-medium text-dark hover:border-dark hover:bg-dark hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : "Load More"}
        </button>
      </div>
    );
  }

  return null;
}