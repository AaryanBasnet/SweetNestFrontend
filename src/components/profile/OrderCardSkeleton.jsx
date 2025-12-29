/**
 * Order Card Skeleton Component
 * Loading placeholder for order cards
 */

import { memo } from 'react';

function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-dark/10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-dark/10 rounded w-32" />
          <div className="h-3 bg-dark/10 rounded w-48" />
          <div className="h-3 bg-dark/10 rounded w-24" />
        </div>
        <div className="h-8 bg-dark/10 rounded-full w-28" />
      </div>
    </div>
  );
}

export default memo(OrderCardSkeleton);

