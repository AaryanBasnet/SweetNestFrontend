/**
 * Settings Tab Component
 * User account settings including password, notifications, and logout
 */

import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Shield } from 'lucide-react';

// API
import { updateUserProfileApi } from '../../api/user/userApi';

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

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      toast.error('Password must include uppercase, lowercase, number, and special character (@$!%*?&)');
      return;
    }

    setIsLoading(true);

    try {
      const response = await updateUserProfileApi({
        password: passwordData.newPassword,
      });

      if (response.data.success) {
        toast.success('Password changed successfully');
        resetPasswordForm();
        setShowPasswordForm(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-serif text-dark mb-6">Settings</h1>

      <div className="space-y-4">
        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-dark/5 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark font-medium">Change Password</p>
                <p className="text-dark/50 text-sm">Update your password</p>
              </div>
              <button
                onClick={() => {
                  setShowPasswordForm(!showPasswordForm);
                  if (showPasswordForm) resetPasswordForm();
                }}
                className="px-4 py-2 border border-dark/20 text-dark text-sm font-medium rounded-full hover:bg-dark/5 transition-colors"
              >
                {showPasswordForm ? 'Cancel' : 'Update'}
              </button>
            </div>
          </div>

          {/* Password Change Form */}
          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="px-5 pb-5 border-t border-dark/5 pt-5">
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 pr-12 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark"
                    >
                      {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 pr-12 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark"
                    >
                      {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-dark/50 mt-1">
                    Min 8 characters with uppercase, lowercase, number & special char (@$!%*?&)
                  </p>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2.5 pr-12 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark"
                    >
                      {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800 font-medium">
                    Password Requirements:
                  </p>
                  <ul className="text-xs text-amber-700 mt-2 space-y-1 list-disc list-inside">
                    <li>At least 8 characters long</li>
                    <li>One uppercase letter (A-Z)</li>
                    <li>One lowercase letter (a-z)</li>
                    <li>One number (0-9)</li>
                    <li>One special character (@$!%*?&)</li>
                  </ul>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-dark text-white rounded-lg hover:bg-dark/90 transition-colors font-medium disabled:opacity-50"
              >
                <Shield size={18} />
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>

        {/* Email Notifications */}
        {/* <SettingsItem
          title="Email Notifications"
          description="Receive order updates via email"
          action={
            <ToggleSwitch
              checked={true}
              onChange={() => {}}
              ariaLabel="Toggle email notifications"
            />
          }
        /> */}

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

