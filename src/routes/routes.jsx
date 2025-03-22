import { ROLES } from "../context/AuthContext";
import { ROUTES } from "./routePaths.js";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Pages
import Home from "../pages/common/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProfileCompletion from "../pages/auth/ProfileCompletion";
import Dashboard from "../pages/dashboard/Dashboard";
import EmployeeDashboard from "../pages/dashboard/EmployeeDashboard";
import SupervisorDashboard from "../pages/dashboard/SupervisorDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import MyRequests from "../pages/requests/MyRequests";
import AllRequests from "../pages/requests/AllRequests";
import RequestsPage from "../pages/requests/RequestsPage";
import RequestDetailsPage from "../pages/requests/RequestDetailsPage";
import CreateRequestPage from "../pages/requests/CreateRequestPage";
import Analytics from "../pages/admin/Analytics";
import Profile from "../pages/common/Profile";
import NotFound from "../pages/common/NotFound";

/**
 * Application route configuration with proper nesting for layouts
 */
export const routes = [
  // Main Layout Routes
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Home />,
        index: true,
      },
    ],
  },

  // Auth Layout Routes
  {
    path: "",
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <Login />,
        protection: "new-user",
      },
      {
        path: ROUTES.REGISTER,
        element: <Register />,
        protection: "new-user",
      },
      {
        path: ROUTES.PROFILE_COMPLETION,
        element: <ProfileCompletion />,
        protection: "authenticated",
      },
    ],
  },

  // Dashboard Layout Routes
  {
    path: "",
    element: <DashboardLayout />,
    protection: "authenticated",
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: ROUTES.EMPLOYEE_DASHBOARD,
        element: <EmployeeDashboard />,
        protection: "role-based",
        allowedRoles: [ROLES.EMPLOYEE, ROLES.SUPERVISOR, ROLES.ADMIN],
      },
      {
        path: ROUTES.SUPERVISOR_DASHBOARD,
        element: <SupervisorDashboard />,
        protection: "role-based",
        allowedRoles: [ROLES.SUPERVISOR, ROLES.ADMIN],
      },
      {
        path: ROUTES.ADMIN_DASHBOARD,
        element: <AdminDashboard />,
        protection: "role-based",
        allowedRoles: [ROLES.ADMIN],
      },
      {
        path: ROUTES.PROFILE,
        element: <Profile />,
      },
      {
        path: ROUTES.MY_REQUESTS,
        element: <MyRequests />,
        protection: "role-based",
        allowedRoles: [ROLES.EMPLOYEE, ROLES.ADMIN],
      },
      {
        path: ROUTES.REQUESTS,
        element: <RequestsPage />,
        protection: "authenticated",
      },
      {
        path: ROUTES.CREATE_REQUEST,
        element: <CreateRequestPage />,
        protection: "authenticated",
      },
      {
        path: ROUTES.REQUEST_DETAILS,
        element: <RequestDetailsPage />,
        protection: "authenticated",
      },
      {
        path: ROUTES.USER_MANAGEMENT,
        element: <UserManagement />,
        protection: "role-based",
        allowedRoles: [ROLES.ADMIN],
      },
      {
        path: ROUTES.ALL_REQUESTS,
        element: <AllRequests />,
        protection: "role-based",
        allowedRoles: [ROLES.ADMIN, ROLES.EMPLOYEE],
      },
      {
        path: ROUTES.ANALYTICS,
        element: <Analytics />,
        protection: "role-based",
        allowedRoles: [ROLES.ADMIN],
      },
    ],
  },

  // 404 Not Found
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFound />,
  },
];

export default routes;
