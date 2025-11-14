import { Link, useNavigate } from "react-router-dom";
import { MdDriveFileMove, MdSearch, MdHelpOutline, MdSettings, MdAccountCircle } from "react-icons/md";

export default function Header() {
  const navigate = useNavigate();
  const onSearch = (e) => {
    if (e.key === "Enter") navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3 px-4 py-2">
        <Link to="/drive" className="flex items-center gap-2">
          <MdDriveFileMove className="text-brand-600" size={24} />
          <span className="font-semibold text-gray-900">Drive</span>
        </Link>
        <div className="flex-1 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
            <MdSearch className="text-gray-500" />
            <input
              placeholder="Search in Drive"
              className="bg-transparent w-full text-sm outline-none"
              onKeyDown={onSearch}
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="btn-ghost"><MdHelpOutline /></button>
          <button className="btn-ghost"><MdSettings /></button>
          <button className="btn-ghost"><MdAccountCircle /></button>
        </div>
      </div>
    </header>
  );
}
