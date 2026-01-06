/**
 * Products API (Admin)
 * Admin product management endpoints
 */

import api from '../api';

// Get all products with filters (admin view)
export const getProductsApi = (params = {}) => {
  return api.get('/cakes', { params: { ...params, active: 'all' } });
};

// Create product
export const createProductApi = (formData) => {
  // ✅ FIX: Let axios set the Content-Type automatically
  return api.post('/cakes', formData);
};

// Update product
export const updateProductApi = (id, formData) => {
  // ✅ FIX: Let axios set the Content-Type automatically
  return api.put(`/cakes/${id}`, formData);
};

// Delete product
export const deleteProductApi = (id) => {
  return api.delete(`/cakes/${id}`);
};

// Toggle product active status
export const toggleProductStatusApi = (id, isActive) => {
  return api.put(`/cakes/${id}`, { isActive });
};