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
  Clock,
  ChevronRight,
  Pencil,
  X,
  Check,
} from 'lucide-react';

// Utils
import { getGreeting, formatOrderDate } from '../../utils/dateUtils';
import { getStatusDisplay } from '../../utils/orderUtils';

// Components
import OrderCardSkeleton from './OrderCardSkeleton';

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
 * Recent Order Card Component
 */
function RecentOrderCard({ order }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 border border-dark/5">
      {/* Date Badge */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-14 h-14 bg-accent/10 rounded-xl flex flex-col items-center justify-center">
          <Clock size={16} className="text-accent mb-0.5" aria-hidden="true" />
          <span className="text-accent text-xs font-semibold">
            {formatOrderDate(order.createdAt)}
          </span>
        </div>

        {/* Order Info */}
        <div className="flex-1">
          <p className="text-dark font-medium">
            Order <span className="font-semibold">#{order.orderNumber}</span>
          </p>
          <p className="text-dark/50 text-sm truncate max-w-[200px]">
            {order.items?.map((item) => item.name).join(', ')}
          </p>
          <p className="text-sm mt-1">
            <span className="text-dark/40">
              {order.itemCount || order.items?.length} Items
            </span>
            <span className="text-dark font-semibold ml-3">Rs. {order.total}</span>
          </p>
        </div>
      </div>

      {/* Status & Action */}
      <div className="flex items-center gap-3 sm:ml-auto">
        <span className="px-3 py-1.5 bg-dark text-white text-xs font-medium rounded-full">
          {getStatusDisplay(order.orderStatus)}
        </span>
        <Link
          to={`/track-order/${order._id}`}
          className="px-4 py-2 bg-dark text-white text-sm font-medium rounded-full flex items-center gap-1 hover:bg-dark/90 transition-colors"
        >
          Track Order
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

RecentOrderCard.propTypes = {
  order: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    orderNumber: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    items: PropTypes.array,
    itemCount: PropTypes.number,
    total: PropTypes.number.isRequired,
    orderStatus: PropTypes.string.isRequired,
  }).isRequired,
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

          {/* Date of Birth */}
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-dark/40 text-xs uppercase tracking-wider mb-2"
            >
              Date of Birth
            </label>
            {isEditing ? (
              <input
                id="dateOfBirth"
                type="text"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={onInputChange}
                placeholder="January 24"
                className="w-full px-4 py-3 bg-cream/50 rounded-xl text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            ) : (
              <div className="px-4 py-3 bg-cream/50 rounded-xl text-dark text-sm">
                {user.dateOfBirth || '-'}
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
              <RecentOrderCard key={order._id} order={order} />
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

