import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateRequestForm from "../../components/requests/CreateRequestForm";
import { uploadRequestAttachment } from "../../utils/requests";
import { ROUTES } from "../../routes/routePaths";
import { useTranslation } from "react-i18next";

/**
 * Page for creating a new request with attachments
 * @returns {JSX.Element} Rendered component
 */
const CreateRequestPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [createdRequestId, setCreatedRequestId] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [step, setStep] = useState("form"); // "form" or "attachments"

  // Handle successful request creation
  const handleRequestCreated = (result) => {
    setCreatedRequestId(result.id);
    setStep("attachments");
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  // Handle file upload
  const handleUploadAttachments = async () => {
    if (!attachments.length) {
      // Skip to details if no attachments
      navigate(`${ROUTES.REQUEST_DETAILS.replace(":id", createdRequestId)}`);
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Upload each attachment one by one
      for (const file of attachments) {
        const formData = new FormData();
        formData.append("file", file);
        await uploadRequestAttachment(createdRequestId, formData);
      }

      // Navigate to the request details page after successful upload
      navigate(`${ROUTES.REQUEST_DETAILS.replace(":id", createdRequestId)}`);
    } catch (err) {
      console.error("Failed to upload attachments:", err);
      setUploadError(t("failedToUploadAttachments"));
    } finally {
      setUploading(false);
    }
  };

  // Handle skipping attachments
  const handleSkipAttachments = () => {
    navigate(`${ROUTES.REQUEST_DETAILS.replace(":id", createdRequestId)}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(ROUTES.MY_REQUESTS)}
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
          {t("backToMyRequests")}
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t("createNewRequest")}</h1>

        {step === "form" ? (
          <CreateRequestForm onSuccess={handleRequestCreated} />
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-6">
              {t("addAttachmentsOptional")}
            </h2>

            {uploadError && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {uploadError}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("uploadFiles")}
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t("fileSelectionHelp")}
              </p>
            </div>

            <div className="flex items-start mb-4">
              <ul className="list-disc ml-5">
                {attachments.map((file, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleSkipAttachments}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t("skipAttachments")}
              </button>

              <button
                type="button"
                onClick={handleUploadAttachments}
                disabled={uploading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  uploading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {uploading
                  ? t("uploading")
                  : attachments.length
                  ? t("uploadAndContinue")
                  : t("continue")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRequestPage;
