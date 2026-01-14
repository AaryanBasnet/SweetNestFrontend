import React from "react";

const BADGE_LABELS = {
  bestSeller: "BEST SELLER",
  organic: "100% ORGANIC",
  newArrival: "NEW ARRIVAL",
  limitedEdition: "LIMITED EDITION",
  sugarFree: "SUGAR FREE",
  vegan: "VEGAN",
};

export default function CakeGallery({
  images = [],
  badges = [],
  selectedIndex,
  setSelectedIndex,
}) {
  const getPrimaryBadge = () => {
    if (badges?.length > 0) {
      return BADGE_LABELS[badges[0]] || badges[0];
    }
    return null;
  };

  const displayImages =
    images.length > 0
      ? images
      : [{ url: "https://via.placeholder.com/600x600?text=Cake" }];

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-cream mb-4">
        {getPrimaryBadge() && (
          <span className="absolute top-4 left-4 bg-dark/80 text-white text-xs font-medium px-3 py-1.5 rounded-md z-10">
            {getPrimaryBadge()}
          </span>
        )}
        <img
          src={displayImages[selectedIndex]?.url}
          alt="Cake view"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Gallery */}
      {displayImages.length > 1 && (
        <div className="flex gap-3">
          {displayImages.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all ${
                selectedIndex === index
                  ? "ring-2 ring-dark"
                  : "opacity-60 hover:opacity-100"
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