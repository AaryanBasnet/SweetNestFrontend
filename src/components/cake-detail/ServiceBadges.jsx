import React from "react";
import { CheckCircle, Truck } from "lucide-react";

export default function ServiceBadges({ deliveryInfo, badges = [] }) {
  const hasOrganicBadge = badges.includes("organic");
  const nextDayAvailable = deliveryInfo?.nextDayAvailable;

  if (!hasOrganicBadge && !nextDayAvailable) return null;

  return (
    <div className="flex items-center gap-8 mt-6 pt-6 border-t border-dark/10">
      {nextDayAvailable && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
            <Truck size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-xs text-dark/50 uppercase tracking-wide">
              Delivery
            </p>
            <p className="text-sm font-medium text-dark">Next Day Available</p>
          </div>
        </div>
      )}
      {hasOrganicBadge && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle size={18} className="text-green-500" />
          </div>
          <div>
            <p className="text-xs text-dark/50 uppercase tracking-wide">
              Quality
            </p>
            <p className="text-sm font-medium text-dark">100% Organic</p>
          </div>
        </div>
      )}
    </div>
  );
}