import { useNavigate } from "react-router-dom";
import RequestDetails from "../../components/requests/RequestDetails";
import { useTranslation } from "react-i18next";

/**
 * Request details page component
 * @returns {JSX.Element} Rendered component
 */
const RequestDetailsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="request-details-page container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/requests")}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          {t("backToRequests")}
        </button>
      </div>

      <RequestDetails />
    </div>
  );
};

export default RequestDetailsPage;
