import React from 'react';

const Footer = ({ setActiveSection }) => {
  return (
    <footer className="bg-gray-800 text-gray-500 py-4 mt-8">
      <div className="container mx-auto text-center text-sm">
        <div className="flex justify-center space-x-4 mb-2">
          <span>© 2024 AI Morality Index</span>
          <a href="#privacy-policy" className="hover:text-blue-300">Privacy Policy</a>
          <a href="#terms-of-use" className="hover:text-blue-300">Terms of Use</a>
          <button 
            onClick={() => setActiveSection('contact')} 
            className="hover:text-blue-300"
          >
            Contact Info
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
