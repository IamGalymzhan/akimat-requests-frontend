import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllRequests } from "../../utils/requests";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
  "in-progress": "bg-purple-100 text-purple-800",
};

const AllRequests = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real requests data when component mounts
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const requestsData = await getAllRequests();
        setRequests(requestsData || []);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError(t("failedToLoadRequests"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [t]);

  // Get unique departments for filter
  const departments = [
    ...new Set(requests.map((req) => req.department).filter(Boolean)),
  ];

  // Filter requests based on search term, status and department filters
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchTerm === "" ||
      request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filter === "all" || request.status === filter;
    const matchesDepartment =
      departmentFilter === "" || request.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>{t("loadingRequests")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-akimat-blue hover:bg-blue-700 focus:outline-none"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
          {t("allRequests")}
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-48">
            <label htmlFor="status-filter" className="sr-only">
              {t("filterByStatus")}
            </label>
            <select
              id="status-filter"
              className="rounded-md border-gray-300 shadow-sm focus:border-akimat-blue focus:ring focus:ring-akimat-blue focus:ring-opacity-50 w-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">{t("allStatuses")}</option>
              <option value="pending">{t("pending")}</option>
              <option value="approved">{t("approved")}</option>
              <option value="rejected">{t("rejected")}</option>
              <option value="in-progress">{t("inProgress")}</option>
              <option value="completed">{t("completed")}</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="department-filter" className="sr-only">
              {t("filterByDepartment")}
            </label>
            <select
              id="department-filter"
              className="rounded-md border-gray-300 shadow-sm focus:border-akimat-blue focus:ring focus:ring-akimat-blue focus:ring-opacity-50 w-full"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">{t("allDepartments")}</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-64">
            <label htmlFor="search" className="sr-only">
              {t("search")}
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                id="search"
                className="focus:ring-akimat-blue focus:border-akimat-blue block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder={t("searchRequestsPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">{t("noRequestsFound")}</p>
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
                    {t("department")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("employee")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("supervisor")}
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
                      {request.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.employee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.supervisor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusColors[request.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {request.status === "in_process" ||
                        request.status === "in_progress" ||
                        request.status === "in-progress"
                          ? t("inProgress")
                          : t(request.status) || t("unknown")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/requests/${request.id}`}
                        className="text-akimat-blue hover:text-blue-900"
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

export default AllRequests;
