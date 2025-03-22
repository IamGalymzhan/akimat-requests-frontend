import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { checkNCALayerAvailability, cleanupNCALayer } from "../utils/eds";
import { useTranslation } from "react-i18next";

/**
 * EDS Login Button Component
 * Handles EDS authentication flow with proper status indicators
 */
const EDSLoginButton = ({
  className = "",
  buttonText = "Войти с ЭЦП",
  onSuccess = () => {},
  onNewUser = () => {},
}) => {
  const { loginWithEDS, loading } = useAuth();
  const [ncaLayerAvailable, setNcaLayerAvailable] = useState(null);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);
  const { t } = useTranslation();

  // Check NCALayer availability on component mount
  useEffect(() => {
    let isMounted = true;

    const checkAvailability = async () => {
      setChecking(true);
      try {
        const isAvailable = await checkNCALayerAvailability();

        // Only update state if component is still mounted
        if (isMounted) {
          setNcaLayerAvailable(isAvailable);
          if (!isAvailable) {
            setError(t("edsConnectionError"));
          }
        }
      } catch (err) {
        console.error("NCALayer check failed:", err);
        if (isMounted) {
          setNcaLayerAvailable(false);
          setError(t("edsConnectionError"));
        }
      } finally {
        if (isMounted) {
          setChecking(false);
        }
      }
    };

    // Try checking with a small delay to ensure NCALayer has time to respond
    setTimeout(() => {
      if (isMounted) {
        checkAvailability();
      }
    }, 500);

    // Cleanup function to prevent memory leaks and prevent state updates after unmount
    return () => {
      isMounted = false;
      // We don't call cleanupNCALayer() here anymore to avoid closing the connection
      // before we need it
    };
  }, [t]);

  // Handle EDS login click
  const handleEDSLogin = async () => {
    setError(null);

    // Check if NCALayer is available
    if (!ncaLayerAvailable) {
      setError(t("edsInstallPrompt"));
      return;
    }

    try {
      const userData = await loginWithEDS();

      // Check if it's a new user
      if (userData.is_new_user) {
        onNewUser(userData);
      } else {
        onSuccess(userData);
      }
    } catch (err) {
      console.error("EDS login failed:", err);
      setError(err.message || t("edsLoginError"));
    } finally {
      // Clean up NCALayer connection after authentication attempt
      cleanupNCALayer();
    }
  };

  // Get button status and style
  const getButtonStatus = () => {
    if (checking) {
      return { text: t("edsCheckingNcaLayer"), disabled: true };
    }

    if (loading) {
      return { text: t("signingInWithEDS"), disabled: true };
    }

    if (ncaLayerAvailable === false) {
      return { text: t("edsNcaLayerUnavailable"), disabled: true };
    }

    return { text: buttonText || t("signInWithEDS"), disabled: false };
  };

  const { text, disabled } = getButtonStatus();

  return (
    <div className="flex flex-col items-center my-4 w-full">
      <button
        className={`bg-akimat-blue text-white py-3 px-6 rounded-md font-semibold text-base border-0 
        cursor-pointer transition duration-200 ease-in-out transform w-full max-w-[300px] 
        flex justify-center items-center gap-2 hover:bg-akimat-light-blue hover:translate-y-[-1px] 
        active:translate-y-0 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
        onClick={handleEDSLogin}
        disabled={disabled}
      >
        {text}
      </button>

      {error && (
        <div className="mt-4 text-red-600 text-center bg-red-50 p-3 rounded-md max-w-[400px] w-full border border-red-200">
          {error}
          {ncaLayerAvailable === false && (
            <div className="mt-3 pt-3 border-t border-red-200 text-sm text-akimat-text-medium text-left">
              <p className="mb-2 font-semibold">{t("edsEnsureChecklist")}</p>
              <ul className="mb-3 pl-6 list-disc">
                <li>{t("edsNcaLayerInstalled")}</li>
                <li>{t("edsNcaLayerRunning")}</li>
                <li>{t("edsValidCert")}</li>
              </ul>
              <a
                href="https://pki.gov.kz/downloads/nca_layer/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-akimat-blue font-semibold mt-2 hover:underline"
              >
                {t("edsDownloadLink")}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EDSLoginButton;
