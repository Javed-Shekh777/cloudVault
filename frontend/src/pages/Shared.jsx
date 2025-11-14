// Shared.jsx

import Breadcrumbs from "../components/Breadcrumbs";
import FileGrid from "../components/FileGrid";
import { files } from "../data/files";

 
export default function Shared() {
  return (
    <div className="space-y-4">
      <Breadcrumbs path={[{ name: "Shared with me", to: "/shared" }]} />
      <FileGrid items={files.filter(f => f.owner !== "Me")} />
    </div>
  );
}
