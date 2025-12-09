import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import AdminRoute from './components/routes/AdminRoute';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AllTickets from './pages/Tickets/AllTickets';
import TicketDetails from './pages/Tickets/TicketDetails';

// User Dashboard
import Profile from './pages/Dashboard/User/Profile';
import MyBookings from './pages/Dashboard/User/MyBookings';
import Transactions from './pages/Dashboard/User/Transactions';

// Vendor Dashboard
import AddTicket from './pages/Dashboard/Vendor/AddTicket';
import MyTickets from './pages/Dashboard/Vendor/MyTickets';
import BookingRequests from './pages/Dashboard/Vendor/BookingRequests';
import Revenue from './pages/Dashboard/Vendor/Revenue';

// Old Admin Dashboard (kept for vendors with admin role)
import ManageTickets from './pages/Dashboard/Admin/ManageTickets';

// New Admin Dashboard
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import AdvertiseTickets from './pages/Admin/AdvertiseTickets';
import AdminProfile from './pages/Admin/AdminProfile';

function App() {
  return (
    <Routes>
      {/* Admin Routes - Completely Separate Layout */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="tickets" element={<ManageTickets />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="advertise" element={<AdvertiseTickets />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Main Website Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        <Route
          path="tickets"
          element={
            <PrivateRoute>
              <AllTickets />
            </PrivateRoute>
          }
        />
        
        <Route
          path="ticket/:id"
          element={
            <PrivateRoute>
              <TicketDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<Profile />} />
          
          {/* User Routes */}
          <Route
            path="my-bookings"
            element={
              <RoleRoute allowedRoles={['user', 'admin']}>
                <MyBookings />
              </RoleRoute>
            }
          />
          <Route
            path="transactions"
            element={
              <RoleRoute allowedRoles={['user', 'admin']}>
                <Transactions />
              </RoleRoute>
            }
          />

          {/* Vendor Routes */}
          <Route
            path="add-ticket"
            element={
              <RoleRoute allowedRoles={['vendor', 'admin']}>
                <AddTicket />
              </RoleRoute>
            }
          />
          <Route
            path="my-tickets"
            element={
              <RoleRoute allowedRoles={['vendor', 'admin']}>
                <MyTickets />
              </RoleRoute>
            }
          />
          <Route
            path="booking-requests"
            element={
              <RoleRoute allowedRoles={['vendor', 'admin']}>
                <BookingRequests />
              </RoleRoute>
            }
          />
          <Route
            path="revenue"
            element={
              <RoleRoute allowedRoles={['vendor', 'admin']}>
                <Revenue />
              </RoleRoute>
            }
          />

          {/* Old Admin Route - Kept for backward compatibility */}
          <Route
            path="manage-tickets"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <ManageTickets />
              </RoleRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
