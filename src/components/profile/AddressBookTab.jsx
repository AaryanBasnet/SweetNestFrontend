/**
 * Address Book Tab Component
 * Manages user addresses for delivery
 */

import { memo } from 'react';
import PropTypes from 'prop-types';
import { MapPin, Pencil } from 'lucide-react';

/**
 * Address Card Component
 */
function AddressCard({ address, isDefault, onEdit }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-dark/5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-dark font-medium">
              {isDefault ? 'Default Address' : 'Address'}
            </p>
            {isDefault && (
              <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">
                Default
              </span>
            )}
          </div>
          <p className="text-dark/60 text-sm">{address}</p>
        </div>
        <button
          onClick={onEdit}
          aria-label="Edit address"
          className="p-2 text-dark/40 hover:text-dark transition-colors"
        >
          <Pencil size={16} />
        </button>
      </div>
    </div>
  );
}

AddressCard.propTypes = {
  address: PropTypes.string.isRequired,
  isDefault: PropTypes.bool,
  onEdit: PropTypes.func,
};

/**
 * Empty State Component
 */
function EmptyState({ onAddAddress }) {
  return (
    <div className="bg-white rounded-2xl p-12 text-center border border-dark/5">
      <MapPin size={48} className="text-dark/20 mx-auto mb-4" aria-hidden="true" />
      <h3 className="text-lg font-medium text-dark mb-2">No addresses saved</h3>
      <p className="text-dark/50 text-sm mb-4">
        Add an address for faster checkout.
      </p>
      <button
        onClick={onAddAddress}
        className="px-6 py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
      >
        Add Your First Address
      </button>
    </div>
  );
}

EmptyState.propTypes = {
  onAddAddress: PropTypes.func,
};

/**
 * Address Book Tab Main Component
 */
function AddressBookTab({ user, onAddAddress, onEditAddress }) {
  const handleAddAddress = () => {
    // TODO: Implement address modal
    onAddAddress?.();
  };

  const handleEditAddress = () => {
    // TODO: Implement edit address modal
    onEditAddress?.();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif text-dark">
          Address Book
        </h1>
        <button
          onClick={handleAddAddress}
          className="px-4 py-2 bg-dark text-white text-sm font-medium rounded-full hover:bg-dark/90 transition-colors"
        >
          Add Address
        </button>
      </div>

      {user.address ? (
        <AddressCard
          address={user.address}
          isDefault={true}
          onEdit={handleEditAddress}
        />
      ) : (
        <EmptyState onAddAddress={handleAddAddress} />
      )}
    </div>
  );
}

AddressBookTab.propTypes = {
  user: PropTypes.shape({
    address: PropTypes.string,
  }).isRequired,
  onAddAddress: PropTypes.func,
  onEditAddress: PropTypes.func,
};

export default memo(AddressBookTab);

