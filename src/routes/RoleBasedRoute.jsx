import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../providers/AuthProvider";

const ADMIN_EMAIL = "sazid98@gmail.com";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, userRole, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Force admin role for specific email
  const effectiveRole = user.email === ADMIN_EMAIL ? 'admin' : userRole;

  console.log('🔒 RoleBasedRoute check - email:', user.email, 'effectiveRole:', effectiveRole, 'allowedRoles:', allowedRoles);

  if (!effectiveRole || !allowedRoles.includes(effectiveRole)) {
    // Redirect to appropriate dashboard based on role
    const redirectPaths = {
      admin: "/dashboard/admin/dashboard",
      vendor: "/dashboard/vendor/profile",
      user: "/dashboard/user/profile",
    };
    return <Navigate to={redirectPaths[effectiveRole] || "/dashboard/user/profile"} replace />;
  }

  return children;
};

export default RoleBasedRoute;
