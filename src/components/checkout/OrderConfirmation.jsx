/**
 * OrderConfirmation Component
 * Step 3: Order success page
 */

import { useNavigate } from 'react-router-dom';
import { Check, Calendar, Clock } from 'lucide-react';
import useCheckoutStore from '../../stores/checkoutStore';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { orderId, orderNumber, shippingData, resetCheckout } = useCheckoutStore();

  // Format delivery date
  const formatDeliveryDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get time range from time slot
  const getTimeRange = (timeSlot) => {
    if (!timeSlot) return '';
    // Convert "09:00 AM - 12:00 PM" to "Between 9:00 AM - 12:00 PM"
    return `Between ${timeSlot}`;
  };

  const handleTrackOrder = () => {
    // Navigate to track order page with orderId
    if (orderId) {
      navigate(`/track-order/${orderId}`);
      // Don't reset checkout here - user might want to view order details
    } else {
      // Fallback to profile orders tab if orderId is not available
      navigate('/profile?tab=orders');
    }
  };

  const handleBackToHome = () => {
    // Reset checkout when user goes back home
    resetCheckout();
    navigate('/');
  };

  return (
    <div className="max-w-lg mx-auto text-center py-8">
      {/* Success Icon */}
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check size={48} className="text-emerald-500" strokeWidth={3} />
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-serif text-dark mb-3">
        Order Confirmed!
      </h1>

      {/* Message */}
      <p className="text-dark/60 mb-8">
        Thank you for choosing SweetNest. Your order{' '}
        <span className="font-semibold text-dark">#{orderNumber}</span>{' '}
        has been placed successfully.
      </p>

      {/* Estimated Delivery Card */}
      <div className="bg-cream/50 rounded-2xl p-6 mb-8 text-left">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={18} className="text-accent" />
          <span className="font-medium text-dark">Estimated Delivery</span>
        </div>

        <p className="text-lg font-semibold text-dark mb-1">
          {formatDeliveryDate(shippingData.deliveryDate)}
        </p>

        <p className="text-dark/50 text-sm flex items-center gap-1.5">
          <Clock size={14} />
          {getTimeRange(shippingData.deliveryTime)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleTrackOrder}
          className="w-full sm:w-auto flex-1 px-8 py-4 bg-dark text-white font-medium rounded-2xl hover:bg-dark/90 transition-colors"
        >
          Track Order
        </button>

        <button
          onClick={handleBackToHome}
          className="w-full sm:w-auto flex-1 px-8 py-4 border border-dark/20 text-dark font-medium rounded-2xl hover:bg-dark/5 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
