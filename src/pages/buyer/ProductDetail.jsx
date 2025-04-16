import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiHeart, 
  FiShare2, 
  FiTruck, 
  FiShield, 
  FiStar,
  FiArrowLeft,
  FiPlus,
  FiMinus,
  FiChevronLeft,
  FiChevronRight,
  FiCheck
} from 'react-icons/fi';

// Mock product data
const mockProduct = {
  id: 3,
  name: 'LED Headlight Kit',
  category: 'Lighting',
  description: 'Upgrade your vehicle with this premium LED headlight conversion kit. Features advanced chip technology for superior brightness, perfect beam pattern, and longer lifespan than standard halogen bulbs. Easy plug-and-play installation with adjustable beam alignment.',
  price: 129.99,
  salePrice: null,
  images: [
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1591186479467-842bc797ccd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1534256958597-7fe685cbd745?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80'
  ],
  rating: 4.9,
  reviewCount: 207,
  inStock: true,
  brand: 'Philips',
  sku: 'LED-P-9006',
  specs: [
    { name: 'Type', value: 'LED Conversion Kit' },
    { name: 'Color Temperature', value: '6000K Crystal White' },
    { name: 'Lumens', value: '12,000 per pair' },
    { name: 'Wattage', value: '30W per bulb' },
    { name: 'Lifespan', value: '30,000+ hours' },
    { name: 'Compatibility', value: 'H1, H7, H11, 9005, 9006, 9012' },
    { name: 'Warranty', value: '2 years' }
  ],
  features: [
    'Advanced LED chip technology for superior brightness',
    'Perfect beam pattern with minimal glare',
    'IP68 waterproof rating',
    'Built-in cooling fan and heat sink',
    'Easy plug-and-play installation',
    'CANbus compatible - no error codes',
    'Over 30,000 hours of operation'
  ],
  compatibleVehicles: [
    { make: 'Toyota', models: ['Camry (2012-2021)', 'Corolla (2014-2021)', 'RAV4 (2013-2020)'] },
    { make: 'Honda', models: ['Accord (2013-2021)', 'Civic (2016-2021)', 'CR-V (2012-2021)'] },
    { make: 'Ford', models: ['F-150 (2015-2021)', 'Focus (2012-2018)', 'Escape (2013-2019)'] },
    { make: 'Chevrolet', models: ['Silverado (2014-2021)', 'Malibu (2016-2021)', 'Equinox (2018-2021)'] }
  ],
  reviews: [
    {
      id: 1,
      user: 'Michael R.',
      rating: 5,
      date: '2023-08-15',
      title: 'Excellent upgrade from stock lighting',
      content: 'These LED headlights made a huge difference from the stock halogen bulbs. Installation was straightforward and took about 30 minutes total. The light output is amazing - I can see so much better at night now, and they look great too with the white color temperature. Highly recommended upgrade!',
      verified: true
    },
    {
      id: 2,
      user: 'Sarah T.',
      rating: 5,
      date: '2023-07-28',
      title: 'Perfect fit for my Honda',
      content: 'These fit perfectly in my 2018 Honda Accord. The difference in visibility is night and day (literally). Installation was easy with no error codes. Very happy with this purchase.',
      verified: true
    },
    {
      id: 3,
      user: 'David K.',
      rating: 4,
      date: '2023-07-10',
      title: 'Great lights but installation was tricky',
      content: 'The lights themselves are excellent. The beam pattern is clean and the brightness is excellent. Only giving 4 stars because the installation was a bit more complex than advertised for my particular vehicle. Had to do some modifications to make them fit properly. End result is great though.',
      verified: true
    },
    {
      id: 4,
      user: 'Jennifer L.',
      rating: 5,
      date: '2023-06-22',
      title: 'Huge improvement over stock',
      content: 'I can\'t believe I waited so long to upgrade my headlights. These are so much brighter and the white light looks modern and clean. Easy to install and no flickering issues.',
      verified: true
    }
  ],
  relatedProducts: [
    { id: 7, name: 'LED Fog Light Kit', price: 79.99, image: 'https://images.unsplash.com/photo-1549399542-7e8f2e928464?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80' },
    { id: 8, name: 'Headlight Restoration Kit', price: 24.99, image: 'https://images.unsplash.com/photo-1596546113396-5a5c75132cfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80' },
    { id: 9, name: 'LED Interior Light Kit', price: 49.99, image: 'https://images.unsplash.com/photo-1601027847352-17d08ab66f64?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80' },
    { id: 10, name: 'LED Turn Signal Bulbs', price: 34.99, image: 'https://images.unsplash.com/photo-1555353540-64580b51c258?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80' }
  ]
};

