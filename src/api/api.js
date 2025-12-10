import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
console.log("BASE URL:", API_URL);

const instance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// IMPROVEMENT: Handle Token Expiry globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optional: Force redirect to login or update context
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
