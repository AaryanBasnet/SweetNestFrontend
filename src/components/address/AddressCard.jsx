/**
 * AddressCard Component
 * Displays a single address with actions
 * Fully controlled - receives all data via props
 */

import { MapPin, Edit2, Trash2, Star } from 'lucide-react';
import { formatAddressDisplay, getLabelDisplay } from '../../services/address/addressService';

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isLoading = false,
}) {
  // Color mapping for label badges
  const labelColors = {
    Home: 'bg-blue-100 text-blue-700',
    Office: 'bg-purple-100 text-purple-700',
    Other: 'bg-gray-100 text-gray-700',
    Custom: 'bg-green-100 text-green-700',
  };

  const labelColor = labelColors[address.label] || labelColors.Other;

  return (
    <div className={`bg-white border border-dark/10 rounded-xl p-5 transition-all ${
      address.isDefault ? 'ring-2 ring-accent/20 border-accent' : ''
    }`}>
      {/* Header: Label & Default Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${labelColor}`}>
            {getLabelDisplay(address)}
          </span>
          {address.isDefault && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-accent/10 text-accent rounded-md text-xs font-medium">
              <Star size={12} className="fill-accent" />
              Default
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <div className="mb-2">
        <p className="text-base font-medium text-dark">
          {address.firstName} {address.lastName}
        </p>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 mb-3">
        <MapPin size={16} className="text-dark/40 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-dark/70 leading-relaxed">
          <p>{address.address}</p>
          {address.apartment && <p>{address.apartment}</p>}
          <p>
            {address.city}
            {address.postalCode && `, ${address.postalCode}`}
          </p>
        </div>
      </div>

      {/* Phone */}
      <div className="mb-4">
        <p className="text-sm text-dark/60">Phone: {address.phone}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-dark/10">
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address._id)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-accent border border-accent rounded-lg hover:bg-accent/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Star size={14} />
            Set as Default
          </button>
        )}

        <button
          onClick={() => onEdit(address)}
          disabled={isLoading}
          className={`${
            address.isDefault ? 'flex-1' : ''
          } flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-dark/70 border border-dark/20 rounded-lg hover:bg-dark/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Edit2 size={14} />
          Edit
        </button>

        <button
          onClick={() => onDelete(address._id)}
          disabled={isLoading}
          className={`${
            address.isDefault ? 'flex-1' : ''
          } flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}
