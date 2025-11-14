import { Link } from "react-router-dom";
import { MdChevronRight } from "react-icons/md";

export default function Breadcrumbs({ path = [] }) {
  // path: [{ name: "My Drive", to: "/drive" }, { name: "Designs", to: "/drive/designs" }]
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-700">
      {path.map((p, i) => (
        <div key={p.to} className="flex items-center">
          {i > 0 && <MdChevronRight className="text-gray-400" />}
          <Link to={p.to} className="hover:underline">{p.name}</Link>
        </div>
      ))}
    </nav>
  );
}
