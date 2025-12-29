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
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../hooks/user/useAuth";
import useCartStore from "../stores/cartStore";
import ProfileDropdown from "../components/common/ProfileDropdown";

export default function Header({ wide = false }) {
  const { user, isAuthenticated, logout } = useAuth();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Handle clicks outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        searchQuery === ""
      ) {
        setIsSearchOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },

    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`w-full bg-white border-b border-dark/10 z-10 shadow-sm py-3 sm:py-4 px-4 sm:px-6 md:px-8 lg:px-12 ${
          wide ? "xl:px-20" : "xl:px-20"
        }`}
      >
        <nav className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="shrink-0">
            <h1 className="font-heading text-xl sm:text-2xl text-dark font-semibold tracking-tight">
              SweetNest<span className="text-accent">.</span>
            </h1>
          </Link>

          {/* Center: Desktop Links */}
          <div className="hidden lg:flex items-center justify-center space-x-8 xl:space-x-10 text-dark font-body text-sm  tracking-wide uppercase">
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
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Expandable Search - Hidden on small mobile */}
            <div
              ref={searchRef}
              className={`hidden sm:flex items-center transition-all duration-300 ease-out ${
                isSearchOpen
                  ? "w-48 md:w-64 bg-dark/5 rounded-full px-3 md:px-4"
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

            {/* Profile Dropdown - Desktop */}
            <div className="hidden sm:block">
              <ProfileDropdown />
            </div>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="p-2.5 sm:p-3 bg-dark text-white rounded-full hover:bg-accent transition-colors relative shadow-lg group"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-dark/5 rounded-full text-dark transition-colors lg:hidden"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 lg:hidden transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-heading text-xl font-semibold text-dark">
              Menu
            </h2>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-dark/5 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-dark" />
            </button>
          </div>

          {/* Search - Mobile */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center bg-dark/5 rounded-full px-4">
              <Search className="w-4 h-4 text-dark/40 shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-body px-3 py-3 text-dark placeholder:text-dark/40"
              />
            </div>
          </div>

          {/* User Info - Mobile */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-dark">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-heading font-bold text-dark">
                  {user?.name}
                </h4>
                <p className="text-sm text-dark/50 font-body">{user?.email}</p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-3">
                Navigation
              </p>
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-cream text-dark font-body transition-colors"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-dark/30" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* User Actions - Mobile */}
            <div className="p-4 border-t border-gray-100">
              <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-3">
                Account
              </p>
              <nav className="space-y-1">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream text-dark transition-colors"
                    >
                      <User size={18} /> My Profile
                    </Link>
                    <Link
                      to="/notifications"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream text-dark transition-colors"
                    >
                      <Bell size={18} /> Notifications
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream text-dark transition-colors"
                    >
                      <Heart size={18} /> Wishlist
                    </Link>
                    <Link
                      to="/orders"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream text-dark transition-colors"
                    >
                      <Package size={18} /> Track Order
                    </Link>
                    <Link
                      to="/profile?tab=settings"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream text-dark transition-colors"
                    >
                      <Settings size={18} /> Settings
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream text-dark transition-colors"
                    >
                      <User size={18} /> Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream text-dark transition-colors"
                    >
                      <User size={18} /> Register
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>

          {/* Logout Button - Mobile */}
          {isAuthenticated && (
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors font-medium"
              >
                <LogOut size={18} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
