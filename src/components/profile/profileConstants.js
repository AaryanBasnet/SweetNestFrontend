/**
 * Profile Tab Configuration
 * Centralized constants for profile page
 */

import { User, Package, MapPin, Settings } from 'lucide-react';

/**
 * Profile navigation tabs
 */
export const PROFILE_TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'orders', label: 'Order History', icon: Package },
  { id: 'address', label: 'Address Book', icon: MapPin },
  { id: 'settings', label: 'Settings', icon: Settings },
];

/**
 * Valid tab IDs for validation
 */
export const VALID_TAB_IDS = PROFILE_TABS.map((tab) => tab.id);

/**
 * Default tab
 */
export const DEFAULT_TAB = 'overview';

/**
 * Get valid tab from URL parameter
 * @param {string} tabFromUrl - Tab ID from URL
 * @returns {string} Valid tab ID or default
 */
export const getValidTab = (tabFromUrl) => {
  return VALID_TAB_IDS.includes(tabFromUrl) ? tabFromUrl : DEFAULT_TAB;
};

