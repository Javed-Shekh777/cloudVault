// Recent.jsx
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import FileGrid from "../components/FileGrid.jsx";
import { Spinner } from "../components/Spinner.jsx";

export default function Recent() {
  const files =   [];

  const recentFiles = files
    .filter(f => new Date(f.updatedAt) > new Date(Date.now() - 7*24*60*60*1000))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  if (isLoading) return <Spinner color="text-indigo-600" size="h-24 w-24" />;
  if (error) return <div>Error loading recent files</div>;

  return (
    <div className="space-y-4">
      <Breadcrumbs path={[{ name: "Recent", to: "/recent" }]} />
      {recentFiles.length > 0 ? (
        <FileGrid items={recentFiles} view="list" />
      ) : (
        <div className="card p-4 text-sm text-gray-600">
          No recent files found.
        </div>
      )}
    </div>
  );
}
