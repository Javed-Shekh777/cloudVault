import { useState } from "react";
import FolderCard from "./FolderCard.jsx";

export default function FolderGrid({ items, view = "grid", onContext, onOpen }) {
  const [selected, setSelected] = useState(new Set());

  const clear = () => setSelected(new Set());

  // ---------------- LIST VIEW ----------------
  if (view === "list") {
    return (
      <div className="card">
        <table className="w-full text-sm overflow-x-auto">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Owner</th>
              <th className="text-left px-4 py-2">Last modified</th>
            </tr>
          </thead>

          <tbody>
            {items.map((it) => (
              <tr
                key={it?._id}
                className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                onDoubleClick={() => onOpen?.(it)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onContext?.(e, it, clear);
                }}
              >
                <td className="px-4 py-2">
                  <FolderCard item={it} compact />
                </td>

                <td className="px-4 py-2 text-gray-600">{it.owner || "Me"}</td>
                <td className="px-4 py-2 text-gray-600">
                  {new Date(it.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ---------------- GRID VIEW ----------------
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
      {items.map((it) => (
        <div
          key={it._id}
          className="cursor-pointer"
          onContextMenu={(e) => {
            e.preventDefault();
            onContext?.(e, it, clear);
          }}
        >
          <FolderCard item={it} onOpen={onOpen} />
        </div>
      ))}
    </div>
  );
}
