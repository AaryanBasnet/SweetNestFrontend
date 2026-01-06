/**
 * Admin Notifications Page
 * View and manage admin notifications
 */

import { useState } from 'react';
import { Bell, Package, ShoppingBag, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/admin/shared';
import {
  useAdminNotifications,
  useMarkAsRead,
} from '../../hooks/notification/useNotifications';
import { formatNotificationTime } from '../../services/notification/notificationService';

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: notifications, isLoading } = useAdminNotifications({
    unreadOnly: activeFilter === 'unread',
  });

  const markAsReadMutation = useMarkAsRead();

  const handleMarkAsRead = (id) => {
    markAsReadMutation.mutate(id);
  };

  const getIconByType = (type) => {
    const icons = {
      order: ShoppingBag,
      offer: Bell,
      reminder: Bell,
      alert: AlertCircle,
      system: Bell,
    };
    return icons[type] || Bell;
  };

  const getColorByIconColor = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      gray: 'bg-gray-100 text-gray-600',
    };
    return colors[color] || colors.blue;
  };

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="System notifications and alerts"
        actions={
          <button
            onClick={() => navigate('/admin/notifications/create')}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
          >
            <Plus size={18} />
            Send Notification
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <p className="text-sm text-dark/50 mb-1">Total Notifications</p>
          <p className="text-3xl font-serif text-dark">
            {notifications?.length || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <p className="text-sm text-dark/50 mb-1">Unread</p>
          <p className="text-3xl font-serif text-dark">{unreadCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-dark text-white'
              : 'bg-white text-dark/70 hover:bg-dark/5 border border-dark/10'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeFilter === 'unread'
              ? 'bg-dark text-white'
              : 'bg-white text-dark/70 hover:bg-dark/5 border border-dark/10'
          }`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-dark/10 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-dark/50">Loading...</div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-dark/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-dark/30" />
            </div>
            <h3 className="text-lg font-serif text-dark mb-2">
              No notifications yet
            </h3>
            <p className="text-dark/60 text-sm">
              System notifications will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-dark/5">
            {notifications.map((notification) => {
              const Icon = getIconByType(notification.type);
              const colorClass = getColorByIconColor(notification.iconColor);

              return (
                <div
                  key={notification._id}
                  className={`p-5 hover:bg-cream/30 transition-colors ${
                    !notification.isRead ? 'bg-blue-50/30' : ''
                  }`}
                  onClick={() =>
                    !notification.isRead && handleMarkAsRead(notification._id)
                  }
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-medium text-dark">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1" />
                        )}
                      </div>

                      <p className="text-sm text-dark/60 leading-relaxed mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-dark/40">
                        <span>{formatNotificationTime(notification.createdAt)}</span>
                        {notification.user && (
                          <span>
                            Related to: {notification.user.name || notification.user.email}
                          </span>
                        )}
                        <span className="capitalize">Type: {notification.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
