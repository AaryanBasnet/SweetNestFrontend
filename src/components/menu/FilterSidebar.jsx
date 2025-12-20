/**
 * FilterSidebar Component
 * Contains Collections, Flavor Notes, and Price Range filters
 * Receives data and handlers via props (loosely coupled)
 * Supports both desktop sidebar and mobile drawer modes
 */

import { X, RotateCcw } from 'lucide-react';
import PriceRangeSlider from './PriceRangeSlider';

export default function FilterSidebar({
  categories = [],
  selectedCategory,
  onCategoryChange,
  flavorTags = [],
  selectedFlavors = [],
  onFlavorToggle,
  priceRange = [500, 6000],
  onPriceChange,
  // Mobile drawer props
  isMobile = false,
  isOpen = false,
  onClose,
  onReset,
}) {
  // Static collections including "All Products"
  const collections = [
    { _id: null, name: 'All Products', slug: null },
    ...categories,
  ];

  // Filter content shared between desktop and mobile
  const FilterContent = () => (
    <>
      {/* Collections */}
      <div>
        <h3 className="text-lg sm:text-xl font-serif text-dark mb-3 sm:mb-4">Collections</h3>
        <ul className="space-y-1">
          {collections.map((cat) => (
            <li key={cat._id || 'all'}>
              <button
                onClick={() => {
                  onCategoryChange?.(cat._id);
                  if (isMobile) onClose?.();
                }}
                className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat._id
                    ? 'bg-dark text-white font-medium'
                    : 'text-dark/70 hover:bg-dark/5'
                }`}
              >
                {cat.name}
                {selectedCategory === cat._id && (
                  <span className="float-right text-accent">•</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Flavor Notes */}
      <div>
        <h3 className="text-lg sm:text-xl font-serif text-dark mb-3 sm:mb-4">Flavor Notes</h3>
        <div className="flex flex-wrap gap-2">
          {flavorTags.map((flavor) => (
            <button
              key={flavor}
              onClick={() => onFlavorToggle?.(flavor)}
              className={`px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm border transition-colors ${
                selectedFlavors.includes(flavor)
                  ? 'bg-dark text-white border-dark'
                  : 'border-dark/20 text-dark/70 hover:border-dark/40'
              }`}
            >
              {flavor}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-xl p-4 border border-dark/10">
        <h3 className="text-sm font-medium text-dark mb-4">Price Range</h3>
        <PriceRangeSlider
          min={500}
          max={6000}
          value={priceRange}
          onChange={onPriceChange}
        />
      </div>
    </>
  );

  // Mobile drawer mode
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        <div
          className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
        />

        {/* Drawer */}
        <aside
          className={`lg:hidden fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-cream-100 z-50 transform transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark/10">
            <h2 className="text-xl font-serif text-dark">Filters</h2>
            <div className="flex items-center gap-2">
              {onReset && (
                <button
                  onClick={() => {
                    onReset();
                  }}
                  className="p-2 text-dark/60 hover:text-dark transition-colors"
                  title="Reset filters"
                >
                  <RotateCcw size={18} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-dark/60 hover:text-dark transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto h-[calc(100%-65px)]">
            <FilterContent />
          </div>

          {/* Apply button - sticky at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-cream-100 border-t border-dark/10">
            <button
              onClick={onClose}
              className="w-full py-3 bg-dark text-white rounded-full font-medium text-sm hover:bg-dark/90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </aside>
      </>
    );
  }

  // Desktop sidebar mode
  return (
    <aside className="w-[200px] lg:w-[220px] flex-shrink-0 space-y-6 lg:space-y-8">
      <FilterContent />
    </aside>
  );
}
