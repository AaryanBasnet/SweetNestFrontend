/**
 * Products Service (Admin)
 * Business logic for product management
 * Products are configurable, made-to-order services with predefined price slabs
 */

import * as productsApi from '../../api/admin/productsApi';

/**
 * Fetch products with filters
 */
export const fetchProducts = async (filters = {}) => {
  const params = {};
  if (filters.category) params.category = filters.category;
  if (filters.search) params.search = filters.search;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.sort) params.sort = filters.sort;

  const response = await productsApi.getProductsApi(params);
  return response.data;
};

/**
 * Create new product
 */
export const createProduct = async (productData) => {
  const formData = buildProductFormData(productData);
  const response = await productsApi.createProductApi(formData);
  return response.data;
};

/**
 * Update existing product
 */
export const updateProduct = async (id, productData) => {
  const formData = buildProductFormData(productData);
  const response = await productsApi.updateProductApi(id, formData);
  return response.data;
};

/**
 * Delete product
 */
export const deleteProduct = async (id) => {
  const response = await productsApi.deleteProductApi(id);
  return response.data;
};

/**
 * Toggle product status
 */
export const toggleProductStatus = async (id, isActive) => {
  const response = await productsApi.toggleProductStatusApi(id, isActive);
  return response.data;
};

/**
 * Build FormData for product (handles file uploads)
 * Note: stock and basePrice are NOT sent - basePrice is a virtual, stock is removed
 */
const buildProductFormData = (data) => {
  const formData = new FormData();

  // Basic fields
  if (data.name) formData.append('name', data.name);
  if (data.description) formData.append('description', data.description);
  if (data.category) formData.append('category', data.category);
  if (data.isActive !== undefined) formData.append('isActive', data.isActive);
  if (data.isFeatured !== undefined) formData.append('isFeatured', data.isFeatured);
  if (data.isCustomizable !== undefined) formData.append('isCustomizable', data.isCustomizable);
  if (data.storageAndCare) formData.append('storageAndCare', data.storageAndCare);

  // JSON fields - weightOptions with new structure (weightInKg, label, price, isDefault)
  if (data.weightOptions) {
    formData.append('weightOptions', JSON.stringify(data.weightOptions));
  }
  if (data.ingredients) {
    formData.append('ingredients', JSON.stringify(data.ingredients));
  }
  if (data.badges) {
    formData.append('badges', JSON.stringify(data.badges));
  }
  if (data.deliveryInfo) {
    formData.append('deliveryInfo', JSON.stringify(data.deliveryInfo));
  }
  if (data.customizationOptions) {
    formData.append('customizationOptions', JSON.stringify(data.customizationOptions));
  }

  // Images (File objects)
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      if (image instanceof File) {
        formData.append('images', image);
      }
    });
  }

  // Images to remove
  if (data.removeImages && data.removeImages.length > 0) {
    formData.append('removeImages', JSON.stringify(data.removeImages));
  }

  return formData;
};
