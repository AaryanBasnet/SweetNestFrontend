/**
 * Orders API (Admin)
 * Admin order management endpoints
 * Standalone - only depends on axios instance
 */
import api from '../api';

// Get all orders with filters
export const getOrdersApi = (params = {}) => {
  return api.get('/orders/admin/all', { params }); // ✅ matches backend
};
// Get single order by ID
export const getOrderByIdApi = (id) => {
  return api.get(`/orders/${id}`);
};

// Update order status
export const updateOrderStatusApi = (id, status) => {
  return api.put(`/orders/${id}/status`, { status });
};

// Process refund for an order
export const processRefundApi = (id, refundData = {}) => {
  return api.put(`/orders/${id}/refund`, refundData);
};

// Delete order (needs backend implementation)
export const deleteOrderApi = (id) => {
  return api.delete(`/orders/${id}`);
};

// Export orders report (needs backend implementation)
export const exportOrdersApi = (params = {}) => {
  return api.get('/orders/admin/export', {
    params,
    responseType: 'blob',
  });
};
