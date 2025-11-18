// routes: /folders/:folderId?  (folderId optional for root)
import { useParams, useNavigate } from "react-router-dom";
import { useGetFolderContentsQuery } from "../redux/api";
import FileGrid from "../components/FileGrid";

export default function FolderView() {
  const { folderId } = useParams();           // undefined => root
  const navigate = useNavigate();
  const { data, isLoading, isError,error } = useGetFolderContentsQuery(folderId);

  console.log(isError,error);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load folder.</div>;

  const breadcrumb = data?.breadcrumb ?? [{ _id: null, name: "My Drive" }];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {breadcrumb.map((node, idx) => (
          <span key={node._id ?? `root-${idx}`} className="flex items-center gap-2">
            <button
              className="hover:underline"
              onClick={() => navigate(node._id ? `/folders/${node._id}` : "/")}
            >
              {node.name}
            </button>
            {idx < breadcrumb.length - 1 && <span>/</span>}
          </span>
        ))}
      </div>

      {/* Subfolders */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Folders</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(data?.subFolders ?? []).map((folder) => (
            <button
              key={folder._id}
              onClick={() => navigate(`/folders/${folder._id}`)}
              className="flex items-center gap-2 p-3 border rounded hover:bg-gray-100 text-left"
            >
              <span>📁</span>
              <span className="font-medium truncate">{folder.name}</span>
            </button>
          ))}
          {(!data?.subFolders || data.subFolders.length === 0) && (
            <div className="text-gray-500 text-sm">No subfolders</div>
          )}
        </div>
      </section>

      {/* Files (reuse your existing FileGrid) */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Files</h3>
        <FileGrid items={data?.files ?? []} view="grid" />
      </section>
    </div>
  );
}
