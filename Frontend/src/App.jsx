// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom"; // Import Outlet for Layout

// Authentication Components
import CandidateAuth from "./components/CandidateAuth";
import CompanyAuth from "./components/CompanyAuth";

// Challenge Components
import ChallengeListPage from "./components/ChallengeListPage";
import ChallengeDetailPage from "./components/ChallengeDetailPage";

// Helper Components
import ProtectedRoute from "./components/ProtectedRoute"; // Assuming ProtectedRoute.jsx is in src/components/
import { useAuth } from "./context/AuthContext"; // Import useAuth to use in Layout

function Layout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold hover:text-gray-300">
            Anti-Resume
          </Link>
          <div className="space-x-4">
            {isAuthenticated && user?.role === "candidate" && (
              <>
                <Link to="/challenges" className="hover:text-gray-300">
                  Challenges
                </Link>
                {/* Add other candidate links */}
              </>
            )}
            {isAuthenticated && user?.role === "company" && (
              <>
                {/* Add company links like Post Task, View Tasks */}
                <Link to="/company/tasks/new" className="hover:text-gray-300">
                  Post Task
                </Link>
                <Link to="/company/tasks" className="hover:text-gray-300">
                  My Tasks
                </Link>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/candidate/auth" className="hover:text-gray-300">
                  Candidate Login
                </Link>
                <Link to="/company/auth" className="hover:text-gray-300">
                  Company Login
                </Link>
              </>
            )}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      <main>
        {/* The nested routes will render here */}
        <Outlet />
      </main>
      {/* Optional Footer */}
    </div>
  );
}

// --- App Component ---
function App() {
  return (
    <Router>
      {/* Wrap all routes within the Layout */}
      <Routes>
        <Route element={<Layout />}>
          {" "}
          {/* Apply Layout to all nested routes */}
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/candidate/auth" element={<CandidateAuth />} />
          <Route path="/company/auth" element={<CompanyAuth />} />
          {/* Protected Candidate Routes */}
          {/* <Route
            path="/challenges" // Challenge list page
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <ChallengeListPage />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/challenges" // Challenge list page
            element={<ChallengeListPage />}
          />
          <Route
            path="/challenges/:challengeId" // Challenge detail page
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <ChallengeDetailPage />
              </ProtectedRoute>
            }
          />
          {/* Protected Company Routes (Add these later) */}
          {/*
          <Route
            path="/company/tasks/new" // Example: Create Task Page
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <CreateTaskPage />
              </ProtectedRoute>
            }
          />
           <Route
            path="/company/tasks" // Example: View Company Tasks
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <ViewCompanyTasksPage />
              </ProtectedRoute>
            }
          />
          */}
          {/* Optional: Add a 404 Not Found Route */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
                {" "}
                {/* Adjust height based on layout */}
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

// Simple HomePage component (can be moved to its own file)
function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 text-center p-10">
      {" "}
      {/* Adjust height */}
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Hackathon Platform
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        Streamlining connections between talent and opportunities.
      </p>
      {/* Links removed as they are now in the Layout Navbar */}
    </div>
  );
}

export default App;
