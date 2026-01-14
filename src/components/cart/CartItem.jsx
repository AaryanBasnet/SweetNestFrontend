import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react"; // 1. Import Loader2

export default function CartItem({ item, onUpdateQuantity, onRemove, isLoading }) {
  const cakeData = item.cake || {};
  const cakeId = item.cakeId || cakeData._id || "";
  const isCustomCake = typeof cakeId === 'string' && cakeId.startsWith('custom-');

  const imageUrl =
    cakeData.images?.[0]?.url ||
    "https://via.placeholder.com/150x150?text=Cake";
  const itemPrice = item.selectedWeight?.price || cakeData.basePrice || 0;
  const totalPrice = itemPrice * (item.quantity || 1);

  // Format details string
  let detailsText = "";
  if (isCustomCake && item.customization) {
    const { tiers, size, flavor, color, topper } = item.customization;
    const details = [tiers, size, flavor, color].filter(Boolean);
    detailsText = details.join(" • ");
  } else {
    const weightLabel = item.selectedWeight?.label || "";
    const category = cakeData.category?.name || "";
    detailsText = [weightLabel, category].filter(Boolean).join(" • ");
  }

  return (
    <div className={`group relative flex items-start sm:items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl transition-all duration-200 ${isLoading ? 'bg-gray-50 opacity-90' : 'bg-cream/30 hover:bg-cream/50'}`}>
      
      {/* Product Image */}
      {isCustomCake ? (
        <div className="shrink-0">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={imageUrl}
              alt={cakeData.name}
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover"
            />
          </div>
        </div>
      ) : (
        <Link to={`/cake/${cakeData.slug}`} className="shrink-0">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={imageUrl}
              alt={cakeData.name}
              className={`w-20 h-20 sm:w-24 sm:h-24 object-cover transition-transform duration-300 ${isLoading ? '' : 'group-hover:scale-105'}`}
            />
          </div>
        </Link>
      )}

      {/* Product Info & Controls */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Name & Details */}
        <div className="flex-1 min-w-0">
          {isCustomCake ? (
            <h3 className="font-medium text-dark line-clamp-1">
              {cakeData.name || "Custom Cake"}
              <span className="ml-2 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">Custom</span>
            </h3>
          ) : (
            <Link to={`/cake/${cakeData.slug}`}>
              <h3 className="font-medium text-dark hover:text-accent transition-colors line-clamp-1">
                {cakeData.name || "Cake"}
              </h3>
            </Link>
          )}
          {detailsText && (
            <p className="text-sm text-dark/50 mt-0.5">{detailsText}</p>
          )}
          {isCustomCake && item.customization?.message && (
            <p className="text-xs text-dark/40 mt-1 italic">
              Message: "{item.customization.message}"
            </p>
          )}

          {/* Mobile Price */}
          <p className="sm:hidden text-accent font-semibold mt-2">
            Rs. {totalPrice}
          </p>
        </div>

        {/* -------------------------------------------------- */}
        {/* Quantity Selector (UPDATED SECTION)                */}
        {/* -------------------------------------------------- */}
        <div className={`flex items-center bg-white border border-dark/10 rounded-full shadow-sm transition-opacity ${isLoading ? 'border-dark/5' : ''}`}>
          
          <button
            onClick={() => onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
            disabled={isLoading || item.quantity <= 1}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-dark/40 hover:text-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-full hover:bg-cream/50"
          >
            <Minus size={14} />
          </button>
          
          {/* Middle part: Shows Number OR Spinner */}
          <span className="w-8 sm:w-10 h-full flex items-center justify-center">
             {isLoading ? (
                <Loader2 size={14} className="animate-spin text-accent" />
             ) : (
                <span className="text-sm font-semibold text-dark">
                  {item.quantity || 1}
                </span>
             )}
          </span>

          <button
            onClick={() => onUpdateQuantity(item._id, Math.min(10, item.quantity + 1))}
            disabled={isLoading || item.quantity >= 10}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-dark/40 hover:text-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-full hover:bg-cream/50"
          >
            <Plus size={14} />
          </button>
        </div>
        {/* -------------------------------------------------- */}

        {/* Desktop Price */}
        <p className={`hidden sm:block text-accent font-semibold text-lg min-w-[90px] text-right transition-opacity ${isLoading ? 'opacity-50' : ''}`}>
          Rs. {totalPrice}
        </p>

        {/* Delete Button */}
        <button
          onClick={() => onRemove(item._id)}
          disabled={isLoading}
          className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto w-8 h-8 flex items-center justify-center text-dark/25 hover:text-red-500 hover:bg-red-50 rounded-full transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-dark/25"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}