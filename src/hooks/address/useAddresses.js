/**
 * useAddresses Hook
 * React Query hooks for address operations
 * Standalone - depends only on React Query and address service
 * Pattern: Follows useReviews.js implementation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as addressService from '../../services/address/addressService';

// Query keys for cache management
export const addressKeys = {
  all: ['addresses'],
  lists: () => [...addressKeys.all, 'list'],
  list: () => [...addressKeys.lists()],
  details: () => [...addressKeys.all, 'detail'],
  detail: (id) => [...addressKeys.details(), id],
};

/**
 * Hook to fetch all addresses
 * @param {Object} options - React Query options
 */
export const useAddresses = (options = {}) => {
  return useQuery({
    queryKey: addressKeys.list(),
    queryFn: addressService.fetchAddresses,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/**
 * Hook to fetch single address
 * @param {string} addressId - Address ID
 * @param {Object} options - React Query options
 */
export const useAddress = (addressId, options = {}) => {
  return useQuery({
    queryKey: addressKeys.detail(addressId),
    queryFn: () => addressService.fetchAddress(addressId),
    enabled: !!addressId,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

/**
 * Hook to create new address
 */
export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressService.createAddress,
    onSuccess: () => {
      // Invalidate list query to refetch addresses
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
    },
  });
};

/**
 * Hook to update existing address
 */
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ addressId, addressData }) =>
      addressService.updateAddress(addressId, addressData),
    onMutate: async ({ addressId, addressData }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: addressKeys.list() });
      const previousAddresses = queryClient.getQueryData(addressKeys.list());

      queryClient.setQueryData(addressKeys.list(), (old) => {
        if (!old) return old;
        return old.map((addr) =>
          addr._id === addressId ? { ...addr, ...addressData } : addr
        );
      });

      return { previousAddresses };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousAddresses) {
        queryClient.setQueryData(addressKeys.list(), context.previousAddresses);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
    },
  });
};

/**
 * Hook to delete address
 */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressService.deleteAddress,
    onMutate: async (addressId) => {
      // Optimistic delete
      await queryClient.cancelQueries({ queryKey: addressKeys.list() });
      const previousAddresses = queryClient.getQueryData(addressKeys.list());

      queryClient.setQueryData(addressKeys.list(), (old) => {
        if (!old) return old;
        return old.filter((addr) => addr._id !== addressId);
      });

      return { previousAddresses };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousAddresses) {
        queryClient.setQueryData(addressKeys.list(), context.previousAddresses);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
    },
  });
};

/**
 * Hook to set address as default
 */
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressService.setDefaultAddress,
    onMutate: async (addressId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: addressKeys.list() });
      const previousAddresses = queryClient.getQueryData(addressKeys.list());

      queryClient.setQueryData(addressKeys.list(), (old) => {
        if (!old) return old;
        return old.map((addr) => ({
          ...addr,
          isDefault: addr._id === addressId,
        }));
      });

      return { previousAddresses };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousAddresses) {
        queryClient.setQueryData(addressKeys.list(), context.previousAddresses);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
    },
  });
};
