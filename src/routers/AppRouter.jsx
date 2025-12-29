import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import GuestRoutes from "./GuestRoutes";
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
} from "../pages/admin";
import CakeDetail from "../pages/CakeDetail";
import Wishlist from "../pages/Wishlist";
import Cart from "../pages/Cart";
import Profile from "../pages/Profile";
import Checkout from "../pages/Checkout";
import TrackOrder from "../pages/TrackOrder";

export default function AppRouter() {
  return (
    <BrowserRouter>
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
          <Route
            path="/orders"
            element={<Navigate to="/profile?tab=orders" replace />}
          />
          <Route path="/track-order/:orderId" element={<TrackOrder />} />
          <Route
            path="/notifications"
            element={<div>Notifications Page</div>}
          />
          <Route path="/cake/:slug" element={<CakeDetail />} />
        </Route>

        {/* Admin Layout - Protected routes */}
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
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>

        {/* Guest-only routes (no Header/Footer) */}
        <Route element={<GuestRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
