/**
 * Promotion Service
 * Business logic layer for promotions
 */

import * as promotionApi from '../../api/promotion/promotionApi';

/**
 * Fetch active promotions for public display
 */
export const fetchActivePromotions = async () => {
  const response = await promotionApi.getActivePromotionsApi();
  return response.data;
};

/**
 * Fetch all promotions (admin)
 */
export const fetchAllPromotions = async (filters = {}) => {
  const params = {};

  if (filters.active !== undefined) params.active = filters.active;
  if (filters.season) params.season = filters.season;

  const response = await promotionApi.getAllPromotionsApi(params);
  return response.data;
};

/**
 * Fetch single promotion by ID (admin)
 */
export const fetchPromotionById = async (id) => {
  const response = await promotionApi.getPromotionByIdApi(id);
  return response.data;
};

/**
 * Create new promotion (admin)
 */
export const createPromotion = async (promotionData) => {
  const formData = new FormData();

  // Append text fields
  formData.append('title', promotionData.title);
  formData.append('description', promotionData.description);
  formData.append('startDate', promotionData.startDate);
  formData.append('endDate', promotionData.endDate);
  formData.append('seasonTag', promotionData.seasonTag || 'all-season');
  formData.append('ctaText', promotionData.ctaText || 'VIEW DETAILS');
  formData.append('ctaLink', promotionData.ctaLink || '/shop');
  formData.append('priority', promotionData.priority || 0);
  formData.append('isActive', promotionData.isActive !== undefined ? promotionData.isActive : true);

  // Append linked cakes/category if provided
  if (promotionData.linkedCakes) {
    formData.append('linkedCakes', JSON.stringify(promotionData.linkedCakes));
  }
  if (promotionData.linkedCategory) {
    formData.append('linkedCategory', promotionData.linkedCategory);
  }

  // Append images
  if (promotionData.images && promotionData.images.length > 0) {
    promotionData.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await promotionApi.createPromotionApi(formData);
  return response.data;
};

/**
 * Update promotion (admin)
 */
export const updatePromotion = async (id, promotionData) => {
  const formData = new FormData();

  // Append updated fields
  if (promotionData.title) formData.append('title', promotionData.title);
  if (promotionData.description) formData.append('description', promotionData.description);
  if (promotionData.startDate) formData.append('startDate', promotionData.startDate);
  if (promotionData.endDate) formData.append('endDate', promotionData.endDate);
  if (promotionData.seasonTag) formData.append('seasonTag', promotionData.seasonTag);
  if (promotionData.ctaText) formData.append('ctaText', promotionData.ctaText);
  if (promotionData.ctaLink) formData.append('ctaLink', promotionData.ctaLink);
  if (promotionData.priority !== undefined) formData.append('priority', promotionData.priority);
  if (promotionData.isActive !== undefined) formData.append('isActive', promotionData.isActive);

  if (promotionData.linkedCakes) {
    formData.append('linkedCakes', JSON.stringify(promotionData.linkedCakes));
  }
  if (promotionData.linkedCategory) {
    formData.append('linkedCategory', promotionData.linkedCategory);
  }

  // Append new images
  if (promotionData.newImages && promotionData.newImages.length > 0) {
    promotionData.newImages.forEach((image) => {
      formData.append('images', image);
    });
  }

  // Append images to remove
  if (promotionData.removeImages) {
    formData.append('removeImages', JSON.stringify(promotionData.removeImages));
  }

  const response = await promotionApi.updatePromotionApi(id, formData);
  return response.data;
};

/**
 * Delete promotion (admin)
 */
export const deletePromotion = async (id) => {
  const response = await promotionApi.deletePromotionApi(id);
  return response.data;
};
