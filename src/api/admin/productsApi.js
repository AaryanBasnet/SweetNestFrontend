/**
 * Products API (Admin)
 * Admin product management endpoints
 * Standalone - only depends on axios instance
 */

import api from '../api';

// Get all products with filters (admin view)
export const getProductsApi = (params = {}) => {
  return api.get('/cakes', { params: { ...params, active: 'all' } });
};

// Create product
export const createProductApi = (formData) => {
  return api.post('/cakes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Update product
export const updateProductApi = (id, formData) => {
  return api.put(`/cakes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Delete product
export const deleteProductApi = (id) => {
  return api.delete(`/cakes/${id}`);
};

// Toggle product active status
export const toggleProductStatusApi = (id, isActive) => {
  return api.put(`/cakes/${id}`, { isActive });
};
