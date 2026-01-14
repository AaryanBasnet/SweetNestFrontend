import React from "react";

export default function PriceRow({ label, value, isAccent = false, isBold = false }) {
  return (
    <div className="flex justify-between items-center">
      <span
        className={`text-sm ${
          isBold ? "font-medium text-dark" : "text-dark/60"
        }`}
      >
        {label}
      </span>
      <span
        className={`${
          isBold ? "text-lg font-semibold" : "text-sm font-medium"
        } ${isAccent ? "text-accent" : "text-dark"}`}
      >
        {typeof value === "number" ? `Rs. ${value}` : value}
      </span>
    </div>
  );
}