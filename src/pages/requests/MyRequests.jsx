import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllRequests } from "../../utils/requests";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { useTranslation } from "react-i18next";

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  in_process: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
};

const MyRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [filteredRequests, setFilteredRequests] = useState([]);

  // Fetch requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const requestsData = await getAllRequests();
        console.log("Requests data:", requestsData);
        setRequests(requestsData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        setError(t("failedToLoadRequestsRetry"));
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [t]);

  // Ensure requests is always treated as an array
  const safeRequests = Array.isArray(requests) ? requests : [];

  // Filter requests based on status
  useEffect(() => {
    if (filter === "in_progress" || filter === "in_process") {
      // If either progress filter is selected, show requests with either status
      setFilteredRequests(
        safeRequests.filter(
          (request) =>
            request &&
            (request.status === "in_progress" ||
              request.status === "in_process")
        )
      );
    } else if (filter === "all") {
      setFilteredRequests(safeRequests);
    } else {
      setFilteredRequests(
        safeRequests.filter((request) => request && request.status === filter)
      );
    }
  }, [filter, safeRequests]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">{t("loadingRequests")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 text-red-500">
          {error}
          <button
            className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => window.location.reload()}
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("myRequests")}</h1>
        <button
          onClick={() => navigate(ROUTES.CREATE_REQUEST)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          {t("createNewRequest")}
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <label
              htmlFor="status-filter"
              className="mr-2 text-sm font-medium text-gray-700"
            >
              {t("filterByStatus")}:
            </label>
            <select
              id="status-filter"
              className="rounded-md border-gray-300 shadow-sm focus:border-akimat-blue focus:ring focus:ring-akimat-blue focus:ring-opacity-50"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">{t("all")}</option>
              <option value="new">{t("new")}</option>
              <option value="in_progress">{t("inProgress")}</option>
              <option value="resolved">{t("resolved")}</option>
              <option value="rejected">{t("rejected")}</option>
            </select>
          </div>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">{t("noRequestsFound")}.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("request")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("created")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("updated")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("status")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.created_at
                        ? new Date(request.created_at).toLocaleDateString()
                        : t("notAvailable")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.updated_at
                        ? new Date(request.updated_at).toLocaleDateString()
                        : t("notAvailable")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusColors[request.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {request.status === "in_process" ||
                        request.status === "in_progress"
                          ? t("inProgress")
                          : request.status
                          ? t(request.status)
                          : t("unknown")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/requests/${request.id}`}
                        className="text-akimat-blue hover:text-blue-900 mr-4"
                      >
                        {t("view")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
