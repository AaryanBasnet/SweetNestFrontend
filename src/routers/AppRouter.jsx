import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { setNavigate } from "../utils/navigationService";

// Route guards and layouts (load immediately)
import GuestRoutes from "./GuestRoutes";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import MainLayout from "../layouts/MainLayout";
import HomeLayout from "../layouts/HomeLayout";
import { AdminLayout } from "../layouts/admin";
import PageLoader from "../components/common/PageLoader";

// Lazy load auth pages
const Login = lazy(() => import("../pages/auth/LOgin"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const VerifyCode = lazy(() => import("../pages/auth/VerifyCode"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

// Lazy load main pages
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const Menu = lazy(() => import("../pages/Menu"));
const CakeDetail = lazy(() => import("../pages/CakeDetail"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Profile = lazy(() => import("../pages/Profile"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const Rewards = lazy(() => import("../pages/Rewards"));
const TrackOrder = lazy(() => import("../pages/TrackOrder"));
const Notifications = lazy(() => import("../pages/Notifications"));
const CustomPage = lazy(() => import("../pages/CustomPage"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Forbidden = lazy(() => import("../pages/Forbidden"));

// Lazy load admin pages
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Orders = lazy(() => import("../pages/admin/Orders"));
const Products = lazy(() => import("../pages/admin/Products"));
const Categories = lazy(() => import("../pages/admin/Categories"));
const Customers = lazy(() => import("../pages/admin/Customers"));
const Analytics = lazy(() => import("../pages/admin/Analytics"));
const Settings = lazy(() => import("../pages/admin/Settings"));
const Promotions = lazy(() => import("../pages/admin/Promotions"));
const ContactMessages = lazy(() => import("../pages/admin/ContactMessages"));
const AdminNotifications = lazy(() => import("../pages/admin/Notifications"));
const CreateNotification = lazy(() => import("../pages/admin/CreateNotification"));

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
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </BrowserRouter>
  );
}
