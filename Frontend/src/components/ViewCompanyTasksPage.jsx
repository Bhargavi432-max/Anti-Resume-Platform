// src/components/ViewCompanyTasksPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function ViewCompanyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError("");
      if (!token) {
        setError("Authentication required.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/tasks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.msg || "Failed to fetch tasks");
        }
        setTasks(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch tasks error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [token]);

  if (isLoading)
    return <div className="text-center p-10">Loading your tasks...</div>;
  if (error)
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          My Posted Tasks
        </h1>
        <Link
          to="/company/tasks/new" // Link to create task page
          className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          + Post New Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven't posted any tasks yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-lg shadow-md p-5 border border-gray-200 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-900">
                  {task.title}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  {task.description.substring(0, 120)}...
                </p>
                <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                  Type: {task.type}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col space-y-2">
                <Link
                  to={`/company/tasks/${task._id}/anonymous-submissions`}
                  className="text-sm text-center px-3 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-150"
                >
                  View Anonymous Submissions
                </Link>
                <Link
                  to={`/company/submissions?taskId=${task._id}`} // Link to filtered identified submissions
                  className="text-sm text-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-150"
                >
                  View Identified Submissions
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewCompanyTasksPage;
