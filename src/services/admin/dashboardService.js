/**
 * Dashboard Service
 * Business logic for admin dashboard
 */

import * as dashboardApi from '../../api/admin/dashboardApi';

/**
 * Fetch dashboard statistics
 */
export const fetchDashboardStats = async () => {
  const response = await dashboardApi.getDashboardStatsApi();
  return response.data;
};

/**
 * Fetch revenue chart data
 */
export const fetchRevenueChart = async (days = 7) => {
  const response = await dashboardApi.getRevenueChartApi(days);
  return response.data;
};

/**
 * Fetch top selling products
 */
export const fetchTopSellingProducts = async (limit = 4) => {
  const response = await dashboardApi.getTopSellingProductsApi(limit);
  return response.data;
};

/**
 * Fetch recent orders
 */
export const fetchRecentOrders = async (limit = 5) => {
  const response = await dashboardApi.getRecentOrdersApi(limit);
  return response.data;
};

// Mock data for development (when API not ready)
export const getMockDashboardStats = () => ({
  totalRevenue: { value: 48295, change: 12.5, trend: 'up' },
  activeOrders: { value: 24, change: 4, trend: 'up' },
  newCustomers: { value: 186, change: 8.2, trend: 'up' },
  avgOrderValue: { value: 85.20, change: -2.1, trend: 'down' },
});

export const getMockRevenueData = () => [
  { day: 'MON', revenue: 3200 },
  { day: 'TUE', revenue: 2800 },
  { day: 'WED', revenue: 4500 },
  { day: 'THU', revenue: 3800 },
  { day: 'FRI', revenue: 5200 },
  { day: 'SAT', revenue: 6100 },
  { day: 'SUN', revenue: 4800 },
];

export const getMockTopProducts = () => [
  { id: 1, name: 'Chocolate Cake', sold: 245, price: 250, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100' },
  { id: 2, name: 'Matcha Bean Delight', sold: 180, price: 250, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=100' },
  { id: 3, name: 'Tiramisu Royal', sold: 125, price: 250, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=100' },
  { id: 4, name: 'Dark Forest', sold: 98, price: 250, image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=100' },
];

export const getMockRecentOrders = () => [
  { id: 'SN-8829', customer: 'Saugat Shahi', items: 3, date: 'Oct 24', total: 1350, status: 'processing' },
  { id: 'SN-8828', customer: 'Akash Chaudhary', items: 1, date: 'Oct 24', total: 1350, status: 'delivered' },
  { id: 'SN-8827', customer: 'Sabin Khadka', items: 2, date: 'Oct 23', total: 1350, status: 'pending' },
  { id: 'SN-8826', customer: 'Krishna Bhandari', items: 1, date: 'Oct 23', total: 1350, status: 'cancelled' },
  { id: 'SN-8825', customer: 'Aaryan Basnet', items: 4, date: 'Oct 22', total: 1350, status: 'delivered' },
];
