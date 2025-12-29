/**
 * Checkout Page
 * Multi-step checkout flow: Shipping → Payment → Confirmation
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

// Stores
import useCheckoutStore from '../stores/checkoutStore';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';

// API
import { createOrderApi, initiateEsewaPaymentApi } from '../api/orderApi';

// Components
import CheckoutStepIndicator from '../components/checkout/CheckoutStepIndicator';
import CheckoutOrderSummary from '../components/checkout/CheckoutOrderSummary';
import ShippingStep from '../components/checkout/ShippingStep';
import PaymentStep from '../components/checkout/PaymentStep';
import OrderConfirmation from '../components/checkout/OrderConfirmation';

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Stores
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    validateShipping,
    getOrderPayload,
    setOrderResult,
    paymentMethod,
    isCreatingOrder,
    setLoading,
    setError,
    resetCheckout,
  } = useCheckoutStore();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  // Ref to track if we've handled the callback
  const callbackHandled = useRef(false);

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});

  // Check for eSewa callback on mount
  useEffect(() => {
    if (callbackHandled.current) return;

    const status = searchParams.get('status');
    const orderNumber = searchParams.get('orderNumber');
    const orderId = searchParams.get('orderId');
    const message = searchParams.get('message');

    if (status) {
      callbackHandled.current = true;

      if (status === 'success' && orderNumber && orderId) {
        // Payment successful
        setOrderResult(orderId, orderNumber);
        setCurrentStep(3); // <--- ADD THIS LINE (Safety net)
        
        toast.success('Payment successful! Your order has been placed.');
        clearCart(); // Clear local UI cart
      } else if (status === 'failed' || status === 'error') {
        // Payment failed
        setCurrentStep(2); // Go back to payment step
        toast.error(message ? decodeURIComponent(message) : 'Payment failed. Please try again.');
        // NOTE: We do NOT clear cart here. This is Correct.
      }

      // Clean up URL
      window.history.replaceState({}, '', '/checkout');
    }
  }, [searchParams, setOrderResult, setCurrentStep, clearCart]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.info('Please login to checkout');
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, navigate]);

  // Redirect if cart is empty (except on confirmation step)
  useEffect(() => {
    if (currentStep !== 3 && cartItems.length === 0) {
      toast.info('Your cart is empty');
      navigate('/cart');
    }
  }, [cartItems, currentStep, navigate]);

  // Handle shipping step next
  const handleShippingNext = () => {
    const { isValid, errors } = validateShipping();

    if (!isValid) {
      // Show validation errors
      setValidationErrors(errors);
      toast.error('Please fill in all required fields');
      return;
    }

    setValidationErrors({});
    nextStep();
  };

  // Handle payment proceed
  const handlePaymentProceed = async () => {
    setLoading('order', true);
    setError(null);

    try {
      // Create order
      const orderPayload = getOrderPayload();
      const response = await createOrderApi(orderPayload);

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to create order');
      }

      const order = response.data.data;

      if (paymentMethod === 'esewa') {
        // Initiate eSewa payment
        setLoading('payment', true);
        const paymentResponse = await initiateEsewaPaymentApi(order._id);

        if (!paymentResponse.data?.success) {
          throw new Error('Failed to initiate payment');
        }

        const { paymentUrl, formData } = paymentResponse.data.data;

        // Create and submit form to eSewa
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentUrl;
        form.target = '_self'; // Ensure same-window navigation
        form.style.display = 'none'; // Hide form

        // Add form data as hidden inputs
        Object.entries(formData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        // Debug logging
        console.log('eSewa Form Data:', {
          paymentUrl,
          formData,
          formFields: Object.keys(formData),
        });

        // Append to body and submit
        document.body.appendChild(form);

        // Use setTimeout to ensure form is in DOM before submission
        setTimeout(() => {
          try {
            form.submit();
            console.log('Form submitted successfully');
          } catch (submitError) {
            console.error('Form submission error:', submitError);
            toast.error('Failed to redirect to eSewa payment gateway');
            setLoading('payment', false);
          }
        }, 100);
      } else {
        // COD - Order is already confirmed
        setOrderResult(order._id, order.orderNumber, order);
        toast.success('Order placed successfully!');
        // Clear cart
        clearCart();
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading('order', false);
      setLoading('payment', false);
    }
  };

  // Don't render if not authenticated or cart is empty
  if (!isAuthenticated()) return null;
  if (currentStep !== 3 && cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="mx-[20px] sm:mx-[40px] lg:mx-[80px] py-8">
        {/* Step Indicator */}
        <CheckoutStepIndicator currentStep={currentStep} />

        {/* Content */}
        {currentStep === 3 ? (
          // Confirmation step - full width
          <OrderConfirmation />
        ) : (
          // Shipping/Payment steps - with sidebar
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {currentStep === 1 && (
                <ShippingStep
                  onNext={handleShippingNext}
                  errors={validationErrors}
                />
              )}

              {currentStep === 2 && (
                <PaymentStep
                  onBack={prevStep}
                  onProceed={handlePaymentProceed}
                  isLoading={isCreatingOrder}
                />
              )}
            </main>

            {/* Order Summary Sidebar */}
            <aside className="lg:w-[350px] shrink-0">
              <CheckoutOrderSummary />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
