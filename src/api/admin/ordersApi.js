/**
 * Orders API (Admin)
 * Admin order management endpoints
 * Standalone - only depends on axios instance
 */

import api from '../api';

// Get all orders with filters
export const getOrdersApi = (params = {}) => {
  return api.get('/admin/orders', { params });
};

// Get single order by ID
export const getOrderByIdApi = (id) => {
  return api.get(`/admin/orders/${id}`);
};

// Update order status
export const updateOrderStatusApi = (id, status) => {
  return api.put(`/admin/orders/${id}/status`, { status });
};

// Delete order
export const deleteOrderApi = (id) => {
  return api.delete(`/admin/orders/${id}`);
};

// Export orders report
export const exportOrdersApi = (params = {}) => {
  return api.get('/admin/orders/export', {
    params,
    responseType: 'blob',
  });
};
