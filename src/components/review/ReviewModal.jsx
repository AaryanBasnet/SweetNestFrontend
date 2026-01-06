/**
 * ReviewModal Component
 * Modal for creating/editing reviews
 * Follows ReminderModal pattern from codebase
 */

import { X } from 'lucide-react';
import ReviewForm from './ReviewForm';
import { useCreateReview, useUpdateReview } from '../../hooks/review/useReviews';
import { toast } from 'react-toastify';

export default function ReviewModal({
  isOpen,
  onClose,
  cakeId,
  existingReview = null,
  onSuccess,
}) {
  const createReview = useCreateReview(cakeId);
  const updateReview = useUpdateReview(cakeId);

  const isEditing = !!existingReview;

  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await updateReview.mutateAsync({
          reviewId: existingReview._id,
          reviewData: values,
        });
        toast.success('Review updated successfully!');
      } else {
        await createReview.mutateAsync(values);
        toast.success('Review submitted successfully!');
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        `Failed to ${isEditing ? 'update' : 'submit'} review`;
      toast.error(errorMessage);
      throw error; // Let form handle error state
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark/10">
          <h2 className="text-xl font-serif text-dark">
            {isEditing ? 'Edit Your Review' : 'Write a Review'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-dark/5 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-dark/50" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <ReviewForm
            existingReview={existingReview}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={createReview.isPending || updateReview.isPending}
          />
        </div>
      </div>
    </div>
  );
}
