/**
 * ProductImageGallery Component
 * Main product image with thumbnail gallery
 */

import { useState } from 'react';

export default function ProductImageGallery({ images = [], badge }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fallback image if no images provided
  const displayImages = images.length > 0
    ? images
    : [{ url: 'https://via.placeholder.com/600x600?text=Cake' }];

  const mainImage = displayImages[selectedIndex]?.url;

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative aspect-[4/3] sm:aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-cream mb-3 sm:mb-4">
        {badge && (
          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-dark text-white text-xs font-medium px-3 py-1.5 rounded-full z-10">
            {badge}
          </span>
        )}
        <img
          src={mainImage}
          alt="Product"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Gallery */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 sm:gap-3">
          {displayImages.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                selectedIndex === index
                  ? 'ring-2 ring-dark ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
