/**
 * Categories API (Admin)
 * Admin category management endpoints
 */

import api from '../api';

// Get all categories (admin view - includes inactive)
export const getCategoriesApi = (params = {}) => {
  return api.get('/categories', { params });
};

// Create category
export const createCategoryApi = (formData) => {
  return api.post('/categories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Update category
export const updateCategoryApi = (id, formData) => {
  return api.put(`/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Delete category
export const deleteCategoryApi = (id) => {
  return api.delete(`/categories/${id}`);
};
