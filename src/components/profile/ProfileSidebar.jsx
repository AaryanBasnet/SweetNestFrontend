/**
 * Profile Sidebar Component
 * Displays user avatar, info, sweet points, and navigation tabs
 */

import { memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Camera, Gift, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { PROFILE_TABS } from './profileConstants';
import { updateUserProfileApi } from '../../api/user/userApi';
import useAuthStore from '../../stores/authStore';

/**
 * Profile Card with avatar and user info
 */
function ProfileCard({ user, sweetPoints = 0 }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const updateUser = useAuthStore((state) => state.updateUser);

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);

      // Create FormData to send file
      const formData = new FormData();
      formData.append('avatar', file);

      // Update profile with new avatar
      const response = await updateUserProfileApi(formData);

      if (response.data?.success) {
        // Update auth store with new user data
        updateUser(response.data.userData);
        toast.success('Profile picture updated successfully!');
      } else {
        throw new Error('Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile picture');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Trigger file input
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-[#FDF6EE] rounded-2xl p-6 mb-4">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <span className="text-3xl font-serif text-amber-600">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 size={24} className="text-white animate-spin" />
              </div>
            )}
          </div>
          <button
            onClick={handleCameraClick}
            disabled={isUploading}
            aria-label="Change profile photo"
            className="absolute bottom-0 right-0 w-7 h-7 bg-dark text-white rounded-full flex items-center justify-center shadow-lg hover:bg-dark/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera size={14} />
          </button>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload profile picture"
          />
        </div>
      </div>

      {/* Name & Email */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-dark">{user.name}</h2>
        <p className="text-dark/50 text-sm">{user.email}</p>
      </div>

      {/* Sweet Points Card */}
      <div className="bg-[#2D2D2D] rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
            Sweet Points
          </p>
          <p className="text-white text-2xl font-semibold">
            {sweetPoints.toLocaleString()}
          </p>
        </div>
        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
          <Gift size={20} className="text-amber-400" />
        </div>
      </div>
    </div>
  );
}

ProfileCard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
  sweetPoints: PropTypes.number,
};

/**
 * Navigation Tabs
 */
function NavigationTabs({ activeTab, onTabChange }) {
  return (
    <nav className="bg-white rounded-2xl p-2" aria-label="Profile navigation">
      {PROFILE_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
              isActive
                ? 'text-accent'
                : 'text-dark/60 hover:bg-dark/5 hover:text-dark'
            }`}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{tab.label}</span>
            {isActive && (
              <span className="ml-auto w-2 h-2 bg-accent rounded-full" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

NavigationTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

/**
 * Profile Sidebar Component
 */
function ProfileSidebar({ user, activeTab, onTabChange, sweetPoints }) {
  return (
    <aside className="lg:w-[280px] shrink-0">
      <ProfileCard user={user} sweetPoints={sweetPoints} />
      <NavigationTabs activeTab={activeTab} onTabChange={onTabChange} />
    </aside>
  );
}

ProfileSidebar.propTypes = {
  user: PropTypes.object.isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  sweetPoints: PropTypes.number,
};

export default memo(ProfileSidebar);

1