/**
 * Cart Store
 * Hybrid store: localStorage for guests, server-synced for logged-in users
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as cartApi from "../api/cartApi";

const STORAGE_KEY = "sweetnest-cart";

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      deliveryType: "delivery",
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
        return deliveryType === "delivery" ? 100 : 0;
      },

      

     // In stores/cartStore.js - Replace getTotal with this:
      getTotal: () => {
        const { getSubtotal, getShipping, promoCode } = get();
        const subtotal = getSubtotal();
        const shipping = getShipping();
        
        let discount = 0;

        // Debug Log
        // console.log("🔥 DEBUG: Calculating Total. PromoCode State:", promoCode);

        if (promoCode) {
           // Check 1: Direct Amount
           if (promoCode.discountAmount !== undefined && promoCode.discountAmount !== null) {
               discount = Number(promoCode.discountAmount);
           } 
           // Check 2: Percentage Object
           else if (typeof promoCode === 'object' && promoCode.discountType) {
               if (promoCode.discountType === 'percentage') {
                   discount = (subtotal * (Number(promoCode.discountValue) || 0)) / 100;
                   if (promoCode.maxDiscount) {
                       const max = Number(promoCode.maxDiscount);
                       if (discount > max) discount = max;
                   }
               } else {
                   discount = Number(promoCode.discountValue) || 0;
               }
           }
        }

        const total = subtotal + shipping - discount;
        return total > 0 ? total : 0;
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
          return (
            itemCakeId === cakeId &&
            item.selectedWeight?.weightInKg === weightInKg
          );
        });
      },

      // Find cart item
      findCartItem: (cakeId, weightInKg) => {
        const { items } = get();
        return items.find((item) => {
          const itemCakeId = item.cakeId || item.cake?._id || item.cake;
          return (
            itemCakeId === cakeId &&
            item.selectedWeight?.weightInKg === weightInKg
          );
        });
      },

      // Add to cart
      addToCart: async (cartItem, isLoggedIn = false) => {
        const { items } = get();
        const {
          cakeId,
          quantity = 1,
          selectedWeight,
          customization,
          cake,
        } = cartItem;

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
            return {
              success: false,
              message: error.response?.data?.message || "Failed to add",
            };
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
              return { success: false, message: "Maximum quantity is 10" };
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
          return {
            success: false,
            message: "Quantity must be between 1 and 10",
          };
        }

        // Check if this is a custom cake
        const item = items.find((i) => i._id === itemId);
        const isCustomCake =
          item &&
          typeof item._id === "string" &&
          item._id.startsWith("local_custom-");

        // Custom cakes always use localStorage, even if logged in
        if (!isLoggedIn || isCustomCake) {
          // Guest mode or custom cake
          const newItems = items.map((item) =>
            item._id === itemId ? { ...item, quantity } : item
          );
          set({ items: newItems });
          return { success: true };
        } else {
          // Logged in user with regular cake
          try {
            set({ isLoading: true, error: null });
            const response = await cartApi.updateCartItemApi(itemId, quantity);
            const data = response.data?.data;

            // Preserve custom cakes
            const customCakes = items.filter((item) => {
              const cakeId = item.cakeId || item.cake?._id || item.cake;
              return typeof cakeId === "string" && cakeId.startsWith("custom-");
            });

            set({
              items: [...(data?.items || []), ...customCakes],
              isLoading: false,
            });
            return { success: true };
          } catch (error) {
            set({ isLoading: false, error: error.message });
            return {
              success: false,
              message: error.response?.data?.message || "Failed to update",
            };
          }
        }
      },

      // Remove from cart
      removeFromCart: async (itemId, isLoggedIn = false) => {
        const { items } = get();

        // Check if this is a custom cake
        const item = items.find((i) => i._id === itemId);
        const isCustomCake =
          item &&
          typeof item._id === "string" &&
          item._id.startsWith("local_custom-");

        // Custom cakes always use localStorage, even if logged in
        if (!isLoggedIn || isCustomCake) {
          // Guest mode or custom cake
          set({ items: items.filter((item) => item._id !== itemId) });
          return { success: true };
        } else {
          // Logged in user with regular cake
          try {
            set({ isLoading: true, error: null });
            await cartApi.removeFromCartApi(itemId);

            // Preserve custom cakes
            const remainingItems = items.filter((item) => item._id !== itemId);

            set({
              items: remainingItems,
              isLoading: false,
            });
            return { success: true };
          } catch (error) {
            set({ isLoading: false, error: error.message });
            return {
              success: false,
              message: error.response?.data?.message || "Failed to remove",
            };
          }
        }
      },

      // Fetch cart from server
      fetchCart: async () => {
        try {
          set({ isLoading: true, error: null });

          // Save custom cakes before fetching (they're not on server)
          const { items: currentItems } = get();
          const customCakes = currentItems.filter((item) => {
            const cakeId = item.cakeId || item.cake?._id || item.cake;
            return typeof cakeId === "string" && cakeId.startsWith("custom-");
          });

          const response = await cartApi.getCartApi();
          const data = response.data?.data;

          // Merge server items with custom cakes
          const serverItems = data?.items || [];
          const mergedItems = [...serverItems, ...customCakes];

          set({
            items: mergedItems,
            deliveryType: data?.deliveryType || "delivery",
            promoCode: data?.promoCode || null,
            isLoading: false,
            isSynced: true,
          });
          return { success: true, data };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch",
          };
        }
      },

      // Sync localStorage cart with server (on login)
      syncWithServer: async () => {
        const { items } = get();

        // Separate custom cakes from regular cakes
        const customCakes = items.filter((item) => {
          const cakeId = item.cakeId || item.cake?._id || item.cake;
          return typeof cakeId === "string" && cakeId.startsWith("custom-");
        });

        // Transform regular items for API (exclude custom cakes)
        const cartItems = items
          .filter((item) => {
            const cakeId = item.cakeId || item.cake?._id || item.cake;
            return !(
              typeof cakeId === "string" && cakeId.startsWith("custom-")
            );
          })
          .map((item) => ({
            cakeId: item.cakeId || item.cake?._id || item.cake,
            quantity: item.quantity || 1,
            selectedWeight: item.selectedWeight,
          }))
          .filter((item) => item.cakeId && item.selectedWeight);

        if (cartItems.length === 0) {
          // Just fetch and merge with custom cakes
          const result = await get().fetchCart();
          return result;
        }

        try {
          set({ isLoading: true, error: null });
          const response = await cartApi.syncCartApi(cartItems);
          const data = response.data?.data;

          // Merge server items with custom cakes
          const serverItems = data?.items || [];
          const mergedItems = [...serverItems, ...customCakes];

          set({
            items: mergedItems,
            isLoading: false,
            isSynced: true,
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return {
            success: false,
            message: error.response?.data?.message || "Failed to sync",
          };
        }
      },

      // Update delivery type
      setDeliveryType: async (type, isLoggedIn = false) => {
        if (isLoggedIn) {
          try {
            await cartApi.updateDeliveryTypeApi(type);
          } catch (error) {
            console.error("Failed to update delivery type:", error);
          }
        }
        set({ deliveryType: type });
      },

      // Apply promo code
      applyPromo: async (code, isLoggedIn = false) => {
        if (isLoggedIn) {
          try {
            set({ isLoading: true, error: null });
            
            // 1. Call API
            const response = await cartApi.applyPromoCodeApi(code);
            
            // 2. LOG THE EXACT RESPONSE
            console.log("🔥 DEBUG: Full API Response:", response);
            console.log("🔥 DEBUG: Response Data:", response.data);
            
            // Handle different potential API structures
            // Sometimes APIs return response.data, sometimes response.data.data
            const backendData = response.data?.data || response.data;
            
            console.log("🔥 DEBUG: Extracted Data:", backendData);
            console.log("🔥 DEBUG: Discount Amount:", backendData?.discountAmount);

            // 3. Save to Store
            const promoObject = {
                code: backendData?.promoCode || code,
                // Ensure we save it as a Number, defaulting to 0 if missing
                discountAmount: Number(backendData?.discountAmount || 0),
                discountType: backendData?.discountType,
                discountValue: backendData?.discountValue
            };
            
            console.log("🔥 DEBUG: Saving this to Store:", promoObject);

            set({
              promoCode: promoObject,
              isLoading: false,
            });
            
            return { success: true, discount: backendData?.discountAmount };
          } catch (error) {
            console.error("🔥 DEBUG: Error applying promo:", error);
            set({ isLoading: false, error: error.message });
            return { success: false, message: error.response?.data?.message || 'Invalid promo code' };
          }
        } else {
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
            console.error("Failed to remove promo:", error);
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
            return {
              success: false,
              message: error.response?.data?.message || "Failed to clear",
            };
          }
        } else {
          set({ items: [], promoCode: null });
          return { success: true };
        }
      },

      // Reset store (on logout)
      reset: () => {
        // Preserve custom cakes when logging out
        const { items } = get();
        const customCakes = items.filter((item) => {
          const cakeId = item.cakeId || item.cake?._id || item.cake;
          return typeof cakeId === "string" && cakeId.startsWith("custom-");
        });

        set({
          items: customCakes,
          deliveryType: "delivery",
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
        promoCode: state.promoCode,
      }),
    }
  )
);

export default useCartStore;
