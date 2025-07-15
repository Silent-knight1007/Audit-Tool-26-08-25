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
  const selectedAudits = audits.filter(audit => ids.includes(audit._id));
  const nonPlanned = selectedAudits.filter(
    audit =>
      typeof audit.status === 'string' &&
      audit.status.trim().toLowerCase() !== 'planned'
  );

  if (nonPlanned.length > 0) {
    alert("Only audits with status 'planned' can be deleted.");
    return;
  }

  if (!window.confirm("Are you sure you want to delete?")) return;

  try {
    const response = await axios.delete('http://localhost:5000/audits', {
      data: { ids }
    });

    const deletedIds = response.data.deletedIds || [];

    setAudits(audits.filter(a => !deletedIds.includes(a._id)));
    setSelectedIds(selectedIds.filter(id => !deletedIds.includes(id)));

    alert(response.data.message || "Deleted successfully.");
  } catch (error) {
    console.error('Error deleting audits:', error);
    alert("Error deleting audits");
  }
};


  return (
    <div className="p-1">
      <h2 className="text-xl font-bold mb-4">Audit Records</h2>
      <table className="min-w-full table-auto border-collapse border-red-500 text-xs">
        <thead className="bg-red-500">
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
            <th className="border p-2 text-xs text-white">Audit ID</th>
            <th className="border p-2 text-xs text-white">Type</th>
            <th className="border p-2 text-xs text-white">Standards</th>
            <th className="border p-2 text-xs text-white">Location</th>
            <th className="border p-2 text-xs text-white">Lead Auditor</th>
            {/* <th className="border p-2">Audit Team</th> */}
            <th className="border p-2 text-xs text-white">Planned Date</th>
            <th className="border p-2 text-xs text-white">Status</th>
            <th className="border p-2 text-xs text-white">Actual Date</th>
            {/* <th className="border p-2">Audit Criteria</th> */}
            {/* <th className="border p-2">Audit Scope</th> */}
            <th className="border p-2 text-xs text-white">Add Non Conformity</th>
            <th className="border p-2 text-xs text-white">Attachments</th>
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
              <td className="border p-2 text-xs">
                <button
                  className="text-blue-900 underline"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                  onClick={() => navigate(`/edit-audit/${audit._id}`)}>
                  {audit.auditId}
                </button>
              </td>
              <td className="border p-2 text-xs">{audit.auditType}</td>
              <td className="border p-2 text-xs">{audit.standards}</td>
              <td className="border p-2 text-xs">{audit.location}</td>
              <td className="border p-2 text-xs">{audit.leadAuditor}</td>
              {/* <td className="border p-2">{audit.auditTeam}</td> */}
              <td className="border p-2 text-xs">{new Date(audit.plannedDate).toLocaleDateString()}</td>
              <td className="border p-2 text-xs">{audit.status}</td>
              <td className="border p-2 text-xs">{new Date(audit.actualDate).toLocaleDateString()}</td>
              {/* <td className="border p-2">{audit.criteria}</td> */}
              {/* <td className="border p-2">{audit.scope}</td> */}
              <td className="border p-2 text-xs">
                {audit.status === "Executed" && (
                  <button
                    onClick={() => handleClick(audit.auditId)}
                    className="w-auto bg-red-500 hover:bg-orange-600 text-white font-bold text-xs
                      py-1 px-1 rounded mt-2 mb-2 transition duration-200">
                    Add NonConformity
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
                            className="text-blue-900 underline"
                          >
                            {file.originalname}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <span className="text-red-500">No files</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="bg-red-500 text-white font-bold px-4 py-2 rounded mt-4 text-xs hover:bg-orange-600 transition ease-in-out duration-300"
        onClick={() => handleDeleteSelected()}
        disabled={selectedIds.length === 0}
      >
        Delete 
      </button>
    </div>
  );
};

export default AuditTable;
