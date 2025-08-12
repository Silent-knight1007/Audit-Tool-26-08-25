import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CertificateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const [formData, setFormData] = useState({
    documentId: '',
    documentName: '',
    description: '',
    versionNumber: '',
  });

  useEffect(() => {
  if (id) {
    axios
      .get(`http://localhost:5000/api/certificates/${id}`)
      .then((res) => setFormData(res.data))
      .catch((err) => console.error(err));

    // Fetch attachments metadata for this certificate
    axios
      .get(`http://localhost:5000/api/certificates/${id}/attachments`)
      .then((res) => setAttachments(res.data))  // Should be array [{name, downloadUrl}, ...]
      .catch(() => setAttachments([]));
  }
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const requiredFields = ['documentId','documentName','description','versionNumber'];
  for (const field of requiredFields) {
    if (!formData[field]) {
    alert(`Please fill the ${field} field.`);
    return;
  }
  }
  try {
    let certificateId = id;
    if (id) {
      await axios.put(`http://localhost:5000/api/certificates/${id}`, formData);
      alert('Certificate updated successfully!');
    } else {
      const res = await axios.post('http://localhost:5000/api/certificates', formData);
      certificateId = res.data._id;  // get created certificate id
      alert('Certificate added successfully!');
    }

    // Upload attachments if selected
    if (selectedFiles.length > 0 && certificateId) {
      const uploadData = new FormData();
      selectedFiles.forEach(file => uploadData.append('attachments', file));
      await axios.post(
        `http://localhost:5000/api/certificates/${certificateId}/attachments`,
        uploadData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    }

    navigate('/organisationdocuments/certificates');
  } catch (error) {
    console.error('Failed to save certificate:', error);
    alert('Failed to save certificate. Please try again.');
  }
};


  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel?')) {
      navigate('/organisationdocuments/certificates');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-1 max-w-5xl mx-auto pt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-xs">
        {/* Document ID */}
        <div className="flex flex-col">
          <label>
            Document ID <span className="text-red-500">*</span>
          </label>
          <input
            name="documentId"
            value={formData.documentId}
            onChange={handleChange}
            required
            className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
            placeholder="Enter Document ID"
            pattern="[a-zA-Z0-9]+"
            title="Only alphanumeric characters allowed"
            autoComplete="off"
          />
        </div>
        {/* Document Name */}
        <div className="flex flex-col">
          <label>
            Document Name <span className="text-red-500">*</span>
          </label>
          <input
            name="documentName"
            value={formData.documentName}
            onChange={handleChange}
            required
            className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
            placeholder="Enter Document Name"
          />
        </div>
        {/* Description */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            maxLength={1000}
            className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none resize-none"
            placeholder="Enter Description"
          />
        </div>
        {/* Version Number */}
        <div className="flex flex-col">
          <label>
            Version Number <span className="text-red-500">*</span>
          </label>
          <input
            name="versionNumber"
            value={formData.versionNumber}
            onChange={handleChange}
            required
            className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
            placeholder="Enter Version Number"
            pattern="[a-zA-Z0-9]+"
            title="Only alphanumeric characters allowed"
            autoComplete="off"
          />
        </div>
        {/* Attachments */}
        <div className="flex flex-col md:col-span-3 mt-4">
          <label className="font-medium text-gray-700">
            Attachments
          </label>
          <input
            type="file"
            multiple
            onChange={e => setSelectedFiles([...e.target.files])}
            className="mt-2 py-2 px-2 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
          />
         {/* Show names of selected files */}
         {selectedFiles.length > 0 && (
              <ul className="text-sm mt-2">
                {Array.from(selectedFiles).map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
          )}

          {/* Show existing attachments (edit mode) */}
          {attachments.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-semibold mb-1">Existing Attachments:</div>
              <ul>
                {attachments.map((file) => (
                  <li key={file._id}>
                    <a
                      href={file.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline">
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

        <div className="flex gap-4 mt-10">
            <button
              type="submit"
              className="w-32 bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-1 rounded-lg transition ease-in-out duration-300">
                Save
            </button>
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

export default CertificateForm;
