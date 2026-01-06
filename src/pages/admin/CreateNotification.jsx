/**
 * Create Notification Page
 * Admin page to create and send notifications to users
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Users, User } from 'lucide-react';
import { useCreateNotification } from '../../hooks/notification/useNotifications';
import { toast } from 'react-toastify';

export default function CreateNotification() {
  const navigate = useNavigate();
  const createMutation = useCreateNotification();

  const [formData, setFormData] = useState({
    userId: '',
    type: 'system',
    category: 'all',
    iconType: 'info',
    iconColor: 'blue',
    title: '',
    message: '',
    actionText: '',
    actionUrl: '',
    isAdminNotification: false,
    isBroadcast: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Title and message are required');
      return;
    }

    try {
      const notificationData = {
        type: formData.type,
        category: formData.category,
        iconType: formData.iconType,
        iconColor: formData.iconColor,
        title: formData.title.trim(),
        message: formData.message.trim(),
        actionText: formData.actionText.trim() || undefined,
        actionUrl: formData.actionUrl.trim() || undefined,
        isAdminNotification: formData.isAdminNotification,
      };

      // Only add userId if not broadcast and userId is provided
      if (!formData.isBroadcast && formData.userId.trim()) {
        notificationData.userId = formData.userId.trim();
      }

      await createMutation.mutateAsync(notificationData);
      toast.success('Notification sent successfully!');
      navigate('/admin/notifications');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to send notification'
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/notifications')}
          className="flex items-center gap-2 text-dark/60 hover:text-dark mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Notifications
        </button>
        <h1 className="text-3xl font-serif text-dark">Send Notification</h1>
        <p className="text-dark/60 mt-2">
          Create and send notifications to users or admins
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-xl border border-dark/10 p-6 space-y-6">
          {/* Recipient Type */}
          <div>
            <label className="block text-sm font-medium text-dark mb-3">
              Send To
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isBroadcast: true }))}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  formData.isBroadcast
                    ? 'border-accent bg-accent/5'
                    : 'border-dark/10 hover:border-dark/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  formData.isBroadcast ? 'bg-accent text-white' : 'bg-dark/5 text-dark/60'
                }`}>
                  <Users size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-dark">All Users</p>
                  <p className="text-xs text-dark/50">Broadcast to everyone</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isBroadcast: false }))}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  !formData.isBroadcast
                    ? 'border-accent bg-accent/5'
                    : 'border-dark/10 hover:border-dark/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  !formData.isBroadcast ? 'bg-accent text-white' : 'bg-dark/5 text-dark/60'
                }`}>
                  <User size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-dark">Specific User</p>
                  <p className="text-xs text-dark/50">Target one user</p>
                </div>
              </button>
            </div>
          </div>

          {/* User ID (if not broadcast) */}
          {!formData.isBroadcast && (
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                User ID
              </label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="Enter user ID from database"
                className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
              />
              <p className="text-xs text-dark/50 mt-1">
                Enter the MongoDB ObjectId of the user
              </p>
            </div>
          )}

          {/* Admin Notification Toggle */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <div>
              <p className="font-medium text-dark">Admin Notification</p>
              <p className="text-xs text-dark/50">
                Enable if this is for admin dashboard only
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isAdminNotification"
                checked={formData.isAdminNotification}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
              >
                <option value="order">Order</option>
                <option value="offer">Offer</option>
                <option value="reminder">Reminder</option>
                <option value="alert">Alert</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
              >
                <option value="all">All</option>
                <option value="orders">Orders</option>
                <option value="offers">Offers</option>
              </select>
            </div>
          </div>

          {/* Icon Type & Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Icon Type
              </label>
              <select
                name="iconType"
                value={formData.iconType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
              >
                <option value="delivery">Delivery (Package)</option>
                <option value="gift">Gift</option>
                <option value="clock">Clock</option>
                <option value="star">Star</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Icon Color
              </label>
              <select
                name="iconColor"
                value={formData.iconColor}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
              >
                <option value="green">Green</option>
                <option value="orange">Orange</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="red">Red</option>
                <option value="gray">Gray</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter notification title"
              maxLength={100}
              required
              className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
            />
            <p className="text-xs text-dark/50 mt-1">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter notification message"
              maxLength={500}
              rows={4}
              required
              className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent resize-none"
            />
            <p className="text-xs text-dark/50 mt-1">
              {formData.message.length}/500 characters
            </p>
          </div>

          {/* Action Button (Optional) */}
          <div className="border-t border-dark/10 pt-6">
            <h3 className="text-sm font-medium text-dark mb-4">
              Action Button (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-dark/60 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  name="actionText"
                  value={formData.actionText}
                  onChange={handleChange}
                  placeholder="e.g., View Order"
                  maxLength={50}
                  className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-dark/60 mb-2">
                  Button URL
                </label>
                <input
                  type="text"
                  name="actionUrl"
                  value={formData.actionUrl}
                  onChange={handleChange}
                  placeholder="e.g., /orders/123"
                  maxLength={200}
                  className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-6">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium disabled:opacity-50"
          >
            <Send size={18} />
            {createMutation.isPending ? 'Sending...' : 'Send Notification'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/notifications')}
            className="px-6 py-3 border border-dark/10 text-dark rounded-lg hover:bg-dark/5 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
