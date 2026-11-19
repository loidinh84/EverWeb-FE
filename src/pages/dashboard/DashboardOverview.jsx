import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Download,
  HeartHandshake,
  Users,
  Wallet,
} from "lucide-react";
import { Modal, Table, useToast } from "../../components/common";

const MOCK_WEDDINGS = [
  {
    id: "w1",
    groomName: "Nguyễn Văn Minh",
    brideName: "Trần Ngọc An",
    weddingDate: "2026-12-20",
    venueName: "Sảnh Hoa Mai",
    totalBudget: 450000000,
    guestsTotal: 120,
    guestsConfirmed: 96,
    status: "confirmed",
  },
  {
    id: "w2",
    groomName: "Lê Minh Khoa",
    brideName: "Phạm Thu Hà",
    weddingDate: "2027-01-08",
    venueName: "White Palace",
    totalBudget: 320000000,
    guestsTotal: 250,
    guestsConfirmed: 180,
    status: "planning",
  },
  {
    id: "w3",
    groomName: "Hoàng Đức Anh",
    brideName: "Võ Ngọc Mai",
    weddingDate: "2026-11-10",
    venueName: "Riverside Palace",
    totalBudget: 185000000,
    guestsTotal: 150,
    guestsConfirmed: 150,
    status: "completed",
  },
];

const STATUS_BADGES = {
  planning: { text: "Đang lên kế hoạch", className: "bg-amber-50 text-amber-700" },
  confirmed: { text: "Đã xác nhận", className: "bg-emerald-50 text-emerald-700" },
  completed: { text: "Đã tổ chức", className: "bg-sky-50 text-sky-700" },
};

const formatVND = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

export default function DashboardOverview({ selectedWedding }) {
  const toast = useToast();
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredWeddings = useMemo(
    () =>
      statusFilter === "all"
        ? MOCK_WEDDINGS
        : MOCK_WEDDINGS.filter((w) => w.status === statusFilter),
    [statusFilter]
  );

  const stats = [
    {
      label: "Tổng khách mời",
      value: "120",
      sub: "khách",
      icon: Users,
      accent: "bg-[#FBF5EA] text-[#B88B3E]",
    },
    {
      label: "Đã xác nhận",
      value: "96",
      sub: "80% khách mời",
      icon: CheckCircle2,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Chưa phản hồi",
      value: "24",
      sub: "chờ xác nhận",
      icon: Clock,
      accent: "bg-amber-50 text-amber-600",
    },
    {
      label: "Ngân sách dự kiến",
      value: "450.000.000 đ",
      sub: "đã chi 55,6%",
      icon: Wallet,
      accent: "bg-rose-50 text-rose-600",
    },
  ];

  const columns = [
    {
      key: "couple",
      title: "Cặp đôi",
      render: (_, row) => (
        <div>
          <p className="font-semibold text-[#2C2117]">
            {row.groomName} & {row.brideName}
          </p>
          <p className="text-xs text-[#8C7A68]">{row.venueName}</p>
        </div>
      ),
    },
    {
      key: "weddingDate",
      title: "Ngày cưới",
      render: (val) => (
        <span className="tabular-nums text-[#5E5042]">
          {new Date(val).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      key: "guestsConfirmed",
      title: "Khách xác nhận",
      align: "right",
      render: (_, row) => (
        <span className="tabular-nums">
          {row.guestsConfirmed}/{row.guestsTotal}
        </span>
      ),
    },
    {
      key: "totalBudget",
      title: "Ngân sách",
      align: "right",
      render: (val) => (
        <span className="tabular-nums font-medium text-[#2C2117]">
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
          className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
            STATUS_BADGES[val]?.className || "bg-gray-100 text-gray-600"
          }`}
        >
          {STATUS_BADGES[val]?.text || val}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page title row matching Figma editorial header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-widest text-[#8C7A68] uppercase">
            Ngày chung đôi • Quản trị đám cưới
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#2C2117] sm:text-3xl">
            Mỗi chỗ ngồi, một người thương.
          </h1>
          {selectedWedding && (
            <p className="mt-1 text-xs text-[#7D6D5E]">
              {selectedWedding.couple} • {selectedWedding.hall} •{" "}
              {selectedWedding.time}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => toast.success("Đang chuẩn bị xuất báo cáo đám cưới...")}
          className="inline-flex items-center gap-2 rounded-xl border border-[#DFD6C7] bg-white px-4 py-2 text-xs font-semibold text-[#3B2A1A] shadow-xs transition hover:border-[#C5A059] hover:bg-[#FCF9F3]"
        >
          <Download size={15} />
          Xuất báo cáo
        </button>
      </div>

      {/* 4 KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon, accent }) => (
          <div
            key={label}
            className="flex items-center gap-3.5 rounded-2xl border border-[#EAE3D8] bg-white p-4 shadow-2xs"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}
            >
              <Icon size={19} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#8C7A68]">{label}</p>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="tabular-nums text-lg font-bold text-[#2C2117]">
                  {value}
                </span>
                <span className="truncate text-[11px] text-[#9C8B7A]">
                  {sub}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weddings table */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HeartHandshake size={18} className="text-[#B88B3E]" />
            <h2 className="text-base font-bold text-[#2C2117]">
              Danh sách tiệc cưới
            </h2>
          </div>

          <div className="inline-flex flex-wrap gap-1 rounded-xl border border-[#EAE3D8] bg-[#EFEAE1] p-1">
            {[
              { key: "all", label: "Tất cả" },
              { key: "planning", label: "Kế hoạch" },
              { key: "confirmed", label: "Đã xác nhận" },
              { key: "completed", label: "Hoàn tất" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                  statusFilter === tab.key
                    ? "bg-white text-[#2C2117] shadow-2xs"
                    : "text-[#7D6D5E] hover:text-[#2C2117]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredWeddings}
          onRowClick={setSelected}
          emptyText="Chưa có dữ liệu tiệc cưới"
          className="border-[#EAE3D8]"
        />
      </div>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Chi tiết tiệc cưới"
        footer={
          <>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-xl border border-[#E6DDD0] px-4 py-2 text-sm font-medium text-[#5E5042] hover:bg-[#FAF8F5]"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => {
                toast.success(
                  `Đã chọn tiệc cưới ${selected.groomName} & ${selected.brideName}`
                );
                setSelected(null);
              }}
              className="rounded-xl bg-[#3B2A1A] px-4 py-2 text-sm font-medium text-white hover:bg-[#4D3824]"
            >
              Mở quản lý
            </button>
          </>
        }
      >
        {selected && (
          <div className="space-y-2 text-sm">
            <p>
              <b>Chú rể:</b> {selected.groomName}
            </p>
            <p>
              <b>Cô dâu:</b> {selected.brideName}
            </p>
            <p>
              <b>Địa điểm:</b> {selected.venueName}
            </p>
            <p>
              <b>Ngày cưới:</b>{" "}
              {new Date(selected.weddingDate).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <b>Ngân sách:</b> {formatVND(selected.totalBudget)}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
