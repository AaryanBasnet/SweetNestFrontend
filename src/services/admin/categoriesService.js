/**
 * Categories Service (Admin)
 * Business logic for category management
 */

import * as categoriesApi from '../../api/admin/categoriesApi';

/**
 * Fetch all categories
 */
export const fetchCategories = async () => {
  const response = await categoriesApi.getCategoriesApi();
  return response.data;
};

/**
 * Create new category
 */
export const createCategory = async (categoryData) => {
  const formData = buildCategoryFormData(categoryData);
  const response = await categoriesApi.createCategoryApi(formData);
  return response.data;
};

/**
 * Update existing category
 */
export const updateCategory = async (id, categoryData) => {
  const formData = buildCategoryFormData(categoryData);
  const response = await categoriesApi.updateCategoryApi(id, formData);
  return response.data;
};

/**
 * Delete category
 */
export const deleteCategory = async (id) => {
  const response = await categoriesApi.deleteCategoryApi(id);
  return response.data;
};

/**
 * Build FormData for category (handles file uploads)
 */
const buildCategoryFormData = (data) => {
  const formData = new FormData();

  if (data.name) formData.append('name', data.name);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.displayOrder !== undefined) formData.append('displayOrder', data.displayOrder);
  if (data.isActive !== undefined) formData.append('isActive', data.isActive);

  // Image (File object)
  if (data.image instanceof File) {
    formData.append('image', data.image);
  }

  return formData;
};
