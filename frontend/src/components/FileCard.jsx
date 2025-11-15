// FileCard.jsx (Updated)

import { MdStarBorder, MdStar } from "react-icons/md";
// Import the updated utilities that use 'format'
import { typeIcon, typeColor } from "../utils/fileTypes.js"; 
import { formatBytes, formatDate } from "../utils/format.js";

export default function FileCard({ item, compact = false }) {
  // Pass item.format to the utility functions
  const Icon = typeIcon(item);
  const colorClass = typeColor(item); // Get the color class once

  return compact ? (
    // Compact View
    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
      <Icon className={`text-xl ${colorClass}`} /> {/* Apply color and size */}
      <span className="text-gray-900 truncate">{item.filename}</span>
    </div>
  ) : (
    // Card View
    <div className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-150 bg-white">
      {item.resource_type === 'image' && item.secure_url ? ( // Use secure_url for preview
        <img 
          src={item.secure_url} 
          alt={item.filename} 
          className="w-full h-32 object-cover rounded-md border border-gray-200" 
        />
      ) : (
        <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-md">
          <Icon className={`${colorClass} text-4xl`} /> {/* Apply color and size */}
        </div>
      )}
      
      {/* File Details and Actions */}
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="font-medium text-gray-900 truncate">{item.filename}</div>
          {/* Use item.size and item.updatedAt as stored in DB */}
          <div className="text-xs text-gray-500">
            {item.owner || "Me"} • 
            {formatDate(item?.updatedAt || item.created_at)} • 
            {formatBytes(item.size) || "-"}
          </div>
        </div>
        
        {/* Star Button */}
        <button className="btn-ghost p-1 rounded-full hover:bg-gray-100 transition duration-150" title={item.starred ? "Unstar" : "Star"}>
          {/* Assuming 'starred' field exists in your DB model */}
          {item.starred ? <MdStar className="text-yellow-500 text-xl" /> : <MdStarBorder className="text-gray-500 text-xl" />}
        </button>
      </div>
    </div>
  );
}
