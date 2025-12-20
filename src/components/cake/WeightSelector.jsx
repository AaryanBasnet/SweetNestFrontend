/**
 * WeightSelector Component
 * Weight option buttons for cake selection
 */

export default function WeightSelector({
  weights = [],
  selectedWeight,
  onSelect,
  onWeightGuide
}) {
  if (weights.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-dark/60">Select Weight</span>
        {onWeightGuide && (
          <button
            onClick={onWeightGuide}
            className="text-sm text-accent hover:underline"
          >
            Weight Guide
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {weights.map((weight) => (
          <button
            key={weight.value}
            onClick={() => onSelect(weight)}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border text-sm font-medium transition-all ${
              selectedWeight?.value === weight.value
                ? 'border-accent text-accent bg-accent/5'
                : 'border-dark/20 text-dark hover:border-dark/40'
            }`}
          >
            {weight.label}
          </button>
        ))}
      </div>
    </div>
  );
}
