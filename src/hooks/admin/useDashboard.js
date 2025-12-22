/**
 * useDashboard Hook
 * React Query hooks for admin dashboard
 */

import { useQuery } from '@tanstack/react-query';
import * as dashboardService from '../../services/admin/dashboardService';

// Query keys
export const dashboardKeys = {
  all: ['admin', 'dashboard'],
  stats: () => [...dashboardKeys.all, 'stats'],
  revenue: (days) => [...dashboardKeys.all, 'revenue', days],
  topProducts: () => [...dashboardKeys.all, 'top-products'],
  recentOrders: () => [...dashboardKeys.all, 'recent-orders'],
};

/**
 * Hook to fetch dashboard stats
 */
export const useDashboardStats = (options = {}) => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardService.fetchDashboardStats,
    staleTime: 1000 * 60 * 2, // 2 minutes
    // Use mock data in development
    placeholderData: { data: dashboardService.getMockDashboardStats() },
    ...options,
  });
};

/**
 * Hook to fetch revenue chart data
 */
export const useRevenueChart = (days = 7, options = {}) => {
  return useQuery({
    queryKey: dashboardKeys.revenue(days),
    queryFn: () => dashboardService.fetchRevenueChart(days),
    staleTime: 1000 * 60 * 5,
    placeholderData: { data: dashboardService.getMockRevenueData() },
    ...options,
  });
};

/**
 * Hook to fetch top selling products
 */
export const useTopSellingProducts = (limit = 4, options = {}) => {
  return useQuery({
    queryKey: dashboardKeys.topProducts(),
    queryFn: () => dashboardService.fetchTopSellingProducts(limit),
    staleTime: 1000 * 60 * 5,
    placeholderData: { data: dashboardService.getMockTopProducts() },
    ...options,
  });
};

/**
 * Hook to fetch recent orders
 */
export const useRecentOrders = (limit = 5, options = {}) => {
  return useQuery({
    queryKey: dashboardKeys.recentOrders(),
    queryFn: () => dashboardService.fetchRecentOrders(limit),
    staleTime: 1000 * 60 * 2,
    placeholderData: { data: dashboardService.getMockRecentOrders() },
    ...options,
  });
};
