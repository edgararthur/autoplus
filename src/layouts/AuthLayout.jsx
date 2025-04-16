import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/common/Logo';

export const AuthLayout = () => {
  const { isAuthenticated, userType } = useAuth();

  // If user is already authenticated, redirect to appropriate dashboard
  if (isAuthenticated()) {
    if (userType === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userType === 'dealer') {
      return <Navigate to="/dealer/dashboard" replace />;
    } else {
      return <Navigate to="/shop" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo size="large" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-neutral-900">
          AutoParts Marketplace
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
