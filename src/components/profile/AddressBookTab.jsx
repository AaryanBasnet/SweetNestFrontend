/**
 * Address Book Tab Component
 * Full CRUD address management for user profile
 * Refactored from stub to production-ready implementation
 */

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AddressList, AddressModal } from '../address';
import DeleteModal from '../common/DeleteModal';
import {
  useAddresses,
  useDeleteAddress,
  useSetDefaultAddress,
} from '../../hooks/address';
import { toast } from 'react-toastify';

export default function AddressBookTab() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  // React Query hooks
  const { data: addresses, isLoading, error } = useAddresses();
  const deleteMutation = useDeleteAddress();
  const setDefaultMutation = useSetDefaultAddress();

  // Handlers
  const handleAddNew = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setModalOpen(true);
  };

  const handleDelete = (addressId) => {
    setAddressToDelete(addressId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(addressToDelete);
      toast.success('Address deleted successfully');
      setDeleteModalOpen(false);
      setAddressToDelete(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete address'
      );
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultMutation.mutateAsync(addressId);
      toast.success('Default address updated');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update default address'
      );
    }
  };

  // Check if user has reached address limit
  const hasReachedLimit = addresses && addresses.length >= 5;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif text-dark">
          Address Book
        </h1>
        <button
          onClick={handleAddNew}
          disabled={hasReachedLimit}
          className="flex items-center gap-2 px-4 py-2 bg-dark text-white text-sm font-medium rounded-full hover:bg-dark/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={hasReachedLimit ? 'Maximum 5 addresses allowed' : 'Add new address'}
        >
          <Plus size={18} />
          Add Address
        </button>
      </div>

      {/* Address limit warning */}
      {hasReachedLimit && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            You've reached the maximum limit of 5 addresses. Delete an address to add a new one.
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            {error.message || 'Failed to load addresses'}
          </p>
        </div>
      )}

      {/* Address List */}
      <AddressList
        addresses={addresses}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSetDefault={handleSetDefault}
        isActionLoading={deleteMutation.isPending || setDefaultMutation.isPending}
      />

      {/* Address Modal */}
      <AddressModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAddress(null);
        }}
        existingAddress={editingAddress}
        onSuccess={() => {
          // Modal handles success toast and closing
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setAddressToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        title="Delete Address?"
        message="Are you sure you want to delete this address? This action cannot be undone."
      />
    </div>
  );
}