// Star rating component
const StarRating = ({ rating, size = 'md' }) => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  return (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <svg 
          key={i} 
          className={`${sizes[size]} ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-neutral-300'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch the product
    setLoading(true);
    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 500);
  }, [productId]);
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em]"></div>
        <p className="mt-4 text-neutral-500">Loading product details...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-neutral-900">Product not found</h3>
        <p className="mt-2 text-neutral-500">The product you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/shop/products" 
          className="mt-6 inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to all products
        </Link>
      </div>
    );
  }
  
  const handleQuantityChange = (value) => {
    const newQty = quantity + value;
    if (newQty >= 1 && newQty <= 10) {
      setQuantity(newQty);
    }
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };
  
  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };
  
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/shop" className="text-neutral-500 hover:text-neutral-700">Home</Link>
          </li>
          <li className="text-neutral-500">/</li>
          <li>
            <Link to="/shop/products" className="text-neutral-500 hover:text-neutral-700">Products</Link>
          </li>
          <li className="text-neutral-500">/</li>
          <li>
            <Link 
              to={`/shop/products?category=${encodeURIComponent(product.category)}`}
              className="text-neutral-500 hover:text-neutral-700"
            >
              {product.category}
            </Link>
          </li>
          <li className="text-neutral-500">/</li>
          <li className="text-neutral-900 font-medium truncate max-w-xs">{product.name}</li>
        </ol>
      </nav>
      
      {/* Product Overview */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Product Images */}
          <div className="relative">
            {/* Main Image */}
            <div className="aspect-w-4 aspect-h-3 bg-neutral-100">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
              
              {/* Navigation arrows */}
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-md text-neutral-700 hover:text-neutral-900 focus:outline-none"
                onClick={handlePrevImage}
              >
                <FiChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-md text-neutral-700 hover:text-neutral-900 focus:outline-none"
                onClick={handleNextImage}
              >
                <FiChevronRight className="h-6 w-6" />
              </button>
            </div>
            
            {/* Thumbnails */}
            <div className="flex mt-4 space-x-4 px-4 pb-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-primary-500' : 'border-transparent'
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>
              
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <StarRating rating={product.rating} />
                  <span className="ml-2 text-sm text-neutral-500">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-sm text-neutral-500">SKU: {product.sku}</span>
              </div>
            </div>
            
            <div className="border-t border-b py-4 border-neutral-200">
              <div className="flex items-center">
                {product.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-neutral-900">${product.salePrice.toFixed(2)}</span>
                    <span className="ml-2 text-xl text-neutral-500 line-through">${product.price.toFixed(2)}</span>
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-error-100 text-error-800 rounded-md">
                      Save ${(product.price - product.salePrice).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-neutral-900">${product.price.toFixed(2)}</span>
                )}
              </div>
              
              <div className="mt-2">
                <span className={`text-sm font-medium ${product.inStock ? 'text-success-600' : 'text-error-600'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
            
            {/* Quantity selector */}
            <div className="flex items-center">
              <span className="text-sm font-medium text-neutral-700 mr-4">Quantity:</span>
              <div className="flex items-center border border-neutral-300 rounded-md">
                <button
                  type="button"
                  className="p-2 text-neutral-600 hover:text-neutral-900 focus:outline-none"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <FiMinus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-neutral-900">{quantity}</span>
                <button
                  type="button"
                  className="p-2 text-neutral-600 hover:text-neutral-900 focus:outline-none"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  <FiPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                className={`px-6 py-3 font-medium rounded-md flex items-center justify-center ${
                  product.inStock
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                }`}
                disabled={!product.inStock}
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="px-6 py-3 font-medium text-primary-700 bg-white border border-primary-300 rounded-md hover:bg-primary-50 flex items-center justify-center"
              >
                <FiHeart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </button>
            </div>
            
            {/* Benefits */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center text-sm text-neutral-700">
                <FiTruck className="h-5 w-5 text-primary-600 mr-2" />
                <span><strong>Free shipping</strong> on orders over $99</span>
              </div>
              <div className="flex items-center text-sm text-neutral-700">
                <FiShield className="h-5 w-5 text-primary-600 mr-2" />
                <span><strong>2-year warranty</strong> with extended coverage available</span>
              </div>
              <div className="flex items-center text-sm text-neutral-700">
                <FiCheck className="h-5 w-5 text-primary-600 mr-2" />
                <span><strong>Easy returns</strong> within 30 days</span>
              </div>
            </div>
            
            {/* Sharing */}
            <div className="flex items-center space-x-4 pt-4 border-t border-neutral-200">
              <span className="text-sm font-medium text-neutral-700">Share:</span>
              <button className="text-neutral-400 hover:text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </button>
              <button className="text-neutral-400 hover:text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                </svg>
              </button>
              <button className="text-neutral-400 hover:text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M9.025 8c0 2.485-2.02 4.5-4.513 4.5A4.506 4.506 0 0 1 0 8c0-2.486 2.02-4.5 4.512-4.5A4.506 4.506 0 0 1 9.025 8zm4.95 0c0 2.34-1.01 4.236-2.256 4.236-1.246 0-2.256-1.897-2.256-4.236 0-2.34 1.01-4.236 2.256-4.236 1.246 0 2.256 1.897 2.256 4.236zM16 8c0 2.096-.355 3.795-.794 3.795-.438 0-.793-1.7-.793-3.795 0-2.096.355-3.795.794-3.795.438 0 .793 1.699.793 3.795z"/>
                </svg>
              </button>
              <button className="text-neutral-400 hover:text-primary-600">
                <FiShare2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-neutral-200">
          <nav className="flex overflow-x-auto">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'description'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab('specs')}
            >
              Specifications
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'compatibility'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab('compatibility')}
            >
              Compatibility
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviewCount})
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'description' && (
            <div className="space-y-6">
              <p className="text-neutral-700 leading-relaxed">{product.description}</p>
              
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Key Features</h3>
                <ul className="space-y-2 text-neutral-700">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheck className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'specs' && (
            <div>
              <table className="min-w-full divide-y divide-neutral-200">
                <tbody className="divide-y divide-neutral-200">
                  {product.specs.map((spec, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900 w-1/3">{spec.name}</td>
                      <td className="px-4 py-3 text-sm text-neutral-700">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'compatibility' && (
            <div>
              <p className="text-neutral-700 mb-6">
                This product is compatible with the following vehicle makes and models. 
                Please verify compatibility with your specific vehicle before purchasing.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.compatibleVehicles.map((vehicle, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <h4 className="text-lg font-medium text-neutral-900 mb-2">{vehicle.make}</h4>
                    <ul className="space-y-1 text-sm text-neutral-700">
                      {vehicle.models.map((model, idx) => (
                        <li key={idx} className="flex items-start">
                          <FiCheck className="h-4 w-4 text-primary-600 mr-2 mt-0.5" />
                          <span>{model}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <p className="mt-6 text-sm text-neutral-600">
                Not sure if this product fits your vehicle? Contact our support team for assistance.
              </p>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Review summary */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b">
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="text-5xl font-bold text-neutral-900">{product.rating.toFixed(1)}</div>
                    <div className="mt-1">
                      <StarRating rating={product.rating} size="lg" />
                    </div>
                    <div className="mt-1 text-sm text-neutral-600">Based on {product.reviewCount} reviews</div>
                  </div>
                  
                  {/* Rating breakdown - could enhance with actual data */}
                  <div className="hidden md:block ml-8">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center">
                        <div className="w-20 text-sm text-neutral-700">{star} stars</div>
                        <div className="w-48 h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400" 
                            style={{ 
                              width: `${
                                star === 5 ? 75 : 
                                star === 4 ? 20 : 
                                star === 3 ? 5 : 
                                star === 2 ? 0 : 0
                              }%` 
                            }}
                          ></div>
                        </div>
                        <div className="ml-2 text-sm text-neutral-500">
                          {star === 5 ? 75 : 
                          star === 4 ? 20 : 
                          star === 3 ? 5 : 
                          star === 2 ? 0 : 0}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0">
                  <button className="px-6 py-3 font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    Write a Review
                  </button>
                </div>
              </div>
              
              {/* Review list */}
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b border-neutral-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-neutral-900">{review.user}</span>
                          {review.verified && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-success-100 text-success-800 rounded-full">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-neutral-500">{review.date}</div>
                      </div>
                      <div className="flex">
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                    </div>
                    
                    <h4 className="mt-3 font-medium text-neutral-900">{review.title}</h4>
                    <p className="mt-2 text-neutral-700">{review.content}</p>
                    
                    <div className="mt-3 flex space-x-4">
                      <button className="text-sm text-neutral-500 hover:text-neutral-700">
                        Helpful (0)
                      </button>
                      <button className="text-sm text-neutral-500 hover:text-neutral-700">
                        Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Related products */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">You might also like</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {product.relatedProducts.map((item) => (
            <Link 
              key={item.id}
              to={`/shop/products/${item.id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              <div className="h-40 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                  {item.name}
                </h3>
                <div className="mt-2 font-bold text-neutral-900">
                  ${item.price.toFixed(2)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 