/**
 * ProfileDropdown Component
 * User profile dropdown menu for header
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  LogOut,
  Settings,
  Bell,
  Heart,
  Package,
  Gift,
} from 'lucide-react';
import { useAuth } from '../../hooks/user/useAuth';

export default function ProfileDropdown() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 border border-dark/10 overflow-hidden hover:ring-2 hover:ring-accent transition-all shrink-0 flex items-center justify-center"
      >
        {isAuthenticated && user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : isAuthenticated ? (
          <span className="text-sm font-semibold text-dark">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        ) : (
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-dark/60" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-dark/5 p-4 z-50">
          {isAuthenticated ? (
            <>
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-dark">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-dark text-sm">
                    {user?.name}
                  </h4>
                  <p className="text-xs text-dark/50 font-body">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-1">
                <Link
                  to="/profile"
                  onClick={closeDropdown}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream text-sm text-dark transition-colors"
                >
                  <User size={16} /> My Profile
                </Link>
                <Link
                  to="/rewards"
                  onClick={closeDropdown}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream text-sm text-dark transition-colors"
                >
                  <Gift size={16} /> SweetRewards
                </Link>
                <Link
                  to="/notifications"
                  onClick={closeDropdown}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream text-sm text-dark transition-colors"
                >
                  <Bell size={16} /> Notifications
                </Link>
                <Link
                  to="/wishlist"
                  onClick={closeDropdown}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream text-sm text-dark transition-colors"
                >
                  <Heart size={16} /> Wishlist
                </Link>
                <Link
                  to="/orders"
                  onClick={closeDropdown}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream text-sm text-dark transition-colors"
                >
                  <Package size={16} /> Track Order
                </Link>
                <Link
                  to="/profile?tab=settings"
                  onClick={closeDropdown}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream text-sm text-dark transition-colors"
                >
                  <Settings size={16} /> Settings
                </Link>
                <div className="h-px bg-gray-100 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 text-sm text-red-500 transition-colors text-left"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <Link
                to="/login"
                onClick={closeDropdown}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream text-sm text-dark transition-colors"
              >
                <User size={16} /> Login
              </Link>
              <Link
                to="/register"
                onClick={closeDropdown}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream text-sm text-dark transition-colors"
              >
                <User size={16} /> Register
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
