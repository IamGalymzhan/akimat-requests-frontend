import { useState, useEffect } from "react";
import { createRequest } from "../../utils/requests";
import { getDepartments } from "../../utils/users";
import { useTranslation } from "react-i18next";

/**
 * Form component to create a new request
 * @param {Object} props - Component props
 * @param {Function} props.onSuccess - Callback function called when request is successfully created
 * @param {Function} [props.onCancel] - Callback function called when form is cancelled
 * @returns {JSX.Element} Rendered component
 */
const CreateRequestForm = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    request_type: "financial",
    urgency: false,
    department_id: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch departments for the dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentsData = await getDepartments();
        setDepartments(departmentsData);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
        setError(t("failedToLoadDepartments"));
      }
    };

    fetchDepartments();
  }, [t]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Make sure department_id is a number or null
      const requestData = {
        ...formData,
        department_id: formData.department_id
          ? Number(formData.department_id)
          : null,
      };

      const result = await createRequest(requestData);
      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        request_type: "financial",
        urgency: false,
        department_id: "",
      });

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error("Failed to create request:", err);
      setError(err.response?.data?.message || t("failedToCreateRequest"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium mb-6">{t("createNewRequest")}</h2>

      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {t("requestCreatedSuccessfully")}
        </div>
      )}

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("title")} *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder={t("enterRequestTitle")}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("description")} *
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder={t("describeYourRequest")}
          />
        </div>

        <div>
          <label
            htmlFor="request_type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("requestType")} *
          </label>
          <select
            id="request_type"
            name="request_type"
            required
            value={formData.request_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="financial">{t("financial")}</option>
            <option value="technical">{t("technical")}</option>
            <option value="administrative">{t("administrative")}</option>
            <option value="other">{t("other")}</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="department_id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("department")}
          </label>
          <select
            id="department_id"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{t("selectDepartment")}</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="urgency"
              name="urgency"
              type="checkbox"
              checked={formData.urgency}
              onChange={handleChange}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="urgency" className="font-medium text-gray-700">
              {t("markAsUrgent")}
            </label>
            <p className="text-gray-500">{t("urgentRequestHelp")}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t("cancel")}
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {loading ? t("creating") : t("createRequest")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequestForm;
