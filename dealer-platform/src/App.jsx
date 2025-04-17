import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from 'autoplus-shared';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dealer Pages
import DealerDashboard from './pages/dealer/DealerDashboard';
import InventoryManagement from './pages/dealer/InventoryManagement';
import ProductForm from './pages/dealer/ProductForm';
import OrderManagement from './pages/dealer/OrderManagement';
import DealerAnalytics from './pages/dealer/DealerAnalytics';
import StaffManagement from './pages/dealer/StaffManagement';
import DealerSettings from './pages/dealer/DealerSettings';

// Common Components
import LoadingScreen from './components/common/LoadingScreen';
import DealerLayout from './components/layouts/DealerLayout';
import NotFound from './pages/errors/NotFound';
import Unauthorized from './pages/errors/Unauthorized';

// Protected Route Component
const ProtectedDealerRoute = ({ children }) => {
  const { currentUser, loading, isDealer } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (!isDealer) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { currentUser, loading, isDealer } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={!currentUser ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
      
      {/* Error Pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Protected Dealer Routes */}
      <Route path="/dashboard" element={
        <ProtectedDealerRoute>
          <DealerLayout>
            <DealerDashboard />
          </DealerLayout>
        </ProtectedDealerRoute>
      } />
      
      <Route path="/inventory" element={
        <ProtectedDealerRoute>
          <DealerLayout>
            <InventoryManagement />
          </DealerLayout>
        </ProtectedDealerRoute>
      } />
      
      <Route path="/product/:id?" element={
        <ProtectedDealerRoute>
          <DealerLayout>
            <ProductForm />
          </DealerLayout>
        </ProtectedDealerRoute>
      } />
      
      <Route path="/orders" element={
        <ProtectedDealerRoute>
          <DealerLayout>
            <OrderManagement />
          </DealerLayout>
        </ProtectedDealerRoute>
      } />
      
      <Route path="/analytics" element={
        <ProtectedDealerRoute>
          <DealerLayout>
            <DealerAnalytics />
          </DealerLayout>
        </ProtectedDealerRoute>
      } />
      
      <Route path="/staff" element={
        <ProtectedDealerRoute>
          <DealerLayout>
            <StaffManagement />
          </DealerLayout>
        </ProtectedDealerRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedDealerRoute>
          <DealerLayout>
            <DealerSettings />
          </DealerLayout>
        </ProtectedDealerRoute>
      } />
      
      {/* Fallback Routes */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App; 