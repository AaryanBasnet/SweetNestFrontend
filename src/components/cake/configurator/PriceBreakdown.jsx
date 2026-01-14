import React from "react";
import PropTypes from "prop-types";
import { Info } from "lucide-react";
import { formatNPR } from "./cakeConfigConstants";

/**
 * PriceBreakdown - Shows itemized price details for the custom cake
 * Displays base price, modifiers, and total with clear breakdown
 */
export const PriceBreakdown = ({ config, basePrice, topperPrice, tierMultiplier, totalPrice }) => {
  return (
    <div className="bg-cream/50 border border-dark/10 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-dark/10">
        <h3 className="text-sm font-medium text-dark">Price Breakdown</h3>
        <div className="text-xs text-dark/50 flex items-center gap-1">
          <Info size={12} />
          <span>Estimated</span>
        </div>
      </div>

      {/* Base Price */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-dark/70">
          Base Price ({config.size})
        </span>
        <span className="font-medium text-dark">{formatNPR(basePrice)}</span>
      </div>

      {/* Tier Multiplier */}
      {tierMultiplier > 1 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-dark/70">
            {config.tiers} (×{tierMultiplier})
          </span>
          <span className="font-medium text-dark">
            +{formatNPR(Math.round(basePrice * (tierMultiplier - 1)))}
          </span>
        </div>
      )}

      {/* Topper Price */}
      {topperPrice > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-dark/70">
            {config.topper}
          </span>
          <span className="font-medium text-dark">+{formatNPR(topperPrice)}</span>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center pt-3 border-t border-dark/10">
        <span className="text-base font-medium text-dark">Total</span>
        <span className="text-xl font-medium text-accent">{formatNPR(totalPrice)}</span>
      </div>
    </div>
  );
};

PriceBreakdown.propTypes = {
  config: PropTypes.shape({
    size: PropTypes.string.isRequired,
    tiers: PropTypes.string.isRequired,
    topper: PropTypes.string.isRequired,
  }).isRequired,
  basePrice: PropTypes.number.isRequired,
  topperPrice: PropTypes.number.isRequired,
  tierMultiplier: PropTypes.number.isRequired,
  totalPrice: PropTypes.number.isRequired,
};

/**
 * ConfigSummary - Compact summary of selected configuration
 */
export const ConfigSummary = ({ config, totalPrice, servings }) => {
  return (
    <div className="bg-white border border-dark/10 rounded-lg p-4">
      <div className="flex justify-between items-baseline mb-4 pb-3 border-b border-dark/10">
        <div>
          <h3 className="text-sm font-medium text-dark">Your Custom Cake</h3>
          <p className="text-xs text-dark/50 mt-1">
            {config.tiers} • Serves {servings}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-medium text-accent">{formatNPR(totalPrice)}</div>
        </div>
      </div>

      {/* Configuration Details */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-dark/60">Tiers:</span>
          <span className="text-dark font-medium">{config.tiers}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dark/60">Size:</span>
          <span className="text-dark font-medium">{config.size}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dark/60">Flavor:</span>
          <span className="text-dark font-medium">{config.flavor}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dark/60">Color:</span>
          <span className="text-dark font-medium">{config.color}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dark/60">Topper:</span>
          <span className="text-dark font-medium">{config.topper}</span>
        </div>
        {config.message && (
          <div className="flex justify-between">
            <span className="text-dark/60">Message:</span>
            <span className="text-dark font-medium">"{config.message}"</span>
          </div>
        )}
      </div>

      {/* Delivery Note */}
      <div className="mt-4 pt-3 border-t border-dark/10">
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200/50 rounded-lg p-2">
          <Info size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            Order by <strong>4 PM</strong> for next-day delivery in Kathmandu Valley
          </p>
        </div>
      </div>
    </div>
  );
};

ConfigSummary.propTypes = {
  config: PropTypes.shape({
    tiers: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    flavor: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    topper: PropTypes.string.isRequired,
    message: PropTypes.string,
  }).isRequired,
  totalPrice: PropTypes.number.isRequired,
  servings: PropTypes.string.isRequired,
};
