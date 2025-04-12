// src/components/MatchedTasksPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function MatchedTasksPage() {
  const [matchedTasks, setMatchedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchMatchedTasks = async () => {
      setIsLoading(true);
      setError("");
      if (!token) {
        setError("Authentication required.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/match-tasks`, {
          // Use the matching endpoint
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.msg || "Failed to fetch matched tasks");
        }
        // Sort by matchScore descending (optional)
        data.sort((a, b) => b.matchScore - a.matchScore);
        setMatchedTasks(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch matched tasks error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatchedTasks();
  }, [token]);

  if (isLoading)
    return <div className="text-center p-10">Loading matched tasks...</div>;
  if (error)
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Your Matched Tasks
      </h1>

      {matchedTasks.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">
            No tasks match your current skills yet.
          </p>
          <Link
            to="/challenges"
            className="text-indigo-600 hover:underline font-medium"
          >
            Solve more challenges to find matches!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {task.title}
                  </h2>
                  <span
                    className={`text-sm font-bold ${
                      task.matchScore >= 80
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    {task.matchScore}% Match
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  {/* Assume company name might be populated later */}
                  Company: {task.companyId?.name || "Unknown Company"}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  {task.description.substring(0, 100)}...
                </p>
                <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize mb-3">
                  Required Skill: {task.type}
                </span>
                {/* Placeholder for Salary/Culture - Add when backend supports it */}
                {/*
                                {task.salaryRange && <p className="text-xs text-gray-500">Salary: {task.salaryRange}</p>}
                                {task.cultureValues && task.cultureValues.length > 0 && (
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {task.cultureValues.map((v, i) => <span key={i} className="text-xs bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">{v}</span>)}
                                    </div>
                                )}
                                */}
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <Link
                  to={`/tasks/${task._id}`} // Link to the task detail page
                  className="block w-full text-center px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                  View Details & Submit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchedTasksPage;
