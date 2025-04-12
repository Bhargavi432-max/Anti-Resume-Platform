// src/components/FeedbackForm.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import validator from "validator";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

// Props: targetCandidateId, targetCompanyId
function FeedbackForm({ targetCandidateId, targetCompanyId }) {
  const [feedbackText, setFeedbackText] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useAuth(); // Get current user info

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (validator.isEmpty(feedbackText.trim())) {
      setError("Feedback cannot be empty.");
      return;
    }
    if (!user || !token || !targetCandidateId || !targetCompanyId) {
      setError(
        "Cannot submit feedback. Missing required information or authentication."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          candidateId: targetCandidateId,
          companyId: targetCompanyId,
          feedbackText: feedbackText,
          from: user.role, // Set 'from' based on logged-in user's role
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit feedback");
      }
      setSuccessMessage(data.message || "Feedback submitted successfully!");
      setFeedbackText(""); // Clear form on success
    } catch (err) {
      setError(err.message || "An error occurred submitting feedback.");
      console.error("Feedback submit error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if essential info is missing
  if (!user) return null;

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-3 text-gray-800">Leave Feedback</h3>
      {error && (
        <div className="mb-3 p-2 text-sm bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-3 p-2 text-sm bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          value={feedbackText}
          onChange={(e) => {
            setFeedbackText(e.target.value);
            setError(""); // Clear error on typing
            setSuccessMessage("");
          }}
          placeholder={`Leave your feedback here... (as ${user.role})`}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={isLoading}
        ></textarea>
        <button
          type="submit"
          disabled={isLoading}
          className={`mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;
