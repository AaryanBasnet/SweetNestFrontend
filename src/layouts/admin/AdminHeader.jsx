/**
 * AdminHeader Component
 * Top header bar for admin panel
 * Receives title via props
 */

import { useState } from "react";
import { Search, Bell, Plus, Menu, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminUnreadCount } from "../../hooks/notification/useNotifications";

export default function AdminHeader({ title = "Overview", onMenuClick }) {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: unreadCount } = useAdminUnreadCount();

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-dark/10 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
      {/* Left Section - Menu & Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-dark/60 hover:text-dark transition-colors"
        >
          <Menu size={22} />
        </button>

        {/* Page Title */}
        <h1 className="text-lg sm:text-xl font-serif text-dark">{title}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search - Desktop */}
        {/* <div className="hidden md:block relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-cream border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent/50"
          />
        </div> */}

        {/* Search - Mobile Toggle */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="md:hidden p-2 text-dark/60 hover:text-dark transition-colors"
        >
          {isSearchOpen ? <X size={20} /> : <Search size={20} />}
        </button>

        {/* Notifications */}
        <Link
          to="/admin/notifications"
          className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-dark/5 transition-colors"
        >
          <Bell size={18} className="sm:w-5 sm:h-5 text-dark/60" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        {/* Add Product Button - Desktop */}
        {/* <button
          onClick={() => navigate("/admin/products")}
          className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus size={18} />
          <span className="hidden lg:inline">Add Product</span>
          <span className="lg:hidden">Add</span>
        </button> */}

        {/* Add Product Button - Mobile (icon only) */}
        <button
          onClick={() => navigate("/admin/products/new")}
          className="sm:hidden w-9 h-9 flex items-center justify-center bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Mobile Search Expanded */}
      {isSearchOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-dark/10 p-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40"
            />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-cream border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent/50"
            />
          </div>
        </div>
      )}
    </header>
  );
}
