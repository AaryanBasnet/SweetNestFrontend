/**
 * Admin Customers Page
 * Customer management and overview
 */

import { useState } from 'react';
import { Search, Filter, Mail, Phone } from 'lucide-react';
import { PageHeader, DataTable } from '../../components/admin/shared';

// Mock customers data
const MOCK_CUSTOMERS = [
  { id: 1, name: 'Saugat Shahi', email: 'saugat@email.com', phone: '+977 9841234567', orders: 12, totalSpent: 15600, joinedAt: '2024-08-15' },
  { id: 2, name: 'Akash Chaudhary', email: 'akash@email.com', phone: '+977 9851234567', orders: 8, totalSpent: 9800, joinedAt: '2024-09-01' },
  { id: 3, name: 'Sabin Khadka', email: 'sabin@email.com', phone: '+977 9861234567', orders: 5, totalSpent: 6500, joinedAt: '2024-09-20' },
  { id: 4, name: 'Krishna Bhandari', email: 'krishna@email.com', phone: '+977 9871234567', orders: 3, totalSpent: 3900, joinedAt: '2024-10-05' },
  { id: 5, name: 'Aaryan Basnet', email: 'aaryan@email.com', phone: '+977 9881234567', orders: 15, totalSpent: 21500, joinedAt: '2024-07-10' },
];

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers] = useState(MOCK_CUSTOMERS);

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-accent font-medium">{value.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-dark">{value}</p>
            <p className="text-xs text-dark/50">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value) => (
        <div className="flex items-center gap-2 text-dark/70">
          <Phone size={14} />
          {value}
        </div>
      ),
    },
    {
      key: 'orders',
      label: 'Orders',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      sortable: true,
      render: (value) => <span className="font-medium text-green-600">Rs. {value.toLocaleString()}</span>,
    },
    {
      key: 'joinedAt',
      label: 'Joined',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <button
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-accent border border-accent/20 rounded-lg hover:bg-accent/5 transition-colors"
        >
          <Mail size={14} />
          Contact
        </button>
      ),
    },
  ];

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Customers"
        description="View and manage your customer base"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <p className="text-sm text-dark/50 mb-1">Total Customers</p>
          <p className="text-3xl font-serif text-dark">{customers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <p className="text-sm text-dark/50 mb-1">Total Revenue</p>
          <p className="text-3xl font-serif text-dark">
            Rs. {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <p className="text-sm text-dark/50 mb-1">Avg. Order Value</p>
          <p className="text-3xl font-serif text-dark">
            Rs. {Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.orders, 0))}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent"
          />
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border border-dark/10 rounded-lg text-sm hover:bg-dark/5 transition-colors">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Customers Table */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        emptyMessage="No customers found"
      />
    </div>
  );
}
