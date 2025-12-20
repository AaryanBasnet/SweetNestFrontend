/**
 * Menu Page
 * Main page for browsing cakes
 * Composes atomic components with loose coupling
 */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SlidersHorizontal } from 'lucide-react';

// Hooks
import { useInfiniteCakes, useCategories } from '../hooks/cake';

// Store
import useMenuStore, { SORT_OPTIONS, FLAVOR_TAGS } from '../stores/menuStore';

// Components
import {
  SearchBar,
  SortDropdown,
  FilterSidebar,
  ProductGrid,
  LoadMoreButton,
} from '../components/menu';

export default function Menu() {
  const navigate = useNavigate();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Store state and actions
  const {
    filters,
    setCategory,
    setSearch,
    setSort,
    setPriceRange,
    toggleFlavorTag,
    resetFilters,
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
    if (filters.minPrice > 500) params.minPrice = filters.minPrice;
    if (filters.maxPrice < 6000) params.maxPrice = filters.maxPrice;

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

  // Total count from last page
  const totalCount = cakesData?.pages?.[0]?.pagination?.totalItems || 0;

  // Handlers
  const handleProductClick = (product) => {
    navigate(`/cake/${product.slug}`);
  };

  const handleAddToCart = (product) => {
    // TODO: Implement cart functionality
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (product) => {
    // TODO: Implement wishlist functionality
    toast.info(`${product.name} added to wishlist!`);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

  // Reset filters on unmount (optional)
  useEffect(() => {
    return () => {
      // Uncomment to reset on page leave
      // resetFilters();
    };
  }, []);

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#FDFCF8]">
      {/* Header: Search & Sort */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        {/* Search Bar - Full width on mobile */}
        <div className="w-full">
          <SearchBar
            value={filters.search}
            onChange={setSearch}
            placeholder="Search flavor, name..."
          />
        </div>

        {/* Filter button, results count, and sort */}
        <div className="flex items-center justify-between gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-dark text-white rounded-full text-sm font-medium"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <span className="text-xs sm:text-sm text-dark/50 hidden sm:inline">
              Showing {cakes.length} results
            </span>
            <span className="text-xs text-dark/50 sm:hidden">
              {cakes.length} items
            </span>
            <SortDropdown
              value={filters.sort}
              options={SORT_OPTIONS}
              onChange={setSort}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 lg:gap-10">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block">
          <FilterSidebar
            categories={categories}
            selectedCategory={filters.category}
            onCategoryChange={setCategory}
            flavorTags={FLAVOR_TAGS}
            selectedFlavors={filters.flavorTags}
            onFlavorToggle={toggleFlavorTag}
            priceRange={[filters.minPrice, filters.maxPrice]}
            onPriceChange={setPriceRange}
          />
        </div>

        {/* Mobile Filter Drawer */}
        <FilterSidebar
          categories={categories}
          selectedCategory={filters.category}
          onCategoryChange={setCategory}
          flavorTags={FLAVOR_TAGS}
          selectedFlavors={filters.flavorTags}
          onFlavorToggle={toggleFlavorTag}
          priceRange={[filters.minPrice, filters.maxPrice]}
          onPriceChange={setPriceRange}
          isMobile={true}
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          onReset={resetFilters}
        />

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <ProductGrid
            products={cakes}
            isLoading={isLoading}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onWishlist={handleWishlist}
          />

          {/* Load More */}
          <LoadMoreButton
            currentCount={cakes.length}
            totalCount={totalCount}
            isLoading={isFetchingNextPage}
            hasMore={hasNextPage}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </div>
  );
}
