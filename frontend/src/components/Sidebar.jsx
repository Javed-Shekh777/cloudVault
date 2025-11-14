import { NavLink } from "react-router-dom";
import { MdFolderOpen, MdPeopleAlt, MdAccessTime, MdStar, MdDelete } from "react-icons/md";

const Item = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
        isActive ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-700 hover:bg-gray-100"
      }`
    }
  >
    <Icon className="text-xl" />
    {label}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 p-3 border-r border-gray-200 bg-white hidden md:block">
      <div className="space-y-1">
        <Item to="/" icon={MdFolderOpen} label="My Drive" />
        <Item to="/shared" icon={MdPeopleAlt} label="Shared with me" />
        <Item to="/recent" icon={MdAccessTime} label="Recent" />
        <Item to="/starred" icon={MdStar} label="Starred" />
        <Item to="/trash" icon={MdDelete} label="Trash" />
      </div>
    </aside>
  );
}
