/**
 * RecentOrdersTable Component
 * Table showing recent orders
 * Standalone - receives data via props
 */

import { useState } from 'react';
import { Calendar, Download, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../shared/StatusBadge';

const DATE_RANGES = [
  { value: 'all', label: 'All recent' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
];

const startOfRange = (range) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  if (range === '7d') start.setDate(start.getDate() - 6);
  return start;
};

/** Quote a value for CSV, so commas and quotes in names stay in one cell. */
const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const downloadCsv = (orders) => {
  const header = ['Order ID', 'Customer', 'Email', 'Date', 'Total (Rs.)', 'Order status', 'Payment status'];
  const rows = orders.map((order) => [
    order.orderNumber,
    order.user?.name || 'Unknown',
    order.user?.email || '',
    new Date(order.createdAt).toISOString().slice(0, 10),
    Math.round(order.total),
    order.orderStatus?.replace(/_/g, ' '),
    order.paymentStatus || '',
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');

  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `sweetnest-recent-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export default function RecentOrdersTable({
  orders: allOrders = [],
  onViewAll,
}) {
  const navigate = useNavigate();
  const [range, setRange] = useState('all');

  const orders =
    range === 'all'
      ? allOrders
      : allOrders.filter((order) => new Date(order.createdAt) >= startOfRange(range));

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
          {/* Same look as the button it replaces, but a working date filter */}
          <label className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 border border-dark/10 rounded-lg text-xs sm:text-sm text-dark/70 hover:bg-dark/5 transition-colors cursor-pointer">
            <Calendar size={14} className="sm:w-4 sm:h-4" />
            <span>{DATE_RANGES.find((r) => r.value === range).label}</span>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              aria-label="Filter recent orders by date"
              className="absolute inset-0 opacity-0 cursor-pointer"
            >
              {DATE_RANGES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => downloadCsv(orders)}
            disabled={orders.length === 0}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 border border-dark/10 rounded-lg text-xs sm:text-sm text-dark/70 hover:bg-dark/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {range === 'all' ? 'No recent orders' : 'No orders in this period'}
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
