/**
 * NotificationList Component
 * Groups and displays notifications by time period
 */

import NotificationCard from './NotificationCard';
import { Bell } from 'lucide-react';
import { groupNotificationsByTime } from '../../services/notification/notificationService';

export default function NotificationList({ notifications, isLoading }) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* TODAY Section Skeleton */}
        <div>
          <div className="h-4 w-16 bg-dark/10 rounded mb-3" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border border-dark/10 rounded-xl p-4 animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-dark/10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-dark/10 rounded" />
                    <div className="h-3 w-full bg-dark/10 rounded" />
                    <div className="h-3 w-24 bg-dark/10 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-dark/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell size={32} className="text-dark/30" />
        </div>
        <h3 className="text-lg font-serif text-dark mb-2">No notifications yet</h3>
        <p className="text-dark/60 text-sm">
          We'll notify you when something important happens
        </p>
      </div>
    );
  }

  const grouped = groupNotificationsByTime(notifications);

  return (
    <div className="space-y-8">
      {/* TODAY */}
      {grouped.TODAY.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-dark/40 uppercase tracking-wider mb-3">
            Today
          </h3>
          <div className="space-y-3">
            {grouped.TODAY.map((notification) => (
              <NotificationCard key={notification._id} notification={notification} />
            ))}
          </div>
        </div>
      )}

      {/* YESTERDAY */}
      {grouped.YESTERDAY.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-dark/40 uppercase tracking-wider mb-3">
            Yesterday
          </h3>
          <div className="space-y-3">
            {grouped.YESTERDAY.map((notification) => (
              <NotificationCard key={notification._id} notification={notification} />
            ))}
          </div>
        </div>
      )}

      {/* EARLIER */}
      {grouped.EARLIER.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-dark/40 uppercase tracking-wider mb-3">
            Earlier
          </h3>
          <div className="space-y-3">
            {grouped.EARLIER.map((notification) => (
              <NotificationCard key={notification._id} notification={notification} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
