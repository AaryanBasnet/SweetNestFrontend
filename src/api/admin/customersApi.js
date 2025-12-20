/**
 * Customers API (Admin)
 * Admin customer management endpoints
 * Standalone - only depends on axios instance
 */

import api from '../api';

// Get all customers with filters
export const getCustomersApi = (params = {}) => {
  return api.get('/admin/customers', { params });
};

// Get single customer by ID
export const getCustomerByIdApi = (id) => {
  return api.get(`/admin/customers/${id}`);
};

// Get customer orders
export const getCustomerOrdersApi = (id, params = {}) => {
  return api.get(`/admin/customers/${id}/orders`, { params });
};

// Update customer
export const updateCustomerApi = (id, data) => {
  return api.put(`/admin/customers/${id}`, data);
};

// Delete customer
export const deleteCustomerApi = (id) => {
  return api.delete(`/admin/customers/${id}`);
};
