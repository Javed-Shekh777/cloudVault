import { MdAdd, MdGridView, MdViewList, MdSort } from "react-icons/md"; 
import ViewToggle from "./ViewToggle.jsx";
import SortMenu from "./SortMenu.jsx";
// Removed unused imports to clean up the code
import { MdAudioFile, MdVideoFile, MdImage, MdPictureAsPdf, MdAlbum, MdAccessTime, MdFormatSize, MdCode ,MdOutlineDescription,MdTextSnippet } from "react-icons/md"; 


const sortOptions = [
  { key: "name", label: "Name (A-Z)", icon: MdSort }, 
  { key: "updatedAt", label: "Last modified", icon: MdAccessTime },
  { key: "createdAt", label: "Created date", icon: MdAccessTime }, 
  { key: "size", label: "Size (Largest)", icon: MdFormatSize },
  { key: "size-asc", label: "Size (Smallest)", icon: MdFormatSize }, 
];

const filterOptions = [ 
  { key: "all", label: "All Types", icon: MdAlbum },
  { key: "pdf", label: "PDFs", icon: MdPictureAsPdf }, 
  { key: "audio", label: "Audio", icon: MdAudioFile },
  { key: "video", label: "Videos", icon: MdVideoFile },
  { key: "image", label: "Images", icon: MdImage },
  { key: "code", label: "Code", icon: MdCode },
  { key: "office", label: "Office", icon: MdOutlineDescription },
  { key: "text", label: "Text", icon: MdTextSnippet },
];


export default function Toolbar({ onNew, view, setView, sortCriteria, setSortCriteria, filterType, setFilterType }) {
  return (
    // Use flex-wrap and add gap-y-3 for wrapping behavior on small screens
    <div className="flex flex-wrap items-center justify-between mb-3 gap-y-3">
      
      {/* The group of buttons on the left */}
      <div className="flex items-center gap-2">
        <button 
          className="btn-primary flex items-center px-3 py-1.5 bg-blue-500 text-white hover:bg-blue-600 rounded-lg cursor-pointer whitespace-nowrap" // Use whitespace-nowrap to keep "New" together
          onClick={onNew}
        >
            <MdAdd className="mr-1" /> New
        </button>
        
        {/* Sort and Filter menus might overlap on very small screens, Tailwind handles this if the menu is positioned 'absolute' correctly */}
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

      {/* The view toggle button group on the right */}
      <div className="ml-auto sm:ml-0">
        <ViewToggle view={view} setView={setView} icons={{ grid: MdGridView, list: MdViewList }} />
      </div>
    </div>
  );
}
