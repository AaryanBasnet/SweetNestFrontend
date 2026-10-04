/**
 * Rewards Page
 * View reward tiers, redeem points for coupons, and manage coupons
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Gift,
  Award,
  Clock,
  Check,
  Star,
  ChevronRight,
  Ticket,
  Calendar,
  Tag,
  TrendingUp,
  Copy,
  Package,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';
import {
  getRewardTiersApi,
  getUserPointsApi,
  redeemPointsApi,
  getUserCouponsApi,
} from '../api/rewardsApi';

// Tier icon mapping
const TIER_ICONS = {
  bronze: { icon: Award, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  silver: { icon: Star, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-300' },
  gold: { icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-300' },
  platinum: { icon: Star, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-300' },
};

// Reward Tier Card Component
function RewardTierCard({ tier, userPoints, onRedeem, isRedeeming }) {
  const canRedeem = userPoints >= tier.pointsCost;
  const Icon = TIER_ICONS[tier.id]?.icon || Award;
  const colors = TIER_ICONS[tier.id];

  return (
    <div
      className={`bg-white rounded-2xl p-6 border-2 ${colors.border} transition-all hover:shadow-lg ${
        canRedeem ? 'opacity-100' : 'opacity-75'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center`}>
          <Icon size={24} className={colors.color} />
        </div>
        {canRedeem && (
          <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
            Available
          </span>
        )}
      </div>

      {/* Tier Name */}
      <h3 className="text-xl font-semibold text-dark mb-2">{tier.name}</h3>
      <p className="text-dark/60 text-sm mb-4">{tier.description}</p>

      {/* Points Cost */}
      <div className="flex items-center gap-2 mb-4">
        <Gift size={18} className="text-accent" />
        <span className="text-lg font-semibold text-dark">{tier.pointsCost} Points</span>
      </div>

      {/* Discount Info */}
      <div className="bg-cream/50 rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-dark/60">Discount</span>
          <span className="font-semibold text-dark">
            {tier.discountType === 'percentage' ? `${tier.discountValue}% OFF` : `Rs. ${tier.discountValue} OFF`}
          </span>
        </div>
        {tier.maxDiscount && (
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-dark/60">Max Discount</span>
            <span className="font-medium text-dark">Rs. {tier.maxDiscount}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-dark/60">Min. Order</span>
          <span className="font-medium text-dark">Rs. {tier.minOrderAmount}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-dark/60">Valid For</span>
          <span className="font-medium text-dark">{tier.validityDays} days</span>
        </div>
      </div>

      {/* Redeem Button */}
      <button
        onClick={() => onRedeem(tier.id)}
        disabled={!canRedeem || isRedeeming}
        className={`w-full py-3 rounded-xl font-medium transition-all ${
          canRedeem
            ? 'bg-accent text-white hover:bg-accent/90'
            : 'bg-dark/10 text-dark/30 cursor-not-allowed'
        }`}
      >
        {isRedeeming ? 'Redeeming...' : canRedeem ? 'Redeem Now' : `Need ${tier.pointsCost - userPoints} more points`}
      </button>
    </div>
  );
}

