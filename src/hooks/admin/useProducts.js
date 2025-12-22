/**
 * useProducts Hook (Admin)
 * React Query hooks for product management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as productsService from '../../services/admin/productsService';
import { cakeKeys } from '../cake/useCakes';

// Query keys
export const productKeys = {
  all: ['admin', 'products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), filters],
  details: () => [...productKeys.all, 'detail'],
  detail: (id) => [...productKeys.details(), id],
};

/**
 * Hook to fetch products (admin view)
 */
export const useAdminProducts = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsService.fetchProducts(filters),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

/**
 * Hook to create product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => productsService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: cakeKeys.all });
    },
  });
};

/**
 * Hook to update product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => productsService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: cakeKeys.all });
    },
  });
};

/**
 * Hook to delete product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => productsService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: cakeKeys.all });
    },
  });
};

/**
 * Hook to toggle product status
 */
export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => productsService.toggleProductStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: cakeKeys.all });
    },
  });
};
