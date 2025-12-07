import { useState, useEffect, useCallback, useMemo } from "react";
import { ShoppingCart, Sparkles } from "lucide-react";

// Mock images for demo
const images = [
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=800&fit=crop"
];

const TRANSITION_INTERVAL = 3000;

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = useMemo(() => (currentImage + 1) % images.length, [currentImage]);

  const advanceImage = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(advanceImage, TRANSITION_INTERVAL);
    return () => clearInterval(interval);
  }, [advanceImage, isHovered]);

  const cakeData = useMemo(() => ({
    tagline: "Fresh • Creamy • Irresistible",
    title: {
      light: "Strawberry",
      bold: "Cheesecake"
    },
    description: "Smooth cream cheese base blended with real, juicy strawberries, creating a naturally sweet and creamy flavor in every bite.",
    price: "550"
  }), []);

  return (
    <div className="relative h-[648px] w-full overflow-hidden mt-5 bg-gradient-to-br from-pink-50 to-orange-50">
      {/* Text Content */}
      <div className="absolute left-8 md:left-36 top-24 w-full max-w-2xl flex flex-col gap-6 z-10 px-4">
        <div>
          <p className="text-lg md:text-2xl opacity-60 tracking-wide font-light">
            {cakeData.tagline}
          </p>
          <h1 className="text-4xl md:text-5xl mt-2 font-serif">
            <span className="font-medium">{cakeData.title.light} </span>
            <span className="font-bold italic">{cakeData.title.bold}</span>
          </h1>
        </div>

        <p className="text-lg md:text-xl leading-relaxed text-gray-700 font-light max-w-xl">
          {cakeData.description}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button 
            className="bg-amber-900 hover:bg-amber-800 text-white rounded-full px-8 py-3 flex items-center gap-2 font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
            aria-label="Order cake now"
          >
            Order Now
            <ShoppingCart className="w-5 h-5" />
          </button>

          <button 
            className="bg-white hover:bg-pink-50 border-2 border-pink-200 text-gray-800 rounded-full px-8 py-3 font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-md"
            aria-label="Customize your cake"
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            Custom Cake
          </button>
        </div>

        <p className="text-3xl mt-4 font-serif">
          <span className="italic font-light text-gray-600">Starting at </span>
          <span className="font-bold text-amber-900">Rs. {cakeData.price}</span>
        </p>
      </div>

      {/* Main Image with Smooth Transition */}
      <div 
        className="absolute left-1/2 md:left-[calc(50%+20px)] top-[-80px] w-full max-w-xl h-[730px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={index === currentImage ? `${cakeData.title.light} ${cakeData.title.bold}` : "Next cake preview"}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
              index === currentImage 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>

      {/* Blurred Next Image Preview */}
      <div className="absolute right-8 md:right-24 top-8 w-40 h-40 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white">
        <img
          src={images[nextImage]}
          alt="Next cake preview"
          className="w-full h-full object-cover blur-sm opacity-80 scale-110 transition-all duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentImage 
                ? 'bg-amber-900 w-8' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}