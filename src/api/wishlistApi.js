/**
 * Wishlist API
 * API endpoints for wishlist management
 */

import api from './api';

// Get user's wishlist
export const getWishlistApi = () => {
  return api.get('/wishlist');
};

// Add item to wishlist
export const addToWishlistApi = (cakeId) => {
  return api.post('/wishlist', { cakeId });
};

// Remove item from wishlist
export const removeFromWishlistApi = (cakeId) => {
  return api.delete(`/wishlist/${cakeId}`);
};

// Sync wishlist (merge localStorage with server)
export const syncWishlistApi = (items) => {
  return api.post('/wishlist/sync', { items });
};

// Clear wishlist
export const clearWishlistApi = () => {
  return api.delete('/wishlist');
};

// Set reminder for wishlist item
export const setReminderApi = (cakeId, reminderData) => {
  return api.put(`/wishlist/${cakeId}/reminder`, reminderData);
};
