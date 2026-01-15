/**
 * useProfileForm Hook
 * Custom hook for managing profile form state and updates
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { updateUserProfileApi } from '../../api/user/userApi';
import useAuthStore from '../../stores/authStore';

/**
 * Hook to manage profile form editing
 * @returns {Object} Form state and handlers
 */
export const useProfileForm = () => {
  const { user, updateUser } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  /**
   * Handle form input change
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Start editing mode
   */
  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  /**
   * Cancel editing and reset form
   */
  const cancelEditing = useCallback(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setIsEditing(false);
  }, [user]);

  /**
   * Save profile changes
   */
  const saveProfile = useCallback(async () => {
    setIsSaving(true);
    try {
      const response = await updateUserProfileApi({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      if (response.data?.success) {
        updateUser(response.data.userData);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return { success: false, message };
    } finally {
      setIsSaving(false);
    }
  }, [formData, updateUser]);

  return {
    formData,
    isEditing,
    isSaving,
    handleInputChange,
    startEditing,
    cancelEditing,
    saveProfile,
  };
};

export default useProfileForm;

