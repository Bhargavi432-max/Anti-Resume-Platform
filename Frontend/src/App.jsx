// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom"; // Import Outlet for Layout

// --- Import Authentication Components ---
import CandidateAuth from "./components/CandidateAuth";
import CompanyAuth from "./components/CompanyAuth";

// --- Import Challenge Components ---
import ChallengeListPage from "./components/ChallengeListPage";
import ChallengeDetailPage from "./components/ChallengeDetailPage";

// --- Import Candidate Task/Profile Components ---
import MatchedTasksPage from "./components/MatchedTasksPage"; // Import candidate matches page
import TaskDetailPage from "./components/TaskDetailPage"; // Import task detail page
import CandidateProfilePage from "./components/CandidateProfilePage"; // Import candidate profile page

// --- Import Company Task Components ---
import CreateTaskPage from "./components/CreateTaskPage";
import ViewCompanyTasksPage from "./components/ViewCompanyTasksPage";
import ViewAnonymousSubmissionsPage from "./components/ViewAnonymousSubmissionsPage";
import ViewAllSubmissionsPage from "./components/ViewAllSubmissionsPage";
import CompanyDashboardSummary from "./components/CompanyDashboardSummary"; // Summary component
import CompanyProfilePage from "./components/CompanyProfilePage"; // Company profile edit page
import ViewCompanyPublicProfile from "./components/ViewCompanyPublicProfile"; // Public company profile view
import ViewFeedbackPage from "./components/ViewFeedbackPage"; // Company view feedback page

// --- Import Helper Components ---
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

// --- Layout Component Definition ---
function Layout() {
  const { isAuthenticated, user, logout } = useAuth(); // Get auth state

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-50">
        {" "}
        {/* Made navbar sticky */}
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold hover:text-gray-300">
            Anti-Resume
          </Link>
          <div className="space-x-4 flex items-center">
            {" "}
            {/* Use flex items-center */}
            {/* === Candidate Links === */}
            {isAuthenticated && user?.role === "candidate" && (
              <>
                <Link
                  to="/challenges"
                  className="hover:text-gray-300 text-sm sm:text-base"
                >
                  Challenges
                </Link>
                <Link
                  to="/candidate/matches"
                  className="hover:text-gray-300 text-sm sm:text-base"
                >
                  My Matches
                </Link>
                <Link
                  to="/candidate/profile"
                  className="hover:text-gray-300 text-sm sm:text-base"
                >
                  My Profile
                </Link>
              </>
            )}
            {/* === Company Links === */}
            {isAuthenticated && user?.role === "company" && (
              <>
                <Link
                  to="/company/dashboard"
                  className="hover:text-gray-300 text-sm sm:text-base"
                >
                  Dashboard
                </Link>
                <Link
                  to="/company/tasks/new"
                  className="hover:text-gray-300 text-sm sm:text-base"
                >
                  Post Task
                </Link>
                <Link
                  to="/company/tasks"
                  className="hover:text-gray-300 text-sm sm:text-base"
                >
                  My Tasks
                </Link>
                <Link
                  to="/company/submissions"
                  className="hover:text-gray-300 text-sm sm:text-base"
                >
                  Submissions
                </Link>
                <Link
                  to="/company/profile"
                  className="hover:text-gray-300 text-sm sm:text-base"
                >
                  My Profile
                </Link>
                <Link
                  to="/company/feedback"
                  className="hover:text-gray-300 text-sm sm:text-base"
                >
                  View Feedback
                </Link>
              </>
            )}
            {/* === Login/Logout Links === */}
            {!isAuthenticated && (
              <>
                <Link
                  to="/candidate/auth"
                  className="hover:text-gray-300 text-sm sm:text-base"
                >
                  Candidate Login
                </Link>
                <Link
                  to="/company/auth"
                  className="hover:text-gray-300 text-sm sm:text-base"
                >
                  Company Login
                </Link>
              </>
            )}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm sm:text-base"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      {/* Added bg and padding top to account for sticky nav */}
      <main className="bg-gray-50 min-h-screen pt-16">
        {" "}
        {/* pt-16 assumes nav height of 4rem (p-4 = 1rem * 2 = 2rem, total height ~4rem) */}
        {/* The nested routes will render here via Outlet */}
        <Outlet />
      </main>
      {/* Optional Footer */}
      {/* <footer className="bg-gray-700 text-white text-center p-4 text-xs">
           Hackathon Project - Anti-Resume
       </footer> */}
    </div>
  );
}

// --- Simple HomePage Component Definition ---
function HomePage() {
  return (
    // Adjust height calculation if needed
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 text-center p-10">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Anti-Resume</h1>
      <p className="mb-8 text-lg text-gray-600">
        Streamlining connections between talent and opportunities.
      </p>
      {/* Links are in the Layout Navbar */}
    </div>
  );
}

// --- Simple Company Dashboard Page Definition ---
function CompanyDashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Company Dashboard
      </h1>
      <div className="grid grid-cols-1 gap-6">
        {" "}
        {/* Adjust grid/layout as needed */}
        {/* Include the summary component */}
        <CompanyDashboardSummary />
        {/* You could add more dashboard widgets here */}
        {/* Example: <Link to="/company/tasks/new" className="...">Post a New Task</Link> */}
      </div>
    </div>
  );
}

// --- Main App Component Definition ---
function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap all viewable routes within the Layout */}
        <Route element={<Layout />}>
          {/* === Public Routes === */}
          <Route path="/" element={<HomePage />} />
          <Route path="/candidate/auth" element={<CandidateAuth />} />
          <Route path="/company/auth" element={<CompanyAuth />} />
          {/* Public Company Profile View */}
          <Route
            path="/company/:companyId/profile"
            element={<ViewCompanyPublicProfile />}
          />

          {/* === Protected Candidate Routes === */}
          <Route
            path="/challenges" // Challenge list page
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <ChallengeListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/:challengeId" // Challenge detail page
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <ChallengeDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/matches" // Candidate sees matched tasks
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <MatchedTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/:taskId" // Candidate views task detail (accessible if matched)
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <TaskDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/profile" // Candidate views their profile/skills
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <CandidateProfilePage />
              </ProtectedRoute>
            }
          />

          {/* === Protected Company Routes === */}
          <Route
            path="/company/dashboard" // Company main dashboard
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CompanyDashboardPage /> {/* Renders the dashboard wrapper */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/tasks/new" // Create Task Page
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CreateTaskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/tasks" // View Company's Tasks list
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <ViewCompanyTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/tasks/:taskId/anonymous-submissions" // View Anonymous Submissions for a specific task
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                {" "}
                {/* Keep protected for consistency */}
                <ViewAnonymousSubmissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/submissions" // View All/Filtered Identified Submissions
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <ViewAllSubmissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/profile" // Company edits their profile
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CompanyProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/feedback" // Company views feedback about them
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <ViewFeedbackPage />
              </ProtectedRoute>
            }
          />

          {/* === 404 Not Found Route === */}
          <Route
            path="*"
            element={
              // Adjust height calculation if needed
              <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
              </div>
            }
          />
        </Route>{" "}
        {/* End of Layout Route */}
      </Routes>
    </Router>
  );
}

export default App; // Export the main App component
