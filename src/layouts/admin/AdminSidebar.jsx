/**
 * AdminSidebar Component
 * Navigation sidebar for admin panel
 * Supports both desktop (fixed) and mobile (drawer) modes
 */

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Cake,
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  FolderOpen,
  LogOut,
  X,
  Bell
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';

const NAV_ITEMS = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { path: '/admin/products', icon: Cake, label: 'Products' },
  { path: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { path: '/admin/customers', icon: Users, label: 'Customers' },
  { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar({ isMobileOpen = false, onMobileClose }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    // Close mobile sidebar when navigating
    onMobileClose?.();
  };

  // Sidebar content shared between desktop and mobile
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-serif text-dark">
          SweetNest<span className="text-accent">.</span>
        </h1>
        {/* Close button - mobile only */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-2 -mr-2 text-dark/60 hover:text-dark transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 sm:px-4 py-2 sm:py-4 overflow-y-auto">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-dark/60 hover:bg-dark/5 hover:text-dark'
                  }`
                }
              >
                <item.icon size={18} className="sm:w-5 sm:h-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-dark/10">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:bg-dark/5 transition-colors"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs sm:text-sm font-medium text-accent">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-dark truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-dark/50 truncate">{user?.role || 'Store Manager'}</p>
            </div>
            <ChevronDown
              size={16}
              className={`text-dark/40 transition-transform flex-shrink-0 ${showUserMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-dark/10 overflow-hidden">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Quick Logout Button (always visible) */}
        <button
          onClick={handleLogout}
          className="mt-2 flex items-center justify-center gap-2 w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar - fixed */}
      <aside className="hidden lg:flex w-[240px] h-screen bg-white border-r border-dark/10 flex-col fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onMobileClose}
      />

      {/* Mobile Sidebar - drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-[280px] max-w-[85%] bg-white z-50 flex flex-col transform transition-transform duration-300 ease-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
