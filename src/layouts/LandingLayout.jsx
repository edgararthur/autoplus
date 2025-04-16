import React from 'react';
import { Outlet } from 'react-router-dom';
import LandingHeader from '../components/navigation/LandingHeader';
import LandingFooter from '../components/navigation/LandingFooter';

export const LandingLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <LandingFooter />
    </div>
  );
};
