/**
 * Admin Store
 * Zustand store for admin panel state
 * Manages filters, selections, and UI state
 */

import { create } from 'zustand';

const useAdminStore = create((set, get) => ({
  // Orders state
  ordersFilters: {
    status: null,
    search: '',
    startDate: null,
    endDate: null,
    page: 1,
    limit: 10,
  },

  // Products state
  productsFilters: {
    category: null,
    search: '',
    page: 1,
    limit: 10,
    sort: '-createdAt',
  },

  // Customers state
  customersFilters: {
    search: '',
    page: 1,
    limit: 10,
  },

  // Selected items for bulk actions
  selectedOrders: [],
  selectedProducts: [],
  selectedCustomers: [],

  // Modal states
  modals: {
    deleteConfirm: false,
    orderDetails: false,
    productForm: false,
  },
  modalData: null,

  // Actions - Orders
  setOrdersFilter: (key, value) =>
    set((state) => ({
      ordersFilters: { ...state.ordersFilters, [key]: value, page: key !== 'page' ? 1 : value },
    })),

  resetOrdersFilters: () =>
    set({
      ordersFilters: {
        status: null,
        search: '',
        startDate: null,
        endDate: null,
        page: 1,
        limit: 10,
      },
    }),

  setSelectedOrders: (ids) => set({ selectedOrders: ids }),

  toggleOrderSelection: (id) =>
    set((state) => {
      const isSelected = state.selectedOrders.includes(id);
      return {
        selectedOrders: isSelected
          ? state.selectedOrders.filter((i) => i !== id)
          : [...state.selectedOrders, id],
      };
    }),

  // Actions - Products
  setProductsFilter: (key, value) =>
    set((state) => ({
      productsFilters: { ...state.productsFilters, [key]: value, page: key !== 'page' ? 1 : value },
    })),

  resetProductsFilters: () =>
    set({
      productsFilters: {
        category: null,
        search: '',
        page: 1,
        limit: 10,
        sort: '-createdAt',
      },
    }),

  setSelectedProducts: (ids) => set({ selectedProducts: ids }),

  toggleProductSelection: (id) =>
    set((state) => {
      const isSelected = state.selectedProducts.includes(id);
      return {
        selectedProducts: isSelected
          ? state.selectedProducts.filter((i) => i !== id)
          : [...state.selectedProducts, id],
      };
    }),

  // Actions - Customers
  setCustomersFilter: (key, value) =>
    set((state) => ({
      customersFilters: { ...state.customersFilters, [key]: value, page: key !== 'page' ? 1 : value },
    })),

  resetCustomersFilters: () =>
    set({
      customersFilters: {
        search: '',
        page: 1,
        limit: 10,
      },
    }),

  // Actions - Modals
  openModal: (modalName, data = null) =>
    set((state) => ({
      modals: { ...state.modals, [modalName]: true },
      modalData: data,
    })),

  closeModal: (modalName) =>
    set((state) => ({
      modals: { ...state.modals, [modalName]: false },
      modalData: null,
    })),

  // Clear all selections
  clearAllSelections: () =>
    set({
      selectedOrders: [],
      selectedProducts: [],
      selectedCustomers: [],
    }),
}));

export default useAdminStore;
