import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import AllTicket from "../pages/Tickets/AllTicket";
import TicketDetails from "../pages/Tickets/TicketDetails";
import DashboardLayout from "../layouts/DashboardLayout";
import ErrorPage from "../pages/ErrorPage";
import UserProfile from "../pages/Dashboard/user/UserProfile";
import MyBookedTickets from "../pages/Dashboard/user/MyBookedTickets";
import TransactionHistory from "../pages/Dashboard/user/TransactionHistory";
import VendorProfile from "../pages/Dashboard/Vendor/VendorProfile";
import AddTicket from "../pages/Dashboard/Vendor/AddTicket";
import RequestedBookings from "../pages/Dashboard/Vendor/RequestedBookings";
import RevenueOverview from "../pages/Dashboard/Vendor/RevenueOverview";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageTickets from "../pages/Dashboard/Admin/ManageTickets";
import AdminProfile from "../pages/Dashboard/Admin/AdminProfile";
import AdvertiseTickets from "../pages/Dashboard/Admin/AdvertiseTickets";
import AdminDashboard from "../pages/Dashboard/Admin/AdminDashboard";
import MyAddedTickets from "../pages/Dashboard/Vendor/MyAddedTickets";
import AdminTransactionHistory from "../pages/Dashboard/Admin/TransactionHistory";
import VendorTransactionHistory from "../pages/Dashboard/Vendor/TransactionHistory";
import UserDashboard from "../pages/Dashboard/user/UserDashboard";
import VendorDashboard from "../pages/Dashboard/Vendor/VendorDashboard";

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
        path: "blog",
        element: (
          <PrivateRoute>
            <Blog />
          </PrivateRoute>
        ),
      },
      {
        path: "blog/:id",
        element: (
          <PrivateRoute>
            <BlogDetails />
          </PrivateRoute>
        ),
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
