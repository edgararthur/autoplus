import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiUser, 
  FiSearch, 
  FiMenu, 
  FiX, 
  FiChevronDown,
  FiLogOut,
  FiSettings,
  FiPackage,
  FiBookmark,
  FiBox,
  FiPhone,
  FiMail,
  FiMap,
  FiHelpCircle
} from 'react-icons/fi';

// Note: In a real implementation, these would come from the cart context/service
const CART_ITEMS_COUNT = 5;
const WISHLIST_ITEMS_COUNT = 3;

const StoreHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  // Mock categories - These would come from an API in a real implementation
  const categories = [
    {
      name: 'Engine Parts',
      subcategories: ['Oil Filters', 'Air Filters', 'Spark Plugs', 'Fuel Pumps']
    },
    {
      name: 'Brakes & Suspension',
      subcategories: ['Brake Pads', 'Shock Absorbers', 'Coil Springs', 'Struts']
    },
    {
      name: 'Lighting & Electrical',
      subcategories: ['Headlights', 'Taillights', 'Batteries', 'Alternators']
    },
    {
      name: 'Interior Accessories',
      subcategories: ['Floor Mats', 'Seat Covers', 'Steering Wheels', 'Dashboard Accessories']
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar with contact info and account links */}
      <div className="bg-neutral-800 text-white px-4 py-1 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="tel:+233509999999" className="hover:text-jumia-orange">
              <FiPhone className="inline mr-1" size={12} /> +233 50 999 9999
            </a>
            <a href="mailto:support@autoplus.com" className="hidden sm:inline-flex items-center hover:text-jumia-orange">
              <FiMail className="inline mr-1" size={12} /> support@autoplus.com
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/track-order" className="hover:text-jumia-orange flex items-center">
              <FiPackage className="inline mr-1" size={12} /> Track Order
            </Link>
            <Link to="/dealers" className="hidden sm:inline-flex items-center hover:text-jumia-orange">
              <FiMap className="inline mr-1" size={12} /> Find Dealers
            </Link>
            <Link to="/help" className="hidden sm:inline-flex items-center hover:text-jumia-orange">
              <FiHelpCircle className="inline mr-1" size={12} /> Help
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main header with logo, search and cart */}
      <div className="bg-jumia-orange px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center">
          {/* Mobile menu button */}
          <button
            className="lg:hidden mr-3 text-white hover:text-white/80"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
          {/* Logo */}
          <div className="flex-shrink-0 mr-8">
            <Link to="/" className="flex items-center">
              <span className="text-3xl font-bold text-white">AutoPlus</span>
            </Link>
          </div>
          
          {/* Search bar - Takes most of the space */}
          <div className="flex-1 max-w-3xl">
            <form onSubmit={handleSearchSubmit} className="flex">
              <div className="relative w-full">
                <input
                  type="text"
                  className="block w-full py-2 pl-4 pr-10 text-sm rounded-l-sm border-0 focus:outline-none focus:ring-white"
                  placeholder="Search products, brands and categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 px-3 bg-neutral-800 text-white rounded-r-sm hover:bg-neutral-700 transition-colors"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </form>
          </div>
          
          {/* User actions */}
          <div className="flex items-center ml-4 space-x-4">
            {/* Account dropdown */}
            <div className="relative">
              <button
                className="flex items-center text-white"
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                aria-expanded={isAccountMenuOpen}
              >
                <FiUser size={20} className="mr-1" />
                <span className="hidden md:inline text-sm font-medium">
                  {user ? 'Account' : 'Sign In'}
                </span>
                <FiChevronDown size={16} className="ml-1" />
              </button>
              
              {/* Account dropdown menu */}
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-sm shadow-lg z-50">
                  {user ? (
                    <div>
                      <div className="p-4 border-b border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900">Hello, {user.profile?.name || user.email}</p>
                        <p className="text-xs text-neutral-500">{user.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/account"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <FiUser className="mr-3 text-jumia-orange" size={16} />
                          My Account
                        </Link>
                        
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <FiPackage className="mr-3 text-jumia-orange" size={16} />
                          My Orders
                        </Link>
                        
                        <Link
                          to="/wishlist"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <FiHeart className="mr-3 text-jumia-orange" size={16} />
                          Saved Items
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <FiLogOut className="mr-3 text-jumia-orange" size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="p-4 border-b border-neutral-200">
                        <div className="flex space-x-2">
                          <Link 
                            to="/login" 
                            className="flex-1 py-2 px-3 bg-jumia-orange text-white text-sm text-center font-medium rounded-sm"
                          >
                            Sign In
                          </Link>
                          <Link 
                            to="/register" 
                            className="flex-1 py-2 px-3 border border-jumia-orange text-jumia-orange text-sm text-center font-medium rounded-sm"
                          >
                            Register
                          </Link>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/account"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <FiUser className="mr-3 text-jumia-orange" size={16} />
                          My Account
                        </Link>
                        
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <FiPackage className="mr-3 text-jumia-orange" size={16} />
                          Orders
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Saved Items / Wishlist */}
            <Link to="/wishlist" className="hidden sm:flex relative items-center text-white">
              <FiHeart size={20} className="mr-1" />
              <span className="hidden md:inline text-sm font-medium">Saved</span>
              {WISHLIST_ITEMS_COUNT > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-jumia-orange text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {WISHLIST_ITEMS_COUNT}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="flex relative items-center text-white">
              <FiShoppingCart size={20} className="mr-1" />
              <span className="hidden md:inline text-sm font-medium">Cart</span>
              {CART_ITEMS_COUNT > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-jumia-orange text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {CART_ITEMS_COUNT}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Categories navigation bar */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex">
            {/* All Categories dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center px-4 py-3 font-medium text-neutral-800 hover:text-jumia-orange"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                aria-expanded={isCategoriesOpen}
              >
                <FiMenu className="mr-2" size={18} />
                <span>All Categories</span>
                <FiChevronDown className="ml-1" size={16} />
              </button>
              
              {/* Categories dropdown */}
              {isCategoriesOpen && (
                <div className="absolute left-0 mt-0 w-64 bg-white shadow-lg z-40">
                  {categories.map((category) => (
                    <div key={category.name} className="group/category relative hover:bg-neutral-100">
                      <Link
                        to={`/products?category=${encodeURIComponent(category.name)}`}
                        className="block px-4 py-3 text-sm text-neutral-700 hover:text-jumia-orange flex justify-between items-center"
                      >
                        {category.name}
                        <FiChevronDown size={14} />
                      </Link>
                      
                      {/* Subcategories */}
                      <div className="hidden group-hover/category:block absolute left-full top-0 w-64 bg-white shadow-lg z-40">
                        <div className="p-4">
                          <h3 className="font-medium text-jumia-orange text-sm mb-2">{category.name}</h3>
                          <ul>
                            {category.subcategories.map((subcategory) => (
                              <li key={subcategory}>
                                <Link
                                  to={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory)}`}
                                  className="block py-1 text-sm text-neutral-700 hover:text-jumia-orange"
                                >
                                  {subcategory}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <Link 
                            to={`/products?category=${encodeURIComponent(category.name)}`}
                            className="mt-3 inline-block text-xs font-medium text-jumia-orange hover:underline"
                          >
                            See All {category.name}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Main navigation links */}
            <div className="flex overflow-x-auto whitespace-nowrap hide-scrollbar">
              <Link to="/" className="px-4 py-3 font-medium text-neutral-800 hover:text-jumia-orange">
                Home
              </Link>
              <Link to="/deals" className="px-4 py-3 font-medium text-neutral-800 hover:text-jumia-orange">
                Flash Deals
              </Link>
              <Link to="/products" className="px-4 py-3 font-medium text-neutral-800 hover:text-jumia-orange">
                All Products
              </Link>
              <Link to="/new-arrivals" className="px-4 py-3 font-medium text-neutral-800 hover:text-jumia-orange">
                New Arrivals
              </Link>
              <Link to="/brands" className="px-4 py-3 font-medium text-neutral-800 hover:text-jumia-orange">
                Brands
              </Link>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-md" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 hover:text-jumia-orange"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {categories.map((category) => (
              <div key={category.name}>
                <Link
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="block px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 hover:text-jumia-orange"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
                <div className="pl-6 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory}
                      to={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory)}`}
                      className="block px-3 py-1 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-jumia-orange"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {subcategory}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            <Link 
              to="/deals" 
              className="block px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 hover:text-jumia-orange"
              onClick={() => setIsMenuOpen(false)}
            >
              Flash Deals
            </Link>
            
            <Link 
              to="/brands" 
              className="block px-3 py-2 text-base font-medium text-neutral-800 hover:bg-neutral-100 hover:text-jumia-orange"
              onClick={() => setIsMenuOpen(false)}
            >
              Brands
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default StoreHeader;