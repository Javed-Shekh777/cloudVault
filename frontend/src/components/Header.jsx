import { Link, useNavigate } from "react-router-dom";
import { MdDriveFileMove, MdSearch, MdHelpOutline, MdSettings, MdAccountCircle, MdMenu, MdClose } from "react-icons/md";
import { useSelector } from "react-redux";



export default function Header({ oepn, setOpen }) {
  const navigate = useNavigate();
  const {user} = useSelector((state)=>state.auth);
  const onSearch = (e) => {
    if (e.key === "Enter") navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">

      <div className="flex items-center gap-3 px-4 py-2">
        <Link to="/drive" className="sm:flex hidden items-center gap-2">
          <MdDriveFileMove className="text-brand-600" size={24} />
          <span className="font-semibold text-gray-900 ">Drive</span>
        </Link>
        <div className=" border-b bg-white flex items-center  md:hidden">
          <button onClick={() => setOpen(true)}>
            <MdMenu size={28} />
          </button>
          <span className="font-semibold">My Drive</span>
        </div>
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
          {/* Help Button */}
          <button
            className="btn-ghost h-7 w-7 p-1 rounded-full flex items-center justify-center hover:bg-cyan-100 transition duration-150"
            title="Help"
          >
            <MdHelpOutline className="h-full w-full" />
          </button>

          {/* Settings Button */}
          <button
            className="btn-ghost h-7 w-7 p-1 rounded-full flex items-center justify-center hover:bg-cyan-100 transition duration-150"
            title="Settings"
          >
            <MdSettings className="h-full w-full" />
          </button>

          {/* Account/Profile Button */}
          {user ? <img src={user?.profileImage?.url} alt="" className="h-7 w-7 p-1 rounded-full hover:bg-cyan-100 transition duration-150" />: <button
            className="btn-ghost h-7 w-7 p-1 rounded-full flex items-center justify-center hover:bg-cyan-100 transition duration-150"
            title="Account"
          >
            <MdAccountCircle className="h-full w-full" />
          </button>}
          
        </div>
      </div>
    </header>
  );
}
