// services/api.js (or wherever you save this file)

import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/v1', // Corrected 'vi' to 'v1'
});

// Add a request interceptor to attach the auth token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Change this based on your storage method
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


// This function needs to be flexible to accept the onUploadProgress callback
// and handles one file per call to track progress individually
export const uploadFileWithProgress = (file,folderId ,onProgressCallback) => {
  const formData = new FormData();
  formData.append('files', file); // Use 'files' key for backend compatibility
  formData.append('folder', folderId||""); // Use 'files' key for backend compatibility


  return API.post('/files/upload', formData, {
    onUploadProgress: onProgressCallback
  });
};

// These can remain as simple calls if you use them outside of RTKQ
// export const getFiles = () => API.get('/files');
// export const downloadFile = (id) => API.get(`/files/download/${id}`);
// export const deleteFile = (id) => API.delete(`/files/delete/${id}`);

// Note: For 'getFiles' and 'deleteFile', using the RTK Query hooks in MyDrive is cleaner for caching.
// We only need the custom 'uploadFileWithProgress' function in MyDrive.
