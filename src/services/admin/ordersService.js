/**
 * Orders Service (Admin)
 * Business logic for order management
 */

import * as ordersApi from '../../api/admin/ordersApi';

/**
 * Fetch orders with filters
 */
export const fetchOrders = async (filters = {}) => {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.search) params.search = filters.search;

  const response = await ordersApi.getOrdersApi(params);
  return response.data;
};

/**
 * Fetch single order
 */
export const fetchOrderById = async (id) => {
  const response = await ordersApi.getOrderByIdApi(id);
  return response.data;
};

/**
 * Update order status
 */
export const updateOrderStatus = async (id, status) => {
  const response = await ordersApi.updateOrderStatusApi(id, status);
  return response.data;
};

/**
 * Delete order
 */
export const deleteOrder = async (id) => {
  const response = await ordersApi.deleteOrderApi(id);
  return response.data;
};

/**
 * Export orders report
 */
export const exportOrders = async (filters = {}) => {
  const response = await ordersApi.exportOrdersApi(filters);
  return response.data;
};

// Order status options
export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'amber' },
  { value: 'processing', label: 'Processing', color: 'blue' },
  { value: 'shipped', label: 'Shipped', color: 'purple' },
  { value: 'delivered', label: 'Delivered', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
];

export const getStatusColor = (status) => {
  const statusObj = ORDER_STATUSES.find((s) => s.value === status);
  return statusObj?.color || 'gray';
};
