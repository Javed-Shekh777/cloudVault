// Starred.jsx

import Breadcrumbs from "../components/Breadcrumbs";
import FileGrid from "../components/FileGrid";
import { files } from "../data/files";

export default function Starred() {
  return (
    <div className="space-y-4">
      <Breadcrumbs path={[{ name: "Starred", to: "/starred" }]} />
      <FileGrid items={files.filter(f => f.starred)} />
    </div>
  );
}
