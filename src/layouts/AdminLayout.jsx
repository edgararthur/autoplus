import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AdminLayout = () => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to={`/auth/login?returnTo=${location.pathname}`} replace />;
  }

  // Check if user has admin role
  if (!hasRole('admin')) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
