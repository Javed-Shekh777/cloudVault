import { axiosInstance } from "./axiosInstance";

 


export const uploadFileWithProgress = async (file, folderId, onProgress) => {
  const formData = new FormData();
  formData.append("files", file);
  formData.append("folder", folderId || "");

  try {
    const res = await axiosInstance.post("/files/upload", formData, {
      onUploadProgress: (e) => {
        console.log("I am e",e);
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent);
      },
       headers:{
        'Content-Type': 'multipart/form-data'
       }
    });
    return res.data; // backend response
  } catch (err) {
    console.error("Upload failed:", err.response?.data || err.message);
    throw err;
  }
};

 