import { ArrowRight, Crown, Heart, ShoppingBag, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCakes } from "../../hooks/cake";
import useAuthStore from "../../stores/authStore";
import useCartStore from "../../stores/cartStore";
import useWishlistStore from "../../stores/wishlistStore";

const HOW_MANY = 3;
const FALLBACK_IMAGE = "/placeholder-cake.svg";

const imageOf = (cake) => cake.images?.[0]?.url || FALLBACK_IMAGE;
const notesOf = (cake) => (cake.flavorTags || []).join(" · ");

/** An invisible link over the whole card. The buttons sit above it (`relative z-10`). */
function CardLink({ cake, ringClass, radius }) {
  return (
    <Link
      to={`/cake/${cake.slug}`}
      aria-label={`View ${cake.name}`}
      className={`absolute inset-0 ${radius} focus-visible:outline-none focus-visible:ring-2 ${ringClass}`}
    />
  );
}

function Rating({ cake, light = false }) {
  const rating = cake.ratingsAverage || 0;
  return (
    <span
      className="inline-flex items-center gap-2 text-[13px]"
      aria-label={`Rated ${rating.toFixed(1)} out of 5 from ${cake.ratingsCount || 0} reviews`}
    >
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={14}
            className={
              n <= Math.round(rating)
                ? "text-amber-400 fill-amber-400"
                : light
                  ? "text-white/30"
                  : "text-dark/20"
            }
          />
        ))}
      </span>
      <b className="font-medium">{rating.toFixed(1)}</b>
      <span className={light ? "text-white/70" : "text-dark/50"}>({cake.ratingsCount || 0})</span>
    </span>
  );
}

function WishlistButton({ cake, active, onToggle, className }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? `Remove ${cake.name} from wishlist` : `Add ${cake.name} to wishlist`}
      className={`relative z-10 rounded-full flex items-center justify-center border transition-colors ${className} ${
        active
          ? "border-red-500 bg-red-50 text-red-500"
          : "border-dark/15 bg-white text-dark/50 hover:border-red-500 hover:text-red-500"
      }`}
    >
      <Heart size={18} className={active ? "fill-current" : ""} />
    </button>
  );
}

/** The #1 cake: a large photo tile. */
function SpotlightCard({ cake, wished, onAdd, onWish }) {
  return (
    <article className="group relative isolate overflow-hidden rounded-[30px] text-white min-h-[460px] lg:row-span-2">
      <img
        src={imageOf(cake)}
        alt=""
        className="absolute inset-0 -z-20 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1c1410]/90 via-[#1c1410]/35 to-transparent to-70%" />
      <CardLink cake={cake} radius="rounded-[30px]" ringClass="focus-visible:ring-white" />

      <div className="pointer-events-none absolute top-5 left-5 right-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest">
          <Crown size={13} className="fill-current" /> #1 Top rated
        </span>
        <WishlistButton cake={cake} active={wished} onToggle={onWish} className="pointer-events-auto w-10 h-10" />
      </div>

      <div className="pointer-events-none absolute inset-x-7 bottom-7">
        {notesOf(cake) && (
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">
            {notesOf(cake)}
          </span>
        )}
        <h3 className="mt-2 mb-1.5 font-serif text-4xl lg:text-[44px] leading-[1.05]">{cake.name}</h3>
        <p className="mb-5 max-w-[44ch] text-white/80 line-clamp-2">{cake.description}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="font-serif text-3xl">Rs. {cake.basePrice}</span>
          <Rating cake={cake} light />
          <button
            type="button"
            onClick={onAdd}
            className="pointer-events-auto relative z-10 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-dark transition-colors hover:bg-accent hover:text-white"
          >
            Add to Cart <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

/** Ranks #2 and #3: a compact card beside the spotlight. */
function SideCard({ cake, rank, wished, onAdd, onWish }) {
  return (
    <article className="group relative grid grid-cols-[110px_1fr] sm:grid-cols-[150px_1fr] gap-4 sm:gap-5 rounded-[26px] bg-white p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-18px_rgba(44,36,32,0.35)]">
      <CardLink cake={cake} radius="rounded-[26px]" ringClass="focus-visible:ring-accent" />
      <div className="relative min-h-[130px] overflow-hidden rounded-[18px]">
        <img src={imageOf(cake)} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <span className="absolute left-2.5 top-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white font-serif text-[15px]">
          {rank}
        </span>
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-2 pr-2">
        {notesOf(cake) && (
          <span className="text-[11px] font-bold uppercase tracking-widest text-dark/60">
            {notesOf(cake)}
          </span>
        )}
        <h3 className="font-serif text-xl sm:text-2xl leading-tight">{cake.name}</h3>
        <p className="hidden sm:block text-sm text-dark/60 line-clamp-2">{cake.description}</p>
        <Rating cake={cake} />
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="font-serif text-xl text-accent">Rs. {cake.basePrice}</span>
          <div className="flex items-center gap-2">
            <WishlistButton cake={cake} active={wished} onToggle={onWish} className="w-9 h-9" />
            <button
              type="button"
              onClick={onAdd}
              className="relative z-10 rounded-full bg-dark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr] lg:grid-rows-2" aria-hidden="true">
      <div className="min-h-[460px] rounded-[30px] bg-dark/10 animate-pulse lg:row-span-2" />
      <div className="min-h-[170px] rounded-[26px] bg-dark/10 animate-pulse" />
      <div className="min-h-[170px] rounded-[26px] bg-dark/10 animate-pulse" />
    </div>
  );
}

/** The top-rated cakes: number one as a spotlight, the next two beside it. */
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

  const [first, ...rest] = cakes;

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

      {isLoading ? (
        <Skeleton />
      ) : (
        <div className={`grid gap-5 ${rest.length ? "lg:grid-cols-[1.25fr_1fr] lg:grid-rows-2" : ""}`}>
          <SpotlightCard
            cake={first}
            wished={isInWishlist(first._id)}
            onAdd={() => handleAddToCart(first)}
            onWish={() => handleWishlist(first)}
          />
          {rest.map((cake, index) => (
            <SideCard
              key={cake._id}
              cake={cake}
              rank={index + 2}
              wished={isInWishlist(cake._id)}
              onAdd={() => handleAddToCart(cake)}
              onWish={() => handleWishlist(cake)}
            />
          ))}
        </div>
      )}

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
