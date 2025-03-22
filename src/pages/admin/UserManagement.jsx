import { useState, useEffect } from "react";
import { useAuth, ROLES } from "../../context/AuthContext";
import api from "../../utils/api";
import UserDetails from "../../components/admin/UserDetails";
import { useTranslation } from "react-i18next";

// Status color mapping for visual indication
const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
};

// Role labels for display now handled through translations
const getRoleLabel = (t, role) => {
  switch (role) {
    case "employee":
      return t("employee");
    case "supervisor":
      return t("supervisor");
    case "admin":
      return t("admin");
    default:
      return role;
  }
};

/**
 * Admin user management page
 * @returns {JSX.Element} Rendered component
 */
const UserManagement = () => {
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [editForm, setEditForm] = useState({
    email: "",
    full_name: "",
    is_active: true,
    is_superuser: false,
    phone_number: "",
    organization: "",
    position: "",
    iin: "",
    status: "active",
    role: "employee",
    password: "",
  });

  // Debug information
  console.log("UserManagement component - Current user:", {
    fullName: user?.full_name,
    email: user?.email,
    role: role,
    is_superuser: user?.is_superuser,
  });

  // Fetch users from API when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setApiError(null);

        const response = await api.get("/users");
        console.log("Fetched users:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setApiError(t("failedToLoadUserData"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [t]);

  // Check if user has admin role
  if (!user || role !== ROLES.ADMIN) {
    console.log("Access denied to UserManagement. User role:", role);
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          {t("accessDenied")}
        </h1>
        <p>{t("noPermissionToAccess")}</p>
      </div>
    );
  }

  // Get unique departments for the filter dropdown
  const departments = [
    ...new Set(
      users.filter((user) => user.organization).map((user) => user.organization)
    ),
  ];

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      (user.full_name &&
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = filterRole === "" || user.role === filterRole;
    const matchesDepartment =
      filterDepartment === "" || user.organization === filterDepartment;

    return matchesSearch && matchesRole && matchesDepartment;
  });

  const handleAddUser = () => {
    setIsNewUser(true);
    setEditForm({
      email: "",
      full_name: "",
      is_active: true,
      is_superuser: false,
      phone_number: "",
      organization: "",
      position: "",
      iin: "",
      status: "active",
      role: "employee",
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setIsNewUser(false);
    setSelectedUser(user);
    setEditForm({
      email: user.email || "",
      full_name: user.full_name || "",
      is_active: user.is_active !== undefined ? user.is_active : true,
      is_superuser: user.is_superuser || false,
      phone_number: user.phone_number || "",
      organization: user.organization || "",
      position: user.position || "",
      iin: user.iin || "",
      status: user.status || "active",
      role: user.role || "employee",
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isNewUser) {
        // Create a new user via API
        const userData = { ...editForm };
        // If password is empty when editing, don't send it
        if (!isNewUser && !userData.password) {
          delete userData.password;
        }
        await api.post("/users", userData);
      } else {
        // Update existing user via API
        const userData = { ...editForm };
        // Don't send password if it's empty when updating
        if (!userData.password) {
          delete userData.password;
        }
        await api.put(`/users/${selectedUser.id}`, userData);
      }

      // Refresh the user list after successful operation
      const response = await api.get("/users");
      setUsers(response.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("User operation failed:", error);
      // Handle error (could add an error state to display in the modal)
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-akimat-blue"></div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{t("error")}</h1>
        <p>{apiError}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
          {t("userManagement")}
        </h1>
        <button
          onClick={handleAddUser}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-akimat-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-akimat-blue"
        >
          {t("addNewUser")}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-2">
            <label htmlFor="search" className="sr-only">
              {t("search")}
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-akimat-blue focus:border-akimat-blue block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder={t("searchByNameOrEmail")}
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

          <div>
            <label htmlFor="role-filter" className="sr-only">
              {t("filterByRole")}
            </label>
            <select
              id="role-filter"
              name="role-filter"
              className="focus:ring-akimat-blue focus:border-akimat-blue block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">{t("allRoles")}</option>
              <option value="admin">{t("administrator")}</option>
              <option value="supervisor">{t("supervisor")}</option>
              <option value="employee">{t("employee")}</option>
            </select>
          </div>

          <div>
            <label htmlFor="department-filter" className="sr-only">
              {t("filterByDepartment")}
            </label>
            <select
              id="department-filter"
              name="department-filter"
              className="focus:ring-akimat-blue focus:border-akimat-blue block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">{t("allDepartments")}</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">{t("noUsersFound")}</p>
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("role")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("organization")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("status")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t("createdAt")}
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
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getRoleLabel(t, user.role)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.organization || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusColors[user.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status ? t(user.status) : t("unknown")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-akimat-blue hover:text-blue-900"
                        onClick={() => handleEditUser(user)}
                      >
                        {t("edit")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        {isNewUser ? t("addNewUser") : t("editUser")}
                      </h3>

                      <div className="grid grid-cols-1 gap-5">
                        <div>
                          <input
                            type="text"
                            name="full_name"
                            id="full_name"
                            required
                            placeholder={t("fullNamePlaceholder")}
                            className="shadow-sm focus:ring-akimat-blue focus:border-akimat-blue block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-md"
                            value={editForm.full_name}
                            onChange={handleFormChange}
                          />
                        </div>

                        <div>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            placeholder={t("emailPlaceholder")}
                            className="shadow-sm focus:ring-akimat-blue focus:border-akimat-blue block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-md"
                            value={editForm.email}
                            onChange={handleFormChange}
                          />
                        </div>

                        {isNewUser && (
                          <div>
                            <input
                              type="password"
                              name="password"
                              id="password"
                              required={isNewUser}
                              placeholder={t("passwordPlaceholder")}
                              className="shadow-sm focus:ring-akimat-blue focus:border-akimat-blue block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-md"
                              value={editForm.password}
                              onChange={handleFormChange}
                            />
                          </div>
                        )}

                        {!isNewUser && (
                          <div>
                            <input
                              type="password"
                              name="password"
                              id="password"
                              placeholder={t("newPasswordPlaceholder")}
                              className="shadow-sm focus:ring-akimat-blue focus:border-akimat-blue block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-md"
                              value={editForm.password}
                              onChange={handleFormChange}
                            />
                          </div>
                        )}

                        <div>
                          <input
                            type="text"
                            name="phone_number"
                            id="phone_number"
                            placeholder={t("phoneNumberPlaceholder")}
                            className="shadow-sm focus:ring-akimat-blue focus:border-akimat-blue block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-md"
                            value={editForm.phone_number}
                            onChange={handleFormChange}
                          />
                        </div>

                        <div>
                          <select
                            name="role"
                            id="role"
                            required
                            className="shadow-sm focus:ring-akimat-blue focus:border-akimat-blue block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-md text-gray-500"
                            value={editForm.role}
                            onChange={handleFormChange}
                          >
                            <option value="" disabled>
                              {t("selectRole")}
                            </option>
                            <option value="employee">{t("employee")}</option>
                            <option value="supervisor">
                              {t("supervisor")}
                            </option>
                            <option value="admin">{t("administrator")}</option>
                          </select>
                        </div>

                        <div>
                          <input
                            type="text"
                            name="organization"
                            id="organization"
                            placeholder={t("organizationPlaceholder")}
                            className="shadow-sm focus:ring-akimat-blue focus:border-akimat-blue block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-md"
                            value={editForm.organization}
                            onChange={handleFormChange}
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            name="position"
                            id="position"
                            placeholder={t("positionPlaceholder")}
                            className="shadow-sm focus:ring-akimat-blue focus:border-akimat-blue block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-md"
                            value={editForm.position}
                            onChange={handleFormChange}
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            name="iin"
                            id="iin"
                            placeholder={t("iinPlaceholder")}
                            className="shadow-sm focus:ring-akimat-blue focus:border-akimat-blue block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-md"
                            value={editForm.iin}
                            onChange={handleFormChange}
                          />
                        </div>

                        <div className="flex items-center bg-gray-50 p-3 rounded-md">
                          <input
                            id="is_active"
                            name="is_active"
                            type="checkbox"
                            className="h-4 w-4 text-akimat-blue focus:ring-akimat-blue border-gray-300 rounded"
                            checked={editForm.is_active}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                is_active: e.target.checked,
                              }))
                            }
                          />
                          <span className="ml-2 block text-sm text-gray-900">
                            {t("activeUser")}
                          </span>
                        </div>

                        {role === ROLES.ADMIN && (
                          <div className="flex items-center bg-gray-50 p-3 rounded-md">
                            <input
                              id="is_superuser"
                              name="is_superuser"
                              type="checkbox"
                              className="h-4 w-4 text-akimat-blue focus:ring-akimat-blue border-gray-300 rounded"
                              checked={editForm.is_superuser}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  is_superuser: e.target.checked,
                                }))
                              }
                            />
                            <span className="ml-2 block text-sm text-gray-900">
                              {t("superuserPrivileges")}
                            </span>
                          </div>
                        )}

                        {!isNewUser && (
                          <div>
                            <select
                              name="status"
                              id="status"
                              required
                              className="shadow-sm focus:ring-akimat-blue focus:border-akimat-blue block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-md text-gray-500"
                              value={editForm.status}
                              onChange={handleFormChange}
                            >
                              <option value="" disabled>
                                {t("selectStatus")}
                              </option>
                              <option value="active">{t("active")}</option>
                              <option value="inactive">{t("inactive")}</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-akimat-blue text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-akimat-blue sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isNewUser ? t("createUser") : t("saveChanges")}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-akimat-blue sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
