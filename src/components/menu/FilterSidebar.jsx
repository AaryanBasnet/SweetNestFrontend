import React from "react";
import PriceRangeSlider from "./PriceRangeSlider";
import { FLAVOR_TAGS } from "../../stores/menuStore";

export default function FilterSidebar({
  collections,
  activeCategory,
  onCategoryChange,
  activeFlavors,
  onFlavorToggle,
  priceRange,
  onPriceChange,
  onCloseMobile, // Optional prop for mobile drawer
}) {
  return (
    <>
      {/* Collections */}
      <div className="mb-8">
        <h3 className="text-xl font-serif text-dark mb-4">Collections</h3>
        <ul className="space-y-1">
          {collections.map((cat) => (
            <li key={cat._id || "all"}>
              <button
                onClick={() => {
                  onCategoryChange(cat.slug);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-dark text-white"
                    : "text-dark/70 hover:bg-dark/5"
                }`}
              >
                {cat.name}
                {activeCategory === cat.slug && (
                  <span className="float-right">•</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Flavor Tags */}
      <div className="mb-8">
        <h3 className="text-xl font-serif text-dark mb-4">Flavors</h3>
        <div className="flex flex-wrap gap-2">
          {FLAVOR_TAGS.map((flavor) => (
            <button
              key={flavor}
              onClick={() => onFlavorToggle(flavor)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                activeFlavors.includes(flavor)
                  ? "bg-dark text-white border-dark"
                  : "border-dark/20 text-dark/60 hover:border-dark/40"
              }`}
            >
              {flavor}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="border border-dark/10 rounded-xl p-4">
        <h3 className="text-sm font-medium text-dark mb-4">Price Range</h3>
        <PriceRangeSlider
          min={0}
          max={6000}
          value={priceRange}
          onChange={onPriceChange}
        />
      </div>
    </>
  );
}