/**
 * Checkout Store
 * Manages checkout flow state (shipping, payment, order confirmation)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialShippingData = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  postalCode: '',
  phone: '',
  deliveryDate: null,
  deliveryTime: '',
  specialRequests: '',
  subscribeNewsletter: false,
};

const useCheckoutStore = create(
  persist(
    (set, get) => ({
      // Current step (1: Shipping, 2: Payment, 3: Confirmation)
      currentStep: 1,

      // Shipping form data
      shippingData: { ...initialShippingData },

      // Payment method ('esewa' or 'cod')
      paymentMethod: 'esewa',

      // Order result after successful creation
      orderId: null,
      orderNumber: null,
      orderData: null,

      // Loading states
      isCreatingOrder: false,
      isProcessingPayment: false,

      // Error state
      error: null,

      // Actions
      setShippingData: (data) =>
        set((state) => ({
          shippingData: { ...state.shippingData, ...data },
        })),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 3),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      setOrderResult: (orderId, orderNumber, orderData = null) =>
        set({
          orderId,
          orderNumber,
          orderData,
          currentStep: 3,
        }),

      setLoading: (key, value) => {
        if (key === 'order') set({ isCreatingOrder: value });
        if (key === 'payment') set({ isProcessingPayment: value });
      },

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Reset checkout (after order completion or abandonment)
      resetCheckout: () =>
        set({
          currentStep: 1,
          shippingData: { ...initialShippingData },
          paymentMethod: 'esewa',
          orderId: null,
          orderNumber: null,
          orderData: null,
          isCreatingOrder: false,
          isProcessingPayment: false,
          error: null,
        }),

      // Pre-fill shipping from user profile
      prefillFromUser: (user) => {
        if (!user) return;
        const nameParts = user.name?.split(' ') || [];
        set((state) => ({
          shippingData: {
            ...state.shippingData,
            email: user.email || '',
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            phone: user.phone || '',
          },
        }));
      },

      // Validate shipping step
      validateShipping: () => {
        const { shippingData } = get();
        const errors = {};

        if (!shippingData.email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(shippingData.email))
          errors.email = 'Invalid email format';

        if (!shippingData.firstName) errors.firstName = 'First name is required';
        if (!shippingData.lastName) errors.lastName = 'Last name is required';
        if (!shippingData.address) errors.address = 'Address is required';
        if (!shippingData.city) errors.city = 'City is required';
        if (!shippingData.phone) errors.phone = 'Phone number is required';
        else if (shippingData.phone.length < 10)
          errors.phone = 'Phone must be at least 10 digits';

        if (!shippingData.deliveryDate) errors.deliveryDate = 'Please select a delivery date';
        if (!shippingData.deliveryTime) errors.deliveryTime = 'Please select a time slot';

        return {
          isValid: Object.keys(errors).length === 0,
          errors,
        };
      },

      // Get order payload for API
      getOrderPayload: () => {
        const { shippingData, paymentMethod } = get();
        return {
          contactEmail: shippingData.email,
          shippingAddress: {
            firstName: shippingData.firstName,
            lastName: shippingData.lastName,
            address: shippingData.address,
            apartment: shippingData.apartment,
            city: shippingData.city,
            postalCode: shippingData.postalCode,
            phone: shippingData.phone,
          },
          deliverySchedule: {
            date: shippingData.deliveryDate,
            timeSlot: shippingData.deliveryTime,
          },
          specialRequests: shippingData.specialRequests,
          subscribeNewsletter: shippingData.subscribeNewsletter,
          paymentMethod,
        };
      },
    }),
    {
      name: 'checkout-storage',
      partialize: (state) => ({
        shippingData: state.shippingData,
        paymentMethod: state.paymentMethod,
        currentStep: state.currentStep,
      }),
    }
  )
);

export default useCheckoutStore;
