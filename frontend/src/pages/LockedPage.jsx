import { useEffect, useState } from "react";
import ChooseMethod from "../components/locked/ChooseMethod";
import SetupPin from "../components/locked/SetupPin";
import SetupPassword from "../components/locked/SetupPassword";
import EnterPin from "../components/locked/EnterPin";
import EnterPassword from "../components/locked/EnterPassword";
import { useDispatch, useSelector } from "react-redux";
import { getLockedStatus, exitLocked, getLockedData, addLockedFilesOptimistic } from "../redux/lockedSlice";
import UploadProgressMonitor from "../components/UploadProgressMonitor";
import MoveModal from "../components/MoveModal";
import Modal from "../components/Modal";
import ContextMenu from "../components/ContextMenu";
import UploadFab from "../components/UploadFab";
import FileGrid from "../components/FileGrid";
import FolderGrid from "../components/FolderGrid";
import Toolbar from "../components/Toolbar";
import { getFileType } from "../utils/fileTypes";
import { useMemo } from "react";
import { createFolder, fetchFiles, fetchFolders, uploadFile } from "../redux/driveSlice";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
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

export default function LockedFolderPage() {
  const { folderId } = useParams();

  // const folderId = new URLSearchParams(window.location.search).get("folder");

  const dispatch = useDispatch();
  const { lockedFolders, lockedFiles, isUnLocked, unlockToken } = useSelector((state) => state.locked);
  const { files, folders, error } = useSelector(state => state.drive);


  console.log("Locked Folder Page ", lockedFolders, lockedFiles, isUnLocked, unlockToken);
  const [loading, setLoading] = useState(true);
  const [isSetup, setIsSetup] = useState(false);
  const [method, setMethod] = useState(null); // pin or password

  const getStatus = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getLockedStatus()).unwrap();
      console.log("Locked ", res);

      setIsSetup(res.data?.isSetup);
      const mth = res?.data?.isSetup ? res.data.unlockMethod : null;
      setMethod(mth || null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching locked folder status:", error);
      setLoading(false);

    }

  }
  useEffect(() => {
    getStatus();
  }, []);

  const goBack = () => {
    setMethod(null);
  }



  console.log(files, "Folders", folders,)
  const [path, setPath] = useState([{ name: "Locked Drive", _id: null }]);
  const currentFolderId = path[path.length - 1]._id;
  useEffect(() => {
    dispatch(fetchFiles({ folderId: currentFolderId, isLocked: true }));
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
    dispatch(createFolder({ name: newFolderName, parentFolder: currentFolderId, isLocked: true }));
    setOpenNew(false);
    setNewFolderName("");
  };

  const currentFolderIdStr = currentFolderId ? String(currentFolderId) : null;
  const descendants = currentFolderId ? getDescendantFolderIds(folders, currentFolderId) : [];
  const moveTargetFolders = folders.filter(f => f.parentFolder === currentFolderId);



  const exitSubmit = async () => {
    try {
      await dispatch(exitLocked());
      // setIsSetup(false);
      // setMethod(null);
    } catch (error) {
      console.error("Error exiting locked folder:", error);
    }
  }


let warningTimeoutId;
let exitTimeoutId;

function startLockedFolderTimeout() {
  console.log("⏳ Locked folder timeout started...");

  // ============================
  // ⚠️ Warning at 28 minutes
  // ============================
  warningTimeoutId = setTimeout(() => {
    toast.error("Remaining time is 2 minutes!");
  }, 1680000); // 28 min


  // ============================
  // 🔥 Auto Exit at 30 minutes
  // ============================
  exitTimeoutId = setTimeout(() => {
    exitSubmit();
  }, 1800000); // 30 min
}




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
      isLocked: true,
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
        dispatch(fetchFiles({ folderId: currentFolderId, isLocked: true }));
        dispatch(fetchFolders({ isLocked: true }));
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
          dispatch(fetchFiles({ folderId: currentFolderId, isLocked: true }));
          dispatch(fetchFolders({ isLocked: true }));
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




  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!isSetup && method === null)
    return <ChooseMethod setMethod={setMethod} />;

  if (!isSetup && method === "pin")
    return <SetupPin onDone={() => setIsSetup(true)} goBack={goBack} />;

  if (!isSetup && method === "password")
    return <SetupPassword onDone={() => setIsSetup(true)} goBack={goBack} />;

  if (isSetup && !unlockToken) {
    if (method === "pin")
      return <EnterPin startLockedFolderTimeout={startLockedFolderTimeout} />;
    return <EnterPassword startLockedFolderTimeout={startLockedFolderTimeout} />;
    // return <EnterPin setToken={unlockToken} />;
    // return <EnterPassword setToken={unlockToken} />;
  }

  // <LockedFiles token={unlockToken} />
  return (<>
    <div>
      <button
        type="button"
        onClick={exitSubmit}
        className="
  cursor-pointer
    flex items-center gap-2
    px-4 py-2
    bg-red-500 
    text-white 
    font-semibold
    rounded-xl
    shadow-md 
    hover:bg-red-600
    hover:shadow-lg
    active:scale-95
    transition-all
    duration-200
  "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>

        Exit
      </button>

      <div className="space-y-4 mt-3">
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


        {/* {moveModal?.open && (
          <MoveModal
            open={moveModal.open || false}
            file={moveModal.file}
            folders={folders} // pass folders list from parent
            onClose={() => setMoveModal(null)}
          />
        )} */}
        <UploadProgressMonitor
          uploads={uploads}
          onCloseMonitor={() => setUploads([])}
          onCancelUpload={handleCancelUpload}
          onRetryUpload={handleRetry}
          onRemove={handleRemoveUpload}
        />



      </div>
    </div>
  </>);
}
