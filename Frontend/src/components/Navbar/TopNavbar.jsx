import React, { useState, useRef, useEffect } from 'react';
import CompanyLogo from '../../assets/CompanyLogo.png';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaUserCircle } from 'react-icons/fa'; // Profile icon

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    toast.info("You have been logged out!", {
      position: "top-center",
      autoClose: 2000,
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 2100);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white shadow flex items-center justify-between px-6 z-50">
      {/* Hamburger for sidebar */}
      <button
        className="mr-4"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <svg className="w-7 h-7 text-orange-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo */}
      <img src={CompanyLogo} alt="Company Logo" className="h-8" />

      {/* Profile Dropdown */}
      {isAuthenticated && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-4 flex items-center focus:outline-none"
            aria-label="User menu"
          >
            <FaUserCircle className="text-3xl text-orange-700" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow-lg z-50 border">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-orange-50"
                onClick={() => { setMenuOpen(false); navigate("/profile"); }}
              >
                Your Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-orange-50"
                onClick={() => { setMenuOpen(false); navigate("/settings"); }}
              >
                Settings
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-red-700 hover:bg-orange-50"
                onClick={() => { setMenuOpen(false); handleLogout(); }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
