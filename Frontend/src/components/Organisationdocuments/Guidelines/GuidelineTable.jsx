import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GuidelineTable = () => {
  const [guidelines, setGuidelines] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();
  const [modalUrl, setModalUrl] = useState(null);

const openViewer = (guideline) => {
  if (guideline.attachments && guideline.attachments.length > 0) {
    const file = guideline.attachments[0];
    const ext = file.name.split('.').pop().toLowerCase();

    // File types to preview inline in modal
    const inlineViewable = ['pdf', 'png', 'jpg', 'jpeg'];

    const url = `http://localhost:5000/api/guidelines/${guideline._id}/attachments/${file._id}`;

    if (inlineViewable.includes(ext)) {
      setModalUrl(url); // Open modal popup with iframe
    } else {
      // Redirect/open new page/tab for other formats
      window.location.href = url;  // Redirects in the same tab
      // OR to open in a new tab/window:
      // window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
};

const closeViewer = () => setModalUrl(null);


  useEffect(() => {
    fetchGuidelines();
  }, []);

  const fetchGuidelines = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/guidelines');
      setGuidelines(response.data);
    } catch (error) {
      console.error('Error fetching guidelines:', error);
    }
  };

  const handleCreateNew = () => {
    navigate('/organisationdocuments/guidelines/new');
  };

  const handleEditGuideline = (id) => {
    navigate(`/organisationdocuments/guidelines/${id}`);
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === guidelines.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(guidelines.map(g => g._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected guideline(s)?`)) return;
    try {
      const response = await axios.delete('http://localhost:5000/api/guidelines', { data: { ids: selectedIds } });
      const deletedIds = response.data.deletedIds || selectedIds;
      setGuidelines(prev => prev.filter(g => !deletedIds.includes(g._id)));
      setSelectedIds([]);
      alert(response.data.message || 'Deleted successfully.');
    } catch (error) {
      console.error('Error deleting guidelines:', error);
      alert('Failed to delete selected guidelines');
    }
  };

  const handleEditSelected = () => {
    if (selectedIds.length === 1) {
       navigate(`/organisationdocuments/guidelines/${selectedIds[0]}`);
    } else {
    alert("Please select exactly one advisory to edit.");
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    return isNaN(d) ? '—' : d.toLocaleDateString();
  };

  return (
    <div className="p-2 max-w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold mr-10">Guidelines</h2>
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
          Delete
        </button>
      </div>

      <table className="min-w-full border border-red-600 rounded text-sm">
        <thead className="bg-red-600">
          <tr>
            <th className="border p-2">
              <input
                type="checkbox"
                checked={guidelines.length > 0 && selectedIds.length === guidelines.length}
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
          {guidelines.length === 0 ? (
            <tr>
              <td colSpan="8" className="p-4 text-center font-bold text-red-700">
                No Guidelines Found.
              </td>
            </tr>
          ) : (
            guidelines.map(guideline => (
              <tr key={guideline._id} className="hover:bg-red-50">
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(guideline._id)}
                    onChange={() => toggleSelect(guideline._id)}
                  />
                </td>
                <td className="border p-2">{guideline.documentId || '—'}</td>
                <td className="border p-2">
                  {guideline.attachments && guideline.attachments.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => openViewer(guideline)}
                      className="text-blue-700 underline cursor-pointer bg-transparent border-0 p-0">
                      {guideline.documentName}
                    </button>
                  ) : (guideline.documentName || '—')}
                </td>
                <td className="border p-2 max-w-xs truncate" title={guideline.description}>{guideline.description || '—'}</td>
                <td className="border p-2">{guideline.versionNumber || '—'}</td>
                <td className="border p-2">{formatDate(guideline.releaseDate)}</td>
                <td className="border p-2">{guideline.applicableStandard || '—'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {modalUrl && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] relative p-4">
      <button
        className="absolute top-2 right-3 text-2xl font-bold text-gray-700 hover:text-gray-900"
        onClick={closeViewer}
        aria-label="Close modal"
      >
        &times;
      </button>
      <iframe
        src={modalUrl}
        title="Document Viewer"
        className="w-full h-[80vh] border-none"
      />
    </div>
  </div>
      )}

    </div>
  );
};

export default GuidelineTable;
