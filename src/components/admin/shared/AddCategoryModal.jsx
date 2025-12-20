/**
 * AddCategoryModal Component
 * Modal for adding/editing categories
 */

import { useState, useRef, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editData = null,
}) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    displayOrder: 0,
    isActive: true,
    image: null,
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        description: editData.description || '',
        displayOrder: editData.displayOrder || 0,
        isActive: editData.isActive ?? true,
        image: null,
      });
      setImagePreviewUrl(editData.image?.url || null);
    } else {
      resetForm();
    }
  }, [editData, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      displayOrder: 0,
      isActive: true,
      image: null,
    });
    setImagePreviewUrl(null);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      // Revoke previous URL if it was a blob
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreviewUrl(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      ...formData,
      displayOrder: parseInt(formData.displayOrder, 10) || 0,
    });
  };

  const handleClose = () => {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = !!editData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark/10">
          <h2 className="text-xl font-serif text-dark">
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-dark/5 rounded-lg transition-colors"
          >
            <X size={20} className="text-dark/40" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-accent ${
                  errors.name ? 'border-red-500' : 'border-dark/10'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter category description"
                rows={3}
                className="w-full px-4 py-2.5 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent resize-none"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                min="0"
                className="w-32 px-4 py-2.5 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent"
              />
              <p className="text-xs text-dark/50 mt-1">
                Lower numbers appear first
              </p>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Category Image
              </label>
              <div className="flex items-start gap-4">
                {imagePreviewUrl ? (
                  <div className="relative group">
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border border-dark/10"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 border-2 border-dashed border-dark/20 rounded-lg flex flex-col items-center justify-center text-dark/40 hover:border-accent hover:text-accent transition-colors"
                  >
                    <Upload size={20} />
                    <span className="text-xs mt-1">Upload</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Active Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-dark/20 text-accent focus:ring-accent"
              />
              <span className="text-sm text-dark">Active</span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-dark/10 rounded-lg text-sm font-medium text-dark/70 hover:bg-dark/5 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
