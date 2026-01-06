/**
 * Wishlist Store
 * Hybrid store: localStorage for guests, server-synced for logged-in users
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as wishlistApi from '../api/wishlistApi';

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

      // Add to wishlist (works for both guest and logged-in)
      addToWishlist: async (cakeId, isLoggedIn = false) => {
        const { items, isInWishlist } = get();

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
            return { success: true };
          } catch (error) {
            set({ isLoading: false, error: error.message });
            return { success: false, message: error.response?.data?.message || 'Failed to add' };
          }
        } else {
          // Guest: store just the ID
          set({ items: [...items, cakeId] });
          return { success: true };
        }
      },

      // Remove from wishlist
      removeFromWishlist: async (cakeId, isLoggedIn = false) => {
        const { items } = get();

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
            return { success: true };
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
          return { success: true };
        }
      },

      // Toggle wishlist item
      toggleWishlist: async (cakeId, isLoggedIn = false) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get();

        if (isInWishlist(cakeId)) {
          return removeFromWishlist(cakeId, isLoggedIn);
        } else {
          return addToWishlist(cakeId, isLoggedIn);
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
      clearWishlist: async (isLoggedIn = false) => {
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

      // ... existing actions ...

      // Set reminder for a wishlist item (Logged-in users only)
      setReminder: async (cakeId, date, note) => {
        const { items } = get();

        // 1. Optimistic Update: Update UI immediately before server responds
        const previousItems = [...items]; // Keep copy in case we need to revert
        
        set({
          items: items.map((item) => {
             // Handle if item is just an ID string (guest/unhydrated) or object
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
