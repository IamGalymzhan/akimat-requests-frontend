import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { useTranslation } from "react-i18next";

const ProfileCompletion = () => {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    organization: "",
    position: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Send profile completion data to backend
      const response = await api.put("/auth/complete", {
        email: formData.email,
        phone_number: formData.phone,
        organization: formData.organization,
        position: formData.position,
        is_new_user: false,
      });

      // Update the user data with the new information
      const updatedUserData = {
        ...user,
        ...response.data,
        is_new_user: false, // Update the flag
      };

      // Update user data in context and localStorage
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      setUser(updatedUserData);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Profile completion error:", err);
      setError(err.response?.data?.message || t("profileCompletionError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        {t("completeYourProfile")}
      </h2>
      <p className="text-gray-600 text-center mb-8">
        {t("profileCompletionInfo")}
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("email")} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-akimat-blue focus:border-akimat-blue"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("phone")} *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
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
            value={formData.organization}
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
            value={formData.position}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-akimat-blue focus:border-akimat-blue"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-akimat-blue hover:bg-akimat-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-akimat-blue disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t("submitting") : t("completeProfile")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileCompletion;
