import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Register from "../Pages/Auth/Register";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import Home from "../Pages/Home";
import About from "../Pages/About";
import Contact from "../Pages/Contact";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import AllTicket from "../Pages/Tickets/AllTicket";
import TicketDetails from "../Pages/Tickets/TicketDetails";
import DashboardLayout from "../layouts/DashboardLayout";
import ErrorPage from "../Pages/ErrorPage";
import UserProfile from "../Pages/Dashboard/user/UserProfile";
import MyBookedTickets from "../Pages/Dashboard/user/MyBookedTickets";
import TransactionHistory from "../Pages/Dashboard/user/TransactionHistory";
import VendorProfile from "../Pages/Dashboard/Vendor/VendorProfile";
import AddTicket from "../Pages/Dashboard/Vendor/AddTicket";
import RequestedBookings from "../Pages/Dashboard/Vendor/RequestedBookings";
import RevenueOverview from "../Pages/Dashboard/Vendor/RevenueOverview";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsers";
import ManageTickets from "../Pages/Dashboard/Admin/ManageTickets";
import AdminProfile from "../Pages/Dashboard/Admin/AdminProfile";
import AdvertiseTickets from "../Pages/Dashboard/Admin/AdvertiseTickets";
import AdminDashboard from "../Pages/Dashboard/Admin/AdminDashboard";
import MyAddedTickets from "../Pages/Dashboard/Vendor/MyAddedTickets";
import AdminTransactionHistory from "../Pages/Dashboard/Admin/TransactionHistory";
import VendorTransactionHistory from "../Pages/Dashboard/Vendor/TransactionHistory";
import UserDashboard from "../Pages/Dashboard/user/UserDashboard";
import VendorDashboard from "../Pages/Dashboard/Vendor/VendorDashboard";

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
