import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  // Local state controls the input immediately
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Sync local state if parent value changes externally
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce logic: Wait 500ms after user stops typing to trigger onChange
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out ${
        isFocused ? "sm:w-80" : "sm:w-64"
      } w-full`}
    >
      <Search
        size={18}
        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
          isFocused ? "text-dark" : "text-dark/30"
        }`}
      />

      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search flavor, name..."
        className={`
          w-full pl-11 pr-10 py-2.5 
          bg-white border rounded-full text-sm 
          placeholder:text-dark/40 
          focus:outline-none 
          transition-all duration-300 ease-in-out
          ${
            isFocused
              ? "border-dark/30 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] ring-4 ring-dark/5"
              : "border-dark/10 hover:border-dark/20"
          }
        `}
      />

      <button
        onClick={handleClear}
        className={`
          absolute right-3 top-1/2 -translate-y-1/2 
          p-1 rounded-full bg-dark/5 hover:bg-dark/10 text-dark/40 hover:text-dark
          transition-all duration-200 ease-in-out
          ${
            localValue
              ? "opacity-100 scale-100"
              : "opacity-0 scale-90 pointer-events-none"
          }
        `}
        tabIndex={localValue ? 0 : -1}
      >
        <X size={14} />
      </button>
    </div>
  );
}