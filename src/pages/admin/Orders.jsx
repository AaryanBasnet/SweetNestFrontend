import { useState, useEffect } from "react"; // 1. Added useEffect
import { Search, Filter, Download } from "lucide-react";
import { useOrders, useUpdateOrderStatus } from "../../hooks/admin";
import useAdminStore from "../../stores/adminStore";
import { ORDER_STATUSES } from "../../services/admin/ordersService";
import {
  PageHeader,
  DataTable,
  StatusBadge,
} from "../../components/admin/shared"; // Removed ConfirmModal if unused
import { toast } from "react-toastify";

export default function Orders() {
  // 2. Keep Search local for typing speed, but remove Status local state
  const [searchQuery, setSearchQuery] = useState("");

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
      render: (_, row) => (
        <span className="capitalize">{row.paymentStatus}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => {
        // 1. Check if the order is in a "dead" state
        const isLocked =
          row.paymentStatus === "failed" || row.orderStatus === "cancelled";

        return (
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
    </div>
  );
}
