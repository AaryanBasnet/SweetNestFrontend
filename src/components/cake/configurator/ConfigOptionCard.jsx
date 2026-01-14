import React from "react";
import PropTypes from "prop-types";
import { Check } from "lucide-react";

/**
 * ConfigOptionCard - Reusable option selection card
 * Matches the existing design system with accent color highlights
 */
export const ConfigOptionCard = ({
  label,
  description,
  price,
  image,
  isSelected,
  onClick,
  disabled = false,
  badge,
  variant = "default", // 'default' | 'color' | 'flavor'
  colorValue,
}) => {
  // For color variant
  if (variant === "color") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`group relative aspect-square rounded-full border-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed
          ${
            isSelected
              ? "border-accent scale-110 shadow-lg ring-2 ring-accent/20"
              : "border-dark/15 hover:scale-105 hover:border-dark/30 hover:shadow-md"
          }`}
        style={{ backgroundColor: colorValue }}
        title={label}
        aria-label={label}
        aria-pressed={isSelected}
      >
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full p-1 shadow-md">
              <Check size={14} className="text-accent" strokeWidth={3} />
            </div>
          </div>
        )}
      </button>
    );
  }

  // For flavor variant (with image)
  if (variant === "flavor") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed
          ${
            isSelected
              ? "border-accent shadow-lg scale-[1.02]"
              : "border-transparent hover:border-dark/20 hover:shadow-md"
          }`}
        aria-label={label}
        aria-pressed={isSelected}
      >
        {/* Flavor Image */}
        <div className="aspect-square relative overflow-hidden">
          <img
            src={image}
            alt={label}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          {/* Overlay */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isSelected
                ? "bg-accent/20"
                : "bg-dark/10 group-hover:bg-dark/20"
            }`}
          />
          {/* Check mark */}
          {isSelected && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-lg">
              <Check size={14} className="text-white" strokeWidth={3} />
            </div>
          )}
          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3 bg-dark/80 text-white text-[10px] font-medium px-2 py-1 rounded-full">
              {badge}
            </div>
          )}
          {/* Color indicator */}
          {colorValue && (
            <div
              className="absolute bottom-3 left-3 w-5 h-5 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: colorValue }}
            />
          )}
        </div>
        {/* Label */}
        <div
          className={`p-3 text-center transition-colors ${
            isSelected
              ? "bg-accent text-white"
              : "bg-white text-dark"
          }`}
        >
          <p className="text-sm font-medium">{label}</p>
          {description && (
            <p
              className={`text-xs mt-0.5 ${
                isSelected ? "text-white/90" : "text-dark/60"
              }`}
            >
              {description}
            </p>
          )}
        </div>
      </button>
    );
  }

  // Default variant (used for tiers, sizes, toppers)
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 px-4 rounded-lg border text-sm font-medium transition-all duration-200 text-left flex justify-between items-center disabled:opacity-40 disabled:cursor-not-allowed
        ${
          isSelected
            ? "border-accent text-accent bg-accent/5 shadow-sm"
            : "border-dark/20 text-dark/70 hover:border-dark/40 hover:text-dark"
        }`}
      aria-label={label}
      aria-pressed={isSelected}
    >
      <div className="flex-1">
        <div className="font-medium">{label}</div>
        {description && (
          <div
            className={`text-xs mt-0.5 ${
              isSelected ? "text-accent/80" : "text-dark/50"
            }`}
          >
            {description}
          </div>
        )}
      </div>
      {price !== undefined && price !== null && (
        <div className={`ml-3 font-medium ${isSelected ? "text-accent" : "text-dark/70"}`}>
          {price > 0 ? `+रू ${price}` : "Free"}
        </div>
      )}
      {isSelected && (
        <div className="ml-3 text-accent">
          <Check size={18} strokeWidth={2.5} />
        </div>
      )}
    </button>
  );
};

ConfigOptionCard.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  price: PropTypes.number,
  image: PropTypes.string,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  badge: PropTypes.string,
  variant: PropTypes.oneOf(["default", "color", "flavor"]),
  colorValue: PropTypes.string,
};

ConfigOptionCard.defaultProps = {
  isSelected: false,
  disabled: false,
  variant: "default",
};
