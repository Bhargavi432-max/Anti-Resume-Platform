// src/components/CompanyProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import validator from "validator";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function CompanyProfilePage() {
  const [profileData, setProfileData] = useState({
    salaryRange: "",
    cultureValues: [], // Store as array
    aboutCompany: "",
  });
  const [cultureInput, setCultureInput] = useState(""); // Temp state for comma-separated input
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { user, token } = useAuth();

  // Fetch existing profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError("");
      if (!user || !token) {
        setError("Authentication required.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/company-profile/${user.id}`,
          {
            // Fetch own profile
            method: "GET",
            // No auth header needed based on backend route, but good practice to include if needed later
            // headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        // Handle 404 or empty profile gracefully
        if (response.status === 404) {
          console.log("No profile found, user can create one.");
          setIsLoading(false);
          return;
        }
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || "Failed to fetch profile");
        }

        const data = await response.json();
        if (data) {
          setProfileData({
            salaryRange: data.salaryRange || "",
            cultureValues: data.cultureValues || [],
            aboutCompany: data.aboutCompany || "",
          });
          // Set the input field based on the fetched array
          setCultureInput((data.cultureValues || []).join(", "));
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch profile error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccessMessage("");
  };

  // Handle changes specifically for the culture values input
  const handleCultureInputChange = (e) => {
    setCultureInput(e.target.value);
    // Update the actual profileData state by splitting the string
    const valuesArray = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setProfileData((prev) => ({ ...prev, cultureValues: valuesArray }));
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Basic validation
    if (validator.isEmpty(profileData.salaryRange.trim())) {
      setError("Salary Range is required.");
      return;
    }
    if (!user || !token) {
      setError("Authentication error. Please log in again.");
      return;
    }

    setIsSaving(true);
    try {
      // The backend route is POST /api/company-profile, not specific to user ID in URL
      const response = await fetch(`${API_URL}/api/company-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Auth is needed for POST
        },
        // Send the profileData state which includes the cultureValues array
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile");
      }
      setSuccessMessage("Profile saved successfully!");
      // Optionally update state again if backend returns updated data, though findOneAndUpdate should match
      setProfileData({
        salaryRange: data.salaryRange || "",
        cultureValues: data.cultureValues || [],
        aboutCompany: data.aboutCompany || "",
      });
      setCultureInput((data.cultureValues || []).join(", "));
    } catch (err) {
      setError(err.message);
      console.error("Save profile error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return <div className="text-center p-10">Loading profile...</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Manage Company Profile
      </h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div>
          <label
            htmlFor="salaryRange"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Salary Range Indication
            <span className="text-xs text-gray-500 ml-1">
              (e.g., $80k - $120k, Competitive + Equity)
            </span>
          </label>
          <input
            type="text"
            id="salaryRange"
            name="salaryRange"
            value={profileData.salaryRange}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Enter typical salary range or description"
            disabled={isSaving}
          />
        </div>
        <div>
          <label
            htmlFor="cultureInput"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Culture Values / Perks
            <span className="text-xs text-gray-500 ml-1">
              (comma-separated, e.g., Remote Friendly, Flexible Hours, Team
              Lunches)
            </span>
          </label>
          {/* Use a temporary input state for comma-separated values */}
          <input
            type="text"
            id="cultureInput"
            name="cultureInput"
            value={cultureInput}
            onChange={handleCultureInputChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Enter values separated by commas"
            disabled={isSaving}
          />
          {/* Optionally display the parsed tags */}
          <div className="mt-2 flex flex-wrap gap-1">
            {profileData.cultureValues.map((value, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
        <div>
          <label
            htmlFor="aboutCompany"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            About Your Company
          </label>
          <textarea
            id="aboutCompany"
            name="aboutCompany"
            rows="5"
            value={profileData.aboutCompany}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Describe your company mission, values, work environment..."
            disabled={isSaving}
          ></textarea>
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? "Saving Profile..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CompanyProfilePage;
