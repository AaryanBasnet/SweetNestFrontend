/**
 * Track Order Page
 * Displays order tracking information with progress timeline
 */

import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  CheckCircle,
  ChefHat,
  Truck,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';
import { getOrderByIdApi, getOrderByNumberApi } from '../api/orderApi';

// Order status configuration
const ORDER_STATUSES = {
  pending: { label: 'Order Placed', icon: Package, step: 0 },
  confirmed: { label: 'Order Confirmed', icon: CheckCircle, step: 1 },
  processing: { label: 'Baking & Glazing', icon: ChefHat, step: 2 },
  out_for_delivery: { label: 'Out for Delivery', icon: Truck, step: 3 },
  delivered: { label: 'Delivered', icon: CheckCircle, step: 4 },
  cancelled: { label: 'Cancelled', icon: Package, step: -1 },
};

// Get status display info
const getStatusInfo = (status) => ORDER_STATUSES[status] || ORDER_STATUSES.pending;

// Format time from date
const formatTime = (dateString) => {
  if (!dateString) return '--:--';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Check if order is on time based on delivery schedule
const isOrderOnTime = (order) => {
  if (!order?.deliverySchedule?.date) return true;
  const deliveryDate = new Date(order.deliverySchedule.date);
  const now = new Date();
  return now <= deliveryDate || order.orderStatus === 'delivered';
};

// Get estimated arrival time from delivery schedule
const getEstimatedArrival = (order) => {
  if (!order?.deliverySchedule?.timeSlot) return '-- PM';
  // Extract end time from slot (e.g., "09:00 AM - 12:00 PM" -> "12:00 PM")
  const timeSlot = order.deliverySchedule.timeSlot;
  const endTime = timeSlot.split(' - ')[1] || timeSlot;
  return endTime;
};

// Calculate progress percentage
const calculateProgress = (currentStatus) => {
  const statusInfo = getStatusInfo(currentStatus);
  if (statusInfo.step === -1) return 0; // Cancelled
  const totalSteps = 4;
  return Math.min((statusInfo.step / totalSteps) * 100, 100);
};

// Status Badge Component
function StatusBadge({ isOnTime }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
        isOnTime
          ? 'bg-green-50 text-green-600'
          : 'bg-amber-50 text-amber-600'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isOnTime ? 'bg-green-500' : 'bg-amber-500'
        }`}
      />
      {isOnTime ? 'On Time' : 'Delayed'}
    </div>
  );
}

// Progress Card Component
function ProgressCard({ order }) {
  const estimatedArrival = getEstimatedArrival(order);
  const onTime = isOrderOnTime(order);
  const progress = calculateProgress(order?.orderStatus);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 text-center">
      {/* Status Badge */}
      <div className="flex justify-center mb-4">
        <StatusBadge isOnTime={onTime} />
      </div>

      {/* Estimated Arrival Time */}
      <h2 className="text-2xl font-semibold text-dark mb-1">
        {estimatedArrival}
      </h2>
      <p className="text-dark/50 text-sm mb-2">Estimated Arrival</p>

      {/* Order Number */}
      <p className="text-accent font-medium text-sm mb-6">
        #{order?.orderNumber}
      </p>

      {/* Progress Bar */}
      <div className="relative h-1.5 bg-dark/10 rounded-full overflow-hidden mb-3">
        <div
          className="absolute left-0 top-0 h-full bg-accent rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Label */}
      <p className="text-dark/40 text-xs uppercase tracking-wider font-medium">
        Order Progress
      </p>
    </div>
  );
}

// Timeline Item Component
function TimelineItem({ status, label, time, isActive, isCompleted, isLast, subtitle }) {
  const StatusIcon = status.icon;
  const iconBgClass = isActive
    ? 'bg-dark text-white'
    : isCompleted
    ? 'bg-cream text-accent'
    : 'bg-cream/50 text-dark/30';

  return (
    <div className="flex items-start gap-4">
      {/* Icon & Line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${iconBgClass}`}
        >
          <StatusIcon size={18} />
        </div>
        {!isLast && (
          <div
            className={`w-0.5 h-12 mt-1 ${
              isCompleted ? 'bg-accent/30' : 'bg-dark/10'
            }`}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-between pt-2">
        <div>
          <p
            className={`font-medium ${
              isActive ? 'text-accent' : isCompleted ? 'text-dark' : 'text-dark/40'
            }`}
          >
            {label}
          </p>
          {subtitle && (
            <p className="text-dark/40 text-sm">{subtitle}</p>
          )}
        </div>
        <span className="text-dark/50 text-sm bg-cream/50 px-3 py-1 rounded-lg">
          {time}
        </span>
      </div>
    </div>
  );
}

