import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../menu/ProductCard";
import { toast } from "react-toastify";

export default function RelatedCakes({
  cakes,
  categorySlug,
  addToCart,
  toggleWishlist,
  isInWishlist,
  isLoggedIn,
}) {
  const navigate = useNavigate();

  if (!cakes || cakes.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-dark/10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif text-dark">You May Also Like</h2>
        <Link
          to={`/menu?category=${categorySlug}`}
          className="text-sm text-accent hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cakes.map((relatedCake) => {
          const defaultWeight =
            relatedCake.weightOptions?.find((w) => w.isDefault) ||
            relatedCake.weightOptions?.[0];

          return (
            <ProductCard
              key={relatedCake._id}
              name={relatedCake.name}
              slug={relatedCake.slug}
              description={relatedCake.description}
              basePrice={relatedCake.basePrice}
              images={relatedCake.images}
              ratingsAverage={relatedCake.ratingsAverage}
              ratingsCount={relatedCake.ratingsCount}
              // Pass wishlist status prop if using updated ProductCard
              isWishlisted={isInWishlist(relatedCake._id)}
              onClick={() => navigate(`/cake/${relatedCake.slug}`)}
              onAddToCart={async () => {
                if (!defaultWeight) {
                  navigate(`/cake/${relatedCake.slug}`);
                  return;
                }
                const result = await addToCart(
                  {
                    cakeId: relatedCake._id,
                    cake: relatedCake,
                    quantity: 1,
                    selectedWeight: defaultWeight,
                  },
                  isLoggedIn
                );
                if (result.success) {
                  toast.success(`Added ${relatedCake.name} to cart!`);
                } else {
                  toast.error(result.message || "Failed to add to cart");
                }
              }}
              onWishlist={async () => {
                const result = await toggleWishlist(
                  relatedCake._id,
                  isLoggedIn
                );
                if (result.success) {
                  toast.success(
                    result.action === "added"
                      ? "Added to wishlist"
                      : "Removed from wishlist"
                  );
                }
              }}
            />
          );
        })}
      </div>
    </section>
  );
}