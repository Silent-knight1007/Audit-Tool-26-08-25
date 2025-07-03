import Multiselect from 'multiselect-react-dropdown';
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";



export default function NonConformity() {
    const navigate = useNavigate();
    const [ncId, setNcId] = useState('');
    const [ncDescription, setNcDescription] = useState('');
    const [ncClauseNo, setNcClauseNo] = useState('');
    const [ncType, setNcType] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [department, setDepartment] = useState('');
    const [responsibleperson, setResponsibleperson] = useState('');
    const [responsiblepersonmail, setResponsiblepersonmail] = useState('');
    const [nclocation, setNclocation] = useState('');
    const [ncCorrectiveAction, setNcCorrectiveAction] = useState('');
    const [ncPreventiveAction, setNcPreventiveAction] = useState('');
    const [ncRootCause, setNcRootCause] = useState('');
    const [ncstatus, setNcstatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');



    // Example function to submit contact form data
  const submitNonConformityForm = async (NonConformityData) => {
    try 
    {
      const response = await fetch('http://localhost:5000/api/NonConformity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(NonConformityData),
      });
      const result = await response.json();
      if(response.ok){
        alert('NonConformity form submitted successfully!');
        navigate('/NonConformity');
      } else {
        alert('Failed to submit NonConformity form: ' + result.error);
      }
    } 
    catch (error) 
    {
      alert('Error submitting NonConformity form: ' + error.message);
    }
  };

  // Show confirmation popup
  const handleNonConformityFormSubmit = (e) => {
  e.preventDefault();
  setFormError('');

  // Basic validation (you can expand this as needed)
  if (
    !ncDescription ||
    !ncClauseNo ||
    !ncType ||
    !dueDate ||
    !department ||
    !responsibleperson ||
    !responsiblepersonmail ||
    !nclocation ||
    !ncCorrectiveAction ||
    !ncPreventiveAction ||
    !ncRootCause ||
    !ncstatus
  ) {
    setFormError('Please fill in all required fields.');
    return;
  }

  if (!window.confirm("Are you sure you want to save the NonConformity form?")) {
    return;
  }

  setIsSubmitting(true);

  const NonConformityData = {
    ncDescription,
    ncClauseNo,
    ncType,
    dueDate,
    department,
    responsibleperson,
    responsiblepersonmail,
    nclocation,
    ncCorrectiveAction,
    ncPreventiveAction,
    ncRootCause,
    ncstatus,
  };

  submitNonConformityForm(NonConformityData).finally(() => setIsSubmitting(false));
};


  // Cancel handler
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel filling the form?")) {
      setNcId('');
      setNcDescription('');
      setNcClauseNo('');
      setNcType('');
      setDueDate('');
      setDepartment('');
      setResponsibleperson('');
      setResponsiblepersonmail('');
      setNclocation('');
      setNcCorrectiveAction('');
      setNcPreventiveAction('');
      setNcRootCause('');
      setNcstatus('');
    }
  };

