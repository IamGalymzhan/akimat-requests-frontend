import { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api";
import { authenticateWithEDS } from "../utils/eds";
import { getCurrentUser } from "../utils/users";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Define roles as constants for consistency
export const ROLES = {
  EMPLOYEE: "employee",
  SUPERVISOR: "supervisor",
  ADMIN: "admin",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Fetch the latest user data from the server
        fetchCurrentUser();
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Fetch current user data from the API
  const fetchCurrentUser = async () => {
    console.log("fetchCurrentUser started");
    try {
      console.log("Calling getCurrentUser API");
      const userData = await getCurrentUser();
      console.log("getCurrentUser response:", userData);

      // Update user state with the fetched data but keep the token and original role
      const storedUser = JSON.parse(localStorage.getItem("user"));
      console.log("Stored user from localStorage:", storedUser);

      // Preserve the original role from login response if it exists
      let role = storedUser.role;
      console.log("Initial role from stored user:", role);

      // Normalize role to match ROLES constants
      if (role === "administrator") {
        console.log("Normalizing 'administrator' role to 'admin'");
        role = ROLES.ADMIN;
      }

      // Only determine role based on is_superuser if no role exists from login
      if (!role) {
        if (userData.is_superuser === true) {
          role = ROLES.ADMIN;
        } else {
          role = ROLES.EMPLOYEE;
        }
      }

      const updatedUser = {
        ...userData,
        token: storedUser.token,
        role: role, // Use preserved or determined role
      };

      // Save role in localStorage
      localStorage.setItem("userRole", role);

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to fetch current user data:", err);
      // If 401 error, the interceptor in api.js will handle logout
      if (err.response && err.response.status !== 401) {
        setError("Failed to fetch user data");
      }
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/email/login", { email, password });
      const userData = response.data;

      // Ensure token is consistently stored in both token and access_token props
      const enhancedUserData = {
        ...userData,
        token: userData.access_token,
      };

      setUser(enhancedUserData);
      localStorage.setItem("user", JSON.stringify(enhancedUserData));

      // Save role in localStorage
      if (userData.role) {
        localStorage.setItem("userRole", userData.role);
      }

      // Fetch complete user profile after login
      await fetchCurrentUser();

      return enhancedUserData;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEDS = async () => {
    console.log("Starting EDS login process");
    setLoading(true);
    setError(null);
    try {
      // Using the updated single-request EDS authentication method
      console.log("Calling authenticateWithEDS");
      const response = await authenticateWithEDS();
      console.log("EDS authentication successful", response); // Log full response

      // Determine initial role if not provided in response
      // This is a temporary role until fetchCurrentUser gets the accurate data
      let initialRole = response.role;
      if (!initialRole) {
        console.log("No role found in EDS response, setting default role");
        initialRole = ROLES.EMPLOYEE; // Default to employee
      }

      // Store user data
      const userData = {
        ...response,
        token: response.access_token,
        role: initialRole,
      };
      console.log("User data after EDS login:", userData); // Debug user data
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", initialRole);

      // Fetch complete user profile after EDS login
      // This will update the role based on is_superuser flag from the API
      await fetchCurrentUser();

      return userData;
    } catch (err) {
      console.error("EDS login failed:", err);
      setError(err.message || "EDS login failed");
      throw err;
    } finally {
      setLoading(false);
      console.log("EDS login process completed");
    }
  };

  const register = async (full_name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Using the configured api instance instead of axios directly
      const response = await api.post("/auth/email/register", {
        full_name,
        email,
        password,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    // You might want to call an API endpoint to invalidate the token on the server
    // api.post("/auth/logout");
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    login,
    loginWithEDS,
    register,
    logout,
    isAuthenticated: !!user,
    isNewUser: user?.is_new_user || false,
    hasRole,
    hasAnyRole,
    fetchCurrentUser, // Export the fetch function for manual refresh
    // Export user role for easy access
    role: user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
