/**
 * Admin Products Page
 * Product management with CRUD operations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
// IMPORT HOOKS
import {
  useAdminProducts,
  useDeleteProduct,
  useToggleProductStatus,
  useCreateProduct,
  useUpdateProduct,
} from '../../hooks/admin';
import useAdminStore from '../../stores/adminStore';
import {
  PageHeader,
  DataTable,
  StatusBadge,
  ConfirmModal,
  AddProductModal,
} from '../../components/admin/shared';
import { toast } from 'react-toastify';

export default function Products() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // States for Modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  
  // Selection States
  const [selectedProduct, setSelectedProduct] = useState(null); // For delete
  const [editingProduct, setEditingProduct] = useState(null);   // For edit

  const {
    productsFilters,
    setProductsFilter,
    selectedProducts,
    toggleProductSelection,
    setSelectedProducts,
  } = useAdminStore();

  // Fetch products
  const { data: productsData, isLoading } = useAdminProducts(productsFilters);
  const products = productsData?.data || [];
  const pagination = productsData?.pagination;

  // Mutations
  const deleteProduct = useDeleteProduct();
  const toggleStatus = useToggleProductStatus();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  // --- ACTIONS ---

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct.mutateAsync(selectedProduct._id);
      toast.success('Product deleted successfully');
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  // Click handler for Adding (resets edit state)
  const handleAddClick = () => {
    setEditingProduct(null);
    setAddModalOpen(true);
  };

  // Click handler for Editing (sets edit state)
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setAddModalOpen(true);
  };

  // --- FORM DATA LOGIC ---
  const prepareFormData = (data) => {
    const formData = new FormData();

    // 1. Basic Fields
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('isActive', data.isActive);
    formData.append('isFeatured', data.isFeatured);
    formData.append('storageAndCare', data.storageAndCare);

    // 2. Complex Fields (Arrays) - Stringify for Backend Parsing
    formData.append('weightOptions', JSON.stringify(data.weightOptions));
    formData.append('ingredients', JSON.stringify(data.ingredients));

    // 3. Removed Images
    if (data.removedImageIds && data.removedImageIds.length > 0) {
      formData.append('removeImages', JSON.stringify(data.removedImageIds));
    }

    // 4. New Image Files
    if (data.images && data.images.length > 0) {
      data.images.forEach((img) => {
        // Only append raw File objects (new uploads)
        if (img instanceof File) {
          formData.append('images', img);
        }
      });
    }

    return formData;
  };

  const handleModalSubmit = async (productData) => {
    // Determine mode based on editingProduct state
    const isEdit = !!editingProduct;
    const mutation = isEdit ? updateProduct : createProduct;
    
    // Convert JS object to FormData
    const formData = prepareFormData(productData);

    try {
      if (isEdit) {
        await mutation.mutateAsync({ id: editingProduct._id, data: formData });
        toast.success('Product updated successfully');
      } else {
        await mutation.mutateAsync(formData);
        toast.success('Product added successfully');
      }
      setAddModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} product`);
    }
  };

  // --- COLUMNS ---
  const columns = [
    {
      key: 'image',
      label: 'Product',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream">
            <img
              src={row.images?.[0]?.url || 'https://via.placeholder.com/48'}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-dark">{row.name}</p>
            <p className="text-xs text-dark/50">{row.category?.name || 'Uncategorized'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'basePrice',
      label: 'Price',
      render: (value, row) => (
        <div>
          <span className="font-medium">Rs. {value || row.weightOptions?.[0]?.price || 0}</span>
          {row.weightOptions?.length > 1 && (
            <span className="text-xs text-dark/40 ml-1">
              ({row.weightOptions.length} options)
            </span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'ratingsAverage',
      label: 'Rating',
      render: (value, row) => (
        <div className="flex items-center gap-1">
          <span className="text-amber-500">★</span>
          <span>{value?.toFixed(1) || '0.0'}</span>
          <span className="text-dark/40">({row.ratingsCount || 0})</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => <StatusBadge status={value ? 'active' : 'inactive'} />,
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/admin/products/${row._id}`)}
            className="p-2 hover:bg-dark/5 rounded-lg transition-colors"
            title="View"
          >
            <Eye size={16} className="text-dark/40" />
          </button>
          
          {/* Edit Button */}
          <button
            onClick={() => handleEditClick(row)}
            className="p-2 hover:bg-dark/5 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit size={16} className="text-dark/40" />
          </button>
          
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your cake products"
        actions={
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            <Plus size={18} />
            Add Product
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="relative flex-1 sm:max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setProductsFilter('search', e.target.value);
            }}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Category Filter */}
          <select
            value={productsFilters.category || ''}
            onChange={(e) => setProductsFilter('category', e.target.value || null)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-dark/10 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent"
          >
            <option value="">All Categories</option>
            <option value="cakes">Cakes</option>
            <option value="cupcakes">Cupcakes</option>
            <option value="macarons">Macarons</option>
          </select>

          {/* Sort */}
          <select
            value={productsFilters.sort}
            onChange={(e) => setProductsFilter('sort', e.target.value)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-dark/10 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent"
          >
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="basePrice">Price: Low</option>
            <option value="-basePrice">Price: High</option>
            <option value="-ratingsAverage">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        selectedRows={selectedProducts}
        onSelectRow={toggleProductSelection}
        onSelectAll={(checked) => setSelectedProducts(checked ? products.map((p) => p._id) : [])}
        pagination={
          pagination
            ? {
                page: pagination.currentPage,
                totalPages: pagination.totalPages,
                total: pagination.totalItems,
                from: (pagination.currentPage - 1) * pagination.itemsPerPage + 1,
                to: Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems),
              }
            : null
        }
        onPageChange={(page) => setProductsFilter('page', page)}
        emptyMessage="No products found. Add your first product!"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleteProduct.isPending}
      />

      {/* Add/Edit Product Modal */}
      <AddProductModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleModalSubmit}
        isLoading={createProduct.isPending || updateProduct.isPending}
        initialData={editingProduct} // Pass the product data for editing
      />
    </div>
  );
}