import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import GuestRoutes from "./GuestRoutes";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Login from "../pages/auth/LOgin";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyCode from "../pages/auth/VerifyCode";
import ResetPassword from "../pages/auth/ResetPassword";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import HomeLayout from "../layouts/HomeLayout";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Menu from "../pages/Menu";
import NotFound from "../pages/NotFound";
import Forbidden from "../pages/Forbidden";
import { setNavigate } from "../utils/navigationService";

// Admin imports
import { AdminLayout } from "../layouts/admin";
import {
  Dashboard,
  Orders,
  Products,
  Categories,
  Customers,
  Analytics,
  Settings,
  Promotions,
  ContactMessages,
} from "../pages/admin";
import AdminNotifications from "../pages/admin/Notifications";
import CreateNotification from "../pages/admin/CreateNotification";
import CakeDetail from "../pages/CakeDetail";
import Wishlist from "../pages/Wishlist";
import Cart from "../pages/Cart";
import Profile from "../pages/Profile";
import Checkout from "../pages/Checkout";
import TrackOrder from "../pages/TrackOrder";
import Notifications from "../pages/Notifications";
import CustomPage from "../pages/CustomPage";
import Rewards from "../pages/Rewards";

// Inner component to access useNavigate
function NavigationSetter() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return null;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <NavigationSetter />
      <Routes>
        {/* Home Layout - 140px margin */}
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
        </Route>

        {/* Main Layout - 80px margin (other pages) */}
        <Route element={<MainLayout />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/locations" element={<div>Locations Page</div>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<div>Settings Page</div>} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route
            path="/orders"
            element={<Navigate to="/profile?tab=orders" replace />}
          />
          <Route path="/track-order/:orderId" element={<TrackOrder />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/custompage" element={<CustomPage />} />
          <Route path="/cake/:slug" element={<CakeDetail />} />
        </Route>

        {/* Admin Routes - Protected (Admin Only) */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/products" element={<Products />} />
            <Route
              path="/admin/products/new"
              element={<div>Add Product Page</div>}
            />
            <Route
              path="/admin/products/:id"
              element={<div>Product Details Page</div>}
            />
            <Route
              path="/admin/products/:id/edit"
              element={<div>Edit Product Page</div>}
            />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/promotions" element={<Promotions />} />
            <Route path="/admin/contact-messages" element={<ContactMessages />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/notifications/create" element={<CreateNotification />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Guest-only routes (no Header/Footer) */}
        <Route element={<GuestRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Error Pages */}
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
