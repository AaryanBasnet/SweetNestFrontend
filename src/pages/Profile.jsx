/**
 * Profile Page
 * User profile with overview, order history, address book, settings
 *
 * This is a slim orchestrator component that delegates to sub-components
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Stores
import useAuthStore from "../stores/authStore";
import useWishlistStore from "../stores/wishlistStore";

// Custom Hooks
import useOrders from "../hooks/user/useOrders";
import useProfileForm from "../hooks/user/useProfileForm";

// Components
import {
  ProfileSidebar,
  OverviewTab,
  OrderHistoryTab,
  AddressBookTab,
  SettingsTab,
  getValidTab,
  DEFAULT_TAB,
  VALID_TAB_IDS,
} from "../components/profile";

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const wishlistCount = useWishlistStore((state) => state.getCount());

  // Get initial tab from URL or default to 'overview'
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(getValidTab(tabFromUrl));

  // Custom hooks for data and form management
  const {
    orders,
    recentOrders,
    ordersCount,
    isLoading: isLoadingOrders,
    error: ordersError,
    refetch: refetchOrders,
  } = useOrders();

  const {
    formData,
    isEditing,
    isSaving,
    handleInputChange,
    startEditing,
    cancelEditing,
    saveProfile,
  } = useProfileForm();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Sync tab with URL when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    const validTab = getValidTab(tab);
    if (validTab !== activeTab) {
      setActiveTab(validTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    // Ignore if already on this tab
    if (activeTab === tabId) {
      return;
    }

    setActiveTab(tabId);

    if (tabId === DEFAULT_TAB) {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tabId });
    }
  };

  // Early return if no user
  if (!user) return null;

  const firstName = user.name?.split(" ")[0] || "User";

  // TODO: Get sweet points from user object when implemented
  const sweetPoints = user.sweetPoints || 0;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="mx-[20px] sm:mx-[40px] lg:mx-[80px] py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <ProfileSidebar
            user={user}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            sweetPoints={sweetPoints}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="relative">
              <div
                className={`transition-opacity duration-200 ${
                  activeTab === "overview" ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
              >
                {activeTab === "overview" && (
                  <OverviewTab
                    firstName={firstName}
                    ordersCount={ordersCount}
                    wishlistCount={wishlistCount}
                    recentOrders={recentOrders}
                    isLoadingOrders={isLoadingOrders}
                    user={user}
                    formData={formData}
                    isEditing={isEditing}
                    isSaving={isSaving}
                    onInputChange={handleInputChange}
                    onEdit={startEditing}
                    onSave={saveProfile}
                    onCancel={cancelEditing}
                  />
                )}
              </div>

              <div
                className={`transition-opacity duration-200 ${
                  activeTab === "orders" ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
              >
                {activeTab === "orders" && (
                  <OrderHistoryTab
                    orders={orders}
                    isLoading={isLoadingOrders}
                    error={ordersError}
                    onRetry={refetchOrders}
                  />
                )}
              </div>

              <div
                className={`transition-opacity duration-200 ${
                  activeTab === "address" ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
              >
                {activeTab === "address" && <AddressBookTab user={user} />}
              </div>

              <div
                className={`transition-opacity duration-200 ${
                  activeTab === "settings" ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
              >
                {activeTab === "settings" && <SettingsTab />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
