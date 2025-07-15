import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileIcon } from 'react-file-icon';
import { useNavigate } from 'react-router-dom';

const NonConformityTable = () => {
  const [nc, setnc] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/NonConformity')
      .then(res => {
        // Sort by auditId, then by ncId (optional)
        const sorted = res.data.sort((a, b) => {
          if (a.auditId < b.auditId) return -1;
          if (a.auditId > b.auditId) return 1;
          if (a.ncId < b.ncId) return -1;
          if (a.ncId > b.ncId) return 1;
          return 0;
        });
        setnc(sorted);
      })
      .catch(err => console.error(err));
  }, []);

  const handleDeleteSelected = async (ids = selectedIds) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await axios.delete('http://localhost:5000/api/NonConformity', { data: { ids } });
      setnc(nc.filter(ncItem => !ids.includes(ncItem._id)));
      setSelectedIds(selectedIds.filter(id => !ids.includes(id)));
    } catch (error) {
      alert("Error deleting NonConformity");
    }
  };

  // Helper for file extension
  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const navigate = useNavigate();

  return (
    <div className="p-2">
      <h2 className="text-lg font-bold mb-4">Non-Conformity Records</h2>
      <table className="min-w-full table-auto border-collapse border border-red-500 text-xs">
        <thead className="bg-red-500 ">
          <tr>
            <th className="border p-2 ">
              <input
                type="checkbox"
                checked={nc.length > 0 && selectedIds.length === nc.length}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedIds(nc.map(a => a._id));
                  } else {
                    setSelectedIds([]);
                  }
                }}
              />
            </th>
            <th className="border p-2 text-white">NC ID</th>
            <th className="border p-2 text-white">Description</th>
            <th className="border p-2 text-white">Clause No</th>
            <th className="border p-2 text-white">Type</th>
            <th className="border p-2 text-white">Due Date</th>
            <th className="border p-2 text-white">Department</th>
            <th className="border p-2 text-white">Responsible Person</th>
            <th className="border p-2 text-white">Location</th>
            <th className="border p-2 text-white">Status</th>
            {/* <th className="border p-2">Responsible Person Email</th> */}
            {/* <th className="border p-2">Corrective Action</th>
            <th className="border p-2">Preventive Action</th>
            <th className="border p-2">Root Cause</th> */}
            {/* <th className="border p-2">Attachments</th> */}
          </tr>
        </thead>
        <tbody>
          {nc.map(ncItem => (
            <tr key={ncItem._id}>
              <td className="border p-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(ncItem._id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds([...selectedIds, ncItem._id]);
                    } else {
                      setSelectedIds(selectedIds.filter(id => id !== ncItem._id));
                    }
                  }}
                />
              </td>
              <td className="border p-2">
                <button
                  className="text-blue-900 underline"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                  onClick={() => navigate(`/edit-nc/${ncItem._id}`)}
                >
                  {ncItem.ncId}
                </button>
              </td>
              <td className="border p-2">{ncItem.ncDescription}</td>
              <td className="border p-2">{ncItem.ncClauseNo}</td>
              <td className="border p-2">{ncItem.ncType}</td>
              <td className="border p-2">{ncItem.dueDate ? new Date(ncItem.dueDate).toLocaleDateString() : ''}</td>
              <td className="border p-2">{ncItem.department}</td>
              <td className="border p-2">{ncItem.responsibleperson}</td>
              {/* <td className="border p-2">{ncItem.responsiblepersonmail}</td> */}
              <td className="border p-2">{Array.isArray(ncItem.nclocation) ? ncItem.nclocation.join(', ') : ncItem.nclocation}</td>
              {/* <td className="border p-2">{ncItem.ncCorrectiveAction}</td>
              <td className="border p-2">{ncItem.ncPreventiveAction}</td>
              <td className="border p-2">{ncItem.ncRootCause}</td> */}
              <td className="border p-2">{ncItem.ncstatus}</td>
              {/* <td className="border p-2">
                {ncItem.attachments && ncItem.attachments.length > 0 ? (
                  <ul>
                    {ncItem.attachments.map(file => (
                      <li key={file.filename} className="flex items-center gap-2">
                        <div style={{ width: 24, height: 24 }}>
                          <FileIcon extension={getFileExtension(file.originalname)} />
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
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400">No files</span>
                )}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="bg-red-500 text-xs text-white font-bold px-4 py-2 rounded mt-4 hover:bg-orange-600 transition ease-in-out duration-300"
        onClick={() => handleDeleteSelected()}
        disabled={selectedIds.length === 0}>
        Delete
      </button>
    </div>
  );
};

export default NonConformityTable;
