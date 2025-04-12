// src/components/ChallengeDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Added Link, useNavigate

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";
const SUPPORTED_LANGUAGES = ["python", "java", "c", "c++", "javascript"];

function ChallengeDetailPage() {
  const { challengeId } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const token = localStorage.getItem("token"); // Placeholder token

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
        const response = await fetch(`${API_URL}/api/challenges`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errData = await response.json();
            errorMsg = errData.msg || errData.error || errorMsg;
          } catch (e) {}
          throw new Error(errorMsg);
        }
        const allChallenges = await response.json();
        const foundChallenge = allChallenges.find(
          (ch) => ch._id === challengeId
        );
        if (foundChallenge) {
          setChallenge(foundChallenge);
          setCode(foundChallenge.boilerplateCode || "");
          setLanguage(foundChallenge.languageTag || SUPPORTED_LANGUAGES[0]);
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
    setSubmissionResult(null);
    setSubmitError(null);
    try {
      const response = await fetch(`${API_URL}/api/challenges/submit`, {
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
        throw new Error(
          result.msg ||
            result.error ||
            `Submission failed! Status: ${response.status}`
        );
      }
      setSubmissionResult({
        status: result.status,
        score: result.score,
        message: result.msg,
      });

      // --- ADDED: Navigate back after a short delay on success ---
      if (result.status === "Accepted") {
        // Or check response.ok
        setTimeout(() => {
          navigate("/challenges"); // Navigate back to the challenges list
        }, 2500); // Increased delay slightly
      }
      // --- End Added Logic ---
    } catch (err) {
      console.error("Error submitting challenge:", err);
      setSubmitError(err.message || "Failed to submit solution.");
      setSubmissionResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading challenge details...</div>;
  }
  if (error && !challenge) {
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  }
  if (!challenge) {
    return <div className="text-center p-10">Challenge not found.</div>;
  }

  let resultColor = "text-gray-700";
  if (submissionResult?.status === "Accepted") {
    resultColor = "text-green-600";
  } else if (submissionResult?.status) {
    resultColor = "text-red-600";
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Link
        to="/challenges"
        className="mb-4 inline-block text-indigo-600 hover:underline"
      >
        &larr; Back to Challenges
      </Link>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          {challenge.title}
        </h1>
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
            Category: {challenge.type}
          </span>
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
            Language: {challenge.languageTag}
          </span>
        </div>
        <p className="text-gray-700 mb-4 whitespace-pre-line">
          {challenge.description}
        </p>{" "}
        {/* Use whitespace-pre-line */}
        {challenge.input && (
          <div className="mb-2">
            <h3 className="font-semibold text-sm text-gray-600">
              Input Example:
            </h3>
            <pre className="bg-gray-100 p-2 rounded text-xs text-gray-800 whitespace-pre-wrap break-words">
              {challenge.input}
            </pre>
          </div>
        )}
        {challenge.expectedOutput && (
          <div className="mb-4">
            <h3 className="font-semibold text-sm text-gray-600">
              Expected Output:
            </h3>
            <pre className="bg-gray-100 p-2 rounded text-xs text-gray-800 whitespace-pre-wrap break-words">
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
                {" "}
                {lang.charAt(0).toUpperCase() + lang.slice(1)}{" "}
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
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows="15"
            required
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            placeholder="Write your code here..."
          ></textarea>
        </div>
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {" "}
            {submitError}{" "}
          </div>
        )}
        {submissionResult && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              submissionResult.status === "Accepted"
                ? "bg-green-100"
                : "bg-red-100"
            } ${resultColor}`}
          >
            <p>
              <strong>Status:</strong> {submissionResult.status}
            </p>
            <p>
              <strong>Score:</strong> {submissionResult.score}
            </p>
            {submissionResult.message && (
              <p className="text-sm opacity-80">{submissionResult.message}</p>
            )}
            {/* ADDED: Message about redirecting */}
            {submissionResult.status === "Accepted" && (
              <p className="mt-1 text-xs">
                Redirecting back to challenges list...
              </p>
            )}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting || submissionResult?.status === "Accepted"}
          className={`w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out ${
            isSubmitting || submissionResult?.status === "Accepted"
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {isSubmitting
            ? "Submitting..."
            : submissionResult?.status === "Accepted"
            ? "Submitted Successfully"
            : "Submit Solution"}
        </button>
      </form>
    </div>
  );
}
export default ChallengeDetailPage;
