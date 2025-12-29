/**
 * Order Utility Functions
 * Centralized order status and display utilities
 */

/**
 * Order status configuration
 */
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

/**
 * Status display labels
 */
export const STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'PENDING',
  [ORDER_STATUS.CONFIRMED]: 'CONFIRMED',
  [ORDER_STATUS.PROCESSING]: 'PROCESSING',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'OUT FOR DELIVERY',
  [ORDER_STATUS.DELIVERED]: 'DELIVERED',
  [ORDER_STATUS.CANCELLED]: 'CANCELLED',
};

/**
 * Status color classes (Tailwind)
 */
export const STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-500',
  [ORDER_STATUS.CONFIRMED]: 'bg-blue-500',
  [ORDER_STATUS.PROCESSING]: 'bg-purple-500',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'bg-dark',
  [ORDER_STATUS.DELIVERED]: 'bg-green-500',
  [ORDER_STATUS.CANCELLED]: 'bg-red-500',
};

/**
 * Get status display label
 * @param {string} status - Order status key
 * @returns {string} Formatted display label
 */
export const getStatusDisplay = (status) => {
  return STATUS_LABELS[status] || status?.toUpperCase() || 'UNKNOWN';
};

/**
 * Get status color class
 * @param {string} status - Order status key
 * @returns {string} Tailwind color class
 */
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'bg-dark';
};

/**
 * Check if order can be cancelled
 * @param {string} status - Current order status
 * @returns {boolean}
 */
export const canCancelOrder = (status) => {
  return [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(status);
};

/**
 * Check if order is in progress
 * @param {string} status - Current order status
 * @returns {boolean}
 */
export const isOrderInProgress = (status) => {
  return [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.OUT_FOR_DELIVERY,
  ].includes(status);
};

/**
 * Get order timeline steps
 * @param {string} currentStatus - Current order status
 * @returns {Array} Timeline steps with completion status
 */
export const getOrderTimeline = (currentStatus) => {
  const steps = [
    { key: ORDER_STATUS.PENDING, label: 'Order Placed' },
    { key: ORDER_STATUS.CONFIRMED, label: 'Confirmed' },
    { key: ORDER_STATUS.PROCESSING, label: 'Preparing' },
    { key: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
    { key: ORDER_STATUS.DELIVERED, label: 'Delivered' },
  ];

  const currentIndex = steps.findIndex((step) => step.key === currentStatus);

  return steps.map((step, index) => ({
    ...step,
    isCompleted: index < currentIndex,
    isCurrent: index === currentIndex,
    isPending: index > currentIndex,
  }));
};

