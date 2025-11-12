import { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaDownload, FaPrint } from "react-icons/fa";
import { MdDelete, MdMoreHoriz } from "react-icons/md";
import { uploadFile, getFiles, downloadFile, deleteFile } from "../api"; // adjust import path

export default function FileManager() {
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Fetch all files
    const fetchFiles = async () => {
        try {
            const res = await getFiles();
            console.log(res.data);
            setFiles(res.data?.files);
        } catch (err) {
            console.error("Error fetching files:", err);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    // Upload new file
    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        try {
            await uploadFile(file);
            setFile(null);
            fetchFiles();
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

const handleDownload = (file) => {
  let downloadUrl = file.secure_url;

  if (file.resource_type === "raw") {
    downloadUrl = downloadUrl.replace("/raw/upload/", "/raw/upload/fl_attachment/");
  } else {
    downloadUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment/");
  }

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", file.filename); // ensures correct extension
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};





    // Print file (just open it in a new tab)
    const handlePrint = (file) => {
        if (file?.secure_url) window.open(file.secure_url, "_blank");
        if (file?.secure_url) window.print(file.secure_url);
    };

    // Delete file
    const handleDelete = async (id) => {
        try {
            await deleteFile(id);
            fetchFiles(); // Refresh list
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    // Toggle dropdown menu
    const toggleMenu = (id) => {
        setActiveMenuId((prevId) => (prevId === id ? null : id));
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-6">
            <h2 className="text-2xl font-bold text-center">📁 File Manager</h2>

            {/* Upload Section */}
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <FaCloudUploadAlt className="text-2xl text-blue-500" />
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                    />
                    <span className="text-blue-700 font-medium">Choose file</span>
                </label>
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </div>

            {/* File List */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Uploaded Files</h3>
                {files.length === 0 ? (
                    <p className="text-gray-500">No files uploaded yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {files.map((file) => (
                            <li
                                key={file._id}
                                className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded"
                            >
                                <span className="truncate">{file.filename}</span>

                                <div className="relative">
                                    <MdMoreHoriz
                                        onClick={() => toggleMenu(file._id)}
                                        className="w-8 h-full hover:bg-slate-200 rounded cursor-pointer"
                                    />

                                    {activeMenuId === file._id && (
                                        <div className="absolute z-50 right-0 top-6 rounded-md bg-white shadow p-2 flex flex-col gap-2 w-36">
                                            <a href={file.secure_url} target="_blank" rel="noopener noreferrer">
  Open PDF
</a>

                                            <button
                                                onClick={() => handleDownload(file)}
                                                className="text-green-600 hover:text-green-800 flex items-center gap-2 w-full p-1.5 rounded-md hover:bg-gray-100"
                                            >
                                                <FaDownload size={16} />
                                                Download
                                            </button>

                                            <button
                                                onClick={() => handlePrint(file)}
                                                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 w-full p-1.5 rounded-md hover:bg-gray-100"
                                            >
                                                <FaPrint size={16} />
                                                Print
                                            </button>
                                             

                                            <button
                                                onClick={() => handleDelete(file._id)}
                                                className="text-red-600 hover:text-red-800 flex items-center gap-2 w-full p-1.5 rounded-md hover:bg-gray-100"
                                            >
                                                <MdDelete size={18} />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
