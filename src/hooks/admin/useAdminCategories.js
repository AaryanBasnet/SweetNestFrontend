/**
 * useAdminCategories Hook
 * React Query hooks for admin category management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as categoriesService from '../../services/admin/categoriesService';
import { categoryKeys } from '../cake/useCategories';

// Query keys for admin categories
export const adminCategoryKeys = {
  all: ['admin', 'categories'],
  list: () => [...adminCategoryKeys.all, 'list'],
};

/**
 * Hook to fetch all categories (admin view)
 */
export const useAdminCategories = (options = {}) => {
  return useQuery({
    queryKey: adminCategoryKeys.list(),
    queryFn: () => categoriesService.fetchCategories(),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

/**
 * Hook to create category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => categoriesService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

/**
 * Hook to update category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => categoriesService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

/**
 * Hook to delete category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};
