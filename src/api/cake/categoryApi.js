/**
 * Category API
 * All category-related API endpoints
 * Standalone - only depends on axios instance
 */

import api from '../api';

// Get all categories
export const getCategoriesApi = (params = {}) => {
  return api.get('/categories', { params });
};

// Get single category by slug
export const getCategoryBySlugApi = (slug) => {
  return api.get(`/categories/${slug}`);
};
