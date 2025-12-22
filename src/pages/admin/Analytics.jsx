/**
 * Admin Analytics Page
 * Sales analytics and reports
 */

import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { StatsCard, RevenueChart } from '../../components/admin/dashboard';
import { PageHeader } from '../../components/admin/shared';
import { getMockRevenueData } from '../../services/admin/dashboardService';

export default function Analytics() {
  const revenueData = getMockRevenueData();

  // Extended mock data for monthly view
  const monthlyData = [
    { day: 'Jan', revenue: 42000 },
    { day: 'Feb', revenue: 38000 },
    { day: 'Mar', revenue: 45000 },
    { day: 'Apr', revenue: 52000 },
    { day: 'May', revenue: 48000 },
    { day: 'Jun', revenue: 61000 },
    { day: 'Jul', revenue: 55000 },
    { day: 'Aug', revenue: 67000 },
    { day: 'Sep', revenue: 72000 },
    { day: 'Oct', revenue: 68000 },
    { day: 'Nov', revenue: 75000 },
    { day: 'Dec', revenue: 82000 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Track your business performance"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Sales"
          value={705000}
          change={15.3}
          trend="up"
          prefix="Rs. "
          icon={DollarSign}
        />
        <StatsCard
          title="Total Orders"
          value={1284}
          change={8.7}
          trend="up"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Total Customers"
          value={456}
          change={12.1}
          trend="up"
          icon={Users}
        />
        <StatsCard
          title="Products Sold"
          value={2891}
          change={5.4}
          trend="up"
          icon={Package}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue */}
        <RevenueChart
          data={revenueData}
          title="Weekly Revenue"
          subtitle="Last 7 days performance"
        />

        {/* Monthly Revenue */}
        <RevenueChart
          data={monthlyData.slice(-7)}
          title="Monthly Trend"
          subtitle="Revenue over last months"
        />
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-2xl p-6 border border-dark/5">
        <h3 className="text-lg font-serif text-dark mb-6">Sales by Category</h3>
        <div className="space-y-4">
          {[
            { name: 'Signature Cakes', sales: 285000, percentage: 40 },
            { name: 'Wedding Cakes', sales: 178000, percentage: 25 },
            { name: 'Cupcakes', sales: 142000, percentage: 20 },
            { name: 'Custom Orders', sales: 100000, percentage: 15 },
          ].map((category) => (
            <div key={category.name} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-dark">{category.name}</span>
                  <span className="text-sm text-dark/50">Rs. {category.sales.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-dark/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-dark w-12 text-right">{category.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-dark/5">
          <h3 className="text-lg font-serif text-dark mb-4">Best Performing</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <span className="text-sm font-medium text-green-700">Highest Sales Day</span>
              <span className="text-sm text-green-600">Saturday - Rs. 12,500</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <span className="text-sm font-medium text-green-700">Top Product</span>
              <span className="text-sm text-green-600">Chocolate Truffle - 245 sold</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <span className="text-sm font-medium text-green-700">Best Month</span>
              <span className="text-sm text-green-600">December - Rs. 82,000</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-dark/5">
          <h3 className="text-lg font-serif text-dark mb-4">Areas to Improve</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
              <span className="text-sm font-medium text-amber-700">Lowest Sales Day</span>
              <span className="text-sm text-amber-600">Monday - Rs. 3,200</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
              <span className="text-sm font-medium text-amber-700">Low Stock Alert</span>
              <span className="text-sm text-amber-600">5 products need restock</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
              <span className="text-sm font-medium text-amber-700">Pending Reviews</span>
              <span className="text-sm text-amber-600">12 reviews need moderation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
