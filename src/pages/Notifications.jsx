/**
 * Notifications Page
 * Displays user notifications with filtering
 */

import { useState } from 'react';
import { CheckCheck } from 'lucide-react';
import { NotificationList } from '../components/notification';
import {
  useNotifications,
  useMarkAllAsRead,
} from '../hooks/notification/useNotifications';
import { toast } from 'react-toastify';

export default function Notifications() {
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: notifications, isLoading } = useNotifications({
    category: activeCategory,
  });

  const markAllAsReadMutation = useMarkAllAsRead();

  const handleMarkAllRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync(activeCategory);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark all as read');
    }
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'orders', label: 'Orders' },
    { id: 'offers', label: 'Offers' },
  ];

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <div className="min-h-screen bg-cream/30 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-dark mb-2">
            Updates
          </h1>
          <p className="text-dark/60">Stay looped in on your sweets.</p>
        </div>

        {/* Filter Tabs & Mark All Read */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-dark text-white'
                    : 'bg-white text-dark/70 hover:bg-dark/5'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markAllAsReadMutation.isPending}
              className="flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors disabled:opacity-50"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          )}
        </div>

        {/* Notification List */}
        <NotificationList notifications={notifications} isLoading={isLoading} />
      </div>
    </div>
  );
}
