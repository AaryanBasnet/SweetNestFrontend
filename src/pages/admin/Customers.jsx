import { useState, useEffect, useRef } from "react";
import {
  Search,
  Mail,
  Phone,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  Check
} from "lucide-react";
import { PageHeader, DataTable } from "../../components/admin/shared";
import { useCustomers } from "../../hooks/admin/useCustomers";

// --- Helper Hook: Click Outside (to close dropdown) ---
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// --- Helper Hook: Debounce ---
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Customers() {
  // --- State ---
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  // Sort State (Default: Newest First)
  const [sort, setSort] = useState({ key: "createdAt", order: "desc" });

  // Dropdown State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  useClickOutside(filterRef, () => setIsFilterOpen(false));

  const debouncedSearch = useDebounce(search, 500);

  // --- Fetch Data ---
  const { data, isLoading } = useCustomers({
    page,
    limit: 10,
    search: debouncedSearch,
    sort: sort.key,
    order: sort.order,
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort]);

  // --- Filter Options Configuration ---
  const filterOptions = [
    { label: "Newest Members", key: "createdAt", order: "desc" },
    { label: "Oldest Members", key: "createdAt", order: "asc" },
    { label: "Highest Spenders", key: "totalSpent", order: "desc" },
    { label: "Most Frequent Buyers", key: "orders", order: "desc" },
  ];

  // Get current active label
  const currentLabel = filterOptions.find(
    (o) => o.key === sort.key && o.order === sort.order
  )?.label || "Custom Sort";

  const handleFilterSelect = (option) => {
    setSort({ key: option.key, order: option.order });
    setIsFilterOpen(false);
  };

  // --- Prepare Data ---
  const stats = data?.stats || { totalCustomers: 0, totalRevenue: 0, totalOrders: 0 };
  const pagination = data?.pagination || { total: 0, pages: 1, page: 1 };
  
  const customers = data?.customers.map((c) => ({
    id: c._id,
    name: c.name || "Unknown",
    email: c.email || "",
    phone: c.phone || "N/A",
    orders: c.orders || 0,
    totalSpent: c.totalSpent || 0,
    joinedAt: c.createdAt || new Date().toISOString(),
    avatar: c.avatar || null,
  })) ?? [];

  const avgOrderValue = stats.totalOrders > 0 
    ? Math.round(stats.totalRevenue / stats.totalOrders) 
    : 0;

  // --- Columns ---
  const columns = [
    {
      key: "name",
      label: "Customer",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden">
            {row.avatar ? (
              <img src={row.avatar} alt={value} className="w-full h-full object-cover" />
            ) : (
              <span className="text-accent font-medium">{value.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <p className="font-medium text-dark">{value}</p>
            <p className="text-xs text-dark/50">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (value) => (
        <div className="flex items-center gap-2 text-dark/70">
          <Phone size={14} />
          {value}
        </div>
      ),
    },
    {
      key: "orders",
      label: "Orders",
      header: (
        <button onClick={() => setSort({ key: "orders", order: "desc" })} className="flex items-center gap-1 hover:text-accent">
          Orders <ArrowUpDown size={14} />
        </button>
      ),
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "totalSpent",
      label: "Total Spent",
      header: (
        <button onClick={() => setSort({ key: "totalSpent", order: "desc" })} className="flex items-center gap-1 hover:text-accent">
          Total Spent <ArrowUpDown size={14} />
        </button>
      ),
      render: (value) => (
        <span className="font-medium text-green-600">Rs. {value.toLocaleString()}</span>
      ),
    },
    {
      key: "joinedAt",
      label: "Joined",
      header: (
        <button onClick={() => setSort({ key: "createdAt", order: "desc" })} className="flex items-center gap-1 hover:text-accent">
          Joined <ArrowUpDown size={14} />
        </button>
      ),
      render: (value) =>
        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-accent border border-accent/20 rounded-lg hover:bg-accent/5 transition-colors">
          <Mail size={14} />
          Contact
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Customers" description="View and manage your customer base" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <p className="text-sm text-dark/50 mb-1">Total Customers</p>
          <p className="text-3xl font-serif text-dark">{stats.totalCustomers.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <p className="text-sm text-dark/50 mb-1">Total Revenue</p>
          <p className="text-3xl font-serif text-dark">Rs. {stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-dark/5">
          <p className="text-sm text-dark/50 mb-1">Avg. Order Value</p>
          <p className="text-3xl font-serif text-dark">Rs. {avgOrderValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4 mb-6 mt-8">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent"
          />
        </div>

        {/* --- DROPDOWN FILTER MENU --- */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
              isFilterOpen 
                ? "border-accent text-accent bg-accent/5" 
                : "border-dark/10 hover:bg-dark/5 text-dark"
            }`}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">{currentLabel}</span>
            <ChevronDown 
              size={14} 
              className={`transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`} 
            />
          </button>

          {/* Dropdown Content */}
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-dark/10 rounded-lg shadow-xl z-20 py-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 text-xs font-semibold text-dark/40 uppercase tracking-wider border-b border-dark/5 mb-1">
                Sort Customers By
              </div>
              {filterOptions.map((option) => {
                const isSelected = sort.key === option.key && sort.order === option.order;
                return (
                  <button
                    key={option.label}
                    onClick={() => handleFilterSelect(option)}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-dark/5 transition-colors ${
                      isSelected ? "text-accent bg-accent/5 font-medium" : "text-dark/80"
                    }`}
                  >
                    {option.label}
                    {isSelected && <Check size={16} className="text-accent" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={customers}
        emptyMessage={isLoading ? "Loading..." : "No customers found"}
      />

      {/* Pagination */}
      {!isLoading && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-sm text-dark/50">
            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination.total)} of {pagination.total} entries
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-dark/10 rounded-lg disabled:opacity-50 hover:bg-dark/5"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 py-2 text-sm bg-accent/5 text-accent font-medium rounded-lg">
              Page {page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="p-2 border border-dark/10 rounded-lg disabled:opacity-50 hover:bg-dark/5"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}