// src/components/TaskDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path if needed
import FeedbackForm from "./FeedbackForm"; // Import the feedback form component

// Define supported languages based on your backend helper
const SUPPORTED_LANGUAGES = ["python", "java", "c", "c++", "javascript"];
// Define your API base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(""); // General page load error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(""); // Specific submission error
  const [submissionResult, setSubmissionResult] = useState(null); // Task submission result
  const { token, user } = useAuth(); // Get token and logged-in user info

  // Fetch Task Details and Company Profile
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      setCompanyProfile(null);
      setTask(null);

      if (!token || !user || user.role !== "candidate") {
        setError("Authentication required or invalid role.");
        setIsLoading(false);
        return;
      }

      try {
        // 1. Fetch matched tasks to find the specific task details (ideally use a GET /api/tasks/:taskId endpoint)
        const tasksResponse = await fetch(`${API_URL}/api/match-tasks`, {
          // Using match-tasks as fallback
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!tasksResponse.ok) {
          const errData = await tasksResponse.json().catch(() => ({}));
          throw new Error(errData.msg || "Failed to fetch task details.");
        }
        const allMatchedTasks = await tasksResponse.json();
        const foundTask = allMatchedTasks.find((t) => t._id === taskId);

        if (!foundTask) {
          throw new Error("Task not found or not matched to you.");
        }
        setTask(foundTask);
        setLanguage(
          SUPPORTED_LANGUAGES.includes(foundTask.type)
            ? foundTask.type
            : SUPPORTED_LANGUAGES[0]
        );

        // 2. Fetch company profile if companyId exists
        if (foundTask.companyId) {
          const companyIdToFetch =
            foundTask.companyId._id || foundTask.companyId; // Handle populated vs non-populated
          const profileResponse = await fetch(
            `${API_URL}/api/company-profile/${companyIdToFetch}`
          );
          if (
            profileResponse.ok &&
            profileResponse.headers.get("content-length") !== "0"
          ) {
            setCompanyProfile(await profileResponse.json());
          } else {
            console.log("Company profile not found or not set up.");
            setCompanyProfile(null);
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load task details.");
        console.error("Fetch task detail error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [taskId, token, user]); // Depend on user as well

  // --- Task Submission Handler ---
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!task || isSubmitting || !token || !code) return;
    setIsSubmitting(true);
    setSubmissionResult(null); // Clear previous result
    setSubmitError(""); // Clear previous error

    try {
      const response = await fetch(`${API_URL}/api/submit`, {
        // Using /api/submit task submission endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId: task._id,
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

      // Navigate back after a short delay on success (optional)
      if (result.status === "Accepted") {
        // Or check response.ok
        alert(`Your score is ${result?.score}`);
        // setTimeout(() => {
        //   navigate("/candidate/matches"); // Navigate back to the matched tasks list 
        // }, 2500);
      }
    } catch (err) {
      console.error("Error submitting task:", err);
      setSubmitError(err.message || "Failed to submit task solution.");
      setSubmissionResult(null); // Clear result on error
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---
  if (isLoading)
    return <div className="text-center p-10">Loading task details...</div>;
  if (error)
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  if (!task)
    return (
      <div className="text-center p-10">Task details could not be loaded.</div>
    );

  // Submission Result Styling
  let resultColor = "text-gray-700";
  if (submissionResult?.status === "Accepted") {
    resultColor = "text-green-600";
  } else if (submissionResult?.status) {
    resultColor = "text-red-600";
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left/Main Column: Task Details & Submission */}
      <div className="lg:col-span-2 space-y-6">
        <Link
          to="/candidate/matches"
          className="inline-block text-indigo-600 hover:underline"
        >
          &larr; Back to Matched Tasks
        </Link>

        {/* Task Details Box */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">
            {task.title}
          </h1>
          <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize mb-3">
            Skill: {task.type}
          </span>
          <p className="text-gray-700 whitespace-pre-line">
            {task.description}
          </p>
        </div>

        {/* Submission Form Box */}
        <form
          onSubmit={handleTaskSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Submit Your Solution
          </h2>
          {/* Language Selector */}
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
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {/* Code Editor */}
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
              rows="12"
              required
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              placeholder="Paste or write your code here..."
            ></textarea>
          </div>
          {/* Submit/Result Area */}
          {submitError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {submitError}
            </div>
          )}
          {submissionResult && (
            <div
              className={`mb-4 p-3 rounded text-sm ${
                submissionResult.status === "Accepted"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              } `}
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
              {submissionResult.status === "Accepted" && (
                <p className="mt-1 text-xs">
                  Redirecting back to matched tasks list...
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
              ? "Successfully Submitted"
              : "Submit Task Solution"}
          </button>
        </form>

        {/* --- ADDED: Feedback Form Section (Conditionally Rendered) --- */}
        {/* Show feedback form after a submission attempt has been made */}
        {submissionResult && user && task?.companyId && (
          <FeedbackForm
            targetCandidateId={user.id} // The logged-in candidate
            targetCompanyId={task.companyId._id || task.companyId} // The company associated with the task
          />
        )}
        {/* --- End Added Feedback Form Section --- */}
      </div>

      {/* Right Column: Company Info */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Company Information
          </h2>
          {/* Display company name if available */}
          {task?.companyId?.name && (
            <p className="font-medium text-gray-700 mb-3">
              {task.companyId.name}
            </p>
          )}

          {/* Display company profile details if fetched */}
          {companyProfile ? (
            <div className="space-y-3">
              {companyProfile.aboutCompany && (
                <div>
                  {" "}
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">
                    About
                  </h3>{" "}
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {companyProfile.aboutCompany}
                  </p>{" "}
                </div>
              )}
              {companyProfile.salaryRange && (
                <div>
                  {" "}
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">
                    Salary
                  </h3>{" "}
                  <p className="text-sm text-gray-600">
                    {companyProfile.salaryRange}
                  </p>{" "}
                </div>
              )}
              {companyProfile.cultureValues &&
                companyProfile.cultureValues.length > 0 && (
                  <div>
                    {" "}
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">
                      Culture/Perks
                    </h3>{" "}
                    <div className="flex flex-wrap gap-1">
                      {" "}
                      {companyProfile.cultureValues.map((value, index) => (
                        <span
                          key={index}
                          className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-0.5 rounded-full"
                        >
                          {" "}
                          {value}{" "}
                        </span>
                      ))}{" "}
                    </div>{" "}
                  </div>
                )}
              {/* Link to full public profile */}
              <div className="pt-3 border-t border-gray-100">
                <Link
                  to={`/company/${
                    task.companyId?._id || task.companyId
                  }/profile`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  {" "}
                  View Full Company Profile &rarr;{" "}
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Company profile details not available.
            </p>
          )}
        </div>
        {/* Feedback form was moved to left column, below submission */}
      </div>
    </div>
  );
}

export default TaskDetailPage;
