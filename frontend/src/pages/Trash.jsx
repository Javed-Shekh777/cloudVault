import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../components/Breadcrumbs";
import FileGrid from "../components/FileGrid";
import { deleteFile, fetchFiles } from "../redux/driveSlice";
import { useEffect } from "react";
import { useState } from "react";
import fileActions from "../utils/fileActions";
import { Spinner } from "../components/Spinner";
import toast from "react-hot-toast";

export default function Trash() {

  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();
  const { files, loading } = useSelector(state => state.drive);

  const [selectedTrash, setSelectedTrash] = useState([]);
  console.log(selectedTrash);

  const onSelectTrash = (id) => {
    setSelectedTrash(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    setLoader(true);
    dispatch(fetchFiles());
    setLoader(false);
  }, []);


  const restoreSelected = async () => {
    for (const id of selectedTrash) {
      await fileActions.trash(id,"Restore");  // isDeleted = false
    }
    setSelectedTrash([]);
    dispatch(fetchFiles());   // re-fetch
  };


  const deleteSelected = async () => {
    for (const id of selectedTrash) {
      const res = await dispatch(deleteFile(id)).unwrap();
      console.log(res);
      toast.success(res?.message ? "File Deleted" : "File Not deleted");

    }
    setSelectedTrash([]);
    // dispatch(fetchFiles());   // re-fetch
  };


  const emptyTrash = async () => {
    for (const f of trashedFiles) {
      await dispatch(deleteFile(f._id));
    }
    setSelectedTrash([]);
    // dispatch(fetchFiles());   // re-fetch
  };


  const trashedFiles = files.filter(f => f.isDeleted);

  if (loader) {
    return <Spinner color="text-blue-500" size={"h-12 w-12"} />;
  }


  return (
    <div className="space-y-4">
      <Breadcrumbs path={[{ name: "Trash", to: "/trash" }]} />

      {/* {selected.length > 0 && ( */}
      <div className="flex items-center gap-4 mb-3 bg-gray-100 p-3 rounded-lg">

        <button
          className="btn btn-sm bg-blue-500 text-white"
          onClick={restoreSelected}
        >
          {loading ? <Spinner color="text-black" size={"h-4 w-4"} /> : <>Restore<span className="text-sm p-0">{selectedTrash?.length > 0 && selectedTrash.length}</span></>}


        </button>

        <button
          className="btn btn-sm bg-red-500 text-white"
          onClick={deleteSelected}
        >
          {loading ? <Spinner color="text-black" size={"h-4 w-4"} /> : <>Delete Permanently<span className="text-sm p-0">{selectedTrash?.length > 0 && selectedTrash.length}</span></>}
        </button>
      </div>
      {/* )} */}

      <div className="flex justify-end mb-3">
        <button
          className="btn btn-sm bg-red-600 text-white"
          onClick={emptyTrash}
        >

          Empty Trash
        </button>
      </div>

      {trashedFiles.length ? (
        <FileGrid items={trashedFiles}
          trashMode={true}
          selectedTrash={selectedTrash}
          onSelectTrash={onSelectTrash}
        />
      ) : (
        <div className="card p-4 text-sm text-gray-600">
          No items in trash.
        </div>
      )}
    </div>
  );
}
