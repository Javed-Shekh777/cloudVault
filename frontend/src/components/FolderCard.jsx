import { FaFolder } from "react-icons/fa";

export default function FolderCard({ item, onOpen }) {
  return (
    <div
      onDoubleClick={() => onOpen(item)}
      className="flex flex-col items-center justify-center
                 p-2 cursor-pointer select-none 
                 hover:bg-gray-100 rounded-lg transition
                 w-full h-[120px]"   
    >
      {/* Folder Icon */}
      <FaFolder className="text-yellow-500 text-6xl" />

      {/* Folder Name */}
      <p className="text-gray-800 text-sm font-medium text-center 
                    mt-1 px-1 leading-tight truncate w-[110px]">
        {item?.name}
      </p>
    </div>
  );
}
