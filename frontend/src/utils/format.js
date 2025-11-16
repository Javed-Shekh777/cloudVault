export const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${sizes[i]}`;
};


export const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { 
    month: "short", 
    day: "numeric",
    year: "numeric"
  });
};


export const handleToggleFunc = async (fileId,func) => {
    try {
        await func(fileId).unwrap();
        // Handle success (e.g., show a toast notification)
    } catch (error) {
        // Handle error
        console.log(error);
    }
};

// export const formatDateTime = (iso) => {
//   const d = new Date(iso);
//   return d.toLocaleString(undefined, {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };
