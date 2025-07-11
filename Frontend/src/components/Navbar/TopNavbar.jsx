import React from 'react';
import CompanyLogo from '../../assets/CompanyLogo.png'
import { useNavigate } from "react-router-dom"



export default function Navbar({ onMenuClick }) {

   const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white shadow flex items-center justify-between px-6 z-50">
      {/* Hamburger for sidebar */}
      <button
        className="mr-4"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        {/* Hamburger icon SVG */}
        <svg className="w-7 h-7 text-orange-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo */}
      <img src={CompanyLogo} alt="Company Logo" className="h-8" />
     
     <button onClick={handleLogout} className="ml-4 px-3 py-1 bg-red-600 text-white rounded">
        Logout
      </button>

    </header>
  );
}
