// src/components/UploadProgressMonitor.jsx
import React, { useState } from "react";

export default function UploadProgressMonitor({ uploads, onCloseMonitor, onCancelUpload, onRetryUpload, onRemove }) {
  const [collapsed, setCollapsed] = useState(false);

  const items = uploads || [];

  if (!items.length) return null;

  return (
    <div className="fixed right-4 bottom-4 w-96 bg-white shadow-lg rounded-lg overflow-hidden z-50">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-3">
          <div className="font-semibold">Uploads</div>
          <div className="text-sm text-gray-500"> {items.length} </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCollapsed(c => !c)} className="text-sm px-2 py-1">{collapsed ? "Expand" : "Collapse"}</button>
          <button onClick={onCloseMonitor} className="text-sm px-2 py-1">Close</button>
        </div>
      </div>

      {!collapsed && (
        <div className="max-h-72 overflow-auto">
          {items.map(u => (
            <div key={u.id} className="px-4 py-3 border-b flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">{u.fileName}</div>
                  <div className="text-xs text-gray-500">
                    {u.status === "uploading" && `${u.progress}%`}
                    {u.status === "completed" && "Done"}
                    {u.status === "failed" && "Failed"}
                    {u.status === "canceled" && "Canceled"}
                  </div>
                </div>

                <div className="mt-2">
                  <div className="w-full bg-gray-100 h-2 rounded">
                    <div
                      style={{ width: `${u.progress}%` }}
                      className={`h-2 rounded ${u.status === "failed" ? "bg-red-500" : "bg-green-500"}`}
                    />
                  </div>
                  {u.error && <div className="text-xs text-red-600 mt-1">{u.error}</div>}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {u.status === "uploading" && (
                  <button onClick={() => onCancelUpload?.(u.id)} className="text-xs px-2 py-1 bg-gray-200 rounded">Cancel</button>
                )}
                {u.status === "failed" && (
                  <div className="flex flex-col gap-1">
                    <button onClick={() => onRetryUpload?.(u.id)} className="text-xs px-2 py-1 bg-blue-500 text-white rounded">Retry</button>
                    <button onClick={() => onRemove?.(u.id)} className="text-xs px-2 py-1 bg-gray-200 rounded">Remove</button>
                  </div>
                )}
                {u.status === "completed" && (
                  <button onClick={() => onRemove?.(u.id)} className="text-xs px-2 py-1 bg-gray-200 rounded">Remove</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
