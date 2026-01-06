/**
 * Address API
 * All address-related API endpoints
 * Standalone - only depends on axios instance
 */

import api from '../api';

// Get all addresses for current user
export const getAddressesApi = () => {
  return api.get('/addresses');
};

// Get single address by ID
export const getAddressApi = (addressId) => {
  return api.get(`/addresses/${addressId}`);
};

// Create new address
export const createAddressApi = (addressData) => {
  return api.post('/addresses', addressData);
};

// Update existing address
export const updateAddressApi = (addressId, addressData) => {
  return api.put(`/addresses/${addressId}`, addressData);
};

// Delete address
export const deleteAddressApi = (addressId) => {
  return api.delete(`/addresses/${addressId}`);
};

// Set address as default
export const setDefaultAddressApi = (addressId) => {
  return api.patch(`/addresses/${addressId}/default`);
};
