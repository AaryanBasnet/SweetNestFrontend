/**
 * Admin Dashboard Page
 * Overview page with stats, charts, and recent data
 */

import { TrendingUp, ShoppingBag, Users, BarChart3 } from 'lucide-react';
import {
  useDashboardStats,
  useRevenueChart,
  useTopSellingProducts,
  useRecentOrders,
} from '../../hooks/admin';
import {
  getMockDashboardStats,
  getMockRevenueData,
  getMockTopProducts,
  getMockRecentOrders,
} from '../../services/admin/dashboardService';
import {
  StatsCard,
  RevenueChart,
  TopSellingList,
  RecentOrdersTable,
} from '../../components/admin/dashboard';

export default function Dashboard() {
  // Fetch data (with mock fallbacks)
  const { data: statsData } = useDashboardStats();
  const { data: revenueData } = useRevenueChart();
  const { data: topProductsData } = useTopSellingProducts();
  const { data: recentOrdersData } = useRecentOrders();

  // Use real data or mock data
  const stats = statsData?.data || getMockDashboardStats();
  const revenue = revenueData?.data || getMockRevenueData();
  const topProducts = topProductsData?.data || getMockTopProducts();
  const recentOrders = recentOrdersData?.data || getMockRecentOrders();

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatsCard
          title="Total Revenue"
          value={stats.totalRevenue?.value || 48295}
          change={stats.totalRevenue?.change || 12.5}
          trend={stats.totalRevenue?.trend || 'up'}
          prefix="Rs. "
          icon={TrendingUp}
        />
        <StatsCard
          title="Active Orders"
          value={stats.activeOrders?.value || 24}
          change={stats.activeOrders?.change || 4}
          trend={stats.activeOrders?.trend || 'up'}
          icon={ShoppingBag}
        />
        <StatsCard
          title="New Customers"
          value={stats.newCustomers?.value || 186}
          change={stats.newCustomers?.change || 8.2}
          trend={stats.newCustomers?.trend || 'up'}
          icon={Users}
        />
        <StatsCard
          title="Avg. Order Value"
          value={stats.avgOrderValue?.value || 85.20}
          change={stats.avgOrderValue?.change || 2.1}
          trend={stats.avgOrderValue?.trend || 'down'}
          prefix="Rs. "
          icon={BarChart3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue Chart - 2 columns */}
        <div className="lg:col-span-2">
          <RevenueChart
            data={revenue}
            title="Revenue Report"
            subtitle="Sales performance over the last 7 days"
          />
        </div>

        {/* Top Selling - 1 column */}
        <TopSellingList products={topProducts} />
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable
        orders={recentOrders}
        onFilterDate={() => console.log('Filter date')}
        onDownloadReport={() => console.log('Download report')}
      />
    </div>
  );
}
