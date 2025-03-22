import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRequestById,
  getRequestComments,
  addRequestComment,
  getRequestAttachments,
  uploadRequestAttachment,
  updateRequest,
} from "../../utils/requests";
import { useAuth, ROLES } from "../../context/AuthContext";
import api from "../../utils/api";
import { useTranslation } from "react-i18next";

// Request type labels
const requestTypeLabels = {
  financial: "Financial",
  technical: "Technical",
  administrative: "Administrative",
  other: "Other",
};

// Status color mapping
const statusColors = {
  new: "bg-blue-100 text-blue-800",
  in_process: "bg-yellow-100 text-yellow-800",
  awaiting: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
};

// Status options for dropdown
const getStatusOptions = (t) => [
  { value: "new", label: t("new") },
  { value: "in_process", label: t("inProgress") },
  { value: "awaiting", label: t("awaiting") },
  { value: "completed", label: t("completed") },
];

/**
 * Component to display detailed information about a request
 * @returns {JSX.Element} Rendered component
 */
const RequestDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const [request, setRequest] = useState(null);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingFile, setSubmittingFile] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [assigningEmployee, setAssigningEmployee] = useState(false);

  // Get translated status options
  const statusOptions = getStatusOptions(t);

  // Check if user is a supervisor
  const isSupervisor = hasRole(ROLES.SUPERVISOR);

  // Check if the user is the creator of the request or an admin
  const isOwnerOrAdmin =
    request && (user?.id === request.created_by_id || user?.is_superuser);

  // Fetch request data
  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        setLoading(true);
        const requestData = await getRequestById(id);
        setRequest(requestData);
        setSelectedStatus(requestData.status);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch request details:", err);
        setError("Failed to load request details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRequestData();
    }
  }, [id]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;

      try {
        const commentsData = await getRequestComments(id);
        // Ensure commentsData is treated as an array
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } catch (err) {
        console.error("Failed to fetch request comments:", err);
        // Set to empty array on error
        setComments([]);
      }
    };

    fetchComments();
  }, [id]);

  // Fetch attachments
  useEffect(() => {
    const fetchAttachments = async () => {
      if (!id) return;

      try {
        const attachmentsData = await getRequestAttachments(id);
        setAttachments(Array.isArray(attachmentsData) ? attachmentsData : []);
      } catch (err) {
        console.error("Failed to fetch request attachments:", err);
        setAttachments([]);
      }
    };

    fetchAttachments();
  }, [id]);

  // Fetch employees list for assignment (only for supervisors)
  useEffect(() => {
    if (isSupervisor) {
      const fetchEmployees = async () => {
        try {
          const response = await api.get("/users?role=employee");
          if (response.data && Array.isArray(response.data)) {
            setEmployees(response.data);
          } else if (response.data && Array.isArray(response.data.items)) {
            setEmployees(response.data.items);
          }
        } catch (err) {
          console.error("Failed to fetch employees:", err);
        }
      };

      fetchEmployees();
    }
  }, [isSupervisor]);

  // Set selected employee when request data loads
  useEffect(() => {
    if (request && request.assigned_to_id) {
      setSelectedEmployeeId(request.assigned_to_id.toString());
    }
  }, [request]);

  // Handle comment submission
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setSubmittingComment(true);

    try {
      const addedComment = await addRequestComment(id, { comment: newComment });
      // Ensure we're working with an array before spreading
      const currentComments = Array.isArray(comments) ? comments : [];
      setComments([...currentComments, addedComment]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setSubmittingFile(true);

    try {
      const uploadedAttachment = await uploadRequestAttachment(id, formData);
      // Ensure we're working with an array before spreading
      const currentAttachments = Array.isArray(attachments) ? attachments : [];
      setAttachments([...currentAttachments, uploadedAttachment]);
    } catch (err) {
      console.error("Failed to upload attachment:", err);
      alert("Failed to upload attachment. Please try again.");
    } finally {
      setSubmittingFile(false);
      // Reset file input
      e.target.value = "";
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (selectedStatus === request.status) return;

    setUpdatingStatus(true);

    try {
      const updatedRequest = await updateRequest(id, {
        status: selectedStatus,
      });
      setRequest(updatedRequest);
    } catch (err) {
      console.error("Failed to update request status:", err);
      alert("Failed to update status. Please try again.");
      // Reset to original status
      setSelectedStatus(request.status);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle employee assignment
  const handleAssignEmployee = async () => {
    setAssigningEmployee(true);

    try {
      // Update the request with the new assignment
      await updateRequest(id, {
        assigned_to_id: selectedEmployeeId || null,
      });

      // Add a comment about the assignment
      const employeeName =
        employees.find((emp) => emp.id.toString() === selectedEmployeeId)
          ?.full_name || "No one";

      await addRequestComment(id, {
        comment: `Request ${
          selectedEmployeeId ? `assigned to ${employeeName}` : "unassigned"
        } by ${user?.full_name || "Supervisor"}`,
      });

      // Reload all data
      // 1. Reload request details
      const requestData = await getRequestById(id);
      setRequest(requestData);
      setSelectedStatus(requestData.status);

      // 2. Reload comments
      const commentsData = await getRequestComments(id);
      setComments(Array.isArray(commentsData) ? commentsData : []);

      // 3. Reload attachments
      const attachmentsData = await getRequestAttachments(id);
      setAttachments(Array.isArray(attachmentsData) ? attachmentsData : []);
    } catch (err) {
      console.error("Failed to assign employee:", err);
      alert("Failed to assign employee. Please try again.");
    } finally {
      setAssigningEmployee(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>{t("loadingRequestDetails")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate("/requests")}
        >
          {t("backToRequests")}
        </button>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-8">
        <p>{t("requestNotFoundOrNoPermission")}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate("/requests")}
        >
          {t("backToRequests")}
        </button>
      </div>
    );
  }

  return (
    <div className="request-details space-y-6">
      {/* Request Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{request.title}</h1>
            <div className="flex flex-wrap gap-2 mb-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusColors[request.status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {request.status === "in_process"
                  ? t("inProgress")
                  : t(request.status) ||
                    request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                {requestTypeLabels[request.request_type] ||
                  request.request_type}
              </span>
              {request.urgency && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                  Urgent
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              {t("created")} {new Date(request.created_at).toLocaleString()}{" "}
              {t("by")} {request.created_by?.full_name || "Unknown"}
            </p>
          </div>

          {/* Status Update Section (for admins and request owners) */}
          {isOwnerOrAdmin && (
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={updatingStatus}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updatingStatus || selectedStatus === request.status}
                  className={`px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    updatingStatus || selectedStatus === request.status
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {updatingStatus ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Request Info */}
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {request.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Department</h3>
            <p>{request.department?.name || "Not assigned"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
            <p>{request.assigned_to?.full_name || "Not assigned"}</p>
          </div>
        </div>

        {/* Status Management (for owner or admin) */}
        {isOwnerOrAdmin && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Update Status</h3>
            <div className="flex items-center">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full md:w-auto mr-2 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                disabled={updatingStatus}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                disabled={updatingStatus || selectedStatus === request.status}
              >
                {updatingStatus ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        )}

        {/* Employee Assignment (for supervisors) */}
        {isSupervisor && (
          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <h3 className="font-medium mb-2">Assign Employee</h3>
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="block w-full md:w-auto mr-2 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md mb-2 md:mb-0"
                disabled={assigningEmployee}
              >
                <option value="">-- None --</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.full_name || employee.email}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssignEmployee}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
                disabled={
                  assigningEmployee ||
                  (request.assigned_to_id &&
                    selectedEmployeeId === request.assigned_to_id.toString())
                }
              >
                {assigningEmployee
                  ? "Assigning..."
                  : selectedEmployeeId
                  ? "Assign"
                  : "Unassign"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Attachments Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Attachments</h2>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Attachment
          </label>
          <div className="flex items-center">
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={submittingFile}
              className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {submittingFile && (
              <span className="ml-2 text-sm text-gray-500">Uploading...</span>
            )}
          </div>
        </div>

        {/* Attachments List */}
        {!attachments || attachments.length === 0 ? (
          <p className="text-gray-500">No attachments yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {Array.isArray(attachments) &&
              attachments.map((attachment) => (
                <li
                  key={attachment.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">
                      {attachment.filename || "Attachment"}
                    </span>
                  </div>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Download
                  </a>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Comments</h2>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="mb-2">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Add a comment
            </label>
            <textarea
              id="comment"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your comment here..."
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                submittingComment || !newComment.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {submittingComment ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>

        {/* Comments List */}
        {!comments || comments.length === 0 ? (
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <ul className="space-y-4">
            {Array.isArray(comments) &&
              comments.map((comment) => (
                <li
                  key={comment.id}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">
                      {comment.author?.full_name || "Unknown User"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">
                    {comment.comment}
                  </p>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RequestDetails;
