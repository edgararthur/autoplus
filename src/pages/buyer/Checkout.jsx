import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSmartphone, FiTruck, FiUser, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    // Contact info
    email: '',
    phone: '',
    
    // Shipping info
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    region: '',
    zip: '',
    country: 'Ghana',
    
    // Payment info
    paymentMethod: 'momo',
    mobileNumber: '',
    networkProvider: 'momo',
    
    // Additional
    saveInfo: false,
    shippingMethod: 'standard'
  });
  const [errors, setErrors] = useState({});
  
  // Shipping methods
  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping (3-5 days)', price: 15.00 },
    { id: 'express', name: 'Express Shipping (1-2 days)', price: 30.00 },
    { id: 'free', name: 'Free Shipping (5-7 days)', price: 0, threshold: 500 }
  ];

  // Payment methods
  const paymentMethods = [
    { id: 'momo', name: 'MTN Mobile Money (MoMo)', provider: 'momo' },
    { id: 'telecel', name: 'Telecel Cash', provider: 'telecel' }
  ];
  
  // Fetch cart data
  useEffect(() => {
    // In a real app, this would fetch from an API or local storage
    setLoading(true);
    setTimeout(() => {
      // Use example cart data
      setCartItems([
        {
          id: 3,
          name: 'LED Headlight Kit',
          sku: 'LED-P-9006',
          price: 129.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80'
        },
        {
          id: 2,
          name: 'High-Performance Oil Filter',
          sku: 'FIL-KN-103',
          price: 9.99,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1516733968668-dbdce39c4651?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle shipping method change
  const handleShippingChange = (e) => {
    setFormData(prev => ({ ...prev, shippingMethod: e.target.value }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    const provider = paymentMethods.find(p => p.id === method)?.provider || '';
    
    setFormData(prev => ({ 
      ...prev, 
      paymentMethod: method,
      networkProvider: provider
    }));
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Contact validation
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    // Shipping validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.zip) newErrors.zip = 'Postal code is required';
    
    // Payment validation
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';
    else if (!/^0\d{9}$/.test(formData.mobileNumber)) 
      newErrors.mobileNumber = 'Enter a valid 10-digit mobile number starting with 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Calculate order summary
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    const selectedShipping = shippingMethods.find(option => option.id === formData.shippingMethod);
    
    // Check if order qualifies for free shipping
    if (selectedShipping.id === 'free' && subtotal < selectedShipping.threshold) {
      return shippingMethods[0].price; // Fall back to standard shipping
    }
    
    return selectedShipping.price;
  };
  
  const calculateTax = () => {
    return calculateSubtotal() * 0.03; // Ghana VAT rate (simplified for example)
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector('.text-error-600');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to order confirmation
      navigate('/shop/orders/confirmation', { 
        state: { 
          orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
          total: calculateTotal()
        } 
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      setErrors({ form: 'Payment processing failed. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em]"></div>
        <p className="mt-4 text-neutral-500">Loading checkout...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Checkout</h1>
        <p className="mt-2 text-neutral-600">
          Complete your order by providing your shipping and payment details.
        </p>
      </div>

      {errors.form && (
        <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-md text-error-700">
          {errors.form}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit}>
            {/* Contact information */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="p-6 bg-neutral-50 border-b border-neutral-200">
                <h2 className="flex items-center text-lg font-medium text-neutral-900">
                  <FiUser className="mr-2 h-5 w-5 text-primary-600" />
                  Contact Information
                </h2>
              </div>
              
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.email ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-error-600">{errors.email}</p>}
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.phone ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-error-600">{errors.phone}</p>}
                </div>
              </div>
            </div>
            
            {/* Shipping information */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="p-6 bg-neutral-50 border-b border-neutral-200">
                <h2 className="flex items-center text-lg font-medium text-neutral-900">
                  <FiTruck className="mr-2 h-5 w-5 text-primary-600" />
                  Shipping Information
                </h2>
              </div>
              
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.firstName ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-error-600">{errors.firstName}</p>}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.lastName ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-error-600">{errors.lastName}</p>}
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.address ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-error-600">{errors.address}</p>}
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.city ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.city && <p className="mt-1 text-sm text-error-600">{errors.city}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-neutral-700 mb-1">
                      Region
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.region ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    >
                      <option value="">Select...</option>
                      <option value="Greater Accra">Greater Accra</option>
                      <option value="Ashanti">Ashanti</option>
                      <option value="Western">Western</option>
                      <option value="Eastern">Eastern</option>
                      <option value="Central">Central</option>
                      <option value="Volta">Volta</option>
                      <option value="Northern">Northern</option>
                      <option value="Upper East">Upper East</option>
                      <option value="Upper West">Upper West</option>
                      <option value="North East">North East</option>
                      <option value="Savannah">Savannah</option>
                      <option value="Bono">Bono</option>
                      <option value="Bono East">Bono East</option>
                      <option value="Ahafo">Ahafo</option>
                      <option value="Western North">Western North</option>
                      <option value="Oti">Oti</option>
                    </select>
                    {errors.region && <p className="mt-1 text-sm text-error-600">{errors.region}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium text-neutral-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.zip ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    />
                    {errors.zip && <p className="mt-1 text-sm text-error-600">{errors.zip}</p>}
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Shipping Method
                  </label>
                  <div className="mt-2 space-y-3">
                    {shippingMethods.map((method) => (
                      <div key={method.id} className="flex items-center">
                        <input
                          id={`shipping-${method.id}`}
                          name="shippingMethod"
                          type="radio"
                          value={method.id}
                          checked={formData.shippingMethod === method.id}
                          onChange={handleShippingChange}
                          disabled={method.id === 'free' && calculateSubtotal() < method.threshold}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
                        />
                        <label 
                          htmlFor={`shipping-${method.id}`} 
                          className={`ml-3 flex flex-1 justify-between ${
                            method.id === 'free' && calculateSubtotal() < method.threshold
                              ? 'text-neutral-400'
                              : 'text-neutral-700'
                          }`}
                        >
                          <span>{method.name}</span>
                          <span>
                            {method.price === 0
                              ? 'Free'
                              : `GH₵${method.price.toFixed(2)}`
                            }
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  {formData.shippingMethod === 'free' && calculateSubtotal() < shippingMethods.find(m => m.id === 'free').threshold && (
                    <p className="mt-2 text-sm text-neutral-500">
                      Add GH₵{(shippingMethods.find(m => m.id === 'free').threshold - calculateSubtotal()).toFixed(2)} more to qualify for free shipping.
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Payment information */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 bg-neutral-50 border-b border-neutral-200">
                <h2 className="flex items-center text-lg font-medium text-neutral-900">
                  <FiSmartphone className="mr-2 h-5 w-5 text-primary-600" />
                  Payment Method
                </h2>
              </div>
              
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Select Payment Method
                  </label>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-start">
                        <input
                          id={`payment-${method.id}`}
                          name="paymentMethod"
                          type="radio"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handlePaymentMethodChange}
                          className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-neutral-300"
                        />
                        <label htmlFor={`payment-${method.id}`} className="ml-3">
                          <span className="block text-sm font-medium text-neutral-700">{method.name}</span>
                          <span className="block text-xs text-neutral-500 mt-1">
                            {method.id === 'momo' ? 
                              'Pay with your MTN Mobile Money account' : 
                              'Pay with your Telecel Cash account'}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                    Mobile Money Number
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="0XX XXX XXXX"
                    className={`w-full px-3 py-2 border ${errors.mobileNumber ? 'border-error-300' : 'border-neutral-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.mobileNumber && <p className="mt-1 text-sm text-error-600">{errors.mobileNumber}</p>}
                  <p className="mt-2 text-xs text-neutral-500">
                    {formData.paymentMethod === 'momo' 
                      ? 'Enter the phone number registered with your MTN Mobile Money account'
                      : 'Enter the phone number registered with your Telecel Cash account'}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-md">
                    After placing your order, you will receive a prompt on your phone to confirm the payment. Please complete the transaction within 10 minutes to secure your order.
                  </p>
                </div>
                
                <div className="sm:col-span-2 flex items-start">
                  <input
                    id="saveInfo"
                    name="saveInfo"
                    type="checkbox"
                    checked={formData.saveInfo}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded mt-1"
                  />
                  <label htmlFor="saveInfo" className="ml-2 text-sm text-neutral-700">
                    Save this information for next time
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-8">
            <div className="p-6 bg-neutral-50 border-b border-neutral-200">
              <h2 className="text-lg font-medium text-neutral-900">Order Summary</h2>
            </div>
            
            <div className="p-6">
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-neutral-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="py-6 flex">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-neutral-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">GH₵{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-neutral-500">SKU: {item.sku}</p>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm">
                          <p className="text-neutral-500">Qty {item.quantity}</p>
                          <Link
                            to="/shop/cart"
                            className="font-medium text-primary-600 hover:text-primary-500"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-8 border-t border-neutral-200 pt-6 space-y-4">
                <div className="flex justify-between text-base text-neutral-700">
                  <p>Subtotal</p>
                  <p>GH₵{calculateSubtotal().toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base text-neutral-700">
                  <p>Shipping</p>
                  <p>
                    {calculateShipping() === 0
                      ? 'Free'
                      : `GH₵${calculateShipping().toFixed(2)}`
                    }
                  </p>
                </div>
                <div className="flex justify-between text-base text-neutral-700">
                  <p>Tax</p>
                  <p>GH₵{calculateTax().toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-lg font-medium text-neutral-900">
                  <p>Total</p>
                  <p>GH₵{calculateTotal().toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={processing}
                  className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 ${
                    processing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700'
                  }`}
                >
                  {processing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>Place Order</>
                  )}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <Link
                  to="/shop/cart"
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  <FiArrowLeft className="mr-1 h-4 w-4" />
                  Return to cart
                </Link>
              </div>
              
              <div className="mt-8 border-t border-neutral-200 pt-6">
                <div className="flex items-center">
                  <FiCheckCircle className="h-5 w-5 text-success-500" />
                  <p className="ml-2 text-sm text-neutral-600">All transactions are secure and encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 