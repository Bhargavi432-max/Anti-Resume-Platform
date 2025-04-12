// src/components/CompanyDashboardSummary.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function CompanyDashboardSummary() {
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchSummaries = async () => {
      setIsLoading(true);
      setError("");
      if (!token) {
        setError("Authentication required.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/task-submissions/summary`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.msg || "Failed to fetch summaries");
        }
        setSummaries(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch summaries error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummaries();
  }, [token]);

  if (isLoading)
    return <div className="text-center p-4">Loading task summaries...</div>;
  if (error)
    return (
      <div className="p-4 text-red-600">Error loading summaries: {error}</div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Task Submission Summaries
      </h2>
      {summaries.length === 0 ? (
        <p className="text-gray-600">No tasks with submissions yet.</p>
      ) : (
        <ul className="space-y-3">
          {summaries.map((summary) => (
            <li
              key={summary.taskId}
              className="border-b border-gray-100 pb-3 last:border-b-0"
            >
              <Link
                to={`/company/submissions?taskId=${summary.taskId}`}
                className="hover:text-teal-600"
              >
                <h3 className="font-medium text-gray-900">
                  {summary.taskTitle}
                </h3>
              </Link>
              <div className="text-sm text-gray-500 flex justify-between items-center mt-1">
                <span>Submissions: {summary.totalSubmissions}</span>
                <span>Avg Score: {summary.averageScore}%</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CompanyDashboardSummary;
