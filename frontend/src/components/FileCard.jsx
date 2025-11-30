 

import { MdStarBorder, MdStar } from "react-icons/md";
import { typeIcon, typeColor } from "../utils/fileTypes.js";
import { formatBytes, formatDate } from "../utils/format.js";
import { useState } from "react";

export default function FileCard({ item, compact = false, trashMode = false, selectedTrash = [] }) {
  const Icon = typeIcon(item);
  const colorClass = typeColor(item);

  // ⭐ local state for favourite
  const [fav, setFav] = useState(item.isFavourite);

  // ⭐ simple toggle without RTK
  const toggleStar = async () => {
    setFav(prev => !prev);

    try {
      await fetch(`/api/files/toggle-fav/${item._id}`, {
        method: "PATCH"
      });
    } catch (err) {
      setFav(prev => !prev); // rollback
      console.error("Star toggle failed", err);
    }
  };

  return compact ? (
    <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
      <Icon className={`text-xl ${colorClass}`} />
      <span className="text-gray-900 truncate">{item.filename}</span>
    </div>
  ) : (
    <div className="flex flex-col gap-3 p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition bg-white relative">

      {trashMode && (
        <input
          type="checkbox"
          checked={selectedTrash.includes(item?._id)}
          className="absolute left-1 top-1 h-5 w-5"
        />
      )}

      {item.resource_type === "image" && item.secure_url ? (
        <img
          src={item.secure_url}
          alt={item.filename}
          className="w-full h-32 object-cover rounded-md border border-gray-200"
        />
      ) : (
        <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-md">
          <Icon className={`${colorClass} text-4xl`} />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="font-medium text-gray-900 truncate">{item.filename}</div>

          <div className="text-xs text-gray-500">
            {item.owner || "Me"} •
            {formatDate(item?.updatedAt)} •
            {formatBytes(item.size)}
          </div>
        </div>

        <button
          type="button"
          onClick={toggleStar}
          className="btn-ghost p-1 rounded-full hover:bg-gray-100"
        >
          {fav ? (
            <MdStar className="text-yellow-500 text-xl" />
          ) : (
            <MdStarBorder className="text-gray-500 text-xl" />
          )}
        </button>
      </div>
    </div>
  );
}
