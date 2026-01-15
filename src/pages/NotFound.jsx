/**
 * Not Found Page (404)
 * Shown when route doesn't exist
 */

import { Link, useNavigate } from 'react-router-dom';
import { SearchX, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-dark/5 rounded-full flex items-center justify-center">
            <SearchX size={48} className="text-dark/40" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-serif text-dark mb-4">404</h1>

        {/* Title */}
        <h2 className="text-2xl font-serif text-dark mb-4">Page Not Found</h2>

        {/* Description */}
        <p className="text-dark/60 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track!
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

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t border-dark/10">
          <p className="text-sm text-dark/40 mb-4">Popular Pages</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/menu" className="text-sm text-dark/60 hover:text-accent transition-colors">
              Menu
            </Link>
            <Link to="/about" className="text-sm text-dark/60 hover:text-accent transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm text-dark/60 hover:text-accent transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
