/**
 * Cake API
 * All cake-related API endpoints
 * Standalone - only depends on axios instance
 */

import api from '../api';

// Get all cakes with filters
export const getCakesApi = (params = {}) => {
  return api.get('/cakes', { params });
};

// Get featured cakes
export const getFeaturedCakesApi = (limit = 8) => {
  return api.get('/cakes/featured', { params: { limit } });
};

// Get cakes by category slug
export const getCakesByCategoryApi = (categorySlug, params = {}) => {
  return api.get(`/cakes/category/${categorySlug}`, { params });
};

// Get single cake by slug
export const getCakeBySlugApi = (slug) => {
  return api.get(`/cakes/${slug}`);
};

// Get single cake by ID
export const getCakeByIdApi = (id) => {
  return api.get(`/cakes/id/${id}`);
};

// Get reviews for a cake
export const getCakeReviewsApi = (cakeId, params = {}) => {
  return api.get(`/cakes/${cakeId}/reviews`, { params });
};

// Create a review (requires auth)
export const createReviewApi = (cakeId, reviewData) => {
  return api.post(`/cakes/${cakeId}/reviews`, reviewData);
};
