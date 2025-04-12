// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user info { id, email, role }
  const [token, setToken] = useState(localStorage.getItem("token")); // Get token from storage initially
  const [loading, setLoading] = useState(true); // Add loading state

  // Simulate fetching user data based on token on initial load
  useEffect(() => {
    const validateTokenAndFetchUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          // **IMPORTANT**: Replace this with an actual API call
          // to your backend to validate the token and get user details.
          // Example: const response = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${storedToken}` } });
          // const userData = await response.json();
          // if (response.ok) {
          //   setUser(userData); // Assuming backend returns { id, email, role }
          //   setToken(storedToken);
          // } else {
          //   logout(); // Token invalid or expired
          // }

          // --- Placeholder Logic ---
          // Decode token (simple simulation - DO NOT use in production for sensitive data)
          // In a real app, the backend validates the token
          const payload = JSON.parse(atob(storedToken.split(".")[1] || "{}")); // Very basic decode
          if (payload.id && payload.role) {
            setUser({
              id: payload.id,
              email: payload.email || "user@example.com",
              role: payload.role,
            });
            setToken(storedToken);
          } else {
            logout(); // Invalid simulated token
          }
          // --- End Placeholder Logic ---
        } catch (error) {
          console.error("Token validation failed", error);
          logout(); // Clear state on error
        }
      }
      setLoading(false); // Done checking/loading
    };
    validateTokenAndFetchUser();
  }, []);

  // Simulate login - In real app, call backend API, get token/user, then call this
  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData); // userData should contain { id, email, role }
  };

  // Simulate logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Provide state and functions to children
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isLoading: loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}{" "}
      {/* Render children only after initial auth check */}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};