// const handleNonConformityFormSubmit = (e) => {
  //   e.preventDefault();
  //   const NonConformityData = {
  //     ncId: e.target.ncId.value,
  //     ncDescription: e.target.ncDescription.value,
  //     ncClauseNo: e.target.ncClauseNo.value,
  //     ncType: e.target.ncType.value,
  //     dueDate: e.target.dueDate.value,
  //     department: e.target.department.value,
  //     responsibleperson: e.target.responsibleperson.value,
  //     responsiblepersonmail: e.target.responsiblepersonmail.value,
  //     nclocation: e.target.nclocation.value,
  //     ncCorrectiveAction: e.target.ncCorrectiveAction.value,
  //     ncPreventiveAction: e.target.ncPreventiveAction.value,
  //     ncRootCause: e.target.ncRootCause.value,
  //     ncstatus: e.target.ncstatus.value,
  //   };
  //   submitNonConformityForm(NonConformityData);
  // };

  
    return (
        <div className="relative flex items-top justify-center min-h-[700px] bg-white sm:items-center sm:pt-0">
            <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                <div className="mt-8 overflow-hidden">
                    <div className="flex justify-center items-center min-h-screen bg-gray-0">
                        <form className="p-1 flex flex-col justify-center" onSubmit={handleNonConformityFormSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                              <div className="flex flex-col">
                                <label htmlFor="ncId" className="text-medium font-medium text-gray-700">
                                  NonConformityId
                                </label>
                                <input
                                  type="text"
                                  name="ncId"
                                  id="ncId"
                                  value={ncId}
                                  disabled
                                  placeholder="Will be generated after save"
                                  className="w-100 mt-2 py-3 px-3 rounded-lg bg-gray-100 border border-gray-400 text-gray-800 font-semibold"
                                />
                              </div>

                              <div className="flex flex-col  ">
                                    <label htmlFor="ncDescription" className="text-medium font-medium text-gray-700">
                                       Description  <span className="text-red-500 text-xl mt-1">*</span>
                                    </label>
                                    <textarea
                                        value={ncDescription}
                                        onChange={e => setNcDescription(e.target.value)}
                                        maxLength={1000}
                                        rows={4}
                                        name="ncDescription"
                                        id="ncDescription"
                                        placeholder="Enter Description"
                                        required
                                        className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                        font-semibold focus:border-orange-500 focus:outline-none"
                                    />
                              </div>

                              <div className="flex flex-col  ">
                                    <label htmlFor="ncClauseNo" className="text-medium font-medium text-gray-700">
                                      Clause Number  <span className="text-red-500 text-xl mt-1">*</span>
                                    </label>
                                    <textarea
                                        value={ncClauseNo}
                                        onChange={e => setNcClauseNo(e.target.value)}
                                        maxLength={1000}
                                        rows={4}
                                        name="ncClauseNo"
                                        id="ncClauseNo"
                                        required
                                        placeholder="Enter Clause No"
                                        className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                        font-semibold focus:border-orange-500 focus:outline-none"
                                    />
                              </div>

                              <div className="flex flex-col">
                               <label htmlFor="nc-type" className="text-medium font-medium text-gray-700">
                                  NonConformity Type <span className="text-red-500 text-xl mt-1">*</span>
                                </label>
                                    <select
                                       name="ncType"
                                       id="nc-type"
                                       required
                                       defaultValue=""
                                       className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                       font-semibold focus:border-orange-500 focus:outline-none">
                                       <option value="" disabled>
                                          NonConformity Type
                                        </option>
                                       <option>Minor</option>
                                       <option>Major</option>
                                       <option>Observation</option>
                                    </select>
                              </div>

                              <div className="flex flex-col">
                                <label htmlFor="due-date" className="text-medium font-medium text-gray-700">
                                    Due Date <span className="text-red-500 text-xl mt-1">*</span>
                                </label>
                                <input
                                  type="date"
                                  required
                                  name="dueDate"
                                  id="due-date"
                                  className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-900 
                                  font-semibold focus:border-orange-500 focus:outline-none"
                                />
                              </div>

                              <div className="flex flex-col">
                               <label htmlFor="department" className="text-medium font-medium text-gray-700">
                                  Department <span className="text-red-500 text-xl mt-1">*</span>
                                </label>
                                    <select
                                       name="department"
                                       id="department"
                                       required
                                       defaultValue=""
                                       className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                       font-semibold focus:border-orange-500 focus:outline-none">
                                       <option value="" disabled>
                                              Department
                                        </option>
                                       <option value="IT">IT</option>
                                       <option value="HR">HR</option>
                                       <option value="Finance">Finance</option>
                                       <option value="Operations">Operations</option>
                                       <option value="Compliance">Compliance</option>
                                       <option value="Quality Assurance">Quality Assurance</option>
                                    </select>
                              </div>

                              <div className="flex flex-col">
                               <label htmlFor="responsible-person" className="text-medium font-medium text-gray-700">
                                  Responsible-Person <span className="text-red-500 text-xl mt-1">*</span>
                                </label>
                                    <select
                                       name="responsibleperson"
                                       id="responsible-person"
                                       required
                                       defaultValue=""
                                       className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                       font-semibold focus:border-orange-500 focus:outline-none">
                                       <option value="" disabled>
                                              Responsible-Person
                                        </option>
                                       <option value="Alice">Alice</option>
                                       <option value="Bob">Bob</option>
                                       <option value="Charlie">Charlie</option>
                                    </select>
                              </div>

                               <div className="flex flex-col">
                               <label htmlFor="responsible-person-mail" className="text-medium font-medium text-gray-700">
                                  Responsible Person E-Mail <span className="text-red-500 text-xl mt-1">*</span>
                                </label>
                                    <select
                                       name="responsiblepersonmail"
                                       id="responsible-person-mail"
                                       defaultValue=""
                                       required
                                       className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                       font-semibold focus:border-orange-500 focus:outline-none">
                                       <option value="" disabled>
                                              Responsible Person E-Mail
                                        </option>
                                       <option value="alice@example.com">alice@example.com</option>
                                       <option value="bob@example.com">bob@example.com</option>
                                       <option value="charlie@example.com">charlie@example.com</option>
                                    </select>
                              </div>
                            
                              <div className="flex flex-col">
                                <label htmlFor="nc-location" className="text-medium font-medium text-gray-700">
                                  Location <span className="text-red-500 text-xl mt-1">*</span>
                                </label>
                                    <select
                                       name="location"
                                       id="nclocation"
                                       required
                                       defaultValue=""
                                       className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-900 
                                       font-semibold focus:border-orange-500 focus:outline-none">
                                        <option value="" disabled>
                                              Location
                                        </option>
                                       <option value="Noida">Noida</option>
                                       <option value="Bangalore">Bangalore</option>
                                       <option value="Pune">Pune</option>
                                       <option value="Dubai">Dubai</option>
                                       <option value="Singapore">Singapore</option>
                                       <option value="Gurgaon">Gurgaon</option>
                                    </select>
                              </div>

                              <div className="flex flex-col  ">
                                    <label htmlFor="ncCorrectiveAction" className="text-medium font-medium text-gray-700">
                                       Corrective Action  <span className="text-red-500 text-xl mt-1">*</span>
                                    </label>
                                    <textarea
                                        value={ncCorrectiveAction}
                                        onChange={e => setNcCorrectiveAction(e.target.value)}
                                        maxLength={1000}
                                        rows={4}
                                        name="ncCorrectiveAction"
                                        required
                                        id="ncCorrectiveAction"
                                        placeholder="Enter Corrective Action"
                                        className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                        font-semibold focus:border-orange-500 focus:outline-none"
                                    />
                              </div>

                              <div className="flex flex-col  ">
                                    <label htmlFor="ncPreventiveAction" className="text-medium font-medium text-gray-700">
                                       Preventive Action  <span className="text-red-500 text-xl mt-1">*</span>
                                    </label>
                                    <textarea
                                        value={ncPreventiveAction}
                                        maxLength={1000}
                                        rows={4}
                                        onChange={e => setNcPreventiveAction(e.target.value)}
                                        required
                                        name="ncPreventiveAction"
                                        id="ncPreventiveAction"
                                        placeholder="Enter Preventive Action"
                                        className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                        font-semibold focus:border-orange-500 focus:outline-none"
                                    />
                              </div>

                              <div className="flex flex-col  ">
                                    <label htmlFor="ncRootCause" className="text-medium font-medium text-gray-700">
                                       Root Cause  <span className="text-red-500 text-xl mt-1">*</span>
                                    </label>
                                    <textarea
                                        value={ncRootCause}
                                        name="ncRootCause"
                                        id="ncRootCause"
                                        onChange={e => setNcRootCause(e.target.value)}
                                        maxLength={1000}
                                        rows={4}
                                        required
                                        placeholder="Enter Root Cause"
                                        className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 
                                        font-semibold focus:border-orange-500 focus:outline-none"
                                    />
                              </div>

                              <div className="flex flex-col">
                                <label htmlFor="ncstatus" className="text-medium font-medium text-gray-700">
                                  Status <span className="text-red-500 text-xl mt-1">*</span>
                                </label>
                                    <select
                                       name="ncstatus"
                                       id="ncstatus"
                                       required
                                       defaultValue=""
                                       className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-900 
                                       font-semibold focus:border-orange-500 focus:outline-none">
                                        <option value="" disabled>
                                              Status
                                        </option>
                                       <option value="Open">Open</option>
                                       <option value="In Progress">In Progress</option>
                                       <option value="Fixed">Fixed</option>
                                       <option value="Closed">Closed</option>
                                       <option value="Aborted">Aborted</option>
                                       <option value="On-Hold">On-Hold</option>
                                      </select>
                              </div>

                                {/* <div className="field">
                                <label className="label" htmlFor="audit-attachment">
                                  Attachments
                                </label>
                                <div className="control">
                                  <div className="file has-name is-fullwidth">
                                    <label className="file-label">
                                      <input
                                        className="file-input"
                                        type="file"
                                        id="audit-attachment"
                                        multiple
                                        accept=".png,.jpg,.jpeg,.pdf,.docx,.xls,.xlsx,.ppt,.pptx"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                      />
                                        <span className="file-cta">
                                          <span className="file-icon">
                                            <i className="fas fa-upload" />
                                          </span>
                                          <span className="file-label">
                                            Choose file(s) from your device…
                                          </span>
                                        </span>
                                        <span className="file-name" id="audit-attachment-name">
                                          {files.length === 0
                                            ? "No file uploaded"
                                            : files.map((file) => file.name).join(", ")}
                                        </span>
                                    </label>
                                  </div>
                                </div>
                                <div id="audit-attachment-list" style={{ marginTop: "0.5em" }}>
                                  {files.length > 0 && (
                                    <ul>
                                      {files.map((file, idx) => (
                                      <li key={idx}>{file.name}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                                </div>  */}

                             <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-32 bg-orange-700 hover:bg-blue-dark text-white font-bold py-2 px-6 rounded-lg 
                                 mt-10 hover:bg-orange-600 transition ease-in-out duration-300">
                                {isSubmitting ? 'Saving...' : 'Save'}
                              </button>

                              <button type="button" onClick={handleCancel}
                                className="md:w-32 bg-orange-700 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded-lg mt-10
                                hover:bg-orange-600 transition ease-in-out duration-300">
                                Cancel
                              </button>

                            </div>
                            {formError && (
                            <div className="mb-4 text-red-600 font-semibold">{formError}</div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}