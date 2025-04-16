import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTag, FiShield, FiTruck, FiSearch } from 'react-icons/fi';

// Mock data for featured products
const featuredProducts = [
  {
    id: 1,
    name: 'Premium Brake Pads',
    category: 'Brakes',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80',
    rating: 4.8,
    reviewCount: 156
  },
  {
    id: 2,
    name: 'High-Performance Oil Filter',
    category: 'Engine',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1516733968668-dbdce39c4651?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80',
    rating: 4.5,
    reviewCount: 89
  },
  {
    id: 3,
    name: 'LED Headlight Kit',
    category: 'Lighting',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80',
    rating: 4.9,
    reviewCount: 207
  },
  {
    id: 4,
    name: 'All-Weather Floor Mats',
    category: 'Interior',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80',
    rating: 4.7,
    reviewCount: 132
  }
];

// Mock data for product categories
const categories = [
  { 
    id: 1, 
    name: 'Engine Parts', 
    count: 487, 
    icon: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80' 
  },
  { 
    id: 2, 
    name: 'Brakes & Suspension', 
    count: 329, 
    icon: 'https://images.unsplash.com/photo-1518987048-93e29699e79a?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80' 
  },
  { 
    id: 3, 
    name: 'Lighting & Electrical', 
    count: 254, 
    icon: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80' 
  },
  { 
    id: 4, 
    name: 'Interior Accessories', 
    count: 198, 
    icon: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80' 
  },
  { 
    id: 5, 
    name: 'Exterior Accessories', 
    count: 176, 
    icon: 'https://images.unsplash.com/photo-1534093607318-f025413f49cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80' 
  },
  { 
    id: 6, 
    name: 'Tools & Equipment', 
    count: 132, 
    icon: 'https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80' 
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

const BuyerHome = () => {
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-primary-700 to-primary-900 rounded-xl overflow-hidden">
        <div className="absolute inset-0 mix-blend-multiply opacity-20">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Car parts"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative py-16 px-8 sm:px-16 flex flex-col items-start">
          <h1 className="text-white text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find the right parts <br className="hidden sm:inline" />
            for your vehicle
          </h1>
          <p className="mt-4 text-lg text-primary-100 max-w-xl">
            Shop thousands of parts from top dealers with our price-match guarantee and fast shipping.
          </p>
          
          <div className="mt-8 w-full max-w-2xl">
            <div className="bg-white p-2 rounded-lg shadow-lg flex">
              <input
                type="text"
                placeholder="Search parts by name, brand, or part number..."
                className="flex-1 px-4 py-2 text-neutral-900 focus:outline-none"
              />
              <button className="bg-primary-600 text-white px-6 py-2 rounded-md flex items-center justify-center hover:bg-primary-700 transition-colors">
                <FiSearch className="w-5 h-5" />
                <span className="ml-2 hidden sm:inline">Search</span>
              </button>
            </div>
            <div className="mt-3 flex flex-wrap text-sm text-white gap-4">
              <span>Popular: </span>
              <Link to="/shop/products?q=brake+pads" className="hover:underline">Brake Pads</Link>
              <Link to="/shop/products?q=oil+filter" className="hover:underline">Oil Filters</Link>
              <Link to="/shop/products?q=spark+plugs" className="hover:underline">Spark Plugs</Link>
              <Link to="/shop/products?q=wiper+blades" className="hover:underline">Wiper Blades</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Shop by Category</h2>
          <Link to="/shop/products" className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium">
            View all categories
            <FiArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(category => (
            <Link 
              key={category.id}
              to={`/shop/products?category=${encodeURIComponent(category.name)}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
                <img 
                  src={category.icon} 
                  alt={category.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="font-medium text-neutral-900">{category.name}</h3>
              <p className="text-sm text-neutral-500 mt-1">{category.count} products</p>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Featured products */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Featured Products</h2>
          <Link to="/shop/products?featured=true" className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium">
            View all
            <FiArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <Link 
              key={product.id}
              to={`/shop/products/${product.id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div className="p-4">
                <div className="text-xs text-primary-600 font-medium uppercase tracking-wide">
                  {product.category}
                </div>
                <h3 className="mt-1 text-lg font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
                <ProductRating rating={product.rating} reviewCount={product.reviewCount} />
                <div className="mt-2 font-bold text-lg text-neutral-900">
                  ${product.price.toFixed(2)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Benefits section */}
      <div className="bg-neutral-50 rounded-xl py-10 px-8">
        <h2 className="text-2xl font-bold text-neutral-900 text-center mb-10">Why Shop with Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 mb-4">
              <FiTag className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Price Match Guarantee</h3>
            <p className="text-neutral-600">
              Found a better price elsewhere? We'll match it, ensuring you always get the best deal.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 mb-4">
              <FiTruck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Fast & Free Shipping</h3>
            <p className="text-neutral-600">
              Free shipping on orders over $99, and quick delivery to get you back on the road.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 mb-4">
              <FiShield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Quality Guarantee</h3>
            <p className="text-neutral-600">
              All products meet or exceed OEM specifications with a minimum 12-month warranty.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA banner */}
      <div className="bg-secondary-600 rounded-xl overflow-hidden">
        <div className="px-8 py-12 sm:px-12 lg:px-16 md:py-16 md:flex md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Join our VIP Program</h3>
            <p className="mt-2 max-w-3xl text-secondary-200">
              Get exclusive deals, early access to new products, and earn points on every purchase.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex-shrink-0">
            <Link
              to="/shop/account/vip"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-secondary-600 bg-white hover:bg-secondary-50"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerHome; 