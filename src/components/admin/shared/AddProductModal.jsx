/**
 * AddProductModal Component
 * Modal for adding/editing products with Improved UX
 */

import { useState, useRef, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Info } from 'lucide-react';
import { useCategories } from '../../../hooks/cake/useCategories';

export default function AddProductModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialData = null,
}) {
  const fileInputRef = useRef(null);
  const { data: categoriesData } = useCategories(false);
  const categories = categoriesData?.data || [];

  // State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    isActive: true,
    isFeatured: false,
    storageAndCare: '',
    weightOptions: [{ weightInKg: 0.5, label: '1 Pound', price: 0, isDefault: true }],
    images: [],
  });

  // UX IMPROVEMENT: Manage ingredients as a simple text string
  const [ingredientsText, setIngredientsText] = useState(''); 
  
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [errors, setErrors] = useState({});

  // Populate Data on Open
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          category: initialData.category?._id || initialData.category || '',
          isActive: initialData.isActive ?? true,
          isFeatured: initialData.isFeatured ?? false,
          storageAndCare: initialData.storageAndCare || '',
          weightOptions: initialData.weightOptions || [{ weightInKg: 0.5, label: '1 Pound', price: 0, isDefault: true }],
          images: initialData.images || [],
        });
        
        // Convert Array ["A", "B"] -> String "A, B" for easier editing
        if (initialData.ingredients && initialData.ingredients.length > 0) {
            setIngredientsText(initialData.ingredients.join(', '));
        } else {
            setIngredientsText('');
        }

        if (initialData.images && initialData.images.length > 0) {
          setImagePreviewUrls(initialData.images.map((img) => img.url));
        }
        setRemovedImageIds([]);
      } else {
        handleReset();
      }
    }
  }, [isOpen, initialData]);

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      isActive: true,
      isFeatured: false,
      storageAndCare: '',
      weightOptions: [{ weightInKg: 0.5, label: '1 Pound', price: 0, isDefault: true }],
      images: [],
    });
    setIngredientsText(''); // Reset text
    setImagePreviewUrls([]);
    setErrors({});
    setRemovedImageIds([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // --- WEIGHT LOGIC ---
  const handleWeightOptionChange = (index, field, value) => {
    const newWeightOptions = [...formData.weightOptions];

    if (field === 'isDefault') {
      newWeightOptions.forEach((opt, i) => { opt.isDefault = i === index; });
    } else {
      // ✅ FIX: Don't parse numbers yet. Allow empty strings so backspace works.
      newWeightOptions[index] = {
        ...newWeightOptions[index],
        [field]: value 
      };
    }
    setFormData((prev) => ({ ...prev, weightOptions: newWeightOptions }));
  };

  const removeWeightOption = (index) => {
    if (formData.weightOptions.length > 1) {
      const newOptions = formData.weightOptions.filter((_, i) => i !== index);
      if (!newOptions.some((opt) => opt.isDefault)) newOptions[0].isDefault = true;
      setFormData((prev) => ({ ...prev, weightOptions: newOptions }));
    }
  };

  // UX IMPROVEMENT: Quick Add Presets
  const addPresetWeight = (kg, label) => {
    setFormData((prev) => ({
      ...prev,
      weightOptions: [
        ...prev.weightOptions,
        { weightInKg: kg, label: label, price: 0, isDefault: false }
      ],
    }));
  };

  // --- IMAGE LOGIC ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...formData.images, ...files];
      setFormData((prev) => ({ ...prev, images: newImages }));
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index) => {
    const imageToRemove = formData.images[index];
    if (imageToRemove && imageToRemove.public_id) {
      setRemovedImageIds((prev) => [...prev, imageToRemove.public_id]);
    }
    if (imagePreviewUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrls[index]);
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // --- VALIDATION ---
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (formData.weightOptions.some((opt) => opt.price <= 0))
      newErrors.weightOptions = 'Price must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // UX IMPROVEMENT: Convert String "Flour, Sugar" -> Array ["Flour", "Sugar"]
    const ingredientsArray = ingredientsText
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

    onSubmit({
      ...formData,
      ingredients: ingredientsArray,
      removedImageIds,
    });
  };

  const handleClose = () => {
    imagePreviewUrls.forEach((url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark/10">
          <h2 className="text-xl font-serif text-dark">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={handleClose} className="p-1 hover:bg-dark/5 rounded-lg transition-colors">
            <X size={20} className="text-dark/40" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6">
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-accent ${
                  errors.name ? 'border-red-500' : 'border-dark/10'
                }`}
                placeholder="e.g. Dark Chocolate Truffle"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-accent resize-none ${
                  errors.description ? 'border-red-500' : 'border-dark/10'
                }`}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Category *</label>
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
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* --- UX FIX 1: Ingredients as Text Area --- */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Ingredients</label>
              <p className="text-xs text-dark/50 mb-2">Separate ingredients with commas.</p>
              <textarea
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="e.g. Flour, Sugar, Dark Chocolate, Heavy Cream, Eggs"
                rows={2}
                className="w-full px-4 py-2.5 border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-accent resize-none"
              />
            </div>

            {/* --- UX FIX 2: Size & Pricing Variants --- */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Size & Price Variants *</label>
              <div className="bg-cream/20 p-4 rounded-xl border border-dark/5">
                <div className="flex items-start gap-2 mb-4">
                  <Info size={16} className="text-accent mt-0.5" />
                  <p className="text-xs text-dark/60">
                    Add standard sizes. "Label" is what the customer sees (e.g. "1 Pound"). 
                    "Weight" helps in sorting. "Price" is the cost for that specific size.
                  </p>
                </div>

                {/* Quick Add Buttons */}
                <div className="flex gap-2 mb-4">
                    <span className="text-xs font-medium text-dark/70 self-center mr-1">Quick Add:</span>
                    <button type="button" onClick={() => addPresetWeight(0.5, '1 Pound')} className="px-3 py-1 bg-white border border-dark/10 rounded-md text-xs hover:border-accent hover:text-accent transition-colors">
                        + 1 Pound
                    </button>
                    <button type="button" onClick={() => addPresetWeight(1.0, '2 Pounds')} className="px-3 py-1 bg-white border border-dark/10 rounded-md text-xs hover:border-accent hover:text-accent transition-colors">
                        + 2 Pounds
                    </button>
                    <button type="button" onClick={() => addPresetWeight(1.5, '3 Pounds')} className="px-3 py-1 bg-white border border-dark/10 rounded-md text-xs hover:border-accent hover:text-accent transition-colors">
                        + 3 Pounds
                    </button>
                </div>

                {/* Variants List */}
                <div className="space-y-3">
                  {formData.weightOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-dark/5 shadow-sm">
                      <div className="grid grid-cols-6 gap-3 flex-1">
                        
                        {/* Label */}
                        <div className="col-span-2">
                          <label className="text-[10px] uppercase tracking-wider text-dark/40 font-bold mb-1 block">Display Label</label>
                          <input
                            type="text"
                            value={option.label}
                            onChange={(e) => handleWeightOptionChange(index, 'label', e.target.value)}
                            className="w-full px-2 py-1.5 border border-dark/10 rounded text-sm bg-gray-50"
                            placeholder="e.g. 1 Pound"
                          />
                        </div>

                        {/* Weight (Hidden/Small on mobile, useful for backend) */}
                        <div className="col-span-1">
                          <label className="text-[10px] uppercase tracking-wider text-dark/40 font-bold mb-1 block">Kg</label>
                          <input
                            type="number"
                            value={option.weightInKg}
                            onChange={(e) => handleWeightOptionChange(index, 'weightInKg', e.target.value)}
                            step="0.1"
                            className="w-full px-2 py-1.5 border border-dark/10 rounded text-sm bg-gray-50"
                          />
                        </div>

                        {/* Price */}
                        <div className="col-span-2">
                          <label className="text-[10px] uppercase tracking-wider text-dark/40 font-bold mb-1 block">Price (Rs.)</label>
                          <input
                            type="number"
                            value={option.price}
                            onChange={(e) => handleWeightOptionChange(index, 'price', e.target.value)}
                            min="0"
                            className="w-full px-2 py-1.5 border border-accent/30 rounded text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                            placeholder="0"
                          />
                        </div>

                        {/* Default & Delete */}
                        <div className="col-span-1 flex flex-col justify-end items-center gap-1 pb-1">
                           <div className="flex gap-2">
                                <input
                                    type="radio"
                                    name="defaultWeight"
                                    checked={option.isDefault}
                                    onChange={() => handleWeightOptionChange(index, 'isDefault', true)}
                                    className="w-4 h-4 text-accent cursor-pointer"
                                    title="Set as Default Price"
                                />
                                {formData.weightOptions.length > 1 && (
                                    <button
                                    type="button"
                                    onClick={() => removeWeightOption(index)}
                                    className="text-red-400 hover:text-red-600"
                                    >
                                    <Trash2 size={16} />
                                    </button>
                                )}
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.weightOptions && <p className="text-red-500 text-xs mt-2">{errors.weightOptions}</p>}
                
                <button
                  type="button"
                  onClick={() => addPresetWeight(0.5, 'Custom Size')}
                  className="mt-3 flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  <Plus size={14} /> Add Another Variant
                </button>
              </div>
            </div>

            {/* Storage */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Storage & Care</label>
              <textarea
                name="storageAndCare"
                value={formData.storageAndCare}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2.5 border border-dark/10 rounded-lg text-sm resize-none"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Images</label>
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

            {/* Status */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-accent focus:ring-accent"
                />
                <span className="text-sm text-dark">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-accent focus:ring-accent"
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
            {isLoading ? (initialData ? 'Updating...' : 'Adding...') : initialData ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}