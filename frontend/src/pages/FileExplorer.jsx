import { useState } from "react";

const mockData = {
  root: {
    folders: ["Projects", "Photos"],
    files: ["resume.pdf", "notes.txt"],
  },
  Projects: {
    folders: ["ReactApp", "Backend"],
    files: ["design.docx"],
  },
  Photos: {
    folders: [],
    files: ["pic1.jpg", "pic2.png"],
  },
  ReactApp: {
    folders: [],
    files: ["App.js", "index.html"],
  },
  Backend: {
    folders: [],
    files: ["server.js"],
  },
};

export default function FileExplorer() {
  const [path, setPath] = useState(["root"]);

  const currentFolder = path[path.length - 1];
  const data = mockData[currentFolder];

  const goToFolder = (folder) => {
    setPath([...path, folder]);
  };

  const goBackTo = (index) => {
    setPath(path.slice(0, index + 1));
  };

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <div className="flex space-x-2 mb-4">
        {path.map((p, i) => (
          <span
            key={i}
            className="cursor-pointer text-blue-600"
            onClick={() => goBackTo(i)}
          >
            {p} {i < path.length - 1 && ">"}
          </span>
        ))}
      </div>

      {/* Folders */}
      <div className="mb-4">
        <h3 className="font-bold">Folders</h3>
        <div className="flex flex-col">
          {data.folders.map((f) => (
            <button
              key={f}
              className="text-left p-2 hover:bg-gray-100"
              onClick={() => goToFolder(f)}
            >
              📁 {f}
            </button>
          ))}
        </div>
      </div>

      {/* Files */}
      <div>
        <h3 className="font-bold">Files</h3>
        <div className="flex flex-col">
          {data.files.map((file) => (
            <div key={file} className="p-2">
              📄 {file}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
