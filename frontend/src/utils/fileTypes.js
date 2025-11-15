// utils/fileTypes.js (Updated)

import { 
  MdFolder, MdImage, MdPictureAsPdf, MdArticle, MdMovie, 
  MdAudioFile, MdArchive, MdCode, MdTextSnippet 
} from "react-icons/md";

// Utility function to categorize format into a generic type string
export const getFileType = (item) => { // Accept the entire item object
    // Try using item.format first, otherwise extract from item.filename
    const format = item?.format || item?.filename?.split('.').pop();
    const lowerFormat = format?.toLowerCase();
    
    if (!lowerFormat) return 'other';

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(lowerFormat)) return 'image';
    if (['pdf'].includes(lowerFormat)) return 'pdf';
    
    // ऑफिस फ़ाइलें
    if (['doc', 'docx', 'odt', 'pages', 'rtf', 'xls', 'xlsx', 'csv', 'ppt', 'pptx'].includes(lowerFormat)) return 'office';
    
    if (['mp4', 'mov', 'avi', 'mkv', 'wmv'].includes(lowerFormat)) return 'video';
    if (['mp3', 'wav', 'aac', 'flac'].includes(lowerFormat)) return 'audio';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(lowerFormat)) return 'archive';
    
    // प्रोग्रामिंग फ़ाइलें
    if (['c', 'cpp', 'java', 'js', 'ts', 'html', 'css', 'py', 'json', 'sql', 'php', 'jsx', 'tsx'].includes(lowerFormat)) return 'code';
    
    if (['txt', 'md'].includes(lowerFormat)) return 'text';
    return 'other';
};


export const typeIcon = (item) => {
  const type = getFileType(item);
  switch (type) {
    case "folder": return MdFolder;
    case "image": return MdImage;
    case "pdf": return MdPictureAsPdf;
    case "doc": return MdArticle;
    case "video": return MdMovie;
    case "audio": return MdAudioFile;
    case "archive": return MdArchive;
    case "code": return MdCode;
    case "text": return MdTextSnippet;
    // case "programming": return MdCode;
    default: return MdArticle; // Default icon for unknown types
  }
};

export const typeColor = (format) => {
    const type = getFileType(format);
  switch (type) {
    case "folder": return "text-yellow-600";
    case "image": return "text-pink-600";
    case "pdf": return "text-red-600";
    case "doc": return "text-blue-600";
    case "video": return "text-purple-600";
    case "audio": return "text-emerald-600";
    case "archive": return "text-orange-600";
    case "text": return "text-gray-600";
    case "code": return "text-indigo-600";

    default: return "text-gray-500";
  }
};

// formatBytes and formatDate remain unchanged
// ...
