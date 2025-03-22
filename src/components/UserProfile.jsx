import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "../utils/users";
import { useTranslation } from "react-i18next";

/**
 * Component to display user profile information
 * @returns {JSX.Element} Rendered component
 */
const UserProfile = () => {
  const { user, fetchCurrentUser } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshUserData = async () => {
    try {
      setLoading(true);
      await fetchCurrentUser();
      setError(null);
    } catch (err) {
      console.error("Failed to refresh user data:", err);
      setError(t("failedToRefreshProfile"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-4">{t("userNotAuthenticated")}</div>;
  }

  return (
    <div className="user-profile p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("userProfile")}</h2>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={refreshUserData}
          disabled={loading}
        >
          {loading ? t("refreshing") : t("refresh")}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">{t("fullNamePlaceholder")}:</div>
          <div>{user.full_name}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">{t("email")}:</div>
          <div>{user.email}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">{t("userId")}:</div>
          <div>{user.id}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">{t("accountStatus")}:</div>
          <div>
            {user.is_active ? (
              <span className="text-green-500">{t("active")}</span>
            ) : (
              <span className="text-red-500">{t("inactive")}</span>
            )}
          </div>
        </div>

        {user.is_superuser && (
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600">{t("adminStatus")}:</div>
            <div>
              <span className="text-blue-500">{t("administrator")}</span>
            </div>
          </div>
        )}

        {user.role && (
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600">{t("role")}:</div>
            <div>
              <span className="text-gray-800">{t(user.role)}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">{t("created")}:</div>
          <div>{new Date(user.created_at).toLocaleString()}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">{t("updated")}:</div>
          <div>{new Date(user.updated_at).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
