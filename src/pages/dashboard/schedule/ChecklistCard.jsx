import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const PHASE_TABS = [
  { key: "all", label: "Tất cả (24)" },
  { key: "before_month", label: "Trước 1 tháng" },
  { key: "wedding_week", label: "Tuần lễ cưới" },
  { key: "wedding_day", label: "Ngày diễn ra" },
];

const STATUS_BADGES = {
  done: { text: "Hoàn thành", className: "bg-emerald-50 text-emerald-700" },
  in_progress: { text: "Đang làm", className: "bg-[#FBF5EA] text-[#8A6121]" },
  urgent: { text: "Sắp đến hạn", className: "bg-rose-50 text-rose-700" },
  todo: { text: "Chưa bắt đầu", className: "bg-stone-100 text-stone-600" },
};

export default function ChecklistCard({
  tasks = [],
  activePhase,
  onSelectPhase,
  searchValue,
  onSearchChange,
  onToggleTask,
}) {
  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-[#2C2117]">
          Danh sách việc cần làm (Checklist chuẩn bị)
        </h2>

        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9C8B7A]"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Tìm đầu việc..."
            className="w-48 rounded-lg border border-[#E6DFD3] bg-[#FAF8F5] py-1.5 pr-3 pl-8 text-xs text-[#2C2117] placeholder-[#9C8B7A] outline-none focus:border-[#C5A059] focus:bg-white"
          />
        </div>
      </div>

      {/* Phase Tabs */}
      <div className="mt-4 flex flex-wrap gap-4 border-b border-[#F1ECE3]">
        {PHASE_TABS.map((tab) => {
          const isActive = activePhase === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectPhase?.(tab.key)}
              className={`border-b-2 pb-2.5 text-xs font-medium transition ${
                isActive
                  ? "border-[#C5A059] font-semibold text-[#2C2117]"
                  : "border-transparent text-[#8C7A68] hover:text-[#2C2117]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Checklist rows */}
      <div className="mt-2 divide-y divide-[#F3EFE8]">
        {tasks.length === 0 ? (
          <p className="py-10 text-center text-xs text-[#8C7A68]">
            Không có công việc nào trong mục này
          </p>
        ) : (
          tasks.map((task) => {
            const isDone = task.status === "done";
            return (
              <div
                key={task.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 transition hover:bg-[#FCF9F3]"
              >
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => onToggleTask?.(task.id)}
                    className="h-4 w-4 shrink-0 rounded border-[#D6CFC4] accent-[#C5A059]"
                  />
                  <span
                    className={`truncate text-xs font-medium ${
                      isDone
                        ? "text-[#9C8B7A] line-through"
                        : "text-[#2C2117]"
                    }`}
                  >
                    {task.title}
                  </span>
                </label>

                <div className="flex shrink-0 items-center gap-2.5">
                  <span className="text-xs text-[#8C7A68] tabular-nums">
                    {task.dueDate}
                  </span>
                  <span className="rounded-md border border-[#EAE3D8] bg-[#FAF7F2] px-2 py-0.5 text-[11px] font-medium text-[#6D5B4B]">
                    {task.assignee}
                  </span>
                  <span
                    className={`w-24 rounded-full py-0.5 text-center text-[11px] font-medium ${
                      STATUS_BADGES[task.status]?.className
                    }`}
                  >
                    {STATUS_BADGES[task.status]?.text}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#F1ECE3] pt-3 text-xs text-[#8C7A68]">
        <span>Hiển thị 1-{tasks.length} trong số 24 việc</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Trang trước"
            className="rounded-md border border-[#E6DFD3] p-1 hover:bg-[#FAF7F2]"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            aria-label="Trang sau"
            className="rounded-md border border-[#E6DFD3] p-1 hover:bg-[#FAF7F2]"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
