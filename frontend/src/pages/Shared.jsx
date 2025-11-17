// Shared.jsx
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import FileGrid from "../components/FileGrid.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { useGetFilesQuery } from "../redux/api.js";
import { useSelector } from "react-redux";

export default function Shared() {
  const { user } = useSelector(state => state.auth); // current logged in user
  const { data, isLoading, error } = useGetFilesQuery();

  const files = data?.files?.filter(f =>
    f?.sharedWith?.includes(user._id)) ?? [];

  // const files= data?.files || [];

  if (isLoading) return <Spinner size="h-14 w-14" />;
  if (error) return <div>Error loading shared files</div>;

  return (
    <div className="space-y-4">
      <Breadcrumbs path={[{ name: "Shared with me", to: "/shared" }]} />
      {files.length > 0 ? (
        <FileGrid items={files} view="list" />
      ) : (
        <div className="card p-4 text-sm text-gray-600">
          No files have been shared with you yet.
        </div>
      )}
    </div>
  );
}
