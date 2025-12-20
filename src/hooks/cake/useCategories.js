/**
 * useCategories Hook
 * React Query hook for fetching categories
 * Standalone - depends only on React Query and category service
 */

import { useQuery } from '@tanstack/react-query';
import * as categoryService from '../../services/cake/categoryService';

// Query keys for cache management
export const categoryKeys = {
  all: ['categories'],
  lists: () => [...categoryKeys.all, 'list'],
  list: (filters) => [...categoryKeys.lists(), filters],
  details: () => [...categoryKeys.all, 'detail'],
  detail: (slug) => [...categoryKeys.details(), slug],
};

/**
 * Hook to fetch all categories
 */
export const useCategories = (activeOnly = true, options = {}) => {
  return useQuery({
    queryKey: categoryKeys.list({ activeOnly }),
    queryFn: () => categoryService.fetchCategories(activeOnly),
    staleTime: 1000 * 60 * 30, // 30 minutes (categories rarely change)
    ...options,
  });
};

/**
 * Hook to fetch single category by slug
 */
export const useCategoryBySlug = (slug, options = {}) => {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => categoryService.fetchCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
};
