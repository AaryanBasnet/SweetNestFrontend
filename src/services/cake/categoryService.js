/**
 * Category Service
 * Business logic layer for categories
 * Transforms API responses into usable data
 */

import * as categoryApi from '../../api/cake/categoryApi';

/**
 * Fetch all active categories
 */
export const fetchCategories = async (activeOnly = true) => {
  const params = activeOnly ? { active: 'true' } : {};
  const response = await categoryApi.getCategoriesApi(params);
  return response.data;
};

/**
 * Fetch single category by slug
 */
export const fetchCategoryBySlug = async (slug) => {
  const response = await categoryApi.getCategoryBySlugApi(slug);
  return response.data;
};
