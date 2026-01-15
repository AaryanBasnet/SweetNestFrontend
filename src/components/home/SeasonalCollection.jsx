import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActivePromotions } from "../../hooks/promotion";

// Fallback images when no promotions are active
const FALLBACK_IMAGES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop",
    alt: "Summer Berry Delight",
    description: "A perfect balance of texture and flavor. Our seasonal specials are crafted daily by our head pastry chef, ensuring that every bite captures the essence of the moment.",
    ctaText: "VIEW DETAILS",
    ctaLink: "/menu",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop",
    alt: "Autumn Spice Collection",
    description: "A perfect balance of texture and flavor. Our seasonal specials are crafted daily by our head pastry chef, ensuring that every bite captures the essence of the moment.",
    ctaText: "VIEW DETAILS",
    ctaLink: "/menu",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=800&auto=format&fit=crop",
    alt: "Winter Chocolate Fantasy",
    description: "A perfect balance of texture and flavor. Our seasonal specials are crafted daily by our head pastry chef, ensuring that every bite captures the essence of the moment.",
    ctaText: "VIEW DETAILS",
    ctaLink: "/menu",
  },
];

const CAROUSEL_INTERVAL = 4000;

export default function SeasonalCollection() {
  const navigate = useNavigate();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Fetch active promotions from API
  const { data: promotionsData, isLoading } = useActivePromotions();
  const activePromotions = promotionsData?.data || [];

  // Transform promotions to image format or use fallback
  const HERO_IMAGES = activePromotions.length > 0
    ? activePromotions.map((promo) => {
        // Determine link: if linked to a cake, go to cake detail page
        let link = '/shop';

        // Debug: Log promotion data
        console.log('Promotion:', promo.title, 'LinkedCakes:', promo.linkedCakes);

        if (promo.linkedCakes && promo.linkedCakes.length > 0) {
          const linkedCake = promo.linkedCakes[0];
          console.log('Linked Cake:', linkedCake);
          if (linkedCake && linkedCake.slug) {
            link = `/cake/${linkedCake.slug}`;
            console.log('Generated link:', link);
          }
        } else if (promo.ctaLink) {
          link = promo.ctaLink;
        }

        return {
          id: promo._id,
          url: promo.images?.[0]?.url || FALLBACK_IMAGES[0].url,
          alt: promo.title,
          description: promo.description,
          ctaText: promo.ctaText || 'VIEW DETAILS',
          ctaLink: link,
        };
      })
    : FALLBACK_IMAGES;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(interval);
  }, [HERO_IMAGES.length]);

  const handleShopNow = () => {
    const currentPromo = HERO_IMAGES[currentHeroIndex];
    navigate(currentPromo.ctaLink || "/shop");
  };

  const currentImage = HERO_IMAGES[currentHeroIndex];

  return (
    <section className="bg-white py-24 rounded-t-[3rem] relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">
            Seasonal Collections
          </span>
          <h2 className="text-5xl md:text-6xl font-serif text-primary mb-4">
            Baked for the Season
          </h2>
          <p className="text-primary/60 max-w-2xl mx-auto font-sans">
            Discover our limited-time creations, inspired by the changing weather and fresh, local produce.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Carousel Side */}
          <div className="relative group h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 bg-paper rounded-[40px] transform -rotate-2 scale-95 transition-transform duration-700 group-hover:-rotate-3 z-0"></div>
            <div className="relative w-full h-full rounded-[40px] overflow-hidden shadow-2xl z-10 bg-white">
              {HERO_IMAGES.map((img, index) => (
                <div
                  key={img.id}
                  className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${
                    index === currentHeroIndex
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-105 z-0"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Carousel Controls */}
              <div className="absolute bottom-6 right-6 flex gap-2 z-20">
                {HERO_IMAGES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentHeroIndex
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Description Side */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              Trending Now
            </div>
            <h3 className="text-4xl md:text-5xl font-serif text-primary mb-6">
              {currentImage.alt}
            </h3>
            <p className="text-lg text-primary/60 mb-8 leading-relaxed font-sans">
              {currentImage.description ||
                "A perfect balance of texture and flavor. Our seasonal specials are crafted daily by our head pastry chef, ensuring that every bite captures the essence of the moment."}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleShopNow}
                className="px-8 py-3 bg-dark text-white border  border-primary/20 text-primary rounded-full font-bold tracking-wide hover:bg-primary  transition-all duration-300"
              >
                {currentImage.ctaText || 'VIEW DETAILS'}
              </button>
              <button
                onClick={() => navigate('/menu')}
                className="px-8 py-3 bg-transparent border border-primary/20 text-primary rounded-full font-bold tracking-wide hover:bg-primary  transition-all duration-300"
              >
                SEE FULL MENU
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
