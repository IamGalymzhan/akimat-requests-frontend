import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    console.log("AdminDashboard mounted with user:", user);
  }, [user]);

  console.log("AdminDashboard rendering");

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {t("adminDashboard")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-md shadow border border-gray-200 hover:shadow-lg transition-all flex flex-col h-full">
            <div>
              <h2 className="text-lg font-semibold mb-3">
                {t("userManagement")}
              </h2>
              <p className="text-gray-600 mb-4">{t("manageSystemUsers")}</p>
            </div>
            <div className="mt-auto">
              <Link
                to={ROUTES.USER_MANAGEMENT}
                className="block w-full py-2 text-center bg-akimat-blue text-white rounded hover:bg-akimat-light-blue transition-colors"
              >
                {t("manage")}
              </Link>
            </div>
          </div>

          <div className="bg-white p-5 rounded-md shadow border border-gray-200 hover:shadow-lg transition-all flex flex-col h-full">
            <div>
              <h2 className="text-lg font-semibold mb-3">{t("allRequests")}</h2>
              <p className="text-gray-600 mb-4">{t("viewSystemRequests")}</p>
            </div>
            <div className="mt-auto">
              <Link
                to={ROUTES.REQUESTS}
                className="block w-full py-2 text-center bg-akimat-blue text-white rounded hover:bg-akimat-light-blue transition-colors"
              >
                {t("viewAll")}
              </Link>
            </div>
          </div>

          <div className="bg-white p-5 rounded-md shadow border border-gray-200 hover:shadow-lg transition-all flex flex-col h-full">
            <div>
              <h2 className="text-lg font-semibold mb-3">{t("analytics")}</h2>
              <p className="text-gray-600 mb-4">{t("viewSystemStats")}</p>
            </div>
            <div className="mt-auto">
              <Link
                to={ROUTES.ANALYTICS}
                className="block w-full py-2 text-center bg-akimat-blue text-white rounded hover:bg-akimat-light-blue transition-colors"
              >
                {t("viewReports")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
