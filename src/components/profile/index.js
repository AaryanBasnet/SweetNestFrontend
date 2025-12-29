/**
 * Profile Components Index
 * Barrel export for profile components
 */

export { default as ProfileSidebar } from './ProfileSidebar';
export { default as OverviewTab } from './OverviewTab';
export { default as OrderHistoryTab } from './OrderHistoryTab';
export { default as AddressBookTab } from './AddressBookTab';
export { default as SettingsTab } from './SettingsTab';
export { default as OrderCardSkeleton } from './OrderCardSkeleton';

// Constants
export {
  PROFILE_TABS,
  VALID_TAB_IDS,
  DEFAULT_TAB,
  getValidTab
} from './profileConstants';

