/**
 * Notification Service
 * Business logic and data transformation for notifications
 */

import {
  getNotificationsApi,
  getUnreadCountApi,
  markAsReadApi,
  markAllAsReadApi,
  deleteNotificationApi,
  clearReadNotificationsApi,
  getAdminNotificationsApi,
  getAdminUnreadCountApi,
  createNotificationApi,
} from '../../api/notification/notificationApi';

/**
 * Get icon configuration for notification type
 */
export const getNotificationIcon = (iconType, iconColor) => {
  const iconMap = {
    delivery: 'Package',
    gift: 'Gift',
    clock: 'Clock',
    star: 'Star',
    info: 'Info',
    warning: 'AlertTriangle',
    success: 'CheckCircle',
  };

  const colorMap = {
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  return {
    icon: iconMap[iconType] || 'Info',
    colorClass: colorMap[iconColor] || colorMap.blue,
  };
};

/**
 * Format notification timestamp
 * Custom implementation without date-fns
 */
export const formatNotificationTime = (timestamp) => {
  try {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return 'Yesterday';
    }
    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  } catch (error) {
    return 'Recently';
  }
};

/**
 * Group notifications by time period
 */
export const groupNotificationsByTime = (notifications) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups = {
    TODAY: [],
    YESTERDAY: [],
    EARLIER: [],
  };

  notifications.forEach((notification) => {
    const notifDate = new Date(notification.createdAt);
    const notifDay = new Date(
      notifDate.getFullYear(),
      notifDate.getMonth(),
      notifDate.getDate()
    );

    if (notifDay.getTime() === today.getTime()) {
      groups.TODAY.push(notification);
    } else if (notifDay.getTime() === yesterday.getTime()) {
      groups.YESTERDAY.push(notification);
    } else {
      groups.EARLIER.push(notification);
    }
  });

  return groups;
};

/**
 * Fetch user notifications
 */
export const fetchNotifications = async (params = {}) => {
  const response = await getNotificationsApi(params);
  return response.data.data;
};

/**
 * Fetch unread count
 */
export const fetchUnreadCount = async () => {
  const response = await getUnreadCountApi();
  return response.data.data.count;
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  const response = await markAsReadApi(notificationId);
  return response.data.data;
};

/**
 * Mark all as read
 */
export const markAllNotificationsAsRead = async (category = 'all') => {
  const response = await markAllAsReadApi(category);
  return response.data.data;
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId) => {
  const response = await deleteNotificationApi(notificationId);
  return response.data;
};

/**
 * Clear all read notifications
 */
export const clearReadNotifications = async () => {
  const response = await clearReadNotificationsApi();
  return response.data;
};

/**
 * Admin: Fetch admin notifications
 */
export const fetchAdminNotifications = async (params = {}) => {
  const response = await getAdminNotificationsApi(params);
  return response.data.data;
};

/**
 * Admin: Fetch admin unread count
 */
export const fetchAdminUnreadCount = async () => {
  const response = await getAdminUnreadCountApi();
  return response.data.data.count;
};

/**
 * Admin: Create notification
 */
export const createNotification = async (notificationData) => {
  const response = await createNotificationApi(notificationData);
  return response.data.data;
};