// Order History Timeline Component
function OrderHistory({ order }) {
  const currentStep = getStatusInfo(order?.orderStatus).step;

  // Build timeline items based on order status updates
  const timelineItems = [
    {
      status: ORDER_STATUSES.pending,
      label: 'Order Placed',
      time: formatTime(order?.createdAt),
      step: 0,
    },
    {
      status: ORDER_STATUSES.confirmed,
      label: 'Order Confirmed',
      time: currentStep >= 1 ? formatTime(order?.updatedAt) : '--:--',
      step: 1,
    },
    {
      status: ORDER_STATUSES.processing,
      label: 'Baking & Glazing',
      time: currentStep >= 2 ? formatTime(order?.updatedAt) : '--:--',
      step: 2,
    },
    {
      status: ORDER_STATUSES.out_for_delivery,
      label: 'Out for Delivery',
      time: currentStep >= 3 ? formatTime(order?.updatedAt) : '--:--',
      step: 3,
      subtitle: currentStep === 3 ? 'Happening now' : undefined,
    },
    {
      status: { icon: Clock, step: 4 },
      label: 'Estimated Arrival',
      time: getEstimatedArrival(order),
      step: 4,
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h3 className="font-medium text-dark mb-6">Order History</h3>
      <div className="space-y-0">
        {timelineItems.map((item, index) => (
          <TimelineItem
            key={index}
            status={item.status}
            label={item.label}
            time={item.time}
            isActive={currentStep === item.step}
            isCompleted={currentStep > item.step}
            isLast={index === timelineItems.length - 1}
            subtitle={item.subtitle}
          />
        ))}
      </div>
    </div>
  );
}

// Order Summary Component
function OrderSummary({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const items = order?.items || [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = order?.total || 0;
  const firstItemImage = items[0]?.image || 'https://via.placeholder.com/60x60?text=Cake';

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      {/* Summary Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-4 hover:bg-cream/30 transition-colors"
      >
        {/* First Item Image */}
        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
          <img
            src={firstItemImage}
            alt="Order item"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Summary Info */}
        <div className="flex-1 text-left">
          <h3 className="font-medium text-dark">Order Summary</h3>
          <p className="text-dark/50 text-sm">
            {itemCount} {itemCount === 1 ? 'Item' : 'Items'} • Rs. {total}
          </p>
        </div>

        {/* Expand Icon */}
        <div className="text-dark/30">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-dark/5">
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={item.image || 'https://via.placeholder.com/40x40?text=Cake'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-dark text-sm font-medium truncate">
                    {item.name}
                  </p>
                  <p className="text-dark/50 text-xs">
                    {item.weight?.label} × {item.quantity}
                  </p>
                </div>
                <p className="text-dark font-medium text-sm">
                  Rs. {item.itemTotal}
                </p>
              </div>
            ))}
          </div>

          {/* Order Totals */}
          <div className="mt-4 pt-4 border-t border-dark/5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark/50">Subtotal</span>
              <span className="text-dark">Rs. {order?.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark/50">Shipping</span>
              <span className="text-dark">
                {order?.shipping === 0 ? 'FREE' : `Rs. ${order?.shipping}`}
              </span>
            </div>
            {order?.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-dark/50">Discount</span>
                <span className="text-green-600">-Rs. {order?.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold pt-2 border-t border-dark/5">
              <span className="text-dark">Total</span>
              <span className="text-accent">Rs. {order?.total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-cream animate-pulse">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Button Skeleton */}
        <div className="h-5 w-40 bg-dark/10 rounded mb-8" />

        {/* Title Skeleton */}
        <div className="h-10 w-48 bg-dark/10 rounded mx-auto mb-8" />

        {/* Progress Card Skeleton */}
        <div className="bg-white rounded-3xl p-6 mb-6">
          <div className="h-6 w-20 bg-dark/10 rounded-full mx-auto mb-4" />
          <div className="h-8 w-24 bg-dark/10 rounded mx-auto mb-2" />
          <div className="h-4 w-32 bg-dark/10 rounded mx-auto mb-6" />
          <div className="h-2 bg-dark/10 rounded-full" />
        </div>

        {/* Timeline Skeleton */}
        <div className="bg-white rounded-3xl p-6 mb-6">
          <div className="h-5 w-28 bg-dark/10 rounded mb-6" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-dark/10 rounded-full" />
              <div className="flex-1">
                <div className="h-4 w-28 bg-dark/10 rounded mb-2" />
              </div>
              <div className="h-6 w-16 bg-dark/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Track Order Component
export default function TrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order ID not provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Try fetching by ID first, then by order number
        let response;
        try {
          response = await getOrderByIdApi(orderId);
        } catch (err) {
          // If ID fetch fails, try by order number
          response = await getOrderByNumberApi(orderId);
        }

        if (response.data?.data) {
          setOrder(response.data.data);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.message || 'Failed to load order');
        toast.error('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.info('Please login to track your order');
      navigate(`/login?redirect=/track-order/${orderId}`);
    }
  }, [isAuthenticated, navigate, orderId]);

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto text-dark/20 mb-4" />
          <h2 className="text-xl font-serif text-dark mb-2">Order Not Found</h2>
          <p className="text-dark/50 mb-6">{error || "We couldn't find this order."}</p>
          <Link
            to="/profile?tab=orders"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-dark/50 hover:text-dark transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium uppercase tracking-wide">
            Continue Shopping
          </span>
        </Link>

        {/* Page Title */}
        <h1 className="text-center mb-8">
          <span className="font-serif text-3xl text-dark">Track </span>
          <span className="font-serif text-3xl text-accent italic">Order</span>
        </h1>

        {/* Progress Card */}
        <div className="mb-6">
          <ProgressCard order={order} />
        </div>

        {/* Order History Timeline */}
        <div className="mb-6">
          <OrderHistory order={order} />
        </div>

        {/* Order Summary */}
        <OrderSummary order={order} />
      </div>
    </div>
  );
}

