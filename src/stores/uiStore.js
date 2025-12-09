import { create } from "zustand";

const useUIStore = create((set) => ({
  // Modal state
  activeModal: null,
  modalData: null,

  // Loading states
  isPageLoading: false,

  // Sidebar
  isSidebarOpen: false,

  // Actions
  openModal: (modalName, data = null) =>
    set({ activeModal: modalName, modalData: data }),

  closeModal: () => set({ activeModal: null, modalData: null }),

  setPageLoading: (loading) => set({ isPageLoading: loading }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  openSidebar: () => set({ isSidebarOpen: true }),

  closeSidebar: () => set({ isSidebarOpen: false }),
}));

export default useUIStore;
