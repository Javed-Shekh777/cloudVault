import { useState, useRef, useEffect } from "react";



export default function SortMenu({ sort, setSort, label,options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button className="px-3 py-1.5 border rounded " onClick={() => setOpen((v) => !v)}>
        {options.find(o => o.key === sort)?.label ?? label}
      </button>
      {open && (
        <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-card z-10">
          {options.map(o => (
            <button
              key={o.key}
              className={`w-full gap-2 flex items-center text-left px-3 py-2 text-sm hover:bg-gray-100 ${sort === o.key ? "font-medium" : ""}`}
              onClick={() => { setSort(o.key); setOpen(false); }}
            >
             {o?.icon && <o.icon className="h-5 w-5"  />} 
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
