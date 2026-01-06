/**
 * Notification API
 * API calls for notification management
 */

import api from '../api';

/**
 * Get user notifications
 * @param {Object} params - Query parameters (category, unreadOnly, limit)
 * @returns {Promise}
 */
export const getNotificationsApi = (params = {}) => {
  return api.get('/notifications', { params });
};

/**
 * Get unread notification count
 * @returns {Promise}
 */
export const getUnreadCountApi = () => {
  return api.get('/notifications/unread-count');
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise}
 */
export const markAsReadApi = (notificationId) => {
  return api.patch(`/notifications/${notificationId}/read`);
};

/**
 * Mark all notifications as read
 * @param {string} category - Optional category filter
 * @returns {Promise}
 */
export const markAllAsReadApi = (category = 'all') => {
  return api.patch('/notifications/mark-all-read', { category });
};

/**
 * Delete notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise}
 */
export const deleteNotificationApi = (notificationId) => {
  return api.delete(`/notifications/${notificationId}`);
};

/**
 * Clear all read notifications
 * @returns {Promise}
 */
export const clearReadNotificationsApi = () => {
  return api.delete('/notifications/clear-read/all');
};

/**
 * Admin: Get admin notifications
 * @param {Object} params - Query parameters
 * @returns {Promise}
 */
export const getAdminNotificationsApi = (params = {}) => {
  return api.get('/notifications/admin/all', { params });
};

/**
 * Admin: Get admin unread count
 * @returns {Promise}
 */
export const getAdminUnreadCountApi = () => {
  return api.get('/notifications/admin/unread-count');
};

/**
 * Admin: Create notification
 * @param {Object} notificationData - Notification data
 * @returns {Promise}
 */
export const createNotificationApi = (notificationData) => {
  return api.post('/notifications', notificationData);
};
