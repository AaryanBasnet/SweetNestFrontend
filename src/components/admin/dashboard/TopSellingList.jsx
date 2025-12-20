/**
 * TopSellingList Component
 * List of top selling products
 * Standalone - receives data via props
 */

import { useNavigate } from 'react-router-dom';

export default function TopSellingList({ products = [], onViewAll }) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate('/admin/products');
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-dark/5">
      {/* Header */}
      <h3 className="text-base sm:text-lg font-serif text-dark mb-4 sm:mb-6">Top Selling Cakes</h3>

      {/* Products List */}
      <div className="space-y-3 sm:space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-3 sm:gap-4">
            {/* Image */}
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden bg-cream flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-medium text-dark truncate">{product.name}</h4>
              <p className="text-[10px] sm:text-xs text-dark/50">{product.sold} sold</p>
            </div>

            {/* Price */}
            <span className="text-xs sm:text-sm font-medium text-accent">Rs. {product.price}</span>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <button
        onClick={handleViewAll}
        className="w-full mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-dark/5 text-xs sm:text-sm text-dark/50 hover:text-accent transition-colors uppercase tracking-wider"
      >
        View All Products
      </button>
    </div>
  );
}
