/**
 * useOrders Hook (Admin)
 * React Query hooks for order management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ordersService from '../../services/admin/ordersService';

// Query keys
export const orderKeys = {
  all: ['admin', 'orders'],
  lists: () => [...orderKeys.all, 'list'],
  list: (filters) => [...orderKeys.lists(), filters],
  details: () => [...orderKeys.all, 'detail'],
  detail: (id) => [...orderKeys.details(), id],
};

/**
 * Hook to fetch orders with filters
 */
export const useOrders = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => ordersService.fetchOrders(filters),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

/**
 * Hook to fetch single order
 */
export const useOrderById = (id, options = {}) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersService.fetchOrderById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to update order status
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => ordersService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

/**
 * Hook to delete order
 */
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => ordersService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};
