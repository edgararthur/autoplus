import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';

const DealerLayout = ({ children }) => {
  const { currentUser, dealerInfo } = useAuth();

  return (
    <div className="flex h-screen bg-neutral-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header user={currentUser} dealerInfo={dealerInfo} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DealerLayout; 