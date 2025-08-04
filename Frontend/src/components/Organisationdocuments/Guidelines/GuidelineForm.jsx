import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const GuidelineForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    serialNumber: '',
    documentId: '',
    documentName: '',
    description: '',
    versionNumber: '',
    releaseDate: '',
    applicableStandard: '',
  });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/guidelines/${id}`)
        .then(res => setFormData(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const standardOptions = [
    { value: "ISO 9001 : 2015", label: "ISO 9001 : 2015" },
    { value: "ISO 27001 : 2023", label: "ISO 27001 : 2023" },
    { value: "ISO 27701 : 2019", label: "ISO 27701 : 2019" },
    { value: "ISO 22301 : 2019", label: "ISO 22301 : 2019" },
    { value: "ISO 27017 : 2015", label: "ISO 27017 : 2015" },
    { value: "ISO 27018 : 2015", label: "ISO 27018 : 2015" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStandardChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      applicableStandard: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['serialNumber', 'documentId', 'documentName', 'description', 'versionNumber', 'releaseDate', 'applicableStandard'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill the ${field} field.`);
        return;
      }
    }

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/guidelines/${id}`, formData);
        alert('Guideline updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/guidelines', formData);
        alert('Guideline added successfully!');
      }
      navigate('/organisationdocuments/guidelines');
    } catch (error) {
      console.error('Failed to save guideline:', error);
      alert('Failed to save guideline. Please try again.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel?')) {
      navigate('/organisationdocuments/guidelines');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-1 flex flex-col justify-center max-w-5xl mx-auto pt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-xs">
        {/* Serial Number */}
        <div className="flex flex-col">
            <label className="font-medium text-gray-700">
               Serial Number <span className="text-red-500">*</span>
            </label>
            <input
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            required
            className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
            placeholder="Enter Serial Number"
            inputMode="numeric"
            pattern="\d*"
            />
        </div>

        {/* Guideline ID */}
        <div className="flex flex-col">
            <label className="font-medium text-gray-700">
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

        {/* Guideline Name */}
        <div className="flex flex-col">
          <label>Document Name <span className="text-red-500">*</span></label>
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
            <label className="font-medium text-gray-700">
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

        {/* Release Date */}
        <div className="flex flex-col">
            <label className="font-medium text-gray-700">
                Release Date <span className="text-red-500">*</span>
            </label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate ? formData.releaseDate.substring(0,10) : ''}
            onChange={handleChange}
            required
            className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* Applicable Standard */}
        <div className="flex flex-col">
            <label className="font-medium text-gray-700">
                Applicable Standard <span className="text-red-500">*</span>
            </label>
          <Select
            options={standardOptions}
            value={standardOptions.find(opt => opt.value === formData.applicableStandard)}
            onChange={handleStandardChange}
            isClearable
            className="mt-2"
            classNamePrefix="select"
            placeholder="Select Applicable Standard"
          />
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

export default GuidelineForm;
