import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      // Redirect to login after successful registration
      navigate("/login", {
        state: { message: t("registrationSuccessful") },
      });
    } catch (err) {
      setError(err.response?.data?.message || t("registrationError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Link
        to="/"
        className="inline-block mb-6 text-sm text-sky-600 hover:text-sky-500"
      >
        {t("backToHome")}
      </Link>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {t("createAccountTitle")}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        {t("or")}{" "}
        <Link
          to="/login"
          className="font-medium text-sky-600 hover:text-sky-500"
        >
          {t("signInToExisting")}
        </Link>
      </p>

      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            placeholder={t("fullNamePlaceholder")}
          />
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            placeholder={t("emailPlaceholder")}
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            placeholder={t("passwordPlaceholder")}
          />
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            placeholder={t("confirmPasswordPlaceholder")}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t("creatingAccount") : t("createAccount")}
          </button>
        </div>

        <div className="text-sm text-center">
          <p className="text-gray-600">
            {t("termsAgreement")}{" "}
            <Link
              to="/terms"
              className="font-medium text-sky-600 hover:text-sky-500"
            >
              {t("termsOfService")}
            </Link>{" "}
            {t("and")}{" "}
            <Link
              to="/privacy"
              className="font-medium text-sky-600 hover:text-sky-500"
            >
              {t("privacyPolicy")}
            </Link>
            .
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
