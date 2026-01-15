/**
 * Order History Tab Component
 * Displays all user orders with filtering and sorting
 */

import { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

// Components
import OrderCardSkeleton from './OrderCardSkeleton';
import OrderCard from './OrderCard';


/**
 * Empty State Component
 */
function EmptyState() {
  return (
    <div className="bg-white rounded-2xl p-12 text-center border border-dark/5">
      <Package size={48} className="text-dark/20 mx-auto mb-4" aria-hidden="true" />
      <h3 className="text-lg font-medium text-dark mb-2">No orders yet</h3>
      <p className="text-dark/50 text-sm mb-4">
        When you place orders, they'll appear here.
      </p>
      <Link
        to="/menu"
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
      >
        Start Shopping
      </Link>
    </div>
  );
}

/**
 * Error State Component
 */
function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-white rounded-2xl p-12 text-center border border-red-100">
      <Package size={48} className="text-red-300 mx-auto mb-4" aria-hidden="true" />
      <h3 className="text-lg font-medium text-dark mb-2">Failed to load orders</h3>
      <p className="text-dark/50 text-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-dark text-white rounded-full hover:bg-dark/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

ErrorState.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};

/**
 * Order History Tab Main Component
 */
function OrderHistoryTab({ orders, isLoading, error, onRetry }) {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-serif text-dark mb-6">
        Order History
      </h1>

      {isLoading ? (
        <div className="space-y-3" aria-busy="true" aria-label="Loading orders">
          {[1, 2, 3].map((i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} variant="history" />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

OrderHistoryTab.propTypes = {
  orders: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onRetry: PropTypes.func,
};

export default memo(OrderHistoryTab);

