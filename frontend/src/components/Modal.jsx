// Modal.jsx or Modal.js

export default function Modal({ open, title, children, onClose, actions }) {
  // If 'open' is false, render nothing
  if (!open) return null;

  // Use a portal in a real application for better handling of modal layering
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay for the background blur/darkening */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal content container */}
      <div className="relative bg-white  w-full max-w-md p-6 rounded-lg shadow-lg">
        
        {/* Header section */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          {/* Close button with a simple 'X' icon or text */}
          <button 
            className="text-gray-400 hover:text-gray-600 transition duration-150" 
            onClick={onClose}
            aria-label="Close modal"
          >
            {/* You can use a simple 'X' or an icon component here */}
            ✕
          </button>
        </div>

        {/* Body content section */}
        <div className="text-sm text-gray-700 mb-4">
          {children}
        </div>

        {/* Action buttons footer */}
        <div className="mt-4 flex justify-end gap-3">
          {actions}
        </div>
      </div>
    </div>
  );
}
