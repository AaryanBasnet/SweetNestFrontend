/**
 * AddressList Component
 * Container for displaying list of addresses
 */

import AddressCard from './AddressCard';
import { Loader2, MapPin } from 'lucide-react';

export default function AddressList({
  addresses,
  isLoading,
  onEdit,
  onDelete,
  onSetDefault,
  isActionLoading = false,
}) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-dark/10 rounded-xl p-5 animate-pulse"
          >
            <div className="h-6 w-20 bg-dark/10 rounded mb-3" />
            <div className="h-5 w-32 bg-dark/10 rounded mb-2" />
            <div className="h-16 bg-dark/10 rounded mb-3" />
            <div className="h-4 w-40 bg-dark/10 rounded mb-4" />
            <div className="flex gap-2">
              <div className="h-9 flex-1 bg-dark/10 rounded" />
              <div className="h-9 w-20 bg-dark/10 rounded" />
              <div className="h-9 w-20 bg-dark/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!addresses || addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-dark/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin size={32} className="text-dark/30" />
        </div>
        <h3 className="text-lg font-serif text-dark mb-2">No addresses yet</h3>
        <p className="text-dark/60 text-sm mb-6">
          Add your first address to make checkout faster
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {addresses.map((address) => (
        <AddressCard
          key={address._id}
          address={address}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
          isLoading={isActionLoading}
        />
      ))}
    </div>
  );
}
