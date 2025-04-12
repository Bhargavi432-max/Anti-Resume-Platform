// src/components/CompanyAuth.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import validator from "validator"; // Import validator

// Define your API base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050"; // Use your server port

function CompanyAuth() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "", // Use companyName in local state
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    // State for form field errors
    companyName: "",
    email: "",
    password: "",
  });
  const [apiError, setApiError] = useState(null); // State for API submission errors
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { login } = useAuth(); // Get login function from context
  const navigate = useNavigate();
  const location = useLocation();
  // Define a default redirect path for companies after login
  const companyDashboardPath = "/company/tasks"; // Example: redirect to task list
  const from = location.state?.from?.pathname || companyDashboardPath;

  // --- Validation Function ---
  const validateForm = () => {
    let errors = { companyName: "", email: "", password: "" };
    let isValid = true;

    // Company Name validation (only for signup)
    if (isSignup && validator.isEmpty(formData.companyName.trim())) {
      errors.companyName = "Company Name is required";
      isValid = false;
    }

    // Email validation
    if (validator.isEmpty(formData.email.trim())) {
      errors.email = "Company Email address is required";
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
      errors.password = "Password needs 6+ chars, upper, lower, number, symbol";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };
  // --- End Validation Function ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
    if (apiError) setApiError(null);
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage("");

    if (!validateForm()) {
      return; // Stop if frontend validation fails
    }

    setIsLoading(true);
    const url = isSignup ? `${API_URL}/auth/signup` : `${API_URL}/auth/login`;
    let bodyObject;

    if (isSignup) {
      // Map companyName to 'name' for the backend User schema
      bodyObject = {
        name: formData.companyName, // Map frontend state to backend field
        email: formData.email,
        password: formData.password,
        role: "company", // Set role explicitly
      };
    } else {
      bodyObject = {
        email: formData.email,
        password: formData.password,
      };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyObject),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.msg || data.error || `HTTP error! status: ${response.status}`
        );
      }

      if (isSignup) {
        console.log("Company Signup successful:", data);
        setSuccessMessage(data.msg || "Signup successful! Please sign in.");
        setIsSignup(false);
        setFormData({ companyName: "", email: "", password: "" });
        setFormErrors({ companyName: "", email: "", password: "" });
      } else {
        console.log("Company Login successful:", data);
        if (data.token && data.user) {
          login(data.token, data.user); // Use context login function
          navigate(from, { replace: true }); // Navigate to company dashboard or intended page
        } else {
          throw new Error(
            "Login successful, but no token or user data received."
          );
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setApiError(err.message || "An unexpected error occurred.");
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setFormData({ companyName: "", email: "", password: "" });
    setFormErrors({ companyName: "", email: "", password: "" });
    setApiError(null);
    setSuccessMessage("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        {" "}
        {/* Reduced space */}
        <h2 className="text-2xl font-bold text-center text-gray-900">
          {isSignup ? "Company Sign Up" : "Company Sign In"}
        </h2>
        {successMessage && (
          <div className="p-2 text-sm bg-green-100 text-green-700 rounded text-center">
            {successMessage}
          </div>
        )}
        {apiError && (
          <div className="p-2 text-sm bg-red-100 text-red-700 rounded text-center">
            {apiError}
          </div>
        )}
        <form className="space-y-3" onSubmit={handleSubmit}>
          {" "}
          {/* Reduced space */}
          {/* Company Name Field */}
          {isSignup && (
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required={isSignup}
                value={formData.companyName}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  formErrors.companyName
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                }`}
                placeholder="Your Company Name"
              />
              {formErrors.companyName && (
                <p className="mt-1 text-xs text-red-600">
                  {formErrors.companyName}
                </p>
              )}
            </div>
          )}
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Company Email address
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
                  : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
              }`}
              placeholder="hr@yourcompany.com"
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
                  : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
              }`}
              placeholder="********"
            />
            {formErrors.password && (
              <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>
            )}
          </div>
          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Processing..." : isSignup ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>
        {/* Toggle Link */}
        <p className="text-sm text-center text-gray-600 pt-1">
          {isSignup
            ? "Already have a company account?"
            : "Need to create a company account?"}{" "}
          <button
            onClick={toggleMode}
            disabled={isLoading}
            className="font-medium text-teal-600 hover:text-teal-500 focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default CompanyAuth;
