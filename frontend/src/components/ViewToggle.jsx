export default function ViewToggle({ view, setView, icons }) {
  const GridIcon = icons.grid, ListIcon = icons.list;
  return (
    <div className="inline-flex bg-white border border-gray-200 rounded-lg overflow-hidden">
      <button
        className={`px-3 py-2 text-sm ${view === "grid" ? "bg-gray-100" : ""}`}
        onClick={() => setView("grid")}
      >
        <GridIcon />
      </button>
      <button
        className={`px-3 sm:block hidden py-2 text-sm ${view === "list" ? "bg-gray-100" : ""}`}
        onClick={() => setView("list")}
      >
        <ListIcon />
      </button>
    </div>
  );
}
