/**
 * RecentOrdersTable Component
 * Table showing recent orders
 * Standalone - receives data via props
 */

import { Calendar, Download, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../shared/StatusBadge';

export default function RecentOrdersTable({
  orders = [],
  onFilterDate,
  onDownloadReport,
  onViewAll,
}) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate('/admin/orders');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return Math.round(amount).toLocaleString();
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-dark/5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-serif text-dark">Recent Orders</h3>
          <p className="text-xs sm:text-sm text-dark/50">Manage your latest transactions.</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onFilterDate}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 border border-dark/10 rounded-lg text-xs sm:text-sm text-dark/70 hover:bg-dark/5 transition-colors"
          >
            <Calendar size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Filter Date</span>
            <span className="sm:hidden">Filter</span>
          </button>
          <button
            onClick={onDownloadReport}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 border border-dark/10 rounded-lg text-xs sm:text-sm text-dark/70 hover:bg-dark/5 transition-colors"
          >
            <Download size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Download Report</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark/10">
              <th className="text-left py-3 px-4 text-xs font-medium text-dark/50 uppercase tracking-wider">
                Order ID
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-dark/50 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-dark/50 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-dark/50 uppercase tracking-wider">
                Total
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-dark/50 uppercase tracking-wider">
                Status
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-dark/50 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-dark/50 text-sm">
                  No recent orders
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b border-dark/5 hover:bg-cream/50">
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-accent">{order.orderNumber}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-dark">
                        {order.user?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-dark/50">{order.user?.email || '-'}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-dark/70">{formatDate(order.createdAt)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-dark">
                      Rs. {formatCurrency(order.total)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={order.orderStatus} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => navigate(`/admin/orders`)}
                      className="p-2 hover:bg-dark/5 rounded-lg transition-colors"
                    >
                      <MoreHorizontal size={18} className="text-dark/40" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View All Link */}
      <button
        onClick={handleViewAll}
        className="w-full mt-4 pt-4 text-sm text-accent hover:text-accent/80 transition-colors font-medium"
      >
        View All Orders
      </button>
    </div>
  );
}
