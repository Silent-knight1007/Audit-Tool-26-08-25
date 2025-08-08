import React, { createContext, useState, useEffect } from "react";

// Create the Auth Context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On component mount, check localStorage for auth state
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(auth);
  }, []);

  // Function to log in
  function login() {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  }

  // Function to log out
  function logout() {
    localStorage.setItem("isAuthenticated", "false");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
