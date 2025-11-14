// Search.jsx
import { useSearchParams } from "react-router-dom";
import { files } from "../data/files";
import Breadcrumbs from "../components/Breadcrumbs";
import FileGrid from "../components/FileGrid";
 

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase();
  const res = files.filter(f => f.name.toLowerCase().includes(q));
  return (
    <div className="space-y-4">
      <Breadcrumbs path={[{ name: `Search: ${q}`, to: "/search" }]} />
      {q ? <FileGrid items={res} view="list" /> : <div className="card p-4 text-sm text-gray-600">Type in the search bar above.</div>}
    </div>
  );
}
