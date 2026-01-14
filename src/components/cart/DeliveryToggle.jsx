import React from "react";
import { Store, Truck } from "lucide-react";

export default function DeliveryToggle({ deliveryType, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 p-1.5 bg-cream/50 rounded-2xl">
      <button
        onClick={() => onChange("delivery")}
        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
          deliveryType === "delivery"
            ? "bg-white text-dark shadow-sm"
            : "text-dark/40 hover:text-dark/60"
        }`}
      >
        <Truck
          size={16}
          className={deliveryType === "delivery" ? "text-accent" : ""}
        />
        Delivery
      </button>
      <button
        onClick={() => onChange("pickup")}
        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
          deliveryType === "pickup"
            ? "bg-white text-dark shadow-sm"
            : "text-dark/40 hover:text-dark/60"
        }`}
      >
        <Store
          size={16}
          className={deliveryType === "pickup" ? "text-accent" : ""}
        />
        Pickup
      </button>
    </div>
  );
}