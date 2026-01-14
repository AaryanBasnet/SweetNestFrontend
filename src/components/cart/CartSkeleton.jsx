import React from "react";

export default function CartSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-5 p-4 bg-cream/30 rounded-2xl animate-pulse"
        >
          <div className="w-24 h-24 bg-dark/10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-dark/10 rounded w-3/4" />
            <div className="h-4 bg-dark/10 rounded w-1/3" />
          </div>
          <div className="h-9 bg-dark/10 rounded-full w-24" />
          <div className="h-5 bg-dark/10 rounded w-20" />
        </div>
      ))}
    </div>
  );
}