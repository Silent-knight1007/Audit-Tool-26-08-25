import React from "react";
import {Link, NavLink} from 'react-router-dom'
import AuditTable from './AuditPlanTable'

const AuditPlanButton = () => {

  return (
    <div>
      <Link to="/xyz" className="inline-block items-center mr-10">
            <button className=" md:w-25 bg-orange-700 hover:bg-blue-dark text-white font-bold text-l py-3 px-6 rounded-lg mt-5 mb-5 ml-2
            // hover:bg-orange-600 transition ease-in-out duration-300">
                Create New Audit
            </button>
        </Link>

        {/* <Link to="/AuditPlan" className="inline-block items-center mr-10">
            <button className="md:w-25 bg-orange-700 hover:bg-blue-dark text-white font-bold text-l py-3 px-6 rounded-lg mt-5 mb-5 ml-2   
            hover:bg-orange-600 transition ease-in-out duration-300">
                Select All
            </button>
        </Link>

        <Link to="/AuditPlan" className="inline-block items-center mr-10">
           <button className="md:w-25 bg-orange-700 hover:bg-blue-dark text-white font-bold text-l py-3 px-6 rounded-lg mt-5 mb-5 ml-2
            hover:bg-orange-600 transition ease-in-out duration-300">
                Delete
            </button>
        </Link> */}

        <AuditTable />

    </div>
  );
};

export default AuditPlanButton;
