// Starred.jsx

import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../components/Breadcrumbs";
import FileGrid from "../components/FileGrid";
import { Spinner } from "../components/Spinner";

import { files } from "../data/files";
import { fetchFiles } from "../redux/driveSlice";
import { useState } from "react";
import { useEffect } from "react";


export default function Starred() {


  const dispatch = useDispatch();
  const { files, folders, loading, error } = useSelector(state => state.drive);
  console.log(files, "Folders", folders,)
  const [path, setPath] = useState([{ name: "My Drive", _id: null }]);
  const currentFolderId = path[path.length - 1]._id;
  useEffect(() => {
    dispatch(fetchFiles({ folderId: currentFolderId, isLocked: false }));
  }, [currentFolderId]);


  // if (isLoading) return <Spinner size="h-20 w-20" />;
  // if (error) return `Error occured ${JSON.stringify(error)}`;

  return (
    <div className="space-y-4">
      <Breadcrumbs path={[{ name: "Starred", to: "/starred" }]} />
      <FileGrid items={files?.filter(f => f.isFavourite && !f.isDeleted)} />
    </div>
  );
}
