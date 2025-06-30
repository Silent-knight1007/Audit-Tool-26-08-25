import React, { useState } from "react"; // Add useState import
import { Link } from 'react-router-dom';
import AuditTable from './AuditPlanTable';


const AuditPlanButton = () => {

        const [auditId, setAuditId] = useState('');

    // const handleCreate = async () => {
    //       try {
    //     const response = await fetch('http://localhost:5000/api/audits', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ /* any other audit fields */ })
    //     });
    //     if (response.ok) {
    //     const data = await response.json();
    //     setAuditId(data.id); // Show AUD001, etc.
    //     } else {
    //     console.error('Server error:', response.status);
    //     }
    //     } catch (err) {
    //     console.error("Failed to create audit:", err);
    //     }
    // };


    // const handleCreate = async () => {
    //         try {
    //     const response = await fetch('http://localhost:5000/api/audits', {
    //            method: 'POST',
    //            headers: { 'Content-Type': 'application/json' }
    //        });
    //     if (response.ok) {
    //     const data = await response.json();
    //     setAuditId(data.id); // Show AUD001, etc.
    //     } else {
    //     console.error('Server error:', response.status);
    //     }
    //     } catch (err) {
    //     console.error("Failed to create audit:", err);
    //     } 
    // };


        // const handleCreate = async () => {
        //   try {
        //     const response = await fetch('/api/audits', {
        //       method: 'POST',
        //       headers: { 'Content-Type': 'application/json' }
        //     });
        //     const data = await response.json();
        //        setAuditId(data.id); // Display AUD001, etc.
        //     } catch (err) {
        //        console.error("Failed to create audit:", err);
        //     }
        // };


  return (
        <div>
            <Link to="/xyz" className="inline-block items-center mr-10">
                <button className=" md:w-25 bg-orange-700 hover:bg-blue-dark text-white font-bold text-l py-3 px-6 rounded-lg mt-5 mb-5 ml-2
                    // hover:bg-orange-600 transition ease-in-out duration-300">
                       Create New Audit
                </button>
            </Link>
                {auditId && <p>Generated ID: {auditId}</p>}

           <AuditTable />

        </div>
    );
};

export default AuditPlanButton;


{/* <Link to="/AuditPlan" className="inline-block items-center mr-10">
            <button className="md:w-25 bg-orange-700 hover:bg-blue-dark text-white font-bold text-l py-3 px-6 rounded-lg mt-5 mb-5 ml-2   
            hover:bg-orange-600 transition ease-in-out duration-300">
                Select All
            </button>
        </Link> */}

        {/* <Link to="/AuditPlan" className="inline-block items-center mr-10">
           <button className="md:w-25 bg-orange-700 hover:bg-blue-dark text-white font-bold text-l py-3 px-6 rounded-lg mt-5 mb-5 ml-2
            hover:bg-orange-600 transition ease-in-out duration-300">
                Delete
            </button>
        </Link> */}
