// src/components/ViewAnonymousSubmissionsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Use auth for consistency, though backend route might not require it

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function ViewAnonymousSubmissionsPage() {
  const { taskId } = useParams(); // Get taskId from URL
  const [submissions, setSubmissions] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth(); // Get token, might be needed if backend adds auth later

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      setError("");
      // No explicit token check here as backend route is public, but keep token for potential future use
      // if (!token) { setError('Auth required?'); setIsLoading(false); return; }

      try {
        const response = await fetch(
          `${API_URL}/api/anonymous-submissions/${taskId}`
        ); // No auth header needed based on backend
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch anonymous submissions"
          );
        }

        setSubmissions(data);
        if (data.length > 0) {
          setTaskTitle(data[0].taskId?.title || "Task"); // Get title from first submission
        } else {
          setTaskTitle("Task"); // Default if no submissions
          // Maybe fetch task details separately if needed?
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch anonymous submissions error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, [taskId, token]); // Add token if backend auth might be added

  if (isLoading)
    return (
      <div className="text-center p-10">Loading anonymous submissions...</div>
    );
  if (error)
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Link
        to="/company/tasks"
        className="mb-4 inline-block text-teal-600 hover:underline"
      >
        &larr; Back to My Tasks
      </Link>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-800">
        Anonymous Submissions
      </h1>
      <h2 className="text-lg text-gray-600 mb-6">For Task: "{taskTitle}"</h2>

      {submissions.length === 0 ? (
        <p className="text-center text-gray-600">
          No submissions received for this task yet.
        </p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Language
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Submitted At
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Code Snippet
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((sub) => (
                <tr key={sub._id}>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      sub.score >= 80 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {sub.score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {sub.language}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sub.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto max-w-xs sm:max-w-md md:max-w-lg">
                      <code>
                        {sub.submittedCode
                          ? sub.submittedCode.substring(0, 150) +
                            (sub.submittedCode.length > 150 ? "..." : "")
                          : "N/A"}
                      </code>
                    </pre>
                    {/* Add a modal/link to view full code if needed */}
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

export default ViewAnonymousSubmissionsPage;
