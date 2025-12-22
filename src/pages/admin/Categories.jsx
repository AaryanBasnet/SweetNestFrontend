/**
 * Admin Categories Page
 * Category management with CRUD operations
 */

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../../hooks/admin/useAdminCategories';
import { PageHeader, DataTable, StatusBadge, ConfirmModal, AddCategoryModal } from '../../components/admin/shared';
import { toast } from 'react-toastify';

export default function Categories() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCategory, setEditCategory] = useState(null);

  // Fetch categories
  const { data: categoriesData, isLoading } = useAdminCategories();
  const categories = categoriesData?.data || [];

  // Mutations
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // Table columns
  const columns = [
    {
      key: 'image',
      label: 'Category',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream">
            <img
              src={row.image?.url || 'https://via.placeholder.com/48'}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-dark">{row.name}</p>
            <p className="text-xs text-dark/50">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <span className="text-sm text-dark/70 line-clamp-2">
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'displayOrder',
      label: 'Order',
      render: (value) => (
        <span className="text-sm font-medium text-dark">{value}</span>
      ),
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

  const handleEditClick = (category) => {
    setEditCategory(category);
    setAddModalOpen(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleAddCategory = async (categoryData) => {
    try {
      await createCategory.mutateAsync(categoryData);
      toast.success('Category added successfully');
      setAddModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category');
    }
  };

  const handleUpdateCategory = async (categoryData) => {
    try {
      await updateCategory.mutateAsync({ id: editCategory._id, data: categoryData });
      toast.success('Category updated successfully');
      setAddModalOpen(false);
      setEditCategory(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory.mutateAsync(selectedCategory._id);
      toast.success('Category deleted successfully');
      setDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleModalClose = () => {
    setAddModalOpen(false);
    setEditCategory(null);
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage your product categories"
        actions={
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            <Plus size={18} />
            Add Category
          </button>
        }
      />

      {/* Categories Table */}
      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        emptyMessage="No categories found. Add your first category!"
      />

      {/* Add/Edit Category Modal */}
      <AddCategoryModal
        isOpen={addModalOpen}
        onClose={handleModalClose}
        onSubmit={editCategory ? handleUpdateCategory : handleAddCategory}
        isLoading={createCategory.isPending || updateCategory.isPending}
        editData={editCategory}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleteCategory.isPending}
      />
    </div>
  );
}
