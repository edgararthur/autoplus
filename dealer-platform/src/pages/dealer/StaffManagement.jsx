import React, { useState } from 'react';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiMail, 
  FiPhone, 
  FiCalendar,
  FiLock,
  FiUnlock,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import Avatar from '../../components/common/Avatar';

// Mock staff data
const mockStaff = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    role: 'Admin',
    department: 'Management',
    joinDate: '2021-03-15',
    status: 'active',
    lastActive: '2023-07-12T14:30:00'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    role: 'Inventory Manager',
    department: 'Inventory',
    joinDate: '2021-05-22',
    status: 'active',
    lastActive: '2023-07-12T10:15:00'
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'mbrown@example.com',
    phone: '(555) 456-7890',
    role: 'Sales Representative',
    department: 'Sales',
    joinDate: '2022-01-10',
    status: 'active',
    lastActive: '2023-07-11T16:45:00'
  },
  {
    id: 4,
    name: 'Lisa Williams',
    email: 'lwilliams@example.com',
    phone: '(555) 234-5678',
    role: 'Customer Support',
    department: 'Support',
    joinDate: '2022-03-05',
    status: 'active',
    lastActive: '2023-07-12T09:30:00'
  },
  {
    id: 5,
    name: 'Robert Davis',
    email: 'rdavis@example.com',
    phone: '(555) 876-5432',
    role: 'Shipping Coordinator',
    department: 'Logistics',
    joinDate: '2022-06-18',
    status: 'inactive',
    lastActive: '2023-06-30T11:20:00'
  },
  {
    id: 6,
    name: 'Jennifer Miller',
    email: 'jmiller@example.com',
    phone: '(555) 345-6789',
    role: 'Marketing Specialist',
    department: 'Marketing',
    joinDate: '2022-08-01',
    status: 'active',
    lastActive: '2023-07-11T13:45:00'
  },
  {
    id: 7,
    name: 'David Wilson',
    email: 'dwilson@example.com',
    phone: '(555) 567-8901',
    role: 'Accountant',
    department: 'Finance',
    joinDate: '2022-09-15',
    status: 'active',
    lastActive: '2023-07-10T15:30:00'
  },
  {
    id: 8,
    name: 'Emily Taylor',
    email: 'etaylor@example.com',
    phone: '(555) 678-9012',
    role: 'Inventory Clerk',
    department: 'Inventory',
    joinDate: '2023-01-05',
    status: 'active',
    lastActive: '2023-07-12T11:15:00'
  }
];

// Department options
const departments = [
  'All Departments',
  'Management',
  'Inventory',
  'Sales',
  'Support',
  'Logistics',
  'Marketing',
  'Finance'
];

// Role options
const roles = [
  'Admin',
  'Inventory Manager',
  'Sales Representative',
  'Customer Support',
  'Shipping Coordinator',
  'Marketing Specialist',
  'Accountant',
  'Inventory Clerk'
];

