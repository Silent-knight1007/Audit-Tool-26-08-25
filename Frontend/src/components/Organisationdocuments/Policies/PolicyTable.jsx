import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileIcon } from 'react-file-icon';

const PolicyTable = () => {
  const [policies, setPolicies] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  // Fetch policies from API
  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Policies'); // adjust URL as needed
      setPolicies(response.data);
    } catch (error) {
      console.error('Error fetching policies:', error);
    //   alert('Failed to load policies');
    }
  };

  // Format releaseDate nicely or fallback
  const formatDate = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    return isNaN(d) ? '—' : d.toLocaleDateString();
  };

  // Navigate to create new form
  const handleCreateNew = () => {
    navigate('/organisationdocuments/policies/Policyform');
  };

  // Navigate to edit policy form on clicking documentId button
  const handleEditPolicy = (id) => {
    navigate(`/organisationdocuments/Policy/${id}`);
  };

  // Handle checkbox selection
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === policies.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(policies.map(p => p._id));
    }
  };

  // Handle deletion of selected policies
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected policy(s)?`)) return;

    try {
      const response = await axios.delete('http://localhost:5000/api/Policy', { data: { ids: selectedIds } });
      const deletedIds = response.data.deletedIds || selectedIds;
      setPolicies(prev => prev.filter(p => !deletedIds.includes(p._id)));
      setSelectedIds([]);
      alert(response.data.message || 'Deleted successfully.');
    } catch (error) {
      console.error('Error deleting policies:', error);
      alert('Failed to delete selected policies');
    }
  };

  return (
    <div className="p-4 max-w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Policies</h2><br></br>
        <button
          onClick={handleCreateNew}
          className=" md:w-25 bg-red-600 hover:bg-blue-dark text-white font-bold text-xs py-3 px-6 rounded-lg mt-5 mb-5 ml-2
          hover:bg-orange-600 transition ease-in-out duration-300">
          Create New Policy
        </button>
      </div>

      <table className="min-w-full border border-red-500 rounded text-sm">
        <thead className="bg-red-500">
          <tr>
            <th className="border p-2">
              <input
                type="checkbox"
                checked={policies.length > 0 && selectedIds.length === policies.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="border p-2 text-xs text-white">Serial Number</th>
            <th className="border p-2 text-xs text-white">Document ID</th>
            <th className="border p-2 text-xs text-white">Document Name</th>
            <th className="border p-2 text-xs text-white">Description</th>
            <th className="border p-2 text-xs text-white">Version Number</th>
            <th className="border p-2 text-xs text-white">Release Date</th>
            <th className="border p-2 text-xs text-white">Applicable Standard</th>
            <th className="border p-2 text-xs text-white">Attachments</th>
          </tr>
        </thead>
        <tbody>
          {policies.length === 0 ? (
            <tr>
              <td colSpan="9" className="p-4 text-center text-red-600">
                No policies found.
              </td>
            </tr>
          ) : (
            policies.map(policy => (
              <tr key={policy._id} className="hover:bg-red-50">
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(policy._id)}
                    onChange={() => toggleSelect(policy._id)}
                  />
                </td>
                <td className="border p-2">{policy.serialNumber || '—'}</td>
                <td className="border p-2 text-blue-700 underline cursor-pointer">
                  <button
                    onClick={() => handleEditPolicy(policy._id)}
                    className="bg-transparent border-0 p-0"
                  >
                    {policy.documentId || '—'}
                  </button>
                </td>
                <td className="border p-2">{policy.documentName || '—'}</td>
                <td className="border p-2 max-w-xs truncate" title={policy.description}>{policy.description || '—'}</td>
                <td className="border p-2">{policy.versionNumber || '—'}</td>
                <td className="border p-2">{formatDate(policy.releaseDate)}</td>
                <td className="border p-2">{policy.applicableStandard || '—'}</td>
                <td className="border p-2">
                  {policy.attachments && policy.attachments.length > 0 ? (
                    <ul>
                      {policy.attachments.map(file => {
                        const ext = file.originalname.split('.').pop().toLowerCase();
                        return (
                          <li key={file.filename} className="flex items-center gap-1">
                            <div style={{ width: 20, height: 20 }}>
                              <FileIcon extension={ext} />
                            </div>
                            <a
                              href={`http://localhost:5000/uploads/${file.filename}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="text-red-500 underline text-xs"
                            >
                              {file.originalname}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <span className="text-red-500 text-xs">No files</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-3">
        <button
          onClick={handleDeleteSelected}
          disabled={selectedIds.length === 0}
          className={`px-4 py-2 rounded font-semibold text-white ${selectedIds.length === 0 ? 'bg-red-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700' } transition`}
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default PolicyTable;
