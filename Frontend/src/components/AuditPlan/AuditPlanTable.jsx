import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileIcon } from 'react-file-icon';

const AuditTable = () => {
  const [audits, setAudits] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/AuditPlan');
      setAudits(response.data);
    } catch (error) {
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

  const handleClick = (auditId) => {
    navigate('/abc', { state: { auditId } });
  };

  const handleDeleteSelected = async (ids = selectedIds) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await axios.delete('http://localhost:5000/audits', { data: { ids } });
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
            {/* <th className="border p-2">Audit Team</th> */}
            <th className="border p-2">Planned Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actual Date</th>
            {/* <th className="border p-2">Audit Criteria</th> */}
            {/* <th className="border p-2">Audit Scope</th> */}
            <th className="border p-2">Add Non Conformity</th>
            <th className="border p-2">Attachments</th>
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
              <td className="border p-2">
                <button
                  className="text-blue-600 underline"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                  onClick={() => navigate(`/edit-audit/${audit._id}`)}>
                  {audit.auditId}
                </button>
              </td>
              <td className="border p-2">{audit.auditType}</td>
              <td className="border p-2">{audit.standards}</td>
              <td className="border p-2">{audit.location}</td>
              <td className="border p-2">{audit.leadAuditor}</td>
              {/* <td className="border p-2">{audit.auditTeam}</td> */}
              <td className="border p-2">{new Date(audit.plannedDate).toLocaleDateString()}</td>
              <td className="border p-2">{audit.status}</td>
              <td className="border p-2">{new Date(audit.actualDate).toLocaleDateString()}</td>
              {/* <td className="border p-2">{audit.criteria}</td> */}
              {/* <td className="border p-2">{audit.scope}</td> */}
              <td className="border p-2">
                {audit.status === "Executed" && (
                  <button
                    onClick={() => handleClick(audit.auditId)}
                    className="w-auto bg-orange-700 hover:bg-orange-600 text-white font-semibold text-sm 
                      py-1 px-3 rounded mt-2 mb-2 ml-2 transition duration-200">
                    Add Non Conformity
                  </button>
                )}
              </td>
              <td className="border p-2">
                {audit.attachments && audit.attachments.length > 0 ? (
                  <ul>
                    {audit.attachments.map(file => {
                      const ext = file.originalname.split('.').pop().toLowerCase();
                      return (
                        <li key={file.filename} className="flex items-center gap-2">
                          <div style={{ width: 24, height: 24 }}>
                            <FileIcon extension={ext} />
                          </div>
                          <a
                            href={`http://localhost:5000/uploads/${file.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="text-blue-600 underline"
                          >
                            {file.originalname}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <span className="text-gray-400">No files</span>
                )}
              </td>
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
