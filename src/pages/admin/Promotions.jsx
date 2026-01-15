/**
 * Admin Promotions Page
 * Manage seasonal promotions and campaigns
 */

import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Image } from 'lucide-react';
import {
  usePromotions,
  useCreatePromotion,
  useDeletePromotion,
} from '../../hooks/promotion';
import { PageHeader, DataTable, StatusBadge, ConfirmModal } from '../../components/admin/shared';
import AddPromotionModal from '../../components/admin/shared/AddPromotionModal';
import { toast } from 'react-toastify';

export default function Promotions() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  // Fetch promotions
  const { data: promotionsData, isLoading } = usePromotions();
  const promotions = promotionsData?.data || [];

  // Mutations
  const createPromotion = useCreatePromotion();
  const deletePromotion = useDeletePromotion();

  // Table columns
  const columns = [
    {
      key: 'image',
      label: 'Promotion',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream">
            <img
              src={row.images?.[0]?.url || 'https://via.placeholder.com/64'}
              alt={row.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-dark">{row.title}</p>
            <p className="text-xs text-dark/50 line-clamp-1">{row.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'seasonTag',
      label: 'Season',
      render: (value) => (
        <span className="text-sm px-2 py-1 bg-accent/10 text-accent rounded-full capitalize">
          {value}
        </span>
      ),
    },
    {
      key: 'startDate',
      label: 'Duration',
      render: (_, row) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-dark/70">
            <Calendar size={14} />
            <span>{new Date(row.startDate).toLocaleDateString()}</span>
          </div>
          <div className="text-xs text-dark/50">
            to {new Date(row.endDate).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
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

  const handleDeleteClick = (promotion) => {
    setSelectedPromotion(promotion);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePromotion.mutateAsync(selectedPromotion._id);
      toast.success('Promotion deleted successfully');
      setDeleteModalOpen(false);
      setSelectedPromotion(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete promotion');
    }
  };

  const handleCreatePromotion = async (formData) => {
    try {
      const promotionData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        seasonTag: formData.seasonTag,
        ctaText: formData.ctaText,
        priority: formData.priority,
        isActive: formData.isActive,
        images: formData.images,
      };

      // Add linked cake if selected
      if (formData.linkedCake) {
        promotionData.linkedCakes = [formData.linkedCake];
      }

      await createPromotion.mutateAsync(promotionData);
      toast.success('Promotion created successfully');
      setAddModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create promotion');
    }
  };

  const headerActions = (
    <button
      onClick={() => setAddModalOpen(true)}
      className="flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-lg hover:bg-dark/90 transition-colors"
    >
      <Plus size={18} />
      Add Promotion
    </button>
  );

  return (
    <div>
      <PageHeader
        title="Promotions"
        subtitle="Manage seasonal campaigns and banners"
        actions={headerActions}
      />

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={promotions}
          loading={isLoading}
          emptyMessage="No promotions found"
          emptyIcon={<Image size={48} className="text-dark/20" />}
        />
      </div>

      {/* Add Promotion Modal */}
      <AddPromotionModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleCreatePromotion}
        isLoading={createPromotion.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Promotion"
        message={`Are you sure you want to delete "${selectedPromotion?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deletePromotion.isPending}
      />
    </div>
  );
}
