// src/components/CandidateProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Adjust path if needed
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function CandidateProfilePage() {
  const { user, token, isLoading: authLoading } = useAuth(); // Use user from AuthContext
  // User object in context should ideally contain skills after login or fetched via /me endpoint
  const [userDetails, setUserDetails] = useState(user);
  const [isLoading, setIsLoading] = useState(authLoading); // Reflect auth loading state
  const [error, setError] = useState("");

  // --- Optional: Fetch full user details if skills aren't in context ---
  /*
    useEffect(() => {
        const fetchMyDetails = async () => {
            if (!token || userDetails?.skills?.length > 0) { // Don't fetch if no token or skills already present
                 setIsLoading(false);
                 return;
             }
            setIsLoading(true);
            setError('');
            try {
                // *** ASSUMES backend endpoint GET /api/auth/me exists and returns {..., skills: [...] } ***
                const response = await fetch(`${API_URL}/api/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                 const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.msg || 'Failed to fetch user details');
                }
                setUserDetails(data); // Update state with full details including skills
                // Optionally update the context user as well? -> depends on AuthContext setup
            } catch (err) {
                setError(err.message);
                console.error("Fetch user details error:", err);
            } finally {
                setIsLoading(false);
            }
        };

         if (!authLoading && user && user.role === 'candidate') {
           fetchMyDetails();
        } else if (!authLoading && (!user || user.role !== 'candidate')) {
             setError("Access Denied.");
             setIsLoading(false);
        } else if (!authLoading && !user) {
             setError("Please log in.");
             setIsLoading(false);
        } else {
            // Sync with context user if fetch isn't needed or auth is still loading
            setUserDetails(user);
        }

    }, [token, authLoading, user]); // Dependencies
    */
  // --- End of optional fetch logic ---

  // Simpler logic if skills ARE expected in the context 'user' object after login/refresh
  useEffect(() => {
    if (!authLoading) {
      if (user && user.role === "candidate") {
        setUserDetails(user);
        setError("");
      } else if (user && user.role !== "candidate") {
        setError("Access Denied. This profile is for candidates.");
      } else {
        setError("Please log in to view your profile.");
      }
      setIsLoading(false);
    } else {
      setIsLoading(true); // Show loading while auth context loads
    }
  }, [authLoading, user]);

  if (isLoading)
    return <div className="text-center p-10">Loading profile...</div>;
  if (error)
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  if (!userDetails)
    return <div className="text-center p-10">Could not load user profile.</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        My Candidate Profile
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {/* Display basic info from context */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Name</h2>
          <p className="text-gray-900">{userDetails.name}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Email</h2>
          <p className="text-gray-900">{userDetails.email}</p>
        </div>

        {/* Display Skills */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Acquired Skills
          </h2>
          {/* Check if userDetails.skills exists and has items */}
          {userDetails.skills && userDetails.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userDetails.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full capitalize"
                >
                  {skill} {/* Display the skill */}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">
              You haven't acquired any skills from challenges yet.
              {/* Link to challenges page */}
              <Link
                to="/challenges"
                className="text-indigo-600 hover:underline ml-2"
              >
                Solve some challenges!
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CandidateProfilePage;
