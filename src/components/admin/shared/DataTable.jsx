/**
 * DataTable Component
 * Reusable table with sorting, selection, and pagination
 * Standalone - receives columns and data via props
 */

import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  sortField,
  sortOrder,
  onSort,
  pagination,
  onPageChange,
  emptyMessage = 'No data found',
}) {
  const handleSelectAll = (e) => {
    onSelectAll?.(e.target.checked);
  };

  const handleSelectRow = (id) => {
    onSelectRow?.(id);
  };

  const handleSort = (field) => {
    if (!onSort) return;
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(field, newOrder);
  };

  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <div className="bg-white rounded-2xl border border-dark/5 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cream/50">
            <tr>
              {/* Checkbox column */}
              {onSelectRow && (
                <th className="w-12 py-4 px-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => el && (el.indeterminate = someSelected)}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-dark/20 text-accent focus:ring-accent"
                  />
                </th>
              )}

              {/* Data columns */}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-4 px-4 text-left text-xs font-medium text-dark/50 uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer hover:text-dark' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortField === col.key && (
                      sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-dark/5">
                  {onSelectRow && (
                    <td className="py-4 px-4">
                      <div className="w-4 h-4 bg-dark/10 rounded animate-pulse" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="py-4 px-4">
                      <div className="h-4 bg-dark/10 rounded animate-pulse w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length + (onSelectRow ? 1 : 0)}
                  className="py-12 text-center text-dark/50"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((row) => (
                <tr
                  key={row.id || row._id}
                  className={`border-b border-dark/5 hover:bg-cream/30 transition-colors ${
                    selectedRows.includes(row.id || row._id) ? 'bg-accent/5' : ''
                  }`}
                >
                  {onSelectRow && (
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id || row._id)}
                        onChange={() => handleSelectRow(row.id || row._id)}
                        className="w-4 h-4 rounded border-dark/20 text-accent focus:ring-accent"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="py-4 px-4">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-dark/5">
          <span className="text-xs sm:text-sm text-dark/50 order-2 sm:order-1">
            Showing {pagination.from || 1} to {pagination.to || data.length} of{' '}
            {pagination.total || data.length} results
          </span>

          <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 sm:p-2 rounded-lg border border-dark/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark/5"
            >
              <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
            </button>

            {/* Page numbers - show fewer on mobile */}
            {Array.from({ length: Math.min(3, pagination.totalPages || 1) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange?.(pageNum)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    pagination.page === pageNum
                      ? 'bg-accent text-white'
                      : 'hover:bg-dark/5 text-dark/70'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 sm:p-2 rounded-lg border border-dark/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark/5"
            >
              <ChevronRight size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
