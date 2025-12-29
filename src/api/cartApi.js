/**
 * Cart API
 * API endpoints for shopping cart management
 */

import api from './api';

// Get user's cart
export const getCartApi = () => {
  return api.get('/cart');
};

// Add item to cart
export const addToCartApi = (data) => {
  return api.post('/cart', data);
};

// Update cart item quantity
export const updateCartItemApi = (itemId, quantity) => {
  return api.put(`/cart/${itemId}`, { quantity });
};

// Remove item from cart
export const removeFromCartApi = (itemId) => {
  return api.delete(`/cart/${itemId}`);
};

// Sync cart (merge localStorage with server)
export const syncCartApi = (items) => {
  return api.post('/cart/sync', { items });
};

// Clear cart
export const clearCartApi = () => {
  return api.delete('/cart');
};

// Update delivery type
export const updateDeliveryTypeApi = (deliveryType) => {
  return api.put('/cart/delivery', { deliveryType });
};

// Apply promo code
export const applyPromoCodeApi = (code) => {
  return api.post('/cart/promo', { code });
};

// Remove promo code
export const removePromoCodeApi = () => {
  return api.delete('/cart/promo');
};
