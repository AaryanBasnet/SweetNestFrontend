/**
 * Promotion API
 * All promotion-related API endpoints
 */

import api from '../api';

// Get active promotions (public)
export const getActivePromotionsApi = () => {
  return api.get('/promotions/active');
};

// Get all promotions (admin)
export const getAllPromotionsApi = (params = {}) => {
  return api.get('/promotions', { params });
};

// Get single promotion by ID (admin)
export const getPromotionByIdApi = (id) => {
  return api.get(`/promotions/${id}`);
};

// Create promotion (admin)
export const createPromotionApi = (formData) => {
  return api.post('/promotions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Update promotion (admin)
export const updatePromotionApi = (id, formData) => {
  return api.put(`/promotions/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Delete promotion (admin)
export const deletePromotionApi = (id) => {
  return api.delete(`/promotions/${id}`);
};
