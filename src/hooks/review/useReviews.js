/**
 * useReviews Hook
 * React Query hooks for review operations
 * Standalone - depends only on React Query and review service
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reviewService from '../../services/review/reviewService';

// Query keys for cache management
export const reviewKeys = {
  all: ['reviews'],
  cake: (cakeId) => [...reviewKeys.all, 'cake', cakeId],
  cakePaginated: (cakeId, page) => [...reviewKeys.cake(cakeId), 'page', page],
};

/**
 * Hook to fetch reviews for a cake with pagination
 * @param {string} cakeId - Cake ID
 * @param {number} page - Page number (default: 1)
 * @param {Object} options - React Query options
 */
export const useCakeReviews = (cakeId, page = 1, options = {}) => {
  return useQuery({
    queryKey: reviewKeys.cakePaginated(cakeId, page),
    queryFn: () => reviewService.fetchCakeReviews(cakeId, page, 6),
    enabled: !!cakeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/**
 * Hook to create a new review
 * @param {string} cakeId - Cake ID
 */
export const useCreateReview = (cakeId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData) => reviewService.submitReview(cakeId, reviewData),
    onSuccess: () => {
      // Invalidate all pages of reviews for this cake
      queryClient.invalidateQueries({ queryKey: reviewKeys.cake(cakeId) });
      // Invalidate cake detail to update rating display
      queryClient.invalidateQueries({ queryKey: ['cakes', 'detail'] });
    },
  });
};

/**
 * Hook to update an existing review
 * @param {string} cakeId - Cake ID
 */
export const useUpdateReview = (cakeId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reviewData }) =>
      reviewService.updateReview(reviewId, reviewData),
    onMutate: async ({ reviewId, reviewData }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: reviewKeys.cake(cakeId) });

      // Snapshot the previous value
      const previousReviews = queryClient.getQueriesData({
        queryKey: reviewKeys.cake(cakeId),
      });

      // Optimistically update to the new value
      queryClient.setQueriesData(
        { queryKey: reviewKeys.cake(cakeId) },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((r) =>
              r._id === reviewId ? { ...r, ...reviewData } : r
            ),
          };
        }
      );

      // Return context with snapshot
      return { previousReviews };
    },
    onError: (err, variables, context) => {
      // Rollback to previous value on error
      if (context?.previousReviews) {
        context.previousReviews.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: reviewKeys.cake(cakeId) });
      queryClient.invalidateQueries({ queryKey: ['cakes', 'detail'] });
    },
  });
};

/**
 * Hook to delete a review
 * @param {string} cakeId - Cake ID
 */
export const useDeleteReview = (cakeId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => reviewService.deleteReview(reviewId),
    onMutate: async (reviewId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: reviewKeys.cake(cakeId) });

      // Snapshot the previous value
      const previousReviews = queryClient.getQueriesData({
        queryKey: reviewKeys.cake(cakeId),
      });

      // Optimistically remove from cache
      queryClient.setQueriesData(
        { queryKey: reviewKeys.cake(cakeId) },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((r) => r._id !== reviewId),
          };
        }
      );

      // Return context with snapshot
      return { previousReviews };
    },
    onError: (err, variables, context) => {
      // Rollback to previous value on error
      if (context?.previousReviews) {
        context.previousReviews.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: reviewKeys.cake(cakeId) });
      queryClient.invalidateQueries({ queryKey: ['cakes', 'detail'] });
    },
  });
};

/**
 * Hook to mark a review as helpful
 */
export const useMarkHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => reviewService.markHelpful(reviewId),
    onSuccess: (data, reviewId) => {
      // Update cache for all affected queries
      queryClient.setQueriesData({ queryKey: reviewKeys.all }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((r) =>
            r._id === reviewId ? { ...r, helpfulCount: data.helpfulCount } : r
          ),
        };
      });
    },
  });
};
