import { useState } from "react";
import FileCard from "./FileCard.jsx";
import { formatBytes, formatDate } from "../utils/format.js";

export default function FileGrid({ items, view = "grid", onOpen, onContext,handleStared }) {
  const [selected, setSelected] = useState(new Set());

  const toggle = (id, multi) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (!multi) next.clear();
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clear = () => setSelected(new Set());

  if (view === "list") {
    return (
      <div className="card  ">
        <table className="w-full text-sm  overflow-x-auto">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Owner</th>
              <th className="text-left px-4 py-2">Last modified</th>
              <th className="text-left px-4 py-2 whitespace-nowrap">File size</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr
                key={it?._id}
                className={`border-t border-gray-100 hover:bg-gray-50 cursor-pointer ${selected.has(it._id) ? "bg-brand-50" : ""}`}
                onClick={(e) => toggle(it._id, e.shiftKey || e.ctrlKey || e.metaKey)}
                onDoubleClick={() => onOpen?.(it)}
                onContextMenu={(e) => { e.preventDefault(); onContext?.(e, it, clear); }}
              >
                <td className="px-4 py-2"><FileCard item={it} compact /></td>
                <td className="px-4 py-2 text-gray-600">{it.owner || "Me"}</td>
                <td className="px-4 py-2 text-gray-600">{new Date(it.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-2 text-gray-600">{it.size ? `${(it.size / 1024 / 1024).toFixed(1)} MB` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }


  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {items.map(it => (
        <div
          key={it._id}
          // className={`card p-3 cursor-pointer ${selected.has(it.id) ? "ring-2 ring-brand-500" : ""}`}
          className={`card p-3 cursor-pointer }`}

          onClick={(e) => toggle(it.id, e.shiftKey || e.ctrlKey || e.metaKey)}
          onDoubleClick={() => onOpen?.(it)}
          onContextMenu={(e) => { e.preventDefault(); onContext?.(e, it, () => setSelected(new Set())); }}
        >
          <FileCard item={it} handleStared={handleStared} />
        </div>
      ))}
    </div>
  );
}
