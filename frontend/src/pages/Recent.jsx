// Recent.jsx
 
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import FileGrid from "../components/FileGrid.jsx";
import { files } from "../data/files.js";
export default function Recent() {
  return (
    <div className="space-y-4">
      <Breadcrumbs path={[{ name: "Recent", to: "/recent" }]} />
      <FileGrid items={[...files].sort((a,b)=> new Date(b.updatedAt)-new Date(a.updatedAt))} view="list" />
    </div>
  );
}
