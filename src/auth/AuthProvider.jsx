import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext"; // Importing the global context
import * as authService from "../services/user/authService"; // Adjust path to services

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. Helper Functions ---
  const saveSession = (userData, token) => {
    const normalizedUser = { ...userData, _id: userData._id || userData.id };
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", token);
    setUser(normalizedUser);
  };

  const clearSession = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // --- 2. Actions (Login/Register/Logout) ---
  const login = async (credentials) => {
    try {
      const data = await authService.loginUser(credentials);
      saveSession(data.userData || data.user, data.token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.registerUser(userData);
      saveSession(data.userData || data.user, data.token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  };

  const logout = () => {
    clearSession();
  };

  // Helper to update user state from other hooks (like useUser)
  const updateUserState = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  // --- 3. Initialization (On Refresh) ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        clearSession();
      }
    }
    setLoading(false);
  }, []);

  // --- 4. The Global Value Object ---
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUserState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
