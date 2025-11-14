import { MdFolder, MdImage, MdPictureAsPdf, MdArticle, MdMovie, MdAudioFile } from "react-icons/md";

export const typeIcon = (type) => {
  switch (type) {
    case "folder": return MdFolder;
    case "image": return MdImage;
    case "pdf": return MdPictureAsPdf;
    case "doc": return MdArticle;
    case "video": return MdMovie;
    case "audio": return MdAudioFile;
    default: return MdArticle;
  }
};

export const typeColor = (type) => {
  switch (type) {
    case "folder": return "text-yellow-600";
    case "image": return "text-pink-600";
    case "pdf": return "text-red-600";
    case "doc": return "text-blue-600";
    case "video": return "text-purple-600";
    case "audio": return "text-emerald-600";
    default: return "text-gray-600";
  }
};
