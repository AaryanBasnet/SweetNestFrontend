/**
 * Settings Tab Component
 * User account settings including password, notifications, and logout
 */

import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Stores
import useAuthStore from '../../stores/authStore';

/**
 * Settings Item Component
 */
function SettingsItem({ title, description, action }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-dark/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark font-medium">{title}</p>
          <p className="text-dark/50 text-sm">{description}</p>
        </div>
        {action}
      </div>
    </div>
  );
}

/**
 * Toggle Switch Component
 */
function ToggleSwitch({ checked, onChange, ariaLabel }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
        aria-label={ariaLabel}
      />
      <div className="w-11 h-6 bg-dark/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
    </label>
  );
}

/**
 * Settings Tab Main Component
 */
function SettingsTab() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleChangePassword = () => {
    // TODO: Implement password change modal/page
    toast.info('Password change coming soon');
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-serif text-dark mb-6">Settings</h1>

      <div className="space-y-4">
        {/* Change Password */}
        <SettingsItem
          title="Change Password"
          description="Update your password"
          action={
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 border border-dark/20 text-dark text-sm font-medium rounded-full hover:bg-dark/5 transition-colors"
            >
              Update
            </button>
          }
        />

        {/* Email Notifications */}
        <SettingsItem
          title="Email Notifications"
          description="Receive order updates via email"
          action={
            <ToggleSwitch
              checked={true}
              onChange={() => {}}
              ariaLabel="Toggle email notifications"
            />
          }
        />

        {/* Logout */}
        <SettingsItem
          title="Logout"
          description="Sign out of your account"
          action={
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-full hover:bg-rose-600 transition-colors"
            >
              Logout
            </button>
          }
        />
      </div>
    </div>
  );
}

export default memo(SettingsTab);

