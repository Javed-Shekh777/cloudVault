import { useEffect } from "react";
import {
  MdOpenInNew,
  MdDriveFileMove,
  MdContentCopy,
  MdDelete,
  MdDownload,
  MdEdit,
} from "react-icons/md";
import { useDeleteFileMutation, useToggleTrashStatusMutation } from "../redux/api";
import { useRef } from "react";

export default function ContextMenu({ x, y, item, onClose }) {
  console.log(item);
  const [deleteFile] = useDeleteFileMutation();

  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && onClose?.();
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onClose]);
  const [toggleTrash, { isError }] = useToggleTrashStatusMutation();

  // Function to call when a star button is clicked
  const handleTrash = async (fileId) => {
    try {
      await toggleTrash(fileId).unwrap();
      // Handle success (e.g., show a toast notification)
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };



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
          handleTrash(item?._id); // ✅ mutation call
          onClose();                  // ✅ फिर menu बंद
        }}
      />
      <MenuItem
        icon={MdDriveFileMove}
        label="Move to"
        onClick={() => console.log("Move:", item)}
      />
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
      <MenuItem
        icon={MdDelete}
        label="Remove"
        danger
        onClick={() => {
          deleteFile(item?._id); // ✅ mutation call
          onClose();                  // ✅ फिर menu बंद
        }}
      />


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
