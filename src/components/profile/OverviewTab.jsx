/**
 * Overview Tab Component
 * Dashboard view with greeting, stats, recent orders, and personal info
 */

import { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Package,
  Heart,
  Pencil,
  X,
  Check,
} from 'lucide-react';

// Utils
import { getGreeting } from '../../utils/dateUtils';

// Components
import OrderCardSkeleton from './OrderCardSkeleton';
import OrderCard from './OrderCard';

/**
 * Stats Card Component
 */
function StatCard({ icon: IconComponent, value, label, bgColor, iconColor }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 border border-dark/5">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
        <IconComponent size={22} className={iconColor} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-dark">{value}</p>
        <p className="text-dark/40 text-sm uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
};


/**
 * Personal Information Form
 */
function PersonalInfoForm({
  user,
  formData,
  isEditing,
  isSaving,
  onInputChange,
  onEdit,
  onSave,
  onCancel,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif text-dark">Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={onEdit}
            aria-label="Edit personal information"
            className="p-2 text-dark/40 hover:text-dark transition-colors"
          >
            <Pencil size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              aria-label="Cancel editing"
              className="p-2 text-dark/40 hover:text-dark transition-colors"
              disabled={isSaving}
            >
              <X size={18} />
            </button>
            <button
              onClick={onSave}
              aria-label="Save changes"
              className="p-2 text-emerald-500 hover:text-emerald-600 transition-colors"
              disabled={isSaving}
            >
              <Check size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-dark/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-dark/40 text-xs uppercase tracking-wider mb-2"
            >
              Full Name
            </label>
            {isEditing ? (
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                className="w-full px-4 py-3 bg-cream/50 rounded-xl text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            ) : (
              <div className="px-4 py-3 bg-cream/50 rounded-xl text-dark text-sm">
                {user.name || '-'}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-dark/40 text-xs uppercase tracking-wider mb-2"
            >
              Email Address
            </label>
            <div
              id="email"
              className="px-4 py-3 bg-cream/50 rounded-xl text-dark text-sm"
            >
              {user.email || '-'}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-dark/40 text-xs uppercase tracking-wider mb-2"
            >
              Phone Number
            </label>
            {isEditing ? (
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={onInputChange}
                placeholder="+977 9700000000"
                className="w-full px-4 py-3 bg-cream/50 rounded-xl text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            ) : (
              <div className="px-4 py-3 bg-cream/50 rounded-xl text-dark text-sm">
                {user.phone || '-'}
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-dark/40 text-xs uppercase tracking-wider mb-2"
            >
              Address
            </label>
            {isEditing ? (
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={onInputChange}
                placeholder="Enter your address"
                className="w-full px-4 py-3 bg-cream/50 rounded-xl text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            ) : (
              <div className="px-4 py-3 bg-cream/50 rounded-xl text-dark text-sm">
                {user.address || '-'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

PersonalInfoForm.propTypes = {
  user: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

/**
 * Overview Tab Main Component
 */
function OverviewTab({
  firstName,
  ordersCount,
  wishlistCount,
  recentOrders,
  isLoadingOrders,
  user,
  formData,
  isEditing,
  isSaving,
  onInputChange,
  onEdit,
  onSave,
  onCancel,
}) {
  return (
    <div className="space-y-8">
      {/* Greeting */}
      <header>
        <h1 className="text-2xl sm:text-3xl font-serif text-dark mb-1">
          {getGreeting()}, {firstName}.
        </h1>
        <p className="text-dark/50">
          Here's what's happening with your sweets today.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Package}
          value={ordersCount}
          label="Orders"
          bgColor="bg-emerald-50"
          iconColor="text-emerald-500"
        />
        <StatCard
          icon={Heart}
          value={wishlistCount}
          label="Favorites"
          bgColor="bg-rose-50"
          iconColor="text-rose-400"
        />
      </div>

      {/* Recent Indulgence */}
      <section aria-labelledby="recent-orders-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="recent-orders-heading" className="text-xl font-serif text-dark">
            Recent Indulgence
          </h2>
          <Link
            to="/profile?tab=orders"
            className="text-accent text-sm hover:underline"
          >
            View All Orders
          </Link>
        </div>

        {isLoadingOrders ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <OrderCard key={order._id} order={order} variant="overview" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-dark/5">
            <Package size={40} className="text-dark/20 mx-auto mb-3" aria-hidden="true" />
            <p className="text-dark/50">No orders yet</p>
          </div>
        )}
      </section>

      {/* Personal Information */}
      <PersonalInfoForm
        user={user}
        formData={formData}
        isEditing={isEditing}
        isSaving={isSaving}
        onInputChange={onInputChange}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
}

OverviewTab.propTypes = {
  firstName: PropTypes.string.isRequired,
  ordersCount: PropTypes.number.isRequired,
  wishlistCount: PropTypes.number.isRequired,
  recentOrders: PropTypes.array.isRequired,
  isLoadingOrders: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default memo(OverviewTab);

