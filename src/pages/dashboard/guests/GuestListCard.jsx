import { Mail, Pencil, Search, SlidersHorizontal, Trash2 } from "lucide-react";

const GROUP_TABS = [
  { key: "all", label: "Tất cả (120)" },
  { key: "Nhà chú rể", label: "Nhà trai (55)" },
  { key: "Nhà cô dâu", label: "Nhà gái (45)" },
  { key: "Bạn đại học", label: "Bạn bè (15)" },
  { key: "Khách VIP", label: "Khách VIP (5)" },
];

const RSVP_BADGES = {
  confirmed: { text: "Đã xác nhận", className: "bg-emerald-50 text-emerald-700" },
  pending: { text: "Chưa phản hồi", className: "bg-[#FBF5EA] text-[#8A6121]" },
  declined: { text: "Từ chối", className: "bg-rose-50 text-rose-700" },
};

export default function GuestListCard({
  guests = [],
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  activeGroup,
  onSelectGroup,
  rsvpFilter,
  onRsvpFilterChange,
  searchValue,
  onSearchChange,
  onResendInvite,
  onEdit,
  onDelete,
}) {
  const allChecked =
    guests.length > 0 && guests.every((g) => selectedIds.includes(g.id));

  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <h2 className="text-base font-semibold text-[#2C2117]">
        Danh sách khách mời chi tiết
      </h2>

      {/* Filter bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#F1ECE3] pb-3">
        <div className="flex flex-wrap gap-4">
          {GROUP_TABS.map((tab) => {
            const isActive = activeGroup === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectGroup?.(tab.key)}
                className={`border-b-2 pb-1 text-xs font-medium transition ${
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

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9C8B7A]"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Tìm theo tên, số điện thoại..."
              className="w-52 rounded-lg border border-[#E6DFD3] bg-[#FAF8F5] py-1.5 pr-3 pl-8 text-xs text-[#2C2117] placeholder-[#9C8B7A] outline-none focus:border-[#C5A059] focus:bg-white"
            />
          </div>

          <select
            value={rsvpFilter}
            onChange={(e) => onRsvpFilterChange?.(e.target.value)}
            aria-label="Lọc trạng thái RSVP"
            className="rounded-lg border border-[#E6DFD3] bg-white px-2.5 py-1.5 text-xs text-[#5E5042] outline-none focus:border-[#C5A059]"
          >
            <option value="all">Trạng thái RSVP: Tất cả</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="pending">Chưa phản hồi</option>
            <option value="declined">Từ chối</option>
          </select>

          <button
            type="button"
            aria-label="Bộ lọc"
            className="rounded-lg border border-[#E6DFD3] p-1.5 text-[#6D5B4B] hover:bg-[#FAF7F2]"
          >
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-[#EFEAE1]">
        <table className="min-w-full divide-y divide-[#EFEAE1] text-sm">
          <thead className="bg-[#FAF7F2] text-xs font-semibold text-[#5E5042]">
            <tr>
              <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={onToggleSelectAll}
                  className="h-4 w-4 rounded border-[#D6CFC4] accent-[#C5A059]"
                  aria-label="Chọn tất cả"
                />
              </th>
              <th className="px-4 py-3 text-left">Họ và tên & Số điện thoại</th>
              <th className="px-4 py-3 text-left">Nhóm khách</th>
              <th className="px-4 py-3 text-left">Số người đi kèm</th>
              <th className="px-4 py-3 text-left">Bàn tiệc đã xếp</th>
              <th className="px-4 py-3 text-center">Trạng thái RSVP</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3EFE8]">
            {guests.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-xs text-[#8C7A68]">
                  Không tìm thấy khách mời nào phù hợp
                </td>
              </tr>
            ) : (
              guests.map((g) => {
                const checked = selectedIds.includes(g.id);
                return (
                  <tr key={g.id} className="transition hover:bg-[#FCF9F3]">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleSelect?.(g.id)}
                        className="h-4 w-4 rounded border-[#D6CFC4] accent-[#C5A059]"
                        aria-label={`Chọn ${g.name}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-[#2C2117]">
                        {g.name}
                      </p>
                      <p className="text-[11px] text-[#8C7A68] tabular-nums">
                        {g.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5E5042]">{g.group}</td>
                    <td className="px-4 py-3 text-xs text-[#5E5042]">
                      {g.companions}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-[#2C2117]">
                      {g.table}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          RSVP_BADGES[g.rsvp]?.className
                        }`}
                      >
                        {RSVP_BADGES[g.rsvp]?.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onResendInvite?.(g)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-[#6D5B4B] hover:bg-[#FAF7F2] hover:text-[#2C2117]"
                        >
                          <Mail size={12} /> Gửi lại thiệp
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit?.(g)}
                          aria-label={`Sửa ${g.name}`}
                          className="rounded-md p-1.5 text-[#8C7A68] hover:bg-[#FAF7F2] hover:text-[#2C2117]"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(g.id)}
                          aria-label={`Xoá ${g.name}`}
                          className="rounded-md p-1.5 text-[#8C7A68] hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#8C7A68]">
        <span>Hiển thị 1-{guests.length} trong 120 khách mời</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              type="button"
              className={`h-7 w-7 rounded-md text-xs font-medium ${
                p === 1
                  ? "bg-[#FBF5EA] font-semibold text-[#8A6121]"
                  : "hover:bg-[#FAF7F2]"
              }`}
            >
              {p}
            </button>
          ))}
          <span className="px-1">...</span>
          <button
            type="button"
            className="h-7 w-7 rounded-md text-xs font-medium hover:bg-[#FAF7F2]"
          >
            12
          </button>
          <button
            type="button"
            className="rounded-md px-2 py-1 text-xs font-medium hover:bg-[#FAF7F2]"
          >
            Tiếp
          </button>
        </div>
      </div>
    </div>
  );
}
