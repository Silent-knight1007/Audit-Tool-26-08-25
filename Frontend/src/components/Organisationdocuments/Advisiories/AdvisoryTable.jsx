import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdvisoryTable = () => {
  const [advisories, setAdvisories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();
  const [modalUrl, setModalUrl] = useState(null);

  // Open attachment preview
  const openViewer = (advisory) => {
    if (advisory.attachments && advisory.attachments.length > 0) {
      const file = advisory.attachments[0];
      const ext = file.name.split('.').pop().toLowerCase();

      const inlineViewable = ['pdf', 'png', 'jpg', 'jpeg'];
      const url = `http://localhost:5000/api/advisories/${advisory._id}/attachments/${file._id}`;

      if (inlineViewable.includes(ext)) {
        setModalUrl(url);
      } else {
        window.location.href = url;
      }
    }
  };

  const closeViewer = () => setModalUrl(null);

  useEffect(() => {
    fetchAdvisories();
  }, []);

  const fetchAdvisories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/advisories');
      setAdvisories(response.data);
    } catch (error) {
      console.error('Error fetching advisories:', error);
    }
  };

  const handleCreateNew = () => {
    navigate('/organisationdocuments/advisories/new');
  };

  const handleEditSelected = () => {
    if (selectedIds.length === 1) {
      navigate(`/organisationdocuments/advisories/${selectedIds[0]}`);
    } else {
      alert("Please select exactly one advisory to edit.");
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === advisories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(advisories.map(a => a._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected advisory(ies)?`)) return;
    try {
      const response = await axios.delete('http://localhost:5000/api/advisories', { data: { ids: selectedIds } });
      const deletedIds = response.data.deletedIds || selectedIds;
      setAdvisories(prev => prev.filter(a => !deletedIds.includes(a._id)));
      setSelectedIds([]);
      alert(response.data.message || 'Deleted successfully.');
    } catch (error) {
      console.error('Error deleting advisories:', error);
      alert('Failed to delete selected advisories');
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    return isNaN(d) ? '—' : d.toLocaleDateString();
  };

  return (
    <div className="p-2 max-w-full">
      <h2 className="text-xl font-bold mr-10">Advisories</h2>
      <div className="flex gap-x-2 justify-left items-center mb-2">
        <button
          onClick={handleCreateNew}
          className="bg-red-600 hover:bg-orange-600 text-white font-bold text-xs py-2 px-4 rounded-lg mt-5 mb-5 transition ease-in-out duration-300"
        >
          Add
        </button>
        <button
          onClick={handleEditSelected}
          disabled={selectedIds.length !== 1}
          className={`px-4 py-2 rounded-lg font-bold text-white text-xs ${
            selectedIds.length !== 1 ? 'bg-red-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'
          } transition`}
        >
          Edit
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedIds.length === 0}
          className={`px-4 py-2 rounded-lg font-bold text-white text-xs ${
            selectedIds.length === 0 ? 'bg-red-600 cursor-not-allowed' : 'hover:bg-orange-600'
          } transition`}
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
                checked={advisories.length > 0 && selectedIds.length === advisories.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="border p-2 text-xs text-white">Advisory ID</th>
            <th className="border p-2 text-xs text-white">Advisory Title</th>
            <th className="border p-2 text-xs text-white">Date</th>
          </tr>
        </thead>
        <tbody>
          {advisories.length === 0 ? (
            <tr>
              <td colSpan="8" className="p-4 text-center font-bold text-red-700">
                No Advisories Found.
              </td>
            </tr>
          ) : (
            advisories.map(advisory => (
              <tr key={advisory._id} className="hover:bg-red-50">
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(advisory._id)}
                    onChange={() => toggleSelect(advisory._id)}
                  />
                </td>
                <td className="border p-2">{advisory.advisoryId || '—'}</td>
                <td className="border p-2">
                  {advisory.attachments && advisory.attachments.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => openViewer(advisory)}
                      className="text-blue-700 underline cursor-pointer bg-transparent border-0 p-0"
                    >
                      {advisory.advisorytitle || '—'}
                    </button>
                  ) : (advisory.advisorytitle || '—')}
                </td>
                <td className="border p-2">{formatDate(advisory.Date)}</td>
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

export default AdvisoryTable;
























// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const AdvisoryTable = () => {
//   const [advisories, setAdvisories] = useState([]);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const navigate = useNavigate();
//   // State to control modal visibility and file URL
//   const [modalUrl, setModalUrl] = useState(null);
//   // Handler to open viewer modal
//   const openViewer = (advisory) => {
//   if (advisory.attachments && advisory.attachments.length > 0) {
//     const file = advisory.attachments[0];
//     const ext = file.name.split('.').pop().toLowerCase();

//     // File types to preview inline in modal
//     const inlineViewable = ['pdf', 'png', 'jpg', 'jpeg'];

//     const url = `http://localhost:5000/api/advisories/${advisory._id}/attachments/${file._id}`;

//     if (inlineViewable.includes(ext)) {
//       setModalUrl(url); 
//     } else {
//       window.location.href = url;  
      
//     }
//   }
// };
//   // Handler to close modal
//   const closeViewer = () => setModalUrl(null);

//   useEffect(() => {
//     fetchAdvisories();
//   }, []);

//   const fetchAdvisories = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/advisories');
//       setAdvisories(response.data);
//     } catch (error) {
//       console.error('Error fetching advisories:', error);
//     }
//   };

//   const handleCreateNew = () => {
//     navigate('/organisationdocuments/advisories/new');
//   };

//   const handleEditAdvisory = (id) => {
//     navigate(`/organisationdocuments/advisories/${id}`);
//   };

//   const toggleSelect = (id) => {
//     if (selectedIds.includes(id)) {
//       setSelectedIds(selectedIds.filter(sid => sid !== id));
//     } else {
//       setSelectedIds([...selectedIds, id]);
//     }
//   };

//   const toggleSelectAll = () => {
//     if (selectedIds.length === advisories.length) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(advisories.map(a => a._id));
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedIds.length === 0) return;
//     if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected advisory(ies)?`)) return;
//     try {
//       const response = await axios.delete('http://localhost:5000/api/advisories', { data: { ids: selectedIds } });
//       const deletedIds = response.data.deletedIds || selectedIds;
//       setAdvisories(prev => prev.filter(a => !deletedIds.includes(a._id)));
//       setSelectedIds([]);
//       alert(response.data.message || 'Deleted successfully.');
//     } catch (error) {
//       console.error('Error deleting advisories:', error);
//       alert('Failed to delete selected advisories');
//     }
//   };

//   const handleEditSelected = () => {
//     if (selectedIds.length === 1) {
//        navigate(`/organisationdocuments/advisories/${selectedIds[0]}`);
//     } else {
//     alert("Please select exactly one advisory to edit.");
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return '—';
//     const d = new Date(date);
//     return isNaN(d) ? '—' : d.toLocaleDateString();
//   };

//   return (
//     <div className="p-2 max-w-full">
//         <h2 className="text-xl font-bold mr-10">Advisories</h2>
//       <div className="flex gap-x-2 justify-left items-center mb-2">
//         <button
//           onClick={handleCreateNew}
//           className="bg-red-600 hover:bg-orange-600 text-white font-bold text-xs py-2 px-4 rounded-lg mt-5 mb-5 transition ease-in-out duration-300">
//           Add 
//         </button>
//         <button
//           onClick={handleEditSelected}
//           disabled={selectedIds.length !== 1}
//           className={`px-4 py-2 rounded-lg font-bold text-white text-xs ${
//           selectedIds.length !== 1 ? 'bg-red-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'
//           } transition`}>
//             Edit 
//         </button>
//         <button
//           onClick={handleDeleteSelected}
//           disabled={selectedIds.length === 0}
//           className={`px-4 py-2 rounded-lg font-bold text-white text-xs ${
//             selectedIds.length === 0 ? 'bg-red-600 cursor-not-allowed' : 'hover:bg-orange-600'
//           } transition`}
//         >
//           Delete 
//         </button>
//       </div>

//       <table className="min-w-full border border-red-600 rounded text-sm">
//         <thead className="bg-red-600">
//           <tr>
//             <th className="border p-2">
//               <input
//                 type="checkbox"
//                 checked={advisories.length > 0 && selectedIds.length === advisories.length}
//                 onChange={toggleSelectAll}
//               />
//             </th>
//             <th className="border p-2 text-xs text-white">Advisory ID</th>
//             <th className="border p-2 text-xs text-white"> Advisory Title</th>
//             <th className="border p-2 text-xs text-white">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {advisories.length === 0 ? (
//             <tr>
//               <td colSpan="8" className="p-4 text-center font-bold text-red-700">
//                 No Advisories Found.
//               </td>
//             </tr>
//           ) : (
//             advisories.map(advisory => (
//               <tr key={advisory._id} className="hover:bg-red-50">
//                 <td className="border p-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={selectedIds.includes(advisory._id)}
//                     onChange={() => toggleSelect(advisory._id)}
//                   />
//                 </td>
//                 <td className="border p-2">{advisory.advisoryId || '—'}</td>
//                 <td className="border p-2">
//                   {advisory.attachments && advisory.attachments.length > 0 ? (
//                     <button
//                       type="button"
//                       onClick={() => openViewer(advisory)}
//                       className="text-blue-700 underline cursor-pointer bg-transparent border-0 p-0">
//                       {advisory.advisorytitle}
//                     </button>
//                   ) : (advisory.advisorytitle)}
//                 </td>
//                 <td className="border p-2">{formatDate(advisory.Date)}</td>
//               </tr>
//             ))
//           )}
//             </tbody>
//             </table>
//             {modalUrl && (
//               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
//                 <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] relative p-4">
//                   <button
//                     className="absolute top-2 right-3 text-2xl font-bold text-gray-700 hover:text-gray-900"
//                     onClick={closeViewer}
//                     aria-label="Close modal">
//                     &times;
//                   </button>
//                   <iframe
//                     src={modalUrl}
//                     title="Document Viewer"
//                     className="w-full h-[80vh] border-none"
//                   />
//                 </div>
//               </div>
//             )}
//     </div>
//   );
// };
        
// export default AdvisoryTable;
        
