import { useEffect, useLayoutEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth, ROLES } from "../../context/AuthContext";
import { ROUTES } from "../../routes/routePaths.js";
import { useTranslation } from "react-i18next";

/**
 * Dashboard dispatcher component
 * Redirects to appropriate role-based dashboard
 *
 * This component is optimized to handle redirection at the earliest possible moment
 * using useLayoutEffect to prevent flash of content before redirect
 */
const Dashboard = () => {
  const { isAuthenticated, role, loading, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Use useLayoutEffect for redirection to avoid flash of content
  useLayoutEffect(() => {
    // Only redirect if we have the role and are authenticated
    if (!loading && isAuthenticated) {
      // Check if user profile is incomplete and needs to fill profile data
      // This happens when a user first logs in with EDS
      if (user?.is_new_user) {
        console.log("Redirecting to profile completion");
        navigate(ROUTES.PROFILE_COMPLETION, { replace: true });
        return;
      }

      // If user has completed profile, redirect based on role
      if (role) {
        console.log(`Redirecting to ${role} dashboard`);
        switch (role) {
          case ROLES.ADMIN:
            console.log("Redirecting to admin dashboard");
            navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
            break;
          case ROLES.SUPERVISOR:
            navigate(ROUTES.SUPERVISOR_DASHBOARD, { replace: true });
            break;
          case ROLES.EMPLOYEE:
            navigate(ROUTES.EMPLOYEE_DASHBOARD, { replace: true });
            break;
          default:
            // Don't redirect for unknown roles, will show fallback UI
            break;
        }
      }
    }
  }, [isAuthenticated, role, loading, navigate, user]);

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

  // If for some reason we didn't redirect yet or have an unknown role
  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md max-w-md">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">
            {t("unknownRole")}
          </h2>
          <p className="text-yellow-700">{t("noRoleAssigned")}</p>
          <p className="mt-2 text-yellow-600">
            {t("currentRole")}: {role || t("notAssigned")}
          </p>
        </div>
      </div>
    );
  }

  // Show loading while redirection is happening
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-akimat-blue"></div>
    </div>
  );
};

export default Dashboard;
