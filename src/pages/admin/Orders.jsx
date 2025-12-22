/**
 * Admin Orders Page
 * Order management with filtering and status updates
 */

import { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { useOrders, useUpdateOrderStatus } from '../../hooks/admin';
import useAdminStore from '../../stores/adminStore';
import { ORDER_STATUSES } from '../../services/admin/ordersService';
import { PageHeader, DataTable, StatusBadge, ConfirmModal } from '../../components/admin/shared';
import { getMockRecentOrders } from '../../services/admin/dashboardService';
import { toast } from 'react-toastify';

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { ordersFilters, setOrdersFilter, selectedOrders, toggleOrderSelection, setSelectedOrders } =
    useAdminStore();

  // Fetch orders
  const { data: ordersData, isLoading } = useOrders(ordersFilters);
  const orders = ordersData?.data || getMockRecentOrders();

  // Update status mutation
  const updateStatus = useUpdateOrderStatus();

  // Table columns
  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (value) => <span className="font-medium text-accent">#{value}</span>,
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (value, row) => (
        <div>
          <p className="font-medium text-dark">{value}</p>
          <p className="text-xs text-dark/50">{row.items} items</p>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
    },
    {
      key: 'total',
      label: 'Total',
      render: (value) => <span className="font-medium">Rs. {value}</span>,
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="text-sm border border-dark/10 rounded-lg px-2 py-1 focus:outline-none focus:border-accent"
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      ),
    },
  ];

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status: newStatus });
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleExport = () => {
    toast.info('Exporting orders...');
  };

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
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent"
        >
          <option value="">All Status</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        {/* Filter Button */}
        <button className="flex items-center gap-2 px-4 py-2 border border-dark/10 rounded-lg text-sm hover:bg-dark/5 transition-colors">
          <Filter size={18} />
          More Filters
        </button>
      </div>

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        selectedRows={selectedOrders}
        onSelectRow={toggleOrderSelection}
        onSelectAll={(checked) => setSelectedOrders(checked ? orders.map((o) => o.id) : [])}
        pagination={{
          page: ordersFilters.page,
          totalPages: 5,
          total: 50,
          from: 1,
          to: 10,
        }}
        onPageChange={(page) => setOrdersFilter('page', page)}
        emptyMessage="No orders found"
      />
    </div>
  );
}
