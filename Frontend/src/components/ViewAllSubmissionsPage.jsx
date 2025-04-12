// src/components/ViewAllSubmissionsPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function ViewAllSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hireFeedback, setHireFeedback] = useState({}); // Track feedback per submission { [subId]: {loading, error, success} }
  const { token } = useAuth();
  const [searchParams] = useSearchParams(); // To read query params like ?taskId=...
  const filterTaskId = searchParams.get("taskId"); // Get taskId from URL query param

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      setError("");
      setHireFeedback({});
      if (!token) {
        setError("Authentication required.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/task-submissions`, {
          // Fetch all submissions
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.msg || "Failed to fetch submissions");
        }
        setSubmissions(data); // Store all submissions
      } catch (err) {
        setError(err.message);
        console.error("Fetch submissions error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, [token]);

  // Filter submissions based on taskId from URL query params
  useEffect(() => {
    if (filterTaskId) {
      setFilteredSubmissions(
        submissions.filter((sub) => sub.taskId?._id === filterTaskId)
      );
    } else {
      setFilteredSubmissions(submissions); // Show all if no filter
    }
  }, [filterTaskId, submissions]);

  const handleHire = async (submissionId) => {
    if (!token) {
      alert("Authentication error.");
      return;
    }
    if (
      !window.confirm(`Are you sure you want to mark this candidate as hired?`)
    ) {
      return;
    }

    setHireFeedback((prev) => ({ ...prev, [submissionId]: { loading: true } }));

    try {
      const response = await fetch(`${API_URL}/api/hire/${submissionId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Though body might not be needed for PATCH
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || "Failed to hire candidate");
      }

      setHireFeedback((prev) => ({
        ...prev,
        [submissionId]: { loading: false, success: data.msg },
      }));

      // Update the status locally for immediate feedback
      setSubmissions((prevSubs) =>
        prevSubs.map((sub) =>
          sub._id === submissionId ? { ...sub, status: "hired" } : sub
        )
      );
    } catch (err) {
      console.error("Hire error:", err);
      setHireFeedback((prev) => ({
        ...prev,
        [submissionId]: { loading: false, error: err.message },
      }));
    }
  };

  if (isLoading)
    return <div className="text-center p-10">Loading submissions...</div>;
  if (error)
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;

  // Determine the title based on filtering
  const pageTitle = filterTaskId
    ? `Submissions for Task: "${
        filteredSubmissions[0]?.taskId?.title || "Loading..."
      }"`
    : "All Task Submissions";

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Link
        to="/company/tasks"
        className="mb-4 inline-block text-teal-600 hover:underline"
      >
        &larr; Back to My Tasks
      </Link>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        {pageTitle}
      </h1>

      {filteredSubmissions.length === 0 ? (
        <p className="text-center text-gray-600">
          {filterTaskId
            ? "No identified submissions for this task yet."
            : "No submissions received yet."}
        </p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Task
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Candidate
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Language
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Submitted
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.map((sub) => (
                <tr key={sub._id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sub.taskId?.title || "N/A"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sub.userId?.name || "N/A"} ({sub.userId?.email || "N/A"})
                  </td>
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${
                      sub.score >= 80 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {sub.score}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {sub.language}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sub.status === "hired"
                          ? "bg-green-100 text-green-800"
                          : sub.status === "Accepted"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800" // Default for other statuses
                      }`}
                    >
                      {sub.status || "Submitted"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    {sub.status !== "hired" && ( // Only show hire button if not already hired
                      <button
                        onClick={() => handleHire(sub._id)}
                        disabled={hireFeedback[sub._id]?.loading}
                        className={`text-green-600 hover:text-green-900 disabled:opacity-50 ${
                          hireFeedback[sub._id]?.loading ? "cursor-wait" : ""
                        }`}
                      >
                        {hireFeedback[sub._id]?.loading ? "Hiring..." : "Hire"}
                      </button>
                    )}
                    {hireFeedback[sub._id]?.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {hireFeedback[sub._id]?.error}
                      </p>
                    )}
                    {hireFeedback[sub._id]?.success && (
                      <p className="text-xs text-green-600 mt-1">
                        {hireFeedback[sub._id]?.success}
                      </p>
                    )}
                    {/* Add link to view full code if needed */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewAllSubmissionsPage;
