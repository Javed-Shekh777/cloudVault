// import { useState } from "react";
// import Breadcrumbs from "../components/Breadcrumbs";
// import Toolbar from "../components/Toolbar";
// import FileGrid from "../components/FileGrid";
// import UploadFab from "../components/UploadFab";
// import ContextMenu from "../components/ContextMenu";
// import Modal from "../components/Modal";
// import {
//   useCreateFolderMutation,
//   useGetFilesQuery,
//   useUploadFileMutation,
//   useGetFoldersQuery

// } from "../redux/api";
// import { getFileType } from "../utils/fileTypes";
// import { useMemo } from "react";
// import UploadProgressMonitor from "../components/UploadProgressMonitor";
// import { uploadFileWithProgress } from "../services/api";
// import { useEffect } from "react";
// import { useNavigate,useParams } from 'react-router-dom';
// import { Spinner } from "../components/Spinner";
// import FolderGrid from "../components/FolderGrid";

// export default function MyDrive() {
//   const { folderId } = useParams();
//   const navigate = useNavigate();

//   const currentFolderId = folderId || null;

//   const { data: fileData, isLoading, error, refetch } = useGetFilesQuery();
//   const { data: folderData } = useGetFoldersQuery();

//   const files = fileData?.files || [];
//   const folders = folderData?.folders || [];

//   const rootFiles = files.filter(
//     f => f?.isDeleted === false && f.folder === currentFolderId
//   );

//   const rootFolders = folders.filter(
//     f => f?.parentFolder === currentFolderId
//   );

//   const currentFolder = folders.find(f => f._id === currentFolderId);

//   const breadcrumb = currentFolderId
//     ? currentFolder?.breadcrumb || []
//     : [{ name: "My Drive", _id: null }];



//   const items = [...rootFiles];
//   console.log(items);

//   // Current folder breadcrumb

//   const [createFolder] = useCreateFolderMutation();

//   const [uploadFile] = useUploadFileMutation();

//   const [openNew, setOpenNew] = useState(false);

//   const [newFolderName, setNewFolderName] = useState(''); // नया स्टेट फ़ोल्डर नाम के लिए
//   const [fileView, setFileView] = useState("grid");
//   const [folderView, setFolderView] = useState("grid");

//   const [uploads, setUploads] = useState([]);
//   const [sortCriteria, setSortCriteria] = useState("name"); // Rename 'sort' to 'sortCriteria' for clarity
//   const [filterType, setFilterType] = useState("all"); // Use a separate state for filtering
//   const [menu, setMenu] = useState(null);
//   const isAnyUploading = uploads.some(upload => upload.status === 'uploading');
//   const isAnyFailed = uploads.some(upload => upload.status === 'failed');


//   // const files = rootFiles?.files?.filter(f => !f.isDeleted && f?.folder === currentFolderId) ?? [];


//   // Use useMemo for efficient sorting and filtering
//   const sortedAndFilteredFiles = useMemo(() => {
//     let result = [...rootFiles];

//     console.log(filterType);
//     // --- 1. Apply Filtering ---
//     if (filterType !== "all") {

//       result = result.filter(file => { console.log(getFileType(file)); return getFileType(file) === filterType });
//     }

//     // --- 2. Apply Sorting ---
//     result.sort((a, b) => {
//       if (sortCriteria === "name") {
//         return (a.filename || "").localeCompare(b.filename || "");
//       }
//       if (sortCriteria === "updatedAt") {
//         // Sort newest first (descending)
//         return new Date(b.updatedAt || b.created_at) - new Date(a.updatedAt || a.created_at);
//       }
//       if (sortCriteria === "createdAt") { // Added creation time sorting
//         return new Date(b.created_at) - new Date(a.created_at);
//       }
//       if (sortCriteria === "size") {
//         // Sort largest first (descending)
//         return (b.size || 0) - (a.size || 0); // Use 'size' field from DB
//       }
//       if (sortCriteria === "size-asc") { // Added size ascending sort
//         return (a.size || 0) - (b.size || 0);
//       }
//       // Add other sort criteria here as needed

//       return 0; // Default case
//     });

//     return result;
//   }, [files, sortCriteria, filterType]);

