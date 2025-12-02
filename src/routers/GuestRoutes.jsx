import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";

export default function GuestRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <>LOADING...</>;

  // 🔒 If logged in → block guest pages
  if (user) {
    // Optional role-based redirect
    if (user.role === "Admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  // ✅ If NOT logged in → allow guest routes
  return <Outlet />;
}
