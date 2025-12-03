import { NavLink } from "react-router-dom";
import {
  MdFolderOpen,
  MdPeopleAlt,
  MdAccessTime,
  MdStar,
  MdDelete,
  MdClose,
  MdAccountCircle,
  MdLockPerson ,
  MdSettings
} from "react-icons/md";

const Item = ({ to, icon: Icon, label, setOpen }) => (
  <NavLink
    to={to}
    onClick={() => setOpen?.(false)} // ✅ safe call, won’t throw if setOpen not passed
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
        isActive
          ? "bg-brand-50 text-brand-700 font-medium"
          : "text-gray-700 hover:bg-gray-100"
      }`
    }
  >
    <Icon className="text-xl" />
    {label}
  </NavLink>
);

export default function Sidebar({ open, setOpen }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 transform
        ${open ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block z-50`}
    >
      {/* Close button for mobile */}
      <div className="flex justify-between items-center p-3 md:hidden">
        <span className="font-semibold">Menu</span>
        <button onClick={() => setOpen(false)}>
          <MdClose size={28} />
        </button>
      </div>

      <div className="space-y-1 p-3">
        <Item to="/" icon={MdFolderOpen} label="My Drive" setOpen={setOpen} />
        <Item to="/shared" icon={MdPeopleAlt} label="Shared with me" setOpen={setOpen} />
        <Item to="/recent" icon={MdAccessTime} label="Recent" setOpen={setOpen} />
        <Item to="/starred" icon={MdStar} label="Starred" setOpen={setOpen} />
        <Item to="/trash" icon={MdDelete} label="Trash" setOpen={setOpen} />
        <Item to="/profile" icon={MdAccountCircle} label="Profile" setOpen={setOpen} />
        <Item to="/locked" icon={MdLockPerson } label="Locked" setOpen={setOpen} />
        <Item to="/setting" icon={MdSettings} label="Setting" setOpen={setOpen} />



      </div>
    </aside>
  );
}
