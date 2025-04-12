// src/components/CreateTaskPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you use this for token
import validator from "validator";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

function CreateTaskPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    type: "",
  });
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth(); // Get token
  const navigate = useNavigate();
  console.info("-------------------------------");
  console.info("navigate => ", navigate);
  console.info("-------------------------------");

  const validateForm = () => {
    let isValid = true;
    let currentErrors = { title: "", description: "", type: "" };

    if (validator.isEmpty(formData.title.trim())) {
      currentErrors.title = "Task title is required.";
      isValid = false;
    }
    if (validator.isEmpty(formData.description.trim())) {
      currentErrors.description = "Task description is required.";
      isValid = false;
    }
    if (validator.isEmpty(formData.type.trim())) {
      currentErrors.type =
        "Task type (skill tag) is required for matching (e.g., python, frontend).";
      isValid = false;
    }

    setErrors(currentErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError(""); // Clear API error on input change
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return; // Stop if validation fails
    }

    if (!token) {
      setApiError("Authentication error. Please log in again.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/post-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.error || "Failed to create task");
      }

      setSuccessMessage(data.msg || "Task created successfully!");
      setFormData({ title: "", description: "", type: "" }); // Clear form
      // Optionally navigate away after a delay or keep the form
      // navigate('/company/tasks');
    } catch (err) {
      console.error("Error creating task:", err);
      setApiError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Post a New Task
      </h1>

      {apiError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {apiError}
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
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Task Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
              errors.title
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
            }`}
            placeholder="e.g., Build a Simple REST API Endpoint"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Task Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
              errors.description
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
            }`}
            placeholder="Provide clear instructions, inputs, expected outputs or deliverables..."
            disabled={isLoading}
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Task Type / Skill Tag
            <span className="text-xs text-gray-500 ml-1">
              (used for matching, e.g., python, frontend, api)
            </span>
          </label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
              errors.type
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
            }`}
            placeholder="e.g., python"
            disabled={isLoading}
          />
          {errors.type && (
            <p className="mt-1 text-xs text-red-600">{errors.type}</p>
          )}
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Posting Task..." : "Post Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTaskPage;
