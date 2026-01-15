/**
 * Contact API
 * All contact-related API endpoints
 */

import api from './api';

// Submit contact form (public)
export const submitContactFormApi = (data) => {
  return api.post('/contact', data);
};

// Get all contact messages (admin)
export const getAllContactsApi = (params = {}) => {
  return api.get('/contact', { params });
};

// Get single contact message (admin)
export const getContactByIdApi = (id) => {
  return api.get(`/contact/${id}`);
};

// Update contact status (admin)
export const updateContactStatusApi = (id, status) => {
  return api.patch(`/contact/${id}/status`, { status });
};

// Reply to contact (admin)
export const replyToContactApi = (id, message) => {
  return api.post(`/contact/${id}/reply`, { message });
};

// Delete contact (admin)
export const deleteContactApi = (id) => {
  return api.delete(`/contact/${id}`);
};
