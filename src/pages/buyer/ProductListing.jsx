import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  FiFilter, 
  FiX, 
  FiChevronDown, 
  FiGrid, 
  FiList,
  FiStar,
  FiShoppingCart,
  FiHeart
} from 'react-icons/fi';

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: 'Premium Brake Pads',
    category: 'Brakes',
    price: 49.99,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80',
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    brand: 'Brembo',
    tags: ['brake', 'performance', 'safety']
  },
  {
    id: 2,
    name: 'High-Performance Oil Filter',
    category: 'Engine',
    price: 12.99,
    salePrice: 9.99,
    image: 'https://images.unsplash.com/photo-1516733968668-dbdce39c4651?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80',
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    brand: 'K&N',
    tags: ['engine', 'filter', 'maintenance']
  },
  {
    id: 3,
    name: 'LED Headlight Kit',
    category: 'Lighting',
    price: 129.99,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80',
    rating: 4.9,
    reviewCount: 207,
    inStock: true,
    brand: 'Philips',
    tags: ['lighting', 'LED', 'visibility']
  },
  {
    id: 4,
    name: 'All-Weather Floor Mats',
    category: 'Interior',
    price: 79.99,
    salePrice: 59.99,
    image: 'https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80',
    rating: 4.7,
    reviewCount: 132,
    inStock: true,
    brand: 'WeatherTech',
    tags: ['interior', 'protection', 'accessories']
  },
  {
    id: 5,
    name: 'Performance Exhaust System',
    category: 'Exhaust',
    price: 349.99,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1598451668273-e7c382831310?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80',
    rating: 4.6,
    reviewCount: 78,
    inStock: false,
    brand: 'Borla',
    tags: ['exhaust', 'performance', 'sound']
  },
  {
    id: 6,
    name: 'Wheel Spacers',
    category: 'Wheels',
    price: 45.99,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1626668893615-1129da523d53?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80',
    rating: 4.3,
    reviewCount: 42,
    inStock: true,
    brand: 'H&R',
    tags: ['wheels', 'fitment', 'performance']
  }
];

// Filter categories
const filterCategories = [
  {
    name: 'Category',
    options: [
      { value: 'brakes', label: 'Brakes & Suspension', count: 329 },
      { value: 'engine', label: 'Engine Parts', count: 487 },
      { value: 'lighting', label: 'Lighting & Electrical', count: 254 },
      { value: 'interior', label: 'Interior Accessories', count: 198 },
      { value: 'exterior', label: 'Exterior Accessories', count: 176 },
      { value: 'tools', label: 'Tools & Equipment', count: 132 }
    ]
  },
  {
    name: 'Brand',
    options: [
      { value: 'brembo', label: 'Brembo', count: 43 },
      { value: 'kn', label: 'K&N', count: 98 },
      { value: 'philips', label: 'Philips', count: 76 },
      { value: 'weathertech', label: 'WeatherTech', count: 54 },
      { value: 'borla', label: 'Borla', count: 32 },
      { value: 'hr', label: 'H&R', count: 28 }
    ]
  },
  {
    name: 'Price',
    options: [
      { value: 'under25', label: 'Under $25', count: 183 },
      { value: '25to50', label: '$25 to $50', count: 226 },
      { value: '50to100', label: '$50 to $100', count: 194 },
      { value: '100to250', label: '$100 to $250', count: 148 },
      { value: 'over250', label: 'Over $250', count: 96 }
    ]
  },
  {
    name: 'Rating',
    options: [
      { value: '4stars', label: '4 stars & up', count: 565 },
      { value: '3stars', label: '3 stars & up', count: 728 },
      { value: '2stars', label: '2 stars & up', count: 812 },
      { value: '1star', label: '1 star & up', count: 847 }
    ]
  }
];

// Product rating component
const ProductRating = ({ rating, reviewCount }) => {
  return (
    <div className="flex items-center mt-1">
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-neutral-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-neutral-500 text-sm ml-2">{rating} ({reviewCount} reviews)</span>
    </div>
  );
};

