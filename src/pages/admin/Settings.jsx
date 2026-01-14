/**
 * Admin Settings Page
 * Manage admin account, security, and create new admins
 */

import { useState, useEffect } from 'react';
import { Save, User, Shield, UserPlus, Eye, EyeOff } from 'lucide-react';
import { PageHeader } from '../../components/admin/shared';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/user/useAuth';
import { updateUserProfileApi, createAdminApi } from '../../api/user/userApi';

export default function Settings() {
  const { user, updateUserState } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);

  // Account Settings State
  const [accountData, setAccountData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Update accountData when user changes
  useEffect(() => {
    if (user) {
      setAccountData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Security State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Admin Management State
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const tabs = [
    { id: 'account', label: 'Account Settings', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'admin', label: 'Admin Management', icon: UserPlus },
  ];

  // Handle Account Update
  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await updateUserProfileApi({
        name: accountData.name,
        email: accountData.email,
        phone: accountData.phone,
      });

      if (response.data.success) {
        // Update local state with the response data
        updateUserState(response.data.userData);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (securityData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(securityData.newPassword)) {
      toast.error('Password must include uppercase, lowercase, number, and special character (@$!%*?&)');
      return;
    }

    setIsLoading(true);

    try {
      // Update profile with new password
      const response = await updateUserProfileApi({
        password: securityData.newPassword,
      });

      if (response.data.success) {
        // Update local state with the response data
        updateUserState(response.data.userData);
        toast.success('Password changed successfully');
        setSecurityData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Create Admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    if (!adminData.name || !adminData.email || !adminData.password) {
      toast.error('Name, email, and password are required');
      return;
    }

    if (adminData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(adminData.password)) {
      toast.error('Password must include uppercase, lowercase, number, and special character (@$!%*?&)');
      return;
    }

    setIsLoading(true);

    try {
      const response = await createAdminApi(adminData);

      if (response.data.success) {
        toast.success('Admin created successfully');
        setAdminData({
          name: '',
          email: '',
          password: '',
          phone: '',
          address: '',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account and system settings"
      />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="space-y-1 bg-white rounded-xl p-2 border border-dark/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent/10 text-accent'
                    : 'text-dark/60 hover:bg-dark/5'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl p-6 lg:p-8 border border-dark/5">
          {/* ACCOUNT SETTINGS TAB */}
          {activeTab === 'account' && (
            <form onSubmit={handleAccountUpdate} className="space-y-6">
              <div>
                <h3 className="text-xl font-serif text-dark mb-2">
                  Account Information
                </h3>
                <p className="text-sm text-dark/60">
                  Update your admin account details
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountData.name}
                    onChange={(e) =>
                      setAccountData({ ...accountData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={accountData.email}
                    onChange={(e) =>
                      setAccountData({ ...accountData, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={accountData.phone}
                    onChange={(e) =>
                      setAccountData({ ...accountData, phone: e.target.value })
                    }
                    placeholder="+977 9801234567"
                    className="w-full px-4 py-2.5 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="pt-4 border-t border-dark/5">
                  <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                    <User size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-dark">
                        Role: <span className="text-accent">{user?.role}</span>
                      </p>
                      <p className="text-xs text-dark/50">
                        Your account type and permissions
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium disabled:opacity-50"
              >
                <Save size={18} />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <h3 className="text-xl font-serif text-dark mb-2">
                  Change Password
                </h3>
                <p className="text-sm text-dark/60">
                  Update your password to keep your account secure
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={securityData.currentPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
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
                      {showPasswords.current ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={securityData.newPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
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
                      {showPasswords.new ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-dark/50 mt-1">
                    Min 8 characters with uppercase, lowercase, number & special char (@$!%*?&)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={securityData.confirmPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
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
                      {showPasswords.confirm ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

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
                className="flex items-center gap-2 px-6 py-2.5 bg-dark text-white rounded-lg hover:bg-dark/90 transition-colors font-medium disabled:opacity-50"
              >
                <Shield size={18} />
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {/* ADMIN MANAGEMENT TAB */}
          {activeTab === 'admin' && (
            <form onSubmit={handleCreateAdmin} className="space-y-6">
              <div>
                <h3 className="text-xl font-serif text-dark mb-2">
                  Create New Admin
                </h3>
                <p className="text-sm text-dark/60">
                  Add a new administrator to manage the store
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={adminData.name}
                      onChange={(e) =>
                        setAdminData({ ...adminData, name: e.target.value })
                      }
                      required
                      placeholder="Admin name"
                      className="w-full px-4 py-2.5 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={adminData.email}
                      onChange={(e) =>
                        setAdminData({ ...adminData, email: e.target.value })
                      }
                      required
                      placeholder="admin@example.com"
                      className="w-full px-4 py-2.5 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminData.password}
                      onChange={(e) =>
                        setAdminData({ ...adminData, password: e.target.value })
                      }
                      required
                      placeholder="Create a secure password"
                      className="w-full px-4 py-2.5 pr-12 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark"
                    >
                      {showAdminPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-dark/50 mt-1">
                    Min 8 characters with uppercase, lowercase, number & special char (@$!%*?&)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={adminData.phone}
                      onChange={(e) =>
                        setAdminData({ ...adminData, phone: e.target.value })
                      }
                      placeholder="+977 9801234567"
                      className="w-full px-4 py-2.5 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={adminData.address}
                      onChange={(e) =>
                        setAdminData({ ...adminData, address: e.target.value })
                      }
                      placeholder="City, Country"
                      className="w-full px-4 py-2.5 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800 font-medium flex items-center gap-2">
                    <UserPlus size={16} />
                    Admin Permissions
                  </p>
                  <p className="text-xs text-purple-700 mt-2">
                    New admins will have full access to manage products, orders,
                    customers, and all store settings. Make sure to only create
                    admin accounts for trusted team members.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium disabled:opacity-50"
              >
                <UserPlus size={18} />
                {isLoading ? 'Creating...' : 'Create Admin Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
