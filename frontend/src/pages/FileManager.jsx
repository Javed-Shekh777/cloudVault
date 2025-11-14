import { useState, useEffect, useRef } from "react";
import { uploadFile, getFiles, downloadFile, deleteFile } from "../api"; // adjust import path
import Spinner from "../components/Spinner";

import {
    MdImage,
    MdPictureAsPdf,
    MdDelete, MdMoreHoriz,
    MdAudiotrack, MdVideoLibrary, MdInsertDriveFile

} from "react-icons/md";

import {
    FaCloudUploadAlt, FaDownload, FaPrint,
    FaEye,
    FaFilePdf,
    FaFileWord,
    FaFileExcel,
    FaFilePowerpoint,
    FaFileArchive,
    FaFileCode,
} from "react-icons/fa";





const getFileIcon = (file) => {
    const format = file?.format?.toLowerCase();

    switch (format) {
        case "pdf":
            return <FaFilePdf size={40} className="text-red-500" />;
        case "doc":
        case "docx":
            return <FaFileWord size={40} className="text-blue-600" />;
        case "xls":
        case "xlsx":
            return <FaFileExcel size={40} className="text-green-600" />;
        case "ppt":
        case "pptx":
            return <FaFilePowerpoint size={40} className="text-orange-600" />;
        case "zip":
        case "rar":
            return <FaFileArchive size={40} className="text-yellow-600" />;
        case "csv":
        case "json":
        case "xml":
            return <FaFileCode size={40} className="text-purple-600" />;
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
            return <MdImage size={40} className="text-blue-500" />;
        case "mp3":
        case "wav":
            return <MdAudiotrack size={40} className="text-green-500" />;
        case "mp4":
        case "mov":
        case "avi":
        case "webm":
            return <MdVideoLibrary size={40} className="text-purple-500" />;
        default:
            return <MdInsertDriveFile size={40} className="text-gray-500" />;
    }
};


