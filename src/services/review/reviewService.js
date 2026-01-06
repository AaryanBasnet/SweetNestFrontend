/**
 * Review Service
 * Business logic layer for reviews
 * Transforms API responses and centralizes data handling
 */

import * as reviewApi from '../../api/review/reviewApi';

/**
 * Fetch paginated reviews for a cake
 * @param {string} cakeId - Cake ID
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 6)
 * @returns {Promise<{data: Array, pagination: Object, summary: Object}>}
 */
export const fetchCakeReviews = async (cakeId, page = 1, limit = 6) => {
  const response = await reviewApi.getCakeReviewsApi(cakeId, { page, limit });
  return response.data;
};

/**
 * Submit a new review for a cake
 * @param {string} cakeId - Cake ID
 * @param {Object} reviewData - Review data {rating, comment}
 * @returns {Promise<Object>} Created review
 */
export const submitReview = async (cakeId, reviewData) => {
  const response = await reviewApi.createReviewApi(cakeId, reviewData);
  return response.data.data;
};

/**
 * Update an existing review
 * @param {string} reviewId - Review ID
 * @param {Object} reviewData - Updated review data {rating, comment}
 * @returns {Promise<Object>} Updated review
 */
export const updateReview = async (reviewId, reviewData) => {
  const response = await reviewApi.updateReviewApi(reviewId, reviewData);
  return response.data.data;
};

/**
 * Delete a review
 * @param {string} reviewId - Review ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteReview = async (reviewId) => {
  const response = await reviewApi.deleteReviewApi(reviewId);
  return response.data;
};

/**
 * Mark a review as helpful
 * @param {string} reviewId - Review ID
 * @returns {Promise<Object>} Updated review with new helpful count
 */
export const markHelpful = async (reviewId) => {
  const response = await reviewApi.markReviewHelpfulApi(reviewId);
  return response.data.data;
};
