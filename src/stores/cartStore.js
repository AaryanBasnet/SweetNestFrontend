/**
 * Cart Store
 * Hybrid store: localStorage for guests, server-synced for logged-in users
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as cartApi from '../api/cartApi';

const STORAGE_KEY = 'sweetnest-cart';

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      deliveryType: 'delivery',
      promoCode: null,
      isLoading: false,
      error: null,
      isSynced: false,

      // Computed values (for guest mode - server provides these when logged in)
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.selectedWeight?.price || 0;
          return total + price * (item.quantity || 1);
        }, 0);
      },

      getShipping: () => {
        const { deliveryType } = get();
        return deliveryType === 'delivery' ? 100 : 0;
      },

      getTotal: () => {
        const { getSubtotal, getShipping } = get();
        return getSubtotal() + getShipping();
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + (item.quantity || 1), 0);
      },

      // Check if item is in cart
      isInCart: (cakeId, weightInKg) => {
        const { items } = get();
        return items.some((item) => {
          const itemCakeId = item.cakeId || item.cake?._id || item.cake;
          return itemCakeId === cakeId && item.selectedWeight?.weightInKg === weightInKg;
        });
      },

      // Find cart item
      findCartItem: (cakeId, weightInKg) => {
        const { items } = get();
        return items.find((item) => {
          const itemCakeId = item.cakeId || item.cake?._id || item.cake;
          return itemCakeId === cakeId && item.selectedWeight?.weightInKg === weightInKg;
        });
      },

      // Add to cart
      addToCart: async (cartItem, isLoggedIn = false) => {
        const { items } = get();
        const { cakeId, quantity = 1, selectedWeight, customization, cake } = cartItem;

        if (isLoggedIn) {
          try {
            set({ isLoading: true, error: null });
            const response = await cartApi.addToCartApi({
              cakeId,
              quantity,
              selectedWeight,
              customization,
            });
            const data = response.data?.data;
            set({
              items: data?.items || [],
              isLoading: false,
              isSynced: true,
            });
            return { success: true };
          } catch (error) {
            set({ isLoading: false, error: error.message });
            return { success: false, message: error.response?.data?.message || 'Failed to add' };
          }
        } else {
          // Guest mode: store locally
          const existingIndex = items.findIndex(
            (item) =>
              (item.cakeId || item.cake?._id) === cakeId &&
              item.selectedWeight?.weightInKg === selectedWeight?.weightInKg
          );

          if (existingIndex > -1) {
            // Update quantity
            const newItems = [...items];
            const newQty = newItems[existingIndex].quantity + quantity;
            if (newQty > 10) {
              return { success: false, message: 'Maximum quantity is 10' };
            }
            newItems[existingIndex].quantity = newQty;
            set({ items: newItems });
          } else {
            // Add new item
            const newItem = {
              _id: `local_${Date.now()}`, // Temporary ID for guest
              cakeId,
              cake, // Store cake data for display
              quantity,
              selectedWeight,
              customization,
              addedAt: new Date().toISOString(),
            };
            set({ items: [...items, newItem] });
          }
          return { success: true };
        }
      },

      // Update item quantity
      updateQuantity: async (itemId, quantity, isLoggedIn = false) => {
        const { items } = get();

        if (quantity < 1 || quantity > 10) {
          return { success: false, message: 'Quantity must be between 1 and 10' };
        }

        if (isLoggedIn) {
          try {
            set({ isLoading: true, error: null });
            const response = await cartApi.updateCartItemApi(itemId, quantity);
            const data = response.data?.data;
            set({
              items: data?.items || [],
              isLoading: false,
            });
            return { success: true };
          } catch (error) {
            set({ isLoading: false, error: error.message });
            return { success: false, message: error.response?.data?.message || 'Failed to update' };
          }
        } else {
          // Guest mode
          const newItems = items.map((item) =>
            item._id === itemId ? { ...item, quantity } : item
          );
          set({ items: newItems });
          return { success: true };
        }
      },

      // Remove from cart
      removeFromCart: async (itemId, isLoggedIn = false) => {
        const { items } = get();

        if (isLoggedIn) {
          try {
            set({ isLoading: true, error: null });
            await cartApi.removeFromCartApi(itemId);
            set({
              items: items.filter((item) => item._id !== itemId),
              isLoading: false,
            });
            return { success: true };
          } catch (error) {
            set({ isLoading: false, error: error.message });
            return { success: false, message: error.response?.data?.message || 'Failed to remove' };
          }
        } else {
          set({ items: items.filter((item) => item._id !== itemId) });
          return { success: true };
        }
      },

      // Fetch cart from server
      fetchCart: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await cartApi.getCartApi();
          const data = response.data?.data;
          set({
            items: data?.items || [],
            deliveryType: data?.deliveryType || 'delivery',
            promoCode: data?.promoCode || null,
            isLoading: false,
            isSynced: true,
          });
          return { success: true, data };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.response?.data?.message || 'Failed to fetch' };
        }
      },

      // Sync localStorage cart with server (on login)
      syncWithServer: async () => {
        const { items } = get();

        // Transform items for API
        const cartItems = items.map((item) => ({
          cakeId: item.cakeId || item.cake?._id || item.cake,
          quantity: item.quantity || 1,
          selectedWeight: item.selectedWeight,
        })).filter((item) => item.cakeId && item.selectedWeight);

        if (cartItems.length === 0) {
          return get().fetchCart();
        }

        try {
          set({ isLoading: true, error: null });
          const response = await cartApi.syncCartApi(cartItems);
          const data = response.data?.data;
          set({
            items: data?.items || [],
            isLoading: false,
            isSynced: true,
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.response?.data?.message || 'Failed to sync' };
        }
      },

      // Update delivery type
      setDeliveryType: async (type, isLoggedIn = false) => {
        if (isLoggedIn) {
          try {
            await cartApi.updateDeliveryTypeApi(type);
          } catch (error) {
            console.error('Failed to update delivery type:', error);
          }
        }
        set({ deliveryType: type });
      },

      // Apply promo code
      applyPromo: async (code, isLoggedIn = false) => {
        if (isLoggedIn) {
          try {
            set({ isLoading: true, error: null });
            const response = await cartApi.applyPromoCodeApi(code);
            set({
              promoCode: response.data?.data?.promoCode || code,
              isLoading: false,
            });
            return { success: true, discount: response.data?.data?.discountAmount };
          } catch (error) {
            set({ isLoading: false, error: error.message });
            return { success: false, message: error.response?.data?.message || 'Invalid promo code' };
          }
        } else {
          // Guest mode: just store the code (validation happens at checkout)
          set({ promoCode: code });
          return { success: true };
        }
      },

      // Remove promo code
      removePromo: async (isLoggedIn = false) => {
        if (isLoggedIn) {
          try {
            await cartApi.removePromoCodeApi();
          } catch (error) {
            console.error('Failed to remove promo:', error);
          }
        }
        set({ promoCode: null });
      },

      // Clear cart
      clearCart: async (isLoggedIn = false) => {
        if (isLoggedIn) {
          try {
            set({ isLoading: true, error: null });
            await cartApi.clearCartApi();
            set({ items: [], promoCode: null, isLoading: false });
            return { success: true };
          } catch (error) {
            set({ isLoading: false, error: error.message });
            return { success: false, message: error.response?.data?.message || 'Failed to clear' };
          }
        } else {
          set({ items: [], promoCode: null });
          return { success: true };
        }
      },

      // Reset store (on logout)
      reset: () => {
        set({
          items: [],
          deliveryType: 'delivery',
          promoCode: null,
          isLoading: false,
          error: null,
          isSynced: false,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        items: state.items,
        deliveryType: state.deliveryType,
      }),
    }
  )
);

export default useCartStore;
