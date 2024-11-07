import React from 'react';

const PrivacyPolicy = () => {
  return (
    <section className="bg-gray-100 text-gray-900 p-8 max-w-4xl mx-auto rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Privacy Policy</h2>
      
      <p className="text-lg mb-4 text-gray-700">
        This Privacy Policy explains how we collect, use, and protect your information when you use our website.
      </p>

      <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">1. Information Collection</h3>
      <p className="text-lg mb-4 text-gray-700">
        We may collect various types of information, including but not limited to:
      </p>
      <ul className="list-disc list-inside text-lg text-gray-700 mb-4 space-y-2">
        <li>Personal information you provide to us, such as your name, email address, etc.</li>
        <li>Usage data, such as the pages you visit, time spent on our website, and interactions with content.</li>
        <li>Technical data, like your IP address, browser type, and operating system.</li>
      </ul>

      <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">2. Use of Information</h3>
      <p className="text-lg mb-4 text-gray-700">
        We use the information we collect for purposes such as:
      </p>
      <ul className="list-disc list-inside text-lg text-gray-700 mb-4 space-y-2">
        <li>Improving our website’s functionality and content.</li>
        <li>Personalizing your experience on our website.</li>
        <li>Communicating with you, including responding to your inquiries.</li>
      </ul>

      <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">3. Data Protection</h3>
      <p className="text-lg mb-4 text-gray-700">
        We implement various security measures to ensure the protection of your personal information. However, please note that no method of electronic storage or transmission is completely secure.
      </p>

      <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">4. Third-Party Services</h3>
      <p className="text-lg mb-4 text-gray-700">
        We may share your information with third-party services to help us analyze website usage and improve our services. These third parties are obligated to keep your information secure and confidential.
      </p>

      <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">5. Changes to This Privacy Policy</h3>
      <p className="text-lg mb-4 text-gray-700">
        We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review it periodically.
      </p>

      <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">6. Contact Us</h3>
      <p className="text-lg mb-4 text-gray-700">
        If you have any questions regarding this Privacy Policy, please contact us at: <a href="mailto:support@aimoralindex.com" className="text-blue-500 hover:underline">support@aimoralindex.com</a>.
      </p>
    </section>
  );
};

export default PrivacyPolicy;
