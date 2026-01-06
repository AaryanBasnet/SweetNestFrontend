/**
 * AddressModal Component
 * Modal for creating/editing addresses
 * Follows ReviewModal and ReminderModal pattern from codebase
 */

import { X } from 'lucide-react';
import AddressForm from './AddressForm';
import { useCreateAddress, useUpdateAddress } from '../../hooks/address';
import { toast } from 'react-toastify';

export default function AddressModal({
  isOpen,
  onClose,
  existingAddress = null,
  onSuccess,
}) {
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();

  const isEditing = !!existingAddress;

  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await updateAddress.mutateAsync({
          addressId: existingAddress._id,
          addressData: values,
        });
        toast.success('Address updated successfully!');
      } else {
        await createAddress.mutateAsync(values);
        toast.success('Address saved successfully!');
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        `Failed to ${isEditing ? 'update' : 'save'} address`;
      toast.error(errorMessage);
      throw error; // Let form handle error state
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark/10 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-serif text-dark">
            {isEditing ? 'Edit Address' : 'Add New Address'}
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
          <AddressForm
            existingAddress={existingAddress}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={createAddress.isPending || updateAddress.isPending}
          />
        </div>
      </div>
    </div>
  );
}
