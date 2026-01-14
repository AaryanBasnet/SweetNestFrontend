/**
 * Wishlist Store
 * Hybrid store: localStorage for guests, server-synced for logged-in users
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as wishlistApi from '../api/wishlistApi';
import useAuthStore from "./authStore";

const STORAGE_KEY = 'sweetnest-wishlist';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      // State
      items: [], // Array of cake IDs (guest) or full items (logged in)
      isLoading: false,
      error: null,
      isSynced: false, // Whether synced with server

      // Check if item is in wishlist
      isInWishlist: (cakeId) => {
        const { items } = get();
        return items.some((item) => {
          // Handle both formats: simple ID string or object with cake property
          const id = typeof item === 'string' ? item : item.cake?._id || item.cake;
          return id === cakeId;
        });
      },

      // Add to wishlist
      addToWishlist: async (cakeId) => {
        const { items, isInWishlist } = get();
        // AUTO-DETECT AUTH STATUS
        const isLoggedIn = useAuthStore.getState().isAuthenticated();

        if (isInWishlist(cakeId)) {
          return { success: false, message: 'Already in wishlist' };
        }

        if (isLoggedIn) {
          try {
            set({ isLoading: true, error: null });
            const response = await wishlistApi.addToWishlistApi(cakeId);
            set({
              items: response.data?.data?.items || [],
              isLoading: false,
              isSynced: true,
            });
            // FIXED: Return action type
            return { success: true, action: 'added' };
          } catch (error) {
            set({ isLoading: false, error: error.message });
            return { success: false, message: error.response?.data?.message || 'Failed to add' };
          }
        } else {
          // Guest: store just the ID
          set({ items: [...items, cakeId] });
          // FIXED: Return action type
          return { success: true, action: 'added' };
        }
      },

      // Remove from wishlist
      removeFromWishlist: async (cakeId) => {
        const { items } = get();
        // AUTO-DETECT AUTH STATUS
        const isLoggedIn = useAuthStore.getState().isAuthenticated();

        if (isLoggedIn) {
          try {
            set({ isLoading: true, error: null });
            await wishlistApi.removeFromWishlistApi(cakeId);
            set({
              items: items.filter((item) => {
                const id = typeof item === 'string' ? item : item.cake?._id || item.cake;
                return id !== cakeId;
              }),
              isLoading: false,
            });
            // FIXED: Return action type
            return { success: true, action: 'removed' };
          } catch (error) {
            set({ isLoading: false, error: error.message });
            return { success: false, message: error.response?.data?.message || 'Failed to remove' };
          }
        } else {
          // Guest: remove by ID
          set({
            items: items.filter((item) => {
              const id = typeof item === 'string' ? item : item.cake?._id || item.cake;
              return id !== cakeId;
            }),
          });
          // FIXED: Return action type
          return { success: true, action: 'removed' };
        }
      },

      // Toggle wishlist item
      toggleWishlist: async (cakeId) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get();

        // No need to pass isLoggedIn here, the sub-functions handle it
        if (isInWishlist(cakeId)) {
          return removeFromWishlist(cakeId);
        } else {
          return addToWishlist(cakeId);
        }
      },

      // Fetch wishlist from server (logged-in users)
      fetchWishlist: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await wishlistApi.getWishlistApi();
          set({
            items: response.data?.data?.items || [],
            isLoading: false,
            isSynced: true,
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.response?.data?.message || 'Failed to fetch' };
        }
      },

      // Sync localStorage wishlist with server (on login)
      syncWithServer: async () => {
        const { items } = get();

        // Extract just IDs from items
        const cakeIds = items.map((item) =>
          typeof item === 'string' ? item : item.cake?._id || item.cake
        ).filter(Boolean);

        if (cakeIds.length === 0) {
          // Just fetch server wishlist
          return get().fetchWishlist();
        }

        try {
          set({ isLoading: true, error: null });
          const response = await wishlistApi.syncWishlistApi(cakeIds);
          set({
            items: response.data?.data?.items || [],
            isLoading: false,
            isSynced: true,
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.response?.data?.message || 'Failed to sync' };
        }
      },

      // Clear wishlist
      clearWishlist: async () => {
        const isLoggedIn = useAuthStore.getState().isAuthenticated();

        if (isLoggedIn) {
          try {
            set({ isLoading: true, error: null });
            await wishlistApi.clearWishlistApi();
            set({ items: [], isLoading: false });
            return { success: true };
          } catch (error) {
            set({ isLoading: false, error: error.message });
            return { success: false, message: error.response?.data?.message || 'Failed to clear' };
          }
        } else {
          set({ items: [] });
          return { success: true };
        }
      },

      // Set reminder (Logged-in users only)
      setReminder: async (cakeId, date, note) => {
        const { items } = get();

        // 1. Optimistic Update
        const previousItems = [...items]; 
        
        set({
          items: items.map((item) => {
             const currentId = typeof item === 'string' ? item : item.cake?._id || item.cake;
             
             if (currentId === cakeId && typeof item !== 'string') {
               return {
                 ...item,
                 reminder: {
                   enabled: true,
                   date: date,
                   note: note
                 }
               };
             }
             return item;
          })
        });

        try {
          // 2. Call Server API
          await wishlistApi.setReminderApi(cakeId, { date, note });
          return { success: true };
        } catch (error) {
          // 3. Revert on failure
          set({ items: previousItems, error: error.message });
          return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to set reminder' 
          };
        }
      },

      // Reset store (on logout)
      reset: () => {
        set({ items: [], isLoading: false, error: null, isSynced: false });
      },

      // Get item count
      getCount: () => get().items.length,
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useWishlistStore;