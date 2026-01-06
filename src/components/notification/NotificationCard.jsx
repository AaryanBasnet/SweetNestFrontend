/**
 * NotificationCard Component
 * Displays a single notification
 */

import { Package, Gift, Clock, Star, Info, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getNotificationIcon,
  formatNotificationTime,
} from '../../services/notification/notificationService';
import { useMarkAsRead } from '../../hooks/notification/useNotifications';

// Icon component mapping
const iconComponents = {
  Package,
  Gift,
  Clock,
  Star,
  Info,
  AlertTriangle,
  CheckCircle,
};

export default function NotificationCard({ notification }) {
  const markAsReadMutation = useMarkAsRead();

  const { icon: iconName, colorClass } = getNotificationIcon(
    notification.iconType,
    notification.iconColor
  );

  const IconComponent = iconComponents[iconName] || Info;

  const handleClick = () => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }
  };

  const cardContent = (
    <div
      className={`bg-white border rounded-xl p-4 transition-all cursor-pointer hover:shadow-md relative ${
        notification.isRead ? 'border-dark/10' : 'border-dark/20'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}
        >
          <IconComponent size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-medium text-dark">{notification.title}</h3>
            {!notification.isRead && (
              <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full" />
            )}
          </div>

          <p className="text-sm text-dark/60 leading-relaxed mb-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-dark/40">
              {formatNotificationTime(notification.createdAt)}
            </span>

            {notification.actionText && notification.actionUrl && (
              <Link
                to={notification.actionUrl}
                onClick={handleActionClick}
                className="text-xs font-medium text-accent hover:text-accent/80 flex items-center gap-1 transition-colors"
              >
                {notification.actionText}
                <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return notification.actionUrl && !notification.actionText ? (
    <Link to={notification.actionUrl} onClick={handleActionClick}>
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
}
