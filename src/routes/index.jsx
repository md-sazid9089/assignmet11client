import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import AllTicket from "../pages/tickets/AllTicket";
import TicketDetails from "../pages/tickets/TicketDetails";
import DashboardLayout from "../layouts/DashboardLayout";
import ErrorPage from "../pages/ErrorPage";
import UserProfile from "../pages/dashboard/user/UserProfile";
import MyBookedTickets from "../pages/dashboard/user/MyBookedTickets";
import TransactionHistory from "../pages/dashboard/user/TransactionHistory";
import VendorProfile from "../pages/dashboard/vendor/VendorProfile";
import AddTicket from "../pages/dashboard/vendor/AddTicket";
import RequestedBookings from "../pages/dashboard/vendor/RequestedBookings";
import RevenueOverview from "../pages/dashboard/vendor/RevenueOverview";
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import ManageTickets from "../pages/dashboard/admin/ManageTickets";
import AdminProfile from "../pages/dashboard/admin/AdminProfile";
import AdvertiseTickets from "../pages/dashboard/admin/AdvertiseTickets";
import AdminDashboard from "../pages/dashboard/admin/AdminDashboard";
import MyAddedTickets from "../pages/dashboard/vendor/MyAddedTickets";
import AdminTransactionHistory from "../pages/dashboard/admin/TransactionHistory";
import VendorTransactionHistory from "../pages/dashboard/vendor/TransactionHistory";
import UserDashboard from "../pages/dashboard/user/UserDashboard";
import VendorDashboard from "../pages/dashboard/vendor/VendorDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "all-ticket",
        element: (
          <PrivateRoute>
            <AllTicket />
          </PrivateRoute>
        ),
      },
      {
        path: "ticket/:id",
        element: (
          <PrivateRoute>
            <TicketDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
  
      {
        path: "user/profile",
        element: (
          <RoleBasedRoute allowedRoles={["user", "vendor", "admin"]}>
            <UserProfile />
          </RoleBasedRoute>
        ),
      },
      {
        path: "user/bookings",
        element: (
          <RoleBasedRoute allowedRoles={["user", "vendor", "admin"]}>
            <MyBookedTickets />
          </RoleBasedRoute>
        ),
      },
      {
        path: "user/transactions",
        element: (
          <RoleBasedRoute allowedRoles={["user", "vendor", "admin"]}>
            <TransactionHistory />
          </RoleBasedRoute>
        ),
      },
      // Vendor Routes
      {
        path: "vendor/dashboard",
        element: (
          <RoleBasedRoute allowedRoles={["vendor"]}>
            <VendorDashboard />
          </RoleBasedRoute>
        ),
      },
      {
        path: "vendor/profile",
        element: (
          <RoleBasedRoute allowedRoles={["vendor"]}>
            <VendorProfile />
          </RoleBasedRoute>
        ),
      },
      {
        path: "vendor/add-ticket",
        element: (
          <RoleBasedRoute allowedRoles={["vendor"]}>
            <AddTicket />
          </RoleBasedRoute>
        ),
      },
      {
        path: "vendor/my-tickets",
        element: (
          <RoleBasedRoute allowedRoles={["vendor"]}>
            <MyAddedTickets />
          </RoleBasedRoute>
        ),
      },
      {
        path: "vendor/bookings",
        element: (
          <RoleBasedRoute allowedRoles={["vendor"]}>
            <RequestedBookings />
          </RoleBasedRoute>
        ),
      },
      {
        path: "vendor/revenue",
        element: (
          <RoleBasedRoute allowedRoles={["vendor"]}>
            <RevenueOverview />
          </RoleBasedRoute>
        ),
      },
      {
        path: "vendor/transactions",
        element: (
          <RoleBasedRoute allowedRoles={["vendor"]}>
            <VendorTransactionHistory />
          </RoleBasedRoute>
        ),
      },
      // Admin Routes
      {
        path: "admin/dashboard",
        element: (
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </RoleBasedRoute>
        ),
      },
      {
        path: "admin/profile",
        element: (
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AdminProfile />
          </RoleBasedRoute>
        ),
      },
      {
        path: "admin/manage-tickets",
        element: (
          <RoleBasedRoute allowedRoles={["admin"]}>
            <ManageTickets />
          </RoleBasedRoute>
        ),
      },
      {
        path: "admin/manage-users",
        element: (
          <RoleBasedRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </RoleBasedRoute>
        ),
      },
      {
        path: "admin/advertise",
        element: (
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AdvertiseTickets />
          </RoleBasedRoute>
        ),
      },
      {
        path: "admin/transactions",
        element: (
          <RoleBasedRoute allowedRoles={["admin"]}>
            <AdminTransactionHistory />
          </RoleBasedRoute>
        ),
      },
    ],
  },
]);
