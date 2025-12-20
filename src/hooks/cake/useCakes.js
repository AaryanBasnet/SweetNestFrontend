/**
 * useCakes Hook
 * React Query hook for fetching cakes
 * Standalone - depends only on React Query and cake service
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import * as cakeService from '../../services/cake/cakeService';

// Query keys for cache management
export const cakeKeys = {
  all: ['cakes'],
  lists: () => [...cakeKeys.all, 'list'],
  list: (filters) => [...cakeKeys.lists(), filters],
  featured: () => [...cakeKeys.all, 'featured'],
  details: () => [...cakeKeys.all, 'detail'],
  detail: (slug) => [...cakeKeys.details(), slug],
};

/**
 * Hook to fetch cakes with filters
 */
export const useCakes = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: cakeKeys.list(filters),
    queryFn: () => cakeService.fetchCakes(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/**
 * Hook to fetch cakes with infinite scroll
 */
export const useInfiniteCakes = (filters = {}, options = {}) => {
  return useInfiniteQuery({
    queryKey: cakeKeys.list({ ...filters, infinite: true }),
    queryFn: ({ pageParam = 1 }) =>
      cakeService.fetchCakes({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.hasNextPage) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

/**
 * Hook to fetch featured cakes
 */
export const useFeaturedCakes = (limit = 8, options = {}) => {
  return useQuery({
    queryKey: cakeKeys.featured(),
    queryFn: () => cakeService.fetchFeaturedCakes(limit),
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
};

/**
 * Hook to fetch single cake by slug
 */
export const useCakeBySlug = (slug, options = {}) => {
  return useQuery({
    queryKey: cakeKeys.detail(slug),
    queryFn: () => cakeService.fetchCakeBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};
