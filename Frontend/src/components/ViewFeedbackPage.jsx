// src/components/ViewFeedbackPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function ViewFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, token } = useAuth(); // Need company user info

  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      setError("");
      if (!user || user.role !== "company" || !token) {
        setError("Authentication required or invalid role.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/feedback/${user.id}`, {
          // Fetch feedback for own company ID
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Assuming backend needs auth for this
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch feedback");
        }
        setFeedbacks(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch feedback error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedback();
  }, [user, token]);

  if (isLoading)
    return <div className="text-center p-10">Loading feedback...</div>;
  if (error)
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Received Feedback
      </h1>

      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-600">
          No feedback has been submitted yet.
        </p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div
              key={fb._id}
              className="bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              <p className="text-gray-700 mb-2">{fb.feedbackText}</p>
              <div className="text-xs text-gray-500 flex justify-between items-center">
                <span>
                  From: {fb.candidateId?.name || "Candidate"}{" "}
                  {/* Show candidate name */} on{" "}
                  {new Date(fb.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`font-medium ${
                    fb.from === "candidate" ? "text-blue-600" : "text-teal-600"
                  }`}
                >
                  ({fb.from}){" "}
                  {/* Indicate if feedback was from candidate or company (if applicable) */}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Link back to dashboard or other relevant page */}
      <div className="mt-6">
        <Link to="/company/dashboard" className="text-teal-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default ViewFeedbackPage;
