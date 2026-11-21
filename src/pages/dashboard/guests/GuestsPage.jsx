import { useMemo, useState } from "react";
import {
  Armchair,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Plus,
  Send,
  Users,
} from "lucide-react";
import { Modal, useToast } from "../../../components/common";
import GuestListCard from "./GuestListCard";

const INITIAL_GUESTS = [
  { id: "g1", name: "Nguyễn Thị Lan", phone: "0909 123 456", group: "Nhà cô dâu", companions: "1 người (đi cùng)", table: "Bàn 04", rsvp: "confirmed" },
  { id: "g2", name: "Trần Văn Minh", phone: "0912 345 678", group: "Nhà chú rể", companions: "1 người (đi cùng)", table: "Bàn 01 (VIP)", rsvp: "confirmed" },
  { id: "g3", name: "Lê Thị Hoa", phone: "0938 765 432", group: "Nhà cô dâu", companions: "2 người (đi cùng)", table: "Bàn 04", rsvp: "confirmed" },
  { id: "g4", name: "Phạm Hoàng Nam", phone: "0903 111 222", group: "Bạn đại học", companions: "Không đi kèm", table: "Chưa xếp bàn", rsvp: "pending" },
  { id: "g5", name: "Gia đình Bác Hùng", phone: "0918 999 888", group: "Khách VIP", companions: "4 người (đi cùng)", table: "Bàn 02 (VIP)", rsvp: "confirmed" },
  { id: "g6", name: "Đặng Thu Thảo", phone: "0933 444 555", group: "Nhà chú rể", companions: "1 người (đi cùng)", table: "Chưa xếp bàn", rsvp: "pending" },
  { id: "g7", name: "Nguyễn Văn Hùng", phone: "0902 777 888", group: "Bạn đại học", companions: "1 người (đi cùng)", table: "Bàn 08", rsvp: "declined" },
];

export default function GuestsPage({ selectedWedding }) {
  const toast = useToast();
  const [guests, setGuests] = useState(INITIAL_GUESTS);
  const [selectedIds, setSelectedIds] = useState(["g1", "g2", "g3"]);
  const [activeGroup, setActiveGroup] = useState("all");
  const [rsvpFilter, setRsvpFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", group: "Nhà cô dâu" });

  const filteredGuests = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    return guests.filter((g) => {
      const matchGroup = activeGroup === "all" || g.group === activeGroup;
      const matchRsvp = rsvpFilter === "all" || g.rsvp === rsvpFilter;
      const matchSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.phone.toLowerCase().includes(q);
      return matchGroup && matchRsvp && matchSearch;
    });
  }, [guests, activeGroup, rsvpFilter, searchValue]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const allChecked = filteredGuests.every((g) => selectedIds.includes(g.id));
    setSelectedIds(allChecked ? [] : filteredGuests.map((g) => g.id));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setGuests((prev) => [
      {
        id: `g-${Date.now()}`,
        name: form.name.trim(),
        phone: form.phone.trim() || "0900 000 000",
        group: form.group,
        companions: "Không đi kèm",
        table: "Chưa xếp bàn",
        rsvp: "pending",
      },
      ...prev,
    ]);
    toast.success(`Đã thêm khách mời ${form.name.trim()}`);
    setForm({ name: "", phone: "", group: "Nhà cô dâu" });
    setIsAddOpen(false);
  };

  const kpis = [
    { label: "Tổng khách mời", value: "120 khách", sub: "Tổng số người được mời", icon: Users },
    { label: "Đã xác nhận (RSVP)", value: "96 khách", sub: "80% khách mời • Đã xác nhận tham gia", icon: CheckCircle2 },
    { label: "Chưa phản hồi", value: "24 khách", sub: "20% chờ xác nhận • Nhắc hẹn", icon: Clock },
    { label: "Đã xếp chỗ", value: "108 / 120 chỗ", sub: "Còn lại 12 khách chưa xếp bàn", icon: Armchair },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2C2117] sm:text-[26px]">
            Danh sách khách mời & Phản hồi tham dự.
          </h1>
          <p className="mt-1 text-xs text-[#8C7A68]">
            {selectedWedding?.couple || "Lễ cưới Linh & Nam"} ·{" "}
            {selectedWedding?.hall || "Sảnh Hoa Mai"} ·{" "}
            {selectedWedding?.time || "18:00, 20/12/2026"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#C5A059] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#B28D46]"
          >
            <Plus size={14} />
            Thêm khách mời
          </button>
          <button
            type="button"
            onClick={() =>
              toast.success(`Đã gửi thiệp mời tới ${selectedIds.length} khách đã chọn`)
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2D9CB] bg-white px-3.5 py-2 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059]"
          >
            <Send size={13} className="text-[#7D6D5E]" />
            Gửi thiệp mời
          </button>
          <button
            type="button"
            onClick={() => toast.info("Tính năng nhập từ file Excel sẽ kết nối API")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2D9CB] bg-white px-3.5 py-2 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059]"
          >
            <FileSpreadsheet size={13} className="text-[#7D6D5E]" />
            Nhập Excel
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, sub, icon: Icon }) => (
          <div
            key={label}
            className="flex items-start justify-between rounded-xl border border-[#E6DFD3] bg-white px-5 py-4"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#8C7A68]">{label}</p>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-[#2C2117] tabular-nums">
                {value}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-[#9C8B7A]">{sub}</p>
            </div>
            <Icon size={18} className="mt-0.5 shrink-0 text-[#B8A590]" />
          </div>
        ))}
      </div>

      <GuestListCard
        guests={filteredGuests}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        activeGroup={activeGroup}
        onSelectGroup={setActiveGroup}
        rsvpFilter={rsvpFilter}
        onRsvpFilterChange={setRsvpFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onResendInvite={(g) => toast.success(`Đã gửi lại thiệp cho ${g.name}`)}
        onEdit={(g) => toast.info(`Chỉnh sửa thông tin: ${g.name}`)}
        onDelete={(id) => {
          setGuests((prev) => prev.filter((item) => item.id !== id));
          toast.info("Đã xoá khách mời khỏi danh sách");
        }}
      />

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Thêm khách mời mới"
        size="sm"
      >
        <form onSubmit={handleAdd} className="space-y-3.5">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Họ và tên
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ví dụ: Nguyễn Minh Tuấn"
              className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2 text-sm outline-none focus:border-[#C5A059]"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Số điện thoại
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="0909 123 456"
              className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2 text-sm outline-none focus:border-[#C5A059]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Nhóm khách
            </label>
            <select
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
              className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2 text-sm outline-none focus:border-[#C5A059]"
            >
              {["Nhà cô dâu", "Nhà chú rể", "Bạn đại học", "Khách VIP"].map(
                (grp) => (
                  <option key={grp} value={grp}>
                    {grp}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="rounded-lg border border-[#E6DDD0] px-4 py-2 text-xs font-medium text-[#5E5042]"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#2F241D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#44352B]"
            >
              Thêm khách
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
