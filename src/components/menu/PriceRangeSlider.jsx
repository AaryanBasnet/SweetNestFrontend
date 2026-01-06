/**
 * PriceRangeSlider Component
 * Simple price range filter with input fields and visual bar
 */

import { useState, useEffect } from "react";

export default function PriceRangeSlider({
  min = 300,
  max = 6000,
  value = [300, 6000],
  onChange,
}) {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);

  useEffect(() => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }, [value]);

  // Handle min input change
  const handleMinChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setMinValue(val === "" ? "" : Number(val));
  };

  // Handle max input change
  const handleMaxChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setMaxValue(val === "" ? "" : Number(val));
  };

  // Apply filter on blur or enter
  const applyFilter = () => {
    let newMin =
      minValue === ""
        ? min
        : Math.max(min, Math.min(Number(minValue), max - 100));
    let newMax =
      maxValue === ""
        ? max
        : Math.min(max, Math.max(Number(maxValue), min + 100));

    // Ensure min is less than max
    if (newMin >= newMax) {
      newMin = Math.max(min, newMax - 100);
    }

    setMinValue(newMin);
    setMaxValue(newMax);
    onChange?.(newMin, newMax);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
      applyFilter();
    }
  };

  // Calculate visual bar position
  const leftPercent = (((minValue || min) - min) / (max - min)) * 100;
  const rightPercent = 100 - (((maxValue || max) - min) / (max - min)) * 100;

  // Quick price buttons
  const quickRanges = [
    { label: "Under Rs. 500", min: 300, max: 500 },
    { label: "Rs. 500 - Rs. 1000", min: 500, max: 1000 },
    { label: "Rs. 1000 - Rs. 2000", min: 1000, max: 2000 },
    { label: "Above Rs. 2000", min: 2000, max: 6000 },
  ];

  const handleQuickRange = (range) => {
    setMinValue(range.min);
    setMaxValue(range.max);
    onChange?.(range.min, range.max);
  };

  const isActiveRange = (range) => {
    return minValue === range.min && maxValue === range.max;
  };

  return (
    <div className="space-y-4">
      {/* Input fields */}
      <div className="flex flex-col gap-2">
        <div className="flex-1">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dark/40 text-xs">
              Rs.{" "}
            </span>
            <input
              type="text"
              value={minValue}
              onChange={handleMinChange}
              onBlur={applyFilter}
              onKeyDown={handleKeyDown}
              placeholder={min.toString()}
              className="w-full pl-7 pr-2 py-2 bg-cream/50 border border-dark/10 rounded-lg text-sm text-dark text-center focus:outline-none focus:border-dark/30 transition-colors"
            />
          </div>
        </div>
        <span className="text-dark/30 text-sm text-center">to</span>
        <div className="flex-1">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dark/40 text-xs">
              Rs.
            </span>
            <input
              type="text"
              value={maxValue}
              onChange={handleMaxChange}
              onBlur={applyFilter}
              onKeyDown={handleKeyDown}
              placeholder={max.toString()}
              className="w-full pl-7 pr-2 py-2 bg-cream/50 border border-dark/10 rounded-lg text-sm text-dark text-center focus:outline-none focus:border-dark/30 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Visual range bar */}
      <div className="relative h-1.5 bg-dark/10 rounded-full">
        <div
          className="absolute h-full bg-accent rounded-full transition-all duration-200"
          style={{
            left: `${leftPercent}%`,
            right: `${rightPercent}%`,
          }}
        />
      </div>

      {/* Quick select buttons */}
      <div className="flex flex-wrap gap-1.5">
        {quickRanges.map((range) => (
          <button
            key={range.label}
            onClick={() => handleQuickRange(range)}
            className={`px-2 py-1 text-[10px] rounded-md border transition-colors ${
              isActiveRange(range)
                ? "bg-dark text-white border-dark"
                : "border-dark/15 text-dark/50 hover:border-dark/30 hover:text-dark/70"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
