import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiYoutube,
  FiCreditCard,
  FiTruck,
  FiPhoneCall,
  FiShield
} from 'react-icons/fi';

const StoreFooter = () => {
  return (
    <footer className="bg-neutral-800 text-white">
      {/* Trust badges section */}
      <div className="py-10 bg-neutral-750">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center">
              <div className="mr-4 text-accent-500">
                <FiTruck size={36} />
              </div>
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-neutral-300">On orders over $99</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-4 text-accent-500">
                <FiCreditCard size={36} />
              </div>
              <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-neutral-300">100% secure transactions</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-4 text-accent-500">
                <FiPhoneCall size={36} />
              </div>
              <div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-neutral-300">Talk to our experts</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-4 text-accent-500">
                <FiShield size={36} />
              </div>
              <div>
                <h3 className="font-semibold">Warranty Protection</h3>
                <p className="text-sm text-neutral-300">Quality guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and about */}
          <div className="lg:col-span-2">
            <div className="flex items-center">
              <Logo size="medium" dark />
            </div>
            <p className="mt-4 text-sm text-neutral-300 max-w-md">
              AutoParts Marketplace connects quality auto parts dealers with buyers looking for the best automotive components. From engine parts to accessories, we've got everything for your vehicle needs.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-base font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="text-neutral-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/shop/products" className="text-neutral-300 hover:text-white">Shop All</Link>
              </li>
              <li>
                <Link to="/shop/brands" className="text-neutral-300 hover:text-white">Brands</Link>
              </li>
              <li>
                <Link to="/shop/deals" className="text-neutral-300 hover:text-white">Deals</Link>
              </li>
              <li>
                <Link to="/shop/help" className="text-neutral-300 hover:text-white">Help Center</Link>
              </li>
            </ul>
          </div>
          
          {/* Information */}
          <div>
            <h3 className="text-base font-medium mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop/about" className="text-neutral-300 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/shop/contact" className="text-neutral-300 hover:text-white">Contact Us</Link>
              </li>
              <li>
                <Link to="/shop/blog" className="text-neutral-300 hover:text-white">Blog</Link>
              </li>
              <li>
                <Link to="/shop/privacy" className="text-neutral-300 hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/shop/terms" className="text-neutral-300 hover:text-white">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-base font-medium mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop/faq" className="text-neutral-300 hover:text-white">FAQ</Link>
              </li>
              <li>
                <Link to="/shop/shipping" className="text-neutral-300 hover:text-white">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/shop/returns" className="text-neutral-300 hover:text-white">Returns & Refunds</Link>
              </li>
              <li>
                <Link to="/shop/warranty" className="text-neutral-300 hover:text-white">Warranty Information</Link>
              </li>
              <li>
                <Link to="/shop/track-order" className="text-neutral-300 hover:text-white">Track Order</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Payment methods */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6 border-t border-neutral-700">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-neutral-400">
              &copy; {new Date().getFullYear()} AutoParts Marketplace. All rights reserved.
            </p>
          </div>
          <div>
            <img 
              src="https://images.pexels.com/photos/164571/pexels-photo-164571.jpeg?auto=compress&cs=tinysrgb&w=800&h=60&dpr=1" 
              alt="Payment methods" 
              className="h-8 w-auto"
            />
          </div>
        </div>
      </div>
      
      {/* Copyright bar */}
      <div className="bg-neutral-900 px-4 py-2 text-center text-xs text-neutral-500">
        AI-powered development by Biela.dev, powered by TeachMeCode® Institute
      </div>
    </footer>
  );
};

export default StoreFooter;