//   useEffect(() => {
//     if (isAnyUploading || uploads.length === 0) {
//       return;
//     }

//     const timer = setTimeout(() => {
//       handleCloseMonitor();
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [isAnyUploading, uploads.length]);


//   const handleFileSelect = async (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     if (selectedFiles.length === 0) return;

//     // 1. Initialize upload status for *each* file
//     const newUploads = selectedFiles.map(file => ({
//       id: `${file.name}-${Date.now()}`, // Unique ID for tracking
//       fileName: file.name,
//       status: 'uploading',
//       progress: 0,
//     }));

//     setUploads(prev => [...prev, ...newUploads]);

//     // 2. Upload *each* file individually using Axios with progress tracking
//     selectedFiles.forEach(file => {
//       // We use the file name as a temporary identifier for state updates
//       const fileNameIdentifier = file.name;

//       // Call the custom axios function with a progress callback
//       uploadFileWithProgress(file, (progressEvent) => {
//         const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

//         // Update the specific file's progress in the state
//         setUploads(prev => prev.map(upload => {
//           if (upload.fileName === fileNameIdentifier && upload.status === 'uploading') {
//             return { ...upload, progress: percentCompleted };
//           }
//           return upload;
//         }));
//       })
//         .then(response => {
//           // Success: update status to 'completed'
//           setUploads(prev => prev.map(upload => {
//             if (upload.fileName === fileNameIdentifier) {
//               return { ...upload, status: 'completed', progress: 100 };
//             }
//             return upload;
//           }));
//           // After successful uploads, refetch the file list to show new files
//           refetch();
//         })
//         .catch(error => {
//           // Failure: update status to 'failed'
//           console.error(`Upload failed for ${fileNameIdentifier}:`, error);
//           setUploads(prev => prev.map(upload => {
//             if (upload.fileName === fileNameIdentifier) {
//               return { ...upload, status: 'failed' };
//             }
//             return upload;
//           }));
//         });
//     });

//     // 3. Optional cleanup of completed uploads after a short delay
//     setTimeout(() => {
//       setUploads(prev => prev.filter(upload => upload.status === 'uploading'));
//     }, 5000);
//   };



//   const handleCloseMonitor = () => {
//     if (isAnyUploading) {
//       alert("Uploads are still in progress. Please wait.");
//       return;
//     }

//     setUploads([]);
//   };


//   const handleCancel = () => {
//     setOpenNew(false);
//     setNewFolderName('');
//   };

//   const handleCreateFolder = () => {
//     if (newFolderName.trim() === '') {
//       alert("Please enter a folder name.");
//       return;
//     }

//     // **************** मुख्य लॉजिक यहाँ आएगा ****************
//     console.log("Creating new folder with name:", newFolderName);
//     createFolder({ name: newFolderName, parentFolder: null });
//     setOpenNew(false);
//     setNewFolderName(''); // नाम साफ़ करें
//   };

//   console.log(files);
//   if (isLoading) return <Spinner size="h-20 w-20" color="text-green-500" />;


//   if (error) return `Error loading files ${JSON.stringify(error)}`;


//   return (
//     <div className="space-y-4">
//       <Breadcrumbs
//         path={breadcrumb.map(b => ({
//           name: b.name,
//           to: () => navigate(b._id ? `/folder/${b._id}` : "/")
//         }))}
//       />



//       <Toolbar
//         onNew={() => setOpenNew(true)}
//         view={fileView}
//         setView={setFileView}
//         sortCriteria={sortCriteria}
//         setSortCriteria={setSortCriteria}
//         filterType={filterType}
//         setFilterType={setFilterType}
//       />
//       <FolderGrid
//         items={rootFolders}
//         view={folderView}
//         onContext={(e, it) => {
//           e.preventDefault();
//           setMenu({ x: e.clientX, y: e.clientY, item: it });
//         }}
//         onOpen={(folder) => navigate(`/folder/${folder._id}`)}
//       />

//       <FileGrid
//         items={sortedAndFilteredFiles}
//         view={fileView}
//         onContext={(e, it) => {
//           e.preventDefault();
//           setMenu({ x: e.clientX, y: e.clientY, item: it });
//         }}
//       />

