// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Tailwind setup
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {" "}
      {/* Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>
);
