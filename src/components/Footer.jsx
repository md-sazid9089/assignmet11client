import { Link } from 'react-router-dom';
import { MdFlightTakeoff } from 'react-icons/md';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { SiStripe } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-lighter mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <MdFlightTakeoff className="text-3xl text-primary-500" />
              <span className="text-2xl font-bold gradient-text">TicketBari</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400">
              Your trusted platform for booking bus, train, launch, and flight tickets with ease.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-primary-500 hover:text-secondary-500 transition-colors">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-primary-500 hover:text-secondary-500 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-primary-500 hover:text-secondary-500 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-primary-500 hover:text-secondary-500 transition-colors">
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 gradient-text">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tickets" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  All Tickets
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 gradient-text">Contact Info</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>Email: support@ticketbari.com</li>
              <li>Phone: +880 1234-567890</li>
              <li>Address: Dhaka, Bangladesh</li>
              <li>Hours: 24/7 Support</li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-bold mb-4 gradient-text">Payment Methods</h3>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <SiStripe size={40} className="text-primary-500" />
              <span className="font-semibold">Powered by Stripe</span>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Secure payments with industry-standard encryption
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-dark-lighter mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 TicketBari. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
