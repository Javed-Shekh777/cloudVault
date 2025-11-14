import { MdStarBorder, MdStar } from "react-icons/md";
import { typeIcon, typeColor } from "../utils/fileTypes.js";
import { formatBytes, formatDate } from "../utils/format.js";

export default function FileCard({ item, compact = false }) {
  const Icon = typeIcon(item.type);
  return compact ? (
    <div className="flex items-center gap-3">
      <Icon className={typeColor(item.format)} />
      <span className="text-gray-900">{item.filename}</span>
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      {item.preview ? (
        <img src={item.secure_url} alt="" className="w-full h-28 object-cover rounded-md border border-gray-200" />
      ) : (
        <div className="w-full h-28 flex items-center justify-center bg-gray-100 rounded-md">
          <Icon className={`${typeColor(item.format)} text-3xl`} />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="font-medium text-gray-900 truncate">{item.filename}</div>
          <div className="text-xs text-gray-500">{item.owner} • {formatDate(item?.updatedAt)} • {formatBytes(item.bytes) || "-"}</div>
        </div>
        <button className="btn-ghost">
          {item.starred ? <MdStar className="text-yellow-500" /> : <MdStarBorder className="text-gray-500" />}
        </button>
      </div>
    </div>
  );
}
