// // Trash.jsx
// import Breadcrumbs from "../components/Breadcrumbs";
// import FileGrid from "../components/FileGrid";
// import Spinner from "../components/Spinner";
// import { useGetFilesQuery } from "../redux/api";

// export default function Trash() {
//   const { data, isLoading, error, refetch } = useGetFilesQuery();
//   const files = data?.files ?? [];
//   console.log(files);

//   if (isLoading) return <Spinner height="h-20" width="h-20" color="text-blue-500" />;
//   if (error) return `Error occured ${JSON.stringify(error)}`;

//   return (
//     <div className="space-y-4">
//       <Breadcrumbs path={[{ name: "Trash", to: "/trash" }]} />

//       {files?.length > 0 ? <FileGrid items={files.filter(f => f?.isDeleted)} /> : <div className="card p-4 text-sm text-gray-600">
//         No items in trash. Restore or permanently delete from here.
//       </div>}
//     </div>
//   );
// }





// Trash.jsx
import { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import FileGrid from "../components/FileGrid";
import { Spinner,ButtonSpinner } from "../components/Spinner";

import { useGetFilesQuery, useToggleTrashStatusMutation, useDeleteFileMutation } from "../redux/api";

export default function Trash() {
  const { data, isLoading, error, refetch } = useGetFilesQuery();
  const [restoreFile] = useToggleTrashStatusMutation();
  const [deleteFile] = useDeleteFileMutation();
  const [loading, setLoading] = useState(null);

  const files = data?.files?.filter(f => f?.isDeleted) ?? [];
  const [selectedTrash, setSelectedTrash] = useState([]);
  console.log(selectedTrash);

  if (isLoading) {
    return <Spinner size="h-20 w-20" color="text-blue-500" />;
  }



  if (error) {
    return `Error occurred ${JSON.stringify(error)}`;
  }

  const toggleSelect = (id) => {
    setSelectedTrash(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleRestore = async () => {
    setLoading("restore");
    for (const id of selectedTrash) {
      await restoreFile(id);
    }
    setSelectedTrash([]);
    setLoading(null);
    refetch();
  };

  const handleDelete = async () => {
    setLoading("delete");

    for (const id of selectedTrash) {
      await deleteFile(id);
    }
    setSelectedTrash([]);
    setLoading(null);
    refetch();
  };

  const handleEmptyTrash = async () => {
    setLoading("emptyTrash");
    const deletedFiles = files?.filter(f => f.isDeleted ?? []);
    for (const file of deletedFiles) {
      await deleteFile(file?._id);
    }
    setLoading(null);
    refetch();
  };



  return (
    <div className="space-y-4">
      <Breadcrumbs path={[{ name: "Trash", to: "/trash" }]} />

      {files.length > 0 ? (
        <>
          {/* Action buttons */}
          <div className="flex items-center justify-between">
            {/* {selected?.length > 0 && ( */}
            <div className="flex gap-2 items-center flex-wrap">
              <button
                onClick={handleRestore}
                className={`px-3 py-1 ${loading === "restore" ? "bg-gray-200 text-black" : "bg-green-600"} text-white rounded`}
              >
                {loading === "restore" ? <div className="flex items-center">Restoring <ButtonSpinner color="text-green" /></div> : <>Restore ({selectedTrash?.length})</>}
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                {loading === "delete" ? <div className="flex items-center">Deleting <ButtonSpinner /></div> : <>Delete Permanently ({selectedTrash.length})</>}
              </button>
            </div>
            {/* )} */}

            <button
              onClick={handleEmptyTrash}
              className="px-3 py-1 cursor-pointer hover:bg-red-600 bg-white hover:border-0 border text-balck hover:text-white rounded"
            >
              {loading === "emptyTrash" ? <div className="flex items-center">Deleting <ButtonSpinner /></div> : <>Empty Trash </>}


            </button>
          </div>


          {/* File grid with selection */}
          <FileGrid
            items={files}
            isTrash={true}
            selectedTrash={selectedTrash}
            onSelectTrash={toggleSelect}
          />
        </>
      ) : (
        <div className="card p-4 text-sm text-gray-600">
          Trash is empty. Deleted files will appear here until you restore or permanently delete them.
        </div>
      )}
    </div>
  );
}



// ButtonSpinner.jsx