// Coupon Card Component
function CouponCard({ coupon }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast.success('Coupon code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = new Date(coupon.expiresAt) <= new Date();
  const expiryDate = new Date(coupon.expiresAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`bg-white rounded-2xl border-2 overflow-hidden ${coupon.isUsed ? 'border-gray-200 opacity-60' : isExpired ? 'border-orange-200' : 'border-accent/20'}`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-dark mb-1">{coupon.rewardTier.name}</h4>
            <p className="text-sm text-dark/50">
              {coupon.discountType === 'percentage'
                ? `${coupon.discountValue}% OFF`
                : `Rs. ${coupon.discountValue} OFF`}
            </p>
          </div>
          {coupon.isUsed ? (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex items-center gap-1">
              <Check size={14} /> Used
            </span>
          ) : isExpired ? (
            <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">
              Expired
            </span>
          ) : (
            <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
              Active
            </span>
          )}
        </div>

        {/* Coupon Code */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-cream rounded-xl px-4 py-3 font-mono font-semibold text-dark tracking-wider">
            {coupon.code}
          </div>
          <button
            onClick={handleCopy}
            className="p-3 bg-dark text-white rounded-xl hover:bg-dark/90 transition-colors"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-dark/60">
            <Tag size={14} />
            <span>Min. order: Rs. {coupon.minOrderAmount}</span>
          </div>
          {coupon.maxDiscount && (
            <div className="flex items-center gap-2 text-dark/60">
              <Tag size={14} />
              <span>Max discount: Rs. {coupon.maxDiscount}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-dark/60">
            <Calendar size={14} />
            <span>{coupon.isUsed ? `Used on ${new Date(coupon.usedAt).toLocaleDateString()}` : `Valid until ${expiryDate}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Points History Item
function PointsHistoryItem({ item }) {
  const isEarned = item.type === 'earned';

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-cream/30 transition-colors">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isEarned ? 'bg-green-50' : 'bg-orange-50'}`}>
        {isEarned ? (
          <TrendingUp size={18} className="text-green-600" />
        ) : (
          <Gift size={18} className="text-orange-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-dark font-medium text-sm">{item.description}</p>
        <p className="text-dark/40 text-xs">
          {new Date(item.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>
      <span className={`text-lg font-semibold ${isEarned ? 'text-green-600' : 'text-orange-600'}`}>
        {isEarned ? '+' : ''}{item.amount}
      </span>
    </div>
  );
}

// Main Rewards Component
export default function Rewards() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('redeem');
  const [tiers, setTiers] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [coupons, setCoupons] = useState({ active: [], used: [], expired: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.info('Please login to view rewards');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch data
  useEffect(() => {
    if (isAuthenticated()) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tiersRes, pointsRes, couponsRes] = await Promise.all([
        getRewardTiersApi(),
        getUserPointsApi(),
        getUserCouponsApi('all'),
      ]);

      setTiers(tiersRes.data?.data?.tiers || []);
      setUserPoints(pointsRes.data?.data?.balance || 0);
      setPointsHistory(pointsRes.data?.data?.history || []);
      setCoupons(couponsRes.data?.data?.coupons || { active: [], used: [], expired: [] });
    } catch (error) {
      console.error('Error fetching rewards data:', error);
      setError(error.response?.data?.message || 'Failed to load rewards data');
      toast.error('Failed to load rewards');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async (tierId) => {
    setIsRedeeming(true);
    try {
      const response = await redeemPointsApi(tierId);
      const newCoupon = response.data?.data?.coupon;
      const remainingPoints = response.data?.data?.remainingPoints;

      toast.success('Coupon redeemed successfully!');
      setUserPoints(remainingPoints);
      setActiveTab('coupons');

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error redeeming points:', error);
      toast.error(error.response?.data?.message || 'Failed to redeem points');
    } finally {
      setIsRedeeming(false);
    }
  };

  const tabs = [
    { id: 'redeem', label: 'Redeem Rewards', icon: Gift },
    { id: 'coupons', label: 'My Coupons', icon: Ticket },
    { id: 'history', label: 'Points History', icon: Clock },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark/50">Loading rewards...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift size={48} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-serif text-dark mb-3">Unable to Load Rewards</h2>
          <p className="text-dark/60 mb-8">{error}</p>
          <button
            onClick={fetchData}
            className="px-8 py-4 bg-accent text-white font-medium rounded-full hover:bg-accent/90 transition-all shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-dark mb-2">
            Sweet<span className="text-accent italic">Rewards</span>
          </h1>
          <p className="text-dark/60">Earn points on every order and redeem them for exciting rewards!</p>
        </div>

        {/* Points Balance Card */}
        <div className="bg-gradient-to-br from-accent to-orange-500 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1 uppercase tracking-wide">Your Balance</p>
              <h2 className="text-4xl sm:text-5xl font-bold">{userPoints}</h2>
              <p className="text-white/90 mt-1">SweetPoints</p>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Gift size={40} className="text-white" />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-white/80 text-sm">
              <span className="font-semibold">💡 Tip:</span> Earn 1 point for every Rs. 10 spent!
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-dark text-white shadow-lg'
                    : 'bg-white text-dark/60 hover:text-dark hover:bg-white/80'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {/* Redeem Tab */}
          {activeTab === 'redeem' && (
            <>
              {userPoints === 0 && pointsHistory.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl">
                  <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
                    <Gift size={48} className="text-dark/25" />
                  </div>
                  <h2 className="text-2xl font-serif text-dark mb-3">
                    Start Earning <span className="text-accent italic">SweetPoints!</span>
                  </h2>
                  <p className="text-dark/60 max-w-md mx-auto mb-8">
                    You haven't earned any points yet. Complete your first order to start earning points and unlock amazing rewards!
                  </p>

                  {/* How it works */}
                  <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-cream/50 rounded-2xl p-6">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                        <Package size={24} className="text-white" />
                      </div>
                      <h4 className="font-semibold text-dark mb-2">1. Place Orders</h4>
                      <p className="text-sm text-dark/60">Earn 1 point for every Rs. 10 spent on your orders</p>
                    </div>
                    <div className="bg-cream/50 rounded-2xl p-6">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                        <Gift size={24} className="text-white" />
                      </div>
                      <h4 className="font-semibold text-dark mb-2">2. Collect Points</h4>
                      <p className="text-sm text-dark/60">Points are automatically added when your order is delivered</p>
                    </div>
                    <div className="bg-cream/50 rounded-2xl p-6">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                        <Ticket size={24} className="text-white" />
                      </div>
                      <h4 className="font-semibold text-dark mb-2">3. Redeem Rewards</h4>
                      <p className="text-sm text-dark/60">Exchange points for discount coupons on future orders</p>
                    </div>
                  </div>

                  <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-medium rounded-full hover:bg-accent/90 transition-all shadow-lg"
                  >
                    Start Shopping
                    <ChevronRight size={18} />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tiers.map((tier) => (
                    <RewardTierCard
                      key={tier.id}
                      tier={tier}
                      userPoints={userPoints}
                      onRedeem={handleRedeem}
                      isRedeeming={isRedeeming}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Coupons Tab */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              {coupons.active.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-dark mb-4">Active Coupons</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coupons.active.map((coupon) => (
                      <CouponCard key={coupon._id} coupon={coupon} />
                    ))}
                  </div>
                </div>
              )}

              {coupons.used.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-dark mb-4">Used Coupons</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coupons.used.map((coupon) => (
                      <CouponCard key={coupon._id} coupon={coupon} />
                    ))}
                  </div>
                </div>
              )}

              {coupons.expired.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-dark mb-4">Expired Coupons</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coupons.expired.map((coupon) => (
                      <CouponCard key={coupon._id} coupon={coupon} />
                    ))}
                  </div>
                </div>
              )}

              {coupons.active.length === 0 && coupons.used.length === 0 && coupons.expired.length === 0 && (
                <div className="text-center py-16">
                  <Ticket size={64} className="mx-auto text-dark/20 mb-4" />
                  <h3 className="text-xl font-semibold text-dark mb-2">No coupons yet</h3>
                  <p className="text-dark/50 mb-6">Redeem your points to get coupons!</p>
                  <button
                    onClick={() => setActiveTab('redeem')}
                    className="px-6 py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
                  >
                    Browse Rewards
                  </button>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {pointsHistory.length > 0 ? (
                pointsHistory.map((item, index) => <PointsHistoryItem key={index} item={item} />)
              ) : (
                <div className="text-center py-16">
                  <Clock size={64} className="mx-auto text-dark/20 mb-4" />
                  <h3 className="text-xl font-semibold text-dark mb-2">No points history</h3>
                  <p className="text-dark/50">Complete orders to start earning points!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
