/**
 * PaymentStep Component
 * Step 2: Select payment method (eSewa or COD)
 */

import { useState } from 'react';
import { Check, Wallet, Banknote, ArrowLeft, Loader2 } from 'lucide-react';
import useCheckoutStore from '../../stores/checkoutStore';
import useCartStore from '../../stores/cartStore';

// eSewa logo component
function EsewaLogo() {
  return (
    <div className="bg-[#60BB46] text-white px-4 py-2 rounded-lg text-lg font-bold">
      <span className="text-white">e</span>
      <span className="text-white">Sewa</span>
    </div>
  );
}

export default function PaymentStep({ onBack, onProceed, isLoading }) {
  const { paymentMethod, setPaymentMethod } = useCheckoutStore();
  const total = useCartStore((state) => state.getTotal());

  const paymentOptions = [
    {
      id: 'esewa',
      name: 'eSewa Wallet',
      description: 'Instant Payment',
      icon: <EsewaLogo />,
      color: 'green',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay at Doorstep',
      icon: <Banknote size={32} className="text-dark/40" />,
      color: 'gray',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-serif text-dark text-center mb-8">
        Payment Method
      </h1>

      {/* Payment Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paymentOptions.map((option) => {
          const isSelected = paymentMethod === option.id;

          return (
            <button
              key={option.id}
              onClick={() => setPaymentMethod(option.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? option.id === 'esewa'
                    ? 'border-[#60BB46] bg-white'
                    : 'border-dark bg-white'
                  : 'border-dark/10 bg-white hover:border-dark/20'
              }`}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <div
                  className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${
                    option.id === 'esewa' ? 'bg-[#60BB46]' : 'bg-dark'
                  }`}
                >
                  <Check size={14} className="text-white" />
                </div>
              )}

              {/* Icon */}
              <div className="mb-4">{option.icon}</div>

              {/* Name & Description */}
              <h3 className="font-medium text-dark">{option.name}</h3>
              <p className="text-sm text-dark/50">{option.description}</p>
            </button>
          );
        })}
      </div>

      {/* Payment Details Card */}
      <div className="bg-white rounded-2xl p-6 border border-dark/5">
        {paymentMethod === 'esewa' ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#60BB46]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wallet size={28} className="text-[#60BB46]" />
            </div>
            <h3 className="font-medium text-dark mb-2">Pay with eSewa</h3>
            <p className="text-sm text-dark/60 mb-1">
              You will be redirected to the eSewa secure
            </p>
            <p className="text-sm text-dark/60">
              payment gateway to complete your transaction{' '}
              <span className="text-accent font-semibold">Rs. {total.toLocaleString()}</span>
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-dark/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Banknote size={28} className="text-dark/40" />
            </div>
            <h3 className="font-medium text-dark mb-2">Cash on Delivery</h3>
            <p className="text-sm text-dark/60">
              Pay{' '}
              <span className="text-accent font-semibold">Rs. {total.toLocaleString()}</span>{' '}
              when your order arrives at your doorstep.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-4 border border-dark/20 text-dark font-medium rounded-2xl hover:bg-dark/5 transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          onClick={onProceed}
          disabled={isLoading}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium rounded-2xl transition-colors disabled:opacity-50 ${
            paymentMethod === 'esewa'
              ? 'bg-[#60BB46] text-white hover:bg-[#4fa038]'
              : 'bg-dark text-white hover:bg-dark/90'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processing...
            </>
          ) : paymentMethod === 'esewa' ? (
            'Proceed to eSewa'
          ) : (
            'Place Order'
          )}
        </button>
      </div>
    </div>
  );
}
