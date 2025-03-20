import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-16 flex items-center justify-between px-6 shadow-md">
        <h1 className="text-white font-bold text-xl"></h1>
        <div className="flex items-center space-x-4">
          {/* <Link to={'/deadline-prediction'}>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors font-medium">
              Predictions
            </button>
          </Link> */}

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors font-medium flex items-center"
            >
              Let's Go
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-30">
                <div className="py-1">
                  <Link to="/deadline-prediction" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Deadline Prediction</Link>
                  <Link to="/task-allocation" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Task Allocation</Link>
                  <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-blue-100">Settings</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;