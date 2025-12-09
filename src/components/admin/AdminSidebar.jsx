import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdConfirmationNumber,
  MdPeople,
  MdCampaign,
  MdPerson,
  MdLogout,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { logout, user } = useAuth();

  const menuItems = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: MdDashboard,
      end: true,
    },
    {
      path: '/admin/tickets',
      label: 'Manage Tickets',
      icon: MdConfirmationNumber,
    },
    {
      path: '/admin/users',
      label: 'Manage Users',
      icon: MdPeople,
    },
    {
      path: '/admin/advertise',
      label: 'Advertise Tickets',
      icon: MdCampaign,
    },
    {
      path: '/admin/profile',
      label: 'Admin Profile',
      icon: MdPerson,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen flex flex-col">
      {/* Admin Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
            <p className="text-xs text-gray-500 truncate max-w-[140px]">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-3 transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-r-4 border-pink-500 text-pink-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="text-2xl" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-6 py-3 w-full text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
        >
          <MdLogout className="text-2xl" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
