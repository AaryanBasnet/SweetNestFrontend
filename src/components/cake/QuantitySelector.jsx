/**
 * QuantitySelector Component
 * Quantity increment/decrement control
 */

import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({
  quantity = 1,
  onChange,
  min = 1,
  max = 99
}) {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center border border-dark/20 rounded-lg">
      <button
        onClick={handleDecrement}
        disabled={quantity <= min}
        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-dark/60 hover:text-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Minus size={18} />
      </button>

      <span className="w-10 sm:w-12 text-center font-medium text-dark">
        {quantity}
      </span>

      <button
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-dark/60 hover:text-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
