import { Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "./routePaths.js";

// Protected route that requires authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-akimat-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return children || <Outlet />;
};

// Route that redirects authenticated users to dashboard
const NewUserRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-akimat-blue"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} />;
  }

  return children || <Outlet />;
};

// Route that checks for role-based access
const RoleBasedRoute = ({ children, allowedRoles }) => {
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
    return <Navigate to={ROUTES.LOGIN} />;
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
    return <Navigate to={ROUTES.DASHBOARD} />;
  }

  return children || <Outlet />;
};

// Function to apply the layout to a route's element
const withLayout = (element, Layout) => {
  if (!Layout) return element;
  return <Layout>{element}</Layout>;
};

/**
 * Apply protection to a route element
 * @param {Object} route The route configuration object
 * @returns {JSX.Element} The protected element
 */
const applyProtection = (route) => {
  const { element, protection, allowedRoles } = route;

  if (!protection) return element;

  switch (protection) {
    case "authenticated":
      return <ProtectedRoute>{element}</ProtectedRoute>;
    case "new-user":
      return <NewUserRoute>{element}</NewUserRoute>;
    case "role-based":
      return (
        <RoleBasedRoute allowedRoles={allowedRoles}>{element}</RoleBasedRoute>
      );
    default:
      return element;
  }
};

/**
 * Render routes recursively, handling nested routes
 * @param {Array} routes Array of route objects
 * @returns {Array} Array of Route components
 */
export const renderRoutes = (routes) => {
  return routes.map((route) => {
    // Extract route properties
    const { path, element, children, protection, allowedRoles, index } = route;

    // For layout routes that have children
    if (children && children.length) {
      // First apply protection to the parent/layout route if needed
      const protectedElement = protection
        ? applyProtection({ element, protection, allowedRoles })
        : element;

      // Then render the parent route with its children
      return (
        <Route key={path} path={path} element={protectedElement} index={index}>
          {renderRoutes(children)}
        </Route>
      );
    }

    // For leaf routes with no children
    const finalElement = protection
      ? applyProtection({ element, protection, allowedRoles })
      : element;

    return (
      <Route key={path} path={path} element={finalElement} index={index} />
    );
  });
};

export { ProtectedRoute, NewUserRoute, RoleBasedRoute };
