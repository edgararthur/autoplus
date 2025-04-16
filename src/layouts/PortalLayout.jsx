import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';
import Footer from '../components/navigation/Footer';

export const PortalLayout = ({ portalType }) => {
  const { isAuthenticated, hasRole, currentUser } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user is authenticated and has the correct role
  if (!isAuthenticated()) {
    // Redirect to login with return path
    return <Navigate to={`/auth/login?returnTo=${location.pathname}`} replace />;
  }

  // Check if user has the correct role for this portal
  const hasCorrectRole = portalType === 'admin' ? hasRole('admin') : hasRole('dealer');
  
  if (!hasCorrectRole) {
    // Redirect to appropriate dashboard based on role
    if (hasRole('admin')) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (hasRole('dealer')) {
      return <Navigate to="/dealer/dashboard" replace />;
    } else {
      return <Navigate to="/shop" replace />;
    }
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar 
          portalType={portalType} 
          isOpen={true} 
          onClose={() => {}} 
        />
      </div>
      
      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 flex z-40 ${sidebarOpen ? 'transform-none' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
          <Sidebar 
            portalType={portalType} 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        </div>
        <div 
          className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 bg-neutral-900 bg-opacity-50`} 
          onClick={() => setSidebarOpen(false)}
        ></div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header 
          portalType={portalType} 
          toggleSidebar={() => setSidebarOpen(true)} 
          user={currentUser}
        />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};
