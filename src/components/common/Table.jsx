import { Inbox, Loader2 } from "lucide-react";

const ALIGN_CLASSES = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * Table dùng chung.
 *
 * @param {{ key: string, title: React.ReactNode, render?: (value, row, index) => React.ReactNode,
 *           width?: string|number, align?: "left"|"center"|"right" }[]} columns
 * @param {object[]} data
 * @param {string | ((row) => string)} rowKey - mặc định "id"
 * @param {boolean} loading
 * @param {React.ReactNode} emptyText
 * @param {(row, index) => void} onRowClick
 */
export default function Table({
  columns = [],
  data = [],
  rowKey = "id",
  loading = false,
  emptyText = "Không có dữ liệu",
  onRowClick,
  className = "",
}) {
  const getRowKey = (row, index) =>
    typeof rowKey === "function" ? rowKey(row) : row?.[rowKey] ?? index;

  const isEmpty = !loading && data.length === 0;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={`px-4 py-3 font-semibold whitespace-nowrap text-gray-600 ${
                    ALIGN_CLASSES[col.align] || ALIGN_CLASSES.left
                  }`}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isEmpty ? (
              <tr>
                <td colSpan={columns.length || 1} className="px-4 py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Inbox size={36} strokeWidth={1.5} />
                    <span>{emptyText}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                  className={`transition-colors hover:bg-rose-50/50 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-gray-700 ${
                        ALIGN_CLASSES[col.align] || ALIGN_CLASSES.left
                      }`}
                    >
                      {col.render
                        ? col.render(row?.[col.key], row, index)
                        : row?.[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
            {loading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length || 1} className="h-32" />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
          <Loader2 className="animate-spin text-rose-500" size={28} />
        </div>
      )}
    </div>
  );
}
