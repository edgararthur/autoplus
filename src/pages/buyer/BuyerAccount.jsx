import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiMapPin, FiCreditCard, FiLock, FiEdit, FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';

const BuyerAccount = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  
  // User profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    joinedDate: ''
  });
  
  // Orders state
  const [orders, setOrders] = useState([]);
  
  // Addresses state
  const [addresses, setAddresses] = useState([]);
  
  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([]);
  
  // Security state
  const [securityInfo, setSecurityInfo] = useState({
    password: '********',
    twoFactorEnabled: false
  });

  useEffect(() => {
    // Simulate API call to fetch user data
    setTimeout(() => {
      setProfile({
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '(555) 123-4567',
        joinedDate: '2022-03-15'
      });
      
      setOrders([
        { id: 'ORD-1234', date: '2023-04-10', total: 342.99, status: 'delivered', items: 3 },
        { id: 'ORD-1185', date: '2023-03-22', total: 127.50, status: 'shipped', items: 2 },
        { id: 'ORD-1089', date: '2023-02-15', total: 89.99, status: 'processing', items: 1 },
        { id: 'ORD-987', date: '2023-01-30', total: 205.75, status: 'delivered', items: 4 }
      ]);
      
      setAddresses([
        { id: 1, type: 'Home', default: true, address: '123 Main St, Apt 4B', city: 'Boston', state: 'MA', zip: '02108' },
        { id: 2, type: 'Work', default: false, address: '456 Market Ave', city: 'Boston', state: 'MA', zip: '02110' }
      ]);
      
      setPaymentMethods([
        { id: 1, type: 'Mobile Money', last4: '1234', brand: 'MoMo', expiry: 'N/A', default: true },
        { id: 2, type: 'Mobile Money', last4: '5678', brand: 'Telecel Cash', expiry: 'N/A', default: false }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar with tabs */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <nav className="flex flex-col">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'profile' ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500' : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <FiUser className="mr-3 h-5 w-5" />
                Profile
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'orders' ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500' : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <FiShoppingBag className="mr-3 h-5 w-5" />
                Orders
              </button>
              
              <button
                onClick={() => setActiveTab('addresses')}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'addresses' ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500' : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <FiMapPin className="mr-3 h-5 w-5" />
                Addresses
              </button>
              
              <button
                onClick={() => setActiveTab('payment')}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'payment' ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500' : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <FiCreditCard className="mr-3 h-5 w-5" />
                Payment Methods
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'security' ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500' : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <FiLock className="mr-3 h-5 w-5" />
                Security
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <>
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-neutral-900">Profile Information</h2>
                      <button className="flex items-center text-sm text-primary-600 hover:text-primary-500">
                        <FiEdit className="mr-1 h-4 w-4" /> Edit
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Name</p>
                        <p className="mt-1 text-neutral-900">{profile.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Email</p>
                        <p className="mt-1 text-neutral-900">{profile.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Phone Number</p>
                        <p className="mt-1 text-neutral-900">{profile.phone}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Member Since</p>
                        <p className="mt-1 text-neutral-900">{formatDate(profile.joinedDate)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-neutral-900">Order History</h2>
                    </div>
                    
                    {orders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-neutral-200">
                          <thead className="bg-neutral-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Order ID</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Items</th>
                              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-neutral-200">
                            {orders.map(order => (
                              <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{formatDate(order.date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">${order.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{order.items}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Link to={`/orders/${order.id}`} className="text-primary-600 hover:text-primary-900">View</Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-neutral-500">You haven't placed any orders yet.</p>
                        <Link to="/products" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                          Browse Products
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-neutral-900">Saved Addresses</h2>
                      <button className="flex items-center text-sm text-primary-600 hover:text-primary-500">
                        <FiPlus className="mr-1 h-4 w-4" /> Add New
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map(address => (
                        <div key={address.id} className="border rounded-lg p-4 relative">
                          {address.default && (
                            <span className="absolute top-4 right-4 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">Default</span>
                          )}
                          
                          <p className="font-medium">{address.type}</p>
                          <p className="text-sm text-neutral-700 mt-1">{address.address}</p>
                          <p className="text-sm text-neutral-700">{address.city}, {address.state} {address.zip}</p>
                          
                          <div className="mt-4 flex space-x-3">
                            <button className="text-sm text-neutral-600 hover:text-neutral-900">Edit</button>
                            {!address.default && (
                              <>
                                <button className="text-sm text-neutral-600 hover:text-neutral-900">Make Default</button>
                                <button className="text-sm text-red-600 hover:text-red-900">Remove</button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Payment Methods Tab */}
                {activeTab === 'payment' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-neutral-900">Payment Methods</h2>
                      <button className="flex items-center text-sm text-primary-600 hover:text-primary-500">
                        <FiPlus className="mr-1 h-4 w-4" /> Add New
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {paymentMethods.map(method => (
                        <div key={method.id} className="border rounded-lg p-4 relative">
                          {method.default && (
                            <span className="absolute top-4 right-4 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">Default</span>
                          )}
                          
                          <div className="flex items-center">
                            <div className="mr-3">
                              {method.brand === 'MoMo' ? (
                                <span className="text-purple-600 text-xl font-bold">MoMo</span>
                              ) : method.brand === 'Telecel Cash' ? (
                                <span className="text-red-600 text-xl font-bold">TC</span>
                              ) : (
                                <span className="text-neutral-600 text-xl font-bold">MM</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{method.brand} •••• {method.last4}</p>
                              <p className="text-sm text-neutral-700">Phone Number</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex space-x-3">
                            <button className="text-sm text-neutral-600 hover:text-neutral-900">Update</button>
                            {!method.default && (
                              <>
                                <button className="text-sm text-neutral-600 hover:text-neutral-900">Make Default</button>
                                <button className="text-sm text-red-600 hover:text-red-900">Remove</button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900 mb-6">Security Settings</h2>
                    
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-neutral-900">Password</h3>
                        <button className="flex items-center text-sm text-primary-600 hover:text-primary-500">
                          <FiEdit className="mr-1 h-4 w-4" /> Change
                        </button>
                      </div>
                      <p className="text-neutral-500 text-sm">Last changed 3 months ago</p>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-lg font-medium text-neutral-900">Two-Factor Authentication</h3>
                        <p className="text-neutral-500 text-sm mt-1">Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`mr-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          securityInfo.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {securityInfo.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <button className="flex items-center text-sm text-primary-600 hover:text-primary-500">
                          {securityInfo.twoFactorEnabled ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerAccount;