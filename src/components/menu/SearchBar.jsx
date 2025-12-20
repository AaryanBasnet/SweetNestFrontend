/**
 * SearchBar Component
 * Standalone search input for menu page
 */

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value = '', onChange, placeholder = 'Search flavor, name...' }) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange?.(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  // Sync external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="relative w-full sm:max-w-md">
      <Search
        size={16}
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-dark/40 sm:w-[18px] sm:h-[18px]"
      />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-dark/10 rounded-full text-sm focus:outline-none focus:border-accent/50 transition-colors placeholder:text-dark/40"
      />
    </div>
  );
}
