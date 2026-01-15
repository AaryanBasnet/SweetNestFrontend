/**
 * Forbidden Page (403)
 * Shown when user tries to access unauthorized content
 */

import { Link, useNavigate } from 'react-router-dom';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
            <ShieldX size={48} className="text-red-500" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-serif text-dark mb-4">403</h1>

        {/* Title */}
        <h2 className="text-2xl font-serif text-dark mb-4">Access Forbidden</h2>

        {/* Description */}
        <p className="text-dark/60 mb-8">
          You don't have permission to access this page. Please check your account permissions.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-dark/20 text-dark rounded-lg hover:bg-dark/5 transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-dark text-white rounded-lg hover:bg-dark/90 transition-colors"
          >
            <Home size={18} />
            Home Page
          </Link>
        </div>

        {/* Additional Help */}
        <p className="text-sm text-dark/40 mt-8">
          Need help? <Link to="/contact" className="text-accent hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}
