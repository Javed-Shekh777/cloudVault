// Trash.jsx
import Breadcrumbs from "../components/Breadcrumbs";
import FileGrid from "../components/FileGrid";
import Spinner from "../components/Spinner";
import { useGetFilesQuery } from "../redux/api";

export default function Trash() {

  const { data, isLoading, error, refetch } = useGetFilesQuery();

  const files = data?.files ?? [];
  console.log(files);


     if (isLoading) return <Spinner height="h-20" width="h-20" color = "text-blue-500" />;


  if (error) return `Error occured ${JSON.stringify(error)}`;


  return (
    <div className="space-y-4">
      <Breadcrumbs path={[{ name: "Trash", to: "/trash" }]} />

      {files?.length > 0 ? <FileGrid items={files.filter(f => f?.isDeleted)} /> : <div className="card p-4 text-sm text-gray-600">
        No items in trash. Restore or permanently delete from here.
      </div>}



    </div>
  );
}
