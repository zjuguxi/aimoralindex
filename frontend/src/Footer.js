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
        {/* 社交分享按钮 */}
        <div className="flex justify-center space-x-4 mt-4">
          {/* X 分享按钮 */}
          <a href={xShareUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400">
            <FontAwesomeIcon icon={faXTwitter} size="lg" />
          </a>
          {/* LinkedIn 分享按钮 */}
          <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400">
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
          {/* Facebook 分享按钮 */}
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
            <FontAwesomeIcon icon={faFacebook} size="lg" />
          </a>
        </div>
        <p className="text-xs text-gray-600 mt-2">All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
