import { useEffect } from "react";
import {
  MdOpenInNew,
  MdDriveFileMove,
  MdContentCopy,
  MdDelete,
  MdDownload,
  MdEdit,
  MdOutlineSubdirectoryArrowRight
} from "react-icons/md";
import { useDeleteFileMutation, useMoveFileToFolderMutation, useToggleTrashStatusMutation } from "../redux/api";
import { useRef } from "react";
import { handleToggleFunc } from "../utils/format";

export default function ContextMenu({ x, y, item, onClose, setMoveModal, folders }) {
  console.log(item);
  const [deleteFile] = useDeleteFileMutation();
  const [toggleTrash] = useToggleTrashStatusMutation();
  const [moveFile] = useMoveFileToFolderMutation();



  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && onClose?.();
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onClose]);





  const handleDownload = async (file) => {
    try {
      const link = document.createElement("a");
      link.href = file?.downloadUrl;
      link.target = "_blank";
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

  const handleMove = async (folderId) => {
    try {
      await moveFile({ folderId, fileId: item._id }).unwrap();
      alert(`✅ Moved ${item?.filename} to folder`);
      onClose();
    } catch (err) {
      console.error("❌ Move failed:", err);
      alert("Move failed!");
    }
  };


  return (
    <div
      ref={ref}
      className="fixed z-50 w-56 bg-white border border-gray-200 rounded-lg shadow-card overflow-hidden"
      style={{ top: y, left: x }}
    >
      <MenuItem
        icon={MdOpenInNew}
        label="Open"
        onClick={() => window.open(item.secure_url, "_blank")}
      />
      <MenuItem
        icon={MdEdit}
        label="Rename"
        onClick={() => console.log("Rename:", item)}
      />
      <MenuItem
        icon={MdDelete}
        label="Trash"
        onClick={() => {
          handleToggleFunc(item?._id, toggleTrash); // ✅ mutation call
          onClose();                  // ✅ फिर menu बंद
        }}
      />
      <div className="  w-full group">
        {/* Trigger button */}
        <button
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded"
        >
          <MdDriveFileMove />
          Move to
        </button>

        {/* Dropdown list */}
        <ul className=" ml-2 hidden  group-hover:block bg-white   rounded   max-h-60 overflow-y-auto">
          {folders.map(f => (
            <li key={f._id}>
              <button
                className="w-full flex items-center text-left px-3  hover:bg-gray-100"
                onClick={() => handleMove(f._id)}
              >
                <MdOutlineSubdirectoryArrowRight /> 📁 {f.name}
              </button>
            </li>
          ))}
        </ul>
      </div>



      <MenuItem
        icon={MdContentCopy}
        label="Make a copy"
        onClick={() => console.log("Copy:", item)}
      />
      <MenuItem
        icon={MdDownload}
        label="Download"

        onClick={() => {
          handleDownload(item); // ✅ mutation call
          onClose();                  // ✅ फिर menu बंद
        }}
      />
      {/* <MenuItem
        icon={MdDelete}
        label="Remove"
        danger
        onClick={() => {
          deleteFile(item?._id); // ✅ mutation call
          onClose();                  // ✅ फिर menu बंद
        }}
      /> */}


    </div>
  );
}

function MenuItem({ icon: Icon, label, danger, onClick }) {
  return (
    <button
      onClick={() => {
        onClick?.();   // पहले action
      }}
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 ${danger ? "text-red-600" : "text-gray-800"
        } focus:outline-none`}
    >
      <Icon />
      {label}
    </button>
  );
}
