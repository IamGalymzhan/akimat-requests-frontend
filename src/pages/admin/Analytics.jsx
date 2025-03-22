import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import api from "../../utils/api";

const Analytics = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate chart colors
  const statusColors = {
    pending: "#FCD34D",
    approved: "#34D399",
    rejected: "#F87171",
    completed: "#60A5FA",
    "in-progress": "#A78BFA",
  };

  const departmentColors = {
    HR: "#EC4899",
    IT: "#3B82F6",
    Finance: "#10B981",
    Marketing: "#F59E0B",
    Operations: "#8B5CF6",
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/statistics");
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
        setError(
          t("failedToLoadStatistics") ||
            "Failed to load statistics. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [t]);

  // Calculate the total for a data object
  const calculateTotal = (dataObj) => {
    return dataObj?.reduce((acc, item) => acc + item.request_count, 0) || 0;
  };

  // Create percentage for visualization
  const calculatePercentage = (value, total) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-akimat-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h1 className="text-xl font-bold text-red-500 mb-4">{t("error")}</h1>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-akimat-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-akimat-blue"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const departmentTotal = calculateTotal(data.department_stats);
  const typeTotal = calculateTotal(data.request_type_stats);

  // Convert request_type_stats to a format similar to requestsByStatus
  const requestsByStatus = data.request_type_stats.reduce((acc, item) => {
    acc[item.type] = item.request_count;
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("analyticsDashboard")}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-akimat-blue">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">{t("totalRequests")}</p>
              <h3 className="font-bold text-2xl">{data.total_requests}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">{t("completionRate")}</p>
              <h3 className="font-bold text-2xl">
                {Math.round(data.completion_rate.completion_rate * 100)}%
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">{t("pendingRequests")}</p>
              <h3 className="font-bold text-2xl">
                {data.total_requests - data.completion_rate.completed_requests}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {t("requestsByStatus")}
          </h2>
          <div className="space-y-4">
            {data.request_type_stats.map((item) => (
              <div key={item.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {t(item.type.replace("-", ""))}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {item.request_count}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${calculatePercentage(
                        item.request_count,
                        typeTotal
                      )}%`,
                      backgroundColor: statusColors[item.type] || "#60A5FA",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {t("requestsByDepartment")}
          </h2>
          <div className="space-y-4">
            {data.department_stats.map((department) => (
              <div key={department.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">
                    {department.name}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {department.request_count}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${calculatePercentage(
                        department.request_count,
                        departmentTotal
                      )}%`,
                      backgroundColor:
                        departmentColors[department.name] || "#60A5FA",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {t("topRequesters")}
        </h2>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("name")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("email")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("count")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.top_users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {user.request_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
