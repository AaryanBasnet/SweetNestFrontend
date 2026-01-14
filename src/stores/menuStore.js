/**
 * Menu Store
 * Zustand store for menu page filters and state
 * Standalone - no dependencies on other stores
 */

import { create } from 'zustand';

// Sort options
export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Featured' },
  { value: 'basePrice', label: 'Price: Low to High' },
  { value: '-basePrice', label: 'Price: High to Low' },
  { value: '-ratingsAverage', label: 'Top Rated' },
  { value: 'name', label: 'Name: A to Z' },
];

// Flavor tags (for UI filtering)
export const FLAVOR_TAGS = [
  'Chocolate',
  'Vanilla',
  'Fruit',
  'Nut',
  'Spiced',
  'Coffee',
];

// Default filter state
const defaultFilters = {
  category: null,
  search: '',
  sort: '-createdAt',
  minPrice: 0,
  maxPrice: 6000,
  flavorTags: [],
  page: 1,
  limit: 6,
};

const useMenuStore = create((set, get) => ({
  // Filter state
  filters: { ...defaultFilters },

  // UI state
  isFilterOpen: false,

  // Actions
  setCategory: (category) =>
    set((state) => ({
      filters: { ...state.filters, category, page: 1 },
    })),

  setSearch: (search) =>
    set((state) => ({
      filters: { ...state.filters, search, page: 1 },
    })),

  setSort: (sort) =>
    set((state) => ({
      filters: { ...state.filters, sort, page: 1 },
    })),

  setPriceRange: (minPrice, maxPrice) =>
    set((state) => ({
      filters: { ...state.filters, minPrice, maxPrice, page: 1 },
    })),

  toggleFlavorTag: (tag) =>
    set((state) => {
      const current = state.filters.flavorTags;
      const updated = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      return {
        filters: { ...state.filters, flavorTags: updated, page: 1 },
      };
    }),

  setPage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page },
    })),

  nextPage: () =>
    set((state) => ({
      filters: { ...state.filters, page: state.filters.page + 1 },
    })),

  resetFilters: () =>
    set({
      filters: { ...defaultFilters },
    }),

  toggleFilterSidebar: () =>
    set((state) => ({
      isFilterOpen: !state.isFilterOpen,
    })),

  // Computed: Get active filter count
  getActiveFilterCount: () => {
    const { filters } = get();
    let count = 0;
    if (filters.category) count++;
    if (filters.search) count++;
    if (filters.flavorTags.length > 0) count += filters.flavorTags.length;
    if (filters.minPrice !== defaultFilters.minPrice) count++;
    if (filters.maxPrice !== defaultFilters.maxPrice) count++;
    return count;
  },
}));

export default useMenuStore;
