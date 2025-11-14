import { MdUpload } from "react-icons/md";

export default function UploadFab({ onClick }) {
  return (
    <button
      className="fixed bottom-6 right-6 btn-primary rounded-full shadow-card px-4 py-3"
      onClick={onClick}
    >
      <MdUpload className="text-xl" />
      <span>Upload</span>
    </button>
  );
}
