import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PortalLayout } from './layouts/PortalLayout';
import { StorefrontLayout } from './layouts/StorefrontLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { LandingLayout } from './layouts/LandingLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { AuthProvider } from './contexts/AuthContext';
import { Suspense, lazy } from 'react';
import LoadingScreen from './components/common/LoadingScreen';

// Lazy-loaded page components for code splitting
const LandingPage = lazy(() => import('./pages/landing/LandingPage'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

// Buyer pages
const BuyerHome = lazy(() => import('./pages/buyer/BuyerHome'));
const ProductListing = lazy(() => import('./pages/buyer/ProductListing'));
const ProductDetail = lazy(() => import('./pages/buyer/ProductDetail'));
const ShoppingCart = lazy(() => import('./pages/buyer/ShoppingCart'));
const Checkout = lazy(() => import('./pages/buyer/Checkout'));
const BuyerAccount = lazy(() => import('./pages/buyer/BuyerAccount'));
const OrderHistory = lazy(() => import('./pages/buyer/OrderHistory'));
const OrderDetail = lazy(() => import('./pages/buyer/OrderDetail'));

// Dealer pages
const DealerDashboard = lazy(() => import('./pages/dealer/DealerDashboard'));
const InventoryManagement = lazy(() => import('./pages/dealer/InventoryManagement'));
const OrderManagement = lazy(() => import('./pages/dealer/OrderManagement'));
const DealerSettings = lazy(() => import('./pages/dealer/DealerSettings'));
const DealerAnalytics = lazy(() => import('./pages/dealer/DealerAnalytics'));
const StaffManagement = lazy(() => import('./pages/dealer/StaffManagement'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const DealerManagement = lazy(() => import('./pages/admin/DealerManagement'));
const ProductModeration = lazy(() => import('./pages/admin/ProductModeration'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const PlatformAnalytics = lazy(() => import('./pages/admin/PlatformAnalytics'));
const SupportTickets = lazy(() => import('./pages/admin/SupportTickets'));

function App() {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Landing and Authentication Routes */}
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<LandingPage />} />
          </Route>
          
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>
          
          {/* Buyer/E-commerce Routes */}
          <Route path="/shop" element={<StorefrontLayout />}>
            <Route index element={<BuyerHome />} />
            <Route path="products" element={<ProductListing />} />
            <Route path="products/:productId" element={<ProductDetail />} />
            <Route path="cart" element={<ShoppingCart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="account" element={<BuyerAccount />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="orders/:orderId" element={<OrderDetail />} />
          </Route>
          
          {/* Dealer Portal Routes */}
          <Route path="/dealer" element={<PortalLayout portalType="dealer" />}>
            <Route index element={<Navigate to="/dealer/dashboard" replace />} />
            <Route path="dashboard" element={<DealerDashboard />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="settings" element={<DealerSettings />} />
            <Route path="analytics" element={<DealerAnalytics />} />
            <Route path="staff" element={<StaffManagement />} />
          </Route>
          
          {/* Admin Portal Routes */}
          <Route path="/admin" element={<PortalLayout portalType="admin" />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="dealers" element={<DealerManagement />} />
            <Route path="products" element={<ProductModeration />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<PlatformAnalytics />} />
            <Route path="support" element={<SupportTickets />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
