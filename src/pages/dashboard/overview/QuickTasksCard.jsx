export default function QuickTasksCard({
  tasks = [],
  onToggleTask,
  onViewAll,
}) {
  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[#2C2117]">
          Các đầu việc cần làm ngay
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-medium text-[#6D5B4B] hover:text-[#2C2117]"
        >
          Quản lý lịch trình →
        </button>
      </div>

      <div className="mt-3 divide-y divide-[#F1ECE3]">
        {tasks.map((task) => (
          <label
            key={task.id}
            className="flex cursor-pointer items-start gap-3 py-3 first:pt-1 last:pb-0"
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggleTask?.(task.id)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#D6CFC4] accent-[#C5A059]"
            />
            <div className="min-w-0">
              <p
                className={`text-xs font-medium ${
                  task.done
                    ? "text-[#9C8B7A] line-through"
                    : "text-[#2C2117]"
                }`}
              >
                {task.title}
              </p>
              <p className="mt-0.5 text-[11px] text-[#8C7A68]">{task.meta}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
