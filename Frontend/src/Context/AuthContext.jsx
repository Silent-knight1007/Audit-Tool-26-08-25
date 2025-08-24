import React, { createContext, useState, useEffect } from "react";

// Create the Auth Context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  // On component mount, check localStorage for auth state & role
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated") === "true";
    const storedRole = localStorage.getItem("role");
    setIsAuthenticated(auth);
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  // Function to log in
  function login(userRole) {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("role", userRole);
    setIsAuthenticated(true);
    setRole(userRole);
  }

  // Function to log out
  function logout() {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

