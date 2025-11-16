import { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import Toolbar from "../components/Toolbar";
import FileGrid from "../components/FileGrid";
import UploadFab from "../components/UploadFab";
import ContextMenu from "../components/ContextMenu";
import Modal from "../components/Modal";
import {

  useGetFilesQuery,
  useUploadFileMutation,
  useAddRemoveStarMutation

} from "../redux/api";
import { getFileType } from "../utils/fileTypes";
import { useMemo } from "react";
import UploadProgressMonitor from "../components/UploadProgressMonitor";
import { uploadFileWithProgress } from "../services/api";
import { useEffect } from "react";
import Spinner from "../components/Spinner";

export default function MyDrive() {
  const { data, isLoading, error, refetch } = useGetFilesQuery();

  const [uploadFile] = useUploadFileMutation();


  const [view, setView] = useState("grid");
  const [uploads, setUploads] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("name"); // Rename 'sort' to 'sortCriteria' for clarity
  const [filterType, setFilterType] = useState("all"); // Use a separate state for filtering
  const [menu, setMenu] = useState(null);
  const [openNew, setOpenNew] = useState(false);
  const isAnyUploading = uploads.some(upload => upload.status === 'uploading');
  const isAnyFailed = uploads.some(upload => upload.status === 'failed');


  const files = data?.files ?? [];


  // Use useMemo for efficient sorting and filtering
  const sortedAndFilteredFiles = useMemo(() => {
    let result = [...files];

    console.log(filterType);
    // --- 1. Apply Filtering ---
    if (filterType !== "all") {

      result = result.filter(file => { console.log(getFileType(file)); return getFileType(file) === filterType });
    }

    // --- 2. Apply Sorting ---
    result.sort((a, b) => {
      if (sortCriteria === "name") {
        return (a.filename || "").localeCompare(b.filename || "");
      }
      if (sortCriteria === "updatedAt") {
        // Sort newest first (descending)
        return new Date(b.updatedAt || b.created_at) - new Date(a.updatedAt || a.created_at);
      }
      if (sortCriteria === "createdAt") { // Added creation time sorting
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortCriteria === "size") {
        // Sort largest first (descending)
        return (b.size || 0) - (a.size || 0); // Use 'size' field from DB
      }
      if (sortCriteria === "size-asc") { // Added size ascending sort
        return (a.size || 0) - (b.size || 0);
      }
      // Add other sort criteria here as needed

      return 0; // Default case
    });

    return result;
  }, [files, sortCriteria, filterType]);

  useEffect(() => {
    if (isAnyUploading || uploads.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      handleCloseMonitor();
    }, 5000);

    return () => clearTimeout(timer);
  }, [isAnyUploading, uploads.length]);


  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    // 1. Initialize upload status for *each* file
    const newUploads = selectedFiles.map(file => ({
      id: `${file.name}-${Date.now()}`, // Unique ID for tracking
      fileName: file.name,
      status: 'uploading',
      progress: 0,
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // 2. Upload *each* file individually using Axios with progress tracking
    selectedFiles.forEach(file => {
      // We use the file name as a temporary identifier for state updates
      const fileNameIdentifier = file.name;

      // Call the custom axios function with a progress callback
      uploadFileWithProgress(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

        // Update the specific file's progress in the state
        setUploads(prev => prev.map(upload => {
          if (upload.fileName === fileNameIdentifier && upload.status === 'uploading') {
            return { ...upload, progress: percentCompleted };
          }
          return upload;
        }));
      })
        .then(response => {
          // Success: update status to 'completed'
          setUploads(prev => prev.map(upload => {
            if (upload.fileName === fileNameIdentifier) {
              return { ...upload, status: 'completed', progress: 100 };
            }
            return upload;
          }));
          // After successful uploads, refetch the file list to show new files
          refetch();
        })
        .catch(error => {
          // Failure: update status to 'failed'
          console.error(`Upload failed for ${fileNameIdentifier}:`, error);
          setUploads(prev => prev.map(upload => {
            if (upload.fileName === fileNameIdentifier) {
              return { ...upload, status: 'failed' };
            }
            return upload;
          }));
        });
    });

    // 3. Optional cleanup of completed uploads after a short delay
    setTimeout(() => {
      setUploads(prev => prev.filter(upload => upload.status === 'uploading'));
    }, 5000);
  };

  const [toggleStar, { isError }] = useAddRemoveStarMutation();

  // Function to call when a star button is clicked
  const handleStared = async (fileId) => {
    try {
      await toggleStar(fileId).unwrap();
      // Handle success (e.g., show a toast notification)
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };






  const handleCloseMonitor = () => {
    if (isAnyUploading) {
      alert("Uploads are still in progress. Please wait.");
      return;
    }

    setUploads([]);
  };

  console.log(files);
  if (isLoading) return <Spinner height="h-20" width="h-20" color = "text-green-500" />;


  if (error) return `Error loading files ${JSON.stringify(error)}`;


  return (
    <div className="space-y-4">
      <Breadcrumbs path={[{ name: "My Drive", to: "/drive" }]} />

      <Toolbar
        onNew={() => setOpenNew(true)}
        view={view}
        setView={setView}
        sortCriteria={sortCriteria}
        setSortCriteria={setSortCriteria}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      <FileGrid
        items={sortedAndFilteredFiles}
        view={view}
        handleStared={handleStared}
        onContext={(e, it) => {
          e.preventDefault();
          setMenu({ x: e.clientX, y: e.clientY, item: it });
        }}
      />

      <UploadFab
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = true; // <-- यह ज़रूरी है: मल्टीप्ल सेलेक्शन सक्षम करता है
          input.onchange = handleFileSelect; // <-- हैंडलर को बदलें
          input.click();
        }}
      />
      <UploadProgressMonitor uploads={uploads} onCloseMonitor={handleCloseMonitor} />
      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          item={menu.item}
          onClose={() => setMenu(null)}
        />
      )}
      <Modal
        open={openNew}
        title="Create new"
        onClose={() => setOpenNew(false)}
        actions={
          <>
            <button className="btn-ghost" onClick={() => setOpenNew(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={() => setOpenNew(false)}>
              Create
            </button>
          </>
        }
      >
        Choose to create a folder or upload files.
      </Modal>
    </div>
  );
}
