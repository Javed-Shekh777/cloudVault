import { FaFolder } from "react-icons/fa";

export default function FolderCard({ item, onOpen }) {
  return (
    <div
      onDoubleClick={() => onOpen(item)}         // double-click open
    //   onClick={() => onOpen(item)}               // single click open
      className="flex flex-col items-center justify-center 
                 gap-2 p-2 cursor-pointer select-none 
                 hover:bg-gray-100 rounded-lg transition 
                 w-full h-[100px]"               // FIXED SIZE
    >
      {/* Folder Icon */}
      <FaFolder className="text-yellow-500 text-6xl" />

      {/* Folder Name */}
      <p className="text-gray-800 text-sm font-medium truncate max-w-[110px] text-center">
        {item?.name}
      </p>
    </div>
  );
}
