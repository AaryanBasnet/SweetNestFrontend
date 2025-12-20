/**
 * Dashboard API
 * Admin dashboard statistics endpoints
 * Standalone - only depends on axios instance
 */

import api from '../api';

// Get dashboard statistics
export const getDashboardStatsApi = () => {
  return api.get('/admin/dashboard/stats');
};

// Get revenue data for chart
export const getRevenueChartApi = (days = 7) => {
  return api.get('/admin/dashboard/revenue', { params: { days } });
};

// Get top selling products
export const getTopSellingProductsApi = (limit = 4) => {
  return api.get('/admin/dashboard/top-products', { params: { limit } });
};

// Get recent orders
export const getRecentOrdersApi = (limit = 5) => {
  return api.get('/admin/dashboard/recent-orders', { params: { limit } });
};
