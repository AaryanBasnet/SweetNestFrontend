/**
 * AddressForm Component
 * Form for creating/editing addresses
 * Uses Formik + Yup following codebase pattern
 * Pattern: Follows ReviewForm.jsx structure
 */

import { useFormik } from 'formik';
import { addressSchema } from '../../schemas/addressSchema';

export default function AddressForm({
  existingAddress,
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const formik = useFormik({
    initialValues: {
      label: existingAddress?.label || 'Home',
      customLabel: existingAddress?.customLabel || '',
      firstName: existingAddress?.firstName || '',
      lastName: existingAddress?.lastName || '',
      address: existingAddress?.address || '',
      apartment: existingAddress?.apartment || '',
      city: existingAddress?.city || '',
      postalCode: existingAddress?.postalCode || '',
      phone: existingAddress?.phone || '',
    },
    validationSchema: addressSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onSubmit(values);
      } catch (error) {
        // Error handled by parent component
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Label Type Selector */}
      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Address Type <span className="text-red-500">*</span>
        </label>
        <select
          name="label"
          value={formik.values.label}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 ${
            formik.touched.label && formik.errors.label
              ? 'border-red-500'
              : 'border-dark/10'
          }`}
        >
          <option value="Home">Home</option>
          <option value="Office">Office</option>
          <option value="Other">Other</option>
          <option value="Custom">Custom</option>
        </select>
        {formik.touched.label && formik.errors.label && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.label}</p>
        )}
      </div>

      {/* Custom Label (conditional) */}
      {formik.values.label === 'Custom' && (
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Custom Label <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="customLabel"
            value={formik.values.customLabel}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="e.g., Mom's House"
            maxLength={30}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 ${
              formik.touched.customLabel && formik.errors.customLabel
                ? 'border-red-500'
                : 'border-dark/10'
            }`}
          />
          {formik.touched.customLabel && formik.errors.customLabel && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.customLabel}
            </p>
          )}
        </div>
      )}

      {/* First Name & Last Name */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 ${
              formik.touched.firstName && formik.errors.firstName
                ? 'border-red-500'
                : 'border-dark/10'
            }`}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 ${
              formik.touched.lastName && formik.errors.lastName
                ? 'border-red-500'
                : 'border-dark/10'
            }`}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Street address"
          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 ${
            formik.touched.address && formik.errors.address
              ? 'border-red-500'
              : 'border-dark/10'
          }`}
        />
        {formik.touched.address && formik.errors.address && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.address}</p>
        )}
      </div>

      {/* Apartment */}
      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Apartment, Suite, etc. (Optional)
        </label>
        <input
          type="text"
          name="apartment"
          value={formik.values.apartment}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Apt, Suite, Floor, etc."
          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 ${
            formik.touched.apartment && formik.errors.apartment
              ? 'border-red-500'
              : 'border-dark/10'
          }`}
        />
        {formik.touched.apartment && formik.errors.apartment && (
          <p className="text-red-500 text-xs mt-1">
            {formik.errors.apartment}
          </p>
        )}
      </div>

      {/* City & Postal Code */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 ${
              formik.touched.city && formik.errors.city
                ? 'border-red-500'
                : 'border-dark/10'
            }`}
          />
          {formik.touched.city && formik.errors.city && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Postal Code (Optional)
          </label>
          <input
            type="text"
            name="postalCode"
            value={formik.values.postalCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 ${
              formik.touched.postalCode && formik.errors.postalCode
                ? 'border-red-500'
                : 'border-dark/10'
            }`}
          />
          {formik.touched.postalCode && formik.errors.postalCode && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.postalCode}
            </p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="10-digit phone number"
          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 ${
            formik.touched.phone && formik.errors.phone
              ? 'border-red-500'
              : 'border-dark/10'
          }`}
        />
        {formik.touched.phone && formik.errors.phone && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 border border-dark/10 rounded-lg text-sm font-medium text-dark/70 hover:bg-dark/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !formik.isValid}
          className="flex-1 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? existingAddress
              ? 'Updating...'
              : 'Saving...'
            : existingAddress
            ? 'Update Address'
            : 'Save Address'}
        </button>
      </div>
    </form>
  );
}
