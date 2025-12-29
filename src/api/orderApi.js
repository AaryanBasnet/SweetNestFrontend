/**
 * Order API
 * Handles order-related API calls
 */

import api from './api';

// Create a new order
export const createOrderApi = (orderData) => api.post('/orders', orderData);

// Get user's orders
export const getMyOrdersApi = (params = {}) => api.get('/orders', { params });

// Get single order by ID
export const getOrderByIdApi = (orderId) => api.get(`/orders/${orderId}`);

// Get order by order number
export const getOrderByNumberApi = (orderNumber) => api.get(`/orders/number/${orderNumber}`);

// Cancel order
export const cancelOrderApi = (orderId, reason) =>
  api.put(`/orders/${orderId}/cancel`, { reason });

// eSewa Payment APIs
export const initiateEsewaPaymentApi = (orderId) =>
  api.post('/esewa/initiate', { orderId });

export const checkPaymentStatusApi = (orderId) =>
  api.get(`/esewa/status/${orderId}`);

// Admin APIs
export const getAllOrdersApi = (params = {}) =>
  api.get('/orders/admin/all', { params });

export const getOrderStatsApi = () => api.get('/orders/admin/stats');

export const updateOrderStatusApi = (orderId, status, notes = '') =>
  api.put(`/orders/${orderId}/status`, { status, notes });
