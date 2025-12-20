/**
 * StatsCard Component
 * Dashboard statistics card
 * Standalone - receives all data via props
 */

import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({
  title,
  value,
  change,
  trend = 'up',
  icon: Icon,
  prefix = '',
  suffix = '',
}) {
  const isPositive = trend === 'up';
  const changeValue = Math.abs(change);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-dark/5">
      {/* Icon & Change */}
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        {Icon && (
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-cream rounded-lg sm:rounded-xl flex items-center justify-center">
            <Icon size={16} className="text-accent sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </div>
        )}
        <div
          className={`flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs lg:text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {isPositive ? <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" /> : <TrendingDown size={12} className="sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />}
          {isPositive ? '+' : '-'}
          {changeValue}%
        </div>
      </div>

      {/* Title */}
      <p className="text-[10px] sm:text-xs text-dark/50 uppercase tracking-wider mb-0.5 sm:mb-1">{title}</p>

      {/* Value */}
      <p className="text-lg sm:text-xl lg:text-3xl font-serif text-dark">
        {prefix}
        {typeof value === 'number' ? value.toLocaleString() : value}
        {suffix}
      </p>
    </div>
  );
}
