import { MdAdd, MdGridView, MdViewList } from "react-icons/md";
import ViewToggle from "./ViewToggle.jsx";
import SortMenu from "./SortMenu.jsx";
import { MdAudioFile, MdVideoFile, MdImage, MdEditDocument, MdAlbum } from "react-icons/md";



const filter1 = [
  { key: "updatedAt", label: "Last modified" },
  { key: "size", label: "File size" },
];

const filter2 = [
  { key: "all", label: "All", icon: MdAlbum },
  { key: "pdf", label: "Pdf", icon: MdEditDocument },
  { key: "audio", label: "Audio", icon: MdAudioFile },
  { key: "video", label: "Video", icon: MdVideoFile },
  { key: "image", label: "Image", icon: MdImage },
]

export default function Toolbar({ onNew, view, setView, sort, setSort }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <button className="btn-primary flex items-center px-3 py-1.5 bg-blue-300 text-white hover:bg-blue-500 rounded-lg cursor-pointer " onClick={onNew}><MdAdd /> New</button>
        <SortMenu options={filter1} label={"Filter"} sort={sort} setSort={setSort} />
        <SortMenu options={filter2} label={"Type"} sort={sort} setSort={setSort} />

      </div>
      <ViewToggle view={view} setView={setView} icons={{ grid: MdGridView, list: MdViewList }} />
    </div>
  );
}
