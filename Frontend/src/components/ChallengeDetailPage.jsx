// src/components/ChallengeDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Assume useAuth provides authentication status and token
// import { useAuth } from '../context/AuthContext'; // Example context import

// Define supported languages based on your backend helper
const SUPPORTED_LANGUAGES = ["python", "java", "c", "c++", "javascript"];

function ChallengeDetailPage() {
  const { challengeId } = useParams(); // Get challengeId from URL
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  // const { token } = useAuth(); // Get token from your auth context/hook

  // Placeholder for token - replace with your actual auth logic
  const token = localStorage.getItem("token"); // Example: reading from localStorage

  // Fetch *all* challenges and filter (since backend doesn't have /challenges/:id)
  // Ideally, backend would provide a specific endpoint GET /api/challenges/:id
  useEffect(() => {
    const fetchChallengeData = async () => {
      setIsLoading(true);
      setError(null);
      if (!token) {
        setError("You must be logged in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/challenges", {
          // Fetching all
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch challenges");
        const allChallenges = await response.json();
        const foundChallenge = allChallenges.find(
          (ch) => ch._id === challengeId
        );

        if (foundChallenge) {
          setChallenge(foundChallenge);
          // Initialize code editor with boilerplate and set default language
          setCode(foundChallenge.boilerplateCode || "");
          setLanguage(foundChallenge.type || SUPPORTED_LANGUAGES[0]); // Default to type or first lang
        } else {
          setError("Challenge not found.");
        }
      } catch (err) {
        console.error("Error fetching challenge details:", err);
        setError(err.message || "Failed to load challenge.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallengeData();
  }, [challengeId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!challenge || isSubmitting || !token) return;

    setIsSubmitting(true);
    setSubmissionResult(null); // Clear previous result
    setError(null);

    try {
      // Adjust fetch URL to your actual API endpoint
      const response = await fetch("/api/challenges/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challengeId: challenge._id,
          submittedCode: code,
          language: language,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || `HTTP error! status: ${response.status}`);
      }

      // Display success message from backend
      setSubmissionResult({
        status: result.status, // e.g., "Accepted", "Wrong Answer"
        score: result.score,
        message: result.msg, // e.g., "Submission evaluated"
      });
    } catch (err) {
      console.error("Error submitting challenge:", err);
      setError(err.message || "Failed to submit solution. Please try again.");
      setSubmissionResult(null); // Clear result on error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading challenge details...</div>;
  }

  if (error && !challenge) {
    // Show error only if challenge couldn't load
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  }

  if (!challenge) {
    return <div className="text-center p-10">Challenge not found.</div>; // Should be caught by error state mostly
  }

  // Determine result styling
  let resultColor = "text-gray-700";
  if (submissionResult?.status === "Accepted") {
    resultColor = "text-green-600";
  } else if (submissionResult?.status) {
    // Any other non-null status (Wrong Answer, etc.)
    resultColor = "text-red-600";
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => navigate("/challenges")}
        className="mb-4 text-indigo-600 hover:underline"
      >
        &larr; Back to Challenges
      </button>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          {challenge.title}
        </h1>
        <p className="text-gray-700 mb-4">{challenge.description}</p>
        {challenge.input && (
          <div className="mb-2">
            <h3 className="font-semibold text-sm text-gray-600">
              Input Example:
            </h3>
            <pre className="bg-gray-100 p-2 rounded text-xs text-gray-800">
              {challenge.input}
            </pre>
          </div>
        )}
        {challenge.expectedOutput && (
          <div className="mb-4">
            <h3 className="font-semibold text-sm text-gray-600">
              Expected Output:
            </h3>
            <pre className="bg-gray-100 p-2 rounded text-xs text-gray-800">
              {challenge.expectedOutput}
            </pre>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}{" "}
                {/* Capitalize */}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Code
          </label>
          {/* Basic Textarea - Replace with Code Editor component for better UX if desired */}
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows="15"
            required
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            placeholder="Write your code here..."
          />
        </div>

        {/* Display Submission Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Display Submission Result */}
        {submissionResult && (
          <div
            className={`mb-4 p-3 rounded ${
              submissionResult.status === "Accepted"
                ? "bg-green-100"
                : "bg-yellow-100"
            } ${resultColor}`}
          >
            <p>
              <strong>Status:</strong> {submissionResult.status}
            </p>
            <p>
              <strong>Score:</strong> {submissionResult.score}
            </p>
            {submissionResult.message && (
              <p className="text-sm">{submissionResult.message}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Solution"}
        </button>
      </form>
    </div>
  );
}

export default ChallengeDetailPage;
