import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUsers } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
  return (
    <section className="bg-gray-100 text-gray-800 p-8 max-w-2xl mx-auto rounded-lg shadow-md">
      <h2 className="text-4xl font-bold mb-4 text-center text-blue-600">Contact Information</h2>
      <p className="text-lg text-center mb-4">
        If you have any questions or need support, feel free to reach out to us.
      </p>
      <p className="text-lg text-center flex justify-center items-center mb-4">
        <FontAwesomeIcon icon={faUsers} className="text-blue-600 mr-2" />
        <strong>Support Team:</strong>&nbsp; 870 Group 3
      </p>
      <p className="text-lg text-center flex justify-center items-center">
        <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 mr-2" />
        <strong>Email:</strong>&nbsp;
        <a href="mailto:support@aimoralindex.com" className="text-blue-600 hover:underline">
          support@aimoralindex.com
        </a>
      </p>
    </section>
  );
};

export default Contact;
