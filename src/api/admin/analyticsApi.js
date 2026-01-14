/**
 * Analytics API
 * Admin analytics and reporting endpoints
 */

import api from '../api';

/**
 * Get overview analytics
 * @param {Object} params - Query parameters (startDate, endDate)
 * @returns {Promise}
 */
export const getOverviewAnalyticsApi = (params = {}) => {
  return api.get('/analytics/overview', { params });
};

/**
 * Get revenue trends
 * @param {Object} params - Query parameters (period, limit)
 * @returns {Promise}
 */
export const getRevenueTrendsApi = (params = {}) => {
  return api.get('/analytics/revenue-trends', { params });
};

/**
 * Get top selling products
 * @param {Object} params - Query parameters (limit, startDate, endDate)
 * @returns {Promise}
 */
export const getTopProductsApi = (params = {}) => {
  return api.get('/analytics/top-products', { params });
};

/**
 * Get category performance
 * @param {Object} params - Query parameters (startDate, endDate)
 * @returns {Promise}
 */
export const getCategoryPerformanceApi = (params = {}) => {
  return api.get('/analytics/categories', { params });
};

/**
 * Get customer analytics
 * @returns {Promise}
 */
export const getCustomerAnalyticsApi = () => {
  return api.get('/analytics/customers');
};

/**
 * Get time-based trends
 * @returns {Promise}
 */
export const getTimeTrendsApi = () => {
  return api.get('/analytics/time-trends');
};

/**
 * Get order status breakdown
 * @returns {Promise}
 */
export const getOrderStatusBreakdownApi = () => {
  return api.get('/analytics/order-status');
};

/**
 * Get recent activity
 * @param {Object} params - Query parameters (limit)
 * @returns {Promise}
 */
export const getRecentActivityApi = (params = {}) => {
  return api.get('/analytics/recent-activity', { params });
};
