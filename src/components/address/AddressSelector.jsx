/**
 * AddressSelector Component
 * For selecting saved addresses during checkout
 * Displays addresses with radio button selection
 */

import { MapPin, Plus } from 'lucide-react';
import { useAddresses } from '../../hooks/address';
import { getLabelDisplay } from '../../services/address/addressService';

export default function AddressSelector({
  selectedAddressId,
  onSelectAddress,
  onUseManualEntry,
}) {
  const { data: addresses, isLoading } = useAddresses();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white border border-dark/10 rounded-xl p-4 animate-pulse"
          >
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 bg-dark/10 rounded-full mt-1" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-dark/10 rounded" />
                <div className="h-4 w-full bg-dark/10 rounded" />
                <div className="h-3 w-32 bg-dark/10 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state - show manual entry prompt
  if (!addresses || addresses.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          You don't have any saved addresses yet. Fill in the form below or save
          this address for future orders.
        </p>
      </div>
    );
  }

  // Sort addresses: default first, then by creation date
  const sortedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="space-y-3">
      {/* Saved Addresses */}
      {sortedAddresses.map((address) => {
        const isSelected = selectedAddressId === address._id;

        return (
          <button
            key={address._id}
            onClick={() => onSelectAddress(address)}
            className={`w-full text-left bg-white border rounded-xl p-4 transition-all ${
              isSelected
                ? 'border-accent ring-2 ring-accent/20'
                : 'border-dark/10 hover:border-accent/50'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Radio Button */}
              <div className="mt-1">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-accent bg-accent'
                      : 'border-dark/30'
                  }`}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>
              </div>

              {/* Address Details */}
              <div className="flex-1">
                {/* Label & Default Badge */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-medium text-dark">
                    {getLabelDisplay(address)}
                  </span>
                  {address.isDefault && (
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded">
                      Default
                    </span>
                  )}
                </div>

                {/* Name */}
                <p className="text-sm text-dark/80 mb-1">
                  {address.firstName} {address.lastName}
                </p>

                {/* Address */}
                <div className="flex items-start gap-1.5 text-sm text-dark/60">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  <div className="leading-relaxed">
                    <span>
                      {address.address}
                      {address.apartment && `, ${address.apartment}`}
                    </span>
                    <br />
                    <span>
                      {address.city}
                      {address.postalCode && `, ${address.postalCode}`}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <p className="text-xs text-dark/50 mt-1">
                  Phone: {address.phone}
                </p>
              </div>
            </div>
          </button>
        );
      })}

      {/* Manual Entry Option */}
      <button
        onClick={onUseManualEntry}
        className={`w-full text-left bg-white border border-dark/10 hover:border-accent/50 rounded-xl p-4 transition-all ${
          selectedAddressId === null ? 'border-accent ring-2 ring-accent/20' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Radio Button */}
          <div className="mt-1">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedAddressId === null
                  ? 'border-accent bg-accent'
                  : 'border-dark/30'
              }`}
            >
              {selectedAddressId === null && (
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </div>
          </div>

          {/* Option Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Plus size={16} className="text-dark/40" />
              <span className="text-sm font-medium text-dark">
                Use a different address
              </span>
            </div>
            <p className="text-xs text-dark/50 mt-1">
              Enter address details manually below
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
