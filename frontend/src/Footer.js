import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-100 p-4 mt-8">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#copyright" className="hover:text-blue-300">© 2024 AI Morality Index</a>
          <a href="#privacy-policy" className="hover:text-blue-300">Privacy Policy</a>
          <a href="#terms-of-use" className="hover:text-blue-300">Terms of Use</a>
          <a href="#contact-info" className="hover:text-blue-300">Contact Info</a>
        </div>
        <p className="text-sm text-gray-500">All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
