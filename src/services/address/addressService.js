/**
 * Address Service
 * Business logic layer for addresses
 * Transforms API responses and centralizes data handling
 */

import * as addressApi from '../../api/address/addressApi';

/**
 * Fetch all addresses for current user
 * @returns {Promise<Array>} Array of addresses
 */
export const fetchAddresses = async () => {
  const response = await addressApi.getAddressesApi();
  return response.data.data;
};

/**
 * Fetch single address by ID
 * @param {string} addressId - Address ID
 * @returns {Promise<Object>} Address object
 */
export const fetchAddress = async (addressId) => {
  const response = await addressApi.getAddressApi(addressId);
  return response.data.data;
};

/**
 * Create new address
 * @param {Object} addressData - Address data
 * @returns {Promise<Object>} Created address
 */
export const createAddress = async (addressData) => {
  const response = await addressApi.createAddressApi(addressData);
  return response.data.data;
};

/**
 * Update existing address
 * @param {string} addressId - Address ID
 * @param {Object} addressData - Updated address data
 * @returns {Promise<Object>} Updated address
 */
export const updateAddress = async (addressId, addressData) => {
  const response = await addressApi.updateAddressApi(addressId, addressData);
  return response.data.data;
};

/**
 * Delete address
 * @param {string} addressId - Address ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteAddress = async (addressId) => {
  const response = await addressApi.deleteAddressApi(addressId);
  return response.data;
};

/**
 * Set address as default
 * @param {string} addressId - Address ID
 * @returns {Promise<Object>} Updated address
 */
export const setDefaultAddress = async (addressId) => {
  const response = await addressApi.setDefaultAddressApi(addressId);
  return response.data.data;
};

/**
 * Helper: Format address for display
 * @param {Object} address - Address object
 * @returns {string} Formatted address string
 */
export const formatAddressDisplay = (address) => {
  if (!address) return '';

  const parts = [
    address.address,
    address.apartment,
    address.city,
    address.postalCode,
  ].filter(Boolean);

  return parts.join(', ');
};

/**
 * Helper: Get label display text
 * @param {Object} address - Address object
 * @returns {string} Label text
 */
export const getLabelDisplay = (address) => {
  if (!address) return '';
  return address.label === 'Custom' && address.customLabel
    ? address.customLabel
    : address.label;
};
