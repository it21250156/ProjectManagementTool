import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Header - Fixed at top */}
      <Header 
        onMobileMenuToggle={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed height, no scroll */}
        <Sidebar 
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        />
        
        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto">
            {/* This is where your route components will be rendered */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;