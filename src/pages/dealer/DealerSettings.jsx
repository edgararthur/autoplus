import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiSave, 
  FiUpload, 
  FiLock, 
  FiCreditCard, 
  FiTruck, 
  FiGlobe, 
  FiMail,
  FiAlertCircle,
  FiCheck
} from 'react-icons/fi';
import Avatar from '../../components/common/Avatar';

const DealerSettings = () => {
  const { currentUser } = useAuth();
  
  // State for different settings sections
  const [profileData, setProfileData] = useState({
    companyName: currentUser?.companyName || 'Auto Parts Plus',
    contactName: currentUser?.name || 'John Smith',
    email: currentUser?.email || 'john@autopartsplus.com',
    phone: '(555) 123-4567',
    website: 'www.autopartsplus.com',
    description: 'We are a leading supplier of high-quality automotive parts with over 15 years of experience in the industry. Our extensive inventory includes parts for all major vehicle makes and models.',
    logo: null,
    logoPreview: null
  });
  
  const [addressData, setAddressData] = useState({
    street: '123 Main Street',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'United States'
  });
  
  const [shippingData, setShippingData] = useState({
    enableFreeShipping: true,
    freeShippingThreshold: 99,
    shippingMethods: [
      { id: 1, name: 'Standard Shipping', price: 5.99, estimatedDays: '3-5', isDefault: true },
      { id: 2, name: 'Express Shipping', price: 12.99, estimatedDays: '1-2', isDefault: false }
    ]
  });
  
  const [paymentData, setPaymentData] = useState({
    acceptedMethods: {
      creditCard: true,
      paypal: true,
      bankTransfer: false,
      applePay: false,
      googlePay: false
    },
    bankAccount: {
      accountName: 'Auto Parts Plus LLC',
      accountNumber: '****3456',
      routingNumber: '****7890',
      bankName: 'Chase Bank'
    }
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationData, setNotificationData] = useState({
    orderNotifications: true,
    inventoryAlerts: true,
    marketingEmails: false,
    systemUpdates: true
  });
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('profile');
  
  // State for success messages
  const [successMessage, setSuccessMessage] = useState('');
  
  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        logo: file,
        logoPreview: URL.createObjectURL(file)
      });
    }
  };
  
  // Handle address form change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData({
      ...addressData,
      [name]: value
    });
  };
  
  // Handle shipping form change
  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingData({
      ...shippingData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle shipping method change
  const handleShippingMethodChange = (id, field, value) => {
    const updatedMethods = shippingData.shippingMethods.map(method => 
      method.id === id ? { ...method, [field]: value } : method
    );
    
    setShippingData({
      ...shippingData,
      shippingMethods: updatedMethods
    });
  };
  
  // Handle set default shipping method
  const handleSetDefaultShipping = (id) => {
    const updatedMethods = shippingData.shippingMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    
    setShippingData({
      ...shippingData,
      shippingMethods: updatedMethods
    });
  };
  
  // Handle payment method toggle
  const handlePaymentMethodToggle = (method) => {
    setPaymentData({
      ...paymentData,
      acceptedMethods: {
        ...paymentData.acceptedMethods,
        [method]: !paymentData.acceptedMethods[method]
      }
    });
  };
  
  // Handle bank account change
  const handleBankAccountChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      bankAccount: {
        ...paymentData.bankAccount,
        [name]: value
      }
    });
  };
  
  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  // Handle notification toggle
  const handleNotificationToggle = (setting) => {
    setNotificationData({
      ...notificationData,
      [setting]: !notificationData[setting]
    });
  };
  
  // Handle form submission
  const handleSubmit = (e, section) => {
    e.preventDefault();
    
    // Get the appropriate data for the section
    const sectionData = 
      section === 'profile' ? profileData : 
      section === 'address' ? addressData : 
      section === 'shipping' ? shippingData : 
      section === 'payment' ? paymentData : 
      section === 'password' ? passwordData : 
      notificationData;
    
    // In a real app, this would send data to the API
    // Example API call (to be implemented with actual API)
    // api.updateSettings(section, sectionData)
    //   .then(() => {
    //     setSuccessMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully!`);
    //   })
    //   .catch((error) => {
    //     setError(`Failed to update ${section} settings: ${error.message}`);
    //   });
    
    // For demo purposes, simulate successful update
    setSuccessMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully!`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Account Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your store profile, shipping options, payment methods, and notification preferences.
        </p>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-md flex items-center">
          <FiCheck className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}
      
      {/* Settings tabs and content */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-neutral-200">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Store Profile
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'address'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab('address')}
            >
              Address
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'shipping'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'payment'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab('payment')}
            >
              Payment
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'password'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab('password')}
            >
              Password
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'notifications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <form onSubmit={(e) => handleSubmit(e, 'profile')}>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <h3 className="text-lg font-medium text-neutral-900">Store Profile</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      This information will be displayed on your storefront and in customer communications.
                    </p>
                  </div>
                  <div className="md:w-2/3 space-y-6">
                    {/* Logo upload */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Store Logo</label>
                      <div className="mt-2 flex items-center">
                        <div className="mr-4">
                          {profileData.logoPreview ? (
                            <img 
                              src={profileData.logoPreview} 
                              alt="Store logo preview" 
                              className="h-16 w-16 object-cover rounded-md"
                            />
                          ) : (
                            <Avatar name={profileData.companyName} size="large" />
                          )}
                        </div>
                        <div>
                          <label htmlFor="logo-upload" className="cursor-pointer bg-white py-2 px-3 border border-neutral-300 rounded-md shadow-sm text-sm leading-4 font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            <span className="flex items-center">
                              <FiUpload className="mr-2 h-4 w-4" />
                              Upload Logo
                            </span>
                            <input
                              id="logo-upload"
                              name="logo"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleLogoUpload}
                            />
                          </label>
                          <p className="mt-1 text-xs text-neutral-500">
                            PNG, JPG, GIF up to 2MB
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Company name */}
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-neutral-700">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        id="companyName"
                        required
                        className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={profileData.companyName}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    {/* Contact name */}
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-neutral-700">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        id="contactName"
                        required
                        className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={profileData.contactName}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={profileData.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    {/* Website */}
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-neutral-700">
                        Website
                      </label>
                      <input
                        type="text"
                        name="website"
                        id="website"
                        className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={profileData.website}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
                        Store Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={4}
                        className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={profileData.description}
                        onChange={handleProfileChange}
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        Brief description of your store for customers.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FiSave className="mr-2 -ml-1 h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Address Settings */}
          {activeTab === 'address' && (
            <form onSubmit={(e) => handleSubmit(e, 'address')}>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <h3 className="text-lg font-medium text-neutral-900">Business Address</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      Your business address will be used for shipping, invoices, and tax purposes.
                    </p>
                  </div>
                  <div className="md:w-2/3 space-y-6">
                    {/* Street address */}
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-neutral-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street"
                        id="street"
                        required
                        className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={addressData.street}
                        onChange={handleAddressChange}
                      />
                    </div>
                    
                    {/* City, State, Zip */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-neutral-700">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          required
                          className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={addressData.city}
                          onChange={handleAddressChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-neutral-700">
                          State / Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          required
                          className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={addressData.state}
                          onChange={handleAddressChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700">
                          ZIP / Postal Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          id="zipCode"
                          required
                          className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={addressData.zipCode}
                          onChange={handleAddressChange}
                        />
                      </div>
                    </div>
                    
                    {/* Country */}
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-neutral-700">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        value={addressData.country}
                        onChange={handleAddressChange}
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Mexico">Mexico</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FiSave className="mr-2 -ml-1 h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Shipping Settings */}
          {activeTab === 'shipping' && (
            <form onSubmit={(e) => handleSubmit(e, 'shipping')}>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <h3 className="text-lg font-medium text-neutral-900">Shipping Options</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      Configure shipping methods and rates for your customers.
                    </p>
                  </div>
                  <div className="md:w-2/3 space-y-6">
                    {/* Free shipping option */}
                    <div className="bg-neutral-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="enableFreeShipping"
                            name="enableFreeShipping"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-neutral-300 rounded"
                            checked={shippingData.enableFreeShipping}
                            onChange={handleShippingChange}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="enableFreeShipping" className="font-medium text-neutral-700">
                            Enable Free Shipping
                          </label>
                          <p className="text-neutral-500">
                            Offer free shipping on orders above a certain amount.
                          </p>
                        </div>
                      </div>
                      
                      {shippingData.enableFreeShipping && (
                        <div className="mt-4">
                          <label htmlFor="freeShippingThreshold" className="block text-sm font-medium text-neutral-700">
                            Free Shipping Threshold ($)
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-neutral-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              name="freeShippingThreshold"
                              id="freeShippingThreshold"
                              min="0"
                              step="0.01"
                              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-neutral-300 rounded-md"
                              value={shippingData.freeShippingThreshold}
                              onChange={handleShippingChange}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Shipping methods */}
                    <div>
                      <h4 className="text-sm font-medium text-neutral-700 mb-3">Shipping Methods</h4>
                      
                      {shippingData.shippingMethods.map((method) => (
                        <div key={method.id} className="mb-4 border border-neutral-200 rounded-md p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                            <div className="flex items-center mb-2 sm:mb-0">
                              <input
                                type="text"
                                className="block w-full border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={method.name}
                                onChange={(e) => handleShippingMethodChange(method.id, 'name', e.target.value)}
                              />
                            </div>
                            <div className="flex items-center">
                              <button
                                type="button"
                                className={`ml-2 px-3 py-1 text-xs font-medium rounded-full ${
                                  method.isDefault
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                }`}
                                onClick={() => handleSetDefaultShipping(method.id)}
                              >
                                {method.isDefault ? 'Default Method' : 'Set as Default'}
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="form-group">
                                <label htmlFor="processingTime" className="block text-sm font-medium text-neutral-700 mb-1">
                                  Processing Time
                                </label>
                                <select
                                  id="processingTime"
                                  name="processingTime"
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                >
                                  <option value="1-2">1-2 business days</option>
                                  <option value="3-5">3-5 business days</option>
                                  <option value="5-7">5-7 business days</option>
                                  <option value="7-10">7-10 business days</option>
                                </select>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
          
          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <form onSubmit={(e) => handleSubmit(e, 'payment')}>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <h3 className="text-lg font-medium text-neutral-900">Payment Methods</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      Configure accepted payment methods for your customers.
                    </p>
                  </div>
                  <div className="md:w-2/3 space-y-6">
                    {/* Credit card */}
                    <div className="bg-neutral-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="creditCard"
                            name="creditCard"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-neutral-300 rounded"
                            checked={paymentData.acceptedMethods.creditCard}
                            onChange={() => handlePaymentMethodToggle('creditCard')}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="creditCard" className="font-medium text-neutral-700">
                            Credit Card
                          </label>
                          <p className="text-neutral-500">
                            Accept credit card payments.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* PayPal */}
                    <div className="bg-neutral-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="paypal"
                            name="paypal"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-neutral-300 rounded"
                            checked={paymentData.acceptedMethods.paypal}
                            onChange={() => handlePaymentMethodToggle('paypal')}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="paypal" className="font-medium text-neutral-700">
                            PayPal
                          </label>
                          <p className="text-neutral-500">
                            Accept PayPal payments.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bank transfer */}
                    <div className="bg-neutral-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="bankTransfer"
                            name="bankTransfer"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-neutral-300 rounded"
                            checked={paymentData.acceptedMethods.bankTransfer}
                            onChange={() => handlePaymentMethodToggle('bankTransfer')}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="bankTransfer" className="font-medium text-neutral-700">
                            Bank Transfer
                          </label>
                          <p className="text-neutral-500">
                            Accept bank transfer payments.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Apple Pay */}
                    <div className="bg-neutral-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="applePay"
                            name="applePay"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-neutral-300 rounded"
                            checked={paymentData.acceptedMethods.applePay}
                            onChange={() => handlePaymentMethodToggle('applePay')}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="applePay" className="font-medium text-neutral-700">
                            Apple Pay
                          </label>
                          <p className="text-neutral-500">
                            Accept Apple Pay payments.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Google Pay */}
                    <div className="bg-neutral-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="googlePay"
                            name="googlePay"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-neutral-300 rounded"
                            checked={paymentData.acceptedMethods.googlePay}
                            onChange={() => handlePaymentMethodToggle('googlePay')}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="googlePay" className="font-medium text-neutral-700">
                            Google Pay
                          </label>
                          <p className="text-neutral-500">
                            Accept Google Pay payments.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
          
          {/* Password Settings */}
          {activeTab === 'password' && (
            <form onSubmit={(e) => handleSubmit(e, 'password')}>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <h3 className="text-lg font-medium text-neutral-900">Change Password</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      Enter your current password and new password to change your account password.
                    </p>
                  </div>
                  <div className="md:w-2/3 space-y-6">
                    {/* Current password */}
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        required
                        className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    
                    {/* New password */}
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        required
                        className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    
                    {/* Confirm password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        required
                        className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FiSave className="mr-2 -ml-1 h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <form onSubmit={(e) => handleSubmit(e, 'notifications')}>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <h3 className="text-lg font-medium text-neutral-900">Notification Preferences</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      Configure notification preferences for your store.
                    </p>
                  </div>
                  <div className="md:w-2/3 space-y-6">
                    {/* Order notifications */}
                    <div className="bg-neutral-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="orderNotifications"
                            name="orderNotifications"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-neutral-300 rounded"
                            checked={notificationData.orderNotifications}
                            onChange={() => handleNotificationToggle('orderNotifications')}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="orderNotifications" className="font-medium text-neutral-700">
                            Order Notifications
                          </label>
                          <p className="text-neutral-500">
                            Receive notifications for new orders.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Inventory alerts */}
                    <div className="bg-neutral-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="inventoryAlerts"
                            name="inventoryAlerts"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-neutral-300 rounded"
                            checked={notificationData.inventoryAlerts}
                            onChange={() => handleNotificationToggle('inventoryAlerts')}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="inventoryAlerts" className="font-medium text-neutral-700">
                            Inventory Alerts
                          </label>
                          <p className="text-neutral-500">
                            Receive notifications for low inventory.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Marketing emails */}
                    <div className="bg-neutral-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="marketingEmails"
                            name="marketingEmails"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-neutral-300 rounded"
                            checked={notificationData.marketingEmails}
                            onChange={() => handleNotificationToggle('marketingEmails')}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="marketingEmails" className="font-medium text-neutral-700">
                            Marketing Emails
                          </label>
                          <p className="text-neutral-500">
                            Receive marketing emails from your store.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* System updates */}
                    <div className="bg-neutral-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="systemUpdates"
                            name="systemUpdates"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-neutral-300 rounded"
                            checked={notificationData.systemUpdates}
                            onChange={() => handleNotificationToggle('systemUpdates')}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="systemUpdates" className="font-medium text-neutral-700">
                            System Updates
                          </label>
                          <p className="text-neutral-500">
                            Receive system updates and maintenance notifications.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerSettings;
