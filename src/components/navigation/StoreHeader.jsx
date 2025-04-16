import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../common/Logo';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiHeart, 
  FiMenu, 
  FiX, 
  FiChevronDown 
} from 'react-icons/fi';

const StoreHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const categories = [
    { name: 'Engine Parts', path: '/shop/products?category=engine' },
    { name: 'Brakes', path: '/shop/products?category=brakes' },
    { name: 'Suspension', path: '/shop/products?category=suspension' },
    { name: 'Electrical', path: '/shop/products?category=electrical' },
    { name: 'Exterior', path: '/shop/products?category=exterior' },
    { name: 'Interior', path: '/shop/products?category=interior' },
    { name: 'Tools', path: '/shop/products?category=tools' },
    { name: 'Accessories', path: '/shop/products?category=accessories' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/shop/products?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      {/* Top bar */}
      <div className="bg-primary-700 text-white px-4 py-1 text-center text-xs sm:text-sm">
        Free shipping on orders over $99 | Same-day shipping on orders before 2PM
      </div>
      
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and toggle */}
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden mr-2 text-neutral-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <Link to="/shop" className="flex">
              <Logo size="medium" />
            </Link>
          </div>
          
          {/* Search */}
          <div className="hidden md:block flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex">
                <input
                  type="text"
                  className="block w-full rounded-l-md border-neutral-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm h-10"
                  placeholder="Search parts by name, brand, or part number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 rounded-r-md border border-transparent bg-primary-600 text-white hover:bg-primary-700"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </form>
          </div>
          
          {/* Navigation actions */}
          <div className="flex items-center space-x-4">
            <Link to="/shop/cart" className="text-neutral-700 hover:text-primary-600 relative">
              <FiShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Link>
            
            <Link to="/shop/wishlist" className="hidden sm:block text-neutral-700 hover:text-primary-600">
              <FiHeart size={24} />
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="flex items-center text-neutral-700 hover:text-primary-600"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <span className="hidden sm:block mr-2 text-sm font-medium">
                    {currentUser?.name?.split(' ')[0]}
                  </span>
                  <FiUser size={24} />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <Link
                      to="/shop/account"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/shop/orders"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Order History
                    </Link>
                    <button
                      className="w-full text-left block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth/login" className="text-neutral-700 hover:text-primary-600 flex items-center">
                <span className="hidden sm:block mr-2 text-sm font-medium">Login</span>
                <FiUser size={24} />
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex">
              <input
                type="text"
                className="block w-full rounded-l-md border-neutral-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm h-10"
                placeholder="Search parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 rounded-r-md border border-transparent bg-primary-600 text-white hover:bg-primary-700"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Category navigation */}
      <nav className="hidden lg:block bg-neutral-50 border-t border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <div className="relative">
              <button 
                className="flex items-center py-3 px-4 font-medium hover:text-primary-600"
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
              >
                All Categories
                <FiChevronDown className="ml-1" />
              </button>
              
              {categoryMenuOpen && (
                <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.path}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        onClick={() => setCategoryMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/shop/products?featured=true" className="py-3 px-3 font-medium hover:text-primary-600">
              Featured Products
            </Link>
            <Link to="/shop/products?deals=true" className="py-3 px-3 font-medium hover:text-primary-600">
              Deals & Promotions
            </Link>
            <Link to="/shop/products?new=true" className="py-3 px-3 font-medium hover:text-primary-600">
              New Arrivals
            </Link>
            <Link to="/shop/brands" className="py-3 px-3 font-medium hover:text-primary-600">
              Brands
            </Link>
            <Link to="/shop/help" className="py-3 px-3 font-medium hover:text-primary-600">
              Help Center
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-neutral-50 border-b border-neutral-200">
          <div className="font-medium px-3 py-2 text-neutral-900">Categories</div>
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              {category.name}
            </Link>
          ))}
          <div className="border-t border-neutral-200 pt-2">
            <Link 
              to="/shop/products?featured=true" 
              className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Featured Products
            </Link>
            <Link 
              to="/shop/products?deals=true" 
              className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Deals & Promotions
            </Link>
            <Link 
              to="/shop/brands" 
              className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Brands
            </Link>
            <Link 
              to="/shop/help" 
              className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StoreHeader;
