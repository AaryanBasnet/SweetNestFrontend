/**
 * Admin Analytics Page
 * Comprehensive sales analytics and business insights
 */

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  RefreshCw,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { PageHeader } from '../../components/admin/shared';
import {
  useOverviewAnalytics,
  useRevenueTrends,
  useTopProducts,
  useCategoryPerformance,
  useCustomerAnalytics,
  useTimeTrends,
  useOrderStatusBreakdown,
} from '../../hooks/admin/useAnalytics';
import { RevenueChart } from '../../components/admin/dashboard';

// Format currency in NPR
const formatCurrency = (amount) => {
  return `Rs. ${Math.round(amount).toLocaleString()}`;
};

// Format percentage
const formatPercentage = (value) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

// Stats Card Component
const StatsCard = ({ title, value, change, icon: Icon, prefix = '' }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl p-6 border border-dark/5">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
          <Icon size={24} className={isPositive ? 'text-green-600' : 'text-red-600'} />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {formatPercentage(change)}
        </div>
      </div>
      <p className="text-sm text-dark/50 mb-1">{title}</p>
      <p className="text-2xl font-serif text-dark">
        {prefix}
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-dark/10 rounded w-48 mb-4"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-xl p-6 border border-dark/5">
          <div className="h-12 bg-dark/10 rounded mb-4"></div>
          <div className="h-4 bg-dark/10 rounded w-24 mb-2"></div>
          <div className="h-8 bg-dark/10 rounded w-32"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function Analytics() {
  const [dateFilter, setDateFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  // Fetch analytics data
  const { data: overview, isLoading: overviewLoading } = useOverviewAnalytics(dateRange);
  const { data: revenueTrends, isLoading: trendsLoading } = useRevenueTrends({
    period: 'daily',
    limit: 30,
  });
  const { data: topProducts } = useTopProducts({ limit: 10 });
  const { data: categories } = useCategoryPerformance(dateRange);
  const { data: customerAnalytics } = useCustomerAnalytics();
  const { data: timeTrends } = useTimeTrends();
  const { data: orderStatus } = useOrderStatusBreakdown();

  // Handle date filter preset
  const handleDateFilter = (filter) => {
    setDateFilter(filter);
    const now = new Date();
    let start;

    switch (filter) {
      case 'today':
        start = new Date(now.setHours(0, 0, 0, 0));
        setDateRange({ startDate: start.toISOString(), endDate: new Date().toISOString() });
        break;
      case 'week':
        start = new Date(now.setDate(now.getDate() - 7));
        setDateRange({ startDate: start.toISOString(), endDate: new Date().toISOString() });
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        setDateRange({ startDate: start.toISOString(), endDate: new Date().toISOString() });
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        setDateRange({ startDate: start.toISOString(), endDate: new Date().toISOString() });
        break;
      default:
        setDateRange({ startDate: null, endDate: null });
    }
  };

  if (overviewLoading) {
    return (
      <div>
        <PageHeader title="Analytics" description="Business performance insights" />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-dark">Analytics</h1>
          <p className="text-dark/60 mt-1">Comprehensive business insights</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Filter */}
          <div className="flex gap-2">
            {['today', 'week', 'month', 'year', 'all'].map((filter) => (
              <button
                key={filter}
                onClick={() => handleDateFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateFilter === filter
                    ? 'bg-accent text-white'
                    : 'bg-white text-dark/70 hover:bg-dark/5 border border-dark/10'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button className="p-2 bg-white border border-dark/10 rounded-lg hover:bg-dark/5 transition-colors">
            <RefreshCw size={18} className="text-dark/60" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(overview?.revenue?.current || 0)}
          change={overview?.revenue?.change || 0}
          icon={DollarSign}
        />
        <StatsCard
          title="Total Orders"
          value={overview?.orders?.current || 0}
          change={overview?.orders?.change || 0}
          icon={ShoppingCart}
        />
        <StatsCard
          title="Total Customers"
          value={overview?.customers?.total || 0}
          change={overview?.customers?.change || 0}
          icon={Users}
        />
        <StatsCard
          title="Products Sold"
          value={overview?.products?.sold || 0}
          change={5.4}
          icon={Package}
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 border border-dark/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-serif text-dark">Revenue Trends</h3>
            <p className="text-sm text-dark/50 mt-1">Last 30 days performance</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-accent border border-accent/20 rounded-lg hover:bg-accent/5 transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
        {trendsLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : (
          <RevenueChart
            data={
              revenueTrends?.map((item) => ({
                day: item.date,
                revenue: item.revenue,
              })) || []
            }
            title=""
            subtitle=""
          />
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <h3 className="text-lg font-serif text-dark mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts && topProducts.length > 0 ? (
              topProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-cream/30 rounded-lg">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark truncate">{product.name}</p>
                    <p className="text-sm text-dark/50">
                      {product.quantitySold} sold • {product.orders} orders
                    </p>
                  </div>
                  <p className="text-sm font-medium text-accent whitespace-nowrap">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-dark/50 py-8">No sales data available</p>
            )}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <h3 className="text-lg font-serif text-dark mb-6">Sales by Category</h3>
          <div className="space-y-4">
            {categories && categories.length > 0 ? (
              categories.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark">{category.name}</span>
                    <span className="text-sm text-dark/50">{formatCurrency(category.revenue)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-dark/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-dark w-12 text-right">
                      {category.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-dark/50 py-8">No category data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Customer Insights & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Insights */}
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <h3 className="text-lg font-serif text-dark mb-6">Customer Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Customers</p>
                <p className="text-2xl font-serif text-blue-900 mt-1">
                  {customerAnalytics?.total || 0}
                </p>
              </div>
              <Users size={32} className="text-blue-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-xs text-green-700 font-medium">Repeat Rate</p>
                <p className="text-xl font-serif text-green-900 mt-1">
                  {customerAnalytics?.repeatRate?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-xs text-purple-700 font-medium">Avg. Lifetime Value</p>
                <p className="text-xl font-serif text-purple-900 mt-1">
                  {formatCurrency(customerAnalytics?.avgLifetimeValue || 0)}
                </p>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-xl">
              <p className="text-sm text-orange-700 font-medium">New Customers</p>
              <p className="text-2xl font-serif text-orange-900 mt-1">
                {overview?.customers?.new || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <h3 className="text-lg font-serif text-dark mb-6">Order Status</h3>
          <div className="space-y-3">
            {orderStatus?.orderStatus?.map((status, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-dark/5 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      status.status === 'delivered'
                        ? 'bg-green-500'
                        : status.status === 'pending'
                        ? 'bg-yellow-500'
                        : status.status === 'cancelled'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <span className="text-sm font-medium text-dark capitalize">
                    {status.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-dark">{status.count}</p>
                  <p className="text-xs text-dark/50">{formatCurrency(status.totalValue)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-dark/10">
            <h4 className="text-sm font-medium text-dark mb-4">Payment Methods</h4>
            <div className="space-y-3">
              {orderStatus?.paymentMethods?.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-dark/70 capitalize">{method.method}</span>
                  <span className="font-medium text-dark">
                    {method.count} orders • {formatCurrency(method.totalValue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Performing */}
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <h3 className="text-lg font-serif text-dark mb-4">Best Performing</h3>
          <div className="space-y-3">
            {timeTrends?.bestDay && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-sm font-medium text-green-700">Best Day</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-900">{timeTrends.bestDay.day}</p>
                  <p className="text-xs text-green-600">
                    {formatCurrency(timeTrends.bestDay.revenue)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <span className="text-sm font-medium text-green-700">Avg. Order Value</span>
              <span className="text-sm font-bold text-green-900">
                {formatCurrency(overview?.averageOrderValue || 0)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <span className="text-sm font-medium text-green-700">Orders This Period</span>
              <span className="text-sm font-bold text-green-900">
                {overview?.orders?.current || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Areas to Improve */}
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <h3 className="text-lg font-serif text-dark mb-4">Areas to Improve</h3>
          <div className="space-y-3">
            {timeTrends?.worstDay && (
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                <span className="text-sm font-medium text-amber-700">Lowest Sales Day</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-900">{timeTrends.worstDay.day}</p>
                  <p className="text-xs text-amber-600">
                    {formatCurrency(timeTrends.worstDay.revenue)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
              <span className="text-sm font-medium text-amber-700">Pending Orders</span>
              <span className="text-sm font-bold text-amber-900">
                {overview?.orders?.pending || 0}
              </span>
            </div>

            {customerAnalytics?.repeatRate < 50 && (
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                <span className="text-sm font-medium text-amber-700">Customer Retention</span>
                <span className="text-sm font-bold text-amber-900">Needs attention</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
