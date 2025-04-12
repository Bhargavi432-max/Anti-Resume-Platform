import React, { useState } from "react";

function CompanyAuth() {
  const [isSignup, setIsSignup] = useState(false); // Default to Signin mode
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      // Handle Company Signup Logic (e.g., API call)
      console.log("Signing up company:", formData);
      // Reset form or redirect after successful signup
    } else {
      // Handle Company Signin Logic (e.g., API call)
      console.log("Signing in company:", {
        email: formData.email,
        password: formData.password,
      });
      // Reset form or redirect after successful signin
    }
    // In a real app, clear form: setFormData({ companyName: '', email: '', password: '' });
  };

  const toggleMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    // Clear form data when switching modes
    setFormData({ companyName: "", email: "", password: "" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          {isSignup ? "Company Sign Up" : "Company Sign In"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Company Name Field - Only show in Signup mode */}
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
                required={isSignup} // Required only if signing up
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="Your Company Name"
              />
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
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="hr@yourcompany.com"
            />
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
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="********"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>

        {/* Toggle Link */}
        <p className="text-sm text-center text-gray-600">
          {isSignup
            ? "Already have a company account?"
            : "Need to create a company account?"}{" "}
          <button
            onClick={toggleMode}
            className="font-medium text-teal-600 hover:text-teal-500 focus:outline-none focus:underline"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default CompanyAuth;
