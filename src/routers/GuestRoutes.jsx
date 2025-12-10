import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/user/useAuth";

export default function GuestRoutes() {
  const { user, loading } = useAuth();

  // 1. Wait for Auth Check to complete
  // (Prevents the Login page from flashing before redirecting)
  if (loading) {
    return <div>Loading...</div>;
  }

  // 2. 🔒 If logged in → Kick them out of guest pages
  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // 3. ✅ If NOT logged in → Allow access to Login/Register
  return <Outlet />;
}
