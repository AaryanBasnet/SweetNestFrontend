import { useState, useCallback } from "react";
import api from "../api/axiosInstance"; // Your axios instance
import { useAuth } from "./useAuth";

export const useUser = () => {
  const { updateUserState, logout } = useAuth(); // Access global auth actions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch latest profile data from backend
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users/profile");
      // Update global context with fresh data from DB
      updateUserState(data); 
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profile");
      // Optional: if fetch fails with 401, logout
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  }, [updateUserState, logout]);

  // 2. Update Profile
  const updateProfile = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put("/users/profile", formData);
      // Important: Sync the Auth Context with the new data!
      updateUserState(data); 
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // 3. Change Password
  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/users/change-password", passwordData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Password change failed";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProfile,
    updateProfile,
    changePassword,
    loading,
    error,
  };
};