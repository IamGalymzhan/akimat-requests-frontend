import { useState, useEffect } from "react";
import { getUserById } from "../../utils/users";

/**
 * Component to display detailed information about a specific user (admin only)
 * @param {Object} props - Component props
 * @param {number} props.userId - ID of the user to display
 * @returns {JSX.Element} Rendered component
 */
const UserDetails = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const userData = await getUserById(userId);
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        if (err.response && err.response.status === 403) {
          setError(
            "Access denied. Admin permissions required to view user details."
          );
        } else {
          setError("Failed to load user details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-4">Loading user details...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="text-center py-4">No user data found.</div>;
  }

  return (
    <div className="user-details p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">User Details</h2>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">Full Name:</div>
          <div>{user.full_name}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">Email:</div>
          <div>{user.email}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">User ID:</div>
          <div>{user.id}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">Account Status:</div>
          <div>
            {user.is_active ? (
              <span className="text-green-500">Active</span>
            ) : (
              <span className="text-red-500">Inactive</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">Admin Status:</div>
          <div>
            {user.is_superuser ? (
              <span className="text-blue-500">Administrator</span>
            ) : (
              <span>Regular User</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">Created:</div>
          <div>{new Date(user.created_at).toLocaleString()}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">Last Updated:</div>
          <div>{new Date(user.updated_at).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
