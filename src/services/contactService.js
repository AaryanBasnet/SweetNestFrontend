/**
 * Contact Service
 * Business logic layer for contact functionality
 */

import * as contactApi from '../api/contactApi';

/**
 * Submit contact form
 */
export const submitContactForm = async (formData) => {
  const response = await contactApi.submitContactFormApi(formData);
  return response.data;
};

/**
 * Fetch all contact messages (admin)
 */
export const fetchAllContacts = async (filters = {}) => {
  const params = {};

  if (filters.status) params.status = filters.status;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const response = await contactApi.getAllContactsApi(params);
  return response.data;
};

/**
 * Fetch single contact message (admin)
 */
export const fetchContactById = async (id) => {
  const response = await contactApi.getContactByIdApi(id);
  return response.data;
};

/**
 * Update contact status (admin)
 */
export const updateContactStatus = async (id, status) => {
  const response = await contactApi.updateContactStatusApi(id, status);
  return response.data;
};

/**
 * Reply to contact message (admin)
 */
export const replyToContact = async (id, message) => {
  const response = await contactApi.replyToContactApi(id, message);
  return response.data;
};

/**
 * Delete contact message (admin)
 */
export const deleteContact = async (id) => {
  const response = await contactApi.deleteContactApi(id);
  return response.data;
};
