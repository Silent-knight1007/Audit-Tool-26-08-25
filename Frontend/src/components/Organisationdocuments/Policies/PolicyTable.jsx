import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileIcon } from 'react-file-icon';

const PolicyTable = () => {
  const [policies, setPolicies] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  // Fetch all policies from the backend (only once)
  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/policies'); // lowercase!
      setPolicies(response.data);
    } catch (error) {
      console.error('Error fetching policies:', error);
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
  navigate('/organisationdocuments/policies/new');
};


  // Navigate to edit policy form on clicking documentId button
  const handleEditPolicy = (id) => {
  navigate(`/organisationdocuments/policies/${id}`);
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
      const response = await axios.delete('http://localhost:5000/api/policies', { data: { ids: selectedIds } }); // lowercase
      const deletedIds = response.data.deletedIds || selectedIds;
      setPolicies(prev => prev.filter(p => !deletedIds.includes(p._id)));
      setSelectedIds([]);
      alert(response.data.message || 'Deleted successfully.');
    } catch (error) {
      console.error('Error deleting policies:', error);
      alert('Failed to delete selected policies');
    }
  };
  const handleEditSelected = () => {
    if (selectedIds.length === 1) {
       navigate(`/organisationdocuments/advisories/${selectedIds[0]}`);
    } else {
    alert("Please select exactly one advisory to edit.");
    }
  };

  return (
    <div className="p-2 max-w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold mr-10">Policies</h2>
        <button
          onClick={handleCreateNew}
          className="bg-red-600 hover:bg-blue-dark text-white font-bold text-xs py-2 px-4 rounded-lg mt-5 mb-5 hover:bg-orange-600 transition ease-in-out duration-300">
          Add 
        </button>
        <button
          onClick={handleEditSelected}
          disabled={selectedIds.length !== 1}
          className={`px-2 py-2 rounded-lg font-bold text-white text-xs ${
          selectedIds.length !== 1 ? 'bg-red-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'
          } transition`}>
            Edit 
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedIds.length === 0}
          className={`px-2 py-2 rounded-lg font-bold text-white text-xs ${selectedIds.length === 0 ? 'bg-red-600 cursor-not-allowed' : 'hover:bg-orange-600'} transition`}
        >
          Delete Selected
        </button>
      </div>

      <table className="min-w-full border border-red-600 rounded text-sm">
        <thead className="bg-red-600">
          <tr>
            <th className="border p-2">
              <input
                type="checkbox"
                checked={policies.length > 0 && selectedIds.length === policies.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="border p-2 text-xs text-white">Document ID</th>
            <th className="border p-2 text-xs text-white">Document Name</th>
            <th className="border p-2 text-xs text-white">Description</th>
            <th className="border p-2 text-xs text-white">Version Number</th>
            <th className="border p-2 text-xs text-white">Release Date</th>
            <th className="border p-2 text-xs text-white">Applicable Standard</th>
          </tr>
        </thead>
        <tbody>
          {policies.length === 0 ? (
            <tr>
              <td colSpan="9" className="p-4 text-center font-bold text-red-700">
                No Policies Found.
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PolicyTable;

