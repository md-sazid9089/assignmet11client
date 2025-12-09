import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { MdFlightTakeoff } from 'react-icons/md';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    ...(user ? [
      { path: '/tickets', label: 'All Tickets' },
      { path: '/dashboard', label: 'Dashboard' },
    ] : []),
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-dark-card shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <MdFlightTakeoff className="text-3xl text-primary-500 group-hover:text-secondary-500 transition-colors" />
            <span className="text-2xl font-bold gradient-text">TicketBari</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-semibold transition-colors ${
                    isActive
                      ? 'text-primary-500 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-primary-100 dark:hover:bg-dark-lighter transition-colors"
            >
              {darkMode ? (
                <FiSun className="text-xl text-primary-400" />
              ) : (
                <FiMoon className="text-xl text-primary-500" />
              )}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={user.photoURL || 'https://via.placeholder.com/40'}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full border-2 border-primary-400"
                  />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {user.displayName}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-2xl shadow-soft-lg py-2">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-primary-50 dark:hover:bg-dark-lighter transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-primary-50 dark:hover:bg-dark-lighter transition-colors text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="btn-secondary px-5 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary px-5 py-2">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-2xl text-gray-700 dark:text-gray-300"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block font-semibold transition-colors ${
                    isActive ? 'text-primary-500' : 'text-gray-700 dark:text-gray-300'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            <button onClick={toggleTheme} className="flex items-center gap-2">
              {darkMode ? <FiSun /> : <FiMoon />}
              <span>Toggle Theme</span>
            </button>

            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <img
                    src={user.photoURL || 'https://via.placeholder.com/40'}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-semibold">{user.displayName}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-red-500 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block btn-secondary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block btn-primary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
