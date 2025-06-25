import React from 'react';
import { NavLink } from 'react-router-dom';

export default function SidebarNavbar({ open, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Sidebar */}
      <nav
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <ul className="flex flex-col mt-20 space-y-2 px-4">
          {[
            { to: '/', label: 'Home' },
            { to: '/Dashboard', label: 'Dashboard' },
            { to: '/AuditPlan', label: 'AuditPlan' },
            { to: '/NonConformity', label: 'NonConformity' }
          ].map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded transition-colors duration-200 ${
                    isActive ? "bg-orange-100 text-orange-700 font-bold" : "text-gray-700 hover:bg-orange-50"
                  }`
                }
                onClick={onClose}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
