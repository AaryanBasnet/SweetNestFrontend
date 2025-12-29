/**
 * Cake Service
 * Business logic layer for cakes
 * Transforms API responses into usable data
 */

import * as cakeApi from '../../api/cake/cakeApi';

/**
 * Fetch cakes with optional filters
 */
export const fetchCakes = async (filters = {}) => {
  const params = {};

  if (filters.category) params.category = filters.category;
  if (filters.badge) params.badge = filters.badge;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.search) params.search = filters.search;
  if (filters.featured) params.featured = filters.featured;
  if (filters.sort) params.sort = filters.sort;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const response = await cakeApi.getCakesApi(params);
  return response.data;
};

/**
 * Fetch featured cakes
 */
export const fetchFeaturedCakes = async (limit = 8) => {
  const response = await cakeApi.getFeaturedCakesApi(limit);
  return response.data;
};

/**
 * Fetch cakes by category
 */
export const fetchCakesByCategory = async (categorySlug, filters = {}) => {
  const params = {};
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const response = await cakeApi.getCakesByCategoryApi(categorySlug, params);
  return response.data;
};

/**
 * Fetch single cake by slug
 */
export const fetchCakeBySlug = async (slug) => {
  const response = await cakeApi.getCakeBySlugApi(slug);
  // API returns { success, message, data: cake } - extract the cake object
  return response.data?.data;
};

/**
 * Fetch cake reviews
 */
export const fetchCakeReviews = async (cakeId, page = 1, limit = 10) => {
  const response = await cakeApi.getCakeReviewsApi(cakeId, { page, limit });
  return response.data;
};

/**
 * Submit a review
 */
export const submitReview = async (cakeId, reviewData) => {
  const response = await cakeApi.createReviewApi(cakeId, reviewData);
  return response.data;
};
