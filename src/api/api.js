import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: false, // Set to false for localhost - different ports are cross-origin
  timeout: 30000, // 30 second timeout,
  
});

// Helper to get token from Zustand persisted store
const getToken = () => {
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed?.state?.token || null;
    }
    return null;
  } catch {
    return null;
  }
};

instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Only set Content-Type to JSON if not sending FormData
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// Handle auth errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log network errors for debugging
    if (!error.response) {
      console.error("Network error or timeout:", error.message);
    }

    // Handle 401 Unauthorized - token invalid/expired, redirect to login
    // BUT skip redirect for login/register endpoints (those handle their own errors)
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/users/login') ||
                             error.config?.url?.includes('/users/register');

      if (!isAuthEndpoint) {
        // Only redirect if not a login/register attempt
        localStorage.removeItem("auth-storage");
        window.location.href = "/login";
      }
    }
    // 403 Forbidden (not admin) - let calling code handle it
    return Promise.reject(error);
  }
);

export default instance;
