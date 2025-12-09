import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiList, FiDollarSign, FiPlus, FiPackage, FiUsers, FiStar } from 'react-icons/fi';

const DashboardLayout = () => {
  const { userRole } = useAuth();

  const userLinks = [
    { path: '/dashboard/profile', label: 'Profile', icon: <FiUser /> },
    { path: '/dashboard/my-bookings', label: 'My Booked Tickets', icon: <FiList /> },
    { path: '/dashboard/transactions', label: 'Transaction History', icon: <FiDollarSign /> },
  ];

  const vendorLinks = [
    { path: '/dashboard/profile', label: 'Profile', icon: <FiUser /> },
    { path: '/dashboard/add-ticket', label: 'Add Ticket', icon: <FiPlus /> },
    { path: '/dashboard/my-tickets', label: 'My Added Tickets', icon: <FiPackage /> },
    { path: '/dashboard/booking-requests', label: 'Requested Bookings', icon: <FiList /> },
    { path: '/dashboard/revenue', label: 'Revenue Overview', icon: <FiDollarSign /> },
  ];

  const adminLinks = [
    { path: '/dashboard/profile', label: 'Profile', icon: <FiUser /> },
    { path: '/dashboard/manage-tickets', label: 'Manage Tickets', icon: <FiPackage /> },
    { path: '/dashboard/manage-users', label: 'Manage Users', icon: <FiUsers /> },
    { path: '/dashboard/advertise', label: 'Advertise Tickets', icon: <FiStar /> },
  ];

  const getLinks = () => {
    if (userRole === 'admin') return adminLinks;
    if (userRole === 'vendor') return vendorLinks;
    return userLinks;
  };

  const links = getLinks();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="card sticky top-24">
            <h2 className="text-2xl font-bold gradient-text mb-6">Dashboard</h2>
            <nav className="space-y-2">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-primary text-white shadow-md'
                        : 'hover:bg-primary-50 dark:hover:bg-dark-lighter text-gray-700 dark:text-gray-300'
                    }`
                  }
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
