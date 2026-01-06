/**
 * Notification React Query Hooks
 * Manages notification data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearReadNotifications,
  fetchAdminNotifications,
  fetchAdminUnreadCount,
  createNotification,
} from '../../services/notification/notificationService';

// Query keys
const NOTIFICATION_KEYS = {
  all: ['notifications'],
  lists: () => [...NOTIFICATION_KEYS.all, 'list'],
  list: (params) => [...NOTIFICATION_KEYS.lists(), params],
  unreadCount: () => [...NOTIFICATION_KEYS.all, 'unread-count'],
  admin: () => [...NOTIFICATION_KEYS.all, 'admin'],
  adminList: (params) => [...NOTIFICATION_KEYS.admin(), 'list', params],
  adminUnreadCount: () => [...NOTIFICATION_KEYS.admin(), 'unread-count'],
};

/**
 * Fetch user notifications
 */
export const useNotifications = (params = {}) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(params),
    queryFn: () => fetchNotifications(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Fetch unread notification count
 */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount(),
    queryFn: fetchUnreadCount,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};

/**
 * Mark notification as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (notificationId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.lists() });

      // Snapshot previous value
      const previousNotifications = queryClient.getQueriesData({
        queryKey: NOTIFICATION_KEYS.lists(),
      });

      // Optimistically update to mark as read
      queryClient.setQueriesData({ queryKey: NOTIFICATION_KEYS.lists() }, (old) => {
        if (!old) return old;
        return old.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        );
      });

      // Decrement unread count
      queryClient.setQueryData(NOTIFICATION_KEYS.unreadCount(), (old) => {
        return old > 0 ? old - 1 : 0;
      });

      return { previousNotifications };
    },
    onError: (err, notificationId, context) => {
      // Rollback on error
      context?.previousNotifications.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unreadCount() });
    },
  });
};

/**
 * Mark all notifications as read
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async (category) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.lists() });

      const previousNotifications = queryClient.getQueriesData({
        queryKey: NOTIFICATION_KEYS.lists(),
      });

      // Optimistically mark all as read
      queryClient.setQueriesData({ queryKey: NOTIFICATION_KEYS.lists() }, (old) => {
        if (!old) return old;
        return old.map((notif) => {
          if (category === 'all' || notif.category === category) {
            return { ...notif, isRead: true };
          }
          return notif;
        });
      });

      // Reset unread count
      queryClient.setQueryData(NOTIFICATION_KEYS.unreadCount(), 0);

      return { previousNotifications };
    },
    onError: (err, category, context) => {
      context?.previousNotifications.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unreadCount() });
    },
  });
};

/**
 * Delete notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.lists() });

      const previousNotifications = queryClient.getQueriesData({
        queryKey: NOTIFICATION_KEYS.lists(),
      });

      // Optimistically remove
      queryClient.setQueriesData({ queryKey: NOTIFICATION_KEYS.lists() }, (old) => {
        if (!old) return old;
        const deleted = old.find((n) => n._id === notificationId);
        if (deleted && !deleted.isRead) {
          // Decrement unread count if deleting unread notification
          queryClient.setQueryData(NOTIFICATION_KEYS.unreadCount(), (count) =>
            count > 0 ? count - 1 : 0
          );
        }
        return old.filter((notif) => notif._id !== notificationId);
      });

      return { previousNotifications };
    },
    onError: (err, notificationId, context) => {
      context?.previousNotifications.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unreadCount() });
    },
  });
};

/**
 * Clear all read notifications
 */
export const useClearReadNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearReadNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() });
    },
  });
};

/**
 * Admin: Fetch admin notifications
 */
export const useAdminNotifications = (params = {}) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.adminList(params),
    queryFn: () => fetchAdminNotifications(params),
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Admin: Fetch admin unread count
 */
export const useAdminUnreadCount = () => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.adminUnreadCount(),
    queryFn: fetchAdminUnreadCount,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
};

/**
 * Admin: Create notification
 */
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unreadCount() });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.admin() });
    },
  });
};
