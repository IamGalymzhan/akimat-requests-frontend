/**
 * Centralized route paths for the application
 * Using this file ensures consistency in route references across the app
 */

export const ROUTES = {
  // Public routes
  HOME: "/",

  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",

  // Dashboard routes
  DASHBOARD: "/dashboard",
  EMPLOYEE_DASHBOARD: "/employee-dashboard",
  SUPERVISOR_DASHBOARD: "/supervisor-dashboard",
  ADMIN_DASHBOARD: "/admin-dashboard",

  // User routes
  PROFILE: "/profile",
  PROFILE_COMPLETION: "/profile-completion",

  // Request routes
  MY_REQUESTS: "/my-requests",
  TEAM_REQUESTS: "/team-requests",
  ALL_REQUESTS: "/all-requests",
  REQUESTS: "/requests",
  CREATE_REQUEST: "/requests/create",
  REQUEST_DETAILS: "/requests/:id",

  // Admin routes
  USER_MANAGEMENT: "/user-management",
  ANALYTICS: "/analytics",

  // Fallback
  NOT_FOUND: "*",
};

export default ROUTES;
