import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authService from "../services/user/authService";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: true,

      // Computed
      isAuthenticated: () => !!get().user,

      // Actions
      login: async (credentials) => {
        try {
          const data = await authService.loginUser(credentials);
          const userData = data.userData || data.user;
          const normalizedUser = { ...userData, _id: userData._id || userData.id };

          set({ user: normalizedUser, token: data.token });
          return { success: true };
        } catch (err) {
          return {
            success: false,
            message: err.response?.data?.message || err.message,
          };
        }
      },

      register: async (userData) => {
        try {
          const data = await authService.registerUser(userData);
          const user = data.userData || data.user;
          const normalizedUser = { ...user, _id: user._id || user.id };

          set({ user: normalizedUser, token: data.token });
          return { success: true };
        } catch (err) {
          return {
            success: false,
            message: err.response?.data?.message || err.message,
          };
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      updateUser: (updatedData) => {
        const currentUser = get().user;
        set({ user: { ...currentUser, ...updatedData } });
      },

      setLoading: (loading) => set({ loading }),

      // Initialize - call this on app start
      initialize: () => {
        set({ loading: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;
