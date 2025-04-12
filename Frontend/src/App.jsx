// src/App.jsx
import React from "react"; // Good practice
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Import your authentication components
import CandidateAuth from "./components/CandidateAuth";
import CompanyAuth from "./components/CompanyAuth";

// Optional: Import default App CSS if you use it, otherwise remove
// import './App.css';

// A simple component for the home page / landing page
function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-10">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Hackathon Platform
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        Streamlining connections between talent and opportunities.
      </p>
      <nav className="space-x-4">
        <Link
          to="/candidate/auth"
          className="px-6 py-2 text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Candidate Portal
        </Link>
        <Link
          to="/company/auth"
          className="px-6 py-2 text-white bg-teal-600 rounded-md shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
        >
          Company Portal
        </Link>
      </nav>
      {/* You could add Vite/React logos back here if desired */}
      {/* Example:
        <div className="mt-10 flex justify-center gap-4">
            <img src="/vite.svg" className="logo h-10" alt="Vite logo" />
            <img src="./assets/react.svg" className="logo react h-10" alt="React logo" />
        </div>
       */}
    </div>
  );
}

function App() {
  // No need for the default useState counter anymore

  return (
    <Router>
      {/* The Router component wraps your entire application */}
      <div>
        {" "}
        {/* You can add a Layout component here later if needed (e.g., Navbar, Footer) */}
        <Routes>
          {/* Define individual routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/candidate/auth" element={<CandidateAuth />} />
          <Route path="/company/auth" element={<CompanyAuth />} />

          {/* Add more routes here as your application grows
          e.g. <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
               <Route path="/company/dashboard" element={<CompanyDashboard />} />
          */}

          {/* Optional: Add a 404 Not Found Route */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
