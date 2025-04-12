// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the hook - adjust path if needed

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a loading indicator while checking authentication
    // You might want a more sophisticated loading spinner component here
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // User not logged in, redirect them to a relevant login page
    // Redirecting to candidate login by default, adjust if needed
    // Pass the current location so we can redirect back after login (using state)
    return <Navigate to="/candidate/auth" state={{ from: location }} replace />;
    // Or maybe a generic login page: return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has one of the allowed roles (if roles are specified)
  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    // User is logged in but does not have the required role
    // Show an 'Unauthorized' message or redirect
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center p-10">
        {" "}
        {/* Adjust height */}
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-lg text-gray-700">
          You do not have the necessary permissions to view this page.
        </p>
        {/* Optionally add a link back home or to their specific dashboard */}
        <Link
          to="/"
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go to Homepage
        </Link>
      </div>
    );
    // Or redirect to a dedicated /unauthorized page:
    // return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has the required role (if specified)
  // Render the child component (the actual page)
  return children;
};

export default ProtectedRoute;
