/**
 * StatusBadge Component
 * Displays status with colored badge
 * Standalone - receives status via props
 */

const STATUS_STYLES = {
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
  },
  processing: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    dot: 'bg-blue-500',
  },
  shipped: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    dot: 'bg-purple-500',
  },
  delivered: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    dot: 'bg-green-500',
  },
  cancelled: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    dot: 'bg-red-500',
  },
  active: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    dot: 'bg-green-500',
  },
  inactive: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    dot: 'bg-gray-500',
  },
};

export default function StatusBadge({ status, showDot = true }) {
  const style = STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES.pending;
  const label = status?.charAt(0).toUpperCase() + status?.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
      {label}
    </span>
  );
}
