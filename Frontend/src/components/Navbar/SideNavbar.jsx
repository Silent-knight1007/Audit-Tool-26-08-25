import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function SidebarNavbar({ open, onClose }) {
  const [isOrgDocsOpen, setIsOrgDocsOpen] = useState(false);

  const toggleOrgDocs = () => {
    setIsOrgDocsOpen(prev => !prev);
  };

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
            { to: '/NonConformity', label: 'NonConformity' },
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

          {/* Organisation Documents Menu */}
            <li>
              <button
                onClick={toggleOrgDocs}
                className="w-full text-left px-4 py-2 rounded text-gray-700 hover:bg-orange-50 flex justify-between items-center font-semibold focus:outline-none">
                    Organisation Documents
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform duration-300 ${isOrgDocsOpen ? 'rotate-90' : 'rotate-0'}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
              </button>

              {/* Submenu: show/hide based on isOrgDocsOpen */}
              {isOrgDocsOpen && (
              <ul className="ml-4 mt-1 space-y-1 transition-all duration-200">
              {[
              { to: '/organisationdocuments/policies', label: 'Policies' },
              { to: '/orgdocs/guidelines', label: 'Guidelines' },
              { to: '/orgdocs/templates', label: 'Templates' },
              { to: '/orgdocs/certificates', label: 'Certificates' },
              { to: '/orgdocs/advisories', label: 'Advisories' }
              ].map(subLink => (
        <li key={subLink.to}>
          <NavLink
            to={subLink.to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded text-gray-600 text-sm transition-colors duration-200 ${
                isActive ? "bg-orange-100 text-orange-700 font-bold" : "hover:bg-orange-50"
              }`
            }
            onClick={onClose}
          >
            {subLink.label}
          </NavLink>
        </li>
      ))}
    </ul>
  )}
          </li>

        </ul>
      </nav>
    </>
  );
}


















// import React from 'react';
// import { NavLink } from 'react-router-dom';

// export default function SidebarNavbar({ open, onClose }) {
//   return (
//     <>
//       {/* Overlay */}
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
//         onClick={onClose}
//       />
//       {/* Sidebar */}
//       <nav
//         className={`
//           fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300
//           ${open ? 'translate-x-0' : '-translate-x-full'}
//         `}
//       >
//         {/* Close button */}
//         <button
//           className="absolute top-4 right-4 text-gray-500 lg:hidden"
//           onClick={onClose}
//           aria-label="Close sidebar"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//         <ul className="flex flex-col mt-20 space-y-2 px-4">
//           {[
//             { to: '/', label: 'Home' },
//             { to: '/Dashboard', label: 'Dashboard' },
//             { to: '/AuditPlan', label: 'AuditPlan' },
//             { to: '/NonConformity', label: 'NonConformity' }
//           ].map(link => (
//             <li key={link.to}>
//               <NavLink
//                 to={link.to}
//                 className={({ isActive }) =>
//                   `block px-4 py-2 rounded transition-colors duration-200 ${
//                     isActive ? "bg-orange-100 text-orange-700 font-bold" : "text-gray-700 hover:bg-orange-50"
//                   }`
//                 }
//                 onClick={onClose}
//               >
//                 {link.label}
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </>
//   );
// }