const ProductListing = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('featured');
  const [view, setView] = useState('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Parse URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    const search = searchParams.get('q');
    
    // Simulate API fetch
    setLoading(true);
    
    // In a real app, we would fetch products based on these filters
    // For now, just simulate a delay and use our mock data
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
    
  }, [location.search]);
  
  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') {
      const aPrice = a.salePrice || a.price;
      const bPrice = b.salePrice || b.price;
      return aPrice - bPrice;
    } else if (sortBy === 'price-desc') {
      const aPrice = a.salePrice || a.price;
      const bPrice = b.salePrice || b.price;
      return bPrice - aPrice;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else {
      // Default to 'featured'
      return 0;
    }
  });
  
  // Price display helper
  const renderPrice = (price, salePrice) => {
    if (salePrice) {
      return (
        <div className="flex items-center">
          <span className="font-bold text-lg text-neutral-900">${salePrice.toFixed(2)}</span>
          <span className="ml-2 text-sm font-medium text-neutral-500 line-through">${price.toFixed(2)}</span>
        </div>
      );
    } else {
      return <span className="font-bold text-lg text-neutral-900">${price.toFixed(2)}</span>;
    }
  };
  
  // Filter component
  const FilterGroup = ({ category }) => {
    const [expanded, setExpanded] = useState(true);
    
    return (
      <div className="border-b border-neutral-200 py-4">
        <button
          className="flex w-full items-center justify-between text-sm font-medium text-neutral-900"
          onClick={() => setExpanded(!expanded)}
        >
          <span>{category.name}</span>
          <span>
            <FiChevronDown
              className={`h-5 w-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </span>
        </button>
        
        {expanded && (
          <div className="mt-4 space-y-2">
            {category.options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`filter-${category.name.toLowerCase()}-${option.value}`}
                  name={`filter-${category.name.toLowerCase()}`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <label
                  htmlFor={`filter-${category.name.toLowerCase()}-${option.value}`}
                  className="ml-3 text-sm text-neutral-600"
                >
                  {option.label} <span className="text-neutral-500">({option.count})</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Auto Parts</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Find the parts you need from our extensive catalog of quality auto parts
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-4 sticky top-20">
            <h2 className="text-lg font-medium text-neutral-900">Filters</h2>
            
            <div className="space-y-1">
              {filterCategories.map((category) => (
                <FilterGroup key={category.name} category={category} />
              ))}
            </div>
            
            <div className="pt-4 border-t border-neutral-200">
              <button
                className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => {
                  // Apply filters logic would go here
                }}
              >
                Apply Filters
              </button>
              <button
                className="w-full mt-2 px-4 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-300 rounded-md hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => {
                  // Clear filters logic would go here
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Products container */}
        <div className="lg:col-span-3">
          {/* Sorting and view options */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center">
              <button
                className="lg:hidden flex items-center px-4 py-2 text-sm text-neutral-700 bg-white border border-neutral-300 rounded-md shadow-sm hover:bg-neutral-50 focus:outline-none"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <FiFilter className="mr-2 h-4 w-4" />
                Filters
              </button>
              <span className="ml-4 text-sm text-neutral-500 hidden sm:inline">
                Showing {products.length} results
              </span>
            </div>
            
            <div className="flex items-center w-full sm:w-auto">
              <div className="w-full sm:w-auto">
                <label htmlFor="sortOrder" className="sr-only">
                  Sort by
                </label>
                <select
                  id="sortOrder"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full sm:w-auto rounded-md border-neutral-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              
              <div className="hidden sm:flex ml-4 border border-neutral-200 rounded-lg">
                <button
                  className={`p-2 ${view === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:text-neutral-900'}`}
                  onClick={() => setView('grid')}
                >
                  <FiGrid className="h-5 w-5" />
                </button>
                <button
                  className={`p-2 ${view === 'list' ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:text-neutral-900'}`}
                  onClick={() => setView('list')}
                >
                  <FiList className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Loading state */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em]"></div>
              <p className="mt-4 text-neutral-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-neutral-900">No products found</h3>
              <p className="mt-2 text-neutral-500">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className={view === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-6"
            }>
              {sortedProducts.map(product => (
                <div
                  key={product.id}
                  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
                    view === 'list' ? 'flex flex-col sm:flex-row' : ''
                  }`}
                >
                  <div className={view === 'list' ? 'sm:w-1/3' : ''}>
                    <Link to={`/shop/products/${product.id}`}>
                      <div className={`${view === 'grid' ? 'h-48' : 'h-48 sm:h-full'} overflow-hidden`}>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                    </Link>
                  </div>
                  
                  <div className={`p-4 ${view === 'list' ? 'sm:w-2/3' : ''}`}>
                    <div className="text-xs text-primary-600 font-medium uppercase tracking-wide">
                      {product.category}
                    </div>
                    
                    <Link to={`/shop/products/${product.id}`}>
                      <h3 className="mt-1 text-lg font-medium text-neutral-900 hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <ProductRating rating={product.rating} reviewCount={product.reviewCount} />
                    
                    <div className="mt-2 flex justify-between items-center">
                      {renderPrice(product.price, product.salePrice)}
                      
                      <div className="flex space-x-2">
                        <button className="p-2 rounded-full text-neutral-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                          <FiHeart className="h-5 w-5" />
                        </button>
                        <button 
                          disabled={!product.inStock}
                          className={`p-2 rounded-full ${
                            product.inStock 
                              ? 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50' 
                              : 'text-neutral-300 cursor-not-allowed'
                          } transition-colors`}
                        >
                          <FiShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    {view === 'list' && (
                      <div className="mt-4">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.inStock ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                          <span className="ml-2 text-xs text-neutral-500">Brand: {product.brand}</span>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <button
                            disabled={!product.inStock}
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
                              product.inStock
                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                            }`}
                          >
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                          <button className="px-4 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-300 rounded-md hover:bg-primary-50">
                            View Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile filters sidebar */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileFiltersOpen(false)}></div>
          
          <div className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col h-full">
            <div className="px-4 py-5 flex items-center justify-between">
              <h2 className="text-lg font-medium text-neutral-900">Filters</h2>
              <button
                className="h-10 w-10 flex items-center justify-center rounded-md bg-white p-2 text-neutral-400 hover:text-neutral-500"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="px-4 flex-1 overflow-y-auto">
              {filterCategories.map((category) => (
                <FilterGroup key={category.name} category={category} />
              ))}
            </div>
            
            <div className="border-t border-neutral-200 px-4 py-6 space-y-3">
              <button
                className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => {
                  // Apply filters
                  setMobileFiltersOpen(false);
                }}
              >
                Apply Filters
              </button>
              <button
                className="w-full px-4 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-300 rounded-md hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => {
                  // Clear filters
                  setMobileFiltersOpen(false);
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListing; 