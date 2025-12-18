import { useContext, useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import api from "../config/api";
import logo from "../assets/logo.png";
import {
  FaUser,
  FaTicketAlt,
  FaHistory,
  FaPlus,
  FaList,
  FaChartLine,
  FaUsers,
  FaBullhorn,
  FaBars,
  FaTimes,
  FaHome,
  FaClipboardList,
  FaDollarSign,
  FaCog,
} from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";

const ADMIN_EMAIL = "sazid98@gmail.com";

const DashboardLayout = () => {
  // ALL HOOKS MUST BE AT THE TOP - Rules of Hooks
  const { user, userRole: contextUserRole } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Force admin role for specific email
  const userRole = user?.email === ADMIN_EMAIL ? 'admin' : contextUserRole;

  // Effect 1: Handle loading state
  useEffect(() => {
    if (contextUserRole) {
      setLoading(false);
    }
  }, [contextUserRole]);

  // Effect 2: Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect 3: Apply dark theme to body for admin - MOVED BEFORE EARLY RETURN
  useEffect(() => {
    if (userRole === 'admin') {
      document.body.classList.add('admin-dark-theme');
    } else {
      document.body.classList.remove('admin-dark-theme');
    }
    return () => {
      document.body.classList.remove('admin-dark-theme');
    };
  }, [userRole]);

  // Navigation links definitions
  const userLinks = [
    { to: "/dashboard/user/dashboard", icon: <FaHome />, label: "Dashboard" },
    { to: "/dashboard/user/profile", icon: <FaUser />, label: "User Profile" },
    {
      to: "/dashboard/user/bookings",
      icon: <FaTicketAlt />,
      label: "My Booked Tickets",
    },
    {
      to: "/dashboard/user/transactions",
      icon: <FaHistory />,
      label: "Transaction History",
    },
  ];

  const vendorLinks = [
    {
      to: "/dashboard/vendor/dashboard",
      icon: <FaHome />,
      label: "Dashboard",
    },
    {
      to: "/dashboard/vendor/profile",
      icon: <FaUser />,
      label: "Vendor Profile",
    },
    {
      to: "/dashboard/vendor/add-ticket",
      icon: <FaPlus />,
      label: "Add Ticket",
    },
    {
      to: "/dashboard/vendor/my-tickets",
      icon: <FaList />,
      label: "My Added Tickets",
    },
    {
      to: "/dashboard/vendor/bookings",
      icon: <FaTicketAlt />,
      label: "Requested Bookings",
    },
    {
      to: "/dashboard/vendor/revenue",
      icon: <FaChartLine />,
      label: "Revenue Overview",
    },
    {
      to: "/dashboard/vendor/transactions",
      icon: <FaDollarSign />,
      label: "Transaction History",
    },
  ];

  const adminLinks = [
    {
      to: "/dashboard/admin/dashboard",
      icon: <FaChartLine />,
      label: "Dashboard Overview",
    },
    {
      to: "/dashboard/admin/manage-tickets",
      icon: <FaTicketAlt />,
      label: "Manage Tickets",
    },
    {
      to: "/dashboard/admin/manage-users",
      icon: <FaUsers />,
      label: "User Management",
    },
    {
      to: "/dashboard/admin/advertise",
      icon: <FaBullhorn />,
      label: "Advertise Tickets",
    },
    {
      to: "/dashboard/admin/profile",
      icon: <FaCog />,
      label: "Settings",
    },
  ];

  const getLinks = () => {
    if (userRole === "admin") return adminLinks;
    if (userRole === "vendor") return vendorLinks;
    return userLinks;
  };

  // CONDITIONAL RENDERING - After all hooks are called
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0f172a]">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-[#d97757]"></span>
          <p className="text-slate-300 font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      userRole === 'admin' ? 'bg-[#0f172a]' : 'bg-slate-50 dark:bg-slate-900'
    }`}>
      {/* Dashboard navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
        userRole === 'admin'
          ? 'bg-[#0f172a] border-slate-700'
          : isScrolled
            ? 'bg-slate-900/95 backdrop-blur-xl border-slate-700 shadow-lg'
            : 'bg-transparent border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-20">
            <Link to="/" className="flex items-center group">
              <img src={logo} alt="Uraan Logo" className="w-24 -mt-5 transition-transform group-hover:scale-105" />
              <span className={`text-2xl lg:text-3xl -mb-10 -ml-10 -mt-8 font-bold transition-all duration-300 ${
                userRole === 'admin' || isScrolled ? 'text-[#d97757]' : 'text-white drop-shadow-lg'
              }`}>
                Uraan
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        <div className="flex">
          {/* Mobile toggle button with Primary Clay */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed top-24 left-3 z-50 p-3 bg-[#b35a44] hover:bg-[#8e4636] text-white rounded-xl shadow-lg hover:scale-110 transition-all duration-300"
          >
            {isSidebarOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>

          {/* Sidebar - Deep Slate for Admin, White/Slate 50 for Vendor/User */}
          <aside
            className={`fixed lg:static top-20 lg:top-auto bottom-0 left-0 z-40 w-[18rem] max-w-[85vw] lg:w-72 ${
              userRole === "admin"
                ? "bg-[#0f172a] border-[#334155]"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            } border-r shadow-lg transform transition-all duration-500 ease-in-out ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="h-full overflow-y-auto">
              {/* Sidebar header - Admin uses Deep Slate, others use lighter */}
              <div className={`p-6 border-b ${
                userRole === "admin"
                  ? "bg-[#1e293b] border-[#334155]"
                  : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl backdrop-blur-sm border ${
                    userRole === "admin"
                      ? "bg-[#b35a44]/20 border-[#b35a44]/30"
                      : "bg-[#b35a44]/10 border-[#b35a44]/20"
                  }`}>
                    <FaChartLine className={`text-3xl ${
                      userRole === "admin" ? "text-[#d97757]" : "text-[#b35a44]"
                    }`} />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${
                      userRole === "admin" ? "text-white" : "text-[#0f172a] dark:text-white"
                    }`}>Dashboard</h2>
                    <p className={`text-sm capitalize ${
                      userRole === "admin" ? "text-slate-300" : "text-[#334155] dark:text-slate-300"
                    }`}>
                      {userRole} Panel
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation with admin-specific Deep Slate styling */}
              <nav className="p-4 space-y-2">
                {getLinks().map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-5 py-4 rounded-xl font-medium transition-all duration-300 group ${
                        isActive
                          ? userRole === "admin"
                            ? "bg-[#b35a44] text-white shadow-lg scale-105"
                            : "bg-[#b35a44] text-white shadow-lg scale-105"
                          : userRole === "admin"
                            ? "text-slate-300 hover:bg-[#1e293b] hover:text-[#d97757] hover:scale-[1.02]"
                            : "text-[#334155] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-[#b35a44] hover:scale-[1.02]"
                      }`
                    }
                  >
                    <span
                      className={`text-xl transition-transform duration-300 group-hover:scale-110`}
                    >
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Back to home button */}
              <div className={`p-4 mt-6 border-t ${
                userRole === "admin" ? "border-[#334155]" : "border-slate-200 dark:border-slate-700"
              }`}>
                <Link
                  to="/"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-center space-x-3 px-5 py-4 rounded-xl transition-all duration-300 font-medium hover:scale-[1.02] group border ${
                    userRole === "admin"
                      ? "text-slate-300 hover:bg-[#1e293b] hover:text-[#d97757] border-transparent hover:border-[#334155]"
                      : "text-[#334155] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-[#b35a44] border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <FaHome className="text-xl group-hover:scale-110 transition-transform" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-30 transition-all duration-500"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main content area */}
          <main className={`flex-1 p-6 lg:p-8 min-h-screen ${
            userRole === 'admin' ? 'bg-[#0f172a]' : 'bg-transparent'
          }`}>
            <div className="max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
