 

import { MdAdd, MdGridView, MdViewList, MdSort } from "react-icons/md"; // Added MdSort
import ViewToggle from "./ViewToggle.jsx";
import SortMenu from "./SortMenu.jsx";
import { MdAudioFile, MdVideoFile, MdImage, MdPictureAsPdf, MdAlbum, MdAccessTime, MdFormatSize,MdCode ,MdOutlineDescription,MdTextSnippet,MdArchive,MdArticle,MdFolder} from "react-icons/md"; // Use correct icons

const sortOptions = [
  { key: "name", label: "Name (A-Z)", icon: MdSort }, // Changed filter1 to sortOptions
  { key: "updatedAt", label: "Last modified", icon: MdAccessTime },
  { key: "createdAt", label: "Created date", icon: MdAccessTime }, // Added
  { key: "size", label: "Size (Largest)", icon: MdFormatSize },
  { key: "size-asc", label: "Size (Smallest)", icon: MdFormatSize }, // Added
];

const filterOptions = [ // Changed filter2 to filterOptions
  { key: "all", label: "All Types", icon: MdAlbum },
  { key: "pdf", label: "PDFs", icon: MdPictureAsPdf }, // Use correct icon
  { key: "audio", label: "Audio", icon: MdAudioFile },
  { key: "video", label: "Videos", icon: MdVideoFile },
  { key: "image", label: "Images", icon: MdImage },
  { key: "code", label: "Code", icon: MdCode },
  { key: "office", label: "Office", icon: MdOutlineDescription },
  { key: "text", label: "Text", icon: MdTextSnippet },



];

// Renamed props in function signature to match the parent component
export default function Toolbar({ onNew, view, setView, sortCriteria, setSortCriteria, filterType, setFilterType }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <button className="btn-primary flex items-center px-3 py-1.5 bg-blue-500 text-white hover:bg-blue-600 rounded-lg cursor-pointer" onClick={onNew}>
            <MdAdd className="mr-1" /> New
        </button>
        
        {/* Pass props correctly to SortMenu */}
        <SortMenu 
            options={sortOptions} 
            label={"Sort By"} 
            selectedValue={sortCriteria} 
            onChange={setSortCriteria} 
        />
        <SortMenu 
            options={filterOptions} 
            label={"Type Filter"} 
            selectedValue={filterType} 
            onChange={setFilterType} 
        />
      </div>
      <ViewToggle view={view} setView={setView} icons={{ grid: MdGridView, list: MdViewList }} />
    </div>
  );
}
