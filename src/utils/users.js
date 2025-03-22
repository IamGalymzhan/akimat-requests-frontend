import api from "./api";

/**
 * Get the current user's profile
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

/**
 * Update the current user's profile
 * @param {Object} userData - The user data to update
 * @param {string} userData.full_name - Full name
 * @param {string} userData.phone_number - Phone number
 * @param {string} userData.organization - Organization name
 * @param {string} userData.position - Job position
 * @param {string} userData.iin - Individual identification number
 * @returns {Promise<Object>} Updated user profile data
 */
export const updateCurrentUser = async (userData) => {
  const response = await api.put("/auth/me", userData);
  return response.data;
};

/**
 * Get a specific user by ID (admin only)
 * @param {number} userId - The ID of the user to fetch
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

/**
 * Get all departments
 * @returns {Promise<Array>} List of departments
 */
export const getDepartments = async () => {
  const response = await api.get("/departments");
  return response.data;
};
