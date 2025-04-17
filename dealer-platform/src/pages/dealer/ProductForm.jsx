import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiUpload, FiTrash2 } from 'react-icons/fi';

// Mock product data for editing
const mockProduct = {
  id: 'P-1001',
  name: 'Premium Brake Pads - Toyota Camry (2018-2022)',
  sku: 'BP-TOY-CAM-18',
  description: 'High-quality ceramic brake pads designed specifically for Toyota Camry models from 2018 to 2022. These premium pads offer superior stopping power, reduced noise, and extended life compared to standard options.',
  category: 'Brakes',
  subcategory: 'Brake Pads',
  brand: 'BrakeMaster Pro',
  price: 89.99,
  cost: 45.50,
  stock: 42,
  threshold: 10,
  weight: 4.5, // in lbs
  dimensions: {
    length: 6,
    width: 4,
    height: 2
  },
  images: [
    'https://images.pexels.com/photos/4489732/pexels-photo-4489732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/4489794/pexels-photo-4489794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ],
  compatibleVehicles: [
    { make: 'Toyota', model: 'Camry', years: '2018-2022' },
    { make: 'Toyota', model: 'Avalon', years: '2019-2022' }
  ],
  specifications: [
    { name: 'Material', value: 'Ceramic' },
    { name: 'Position', value: 'Front' },
    { name: 'Warranty', value: '2 Years' }
  ],
  features: [
    'Reduced brake dust',
    'Low noise operation',
    'Extended pad life',
    'Superior stopping power'
  ],
  status: 'active',
  tags: ['toyota', 'camry', 'brakes', 'ceramic', 'front'],
  metaTitle: 'Premium Brake Pads for Toyota Camry (2018-2022)',
  metaDescription: 'High-quality ceramic brake pads for Toyota Camry 2018-2022 models. Superior stopping power with reduced noise and brake dust.'
};

// Categories and subcategories
const categories = [
  { 
    name: 'Brakes', 
    subcategories: ['Brake Pads', 'Brake Rotors', 'Brake Calipers', 'Brake Lines', 'Brake Fluid']
  },
  { 
    name: 'Engine', 
    subcategories: ['Engine Parts', 'Belts & Hoses', 'Filters', 'Gaskets', 'Sensors']
  },
  { 
    name: 'Transmission', 
    subcategories: ['Transmission Parts', 'Transmission Fluid', 'Clutch Components']
  },
  { 
    name: 'Suspension', 
    subcategories: ['Shocks & Struts', 'Springs', 'Control Arms', 'Sway Bars']
  },
  { 
    name: 'Electrical', 
    subcategories: ['Batteries', 'Alternators', 'Starters', 'Ignition', 'Lighting']
  },
  { 
    name: 'Cooling', 
    subcategories: ['Radiators', 'Water Pumps', 'Thermostats', 'Cooling Fans']
  },
  { 
    name: 'Exhaust', 
    subcategories: ['Mufflers', 'Catalytic Converters', 'Exhaust Pipes', 'Headers']
  },
  { 
    name: 'Fuel System', 
    subcategories: ['Fuel Pumps', 'Fuel Injectors', 'Fuel Filters', 'Carburetors']
  }
];

// Common vehicle makes for compatibility
const vehicleMakes = [
  'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 
  'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jeep', 'Kia', 'Lexus', 
  'Lincoln', 'Mazda', 'Mercedes-Benz', 'Nissan', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen'
];

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    subcategory: '',
    brand: '',
    price: '',
    cost: '',
    stock: '',
    threshold: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    images: [],
    compatibleVehicles: [{ make: '', model: '', years: '' }],
    specifications: [{ name: '', value: '' }],
    features: [''],
    status: 'active',
    tags: [],
    metaTitle: '',
    metaDescription: ''
  });
  
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // In a real app, this would be an API call
      setFormData(mockProduct);
      
      // Set available subcategories based on the product's category
      const category = categories.find(cat => cat.name === mockProduct.category);
      if (category) {
        setAvailableSubcategories(category.subcategories);
      }
    }
  }, [isEditMode, id]);
  
  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      const category = categories.find(cat => cat.name === formData.category);
      if (category) {
        setAvailableSubcategories(category.subcategories);
        
        // Reset subcategory if it's not in the new list
        if (!category.subcategories.includes(formData.subcategory)) {
          setFormData(prev => ({
            ...prev,
            subcategory: ''
          }));
        }
      }
    }
  }, [formData.category]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    setIsDirty(true);
  };
  
  // Handle numeric input change with validation
  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    
    // Allow empty string or valid numbers
    if (value === '' || (!isNaN(value) && Number(value) >= 0)) {
      handleChange(e);
    }
  };
  
  // Handle compatible vehicles
  const handleVehicleChange = (index, field, value) => {
    const updatedVehicles = [...formData.compatibleVehicles];
    updatedVehicles[index] = {
      ...updatedVehicles[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      compatibleVehicles: updatedVehicles
    }));
    
    setIsDirty(true);
  };
  
  // Add new compatible vehicle
  const addVehicle = () => {
    setFormData(prev => ({
      ...prev,
      compatibleVehicles: [
        ...prev.compatibleVehicles,
        { make: '', model: '', years: '' }
      ]
    }));
  };
  
  // Remove compatible vehicle
  const removeVehicle = (index) => {
    const updatedVehicles = [...formData.compatibleVehicles];
    updatedVehicles.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      compatibleVehicles: updatedVehicles
    }));
    
    setIsDirty(true);
  };
  
  // Handle specifications
  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index] = {
      ...updatedSpecs[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      specifications: updatedSpecs
    }));
    
    setIsDirty(true);
  };
  
  // Add new specification
  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        { name: '', value: '' }
      ]
    }));
  };
  
  // Remove specification
  const removeSpecification = (index) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      specifications: updatedSpecs
    }));
    
    setIsDirty(true);
  };
  
  // Handle features
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
    
    setIsDirty(true);
  };
  
  // Add new feature
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };
  
  // Remove feature
  const removeFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
    
    setIsDirty(true);
  };
  
  // Handle tags
  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tagsArray = value.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);
    
    setFormData(prev => ({
      ...prev,
      tags: tagsArray
    }));
    
    setIsDirty(true);
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    // In a real app, this would upload to a server and get URLs back
    // For this demo, we'll just use placeholder URLs
    const newImages = [
      ...formData.images,
      'https://images.pexels.com/photos/4489794/pexels-photo-4489794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ];
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
    
    setIsDirty(true);
  };
  
  // Remove image
  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
    
    setIsDirty(true);
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.stock) newErrors.stock = 'Stock quantity is required';
    
    // Numeric validation
    if (formData.price && isNaN(formData.price)) newErrors.price = 'Price must be a number';
    if (formData.cost && isNaN(formData.cost)) newErrors.cost = 'Cost must be a number';
    if (formData.stock && isNaN(formData.stock)) newErrors.stock = 'Stock must be a number';
    if (formData.threshold && isNaN(formData.threshold)) newErrors.threshold = 'Threshold must be a number';
    if (formData.weight && isNaN(formData.weight)) newErrors.weight = 'Weight must be a number';
    
    // Dimensions validation
    if (formData.dimensions.length && isNaN(formData.dimensions.length)) {
      newErrors['dimensions.length'] = 'Length must be a number';
    }
    if (formData.dimensions.width && isNaN(formData.dimensions.width)) {
      newErrors['dimensions.width'] = 'Width must be a number';
    }
    if (formData.dimensions.height && isNaN(formData.dimensions.height)) {
      newErrors['dimensions.height'] = 'Height must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 ? null : newErrors;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    setIsSubmitting(true);
    
    // Validate form data
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      
      // Scroll to the first error
      const firstErrorField = document.getElementById(Object.keys(validationErrors)[0]);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      return;
    }
    
    try {
      // In a real app, this would be an API call to save the product
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success message and redirect
      alert(`Product ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/dealer/inventory');
    } catch (error) {
      // Log error to a proper error monitoring service in production
      setErrors({
        submit: `Failed to save product: ${error.message || 'Unknown error occurred'}`
      });
      
      // Scroll to top to show the error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/dealer/inventory');
      }
    } else {
      navigate('/dealer/inventory');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {isEditMode 
              ? 'Update product information, inventory, and details.' 
              : 'Create a new product listing with all necessary details.'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            }`}
          >
            <FiSave className="mr-2 -ml-1 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiX className="mr-2 -ml-1 h-4 w-4" />
            Cancel
          </button>
        </div>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-neutral-50 border-b border-neutral-200">
            <h3 className="text-lg font-medium leading-6 text-neutral-900">Basic Information</h3>
            <p className="mt-1 text-sm text-neutral-500">Product details and basic attributes.</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Product Name */}
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                  Product Name <span className="text-error-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md ${
                      errors.name ? 'border-error-300' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-error-500">{errors.name}</p>
                  )}
                </div>
              </div>
              
              {/* SKU */}
              <div className="sm:col-span-2">
                <label htmlFor="sku" className="block text-sm font-medium text-neutral-700">
                  SKU <span className="text-error-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="sku"
                    id="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md ${
                      errors.sku ? 'border-error-300' : ''
                    }`}
                  />
                  {errors.sku && (
                    <p className="mt-1 text-sm text-error-500">{errors.sku}</p>
                  )}
                </div>
              </div>
              
              {/* Description */}
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  Write a detailed description of the product.
                </p>
              </div>
              
              {/* Category */}
              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700">
                  Category <span className="text-error-500">*</span>
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md ${
                      errors.category ? 'border-error-300' : ''
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-error-500">{errors.category}</p>
                  )}
                </div>
              </div>
              
              {/* Subcategory */}
              <div className="sm:col-span-3">
                <label htmlFor="subcategory" className="block text-sm font-medium text-neutral-700">
                  Subcategory
                </label>
                <div className="mt-1">
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    disabled={!formData.category}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                  >
                    <option value="">Select a subcategory</option>
                    {availableSubcategories.map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Brand */}
              <div className="sm:col-span-3">
                <label htmlFor="brand" className="block text-sm font-medium text-neutral-700">
                  Brand
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Status */}
              <div className="sm:col-span-3">
                <label htmlFor="status" className="block text-sm font-medium text-neutral-700">
                  Status
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pricing and Inventory */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-neutral-50 border-b border-neutral-200">
            <h3 className="text-lg font-medium leading-6 text-neutral-900">Pricing and Inventory</h3>
            <p className="mt-1 text-sm text-neutral-500">Manage product pricing and stock levels.</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Price */}
              <div className="sm:col-span-2">
                <label htmlFor="price" className="block text-sm font-medium text-neutral-700">
                  Price ($) <span className="text-error-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleNumericChange}
                    className={`focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 sm:text-sm border-neutral-300 rounded-md ${
                      errors.price ? 'border-error-300' : ''
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-error-500">{errors.price}</p>
                  )}
                </div>
              </div>
              
              {/* Cost */}
              <div className="sm:col-span-2">
                <label htmlFor="cost" className="block text-sm font-medium text-neutral-700">
                  Cost ($)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    name="cost"
                    id="cost"
                    value={formData.cost}
                    onChange={handleNumericChange}
                    className={`focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 sm:text-sm border-neutral-300 rounded-md ${
                      errors.cost ? 'border-error-300' : ''
                    }`}
                    placeholder="0.00"
                  />
                  {errors.cost && (
                    <p className="mt-1 text-sm text-error-500">{errors.cost}</p>
                  )}
                </div>
              </div>
              
              {/* Stock */}
              <div className="sm:col-span-1">
                <label htmlFor="stock" className="block text-sm font-medium text-neutral-700">
                  Stock <span className="text-error-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="stock"
                    id="stock"
                    value={formData.stock}
                    onChange={handleNumericChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md ${
                      errors.stock ? 'border-error-300' : ''
                    }`}
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-error-500">{errors.stock}</p>
                  )}
                </div>
              </div>
              
              {/* Low Stock Threshold */}
              <div className="sm:col-span-1">
                <label htmlFor="threshold" className="block text-sm font-medium text-neutral-700">
                  Low Stock Alert
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="threshold"
                    id="threshold"
                    value={formData.threshold}
                    onChange={handleNumericChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md ${
                      errors.threshold ? 'border-error-300' : ''
                    }`}
                  />
                  {errors.threshold && (
                    <p className="mt-1 text-sm text-error-500">{errors.threshold}</p>
                  )}
                </div>
              </div>
              
              {/* Weight */}
              <div className="sm:col-span-2">
                <label htmlFor="weight" className="block text-sm font-medium text-neutral-700">
                  Weight (lbs)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="weight"
                    id="weight"
                    value={formData.weight}
                    onChange={handleNumericChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md ${
                      errors.weight ? 'border-error-300' : ''
                    }`}
                  />
                  {errors.weight && (
                    <p className="mt-1 text-sm text-error-500">{errors.weight}</p>
                  )}
                </div>
              </div>
              
              {/* Dimensions */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-neutral-700">
                  Dimensions (inches)
                </label>
                <div className="mt-1 grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="dimensions.length" className="block text-xs text-neutral-500">
                      Length
                    </label>
                    <input
                      type="text"
                      name="dimensions.length"
                      id="dimensions.length"
                      value={formData.dimensions.length}
                      onChange={handleNumericChange}
                      className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md ${
                        errors['dimensions.length'] ? 'border-error-300' : ''
                      }`}
                    />
                    {errors['dimensions.length'] && (
                      <p className="mt-1 text-xs text-error-500">{errors['dimensions.length']}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="dimensions.width" className="block text-xs text-neutral-500">
                      Width
                    </label>
                    <input
                      type="text"
                      name="dimensions.width"
                      id="dimensions.width"
                      value={formData.dimensions.width}
                      onChange={handleNumericChange}
                      className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md ${
                        errors['dimensions.width'] ? 'border-error-300' : ''
                      }`}
                    />
                    {errors['dimensions.width'] && (
                      <p className="mt-1 text-xs text-error-500">{errors['dimensions.width']}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="dimensions.height" className="block text-xs text-neutral-500">
                      Height
                    </label>
                    <input
                      type="text"
                      name="dimensions.height"
                      id="dimensions.height"
                      value={formData.dimensions.height}
                      onChange={handleNumericChange}
                      className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md ${
                        errors['dimensions.height'] ? 'border-error-300' : ''
                      }`}
                    />
                    {errors['dimensions.height'] && (
                      <p className="mt-1 text-xs text-error-500">{errors['dimensions.height']}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Images */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-neutral-50 border-b border-neutral-200">
            <h3 className="text-lg font-medium leading-6 text-neutral-900">Product Images</h3>
            <p className="mt-1 text-sm text-neutral-500">Upload high-quality images of your product.</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Product Images
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-neutral-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-neutral-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-neutral-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Image preview */}
              {formData.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">
                    Current Images
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-w-1 aspect-h-1 rounded-lg bg-neutral-200 overflow-hidden">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="object-center object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiTrash2 className="h-4 w-4 text-error-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Vehicle Compatibility */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-neutral-50 border-b border-neutral-200">
            <h3 className="text-lg font-medium leading-6 text-neutral-900">Vehicle Compatibility</h3>
            <p className="mt-1 text-sm text-neutral-500">Specify which vehicles this product is compatible with.</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {formData.compatibleVehicles.map((vehicle, index) => (
                <div key={index} className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-12 items-start">
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-neutral-700">
                      {index === 0 ? 'Make' : <span className="sr-only">Make</span>}
                    </label>
                    <div className="mt-1">
                      <select
                        value={vehicle.make}
                        onChange={(e) => handleVehicleChange(index, 'make', e.target.value)}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                      >
                        <option value="">Select Make</option>
                        {vehicleMakes.map((make) => (
                          <option key={make} value={make}>
                            {make}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-neutral-700">
                      {index === 0 ? 'Model' : <span className="sr-only">Model</span>}
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        value={vehicle.model}
                        onChange={(e) => handleVehicleChange(index, 'model', e.target.value)}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                        placeholder="e.g. Camry"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-neutral-700">
                      {index === 0 ? 'Years' : <span className="sr-only">Years</span>}
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        value={vehicle.years}
                        onChange={(e) => handleVehicleChange(index, 'years', e.target.value)}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                        placeholder="e.g. 2018-2022"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-1 flex items-end justify-end">
                    {index === 0 ? (
                      <label className="block text-sm font-medium text-neutral-700 sm:mt-1 sm:pt-2 invisible">
                        Action
                      </label>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => removeVehicle(index)}
                      className="mt-1 text-error-600 hover:text-error-900"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="pt-3">
                <button
                  type="button"
                  onClick={addVehicle}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FiPlus className="mr-1 h-4 w-4" />
                  Add Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Specifications and Features */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-neutral-50 border-b border-neutral-200">
            <h3 className="text-lg font-medium leading-6 text-neutral-900">Specifications and Features</h3>
            <p className="mt-1 text-sm text-neutral-500">Add technical specifications and key features of the product.</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {/* Specifications */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-3">
                  Technical Specifications
                </h4>
                <div className="space-y-4">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-12 items-start">
                      <div className="sm:col-span-5">
                        <label className="block text-sm font-medium text-neutral-700">
                          {index === 0 ? 'Name' : <span className="sr-only">Name</span>}
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            value={spec.name}
                            onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                            placeholder="e.g. Material"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-6">
                        <label className="block text-sm font-medium text-neutral-700">
                          {index === 0 ? 'Value' : <span className="sr-only">Value</span>}
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            value={spec.value}
                            onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                            placeholder="e.g. Ceramic"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-1 flex items-end justify-end">
                        {index === 0 ? (
                          <label className="block text-sm font-medium text-neutral-700 sm:mt-1 sm:pt-2 invisible">
                            Action
                          </label>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="mt-1 text-error-600 hover:text-error-900"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <FiPlus className="mr-1 h-4 w-4" />
                      Add Specification
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Features */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-3">
                  Key Features
                </h4>
                <div className="space-y-4">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-12 items-start">
                      <div className="sm:col-span-11">
                        <label className="block text-sm font-medium text-neutral-700">
                          {index === 0 ? 'Feature' : <span className="sr-only">Feature</span>}
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                            placeholder="e.g. Low noise operation"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-1 flex items-end justify-end">
                        {index === 0 ? (
                          <label className="block text-sm font-medium text-neutral-700 sm:mt-1 sm:pt-2 invisible">
                            Action
                          </label>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="mt-1 text-error-600 hover:text-error-900"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={addFeature}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <FiPlus className="mr-1 h-4 w-4" />
                      Add Feature
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-neutral-700">
                  Tags
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    value={formData.tags.join(', ')}
                    onChange={handleTagsChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                    placeholder="e.g. toyota, camry, brakes"
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    Separate tags with commas. These help customers find your product.
                  </p>
                </div>
              </div>
              
              {/* SEO */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-3">
                  SEO Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="metaTitle" className="block text-sm font-medium text-neutral-700">
                      Meta Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="metaTitle"
                        id="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="metaDescription" className="block text-sm font-medium text-neutral-700">
                      Meta Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        name="metaDescription"
                        id="metaDescription"
                        rows={2}
                        value={formData.metaDescription}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiX className="mr-2 -ml-1 h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            }`}
          >
            <FiSave className="mr-2 -ml-1 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
