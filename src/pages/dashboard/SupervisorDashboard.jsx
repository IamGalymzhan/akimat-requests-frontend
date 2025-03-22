import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { useTranslation } from "react-i18next";

const SupervisorDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {t("supervisorDashboard")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-md shadow border border-gray-200 hover:shadow-lg transition-all flex flex-col h-full">
            <div>
              <h2 className="text-lg font-semibold mb-3">
                {t("pendingRequests")}
              </h2>
              <p className="text-gray-600 mb-4">{t("reviewApproveRequests")}</p>
            </div>
            <div className="mt-auto">
              <Link
                to={ROUTES.REQUESTS}
                className="block w-full py-2 text-center bg-akimat-blue text-white rounded hover:bg-akimat-light-blue transition-colors"
              >
                {t("review")}
              </Link>
            </div>
          </div>

          <div className="bg-white p-5 rounded-md shadow border border-gray-200 hover:shadow-lg transition-all flex flex-col h-full">
            <div>
              <h2 className="text-lg font-semibold mb-3">{t("allRequests")}</h2>
              <p className="text-gray-600 mb-4">{t("manageAssignRequests")}</p>
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
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
