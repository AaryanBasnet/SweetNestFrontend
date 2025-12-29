/**
 * Customers API (Admin)
 * Admin customer management endpoints
 * Standalone - only depends on axios instance
 */
import api from '../api';

// Get all customers (users with role=user)
export const getCustomersApi = (params = {}) => {
  return api.get('/users/customers', { params });
};
