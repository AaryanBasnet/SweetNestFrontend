/**
 * RevenueChart Component
 * Bar chart for revenue data
 * Standalone - receives data via props
 */

export default function RevenueChart({ data = [], title = 'Revenue Report', subtitle }) {
  // Find max value for scaling
  const maxValue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-dark/5">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-serif text-dark">{title}</h3>
        {subtitle && <p className="text-xs sm:text-sm text-dark/50">{subtitle}</p>}
      </div>

      {/* Chart */}
      <div className="h-32 sm:h-48 flex items-end justify-between gap-1 sm:gap-3">
        {data.map((item, index) => {
          const height = (item.revenue / maxValue) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              {/* Bar */}
              <div className="w-full flex justify-center">
                <div
                  className="w-5 sm:w-8 lg:w-10 bg-accent rounded-t-md sm:rounded-t-lg transition-all duration-500 hover:bg-accent/80"
                  style={{ height: `${height}%`, minHeight: '8px' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-dark/5">
        {data.map((item, index) => (
          <span key={index} className="text-[10px] sm:text-xs text-dark/40 uppercase flex-1 text-center">
            {item.day}
          </span>
        ))}
      </div>
    </div>
  );
}