const StaffManagement = () => {
  const [staff, setStaff] = useState(mockStaff);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Inventory Clerk',
    department: 'Inventory',
    status: 'active'
  });
  
  const itemsPerPage = 6;
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format time
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle department filter
  const handleDepartmentFilter = (e) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle status filter
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Open add modal
  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Inventory Clerk',
      department: 'Inventory',
      status: 'active'
    });
    setShowAddModal(true);
  };
  
  // Open edit modal
  const openEditModal = (staffMember) => {
    setCurrentStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      role: staffMember.role,
      department: staffMember.department,
      status: staffMember.status
    });
    setShowEditModal(true);
  };
  
  // Handle add staff
  const handleAddStaff = (e) => {
    e.preventDefault();
    
    const newStaff = {
      id: staff.length + 1,
      ...formData,
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString()
    };
    
    setStaff([...staff, newStaff]);
    setShowAddModal(false);
  };
  
  // Handle edit staff
  const handleEditStaff = (e) => {
    e.preventDefault();
    
    const updatedStaff = staff.map(item => 
      item.id === currentStaff.id ? { ...item, ...formData } : item
    );
    
    setStaff(updatedStaff);
    setShowEditModal(false);
  };
  
  // Handle delete staff
  const handleDeleteStaff = (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter(item => item.id !== id));
    }
  };
  
  // Handle toggle status
  const handleToggleStatus = (id) => {
    const updatedStaff = staff.map(item => 
      item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item
    );
    
    setStaff(updatedStaff);
  };
  
  // Filter staff based on search, department, and status
  const filteredStaff = staff.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'All Departments' || item.department === selectedDepartment;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });
  
  // Paginate staff
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Staff Management</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage your team members, roles, and permissions.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiPlus className="mr-2 -ml-1 h-4 w-4" />
            Add Staff Member
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
              placeholder="Search by name, email, or role"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {/* Department filter */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={selectedDepartment}
              onChange={handleDepartmentFilter}
            >
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
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
              Active
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'inactive'
                  ? 'bg-neutral-100 text-neutral-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={() => handleStatusFilter('inactive')}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>
      
      {/* Staff grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentItems.length > 0 ? (
          currentItems.map((staffMember) => (
            <div key={staffMember.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-5">
                <div className="flex items-center">
                  <Avatar name={staffMember.name} size="large" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-neutral-900">{staffMember.name}</h3>
                    <p className="text-sm text-neutral-500">{staffMember.role}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-neutral-600">
                    <FiMail className="mr-2 h-4 w-4 text-neutral-400" />
                    <span>{staffMember.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <FiPhone className="mr-2 h-4 w-4 text-neutral-400" />
                    <span>{staffMember.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <FiCalendar className="mr-2 h-4 w-4 text-neutral-400" />
                    <span>Joined {formatDate(staffMember.joinDate)}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    staffMember.status === 'active' 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-neutral-100 text-neutral-800'
                  }`}>
                    {staffMember.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-neutral-500">
                    Last active: {formatTime(staffMember.lastActive)}
                  </span>
                </div>
              </div>
              <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-200 flex justify-between">
                <div>
                  <button
                    onClick={() => handleToggleStatus(staffMember.id)}
                    className={`text-sm font-medium flex items-center ${
                      staffMember.status === 'active'
                        ? 'text-error-600 hover:text-error-900'
                        : 'text-success-600 hover:text-success-900'
                    }`}
                  >
                    {staffMember.status === 'active' ? (
                      <>
                        <FiLock className="mr-1 h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <FiUnlock className="mr-1 h-4 w-4" />
                        Activate
                      </>
                    )}
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => openEditModal(staffMember)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(staffMember.id)}
                    className="text-error-600 hover:text-error-900"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 bg-white shadow rounded-lg p-6 text-center">
            <p className="text-neutral-500">No staff members found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredStaff.length > itemsPerPage && (
        <div className="flex items-center justify-center">
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
      )}
      
      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-neutral-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddStaff}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-neutral-900">
                        Add Staff Member
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>
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
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-neutral-700">
                            Role
                          </label>
                          <select
                            id="role"
                            name="role"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={formData.role}
                            onChange={handleInputChange}
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="department" className="block text-sm font-medium text-neutral-700">
                            Department
                          </label>
                          <select
                            id="department"
                            name="department"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={formData.department}
                            onChange={handleInputChange}
                          >
                            {departments.slice(1).map((department) => (
                              <option key={department} value={department}>
                                {department}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-neutral-700">
                            Status
                          </label>
                          <select
                            id="status"
                            name="status"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={formData.status}
                            onChange={handleInputChange}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Staff Member
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Staff Modal */}
      {showEditModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-neutral-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleEditStaff}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-neutral-900">
                        Edit Staff Member
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="edit-name" className="block text-sm font-medium text-neutral-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="edit-name"
                            required
                            className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-email" className="block text-sm font-medium text-neutral-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="edit-email"
                            required
                            className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-phone" className="block text-sm font-medium text-neutral-700">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            name="phone"
                            id="edit-phone"
                            className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-role" className="block text-sm font-medium text-neutral-700">
                            Role
                          </label>
                          <select
                            id="edit-role"
                            name="role"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={formData.role}
                            onChange={handleInputChange}
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="edit-department" className="block text-sm font-medium text-neutral-700">
                            Department
                          </label>
                          <select
                            id="edit-department"
                            name="department"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={formData.department}
                            onChange={handleInputChange}
                          >
                            {departments.slice(1).map((department) => (
                              <option key={department} value={department}>
                                {department}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="edit-status" className="block text-sm font-medium text-neutral-700">
                            Status
                          </label>
                          <select
                            id="edit-status"
                            name="status"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={formData.status}
                            onChange={handleInputChange}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
