export default function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white card w-full max-w-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
        <div className="text-sm text-gray-700">{children}</div>
        <div className="mt-4 flex justify-end gap-2">
          {actions}
        </div>
      </div>
    </div>
  );
}
