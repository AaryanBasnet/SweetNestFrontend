import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCakes } from "../../hooks/cake";
import useAuthStore from "../../stores/authStore";
import useCartStore from "../../stores/cartStore";
import useWishlistStore from "../../stores/wishlistStore";
import ProductCard from "../menu/ProductCard";
import ProductCardSkeleton from "../menu/ProductCardSkeleton";

const HOW_MANY = 3;

/**
 * The top-rated cakes, shown with the same card as the Menu so the two pages
 * look and behave alike (add to cart, wishlist, ratings).
 */
export default function CrowdFavorites() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => Boolean(state.user));
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const { data, isLoading } = useCakes({ sort: "-ratingsAverage", limit: HOW_MANY });
  const cakes = data?.data || [];

  // Nothing to show once loading is done: leave the section out rather than
  // invent cakes that do not exist in the shop.
  if (!isLoading && cakes.length === 0) return null;

  const handleAddToCart = async (cake) => {
    const defaultWeight =
      cake.weightOptions?.find((w) => w.isDefault) || cake.weightOptions?.[0];

    if (!defaultWeight) {
      navigate(`/cake/${cake.slug}`);
      return;
    }

    const result = await addToCart(
      { cakeId: cake._id, cake, quantity: 1, selectedWeight: defaultWeight },
      isLoggedIn
    );

    if (result.success) toast.success(`${cake.name} added to cart!`);
    else toast.error(result.message || "Failed to add to cart");
  };

  const handleWishlist = async (cake) => {
    const result = await toggleWishlist(cake._id, isLoggedIn);
    if (!result.success) return;

    if (result.action === "added") toast.success(`${cake.name} added to wishlist!`);
    else toast.info(`${cake.name} removed from wishlist.`);
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl md:text-6xl italic mb-4 font-serif text-primary">
            Crowd <span className="text-accent">Favorites</span>
          </h2>
          <p className="text-primary/60 font-sans">
            Our highest-rated cakes, straight from customer reviews.
          </p>
        </div>
        <button
          onClick={() => navigate("/menu")}
          className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wide border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors mt-6 md:mt-0 group"
        >
          VIEW ALL PRODUCTS{" "}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: HOW_MANY }).map((_, i) => <ProductCardSkeleton key={i} />)
          : cakes.map((cake, index) => (
              <ProductCard
                key={cake._id}
                name={cake.name}
                description={cake.description}
                basePrice={cake.basePrice}
                images={cake.images}
                ratingsAverage={cake.ratingsAverage}
                ratingsCount={cake.ratingsCount}
                badge={`#${index + 1} Top rated`}
                isWishlisted={isInWishlist(cake._id)}
                onClick={() => navigate(`/cake/${cake.slug}`)}
                onAddToCart={() => handleAddToCart(cake)}
                onWishlist={() => handleWishlist(cake)}
              />
            ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <button
          onClick={() => navigate("/menu")}
          className="inline-flex items-center gap-2 text-sm font-bold tracking-wide border-b border-primary pb-1"
        >
          VIEW ALL PRODUCTS <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
