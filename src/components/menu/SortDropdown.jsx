import React from "react";
import { ChevronDown } from "lucide-react";
import { SORT_OPTIONS } from "../../stores/menuStore";

export default function SortDropdown({
  currentSort,
  isOpen,
  setIsOpen,
  onSelect,
}) {
  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || "Featured";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-dark/10 rounded-full text-sm hover:border-dark/30 transition-colors"
      >
        <span className="text-dark/50">Sort by:</span>
        <span className="font-medium text-dark">{currentSortLabel}</span>
        <ChevronDown
          size={16}
          className={`text-dark/40 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-dark/10 py-2 z-20">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-dark/5 transition-colors ${
                  currentSort === option.value
                    ? "text-accent font-medium"
                    : "text-dark/70"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}