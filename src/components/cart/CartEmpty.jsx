import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, ShoppingBag } from "lucide-react";

export default function CartEmpty() {
  return (
    <div className="min-h-[70vh] bg-white">
      <div className=" mx-auto px-4 sm:px-6 lg:px-20 py-8">
        {/* Continue Shopping */}
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-sm text-dark/50 hover:text-dark transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          <span className="uppercase tracking-wide text-xs font-medium">
            Continue Shopping
          </span>
        </Link>

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl text-center mb-12">
          <span className="font-serif text-dark">Your </span>
          <span className="font-serif italic text-accent">Basket</span>
        </h1>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={36} className="text-dark/25" />
          </div>
          <h2 className="text-xl font-serif text-dark mb-2">
            Your cart is empty
          </h2>
          <p className="text-dark/50 text-center max-w-sm mb-8">
            Looks like you haven't added any delicious cakes yet. Start
            browsing!
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-dark text-white font-medium rounded-full hover:bg-dark/90 transition-all shadow-lg shadow-dark/10"
          >
            Explore Menu
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}