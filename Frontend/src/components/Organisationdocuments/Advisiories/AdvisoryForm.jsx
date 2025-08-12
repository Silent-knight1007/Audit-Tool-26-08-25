import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdvisoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [attachments, setAttachments] = useState([]); 

  const [formData, setFormData] = useState({
    advisoryId: '',
    advisorytitle: '',
    Date: '',
  });

  useEffect(() => {
  if (id) {
    axios.get(`http://localhost:5000/api/advisories/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => console.error(err));
    // Fetch existing attachments
    axios.get(`http://localhost:5000/api/advisories/${id}/attachments`)
      .then(res => setAttachments(res.data)) // should be [{name, downloadUrl}, ...]
      .catch(err => setAttachments([]));
  }
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const requiredFields = ['advisoryId', 'advisorytitle','Date',];
  for (const field of requiredFields) {
   if (!formData[field]) {
    alert(`Please fill the ${field} field.`);
    return;
  }
}
// Check attachments manually
if (!selectedFiles || selectedFiles.length === 0) {
  alert('Please attach at least one file.');
  return;
}
  const payload = {
    ...formData,
    Date: formData.Date ? new Date(formData.Date).toISOString() : undefined
  };
  try {
    let advisoryId = id;
    // 1. Create or update the advisory
    if (id) {
      await axios.put(`http://localhost:5000/api/advisories/${id}`, payload);
      alert('Advisory updated successfully!');
    } else {
      const res = await axios.post('http://localhost:5000/api/advisories', payload);
      advisoryId = res.data._id; // get newly created id
      alert('Advisory added successfully!');
    }
    // 2. Upload files if any
    if (selectedFiles.length > 0) {
      const uploadData = new FormData();
      selectedFiles.forEach(file => uploadData.append('attachments', file));
      await axios.post(`http://localhost:5000/api/advisories/${advisoryId}/attachments`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    navigate('/organisationdocuments/advisories');
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      alert('Failed to save advisory: ' + error.response.data.error);
    } else {
      alert('Failed to save advisory. Please try again.');
    }
    console.error('Failed to save advisory:', error);
  }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel?')) {
      navigate('/organisationdocuments/advisories');
    }
  };

  const allowedExtensions = ['jpeg', 'jpg', 'png', 'xls', 'doc', 'docx', 'pdf'];

function handleFilesChange(e) {
  const files = Array.from(e.target.files);
  for (let file of files) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      alert(`"${file.name}" is not a supported file type! Allowed: jpeg, jpg, png, xls, doc, docx, pdf`);
      e.target.value = ''; // Clear the input
      setSelectedFiles([]);
      return;
    }
  }
  setSelectedFiles(files);
}


  return (
    <form onSubmit={handleSubmit} className="p-1 flex flex-col justify-center max-w-5xl mx-auto pt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-xs">
        {/* Advisory ID */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">
            Advisory ID <span className="text-red-500">*</span>
          </label>
          <input
            name="advisoryId"
            value={formData.advisoryId}
            onChange={handleChange}
            required
            className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
            placeholder="Enter Advisory ID"
            pattern="[a-zA-Z0-9]+"
            title="Only alphanumeric characters allowed"
            autoComplete="off"
          />
        </div>

        {/* Advisory Title */}
        <div className="flex flex-col">
          <label>Advisory Title <span className="text-red-500">*</span></label>
          <input
            name="advisorytitle"
            value={formData.advisorytitle}
            onChange={handleChange}
            required
            className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
            placeholder="Enter Advisory Title"
          />
        </div>
        
         {/* Date */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">
           Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="Date"
            value={formData.Date ? formData.Date.substring(0, 10) : ''}
            onChange={handleChange}
            required
            className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* Attachments */}
        <div className="flex flex-col md:col-span-3">
          <label className="font-medium text-gray-700">
              Attachments <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            required
            accept=".jpeg,.jpg,.png,.xls,.doc,.docx,.pdf"
            onChange={handleFilesChange}
            className="mt-2 py-4 px-4 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
          />
          {/* File preview for uploads */}
          <ul className="text-sm mt-2">
            {selectedFiles.length > 0 && Array.from(selectedFiles).map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
          {/* Existing attachments (show only in edit mode) */}
          {attachments.length > 0 && (
            <div className="mt-2">
              <div className="text-xs font-semibold mb-1">Attachments</div>
                <ul>
                  {attachments.map((file, i) => (
                    <li key={file._id || i}>
                      <a
                        href={file.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline">{file.name}
                      </a>
                    </li>
                  ))}
                </ul>
            </div>
          )}
        </div>

      </div>
      {/* Buttons */}
      <div className="flex gap-4 mt-10">
        
        {/* Save button */}
        <button
          type="submit"
          className="w-32 bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-1 rounded-lg transition ease-in-out duration-300">
          Save
        </button>

        {/* Cancel button */}
        <button
          type="button"
          onClick={handleCancel}
          className="w-32 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg transition ease-in-out duration-300">
          Cancel
        </button>

      </div>
    </form>
  );
};

export default AdvisoryForm;
