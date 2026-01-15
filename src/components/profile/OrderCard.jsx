/**
 * Shared Order Card Component
 * Displays order information with status color coding
 * Used in both Overview and Order History tabs
 */

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight, Truck } from 'lucide-react';
import { formatOrderDate } from '../../utils/dateUtils';
import { getStatusDisplay, getStatusColor } from '../../utils/orderUtils';

/**
 * Order Card Component
 * @param {Object} order - Order data
 * @param {string} variant - 'overview' or 'history' (affects button style)
 */
function OrderCard({ order, variant = 'overview' }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 border border-dark/5">
      {/* Date Badge & Order Info */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <div className="w-20 h-20 bg-accent/10 rounded-xl flex flex-col items-center justify-center">
          <Clock size={16} className="text-accent mb-0.5" aria-hidden="true" />
          <span className="text-accent text-xs font-semibold">
            {formatOrderDate(order.createdAt)}
          </span>
        </div>

        {/* Order Info */}
        <div className="flex-1 min-w-0">
          <p className="text-dark font-medium">
            Order <span className="font-semibold">#{order.orderNumber}</span>
          </p>
          <p className="text-dark/50 text-sm truncate max-w-[200px] sm:max-w-[250px]">
            {order.items?.map((item) => item.name).join(', ')}
          </p>
          <p className="text-sm mt-1">
            <span className="text-dark/40">
              {order.itemCount || order.items?.length} Items
            </span>
            <span className="text-dark text-lg font-heading font-semibold ml-3">Rs. {order.total}</span>
          </p>
        </div>
      </div>

      {/* Status & Action */}
      <div className="flex items-center gap-3 sm:ml-auto">
        <span
          className={`px-3 py-1.5 ${getStatusColor(order.orderStatus)} text-white text-xs font-medium rounded-full`}
        >
          {getStatusDisplay(order.orderStatus)}
        </span>
        <Link
          to={`/track-order/${order._id}`}
          className="px-4 py-2 bg-dark text-white text-sm font-medium rounded-full flex items-center gap-1 hover:bg-dark/90 transition-colors"
        >
          {variant === 'history' ? (
            <>
              <Truck size={14} aria-hidden="true" />
              Track Order
            </>
          ) : (
            <>
              Track Order
              <ChevronRight size={16} aria-hidden="true" />
            </>
          )}
        </Link>
      </div>
    </div>
  );
}

OrderCard.propTypes = {
  order: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    orderNumber: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    items: PropTypes.array,
    itemCount: PropTypes.number,
    total: PropTypes.number.isRequired,
    orderStatus: PropTypes.string.isRequired,
  }).isRequired,
  variant: PropTypes.oneOf(['overview', 'history']),
};

export default OrderCard;
