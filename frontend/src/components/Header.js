import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Zap, BarChart3, Settings, Calendar } from 'lucide-react';

const Header = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#4a90e2] via-[#4a90e2] to-[#50E3C2] h-16 flex items-center justify-between px-4 lg:px-6 shadow-lg relative z-50">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>

        {/* Logo/Brand */}
        <div className="flex items-center">
          <h1 className="font-mono font-bold text-xl lg:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#50E3C2]">
            CodeFlow.ai
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200 font-medium flex items-center group border border-white/20"
            >
              <Zap className="mr-2 h-4 w-4" />
              Quick Actions
              <ChevronDown 
                className={`ml-2 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={closeDropdown}
                />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl z-20 border border-white/20 overflow-hidden">
                  <div className="py-2">
                    <Link 
                      to="/deadline-prediction" 
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#50E3C2]/20 hover:text-[#4a90e2] transition-colors duration-200 group"
                      onClick={closeDropdown}
                    >
                      <Calendar className="mr-3 h-4 w-4 group-hover:text-[#4a90e2]" />
                      Deadline Prediction
                    </Link>
                    <Link 
                      to="/task-allocation" 
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#50E3C2]/20 hover:text-[#4a90e2] transition-colors duration-200 group"
                      onClick={closeDropdown}
                    >
                      <BarChart3 className="mr-3 h-4 w-4 group-hover:text-[#4a90e2]" />
                      Task Allocation
                    </Link>
                    <Link 
                      to="/model-performance" 
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#50E3C2]/20 hover:text-[#4a90e2] transition-colors duration-200 group"
                      onClick={closeDropdown}
                    >
                      <Settings className="mr-3 h-4 w-4 group-hover:text-[#4a90e2]" />
                      Modal Performance
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Quick Action Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleDropdown}
            className="bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            <Zap className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isDropdownOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl z-40 border-b border-white/20">
          <div className="py-2">
            <Link 
              to="/deadline-prediction" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#50E3C2]/20 hover:text-[#4a90e2] transition-colors duration-200"
              onClick={closeDropdown}
            >
              <Calendar className="mr-3 h-4 w-4" />
              Deadline Prediction
            </Link>
            <Link 
              to="/task-allocation" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#50E3C2]/20 hover:text-[#4a90e2] transition-colors duration-200"
              onClick={closeDropdown}
            >
              <BarChart3 className="mr-3 h-4 w-4" />
              Task Allocation
            </Link>
            <Link 
              to="/model-performance" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#50E3C2]/20 hover:text-[#4a90e2] transition-colors duration-200"
              onClick={closeDropdown}
            >
              <Settings className="mr-3 h-4 w-4" />
              Modal Performance
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;