//       <UploadFab
//         onClick={() => {
//           const input = document.createElement("input");
//           input.type = "file";
//           input.multiple = true; // <-- यह ज़रूरी है: मल्टीप्ल सेलेक्शन सक्षम करता है
//           input.onchange = handleFileSelect; // <-- हैंडलर को बदलें
//           input.click();
//         }}
//       />
//       {menu && (
//         <ContextMenu
//           x={menu.x}
//           y={menu.y}
//           item={menu.item}
//           onClose={() => setMenu(null)}
//         />
//       )}
//       <Modal
//         open={openNew}
//         title="Create New Folder" // टाइटल बदल दिया
//         onClose={handleCancel}
//         actions={
//           <>
//             <button className="bg-red-400 hover:bg-red-600 text-white px-2 py-1 rounded cursor-pointer" onClick={handleCancel}>
//               Cancel
//             </button>
//             <button className="bg-blue-400 hover:bg-blue-600 text-white px-2 py-1 rounded cursor-pointer" onClick={handleCreateFolder}>
//               Create
//             </button>
//           </>
//         }
//       >
//         {/* Children content: इनपुट फ़ील्ड जोड़ें */}
//         <div className="mb-4">
//           <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
//           <input
//             id="folderName"
//             type="text"
//             value={newFolderName}
//             onChange={(e) => setNewFolderName(e.target.value)}
//             placeholder="Enter folder name"
//             className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
//       </Modal>
//       <UploadProgressMonitor uploads={uploads} onCloseMonitor={handleCloseMonitor} />

//     </div>
//   );
// }

import { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import Toolbar from "../components/Toolbar";
import FileGrid from "../components/FileGrid";
import UploadFab from "../components/UploadFab";
import ContextMenu from "../components/ContextMenu";
import Modal from "../components/Modal";
import { addFilesOptimistic, createFolder, fetchFiles, fetchFolders, uploadFile } from '../redux/driveSlice';
import { getFileType } from "../utils/fileTypes";
import { useMemo } from "react";
import UploadProgressMonitor from "../components/UploadProgressMonitor";
import { useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from "../components/Spinner";
import FolderGrid from "../components/FolderGrid";
import MoveModal from "../components/MoveModal";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import fileActions from "../utils/fileActions";

const getDescendantFolderIds = (folders, parentId) => {
  const result = [];
  if (!parentId) return result;
  const stack = [String(parentId)];

  while (stack.length > 0) {
    const current = stack.pop();
    const children = folders.filter(f => String(f.parentFolder) === current);
    children.forEach(child => {
      result.push(String(child._id));
      stack.push(String(child._id));
    });
  }

  return result;
};


export default function MyDrive() {
  const { folderId } = useParams();

  const dispatch = useDispatch();
  const { files, folders, loading, error } = useSelector(state => state.drive);
  console.log(files,"Folders", folders,)
  const [path, setPath] = useState([{ name: "My Drive", _id: null }]);
  const currentFolderId = path[path.length - 1]._id;
  useEffect(() => {
  dispatch(fetchFiles(currentFolderId));
}, [currentFolderId]);


  const currentFiles = files.filter(f => f.folder === currentFolderId && f.isDeleted === false);

  const currentFolders = folders.filter(f => String(f.parentFolder) === String(currentFolderId));
  console.log(currentFolders);

  // UI states
  const [moveModal, setMoveModal] = useState(null);
  console.log(moveModal);

  // { file: item, open: true } when user clicks "Move to"
  const [openNew, setOpenNew] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [fileView, setFileView] = useState("grid");
  const [folderView, setFolderView] = useState("grid");
  const [uploads, setUploads] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("name");
  const [filterType, setFilterType] = useState("all");
  const [menu, setMenu] = useState(null);

  const isAnyUploading = uploads.some(u => u.status === "uploading");
  const allUploadsDone = uploads.every(u => u.status !== "uploading");
  const allUploadsFailed = uploads.length && uploads.every(u => u.status === "failed");


  useEffect(() => {
    if (!uploads.length) return;

    const allDone = uploads.every(u => u.status !== 'uploading');
    const allFailed = uploads.every(u => u.status === 'failed');

    if (allDone || allFailed) {
      setTimeout(() => setUploads([]), 2000);
      if (allFailed) toast.error("All uploads failed!");
    }
  }, [uploads]);



  // Sorting + filtering
  const sortedAndFilteredFiles = useMemo(() => {
    let result = [...currentFiles];
    if (filterType !== "all") {
      result = result.filter(file => getFileType(file) === filterType);
    }
    result.sort((a, b) => {
      if (sortCriteria === "name") {
        return (a.filename || "").localeCompare(b.filename || "");
      }
      if (sortCriteria === "updatedAt") {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
      if (sortCriteria === "createdAt") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortCriteria === "size") {
        return (b.size || 0) - (a.size || 0);
      }
      if (sortCriteria === "size-asc") {
        return (a.size || 0) - (b.size || 0);
      }
      return 0;
    });
    return result;
  }, [currentFiles, sortCriteria, filterType]);

  useEffect(() => {
    if (folderId) {
      const folder = folders.find(f => f._id === folderId);
      if (folder) setPath([{ name: "My Drive", _id: null }, { name: folder.name, _id: folderId }]);
    }
  }, [folderId, folders]);
  // Folder navigation
  const goToFolder = folder => {
    setPath([...path, { name: folder.name, _id: folder._id }]);
  };
  const goBackTo = index => {
    setPath(path.slice(0, index + 1));
  };

  // Folder creation
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    dispatch(createFolder({ name: newFolderName, parentFolder: currentFolderId }))
    setOpenNew(false);
    setNewFolderName("");
  };

  const currentFolderIdStr = currentFolderId ? String(currentFolderId) : null;
  const descendants = currentFolderId ? getDescendantFolderIds(folders, currentFolderId) : [];
 const moveTargetFolders = folders.filter(f => f.parentFolder === currentFolderId);



  useEffect(() => {
    if (isAnyUploading || uploads.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      handleCloseMonitor();
    }, 5000);

    return () => clearTimeout(timer);
  }, [isAnyUploading, uploads.length]);





  // retry logic
  const handleRetry = (id) => {
    const item = uploads.find(u => u.id === id);
    if (!item) return;

    setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'uploading', progress: 0, error: null } : u));

    dispatch(uploadFile({
      file: item.fileObj,
      folderId: currentFolderId,
      onProgress: (percent) => {
        setUploads(prev => prev.map(u => u.id === id ? { ...u, progress: percent } : u));
      }
    })).unwrap()
      .then(res => {
        setUploads(prev => prev.map(u => u.id === uploadItem.id
          ? { ...u, status: 'completed', progress: 100, response: res }
          : u
        ));

        if (res) {
          if (Array.isArray(res)) dispatch(addFilesOptimistic(res));
          else if (res.data && Array.isArray(res.data)) dispatch(addFilesOptimistic(res.data));
          else dispatch(addFilesOptimistic(res));
        }

        // 🟢 FIX: force refresh
        dispatch(fetchFiles(currentFolderId));
        dispatch(fetchFolders());
      })

      .catch(err => {
        const message = err?.message || err?.response?.data?.message || "Upload failed";
        setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'failed', error: message } : u));
        toast.error(`${item.fileName} failed: ${message}`);
      });
  };

  const handleCancelUpload = (id) => {
    setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'canceled', error: 'Cancelled by user' } : u));
  };

  const handleRemoveUpload = (id) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };


  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const newUploads = selectedFiles.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fileName: file.name,
      fileObj: file,
      status: 'uploading',  // uploading | completed | failed | canceled
      progress: 0,
      error: null,
      response: null
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // Parallel upload
    newUploads.forEach(uploadItem => {
      dispatch(uploadFile({
        file: uploadItem.fileObj,
        folderId: currentFolderId,
        onProgress: (percent) => {
          setUploads(prev => prev.map(u => u.id === uploadItem.id ? { ...u, progress: percent } : u));
        }
      })).unwrap()
        .then(res => {
          setUploads(prev => prev.map(u => u.id === uploadItem.id
            ? { ...u, status: 'completed', progress: 100, response: res }
            : u
          ));

          if (res) {
            if (Array.isArray(res)) dispatch(addFilesOptimistic(res));
            else if (res.data && Array.isArray(res.data)) dispatch(addFilesOptimistic(res.data));
            else dispatch(addFilesOptimistic(res));
          }

          // 🟢 FIX: force refresh
          dispatch(fetchFiles(currentFolderId));
          dispatch(fetchFolders());
        })

        .catch(err => {
          console.log(err)
          const message = err?.message || err?.response?.data?.message || "Upload failed";
          setUploads(prev => prev.map(u => u.id === uploadItem.id ? { ...u, status: 'failed', error: message } : u));
          toast.error(`${uploadItem.fileName} failed: ${message}`);
        });
    });
  };




  const handleCloseMonitor = () => {
    if (isAnyUploading) {
      alert("Uploads are still in progress. Please wait.");
      return;
    }

    setUploads([]);
  };


  const handleCancel = () => {
    setOpenNew(false);
    setNewFolderName('');
  };

  // if (isLoading) return <Spinner size="h-20 w-20" color="text-green-500" />;
  // if (error) return `Error loading files ${JSON.stringify(error)}`;
  // if (loading) return <FileFolderSkeleton count={8} />;
  if (error) return <div className="text-red-500">Error loading files</div>;

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex space-x-2 mb-4">
        {path.map((p, i) => (
          <span
            key={p._id ?? i}
            className="cursor-pointer text-blue-600"
            onClick={() => goBackTo(i)}
          >
            {p.name} {i < path.length - 1 && ">"}
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <Toolbar
        onNew={() => setOpenNew(true)}
        view={fileView}
        setView={setFileView}
        sortCriteria={sortCriteria}
        setSortCriteria={setSortCriteria}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {/* Folders */}
      <FolderGrid
        items={currentFolders}
        view={folderView}
        onContext={(e, it) => {
          e.preventDefault();
          setMenu({ x: e.clientX, y: e.clientY, item: it });
        }}
        onOpen={goToFolder}
      />

      {/* Files */}
      <FileGrid
        items={sortedAndFilteredFiles}
        view={fileView}
        onContext={(e, it) => {
          e.preventDefault();
          setMenu({ x: e.clientX, y: e.clientY, item: it });
        }}
      />

      {/* Upload */}
      <UploadFab
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = true;
          input.onchange = handleFileSelect;
          input.click();
        }}
      />

      {menu && (<ContextMenu
          x={menu.x}
          y={menu.y}
          item={menu.item}
          folders={moveTargetFolders}
          onClose={() => setMenu(null)}
          // onAction={{ 
          //   open: (file) => window.open(file.secure_url, "_blank"),
          //   rename: (file) => console.log("Rename", file),
          //   trash: (file) => console.log("Trash", file),
          //   move: (file, folder) => console.log("Move", file, "to", folder),
          //   copy: (file) => console.log("Copy", file),
          //   download: (file) => {
          //     const link = document.createElement("a");
          //     link.href = file.downloadUrl;
          //     link.download = file.filename || "downloaded_file";
          //     link.click();
          //     link.remove();
          //   },
          // }}
          onAction={fileActions}
        />

      )}

      {/* Modal for new folder */}
      <Modal
        open={openNew}
        title="Create New Folder"
        onClose={handleCancel}
        actions={
          <>
            <button onClick={() => setOpenNew(false)}>Cancel</button>
            <button onClick={handleCreateFolder}>Create</button>
          </>
        }
      >
        <input
          type="text"
          value={newFolderName}
          onChange={e => setNewFolderName(e.target.value)}
          placeholder="Enter folder name"
        />
      </Modal>


      {moveModal?.open && (
        <MoveModal
          open={moveModal.open || false}
          file={moveModal.file}
          folders={folders} // pass folders list from parent
          onClose={() => setMoveModal(null)}
        />
      )}
      <UploadProgressMonitor
        uploads={uploads}
        onCloseMonitor={() => setUploads([])}
        onCancelUpload={handleCancelUpload}
        onRetryUpload={handleRetry}
        onRemove={handleRemoveUpload}
      />



    </div>
  );
}

// Skeleton component
function FileFolderSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-300 h-20 rounded-md"></div>
      ))}
    </div>
  );
}
