/**
 * AdminLayout Component
 * Main layout wrapper for admin pages
 * Combines sidebar and header
 */

import { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import useAuthStore from '../../stores/authStore';

// Map routes to titles
const ROUTE_TITLES = {
  '/admin': 'Overview',
  '/admin/orders': 'Orders',
  '/admin/products': 'Products',
  '/admin/products/new': 'Add Product',
  '/admin/customers': 'Customers',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings',
  '/admin/categories': 'Categories',
};

export default function AdminLayout() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Get page title based on current route
  const pageTitle = ROUTE_TITLES[location.pathname] || 'Admin';

  // Close sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  // Check if user is admin
  if (!isAuthenticated() || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar - Desktop (always visible) & Mobile (drawer) */}
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:ml-60">
        {/* Header */}
        <AdminHeader
          title={pageTitle}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
