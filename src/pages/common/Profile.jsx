import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCurrentUser, updateCurrentUser } from "../../utils/users";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { user, fetchCurrentUser } = useAuth();
  const { t } = useTranslation();
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    organization: "",
    position: "",
    iin: "",
    role: "",
    status: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user profile data directly from API to ensure latest data
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const userData = await getCurrentUser();
      setProfileData({
        full_name: userData.full_name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        organization: userData.organization || "",
        position: userData.position || "",
        iin: userData.iin || "",
        role: userData.role || "",
        status: userData.status || "",
      });
      setError(null);
    } catch (err) {
      console.error("Failed to fetch profile data:", err);
      setError(t("failedToLoadUserData"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Fallback to context user data if API fetch fails
  useEffect(() => {
    if (user && !profileData.full_name) {
      setProfileData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        organization: user.organization || "",
        position: user.position || "",
        iin: user.iin || "",
        role: user.role || "",
        status: user.status || "",
      });
    }
  }, [user, profileData.full_name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      // Only send editable fields to the API
      const updateData = {
        full_name: profileData.full_name,
        phone_number: profileData.phone_number,
        organization: profileData.organization,
        position: profileData.position,
        iin: profileData.iin,
      };

      await updateCurrentUser(updateData);

      // Refresh user data in context
      await fetchCurrentUser();

      setSuccessMessage(t("profileUpdatedSuccessfully"));
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.message || t("profileUpdateError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !isEditing) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-akimat-blue"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-3xl mx-auto">
        <div className="bg-akimat-blue px-6 py-4">
          <h1 className="text-white text-2xl font-bold">{t("profile")}</h1>
        </div>

        <div className="px-6 py-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("fullNamePlaceholder")} *
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={profileData.full_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-akimat-blue focus:border-akimat-blue"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("emailCannotBeChanged")}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("phone")}
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={profileData.phone_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-akimat-blue focus:border-akimat-blue"
                  />
                </div>

                <div>
                  <label
                    htmlFor="organization"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("organization")}
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={profileData.organization}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-akimat-blue focus:border-akimat-blue"
                  />
                </div>

                <div>
                  <label
                    htmlFor="position"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("position")}
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={profileData.position}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-akimat-blue focus:border-akimat-blue"
                  />
                </div>

                <div>
                  <label
                    htmlFor="iin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("iinPlaceholder")}
                  </label>
                  <input
                    type="text"
                    id="iin"
                    name="iin"
                    value={profileData.iin}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-akimat-blue focus:border-akimat-blue"
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("role")}
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={profileData.role}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("roleAssignedByAdmins")}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("status")}
                  </label>
                  <input
                    type="text"
                    id="status"
                    name="status"
                    value={profileData.status}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-akimat-blue"
                  disabled={isLoading}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-akimat-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-akimat-blue ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? t("submitting") : t("saveChanges")}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-center justify-end mb-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-akimat-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-akimat-blue"
                >
                  {t("editUser")}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("fullNamePlaceholder")}
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {profileData.full_name || t("notAvailable")}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("email")}
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {profileData.email || t("notAvailable")}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("phone")}
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {profileData.phone_number || t("notAvailable")}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("organization")}
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {profileData.organization || t("notAvailable")}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("position")}
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {profileData.position || t("notAvailable")}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("iinPlaceholder")}
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {profileData.iin || t("notAvailable")}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("role")}
                  </h3>
                  <p className="mt-1 text-lg text-gray-900 capitalize">
                    {profileData.role ? t(profileData.role) : t("notAssigned")}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("status")}
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {profileData.status
                      ? t(profileData.status)
                      : t("notAvailable")}
                  </p>
                </div>
              </div>

              {/* Keep the security section for future password change functionality */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {t("security")}
                </h3>
                <div className="mt-4">
                  <button
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-akimat-blue"
                    onClick={() => alert(t("passwordChangeFutureFeature"))}
                  >
                    {t("changePassword")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
