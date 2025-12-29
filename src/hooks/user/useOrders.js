/**
 * useOrders Hook
 * Custom hook for managing user orders
 */

import { useState, useEffect, useCallback } from 'react';
import { getMyOrdersApi } from '../../api/orderApi';

/**
 * Hook to fetch and manage user orders
 * @returns {Object} Orders state and methods
 */
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch orders from API
   */
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMyOrdersApi();
      if (response.data?.data) {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refetch orders
   */
  const refetch = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Fetch on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Derived state
  const ordersCount = orders.length;
  const recentOrders = orders.slice(0, 3);
  const pendingOrders = orders.filter(
    (order) => !['delivered', 'cancelled'].includes(order.orderStatus)
  );

  return {
    orders,
    recentOrders,
    pendingOrders,
    ordersCount,
    isLoading,
    error,
    refetch,
  };
};

export default useOrders;

