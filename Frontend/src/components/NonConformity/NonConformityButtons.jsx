import React from "react";
import {Link, NavLink} from 'react-router-dom'
import NonConformityTable from "./NonConformityTable";

const NonConformityButton = () => {
  return (
    <div>
      {/* <Link to="/abc" className="inline-block items-center mr-10">
            <button className="md:w-25 bg-orange-700 hover:bg-blue-dark text-white font-bold text-l py-3 px-6 rounded-lg mt-5 mb-5 ml-2
            hover:bg-orange-600 transition ease-in-out duration-300">
                Create New Non Conformity
            </button>
        </Link> */}

        {/* <Link to="/NonConformity" className="inline-block items-center mr-10">
            <button className="md:w-25 bg-orange-700 hover:bg-blue-dark text-white font-bold text-l py-3 px-6 rounded-lg mt-5 mb-5 ml-20   
            hover:bg-orange-600 transition ease-in-out duration-300">
                Select All
            </button>
        </Link>

        <Link to="/NonConformity" className="inline-block items-center mr-10">
           <button className="md:w-full bg-orange-700 hover:bg-blue-dark text-white font-bold text-l py-3 px-6 rounded-lg mt-5 mb-5 
            hover:bg-orange-600 transition ease-in-out duration-300">
                Delete
            </button>
        </Link> */}
        <NonConformityTable/>
    </div>
  );
};

export default NonConformityButton;
