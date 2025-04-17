import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiShoppingBag,
  FiDollarSign,
  FiPackage, 
  FiTruck,
  FiUsers,
  FiAlertCircle,
  FiArrowUp,
  FiArrowDown,
  FiChevronRight,
  FiPlus
} from 'react-icons/fi';

// Mock data
const revenueData = [
  { month: 'Jan', value: 12500 },
  { month: 'Feb', value: 14200 },
  { month: 'Mar', value: 16800 },
  { month: 'Apr', value: 15700 },
  { month: 'May', value: 19500 },
  { month: 'Jun', value: 21300 },
  { month: 'Jul', value: 22400 },
  { month: 'Aug', value: 23800 },
  { month: 'Sep', value: 25600 },
  { month: 'Oct', value: 27200 },
  { month: 'Nov', value: 28900 },
  { month: 'Dec', value: 29400 },
];

const recentOrders = [
  {
    id: 'ORD-7652',
    customer: 'Michael Johnson',
    date: '2023-11-28',
    amount: 349.97,
    status: 'Shipped',
    items: 3
  },
  {
    id: 'ORD-7651',
    customer: 'Sarah Williams',
    date: '2023-11-28',
    amount: 129.99,
    status: 'Processing',
    items: 1
  },
  {
    id: 'ORD-7650',
    customer: 'David Brown',
    date: '2023-11-27',
    amount: 76.45,
    status: 'Delivered',
    items: 2
  },
  {
    id: 'ORD-7649',
    customer: 'Emily Davis',
    date: '2023-11-27',
    amount: 245.90,
    status: 'Delivered',
    items: 4
  },
  {
    id: 'ORD-7648',
    customer: 'Robert Wilson',
    date: '2023-11-26',
    amount: 189.99,
    status: 'Shipped',
    items: 1
  }
];

const lowStockItems = [
  {
    id: 'P-1234',
    name: 'Premium Brake Pads',
    category: 'Brakes',
    stock: 3,
    threshold: 5
  },
  {
    id: 'P-2345',
    name: 'Engine Oil Filter',
    category: 'Engine',
    stock: 2,
    threshold: 10
  },
  {
    id: 'P-3456',
    name: 'Serpentine Belt',
    category: 'Engine',
    stock: 4,
    threshold: 5
  }
];

const DealerDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({
    sales: { value: 0, change: 0 },
    orders: { value: 0, change: 0 },
    customers: { value: 0, change: 0 },
    inventory: { value: 0, change: 0 }
  });
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    setLoading(true);
    setTimeout(() => {
      setStats({
        sales: { value: 27200, change: 8.5 },
        orders: { value: 184, change: 12.3 },
        customers: { value: 152, change: 5.7 },
        inventory: { value: 1243, change: -2.1 }
      });
      setLoading(false);
    }, 500);
  }, [timeRange]);
  
  // Generate simple chart (in a real app, would use a charting library)
  const generateChart = () => {
    const maxValue = Math.max(...revenueData.map(d => d.value));
    const chartHeight = 100;
    
    return (
      <div className="flex items-end h-32 space-x-2">
        {revenueData.map((month, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center flex-1"
          >
            <div 
              className="w-full bg-primary-200 hover:bg-primary-300 transition-colors rounded-t"
              style={{ height: `${(month.value / maxValue) * chartHeight}px` }}
            ></div>
            <div className="text-xs text-neutral-500 mt-1">{month.month}</div>
          </div>
        ))}
      </div>
    );
  };
  
  // Helper for status badge style
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-success-100 text-success-800';
      case 'Shipped':
        return 'bg-primary-100 text-primary-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-neutral-100 text-neutral-800';
      case 'Cancelled':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Welcome back, {currentUser?.name || 'Dealer'}
          </h1>
            <p className="mt-1 text-neutral-500">
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Link
              to="/dealer/inventory/add"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
              <FiPlus className="-ml-1 mr-2 h-4 w-4" />
            Add Product
          </Link>
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sales card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Sales</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-neutral-900">
                  ${stats.sales.value.toLocaleString()}
                </p>
                <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stats.sales.change >= 0 ? 'text-success-600' : 'text-error-600'
                }`}>
                  {stats.sales.change >= 0 ? (
                    <FiArrowUp className="self-center flex-shrink-0 h-4 w-4 text-success-500" />
                  ) : (
                    <FiArrowDown className="self-center flex-shrink-0 h-4 w-4 text-error-500" />
                  )}
                  <span className="ml-1">{Math.abs(stats.sales.change)}%</span>
                </p>
              </div>
            </div>
            <div className="p-3 bg-primary-50 rounded-full">
              <FiDollarSign className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        {/* Orders card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Orders</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-neutral-900">
                  {stats.orders.value}
                </p>
                <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stats.orders.change >= 0 ? 'text-success-600' : 'text-error-600'
                }`}>
                  {stats.orders.change >= 0 ? (
                    <FiArrowUp className="self-center flex-shrink-0 h-4 w-4 text-success-500" />
                  ) : (
                    <FiArrowDown className="self-center flex-shrink-0 h-4 w-4 text-error-500" />
                  )}
                  <span className="ml-1">{Math.abs(stats.orders.change)}%</span>
                </p>
              </div>
            </div>
            <div className="p-3 bg-primary-50 rounded-full">
              <FiShoppingBag className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        {/* Customers card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Customers</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-neutral-900">
                  {stats.customers.value}
                </p>
                <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stats.customers.change >= 0 ? 'text-success-600' : 'text-error-600'
                }`}>
                  {stats.customers.change >= 0 ? (
                    <FiArrowUp className="self-center flex-shrink-0 h-4 w-4 text-success-500" />
                  ) : (
                    <FiArrowDown className="self-center flex-shrink-0 h-4 w-4 text-error-500" />
                  )}
                  <span className="ml-1">{Math.abs(stats.customers.change)}%</span>
                </p>
              </div>
            </div>
            <div className="p-3 bg-primary-50 rounded-full">
              <FiUsers className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        {/* Inventory card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">Inventory Items</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-neutral-900">
                  {stats.inventory.value}
                </p>
                <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stats.inventory.change >= 0 ? 'text-success-600' : 'text-error-600'
                }`}>
                  {stats.inventory.change >= 0 ? (
                    <FiArrowUp className="self-center flex-shrink-0 h-4 w-4 text-success-500" />
                  ) : (
                    <FiArrowDown className="self-center flex-shrink-0 h-4 w-4 text-error-500" />
                  )}
                  <span className="ml-1">{Math.abs(stats.inventory.change)}%</span>
                </p>
              </div>
            </div>
            <div className="p-3 bg-primary-50 rounded-full">
              <FiPackage className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Revenue chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-neutral-900">Revenue Overview</h2>
          <div className="flex space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
              +8.5% vs last month
            </span>
          </div>
        </div>
        {generateChart()}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-neutral-900">Recent Orders</h2>
            <Link
              to="/dealer/orders"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all
              <FiChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-200">
                {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 rounded-full bg-primary-50">
                    <FiShoppingBag className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-900">{order.id}</p>
                    <p className="text-sm text-neutral-500">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900">${order.amount.toFixed(2)}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(order.status)}`}>
                    {order.status}
                      </span>
                </div>
              </div>
                ))}
          </div>
        </div>
        
        {/* Low stock alerts */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-neutral-900">Low Stock Alerts</h2>
            <Link
              to="/dealer/inventory"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all
              <FiChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-200">
                {lowStockItems.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 rounded-full bg-error-50">
                    <FiAlertCircle className="h-5 w-5 text-error-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                    <p className="text-sm text-neutral-500">{item.category} • SKU: {item.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900">{item.stock} in stock</p>
                  <p className="text-xs text-error-600">Threshold: {item.threshold}</p>
                </div>
                      </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
            <Link
              to="/dealer/inventory/restock"
              className="flex items-center justify-center w-full px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50"
            >
              <FiTruck className="mr-2 h-4 w-4" />
              Restock Items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;
