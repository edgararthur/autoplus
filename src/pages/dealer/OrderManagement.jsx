import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFilter, 
  FiDownload, 
  FiSearch, 
  FiEye, 
  FiPackage,
  FiTruck,
  FiCheck,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar
} from 'react-icons/fi';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-1234',
    customer: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567'
    },
    date: '2023-07-12T14:30:00',
    total: 389.95,
    items: 3,
    status: 'processing',
    paymentStatus: 'paid',
    shippingMethod: 'Standard Shipping'
  },
  {
    id: 'ORD-1233',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 987-6543'
    },
    date: '2023-07-11T09:15:00',
    total: 129.99,
    items: 1,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingMethod: 'Express Shipping'
  },
  {
    id: 'ORD-1232',
    customer: {
      name: 'Michael Brown',
      email: 'mbrown@example.com',
      phone: '(555) 456-7890'
    },
    date: '2023-07-11T11:45:00',
    total: 259.98,
    items: 2,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingMethod: 'Standard Shipping'
  },
  {
    id: 'ORD-1231',
    customer: {
      name: 'Lisa Williams',
      email: 'lwilliams@example.com',
      phone: '(555) 234-5678'
    },
    date: '2023-07-10T16:20:00',
    total: 74.95,
    items: 1,
    status: 'returned',
    paymentStatus: 'refunded',
    shippingMethod: 'Standard Shipping'
  },
  {
    id: 'ORD-1230',
    customer: {
      name: 'Robert Davis',
      email: 'rdavis@example.com',
      phone: '(555) 876-5432'
    },
    date: '2023-07-09T13:10:00',
    total: 499.99,
    items: 4,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingMethod: 'Express Shipping'
  },
  {
    id: 'ORD-1229',
    customer: {
      name: 'Jennifer Miller',
      email: 'jmiller@example.com',
      phone: '(555) 345-6789'
    },
    date: '2023-07-08T10:30:00',
    total: 149.95,
    items: 2,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingMethod: 'Standard Shipping'
  },
  {
    id: 'ORD-1228',
    customer: {
      name: 'David Wilson',
      email: 'dwilson@example.com',
      phone: '(555) 567-8901'
    },
    date: '2023-07-07T15:45:00',
    total: 219.98,
    items: 3,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingMethod: 'Standard Shipping'
  },
  {
    id: 'ORD-1227',
    customer: {
      name: 'Emily Taylor',
      email: 'etaylor@example.com',
      phone: '(555) 678-9012'
    },
    date: '2023-07-06T09:20:00',
    total: 89.99,
    items: 1,
    status: 'cancelled',
    paymentStatus: 'refunded',
    shippingMethod: 'Standard Shipping'
  },
  {
    id: 'ORD-1226',
    customer: {
      name: 'James Anderson',
      email: 'janderson@example.com',
      phone: '(555) 789-0123'
    },
    date: '2023-07-05T14:15:00',
    total: 349.95,
    items: 2,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingMethod: 'Express Shipping'
  },
  {
    id: 'ORD-1225',
    customer: {
      name: 'Patricia Martinez',
      email: 'pmartinez@example.com',
      phone: '(555) 890-1234'
    },
    date: '2023-07-04T11:30:00',
    total: 179.99,
    items: 2,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingMethod: 'Standard Shipping'
  }
];

const OrderManagement = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const itemsPerPage = 8;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle status filter
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };
  
  // Handle sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Handle date range filter
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };
  
  // Filter orders based on search, status, and date range
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesDateRange = true;
    if (dateRange.start && dateRange.end) {
      const orderDate = new Date(order.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59); // Set to end of day
      
      matchesDateRange = orderDate >= startDate && orderDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });
  
  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
    }
    
    if (sortConfig.key === 'total') {
      return sortConfig.direction === 'ascending' ? a.total - b.total : b.total - a.total;
    }
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
  
  // Paginate orders
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  // Calculate total pages
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  
  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-primary-100 text-primary-800';
      case 'shipped':
        return 'bg-accent-100 text-accent-800';
      case 'delivered':
        return 'bg-success-100 text-success-800';
      case 'returned':
        return 'bg-error-100 text-error-800';
      case 'cancelled':
        return 'bg-neutral-100 text-neutral-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <FiPackage className="mr-1 h-4 w-4" />;
      case 'shipped':
        return <FiTruck className="mr-1 h-4 w-4" />;
      case 'delivered':
        return <FiCheck className="mr-1 h-4 w-4" />;
      case 'returned':
      case 'cancelled':
        return <FiXCircle className="mr-1 h-4 w-4" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Order Management</h1>
          <p className="mt-1 text-sm text-neutral-500">
            View and manage customer orders, track shipments, and process returns.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <button
            className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiDownload className="mr-2 -ml-1 h-4 w-4" />
            Export Orders
          </button>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="bg-white shadow rounded-lg p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search by order ID or customer"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {/* Date range filter */}
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="date"
                name="start"
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={dateRange.start}
                onChange={handleDateRangeChange}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="date"
                name="end"
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={dateRange.end}
                onChange={handleDateRangeChange}
              />
            </div>
          </div>
          
          {/* Status filter */}
          <div className="flex space-x-2 overflow-x-auto">
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={() => handleStatusFilter('all')}
            >
              All Orders
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                statusFilter === 'processing'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={() => handleStatusFilter('processing')}
            >
              Processing
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                statusFilter === 'shipped'
                  ? 'bg-accent-100 text-accent-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={() => handleStatusFilter('shipped')}
            >
              Shipped
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                statusFilter === 'delivered'
                  ? 'bg-success-100 text-success-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={() => handleStatusFilter('delivered')}
            >
              Delivered
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                statusFilter === 'returned'
                  ? 'bg-error-100 text-error-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={() => handleStatusFilter('returned')}
            >
              Returned
            </button>
          </div>
        </div>
      </div>
      
      {/* Orders table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('id')}
                >
                  <div className="flex items-center">
                    <span>Order ID</span>
                    {sortConfig.key === 'id' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Customer
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('date')}
                >
                  <div className="flex items-center">
                    <span>Date</span>
                    {sortConfig.key === 'date' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('total')}
                >
                  <div className="flex items-center">
                    <span>Total</span>
                    {sortConfig.key === 'total' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary-600">
                        <Link to={`/dealer/orders/${order.id}`}>
                          {order.id}
                        </Link>
                      </div>
                      <div className="text-xs text-neutral-500">
                        {order.items} {order.items === 1 ? 'item' : 'items'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-neutral-900">
                        {order.customer.name}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {order.customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        {formatDate(order.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">
                        {formatCurrency(order.total)}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {order.shippingMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'paid' 
                          ? 'bg-success-100 text-success-800' 
                          : order.paymentStatus === 'refunded'
                          ? 'bg-error-100 text-error-800'
                          : 'bg-accent-100 text-accent-800'
                      }`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/dealer/orders/${order.id}`} className="text-primary-600 hover:text-primary-900">
                        <FiEye className="h-5 w-5 inline" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-neutral-500">
                    No orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {sortedOrders.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-neutral-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-neutral-700">
                  Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastOrder, sortedOrders.length)}
                  </span>{' '}
                  of <span className="font-medium">{sortedOrders.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? 'text-neutral-300 cursor-not-allowed'
                        : 'text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                    let pageNumber;
                    
                    // Calculate which page numbers to show
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? 'text-neutral-300 cursor-not-allowed'
                        : 'text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
