import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { useTranslation } from "react-i18next";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {t("employeeDashboard")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-md shadow border border-gray-200 hover:shadow-lg transition-all flex flex-col h-full">
            <div>
              <h2 className="text-lg font-semibold mb-3">{t("myRequests")}</h2>
              <p className="text-gray-600 mb-4">{t("viewManageRequests")}</p>
            </div>
            <div className="mt-auto">
              <Link
                to={ROUTES.MY_REQUESTS}
                className="block w-full py-2 text-center bg-akimat-blue text-white rounded hover:bg-akimat-light-blue transition-colors"
              >
                {t("viewRequests")}
              </Link>
            </div>
          </div>

          <div className="bg-white p-5 rounded-md shadow border border-gray-200 hover:shadow-lg transition-all flex flex-col h-full">
            <div>
              <h2 className="text-lg font-semibold mb-3">{t("allRequests")}</h2>
              <p className="text-gray-600 mb-4">{t("viewAllRequests")}</p>
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
              <h2 className="text-lg font-semibold mb-3">{t("newRequest")}</h2>
              <p className="text-gray-600 mb-4">{t("submitNewRequest")}</p>
            </div>
            <div className="mt-auto">
              <Link
                to={ROUTES.CREATE_REQUEST}
                className="block w-full py-2 text-center bg-akimat-blue text-white rounded hover:bg-akimat-light-blue transition-colors"
              >
                {t("createRequest")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
