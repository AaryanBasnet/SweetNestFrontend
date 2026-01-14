/**
 * Menu Page
 * Clean shop layout matching design
 */

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";

// Hooks
import { useInfiniteCakes, useCategories } from "../hooks/cake";

// Store
import useMenuStore, { SORT_OPTIONS } from "../stores/menuStore";
import useCartStore from "../stores/cartStore";
import useWishlistStore from "../stores/wishlistStore";
import useAuthStore from "../stores/authStore";

// Components
import {
  FilterSidebar,
  LoadMoreButton,
  ProductGrid,
  SearchBar,
  SortDropdown,
} from "../components/menu";

export default function Menu() {
  const navigate = useNavigate();

  // Auth & stores
  const { isAuthenticated } = useAuthStore();
  const isLoggedIn = isAuthenticated();
  const { addToCart } = useCartStore();
  // Get isInWishlist from store
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  // Menu store state and actions
  const {
    filters,
    setCategory,
    setSearch,
    setSort,
    setPriceRange,
    toggleFlavorTag,
  } = useMenuStore();

  // Fetch categories
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  // Build query params for API
  const queryParams = useMemo(() => {
    const params = {
      limit: filters.limit,
      sort: filters.sort,
    };

    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    if (filters.minPrice > 0) params.minPrice = filters.minPrice;
    if (filters.maxPrice < 6000) params.maxPrice = filters.maxPrice;
    if (filters.flavorTags.length > 0)
      params.flavorTags = filters.flavorTags.join(",");

    return params;
  }, [filters]);

  // Fetch cakes with infinite scroll
  const {
    data: cakesData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteCakes(queryParams);

  // Flatten pages into single array
  const cakes = useMemo(() => {
    if (!cakesData?.pages) return [];
    return cakesData.pages.flatMap((page) => page.data || []);
  }, [cakesData]);

  // Total count
  const totalCount = cakesData?.pages?.[0]?.pagination?.totalItems || 0;

  // Collections list
  const collections = [
    { _id: null, name: "All Products", slug: null },
    ...categories,
  ];

  // Handlers
  const handleProductClick = (product) => {
    navigate(`/cake/${product.slug}`);
  };

  const handleAddToCart = async (product) => {
    const defaultWeight =
      product.weightOptions?.find((w) => w.isDefault) ||
      product.weightOptions?.[0];

    if (!defaultWeight) {
      navigate(`/cake/${product.slug}`);
      return;
    }

    const result = await addToCart(
      {
        cakeId: product._id,
        cake: product,
        quantity: 1,
        selectedWeight: defaultWeight,
      },
      isLoggedIn
    );

    if (result.success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(result.message || "Failed to add to cart");
    }
  };

  const handleWishlist = async (product) => {
    const result = await toggleWishlist(product._id, isLoggedIn);
    
    if (result.success) {
      // Show specific message based on the action returned
      if (result.action === 'added') {
        toast.success(`${product.name} added to wishlist!`);
      } else {
        toast.info(`${product.name} removed from wishlist.`);
      }
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Sort dropdown state
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="mx-5 sm:mx-10 lg:mx-20 py-6">
        {/* Top Row: Breadcrumb on left, Search & Sort on right */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-dark/40 hover:text-dark transition-colors"
            >
              Home
            </Link>
            <ChevronRight size={14} className="text-dark/30" />
            <span className="text-dark">Menu</span>
          </nav>

          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 lg:justify-end">
            <SearchBar value={filters.search} onChange={setSearch} />

            <div className="shrink-0">
              <SortDropdown
                currentSort={filters.sort}
                isOpen={isSortOpen}
                setIsOpen={setIsSortOpen}
                onSelect={setSort}
              />
            </div>
          </div>
        </div>

        {/* Results Count & Mobile Filter */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-dark/40">Showing {cakes.length} results</p>
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-dark/20 rounded-full text-sm text-dark/70 hover:border-dark/40 transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {/* Main Layout */}
        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-44 shrink-0">
            <FilterSidebar
              collections={collections}
              activeCategory={filters.category}
              onCategoryChange={setCategory}
              activeFlavors={filters.flavorTags}
              onFlavorToggle={toggleFlavorTag}
              priceRange={[filters.minPrice, filters.maxPrice]}
              onPriceChange={setPriceRange}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            <ProductGrid
              products={cakes}
              isLoading={isLoading}
              isFetching={isFetchingNextPage || (isLoading && cakes.length > 0)}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onWishlist={handleWishlist}
              wishlistChecker={isInWishlist} // Pass the checker here
            />

            <LoadMoreButton
              currentCount={cakes.length}
              totalCount={totalCount}
              isLoading={isFetchingNextPage}
              hasMore={hasNextPage}
              onLoadMore={handleLoadMore}
            />
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <>
        {/* Overlay */}
        <div
          className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
            isMobileFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileFilterOpen(false)}
        />

        {/* Drawer */}
        <aside
          className={`lg:hidden fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-white z-50 transform transition-transform duration-300 ease-out ${
            isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark/10">
            <h2 className="text-xl font-serif text-dark">Filters</h2>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="p-2 text-dark/60 hover:text-dark transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 overflow-y-auto h-[calc(100%-130px)]">
            <FilterSidebar
              collections={collections}
              activeCategory={filters.category}
              onCategoryChange={setCategory}
              activeFlavors={filters.flavorTags}
              onFlavorToggle={toggleFlavorTag}
              priceRange={[filters.minPrice, filters.maxPrice]}
              onPriceChange={setPriceRange}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
            />
          </div>

          {/* Apply Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-dark/10">
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-dark text-white rounded-full font-medium text-sm hover:bg-dark/90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </aside>
      </>
    </div>
  );
}