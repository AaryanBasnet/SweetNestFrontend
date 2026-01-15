import { Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCakes } from "../../hooks/cake";

const FALLBACK_FAVORITES = [
  {
    id: 1,
    name: "Wild Berry Bliss",
    description: "Sponge cake, cream, fresh berries",
    basePrice: 555,
    images: ["https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=800&auto=format&fit=crop"],
    coverImage: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=800&auto=format&fit=crop",
    badge: null,
    slug: "wild-berry-bliss",
  },
  {
    id: 2,
    name: "Midnight Truffle",
    description: "85% Dark Chocolate, Gold flakes",
    basePrice: 620,
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop"],
    coverImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
    badge: "Best Seller",
    slug: "midnight-truffle",
  },
  {
    id: 3,
    name: "Citrus Cloud",
    description: "Lemon zest, poppy seeds, glaze",
    basePrice: 480,
    images: ["https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=800&auto=format&fit=crop"],
    coverImage: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=800&auto=format&fit=crop",
    badge: null,
    slug: "citrus-cloud",
  },
];

function ProductCard({ cake, offsetClass, onClick }) {
  // Get image URL - handle both object and string formats
  const image = cake.images?.[0]?.url || cake.images?.[0] || cake.coverImage;
  const description = cake.flavorTags?.join(', ') || cake.description || 'Delicious handmade cake';

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer hover:-translate-y-2 transition-transform duration-500 ${offsetClass}`}
    >
      <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden mb-6">
        {cake.badge && (
          <span className="absolute top-6 left-6 bg-white px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full z-10 shadow-sm text-primary">
            {cake.badge}
          </span>
        )}
        <img
          src={image}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt={cake.name}
        />
        <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-red-500">
          <Heart size={20} className="text-primary" />
        </div>
      </div>
      <div className="flex justify-between items-start px-2">
        <div>
          <h3 className="text-2xl font-medium group-hover:text-accent transition-colors font-serif text-primary">
            {cake.name}
          </h3>
          <p className="text-sm text-primary/50 mt-1 font-sans">{description}</p>
        </div>
        <span className="text-xl font-bold font-serif text-primary">Rs. {cake.basePrice}</span>
      </div>
    </div>
  );
}

export default function CrowdFavorites() {
  const navigate = useNavigate();

  // Fetch top-rated cakes (sorted by rating)
  const { data: cakesData } = useCakes({
    sort: '-ratingsAverage',
    limit: 3
  });
  const apiCakes = cakesData?.data || [];

  // Use API data if available, otherwise fallback
  const favorites = apiCakes.length >= 3 ? apiCakes : FALLBACK_FAVORITES;

  // Add offset classes for staggered layout
  const offsetClasses = ['', 'lg:mt-12', ''];

  const handleShopNow = () => {
    navigate("/menu");
  };

  const handleProductClick = (cake) => {
    navigate(`/cake/${cake.slug}`);
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl md:text-6xl italic mb-4 font-serif text-primary">
            Crowd <span className="text-accent">Favorites</span>
          </h2>
          <p className="text-primary/60 font-sans">Our best-selling delights, loved by thousands.</p>
        </div>
        <button
          onClick={handleShopNow}
          className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wide border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors mt-6 md:mt-0 group"
        >
          VIEW ALL PRODUCTS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {favorites.map((cake, index) => (
          <ProductCard
            key={cake._id || cake.id}
            cake={cake}
            offsetClass={offsetClasses[index] || ''}
            onClick={() => handleProductClick(cake)}
          />
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <button
          onClick={handleShopNow}
          className="inline-flex items-center gap-2 text-sm font-bold tracking-wide border-b border-primary pb-1"
        >
          VIEW ALL PRODUCTS <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
