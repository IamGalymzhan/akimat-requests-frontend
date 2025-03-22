import { useState, useEffect } from "react";
import { getDepartments } from "../utils/users";

/**
 * A component that displays a list of departments
 * @param {Object} props - Component props
 * @param {Function} props.onSelectDepartment - Callback when a department is selected
 * @param {number} [props.selectedDepartmentId] - Currently selected department ID
 * @returns {JSX.Element} Rendered component
 */
const DepartmentsList = ({ onSelectDepartment, selectedDepartmentId }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const data = await getDepartments();
        setDepartments(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
        setError("Failed to load departments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading departments...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
        <button
          className="block mx-auto mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (departments.length === 0) {
    return <div className="text-center py-4">No departments found.</div>;
  }

  return (
    <div className="departments-list">
      <h3 className="text-lg font-medium mb-3">Departments</h3>
      <ul className="space-y-2">
        {departments.map((department) => (
          <li key={department.id}>
            <button
              className={`w-full text-left px-4 py-2 rounded ${
                selectedDepartmentId === department.id
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => onSelectDepartment(department)}
            >
              {department.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentsList;
