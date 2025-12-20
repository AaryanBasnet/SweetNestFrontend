/**
 * SortDropdown Component
 * Standalone sort selector for menu page
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function SortDropdown({ value, options = [], onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-dark/10 rounded-lg text-xs sm:text-sm hover:border-dark/20 transition-colors min-w-0 sm:min-w-[180px] justify-between"
      >
        <span className="text-dark/60 hidden sm:inline">Sort by:</span>
        <span className="font-medium truncate max-w-[80px] sm:max-w-none">{selectedOption?.label}</span>
        <ChevronDown
          size={14}
          className={`text-dark/40 transition-transform flex-shrink-0 sm:w-4 sm:h-4 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 min-w-full sm:w-full bg-white border border-dark/10 rounded-lg shadow-lg py-1 z-20">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-cream transition-colors whitespace-nowrap ${
                option.value === value ? 'text-accent font-medium' : 'text-dark'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
