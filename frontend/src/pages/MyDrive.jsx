import { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import Toolbar from "../components/Toolbar";
import FileGrid from "../components/FileGrid";
import UploadFab from "../components/UploadFab";
import ContextMenu from "../components/ContextMenu";
import Modal from "../components/Modal";
import {
  useGetFilesQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
} from "../redux/api";

export default function MyDrive() {
  const { data, isLoading, error } = useGetFilesQuery();
  const [uploadFile] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("name");
  const [menu, setMenu] = useState(null);
  const [openNew, setOpenNew] = useState(false);

  // ✅ Access the array correctly
  const files = data?.files ?? [];

  console.log("Files from API:", files);


  let sorted = [...files];

// 1) VIDEO filter pehle apply karo
if (sort === "video") {
  const videoTypes = ["mp4", "mov", "avi", "mkv"];
  sorted = sorted.filter(f => videoTypes.includes(f?.format));
}

if (sort === "audio") {
  const videoTypes = ["mp3", "mov", "avi", "mkv"];
  sorted = sorted.filter(f => videoTypes.includes(f?.format));
}

if (sort === "pdf") {
  const videoTypes = ["pdf", "mov", "avi", "mkv"];
  sorted = sorted.filter(f => videoTypes.includes(f?.format));
}


if (sort === "image") {
  const videoTypes = ["jpeg", "jpg", "png"];
  sorted = sorted.filter(f => videoTypes.includes(f?.format));
}

// 2) Baaki sorts normal tarah chalein
sorted = sorted.sort((a, b) => {
  if (sort === "name") {
    return (a.filename || "").localeCompare(b.filename || "");
  }
  if (sort === "updatedAt") {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  }
  if (sort === "size") {
    return (b.bytes || 0) - (a.bytes || 0);
  }
  
  return 0;
});


  // const sorted = [...files].sort((a, b) => {
  //   console.log(sort);
  //   if (sort === "name") {
  //     return (a.filename || "").localeCompare(b.filename || "");
  //   }
  //   if (sort === "updatedAt") {
  //     return new Date(b.updatedAt) - new Date(a.updatedAt);
  //   }
  //   if (sort === "size") {
  //     return (b.bytes || 0) - (a.bytes || 0);
  //   }
  //   if (sort === "video") {
  //     const videoTypes = ["mp4", "mov", "avi", "mkv"];
  //     sorted = [...files].filter(f => videoTypes.includes(f?.format));
  //   }

  //   return 0;
  // });


  if (isLoading) return <p>Loading files...</p>;
  if (error) return <p>Error loading files</p>;

  return (
    <div className="space-y-4">
      <Breadcrumbs path={[{ name: "My Drive", to: "/drive" }]} />
      <Toolbar
        onNew={() => setOpenNew(true)}
        view={view}
        setView={setView}
        sort={sort}
        setSort={setSort}
      />
      <FileGrid
        items={sorted}
        view={view}
        onContext={(e, it) => {
          e.preventDefault();
          setMenu({ x: e.clientX, y: e.clientY, item: it });
        }}
      />

      <UploadFab
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.onchange = (e) => {
            if (e.target.files[0]) uploadFile(e.target.files[0]);
          };
          input.click();
        }}
      />
      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          item={menu.item}
          onClose={() => setMenu(null)}
        />
      )}
      <Modal
        open={openNew}
        title="Create new"
        onClose={() => setOpenNew(false)}
        actions={
          <>
            <button className="btn-ghost" onClick={() => setOpenNew(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={() => setOpenNew(false)}>
              Create
            </button>
          </>
        }
      >
        Choose to create a folder or upload files.
      </Modal>
    </div>
  );
}
