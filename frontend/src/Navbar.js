import React from 'react';
import logo from './assets/logo.png';

const Navbar = ({ setActiveSection }) => {
  return (
    <nav className="bg-gray-800 text-gray-100 p-4 shadow-lg relative">
      <div className="container mx-auto flex justify-center items-center relative">
        {/* Logo 部分 */}
        <div className="absolute left-0 flex items-center">
          <img src={logo} alt="Site Logo" className="h-10 w-10 ml-4" />
        </div>

        {/* 导航链接 */}
        <ul className="flex space-x-10 text-lg">
          <li>
            <button
              onClick={() => setActiveSection('home')}
              className="hover:text-blue-300"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('about')}
              className="hover:text-blue-300"
            >
              About Us
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('data-sources')}
              className="hover:text-blue-300"
            >
              Data Sources
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('calculation')}
              className="hover:text-blue-300"
            >
              How It's Calculated
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('contact')}
              className="hover:text-blue-300"
            >
              Contact Information
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
