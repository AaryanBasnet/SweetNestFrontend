/**
 * AddPromotionModal Component
 * Modal for adding promotions
 */

import { useState, useRef, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { useCakes } from '../../../hooks/cake';

export default function AddPromotionModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    seasonTag: 'all-season',
    linkedCake: '',
    ctaText: 'VIEW DETAILS',
    priority: 0,
    isActive: true,
    images: [],
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch cakes for linking
  const { data: cakesData } = useCakes({}, { enabled: isOpen });
  const cakes = cakesData?.data || [];

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      seasonTag: 'all-season',
      linkedCake: '',
      ctaText: 'VIEW DETAILS',
      priority: 0,
      isActive: true,
      images: [],
    });
    setImagePreviewUrls([]);
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
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, images: files }));

      // Clean up old preview URLs
      imagePreviewUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });

      // Create new preview URLs
      const newUrls = files.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls(newUrls);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark/10">
          <h2 className="text-2xl font-serif text-dark">Add Promotion</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark/5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-dark/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Summer Berry Special"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-dark/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              placeholder="Fresh berries with creamy delights..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-dark/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-dark/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Season & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Season Tag
              </label>
              <select
                name="seasonTag"
                value={formData.seasonTag}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-dark/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all-season">All Season</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="autumn">Autumn</option>
                <option value="winter">Winter</option>
                <option value="holiday">Holiday</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Priority
              </label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2.5 border border-dark/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Linked Cake */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Link to Cake (for VIEW DETAILS button)
            </label>
            <select
              name="linkedCake"
              value={formData.linkedCake}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-dark/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">No specific cake</option>
              {cakes.map((cake) => (
                <option key={cake._id} value={cake._id}>
                  {cake.name}
                </option>
              ))}
            </select>
          </div>

          {/* CTA Text */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Button Text
            </label>
            <input
              type="text"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-dark/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="VIEW DETAILS"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Images * (max 5)
            </label>
            <div className="border-2 border-dashed border-dark/20 rounded-lg p-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center gap-2 text-dark/60 hover:text-dark transition-colors"
              >
                <Upload size={32} />
                <span className="text-sm">Click to upload images</span>
              </button>
              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {imagePreviewUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
            {errors.images && (
              <p className="text-red-500 text-xs mt-1">{errors.images}</p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-accent focus:ring-accent rounded"
            />
            <label htmlFor="isActive" className="text-sm text-dark">
              Active (show on website)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-dark/20 text-dark rounded-lg hover:bg-dark/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-dark text-white rounded-lg hover:bg-dark/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Promotion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
