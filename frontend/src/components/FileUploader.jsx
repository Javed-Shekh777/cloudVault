import React, { useState } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt } from 'react-icons/fa';

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [uploadedPath, setUploadedPath] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      setUploadedPath(res.data.filePath);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg shadow-md">
      <label className="flex items-center gap-2 cursor-pointer">
        <FaCloudUploadAlt className="text-3xl text-blue-500" />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
        <span className="text-blue-700 font-medium">Choose a file</span>
      </label>
      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload
      </button>
      {uploadedPath && (
        <p className="mt-4 text-green-600">
          File uploaded: <a href={`http://localhost:5000${uploadedPath}`} target="_blank" rel="noreferrer">View File</a>
        </p>
      )}
    </div>
  );
};

export default FileUploader;
