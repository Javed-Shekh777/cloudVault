// Starred.jsx

import Breadcrumbs from "../components/Breadcrumbs";
import FileGrid from "../components/FileGrid";
import { Spinner } from "../components/Spinner";

import { files } from "../data/files";
 

export default function Starred() {



  // if (isLoading) return <Spinner size="h-20 w-20" />;



  // if (error) return `Error occured ${JSON.stringify(error)}`;

  return (
    <div className="space-y-4">
      <Breadcrumbs path={[{ name: "Starred", to: "/starred" }]} />
      <FileGrid items={files?.filter(f => f.isFavourite && !f.isDeleted)} />
    </div>
  );
}
