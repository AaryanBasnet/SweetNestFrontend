/**
 * Admin Dashboard Page
 * Overview page with stats, charts, and recent data
 */

import { TrendingUp, ShoppingBag, Users, BarChart3 } from "lucide-react";
import {
  useOverviewAnalytics,
  useRevenueTrends,
  useTopProducts,
  useRecentActivity,
} from "../../hooks/admin/useAnalytics";
import {
  StatsCard,
  RevenueChart,
  TopSellingList,
  RecentOrdersTable,
} from "../../components/admin/dashboard";

// Format currency in NPR
const formatCurrency = (amount) => {
  return Math.round(amount).toLocaleString();
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Seven bars, one per day ending today, labelled "Sep 27". The API only
 * returns days that had sales, so a quiet day would otherwise vanish from
 * the axis. Keys are UTC dates, matching how the backend groups them.
 */
const lastSevenDays = (trends = []) => {
  const revenueByDay = new Map((trends || []).map((t) => [t.date, t.revenue]));
  return Array.from({ length: 7 }, (_, i) => {
    const key = new Date(Date.now() - (6 - i) * DAY_MS).toISOString().slice(0, 10);
    const label = new Date(`${key}T00:00:00Z`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
    return { day: label, revenue: revenueByDay.get(key) || 0 };
  });
};

export default function Dashboard() {
  // Fetch real data from backend
  const { data: overview, isLoading: overviewLoading } = useOverviewAnalytics();
  const { data: revenueTrends, isLoading: trendsLoading } = useRevenueTrends({
    period: "daily",
    limit: 7,
  });
  const { data: topProducts, isLoading: productsLoading } = useTopProducts({
    limit: 5,
  });
  const { data: recentActivity, isLoading: activityLoading } =
    useRecentActivity({ limit: 10 });

  // Loading state
  if (overviewLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-dark/5 animate-pulse"
            >
              <div className="h-12 bg-dark/10 rounded mb-4"></div>
              <div className="h-4 bg-dark/10 rounded w-24 mb-2"></div>
              <div className="h-8 bg-dark/10 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(overview?.revenue?.current || 0)}
          change={overview?.revenue?.change || 0}
          trend={overview?.revenue?.change >= 0 ? "up" : "down"}
          prefix="Rs. "
          icon={TrendingUp}
        />
        <StatsCard
          title="Active Orders"
          value={overview?.orders?.pending || 0}
          change={overview?.orders?.change || 0}
          trend={overview?.orders?.change >= 0 ? "up" : "down"}
          icon={ShoppingBag}
        />
        <StatsCard
          title="Total Customers"
          value={overview?.customers?.total || 0}
          change={overview?.customers?.change || 0}
          trend={overview?.customers?.change >= 0 ? "up" : "down"}
          icon={Users}
        />
        <StatsCard
          title="Avg. Order Value"
          value={formatCurrency(overview?.averageOrderValue || 0)}
          change={0}
          trend="up"
          prefix="Rs. "
          icon={BarChart3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue Chart - 2 columns */}
        <div className="lg:col-span-2">
          {trendsLoading ? (
            <div className="bg-white rounded-xl p-6 border border-dark/5">
              <div className="h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            </div>
          ) : (
            <RevenueChart
              data={lastSevenDays(revenueTrends)}
              title="Revenue Report"
              subtitle="Sales performance over the last 7 days"
            />
          )}
        </div>

        {/* Top Selling - 1 column */}
        {productsLoading ? (
          <div className="bg-white rounded-xl p-6 border border-dark/5">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-dark/10 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <TopSellingList products={topProducts || []} />
        )}
      </div>

      {/* Recent Orders */}
      {activityLoading ? (
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-dark/10 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <RecentOrdersTable orders={recentActivity?.recentOrders || []} />
      )}
    </div>
  );
}
