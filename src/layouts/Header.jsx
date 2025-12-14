import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  User,
  LogOut,
  Settings,
  Bell,
  Heart,
  Package,
  Menu as MenuIcon,
  X,
  LogIn,
  UserPlus
} from "lucide-react";
import { useAuth } from "../hooks/user/useAuth";

export default function Header({ wide = false }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Handle clicks outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) && searchQuery === "") {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [searchQuery]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },
    
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className={`w-full bg-white shadow-sm py-4  p ${wide ? "px-20" : "px-[80px]"}`}>
      <nav className="flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="shrink-0">
          <h1 className="font-heading text-2xl text-dark font-semibold tracking-tight">
            SweetNest<span className="text-accent">.</span>
          </h1>
        </Link>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex items-center justify-center space-x-10 text-dark font-body text-xs font-bold tracking-widest uppercase">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="hover:text-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button className="p-2 hover:bg-dark/5 rounded-full text-dark transition-colors md:hidden">
            <MenuIcon className="w-6 h-6" />
          </button>

          {/* Expandable Search */}
          <div
            ref={searchRef}
            className={`flex items-center transition-all duration-300 ease-out ${
              isSearchOpen
                ? "w-64 bg-dark/5 rounded-full px-4"
                : "w-10 bg-transparent"
            }`}
          >
            {isSearchOpen ? (
              <div className="flex items-center w-full">
                <Search className="w-4 h-4 text-dark/40 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-body px-2 text-dark placeholder:text-dark/40 h-10"
                />
                {searchQuery && (
                  <button onClick={handleClearSearch}>
                    <X className="w-4 h-4 text-dark/40 hover:text-dark" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={toggleSearch}
                className="p-2.5 hover:bg-dark/5 rounded-full text-dark transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-gray-100 border border-dark/10 overflow-hidden hover:ring-2 hover:ring-accent transition-all shrink-0 flex items-center justify-center"
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
                <User className="w-5 h-5 text-dark/60" />
              )}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-dark/5 p-4 z-50">
                {isAuthenticated ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-semibold text-dark">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-dark text-sm">{user?.name}</h4>
                        <p className="text-xs text-dark/50 font-body">{user?.email}</p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream text-sm text-dark transition-colors"
                      >
                        <User size={16} /> My Profile
                      </Link>
                      <Link
                        to="/notifications"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream text-sm text-dark transition-colors"
                      >
                        <Bell size={16} /> Notifications
                        <span className="ml-auto bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          2
                        </span>
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream text-sm text-dark transition-colors"
                      >
                        <Heart size={16} /> Wishlist
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream text-sm text-dark transition-colors"
                      >
                        <Package size={16} /> Track Order
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileOpen(false)}
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
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream text-sm text-dark transition-colors"
                    >
                      <LogIn size={16} /> Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream text-sm text-dark transition-colors"
                    >
                      <UserPlus size={16} /> Register
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="p-3 bg-dark text-white rounded-full hover:bg-accent transition-colors relative shadow-lg group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