export default function FileManager() {
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const fileInputRef = useRef(null); // Ref for the file input element

    console.log(file);

    // Fetch all files
    const fetchFiles = async () => {
        setLoading(true);
        try {
            const res = await getFiles();
            console.log(res.data);
            // Assuming res.data structure is { files: [...] }
            setFiles(res.data?.files || []);
            setLoading(false);

        } catch (err) {
            console.error("Error fetching files:", err);
            setLoading(false);

        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    // Handle file input change
    const handleFileChange = (e) => {
        // e.target.files is a FileList, we typically use the first item
        setFile(e.target.files[0]);
    };

    // Upload new file
    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        try {
            await uploadFile(file);
            setFile(null); // Clear the state
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the input visually
            }
            fetchFiles();
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    // src/App.jsx (handleDownload function)


    const handleDownload = async (file) => {
        try {
            // Axios call to backend download route
            const response = await downloadFile(file._id);

            // Create a Blob URL for the file
            // const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a temporary <a> tag to trigger download
            const link = document.createElement("a");
            link.href = response.data;
            link.download = file.filename || "downloaded_file";
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.remove();

            console.log("✅ File downloaded:", file.filename);
        } catch (error) {
            console.error("❌ Download failed:", error);
            alert("Download failed! Please try again.");
        }
    };



    // Print file (Open in new tab with print dialog if possible)
    // src/App.jsx or where your functions are

    const handlePrint = (file) => {
        if (!file?.secure_url) return;

        let viewUrl = file.secure_url;

        if (file.resource_type === "raw" || file.format === "pdf") {

            const parts = viewUrl.split('/upload/');
            if (parts.length === 2) {
                viewUrl = parts[0] + '/upload/fl_inline/' + parts[1];
            }
            // यदि URL पहले से ही raw/upload में है
            viewUrl = viewUrl.replace("/raw/upload/", "/raw/upload/fl_inline/");
        }

        // अब URL को नए टैब में खोलें
        const newWindow = window.open(viewUrl, "_blank");

        // वैकल्पिक रूप से, लोड होने पर प्रिंट डायलॉग खोलने का प्रयास करें
        if (newWindow && file.format === 'pdf') {
            newWindow.onload = () => {
                // newWindow.print(); // यह कभी-कभी उपयोगकर्ता अनुभव को बाधित करता है
            };
        }
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
        <div className="sm:max-w-[90%] w-[98%] mt-5 mx-auto sm:p-6 p-3 bg-white rounded shadow space-y-6">
            <h2 className="text-2xl font-bold text-center">📁 File Manager</h2>

            {/* Upload Section */}
            <div className="">
                {file && <p className="mb-1"><span className="font-bold">File/Folder Name :</span> {file?.name}</p>}

                <div className="flex items-center justify-center border-2 rounded-3xl m-2 mx-auto h-32 w-64 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <FaCloudUploadAlt className="text-2xl text-blue-500" />
                        <input
                            type="file" ref={fileInputRef} onChange={handleFileChange}
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
            </div>


            {/* File List */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Uploaded Files</h3>
                {loading ? (
                    <Spinner />
                ) : files?.length === 0 ? (
                    <p className="text-gray-500">No files uploaded yet.</p>
                ) : (
                    // <ul className="space-y-2">
                    //     {files.map((file) => (
                    //         <li
                    //             key={file._id}
                    //             className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded"
                    //         >
                    //             <span className="truncate">{file.filename}</span>

                    //             <div className="relative">
                    //                 <MdMoreHoriz
                    //                     onClick={() => toggleMenu(file._id)}
                    //                     className="w-8 h-full hover:bg-slate-200 rounded cursor-pointer"
                    //                 />

                    //                 {activeMenuId === file._id && (
                    //                     <div className="absolute z-50 right-0 top-6 rounded-md bg-white shadow p-2 flex flex-col gap-2 w-36">
                    //                         <a
                    //                             href={file.secure_url}
                    //                             target="_blank"
                    //                             rel="noopener noreferrer"
                    //                             className="text-blue-600 hover:text-blue-800 flex items-center gap-2 w-full p-1.5 rounded-md hover:bg-gray-100"
                    //                         >
                    //                             Open
                    //                         </a>

                    //                         <button
                    //                             onClick={() => handleDownload(file)}
                    //                             className="text-green-600 hover:text-green-800 flex items-center gap-2 w-full p-1.5 rounded-md hover:bg-gray-100"
                    //                         >
                    //                             <FaDownload size={16} />
                    //                             Download
                    //                         </button>

                    //                         <button
                    //                             onClick={() => handlePrint(file)}
                    //                             className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 w-full p-1.5 rounded-md hover:bg-gray-100"
                    //                         >
                    //                             <FaPrint size={16} />
                    //                             Print
                    //                         </button>

                    //                         <button
                    //                             onClick={() => handleDelete(file._id)}
                    //                             className="text-red-600 hover:text-red-800 flex items-center gap-2 w-full p-1.5 rounded-md hover:bg-gray-100"
                    //                         >
                    //                             <MdDelete size={22} />
                    //                             Delete
                    //                         </button>
                    //                     </div>
                    //                 )}
                    //             </div>
                    //         </li>
                    //     ))}
                    // </ul>
                    <FileGrid
                        files={files}
                        activeMenuId={activeMenuId}
                        toggleMenu={toggleMenu}
                        handleDownload={handleDownload}
                        handlePrint={handlePrint}
                        handleDelete={handleDelete}
                    />
                )}

            </div>
        </div>
    );
}











function FileGrid({ files, activeMenuId, toggleMenu, handleDownload, handlePrint, handleDelete }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
            {files.map((file) => (
                <div
                    key={file?._id}
                    className="relative bg-white rounded-lg border hover:shadow-lg transition flex flex-col items-center "
                >
                    {/* Thumbnail / Icon */}
                    <div className="w-full h-32 flex items-center justify-center rounded-lg bg-gray-50">
                        {file?.format?.match(/jpg|jpeg|png|gif/i) ? (
                            <img
                                src={file?.secure_url}
                                alt={file?.filename}
                                className="object-cover w-full h-full rounded-lg"
                            />
                        ) : (
                            getFileIcon(file)
                        )}
                    </div>

                    {/* File Name */}
                    <div className="p-2 w-full text-center">
                        <span
                            className="truncate block text-sm font-medium"
                            title={file.filename}
                        >
                            {file.filename}
                        </span>
                    </div>

                    {/* Options Menu */}
                    <div className="absolute z-10 top-2 right-2">
                        <MdMoreHoriz
                            onClick={() => toggleMenu(file._id)}
                            className="w-6 h-6 hover:bg-slate-200 rounded cursor-pointer"
                        />

                        {activeMenuId === file._id && (
                            <div className="absolute z-50 right-0 top-6 rounded-md bg-white shadow p-1.5 flex flex-col gap-1 w-36">
                                <a
                                    href={file.secure_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2 w-full p-1.5 rounded-md hover:bg-gray-100"
                                >
                                    Open
                                </a>
                                <a
                                    href={file.downloadUrl}
                                    target="_blank"
                                    download={true}
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800 flex items-center gap-2 w-full p-1.5 rounded-md hover:bg-gray-100"

                                >
                                    <FaDownload size={16} />
                                    Download
                                </a>




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
                                    <MdDelete size={22} />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

