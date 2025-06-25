import React from 'react';

export default function Navbar({ onMenuClick }) {
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
      <span className="font-bold text-xl text-orange-700">Your Logo</span>
      {/* Auth Buttons */}
      <div className="flex items-center space-x-2">
        <a
          href="#"
          className="text-gray-800 hover:bg-gray-50 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none"
        >
          Log in
        </a>
        <a
          href="#"
          className="text-white bg-orange-700 hover:bg-orange-800 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none"
        >
          Get started
        </a>
      </div>
    </header>
  );
}
