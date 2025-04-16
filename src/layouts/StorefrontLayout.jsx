import React from 'react';
import { Outlet } from 'react-router-dom';
import StoreHeader from '../components/navigation/StoreHeader';
import StoreFooter from '../components/navigation/StoreFooter';

export const StorefrontLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <StoreHeader />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <StoreFooter />
    </div>
  );
};
