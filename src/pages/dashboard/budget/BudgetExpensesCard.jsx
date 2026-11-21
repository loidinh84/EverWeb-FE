import { Pencil, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { Table } from "../../../components/common";

const CATEGORIES = [
  "Tất cả",
  "Ẩm thực",
  "Trang trí",
  "Âm thanh & Ánh sáng",
  "Trang phục & Ảnh",
  "Khác",
];

const STATUS_BADGES = {
  paid: { text: "Đã tất toán", className: "bg-emerald-50 text-emerald-700" },
  deposit: { text: "Đã đặt cọc", className: "bg-[#FBF5EA] text-[#8A6121]" },
  unpaid: { text: "Chưa thanh toán", className: "bg-stone-100 text-stone-600" },
};

const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN").format(n) + " đ";

export default function BudgetExpensesCard({
  items = [],
  activeCategory,
  onSelectCategory,
  searchValue,
  onSearchChange,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "name",
      title: "Item",
      render: (val) => (
        <span className="font-medium text-[#2C2117]">{val}</span>
      ),
    },
    { key: "category", title: "Hạng mục" },
    {
      key: "estimated",
      title: "Dự kiến",
      align: "right",
      render: (val) => (
        <span className="tabular-nums text-[#5E5042]">{formatVND(val)}</span>
      ),
    },
    {
      key: "actual",
      title: "Thực tế",
      align: "right",
      render: (val) => (
        <span className="font-semibold text-[#2C2117] tabular-nums">
          {formatVND(val)}
        </span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      align: "center",
      render: (val) => (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${
            STATUS_BADGES[val]?.className || "bg-stone-100 text-stone-600"
          }`}
        >
          {STATUS_BADGES[val]?.text || val}
        </span>
      ),
    },
    {
      key: "actions",
      title: "",
      align: "right",
      render: (_, row) => (
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(row);
            }}
            aria-label={`Sửa ${row.name}`}
            className="rounded-md p-1.5 text-[#8C7A68] hover:bg-[#FAF7F2] hover:text-[#2C2117]"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(row.id);
            }}
            aria-label={`Xoá ${row.name}`}
            className="rounded-md p-1.5 text-[#8C7A68] hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-[#2C2117]">
          Chi tiết các hạng mục chi tiêu
        </h2>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9C8B7A]"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Tìm kiếm khoản chi..."
              className="w-48 rounded-lg border border-[#E6DFD3] bg-[#FAF8F5] py-1.5 pr-3 pl-8 text-xs text-[#2C2117] placeholder-[#9C8B7A] outline-none focus:border-[#C5A059] focus:bg-white sm:w-56"
            />
          </div>
          <button
            type="button"
            aria-label="Lọc nâng cao"
            className="rounded-lg border border-[#E6DFD3] p-1.5 text-[#6D5B4B] hover:bg-[#FAF7F2]"
          >
            <SlidersHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="mt-4 flex flex-wrap gap-4 border-b border-[#F1ECE3]">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory?.(cat)}
              className={`border-b-2 pb-2.5 text-xs font-medium transition ${
                isActive
                  ? "border-[#C5A059] font-semibold text-[#2C2117]"
                  : "border-transparent text-[#8C7A68] hover:text-[#2C2117]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <Table
          columns={columns}
          data={items}
          emptyText="Không có khoản chi nào phù hợp"
          className="border-[#EFEAE1]"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#8C7A68]">
        <span>Hiển thị 1-{items.length} trong 12 khoản chi</span>
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
