import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 py-2">
      <div className="px-4 sm:px-6 lg:px-8 flex justify-center">
        <p className="text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} AutoParts Marketplace. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
