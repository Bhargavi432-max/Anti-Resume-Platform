// src/components/CandidateAuth.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import validator from "validator"; // Import the validator library

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function CandidateAuth() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    // State specifically for form field errors
    name: "",
    email: "",
    password: "",
  });
  const [apiError, setApiError] = useState(null); // State for errors from the API submission
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/challenges";

  // --- Validation Function ---
  const validateForm = () => {
    let errors = { name: "", email: "", password: "" };
    let isValid = true;

    // Name validation (only for signup)
    if (isSignup && validator.isEmpty(formData.name.trim())) {
      errors.name = "Full Name is required";
      isValid = false;
    }

    // Email validation
    if (validator.isEmpty(formData.email.trim())) {
      errors.email = "Email address is required";
      isValid = false;
    } else if (!validator.isEmail(formData.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (validator.isEmpty(formData.password)) {
      errors.password = "Password is required";
      isValid = false;
    } else if (
      isSignup &&
      !validator.isStrongPassword(formData.password, { minLength: 6 })
    ) {
      // Check strong password only on signup
      errors.password = "Password needs 6+ chars, upper, lower, number, symbol";
      isValid = false;
    }

    setFormErrors(errors); // Update the form error state
    return isValid; // Return true if form is valid, false otherwise
  };
  // --- End Validation Function ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Optionally clear the error for this field as the user types
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
    // Clear API error when user starts typing again
    if (apiError) setApiError(null);
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null); // Clear previous API errors
    setSuccessMessage("");

    // Perform frontend validation first
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    // Proceed with API call if validation passed
    setIsLoading(true);

    const url = isSignup ? `${API_URL}/auth/signup` : `${API_URL}/auth/login`;
    let body;

    if (isSignup) {
      body = JSON.stringify({ ...formData, role: "candidate" });
    } else {
      body = JSON.stringify({
        email: formData.email,
        password: formData.password,
      });
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.msg || data.error || `HTTP error! status: ${response.status}`
        );
      }

      if (isSignup) {
        console.log("Signup successful:", data);
        setSuccessMessage(data.msg || "Signup successful! Please sign in.");
        setIsSignup(false);
        setFormData({ name: "", email: "", password: "" });
        setFormErrors({ name: "", email: "", password: "" }); // Clear form errors too
      } else {
        console.log("Login successful:", data);
        if (data.token && data.user) {
          login(data.token, data.user);
          navigate(from, { replace: true });
        } else {
          throw new Error(
            "Login successful, but no token or user data received."
          );
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setApiError(err.message || "An unexpected error occurred."); // Set API error state
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setFormData({ name: "", email: "", password: "" });
    setFormErrors({ name: "", email: "", password: "" }); // Clear form errors
    setApiError(null); // Clear API errors
    setSuccessMessage("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        {" "}
        {/* Reduced space-y */}
        <h2 className="text-2xl font-bold text-center text-gray-900">
          {isSignup ? "Candidate Sign Up" : "Candidate Sign In"}
        </h2>
        {successMessage && (
          <div className="p-2 text-sm bg-green-100 text-green-700 rounded text-center">
            {" "}
            {/* Adjusted padding */}
            {successMessage}
          </div>
        )}
        {/* Display API Error Message */}
        {apiError && (
          <div className="p-2 text-sm bg-red-100 text-red-700 rounded text-center">
            {" "}
            {/* Adjusted padding */}
            {apiError}
          </div>
        )}
        <form className="space-y-3" onSubmit={handleSubmit}>
          {" "}
          {/* Reduced space-y */}
          {/* Name Field */}
          {isSignup && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required={isSignup}
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  formErrors.name
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                placeholder="Your Full Name"
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
              )}
            </div>
          )}
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                formErrors.email
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
              placeholder="you@example.com"
            />
            {formErrors.email && (
              <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
            )}
          </div>
          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                formErrors.password
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
              placeholder="********"
            />
            {formErrors.password && (
              <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>
            )}
          </div>
          {/* Submit Button */}
          <div className="pt-2">
            {" "}
            {/* Added padding top */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Processing..." : isSignup ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>
        {/* Toggle Link */}
        <p className="text-sm text-center text-gray-600 pt-1">
          {" "}
          {/* Added padding top */}
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            onClick={toggleMode}
            disabled={isLoading}
            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default CandidateAuth;
