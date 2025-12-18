import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Urban Skill</h3>
            <p className="text-gray-300 text-sm">
              Connecting skilled workers with customers for quality services.
              Your trusted platform for finding and hiring professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/workers" className="text-gray-300 hover:text-white text-sm">
                  Find Workers
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Workers */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Workers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/register?role=worker" className="text-gray-300 hover:text-white text-sm">
                  Become a Worker
                </Link>
              </li>
              <li>
                <Link to="/worker/dashboard" className="text-gray-300 hover:text-white text-sm">
                  Worker Dashboard
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white text-sm">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            &copy; {currentYear} Urban Skill. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
