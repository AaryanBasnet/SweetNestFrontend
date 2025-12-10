import { BrowserRouter, Route, Routes } from "react-router-dom";
import GuestRoutes from "./GuestRoutes";
import Login from "../pages/auth/LOgin";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyCode from "../pages/auth/VerifyCode";
import ResetPassword from "../pages/auth/ResetPassword";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import HomeLayout from "../layouts/HomeLayout";

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
          <Route path="/menu" element={<div>Menu Page</div>} />
          <Route path="/about" element={<div>About Us Page</div>} />
          <Route path="/contact" element={<div>Contact Us Page</div>} />
          <Route path="/locations" element={<div>Locations Page</div>} />
          <Route path="/cart" element={<div>Cart Page</div>} />
          <Route path="/profile" element={<div>Profile Page</div>} />
          <Route path="/settings" element={<div>Settings Page</div>} />
          <Route path="/wishlist" element={<div>Wishlist Page</div>} />
          <Route path="/orders" element={<div>Orders Page</div>} />
          <Route path="/notifications" element={<div>Notifications Page</div>} />
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
