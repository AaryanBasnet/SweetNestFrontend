/**
 * Rewards API
 * API calls for SweetPoints and coupons
 */

import api from './api';

/**
 * Get all available reward tiers
 */
export const getRewardTiersApi = async () => {
  return await api.get('/rewards/tiers');
};

/**
 * Get user's SweetPoints balance and history
 */
export const getUserPointsApi = async () => {
  return await api.get('/rewards/points');
};

/**
 * Redeem points for a coupon
 * @param {string} tierId - Reward tier ID (bronze, silver, gold, platinum)
 */
export const redeemPointsApi = async (tierId) => {
  return await api.post('/rewards/redeem', { tierId });
};

/**
 * Get user's coupons
 * @param {string} status - Filter by status: 'active', 'used', 'expired', or 'all'
 */
export const getUserCouponsApi = async (status = 'all') => {
  return await api.get('/rewards/coupons', { params: { status } });
};

/**
 * Validate a coupon code
 * @param {string} code - Coupon code to validate
 */
export const validateCouponApi = async (code) => {
  return await api.get(`/rewards/validate/${code}`);
};
