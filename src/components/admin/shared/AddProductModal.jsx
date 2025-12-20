/**
 * AddProductModal Component
 * Modal for adding new products (cakes)
 * Cakes are made-to-order services with predefined price slabs
 */

import { useState, useRef } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { useCategories } from '../../../hooks/cake/useCategories';

export default function AddProductModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) {
  const fileInputRef = useRef(null);
  const { data: categoriesData } = useCategories(false);
  const categories = categoriesData?.data || [];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    isActive: true,
    isFeatured: false,
    storageAndCare: '',
    weightOptions: [{ weightInKg: 0.5, label: '1 Pound', price: 0, isDefault: true }],
    ingredients: [''],
    images: [],
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleWeightOptionChange = (index, field, value) => {
    const newWeightOptions = [...formData.weightOptions];

    if (field === 'isDefault') {
      // Only one can be default - unset others
      newWeightOptions.forEach((opt, i) => {
        opt.isDefault = i === index;
      });
    } else {
      newWeightOptions[index] = {
        ...newWeightOptions[index],
        [field]: field === 'price' || field === 'weightInKg'
          ? parseFloat(value) || 0
          : value,
      };
    }

    setFormData((prev) => ({ ...prev, weightOptions: newWeightOptions }));
  };

  const addWeightOption = () => {
    setFormData((prev) => ({
      ...prev,
      weightOptions: [
        ...prev.weightOptions,
        { weightInKg: 1, label: '2 Pounds', price: 0, isDefault: false }
      ],
    }));
  };

  const removeWeightOption = (index) => {
    if (formData.weightOptions.length > 1) {
      const newOptions = formData.weightOptions.filter((_, i) => i !== index);
      // Ensure at least one is default
      if (!newOptions.some(opt => opt.isDefault)) {
        newOptions[0].isDefault = true;
      }
      setFormData((prev) => ({
        ...prev,
        weightOptions: newOptions,
      }));
    }
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ''],
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index),
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...formData.images, ...files];
      setFormData((prev) => ({ ...prev, images: newImages }));

      // Create preview URLs
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(imagePreviewUrls[index]);

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (formData.weightOptions.some((opt) => opt.price <= 0)) {
      newErrors.weightOptions = 'All weight options must have a price greater than 0';
    }
    if (formData.weightOptions.some((opt) => opt.weightInKg <= 0)) {
      newErrors.weightOptions = 'All weight options must have a valid weight';
    }
    if (formData.weightOptions.some((opt) => !opt.label.trim())) {
      newErrors.weightOptions = 'All weight options must have a label';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Filter out empty ingredients
    const filteredIngredients = formData.ingredients.filter((ing) => ing.trim());

    onSubmit({
      ...formData,
      ingredients: filteredIngredients,
    });
  };

  const handleClose = () => {
    // Clean up preview URLs
    imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));

    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      isActive: true,
      isFeatured: false,
      storageAndCare: '',
      weightOptions: [{ weightInKg: 0.5, label: '1 Pound', price: 0, isDefault: true }],
      ingredients: [''],
      images: [],
    });
    setImagePreviewUrls([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark/10">
          <h2 className="text-xl font-serif text-dark">Add New Product</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-dark/5 rounded-lg transition-colors"
          >
            <X size={20} className="text-dark/40" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6">
          <div className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
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
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={3}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-accent resize-none ${
                  errors.description ? 'border-red-500' : 'border-dark/10'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-accent ${
                  errors.category ? 'border-red-500' : 'border-dark/10'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
              )}
            </div>

            {/* Weight Options & Pricing */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Weight Options & Pricing <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-dark/50 mb-2">
                Define price slabs for different sizes. Prices are explicit per option (not calculated).
              </p>
              <div className="space-y-2">
                {formData.weightOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-cream/30 rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-dark/50 mb-1 block">Weight (kg)</label>
                        <input
                          type="number"
                          value={option.weightInKg}
                          onChange={(e) =>
                            handleWeightOptionChange(index, 'weightInKg', e.target.value)
                          }
                          placeholder="0.5"
                          step="0.1"
                          min="0.1"
                          className="w-full px-3 py-2 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-dark/50 mb-1 block">Label</label>
                        <input
                          type="text"
                          value={option.label}
                          onChange={(e) =>
                            handleWeightOptionChange(index, 'label', e.target.value)
                          }
                          placeholder="1 Pound"
                          className="w-full px-3 py-2 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-dark/50 mb-1 block">Price (Rs.)</label>
                        <input
                          type="number"
                          value={option.price}
                          onChange={(e) =>
                            handleWeightOptionChange(index, 'price', e.target.value)
                          }
                          placeholder="550"
                          min="0"
                          className="w-full px-3 py-2 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 cursor-pointer" title="Set as default">
                        <input
                          type="radio"
                          name="defaultWeight"
                          checked={option.isDefault}
                          onChange={() => handleWeightOptionChange(index, 'isDefault', true)}
                          className="w-4 h-4 text-accent focus:ring-accent"
                        />
                        <span className="text-xs text-dark/50">Default</span>
                      </label>
                      {formData.weightOptions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeWeightOption(index)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {errors.weightOptions && (
                <p className="text-red-500 text-xs mt-1">{errors.weightOptions}</p>
              )}
              <button
                type="button"
                onClick={addWeightOption}
                className="mt-2 flex items-center gap-1 text-sm text-accent hover:text-accent/80"
              >
                <Plus size={14} />
                Add weight option
              </button>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Ingredients
              </label>
              <div className="space-y-2">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                      placeholder="Enter ingredient"
                      className="flex-1 px-4 py-2 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent"
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addIngredient}
                className="mt-2 flex items-center gap-1 text-sm text-accent hover:text-accent/80"
              >
                <Plus size={14} />
                Add ingredient
              </button>
            </div>

            {/* Storage & Care */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Storage & Care Instructions
              </label>
              <textarea
                name="storageAndCare"
                value={formData.storageAndCare}
                onChange={handleInputChange}
                placeholder="Enter storage and care instructions"
                rows={2}
                className="w-full px-4 py-2.5 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent resize-none"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Product Images
              </label>
              <div className="flex flex-wrap gap-3">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-dark/10"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed border-dark/20 rounded-lg flex flex-col items-center justify-center text-dark/40 hover:border-accent hover:text-accent transition-colors"
                >
                  <Upload size={20} />
                  <span className="text-xs mt-1">Upload</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Status Toggles */}
            <div className="flex items-center gap-6">
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
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-dark/20 text-accent focus:ring-accent"
                />
                <span className="text-sm text-dark">Featured</span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-dark/10 bg-cream/30">
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
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
