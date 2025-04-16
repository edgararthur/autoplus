import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, 
  FiFilter, 
  FiDownload, 
  FiUpload, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle
} from 'react-icons/fi';

// Mock inventory data
const mockInventory = [
  {
    id: 'P-1001',
    name: 'Premium Brake Pads - Toyota Camry (2018-2022)',
    sku: 'BP-TOY-CAM-18',
    category: 'Brakes',
    price: 89.99,
    stock: 42,
    threshold: 10,
    status: 'active'
  },
  {
    id: 'P-1002',
    name: 'Engine Oil Filter - Honda Accord/Civic',
    sku: 'OF-HON-ACC-19',
    category: 'Engine',
    price: 12.95,
    stock: 78,
    threshold: 20,
    status: 'active'
  },
  {
    id: 'P-1003',
    name: 'Spark Plugs Set (4) - Ford F-150 5.0L',
    sku: 'SP-FORD-F150-5L',
    category: 'Ignition',
    price: 32.50,
    stock: 15,
    threshold: 12,
    status: 'active'
  },
  {
    id: 'P-1004',
    name: 'Air Filter - Chevrolet Silverado 1500',
    sku: 'AF-CHEV-SIL-1500',
    category: 'Air Intake',
    price: 24.99,
    stock: 8,
    threshold: 10,
    status: 'low-stock'
  },
  {
    id: 'P-1005',
    name: 'Transmission Fluid - Synthetic - 1 Quart',
    sku: 'TF-SYN-1QT',
    category: 'Fluids',
    price: 18.75,
    stock: 53,
    threshold: 15,
    status: 'active'
  },
  {
    id: 'P-1006',
    name: 'Cabin Air Filter - Nissan Altima/Maxima',
    sku: 'CAF-NIS-ALT-MAX',
    category: 'Filters',
    price: 19.95,
    stock: 6,
    threshold: 10,
    status: 'low-stock'
  },
  {
    id: 'P-1007',
    name: 'Alternator - Remanufactured - Toyota Corolla',
    sku: 'ALT-TOY-COR-REM',
    category: 'Electrical',
    price: 189.99,
    stock: 4,
    threshold: 5,
    status: 'low-stock'
  },
  {
    id: 'P-1008',
    name: 'Serpentine Belt - BMW 3-Series',
    sku: 'SB-BMW-3S',
    category: 'Belts',
    price: 45.50,
    stock: 12,
    threshold: 8,
    status: 'active'
  },
  {
    id: 'P-1009',
    name: 'Radiator - Hyundai Sonata (2015-2019)',
    sku: 'RAD-HYU-SON-15',
    category: 'Cooling',
    price: 159.95,
    stock: 7,
    threshold: 5,
    status: 'active'
  },
  {
    id: 'P-1010',
    name: 'Brake Rotors (Pair) - Front - Mazda CX-5',
    sku: 'BR-MAZ-CX5-F',
    category: 'Brakes',
    price: 124.99,
    stock: 9,
    threshold: 6,
    status: 'active'
  },
  {
    id: 'P-1011',
    name: 'Oxygen Sensor - Universal Fit',
    sku: 'OS-UNI-FIT',
    category: 'Sensors',
    price: 49.95,
    stock: 0,
    threshold: 10,
    status: 'out-of-stock'
  },
  {
    id: 'P-1012',
    name: 'Headlight Assembly - Jeep Grand Cherokee (Right)',
    sku: 'HL-JEEP-GC-R',
    category: 'Lighting',
    price: 215.00,
    stock: 3,
    threshold: 4,
    status: 'low-stock'
  }
];

// Categories for filter dropdown
const categories = [
  'All Categories',
  'Air Intake',
  'Belts',
  'Brakes',
  'Cooling',
  'Electrical',
  'Engine',
  'Filters',
  'Fluids',
  'Ignition',
  'Lighting',
  'Sensors'
];

const InventoryManagement = () => {
  const [inventory, setInventory] = useState(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  
  const itemsPerPage = 10;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle category filter
  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
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
  
  // Handle item selection
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInventory.map(item => item.id));
    }
  };
  
  // Filter inventory based on search, category, and status
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Sort inventory
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
  
  // Paginate inventory
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedInventory.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate total pages
  const totalPages = Math.ceil(sortedInventory.length / itemsPerPage);
  
  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'low-stock':
        return 'bg-accent-100 text-accent-800';
      case 'out-of-stock':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      setInventory(inventory.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage your product catalog, stock levels, and pricing.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <Link
            to="/dealer/inventory/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiPlus className="mr-2 -ml-1 h-4 w-4" />
            Add Product
          </Link>
          <button
            className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiUpload className="mr-2 -ml-1 h-4 w-4" />
            Import
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiDownload className="mr-2 -ml-1 h-4 w-4" />
            Export
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
              placeholder="Search by name or SKU"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {/* Category filter */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={selectedCategory}
              onChange={handleCategoryFilter}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Status filter */}
          <div className="flex space-x-2">
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'all'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={() => handleStatusFilter('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'active'
                  ? 'bg-success-100 text-success-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={() => handleStatusFilter('active')}
            >
              In Stock
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'low-stock'
                  ? 'bg-accent-100 text-accent-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={() => handleStatusFilter('low-stock')}
            >
              Low Stock
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'out-of-stock'
                  ? 'bg-error-100 text-error-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={() => handleStatusFilter('out-of-stock')}
            >
              Out of Stock
            </button>
          </div>
        </div>
      </div>
      
      {/* Inventory table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Bulk actions */}
        {selectedItems.length > 0 && (
          <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200 flex items-center">
            <span className="text-sm text-neutral-700 mr-4">
              {selectedItems.length} items selected
            </span>
            <button
              className="text-sm text-error-600 hover:text-error-900 font-medium flex items-center"
              onClick={handleBulkDelete}
            >
              <FiTrash2 className="mr-1 h-4 w-4" />
              Delete Selected
            </button>
          </div>
        )}
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    <span>Product</span>
                    {sortConfig.key === 'name' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('category')}
                >
                  <div className="flex items-center">
                    <span>Category</span>
                    {sortConfig.key === 'category' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('price')}
                >
                  <div className="flex items-center">
                    <span>Price</span>
                    {sortConfig.key === 'price' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('stock')}
                >
                  <div className="flex items-center">
                    <span>Stock</span>
                    {sortConfig.key === 'stock' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-neutral-500">
                            SKU: {item.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{formatCurrency(item.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.stock <= item.threshold && (
                          <FiAlertCircle className={`mr-1 h-4 w-4 ${item.stock === 0 ? 'text-error-500' : 'text-accent-500'}`} />
                        )}
                        <span className="text-sm text-neutral-900">{item.stock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(item.status)}`}>
                        {item.status === 'active' ? 'In Stock' : 
                         item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/shop/products/${item.id}`} className="text-neutral-400 hover:text-neutral-500">
                          <FiEye className="h-5 w-5" />
                        </Link>
                        <Link to={`/dealer/inventory/edit/${item.id}`} className="text-primary-600 hover:text-primary-900">
                          <FiEdit2 className="h-5 w-5" />
                        </Link>
                        <button className="text-error-600 hover:text-error-900">
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-neutral-500">
                    No products found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {sortedInventory.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-neutral-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-neutral-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, sortedInventory.length)}
                  </span>{' '}
                  of <span className="font-medium">{sortedInventory.length}</span> results
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

export default InventoryManagement;
