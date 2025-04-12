// src/components/ViewCompanyPublicProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Needed to potentially get company name

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function ViewCompanyPublicProfile() {
  const { companyId } = useParams(); // Get companyId from URL
  const [profile, setProfile] = useState(null);
  const [companyName, setCompanyName] = useState("Company"); // Placeholder name
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // const { token } = useAuth(); // Auth token might not be needed for fetching

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${API_URL}/api/company-profile/${companyId}`
        );
        // Handle profile not found
        if (
          response.status === 404 ||
          response.headers.get("content-length") === "0"
        ) {
          throw new Error("Company profile not found or not set up yet.");
        }
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || "Failed to fetch profile");
        }
        const data = await response.json();
        setProfile(data);
        // Ideally fetch company name too from a /api/users/:id endpoint if needed
        // Or get it passed via state if navigating from a list that has it
      } catch (err) {
        setError(err.message);
        console.error("Fetch public profile error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [companyId]);

  if (isLoading)
    return <div className="text-center p-10">Loading company profile...</div>;
  if (error)
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  if (!profile)
    return (
      <div className="text-center p-10">Company profile not available.</div>
    );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        {companyName} Profile
      </h1>{" "}
      {/* Replace with actual name if available */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {/* About Section */}
        {profile.aboutCompany && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              About Us
            </h2>
            <p className="text-gray-600 whitespace-pre-line">
              {profile.aboutCompany}
            </p>
          </div>
        )}

        {/* Salary Info */}
        {profile.salaryRange && (
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-semibold mb-1 text-gray-700">
              Salary Indication
            </h2>
            <p className="text-gray-600">{profile.salaryRange}</p>
          </div>
        )}

        {/* Culture/Perks */}
        {profile.cultureValues && profile.cultureValues.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Culture & Perks
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.cultureValues.map((value, index) => (
                <span
                  key={index}
                  className="bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Add link back or other actions */}
        <div className="pt-4 border-t border-gray-100">
          <Link to="/" className="text-indigo-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ViewCompanyPublicProfile;
