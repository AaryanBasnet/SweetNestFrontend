/**
 * Analytics React Query Hooks
 * Data fetching hooks for analytics dashboard
 */

import { useQuery } from '@tanstack/react-query';
import {
  getOverviewAnalyticsApi,
  getRevenueTrendsApi,
  getTopProductsApi,
  getCategoryPerformanceApi,
  getCustomerAnalyticsApi,
  getTimeTrendsApi,
  getOrderStatusBreakdownApi,
  getRecentActivityApi,
} from '../../api/admin/analyticsApi';

// Query keys
const ANALYTICS_KEYS = {
  all: ['analytics'],
  overview: (params) => [...ANALYTICS_KEYS.all, 'overview', params],
  revenueTrends: (params) => [...ANALYTICS_KEYS.all, 'revenue-trends', params],
  topProducts: (params) => [...ANALYTICS_KEYS.all, 'top-products', params],
  categories: (params) => [...ANALYTICS_KEYS.all, 'categories', params],
  customers: () => [...ANALYTICS_KEYS.all, 'customers'],
  timeTrends: () => [...ANALYTICS_KEYS.all, 'time-trends'],
  orderStatus: () => [...ANALYTICS_KEYS.all, 'order-status'],
  recentActivity: (params) => [...ANALYTICS_KEYS.all, 'recent-activity', params],
};

/**
 * Fetch overview analytics
 */
export const useOverviewAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.overview(params),
    queryFn: async () => {
      const response = await getOverviewAnalyticsApi(params);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Fetch revenue trends
 */
export const useRevenueTrends = (params = {}) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.revenueTrends(params),
    queryFn: async () => {
      const response = await getRevenueTrendsApi(params);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Fetch top selling products
 */
export const useTopProducts = (params = {}) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.topProducts(params),
    queryFn: async () => {
      const response = await getTopProductsApi(params);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Fetch category performance
 */
export const useCategoryPerformance = (params = {}) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.categories(params),
    queryFn: async () => {
      const response = await getCategoryPerformanceApi(params);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Fetch customer analytics
 */
export const useCustomerAnalytics = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.customers(),
    queryFn: async () => {
      const response = await getCustomerAnalyticsApi();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Fetch time-based trends
 */
export const useTimeTrends = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.timeTrends(),
    queryFn: async () => {
      const response = await getTimeTrendsApi();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Fetch order status breakdown
 */
export const useOrderStatusBreakdown = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.orderStatus(),
    queryFn: async () => {
      const response = await getOrderStatusBreakdownApi();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Fetch recent activity
 */
export const useRecentActivity = (params = {}) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.recentActivity(params),
    queryFn: async () => {
      const response = await getRecentActivityApi(params);
      return response.data.data;
    },
    staleTime: 1000 * 30, // 30 seconds (more frequent for recent data)
  });
};
