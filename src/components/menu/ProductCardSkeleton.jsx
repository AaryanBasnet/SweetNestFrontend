import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-dark/5">
      <div className="aspect-square bg-dark/5 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-dark/5 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-dark/5 rounded w-1/2 animate-pulse" />
        <div className="pt-2 flex justify-between items-center">
          <div className="h-4 bg-dark/5 rounded w-1/3 animate-pulse" />
          <div className="h-8 w-8 bg-dark/5 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}