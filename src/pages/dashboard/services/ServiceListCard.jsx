import { FileText, Pencil, Search, Trash2 } from "lucide-react";
import { Table } from "../../../components/common";

const SERVICE_CATEGORIES = [
  "Tất cả (8)",
  "Ẩm thực & Sảnh tiệc",
  "Trang trí & Hoa",
  "Âm thanh & Ánh sáng",
  "Quay phim & Chụp ảnh",
  "Trang phục & Makeup",
];

const STATUS_BADGES = {
  signed: { text: "Đã ký hợp đồng", className: "bg-emerald-50 text-emerald-700" },
  negotiating: { text: "Đang thương thảo", className: "bg-[#FBF5EA] text-[#8A6121]" },
};

const formatVND = (n) => new Intl.NumberFormat("vi-VN").format(n) + " đ";

export default function ServiceListCard({
  services = [],
  activeCategory,
  onSelectCategory,
  searchValue,
  onSearchChange,
  onViewContract,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "name",
      title: "Dịch vụ",
      render: (val) => (
        <span className="font-semibold text-[#2C2117]">{val}</span>
      ),
    },
    { key: "vendor", title: "Nhà cung cấp" },
    { key: "category", title: "Hạng mục" },
    {
      key: "cost",
      title: "Chi phí",
      align: "right",
      render: (val) => (
        <span className="font-semibold text-[#2C2117] tabular-nums">
          {formatVND(val)}
        </span>
      ),
    },
    {
      key: "deposit",
      title: "Đặt cọc",
      align: "right",
      render: (val) => (
        <span className="text-[#5E5042] tabular-nums">{formatVND(val)}</span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      align: "center",
      render: (val) => (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${
            STATUS_BADGES[val]?.className
          }`}
        >
          {STATUS_BADGES[val]?.text}
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
              onViewContract?.(row);
            }}
            aria-label={`Xem hợp đồng ${row.name}`}
            className="rounded-md p-1.5 text-[#8C7A68] hover:bg-[#FAF7F2] hover:text-[#2C2117]"
          >
            <FileText size={14} />
          </button>
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
          Danh sách dịch vụ & Đối tác
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
            placeholder="Tìm dịch vụ, nhà cung cấp..."
            className="w-56 rounded-lg border border-[#E6DFD3] bg-[#FAF8F5] py-1.5 pr-3 pl-8 text-xs text-[#2C2117] placeholder-[#9C8B7A] outline-none focus:border-[#C5A059] focus:bg-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex flex-wrap gap-4 border-b border-[#F1ECE3]">
        {SERVICE_CATEGORIES.map((cat) => {
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
          data={services}
          emptyText="Không tìm thấy dịch vụ nào phù hợp"
          className="border-[#EFEAE1]"
        />
      </div>
    </div>
  );
}
