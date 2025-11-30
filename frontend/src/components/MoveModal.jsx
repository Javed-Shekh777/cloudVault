
export default function MoveModal({ open=true, file, folders, onClose }) {

  if (!open) return null;

  const handleMove = async (folderId) => {
    try {
        console.log(folderId,file);
      // await moveFile({ folderId, fileId: file._id }).unwrap();
      // alert(`✅ Moved ${file?.filename} to folder`);
      onClose();
    } catch (err) {
      console.error("❌ Move failed:", err);
      alert("Move failed!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-3">Move "{file?.filename}" to:</h2>
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {folders.map(f => (
            <li key={f._id}>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                onClick={() => handleMove(f._id)}
              >
                📁 {f.name}
              </button>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 px-3 py-2 bg-red-500 text-white rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
