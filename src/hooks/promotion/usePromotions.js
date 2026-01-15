/**
 * usePromotions Hook
 * React Query hook for fetching promotions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as promotionService from '../../services/promotion/promotionService';

// Query keys for cache management
export const promotionKeys = {
  all: ['promotions'],
  active: () => [...promotionKeys.all, 'active'],
  lists: () => [...promotionKeys.all, 'list'],
  list: (filters) => [...promotionKeys.lists(), filters],
  details: () => [...promotionKeys.all, 'detail'],
  detail: (id) => [...promotionKeys.details(), id],
};

/**
 * Hook to fetch active promotions (public)
 */
export const useActivePromotions = (options = {}) => {
  return useQuery({
    queryKey: promotionKeys.active(),
    queryFn: promotionService.fetchActivePromotions,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/**
 * Hook to fetch all promotions (admin)
 */
export const usePromotions = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: promotionKeys.list(filters),
    queryFn: () => promotionService.fetchAllPromotions(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
};

/**
 * Hook to fetch single promotion by ID (admin)
 */
export const usePromotionById = (id, options = {}) => {
  return useQuery({
    queryKey: promotionKeys.detail(id),
    queryFn: () => promotionService.fetchPromotionById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

/**
 * Hook to create promotion (admin)
 */
export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: promotionService.createPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.all });
    },
  });
};

/**
 * Hook to update promotion (admin)
 */
export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => promotionService.updatePromotion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.all });
    },
  });
};

/**
 * Hook to delete promotion (admin)
 */
export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: promotionService.deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.all });
    },
  });
};
