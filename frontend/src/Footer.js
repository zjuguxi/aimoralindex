import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons';

const Footer = ({ setActiveSection }) => {
  const currentUrl = window.location.href;

  // 分享链接
  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=Check out this AI Morality Index!`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

  return (
    <footer className="bg-gray-800 text-gray-500 py-6 mt-8">
      <div className="container mx-auto text-center text-sm">
        {/* 页脚链接 */}
        <div className="flex justify-center space-x-6 mb-4">
          <span>© 2024 AI Morality Index</span>
          <button
            onClick={() => setActiveSection('privacy-policy')}
            className="hover:text-blue-300"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveSection('terms-of-use')}
            className="hover:text-blue-300"
          >
            Terms of Use
          </button>          <button 
            onClick={() => setActiveSection('contact')} 
            className="hover:text-blue-300"
          >
            Contact Info
          </button>
        </div>
        
        {/* 分隔线 */}
        <div className="border-t border-gray-600 my-4"></div>

        {/* 社交分享按钮 */}
        <div className="flex justify-center space-x-6 mt-4">
          <a href={xShareUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400">
            <FontAwesomeIcon icon={faXTwitter} size="lg" />
          </a>
          <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400">
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400">
            <FontAwesomeIcon icon={faFacebook} size="lg" />
          </a>
        </div>
        
        {/* 版权信息 */}
        <p className="text-xs text-gray-600 mt-4">All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
