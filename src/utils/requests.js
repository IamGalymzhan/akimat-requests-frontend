import api from "./api";

/**
 * Get all requests
 * @returns {Promise<Array>} List of requests
 */
export const getAllRequests = async () => {
  try {
    const response = await api.get("/requests");
    console.log("Raw API response:", response);

    // According to the API docs, the response format is { total: number, items: Array }
    if (
      response.data &&
      response.data.items &&
      Array.isArray(response.data.items)
    ) {
      console.log("Found items array in response:", response.data.items);
      return response.data.items;
    }

    // Fallback in case the API format changes
    if (Array.isArray(response.data)) {
      return response.data;
    }

    console.warn(
      "Unexpected response format from /requests API:",
      response.data
    );
    return [];
  } catch (error) {
    console.error("Error in getAllRequests:", error);
    throw error;
  }
};

/**
 * Get a specific request by ID
 * @param {number} requestId - The ID of the request to fetch
 * @returns {Promise<Object>} Request data
 */
export const getRequestById = async (requestId) => {
  const response = await api.get(`/requests/${requestId}`);
  return response.data;
};

/**
 * Create a new request
 * @param {Object} requestData - The request data
 * @param {string} requestData.title - Request title
 * @param {string} requestData.description - Request description
 * @param {string} requestData.request_type - Type of request (e.g., "financial")
 * @param {boolean} requestData.urgency - Whether the request is urgent
 * @param {number} [requestData.department_id] - ID of the department
 * @returns {Promise<Object>} Created request data
 */
export const createRequest = async (requestData) => {
  const response = await api.post("/requests", requestData);
  return response.data;
};

/**
 * Update an existing request
 * @param {number} requestId - The ID of the request to update
 * @param {Object} requestData - The updated request data
 * @param {string} [requestData.title] - Request title
 * @param {string} [requestData.description] - Request description
 * @param {string} [requestData.request_type] - Type of request (e.g., "financial")
 * @param {boolean} [requestData.urgency] - Whether the request is urgent
 * @param {string} [requestData.status] - Status of the request ("new", "in_process", "awaiting", "completed")
 * @param {number} [requestData.assigned_to_id] - ID of the assigned user
 * @param {number} [requestData.department_id] - ID of the department
 * @returns {Promise<Object>} Updated request data
 */
export const updateRequest = async (requestId, requestData) => {
  try {
    const response = await api.put(`/requests/${requestId}`, requestData);
    return response.data;
  } catch (error) {
    console.error("Error updating request:", error);
    throw error;
  }
};

/**
 * Get comments for a request
 * @param {number} requestId - The ID of the request
 * @returns {Promise<Array>} List of comments with structure { comment, id, author, created_at, etc. }
 */
export const getRequestComments = async (requestId) => {
  try {
    const response = await api.get(`/requests/${requestId}/comments`);

    // The expected format is { items: [...comments] }
    if (
      response.data &&
      response.data.items &&
      Array.isArray(response.data.items)
    ) {
      return response.data.items;
    }

    // Fallback in case API returns array directly
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Log unexpected format and return empty array
    console.warn("Unexpected format for comments:", response.data);
    return [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

/**
 * Add a comment to a request
 * @param {number} requestId - The ID of the request
 * @param {Object} commentData - The comment data
 * @param {string} commentData.comment - The comment text
 * @returns {Promise<Object>} Created comment data with structure { id, comment, author, created_at, etc. }
 */
export const addRequestComment = async (requestId, commentData) => {
  try {
    const response = await api.post(
      `/requests/${requestId}/comments`,
      commentData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

/**
 * Get attachments for a request
 * @param {number} requestId - The ID of the request
 * @returns {Promise<Array>} List of attachments
 */
export const getRequestAttachments = async (requestId) => {
  try {
    const response = await api.get(`/requests/${requestId}/attachments`);

    // Check if response.data is an array
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Check if response.data has items property that is an array
    if (
      response.data &&
      response.data.items &&
      Array.isArray(response.data.items)
    ) {
      return response.data.items;
    }

    // Log unexpected format and return empty array
    console.warn("Unexpected format for attachments:", response.data);
    return [];
  } catch (error) {
    console.error("Error fetching attachments:", error);
    return [];
  }
};

/**
 * Upload an attachment for a request
 * @param {number} requestId - The ID of the request
 * @param {FormData} formData - FormData containing the file to upload
 * @returns {Promise<Object>} Uploaded attachment data
 */
export const uploadRequestAttachment = async (requestId, formData) => {
  try {
    const response = await api.post(
      `/requests/${requestId}/attachments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading attachment:", error);
    throw error;
  }
};
