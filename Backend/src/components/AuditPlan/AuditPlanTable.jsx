import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AuditTable = () => {
  const [audits, setAudits] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/AuditPlan');
      setAudits(response.data);
    } 
    catch (error) {
       console.error('Error fetching audits:', error.message);
       if (error.response) {
       console.error('Response:', error.response.data);
       } else if (error.request) {
       console.error('No response received:', error.request);
       } else {
       console.error('Axios config error:', error.config);
       }
    }

  };

  const handleDeleteSelected = async (ids = selectedIds) => {
  if (!window.confirm("Are you sure you want to delete?")) return;

  try {
    // Send DELETE request to backend
    await axios.delete('http://localhost:5000/audits', { data: { ids } });

    // Remove from UI after successful deletion
    setAudits(audits.filter(audit => !ids.includes(audit._id)));
    setSelectedIds(selectedIds.filter(id => !ids.includes(id)));
  } catch (error) {
    alert("Error deleting audits");
  }
};  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Audit Records</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">
              <input
              type="checkbox"
              checked={audits.length > 0 && selectedIds.length === audits.length}
              onChange={e => {
              if (e.target.checked) {
                setSelectedIds(audits.map(a => a._id));
              } else {
                setSelectedIds([]);
              }
              }}
              />
            </th>
            <th className="border p-2">Audit ID</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Standards</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Lead Auditor</th>
            <th className="border p-2">Audit Team</th>
            <th className="border p-2">Planned Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actual Date</th>
            <th className="border p-2">Audit Criteria</th>
            <th className="border p-2">Audit Scope</th>
          </tr>
        </thead>
        <tbody>
          {audits.map((audit) => (
            <tr key={audit._id}>
              <td className="border p-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(audit._id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds([...selectedIds, audit._id]);
                    } else {
                      setSelectedIds(selectedIds.filter(id => id !== audit._id));
                    }
                  }}
                />
              </td>
              <td className="border p-2">{audit.auditId}</td>
              <td className="border p-2">{audit.auditType}</td>
              <td className="border p-2">{audit.standards}</td>
              <td className="border p-2">{audit.location}</td>
              <td className="border p-2">{audit.leadAuditor}</td>
              <td className="border p-2">{audit.auditTeam}</td>
              <td className="border p-2">{new Date(audit.plannedDate).toLocaleDateString()}</td>
              <td className="border p-2">{audit.status}</td>
              <td className="border p-2">{new Date(audit.actualDate).toLocaleDateString()}</td>
              <td className="border p-2">{audit.criteria}</td>
              <td className="border p-2">{audit.scope}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded mt-4"
        onClick={() => handleDeleteSelected()}
        disabled={selectedIds.length === 0}
      >
        Delete Selected
      </button>
    </div>
  );
};

export default AuditTable;
