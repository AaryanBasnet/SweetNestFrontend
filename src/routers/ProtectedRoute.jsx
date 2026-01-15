/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 * Redirects to login if not authenticated
 */

import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  // Wait for auth initialization
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-dark/20 border-t-dark rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated → allow access
  return <Outlet />;
}
