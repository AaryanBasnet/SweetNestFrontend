import { Calendar, Shield, Tag } from 'lucide-react'; // Added Tag icon
import useCartStore from '../../stores/cartStore';
import useCheckoutStore from '../../stores/checkoutStore';

export default function CheckoutOrderSummary() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const shipping = useCartStore((state) => state.getShipping());
  const total = useCartStore((state) => state.getTotal());
  const promoCode = useCartStore((state) => state.promoCode); // 1. Get promoCode

  const { shippingData } = useCheckoutStore();

  // 2. Calculate Discount Amount for Display
  const discountAmount = subtotal + shipping - total;

  // Format delivery date
  const formatDeliveryDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const deliveryDate = formatDeliveryDate(shippingData.deliveryDate);

  return (
    <div className="bg-white rounded-2xl p-5 border border-dark/5 sticky top-8">
      <h3 className="text-lg font-semibold text-dark mb-4">Order Summary</h3>

      {/* Cart Items */}
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item._id || item.cake?._id} className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream/50 shrink-0">
              <img
                src={item.cake?.images?.[0]?.url || '/placeholder-cake.jpg'}
                alt={item.cake?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark truncate">
                {item.cake?.name}
              </p>
              <p className="text-xs text-dark/50">
                {item.selectedWeight?.label} × {item.quantity}
              </p>
            </div>
            <p className="text-sm font-semibold text-dark">
              Rs. {(item.selectedWeight?.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Estimated Delivery */}
      {deliveryDate && (
        <div className="bg-accent/10 rounded-xl p-3 mb-4 flex items-center gap-3">
          <Calendar size={18} className="text-accent shrink-0" />
          <div>
            <p className="text-sm font-medium text-dark">Estimated Delivery</p>
            <p className="text-xs text-accent">{deliveryDate}</p>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-2 pt-4 border-t border-dark/10">
        <div className="flex justify-between text-sm">
          <span className="text-dark/60">Subtotal</span>
          <span className="font-medium text-dark">Rs. {subtotal.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-dark/60">Shipping</span>
          <span className="font-medium text-accent">Rs. {shipping.toLocaleString()}</span>
        </div>

        {/* 3. Discount Row - Only show if promo is applied */}
        {promoCode && (
          <div className="flex justify-between text-sm text-green-600 bg-green-50 p-1.5 rounded-lg">
            <div className="flex items-center gap-1.5">
               <Tag size={14} />
               <span>Discount ({promoCode?.code || promoCode})</span>
            </div>
            <span className="font-medium">- Rs. {discountAmount.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between pt-3 mt-3 border-t border-dark/10">
        <span className="font-semibold text-dark">Total</span>
        <span className="font-bold text-lg text-accent">
          Rs. {total.toLocaleString()}
        </span>
      </div>

      {/* Security Note */}
      <div className="mt-4 flex items-center gap-2 text-xs text-dark/40">
        <Shield size={14} className="text-emerald-500" />
        <span>Your payment is encrypted and secured.</span>
      </div>
    </div>
  );
}