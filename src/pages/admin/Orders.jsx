import { useState, useEffect } from "react"; // 1. Added useEffect
import { Search, Filter, Download, RefreshCw, X } from "lucide-react";
import { useOrders, useUpdateOrderStatus, useProcessRefund } from "../../hooks/admin";
import useAdminStore from "../../stores/adminStore";
import { ORDER_STATUSES, PAYMENT_STATUSES, getPaymentStatusColor } from "../../services/admin/ordersService";
import {
  PageHeader,
  DataTable,
  StatusBadge,
} from "../../components/admin/shared"; // Removed ConfirmModal if unused
import { toast } from "react-toastify";

export default function Orders() {
  // 2. Keep Search local for typing speed, but remove Status local state
  const [searchQuery, setSearchQuery] = useState("");

  // Refund modal state
  const [refundModal, setRefundModal] = useState({ open: false, order: null });
  const [refundReason, setRefundReason] = useState("");
  const [refundNotes, setRefundNotes] = useState("");

  const {
    ordersFilters,
    setOrdersFilter,
    selectedOrders,
    toggleOrderSelection,
    setSelectedOrders,
  } = useAdminStore();

  // Fetch orders
  const { data: ordersData, isLoading } = useOrders(ordersFilters);

  // 3. safely access data and pagination
  const orders = ordersData?.data || [];
  const pagination = ordersData?.pagination || {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  };

  // Update status mutation
  const updateStatus = useUpdateOrderStatus();

  // Process refund mutation
  const processRefund = useProcessRefund();

  // Open refund modal
  const openRefundModal = (order) => {
    setRefundModal({ open: true, order });
    setRefundReason("");
    setRefundNotes("");
  };

  // Close refund modal
  const closeRefundModal = () => {
    setRefundModal({ open: false, order: null });
    setRefundReason("");
    setRefundNotes("");
  };

  // Handle refund submission
  const handleRefundSubmit = async () => {
    if (!refundModal.order) return;

    try {
      await processRefund.mutateAsync({
        id: refundModal.order._id,
        refundData: {
          amount: refundModal.order.total, // Full refund
          reason: refundReason || "Customer requested refund",
          notes: refundNotes,
        },
      });
      toast.success("Refund processed! Please complete the payment refund manually via eSewa dashboard.");
      closeRefundModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process refund");
    }
  };

  // 4. DEBOUNCE SEARCH: Sync local search input with store after 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only update if value is different to avoid loops
      if (searchQuery !== ordersFilters.search) {
        setOrdersFilter("search", searchQuery);
        setOrdersFilter("page", 1); // Reset to page 1 on search
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, setOrdersFilter, ordersFilters.search]);

  // Handle Status Change (Dropdown in table)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status: newStatus });
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Handle Filter Change (Top Bar)
  const handleFilterChange = (e) => {
    setOrdersFilter("status", e.target.value);
    setOrdersFilter("page", 1); // Reset to page 1 on filter
  };

  

 const handleExport = () => {
    // Check if there is data to export
    if (!orders || orders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    toast.info('Exporting current view...');

    // A. Define the CSV Headers
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Customer Email',
      'Items',
      'Total Amount',
      'Payment Status',
      'Order Status'
    ];

    // B. Convert Data to CSV Rows
    const rows = orders.map(order => [
      order.orderNumber,
      new Date(order.createdAt).toLocaleDateString(),
      // Handle potential missing user/nested data safely
      `"${order.user?.name || 'Guest'}"`, 
      order.contactEmail,
      // Create a summary string of items (e.g., "Choco Cake (x1) | Vanilla (x2)")
      `"${order.items.map(i => `${i.name} (x${i.quantity})`).join(' | ')}"`,
      order.total,
      order.paymentStatus,
      order.orderStatus
    ]);

    // C. Combine Headers and Rows
    const csvContent = [
      headers.join(','), 
      ...rows.map(row => row.join(','))
    ].join('\n');

    // D. Trigger the Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Export complete!');
  };


  





  // Table columns
  const columns = [
    {
      key: "orderNumber",
      label: "Order ID",
      render: (value, row) => (
        <span className="font-medium text-accent">#{row.orderNumber}</span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (_, row) => (
        <div>
          <p className="font-medium text-dark">
            {row.user?.name || row.contactEmail}
          </p>
          <p className="text-xs text-dark/50">
            {/* Handle case where items might be undefined */}
            {row.items?.length || 0} item
            {(row.items?.length || 0) !== 1 ? "s" : ""}
          </p>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (_, row) => (
        <span>{new Date(row.createdAt).toLocaleDateString()}</span>
      ),
      sortable: true,
    },
    {
      key: "total",
      label: "Total",
      render: (value, row) => (
        <span className="font-medium">Rs. {row.total}</span>
      ),
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (_, row) => <StatusBadge status={row.orderStatus} />,
    },
    {
      key: "payment",
      label: "Payment",
      render: (_, row) => {
        const colorMap = {
          pending: "bg-amber-100 text-amber-700",
          paid: "bg-green-100 text-green-700",
          failed: "bg-red-100 text-red-700",
          refunded: "bg-purple-100 text-purple-700",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colorMap[row.paymentStatus] || "bg-gray-100 text-gray-700"}`}>
            {row.paymentStatus}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => {
        // 1. Check if the order is in a "dead" state
        const isLocked =
          row.paymentStatus === "failed" || row.orderStatus === "cancelled";

        // Check if order can be refunded (paid + eSewa payment)
        const canRefund = row.paymentStatus === "paid" && row.paymentMethod === "esewa";

        return (
          <div className="flex items-center gap-2">
            <div
              title={
                isLocked ? "Cannot change status of failed/cancelled orders" : ""
              }
            >
              <select
                value={row.orderStatus}
                onChange={(e) => handleStatusChange(row._id, e.target.value)}
                disabled={isLocked} // 2. Disable the input
                className={`text-sm border rounded-lg px-2 py-1 focus:outline-none focus:border-accent bg-white
                  ${
                    isLocked
                      ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-500"
                      : "border-dark/10"
                  }`}
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            {canRefund && (
              <button
                onClick={() => openRefundModal(row)}
                className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
                title="Process refund"
              >
                Refund
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Manage and track all customer orders"
        actions={
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-dark/10 rounded-lg text-sm font-medium hover:bg-dark/5 transition-colors"
          >
            <Download size={18} />
            Export
          </button>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40"
          />
          <input
            type="text"
            placeholder="Search by Order ID or Promo Code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={ordersFilters.status || ""}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent bg-white"
        >
          <option value="">All Status</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        {/* Filter Button */}
        {/* <button className="flex items-center gap-2 px-4 py-2 border border-dark/10 rounded-lg text-sm hover:bg-dark/5 transition-colors">
          <Filter size={18} />
          More Filters
        </button> */}
      </div>

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        selectedRows={selectedOrders}
        onSelectRow={toggleOrderSelection}
        onSelectAll={(checked) =>
          setSelectedOrders(checked ? orders.map((o) => o._id) : [])
        } // Note: ._id usually, not .id
        // 5. Connect Real Pagination Data
        pagination={{
          page: pagination.page,
          totalPages: pagination.totalPages,
          total: pagination.totalItems,
          // Calculate 'from' and 'to' for display (e.g. "Showing 1-10 of 50")
          from: (pagination.page - 1) * pagination.limit + 1,
          to: Math.min(
            pagination.page * pagination.limit,
            pagination.totalItems
          ),
        }}
        // 6. Connect Page Change to Store
        onPageChange={(page) => setOrdersFilter("page", page)}
        emptyMessage="No orders found"
      />

      {/* Refund Modal */}
      {refundModal.open && refundModal.order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark/10">
              <h3 className="text-lg font-medium text-dark">Process Refund</h3>
              <button
                onClick={closeRefundModal}
                className="p-1 hover:bg-dark/5 rounded-full transition-colors"
              >
                <X size={20} className="text-dark/60" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-4">
              {/* Order Info */}
              <div className="bg-cream/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-dark/60">Order</span>
                  <span className="font-medium text-accent">#{refundModal.order.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-dark/60">Customer</span>
                  <span className="font-medium">{refundModal.order.user?.name || refundModal.order.contactEmail}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-dark/60">Refund Amount</span>
                  <span className="font-medium text-lg">Rs. {refundModal.order.total}</span>
                </div>
              </div>

              {/* Refund Reason */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">
                  Refund Reason
                </label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent"
                >
                  <option value="">Select a reason...</option>
                  <option value="Customer requested cancellation">Customer requested cancellation</option>
                  <option value="Out of stock">Out of stock</option>
                  <option value="Delivery issue">Delivery issue</option>
                  <option value="Quality issue">Quality issue</option>
                  <option value="Wrong item delivered">Wrong item delivered</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={refundNotes}
                  onChange={(e) => setRefundNotes(e.target.value)}
                  placeholder="Any additional notes for this refund..."
                  rows={3}
                  className="w-full px-3 py-2 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent resize-none"
                />
              </div>

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>Important:</strong> This will mark the order as refunded and cancelled.
                  You must manually process the actual payment refund via eSewa dashboard or bank transfer.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-dark/10 bg-cream/30">
              <button
                onClick={closeRefundModal}
                className="px-4 py-2 text-sm font-medium text-dark/70 hover:text-dark transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRefundSubmit}
                disabled={!refundReason || processRefund.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {processRefund.isPending && (
                  <RefreshCw size={16} className="animate-spin" />
                )}
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
