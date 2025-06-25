import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NonConformityTable = () => {
  const [nc, setnc] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/NonConformity')
      .then(res => setnc(res.data))
      .catch(err => console.error(err));
  }, []);

   const handleDeleteSelected = async (ids = selectedIds) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
  
    try {
      // Send DELETE request to backend
      await axios.delete('http://localhost:5000/api/NonConformity', { data: { ids } });
  
      // Remove from UI after successful deletion
      setnc(nc.filter(nc => !ids.includes(nc._id)));
      setSelectedIds(selectedIds.filter(id => !ids.includes(id)));
    } catch (error) {
      alert("Error deleting NonConformity");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Non-Conformity Records</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">
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
            <th className="border p-2">NC ID</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Clause No</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Due Date</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Responsible Person</th>
            <th className="border p-2">Responsible Person Email</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Corrective Action</th>
            <th className="border p-2">Preventive Action</th>
            <th className="border p-2">Root Cause</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {nc.map(nc => (
            <tr key={nc.ncId}>
                <td className="border p-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(nc._id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds([...selectedIds, nc._id]);
                    } else {
                      setSelectedIds(selectedIds.filter(id => id !== nc._id));
                    }
                  }}
                />
                </td>
              <td className="border p-2">{nc.ncId}</td>
              <td className="border p-2">{nc.ncDescription}</td>
              <td className="border p-2">{nc.ncClauseNo}</td>
              <td className="border p-2">{nc.ncType}</td>
              <td className="border p-2">{nc.dueDate ? new Date(nc.dueDate).toLocaleDateString() : ''}</td>
              <td className="border p-2">{nc.department}</td>
              <td className="border p-2">{nc.responsibleperson}</td>
              <td className="border p-2">{nc.responsiblepersonmail}</td>
              <td className="border p-2">{nc.nclocation}</td>
              <td className="border p-2">{nc.ncCorrectiveAction}</td>
              <td className="border p-2">{nc.ncPreventiveAction}</td>
              <td className="border p-2">{nc.ncRootCause}</td>
              <td className="border p-2">{nc.ncstatus}</td>
            </tr>
          ))}
        </tbody>
      </table>

            <button
                 className="bg-red-600 text-white px-4 py-2 rounded mt-4"
                 onClick={() => handleDeleteSelected()}
                 disabled={selectedIds.length === 0}>
                     Delete Selected
            </button>

    </div>
  );
};

export default NonConformityTable;
