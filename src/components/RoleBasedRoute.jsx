import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Role-based route protection component
 * @param {Object} props Component props
 * @param {string|string[]} props.allowedRoles Single role or array of roles allowed to access this route
 * @param {string} [props.redirectPath="/dashboard"] Path to redirect to if access is denied
 * @param {React.ReactNode} props.children Child components to render if access is granted
 * @returns {React.ReactNode} The protected route content or a redirect
 */
const RoleBasedRoute = ({
  allowedRoles,
  redirectPath = "/dashboard",
  children,
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-akimat-blue"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const userRole = user?.role;
  const allowedRolesArray = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  // Check if user's role is included in the allowed roles
  if (!userRole || !allowedRolesArray.includes(userRole)) {
    console.log(
      `Access denied: User role ${userRole} not in allowed roles: ${allowedRolesArray.join(
        ", "
      )}`
    );
    return <Navigate to={redirectPath} />;
  }

  return children;
};

export default RoleBasedRoute;
