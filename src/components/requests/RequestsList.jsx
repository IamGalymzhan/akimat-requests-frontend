import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllRequests } from "../../utils/requests";
import { useTranslation } from "react-i18next";

// Request type labels
const requestTypeLabels = {
  financial: "Financial",
  technical: "Technical",
  administrative: "Administrative",
  other: "Other",
};

// Status color mapping
const statusColors = {
  new: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  in_process: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

/**
 * Component to display a list of requests
 * @param {Object} props - Component props
 * @param {Function} [props.onSelectRequest] - Callback when a request is selected
 * @returns {JSX.Element} Rendered component
 */
const RequestsList = ({ onSelectRequest }) => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    status: "",
    type: "",
    search: "",
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getAllRequests();
        setRequests(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        setError(t("failedToLoadRequests"));
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [t]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters to requests
  const filteredRequests = requests.filter((request) => {
    const matchesStatus = !filter.status || request.status === filter.status;
    const matchesType = !filter.type || request.request_type === filter.type;
    const matchesSearch =
      !filter.search ||
      request.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      request.description.toLowerCase().includes(filter.search.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  if (loading) {
    return <div className="text-center py-8">{t("loadingRequests")}</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
        <button
          className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => window.location.reload()}
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="requests-list">
      {/* Filters */}
      <div className="bg-white p-4 mb-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("search")}
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={t("searchByTitleOrDescription")}
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("status")}
            </label>
            <select
              id="status"
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t("allStatuses")}</option>
              <option value="new">{t("new")}</option>
              <option value="in_progress">{t("inProgress")}</option>
              <option value="resolved">{t("resolved")}</option>
              <option value="rejected">{t("rejected")}</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("type")}
            </label>
            <select
              id="type"
              name="type"
              value={filter.type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t("allTypes")}</option>
              <option value="financial">{t("financial")}</option>
              <option value="technical">{t("technical")}</option>
              <option value="administrative">{t("administrative")}</option>
              <option value="other">{t("other")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">{t("noRequestsFound")}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("title")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("type")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("createdBy")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("department")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("date")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectRequest && onSelectRequest(request)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          <Link
                            to={`/requests/${request.id}`}
                            className="hover:text-blue-500"
                          >
                            {request.title}
                          </Link>
                        </div>
                        {request.urgency && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
                            {t("urgent")}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {t(request.request_type) || request.request_type}
                    </div>
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
                        : t(request.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.created_by?.full_name || t("unknown")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.department?.name || t("notAssigned")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestsList;
