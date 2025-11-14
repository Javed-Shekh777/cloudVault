// Trash.jsx
import Breadcrumbs from "../components/Breadcrumbs";
import FileGrid from "../components/FileGrid";

export default function Trash() {
  return (
    <div className="space-y-4">
      <Breadcrumbs path={[{ name: "Trash", to: "/trash" }]} />
      <div className="card p-4 text-sm text-gray-600">
        No items in trash. Restore or permanently delete from here.
      </div>
    </div>
  );
}
