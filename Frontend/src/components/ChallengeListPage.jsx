// src/components/ChallengeListPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Assume useAuth provides authentication status and token
// import { useAuth } from '../context/AuthContext'; // Example context import

// Use environment variable for API URL if available, otherwise default
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050"; // Use your server port

function ChallengeListPage() {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // const { token } = useAuth(); // Get token from your auth context/hook

  // Placeholder for token - replace with your actual auth logic
  const token = localStorage.getItem("token"); // Example: reading from localStorage

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      setError(null);

      if (!token) {
        setError("You must be logged in to view challenges.");
        setIsLoading(false);
        return;
      }

      try {
        // Adjust fetch URL to your actual API endpoint (prefix with API_URL)
        const response = await fetch(`${API_URL}/api/challenges`, {
          // Use API_URL
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include your authorization header
            Authorization: `Bearer ${token}`,
          },
        });

        // Improved error handling for non-OK responses
        if (!response.ok) {
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errData = await response.json();
            errorMsg = errData.msg || errData.error || errorMsg;
          } catch (parseError) {
            // Ignore if response body is not JSON
            console.info("-------------------------------");
            console.info("parseError => ", parseError);
            console.info("-------------------------------");
          }
          throw new Error(errorMsg);
        }

        const data = await response.json();
        setChallenges(data);
      } catch (err) {
        console.error("Error fetching challenges:", err);
        setError(
          err.message || "Failed to fetch challenges. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, [token]); // Re-run if token changes

  if (isLoading) {
    return <div className="text-center p-10">Loading challenges...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  }

  if (challenges.length === 0) {
    return (
      <div className="text-center p-10">
        No challenges available at the moment.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Available Challenges
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <div
            key={challenge._id}
            className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out flex flex-col" // Added flex flex-col
          >
            <div className="p-5 flex-grow">
              {" "}
              {/* Added flex-grow */}
              <h2 className="text-xl font-semibold mb-2 text-gray-900">
                {challenge.title}
              </h2>
              <p className="text-gray-600 mb-3 text-sm">
                {challenge.description.substring(0, 100)}
                {challenge.description.length > 100 ? "..." : ""}
              </p>
              {/* --- UPDATED DISPLAY --- */}
              <div className="mb-4 flex flex-wrap gap-2">
                {/* Display Category (frontend/backend) */}
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                  Category: {challenge.type}
                </span>
                {/* Display Language Tag (python/java/etc) */}
                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                  Language: {challenge.languageTag}
                </span>
              </div>
              {/* --- END UPDATED DISPLAY --- */}
            </div>
            <div className="p-5 border-t border-gray-200">
              {" "}
              {/* Footer for button */}
              <Link
                to={`/challenges/${challenge._id}`} // Link to the detail page
                className="inline-block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                View & Solve
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChallengeListPage;
