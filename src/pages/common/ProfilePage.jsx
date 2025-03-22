import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "../../components/UserProfile";
import DepartmentsList from "../../components/DepartmentsList";
import { useTranslation } from "react-i18next";

/**
 * Profile page component
 * @returns {JSX.Element} Rendered component
 */
const ProfilePage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
  };

  return (
    <div className="profile-page">
      <h1 className="text-2xl font-bold mb-6">{t("yourProfile")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main profile section */}
        <div className="lg:col-span-2">
          <UserProfile />

          {selectedDepartment && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium mb-3">
                {t("selectedDepartment")}
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">{t("name")}:</span>{" "}
                  {selectedDepartment.name}
                </div>
                <div>
                  <span className="font-semibold">ID:</span>{" "}
                  {selectedDepartment.id}
                </div>
                <div>
                  <span className="font-semibold">{t("created")}:</span>{" "}
                  {new Date(selectedDepartment.created_at).toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">{t("updated")}:</span>{" "}
                  {new Date(selectedDepartment.updated_at).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <DepartmentsList
              onSelectDepartment={handleDepartmentSelect}
              selectedDepartmentId={selectedDepartment?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
