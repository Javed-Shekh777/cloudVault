import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/vi',
});



export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/files/upload', formData);
};

export const getFiles = () => API.get('/files');

export const downloadFile = (id) => API.get(`/files/download/${id}`);
export const deleteFile = (id) => API.delete(`/files/delete/${id}`);

