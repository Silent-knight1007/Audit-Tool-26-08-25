import { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

export default function AuditPlan() {

  // const navigate = useNavigate(); // this allows redirecting to another page

  const auditTeamOptions = [
  { value: "Alice", label: "Alice" },
  { value: "Bob", label: "Bob" },
  { value: "Charlie", label: "Charlie" },
  { value: "David", label: "David" },
  { value: "Eve", label: "Eve" }
];

const [auditId, setAuditId] = useState('');
const [auditType, setAuditType] = useState('');
const [standards, setStandards] = useState('');
const [location, setLocation] = useState('');
const [leadAuditor, setLeadAuditor] = useState('');
// You already have selectedAuditTeam
const [plannedDate, setPlannedDate] = useState('');
const [status, setStatus] = useState('');
const [actualDate, setActualDate] = useState('');
const [criteria, setCriteria] = useState('');
const [scope, setScope] = useState('');


const [selectedAuditTeam, setSelectedAuditTeam] = useState([]); // Initialize as empty array for multiselect
    // Your handler function to update the state
  const handleAuditTeamChange = (event) => {
    const values = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedAuditTeam(values);
  };

    // Example function to submit contact form data
const submitAuditPlanForm = async (AuditPlanData) => {
    try {
      const response = await fetch('http://localhost:5000/api/AuditPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(AuditPlanData),
      });
      const result = await response.json();
      if(response.ok){
        alert('Audit Plan form submitted successfully!');
        //  navigate('/AuditTable');  // 👈 Redirect to table page
      } else {
        alert('Failed to submit Audit Plan form: ' + result.error);
      }
    } catch (error) {
      alert('Error submitting Audit Plan form: ' + error.message);
    }
  };

  const handleAuditPlanFormSubmit = (e) => {
  e.preventDefault();
  const AuditPlanData = {
    auditId,
    auditType,
    standards,
    location,
    leadAuditor,
    auditTeam: selectedAuditTeam, // Use the state, not e.target
    plannedDate,
    status,
    actualDate,
    criteria,
    scope,
  };
  submitAuditPlanForm(AuditPlanData);
};

const handleCancel = () => {
  if (window.confirm("Are you sure you want to cancel filling the form?")) {
    setAuditId('');
    setAuditType('');
    setStandards('');
    setLocation('');
    setLeadAuditor('');
    setSelectedAuditTeam([]);
    setPlannedDate('');
    setStatus('');
    setActualDate('');
    setCriteria('');
    setScope('');
  }
};


  
    return (
        <div className="relative flex items-top justify-center min-h-[700px] bg-white sm:items-center sm:pt-0">
            <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                <div className="mt-8 overflow-hidden">
                    <div className="flex justify-center items-center min-h-screen bg-gray-0">

                        <form className="p-1 flex flex-col justify-center" onSubmit={handleAuditPlanFormSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                              <div className="flex flex-col  ">
                                    <label htmlFor="auditId" className="text-medium font-medium text-gray-700">
                                          Audit ID  <span className="text-red-500 text-xl mt-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="auditId"
                                        id="auditId"
                                        // value={formData.auditId}
                                        onChange={e => setAuditId(e.target.value)}
                                        value={auditId}
                                        placeholder="Enter Audit ID"
                                        required
                                        className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                        font-semibold focus:border-orange-500 focus:outline-none"
                                        // readOnly
                                    />
                              </div>

                              <div className="flex flex-col">
                               <label htmlFor="audit-type" className="text-medium font-medium text-gray-700">
                                  Audit Type <span className="text-red-500 text-xl mt-1">*</span>
                                </label>
                                    <select
                                       name="auditType"
                                       id="audit-type"
                                       value={auditType}
                                       onChange={e => setAuditType(e.target.value)}
                                       defaultValue=""
                                       required
                                       className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                       font-semibold focus:border-orange-500 focus:outline-none">
                                       <option value="" disabled>
                                              Audit Type
                                        </option>
                                       <option>Internal</option>
                                       <option>External</option>
                                    </select>
                              </div>

                              <div className="flex flex-col">
                               <label htmlFor="standards" className="text-medium font-medium text-gray-700">
                                  Standards <span className="text-red-500 text-xl mt-1">*</span>
                                </label>
                                    <select
                                       name="standards"
                                       id="standards"
                                       value={standards}
                                       onChange={e => setStandards(e.target.value)}
                                       defaultValue=""
                                       required
                                       className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                       font-semibold focus:border-orange-500 focus:outline-none">
                                       <option value="" disabled>
                                              Standards
                                        </option>
                                       <option value="ISO 9001 : 2015">ISO 9001 : 2015</option>
                                       <option value="ISO 27001 : 2023">ISO 27001 : 2023</option>
                                       <option value="ISO 27701 : 2019">ISO 27701 : 2019</option>
                                       <option value="ISO 22301 : 2019">ISO 22301 : 2019</option>
                                       <option value="ISO 27017 : 2015">ISO 27017 : 2015</option>
                                       <option value="ISO 27018 : 2015">ISO 27018 : 2015</option>
                                    </select>
                              </div>

                              <div className="flex flex-col">
                                <label htmlFor="location-audit" className="text-medium font-medium text-gray-700">
                                  Location <span className="text-red-500 text-xl mt-1">*</span>
                                </label>
                                    <select
                                       name="location"
                                       id="location-audit"
                                       value={location}
                                       onChange={e => setLocation(e.target.value)}
                                       defaultValue=""
                                       required
                                       className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-900 
                                       font-semibold focus:border-orange-500 focus:outline-none">
                                        <option value="" disabled>
                                              Enter Location
                                        </option>
                                       <option value="Noida">Noida</option>
                                       <option value="Bangalore">Bangalore</option>
                                       <option value="Pune">Pune</option>
                                       <option value="Dubai">Dubai</option>
                                       <option value="Singapore">Singapore</option>
                                       <option value="Gurgaon">Gurgaon</option>
                                    </select>
                              </div>

                              <div className="flex flex-col">
                                <label htmlFor="lead-auditor" className="text-medium font-medium text-gray-700">
                                  Lead Auditor <span className="text-red-500 text-xl mt-1">*</span>
                                </label>
                                    <input
                                       type="text"
                                       name="leadAuditor"
                                       value={leadAuditor}
                                       onChange={e => setLeadAuditor(e.target.value)}
                                       id="lead-auditor"
                                       required
                                       placeholder="Lead Auditor"
                                       className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                       font-semibold focus:border-orange-500 focus:outline-none"
                                    />
                              </div>

                              <div className="flex flex-col">
                                <label htmlFor="audit-team  " className="text-medium font-medium text-gray-700">
                                  Audit Team <span className="text-red-500 text-xl mt-1">*</span>
                                </label>
                                    <select
                                       name="auditTeam"
                                       id="audit-team"
                                       required
                                       options={auditTeamOptions}
                                       value={selectedAuditTeam}
                                       onChange={handleAuditTeamChange}
                                      //  className="mt-2"
                                       classNamePrefix="react-select"
                                       placeholder="Select Audit Team"
                                       className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-900 
                                       font-semibold focus:border-orange-500 focus:outline-none"
                                      >
                                       <option value="" disabled>
                                              Enter Team 
                                        </option>
                                       <option value="Alice">Alice</option>
                                       <option value="Bob">Bob</option>
                                       <option value="Charlie">Charlie</option>
                                       <option value="David">David</option>
                                       <option value="Eve">Eve</option>
                                    </select>
                              </div>

                              <div className="flex flex-col">
                                <label htmlFor="planned-date" className="text-medium font-medium text-gray-700">
                                    Planned Date <span className="text-red-500 text-xl mt-1">*</span>
                                </label>
                                <input
                                  type="date"
                                  name="plannedDate"
                                  id="planned-date"
                                  value={plannedDate}
                                  onChange={e => setPlannedDate(e.target.value)}
                                  required
                                  className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-900 
                                  font-semibold focus:border-orange-500 focus:outline-none"
                                />
                              </div>

                              <div className="flex flex-col">
                                <label htmlFor="status" className="text-medium font-medium text-gray-700">
                                  Status <span className="text-red-500 text-xl mt-1">*</span>
                                </label>
                                    <select
                                       name="status"
                                       id="status"
                                       value={status}
                                       onChange={e => setStatus(e.target.value)}
                                       required
                                       defaultValue=""
                                       className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-900 
                                       font-semibold focus:border-orange-500 focus:outline-none">
                                        <option value="" disabled>
                                              Status
                                        </option>
                                       <option value="Planned">Planned</option>
                                       <option value="Executed">Executed</option>
                                       <option value="Completed">Completed</option>
                                      </select>
                              </div>

                              <div className="flex flex-col">
                                <label htmlFor="actual-date" className="text-medium font-medium text-gray-700">
                                    Actual Date
                                </label>
                                <input
                                  type="date"
                                  name="actualDate"
                                  id="actual-date"
                                  value={actualDate}
                                  onChange={e => setActualDate(e.target.value)}
                                  className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-900 
                                  font-semibold focus:border-orange-500 focus:outline-none"
                                />
                              </div>

                              <div className="flex flex-col  ">
                                    <label htmlFor="criteria" className="text-medium font-medium text-gray-700">
                                          Audit Criteria  <span className="text-red-500 text-xl mt-1">*</span>
                                    </label>
                                    <textarea
                                        name="criteria"
                                        // type="text"
                                        id="criteria"
                                        value={criteria}
                                        onChange={e => setCriteria(e.target.value)}
                                        maxLength={1000}
                                        required
                                        placeholder="Enter Audit Criteria"
                                        rows={5} // You can adjust row count
                                        className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                        font-semibold focus:border-orange-500 focus:outline-none"
                                    ></textarea>
                              </div>

                              <div className="flex flex-col  ">
                                    <label htmlFor="scope" className="text-medium font-medium text-gray-700">
                                          Audit Scope  <span className="text-red-500 text-xl mt-1">*</span>
                                    </label>
                                     <textarea
                                        // type="text"
                                        name="scope"
                                        id="scope"
                                        onChange={e => setScope(e.target.value)}
                                        value={scope}
                                        maxLength={1000}
                                        required
                                        placeholder="Enter Audit Scope"
                                        rows={5} // You can adjust row count
                                        className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                        font-semibold focus:border-orange-500 focus:outline-none resize-y"
                                    ></textarea>
                              </div>
                              
                              <br></br>

                              <button
                                type="submit"
                                className="w-32 bg-orange-700 hover:bg-blue-dark text-white font-bold py-2 px-6 rounded-lg mt-10 
                                hover:bg-orange-600 transition ease-in-out duration-300">
                                Save
                              </button>

                              <button type="button" onClick={handleCancel}
                                className="md:w-32 bg-orange-700 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded-lg mt-10
                                hover:bg-orange-600 transition ease-in-out duration-300">
                                Cancel
                              </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}