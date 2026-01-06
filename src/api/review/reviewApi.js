/**
 * Review API
 * All review-related API endpoints
 * Standalone - only depends on axios instance
 */

import api from '../api';

// Get reviews for a cake (already exists in cakeApi, but included for completeness)
export const getCakeReviewsApi = (cakeId, params = {}) => {
  return api.get(`/cakes/${cakeId}/reviews`, { params });
};

// Create a review (requires auth - already exists in cakeApi)
export const createReviewApi = (cakeId, reviewData) => {
  return api.post(`/cakes/${cakeId}/reviews`, reviewData);
};

// Update a review (requires auth and ownership)
export const updateReviewApi = (reviewId, reviewData) => {
  return api.put(`/reviews/${reviewId}`, reviewData);
};

// Delete a review (requires auth and ownership)
export const deleteReviewApi = (reviewId) => {
  return api.delete(`/reviews/${reviewId}`);
};

// Mark review as helpful (public)
export const markReviewHelpfulApi = (reviewId) => {
  return api.post(`/reviews/${reviewId}/helpful`);
};
