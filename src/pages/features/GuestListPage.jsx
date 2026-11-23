import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckSquare,
  Contact,
  Download,
  Filter,
  MessageSquare,
  Plus,
  Search,
  Tag,
  Trash2,
  Upload,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import FeatureShell from "./FeatureShell";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";

const INITIAL_GUESTS = [
  {
    id: "g1",
    firstName: "Lan",
    lastName: "Nguyễn Thị",
    side: "Nhà gái",
    phone: "0909 123 456",
    email: "lan.nguyen@example.com",
    address: "Q. Bình Thạnh, TP.HCM",
    rsvp: "Tham dự",
    companions: 1,
    tag: "Bạn đại học",
  },
  {
    id: "g2",
    firstName: "Minh",
    lastName: "Trần Văn",
    side: "Nhà trai",
    phone: "0912 345 678",
    email: "minh.tran@example.com",
    address: "Q.1, TP.HCM",
    rsvp: "Tham dự",
    companions: 2,
    tag: "Gia đình",
  },
  {
    id: "g3",
    firstName: "Hùng",
    lastName: "Nguyễn Văn",
    side: "Nhà trai",
    phone: "0908 777 888",
    email: "hung.nv@example.com",
    address: "TP. Thủ Đức",
    rsvp: "Từ chối",
    companions: 0,
    tag: "Đồng nghiệp",
  },
  {
    id: "g4",
    firstName: "Thư",
    lastName: "Phạm Minh",
    side: "Nhà gái",
    phone: "0933 222 111",
    email: "thu.pham@example.com",
    address: "Q.3, TP.HCM",
    rsvp: "Chờ phản hồi",
    companions: 1,
    tag: "Phù dâu",
  },
  {
    id: "g5",
    firstName: "Nam",
    lastName: "Lê Hoàng",
    side: "Bạn bè",
    phone: "0977 555 444",
    email: "nam.le@example.com",
    address: "Q.7, TP.HCM",
    rsvp: "Chờ phản hồi",
    companions: 0,
    tag: "Phù rể",
  },
];

const RSVP_BADGE = {
  "Tham dự": "bg-emerald-50 text-emerald-700",
  "Từ chối": "bg-rose-50 text-rose-600",
  "Chờ phản hồi": "bg-amber-50 text-amber-700",
};

export default function GuestListPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { wedding } = useCurrentWedding();

  const { data: ccData, saveSection } = useWeddingFeature(
    wedding,
    "collect_contacts",
    {
      guestList: INITIAL_GUESTS,
    }
  );

  const guests = useMemo(
    () =>
      Array.isArray(ccData.guestList) && ccData.guestList.length > 0
        ? ccData.guestList
        : INITIAL_GUESTS,
    [ccData.guestList]
  );

  const [search, setSearch] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState("Tất cả");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    side: "Nhà trai",
    phone: "",
    email: "",
    address: "",
    rsvp: "Chờ phản hồi",
    companions: 0,
    tag: "Bạn bè",
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guests.filter((g) => {
      const matchRsvp = rsvpFilter === "Tất cả" || g.rsvp === rsvpFilter;
      const full = `${g.lastName} ${g.firstName} ${g.phone} ${g.email} ${g.tag}`.toLowerCase();
      return matchRsvp && (!q || full.includes(q));
    });
  }, [guests, search, rsvpFilter]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddGuest = (e) => {
    e.preventDefault();
    if (!form.firstName.trim()) return;
    const next = [
      {
        id: `g-${Date.now()}`,
        ...form,
        companions: Number(form.companions) || 0,
      },
      ...guests,
    ];
    saveSection({ guestList: next });
    toast.success("Đã thêm khách mời vào Neon DB");
    setForm({
      lastName: "",
      firstName: "",
      side: "Nhà trai",
      phone: "",
      email: "",
      address: "",
      rsvp: "Chờ phản hồi",
      companions: 0,
      tag: "Bạn bè",
    });
    setIsAddOpen(false);
  };

  const handleUpdateRsvp = (id, nextRsvp) => {
    saveSection({
      guestList: guests.map((g) => (g.id === id ? { ...g, rsvp: nextRsvp } : g)),
    });
  };

  const handleDelete = (id) => {
    saveSection({
      guestList: guests.filter((g) => g.id !== id),
    });
    toast.info("Đã xoá khách mời");
  };

  const handleExportCsv = () => {
    const header = "Ho,Ten,Nhom,SDT,Email,Dia chi,RSVP,Di cung,Tag\n";
    const rows = guests
      .map((g) =>
        [
          g.lastName,
          g.firstName,
          g.side,
          g.phone,
          g.email,
          g.address,
          g.rsvp,
          g.companions,
          g.tag,
        ]
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([`\uFEFF${header}${rows}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "danh-sach-khach-moi.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất file CSV danh sách khách mời");
  };

  return (
    <FeatureShell
      title="Danh sách Khách mời (Guest List)"
      subtitle={`${guests.length} khách mời · Đồng bộ Neon DB`}
      wedding={wedding}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`${ROUTE_PATHS.DASHBOARD}/guests`)}
            className="hidden rounded-full border border-[#E2D9CB] bg-white px-3 py-1.5 text-xs font-medium text-[#5E5042] hover:border-[#3B52DE] sm:inline-flex"
          >
            Xem bản Dashboard
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#3B52DE] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2F43C2]"
          >
            <Plus size={14} /> Thêm khách mời
          </button>
        </div>
      }
    >
      {/* WithJoy Guest List Top Search + Action Icon Strip */}
      <div className="mb-4 rounded-2xl border border-[#EAE6DF] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F1ECE3] pb-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9C8B7A]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên, SĐT, email hoặc nhóm khách mời..."
              className="w-full rounded-full border border-[#E2D9CB] bg-[#FAF8F5] py-2 pr-4 pl-9 text-xs outline-none focus:border-[#3B52DE]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={13} className="text-[#8C7A68]" />
            {["Tất cả", "Tham dự", "Chờ phản hồi", "Từ chối"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setRsvpFilter(st)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  rsvpFilter === st
                    ? "bg-[#2C2117] text-white"
                    : "bg-[#F7F6F3] text-[#5E5042] hover:bg-[#EDE9E2]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Action Bar (WithJoy Style) */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {[
            {
              label: "Thu thập liên hệ",
              icon: Contact,
              onClick: () =>
                navigate(ROUTE_PATHS.COLLECT_CONTACTS, { state: { wedding } }),
            },
            {
              label: "Nhắn tin",
              icon: MessageSquare,
              onClick: () =>
                navigate(ROUTE_PATHS.MESSAGING, { state: { wedding } }),
            },
            {
              label: "Cài đặt RSVP",
              icon: CheckSquare,
              onClick: () =>
                navigate(ROUTE_PATHS.RSVP_BUILDER, { state: { wedding } }),
            },
            {
              label: "Xếp chỗ ngồi",
              icon: Tag,
              onClick: () =>
                navigate(ROUTE_PATHS.SEATING_CHART, { state: { wedding } }),
            },
            {
              label: "Xuất CSV",
              icon: Download,
              onClick: handleExportCsv,
            },
            {
              label: "Nhập danh sách",
              icon: Upload,
              onClick: () =>
                toast.info("Chọn '+ Thêm khách mời' để nhập nhanh từng khách"),
            },
          ].map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.label}
                type="button"
                onClick={act.onClick}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#EFEAE1] bg-[#FAF8F5] px-3 py-1.5 text-[11px] font-semibold text-[#5E5042] transition hover:border-[#3B52DE] hover:bg-white hover:text-[#3B52DE]"
              >
                <Icon size={13} />
                {act.label}
              </button>
            );
          })}
          {selectedIds.length > 0 && (
            <span className="ml-auto text-xs font-semibold text-[#3B52DE]">
              Đã chọn {selectedIds.length} khách
            </span>
          )}
        </div>
      </div>

      {/* Spreadsheet-style Guest Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#EAE6DF] bg-white">
        <table className="min-w-full divide-y divide-[#F1ECE3] text-xs">
          <thead className="bg-[#FAF8F5] text-left font-semibold text-[#5E5042]">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    filtered.length > 0 &&
                    selectedIds.length === filtered.length
                  }
                  onChange={(e) =>
                    setSelectedIds(
                      e.target.checked ? filtered.map((g) => g.id) : []
                    )
                  }
                  className="h-3.5 w-3.5 accent-[#3B52DE]"
                />
              </th>
              <th className="px-4 py-3">Khách mời</th>
              <th className="px-4 py-3">Phía / Nhóm</th>
              <th className="px-4 py-3">Số điện thoại</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Địa chỉ</th>
              <th className="px-4 py-3">RSVP</th>
              <th className="px-4 py-3 text-right">Đi cùng</th>
              <th className="px-4 py-3">Thẻ</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1ECE3]">
            {filtered.map((g) => {
              const initials = `${g.lastName.slice(0, 1)}${g.firstName.slice(0, 1)}`.toUpperCase();
              return (
                <tr key={g.id} className="transition hover:bg-[#FAF8F5]/70">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(g.id)}
                      onChange={() => toggleSelect(g.id)}
                      className="h-3.5 w-3.5 accent-[#3B52DE]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[10px] font-bold text-[#3B52DE]">
                        {initials}
                      </span>
                      <span className="font-semibold text-[#2C2117]">
                        {g.lastName} {g.firstName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#5E5042]">{g.side}</td>
                  <td className="px-4 py-3 tabular-nums text-[#5E5042]">
                    {g.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-[#6D5B4B]">
                    {g.email || "—"}
                  </td>
                  <td className="px-4 py-3 text-[#6D5B4B]">
                    {g.address || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={g.rsvp}
                      onChange={(e) => handleUpdateRsvp(g.id, e.target.value)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold outline-none ${
                        RSVP_BADGE[g.rsvp] || "bg-stone-100 text-stone-600"
                      }`}
                    >
                      <option value="Tham dự">Tham dự</option>
                      <option value="Chờ phản hồi">Chờ phản hồi</option>
                      <option value="Từ chối">Từ chối</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {g.companions}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#F3F0EA] px-2.5 py-0.5 text-[10px] font-medium text-[#5E5042]">
                      {g.tag}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(g.id)}
                      aria-label="Xoá khách"
                      className="rounded-lg p-1 text-[#9C8B7A] hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Guest Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Thêm khách mời mới"
        size="md"
      >
        <form onSubmit={handleAddGuest} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Họ & tên đệm"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="rounded-xl border border-[#E2D9CB] px-3 py-2 outline-none focus:border-[#3B52DE]"
            />
            <input
              type="text"
              placeholder="Tên *"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="rounded-xl border border-[#E2D9CB] px-3 py-2 outline-none focus:border-[#3B52DE]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.side}
              onChange={(e) => setForm({ ...form, side: e.target.value })}
              className="rounded-xl border border-[#E2D9CB] bg-white px-3 py-2 outline-none focus:border-[#3B52DE]"
            >
              <option value="Nhà trai">Nhà trai</option>
              <option value="Nhà gái">Nhà gái</option>
              <option value="Bạn bè">Bạn bè</option>
            </select>
            <input
              type="text"
              placeholder="Thẻ (VD: Bạn đại học)"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="rounded-xl border border-[#E2D9CB] px-3 py-2 outline-none focus:border-[#3B52DE]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-xl border border-[#E2D9CB] px-3 py-2 outline-none focus:border-[#3B52DE]"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-xl border border-[#E2D9CB] px-3 py-2 outline-none focus:border-[#3B52DE]"
            />
          </div>
          <input
            type="text"
            placeholder="Địa chỉ nhận thiệp"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full rounded-xl border border-[#E2D9CB] px-3 py-2 outline-none focus:border-[#3B52DE]"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="rounded-lg border border-[#E2D9CB] px-4 py-2 font-medium"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#3B52DE] px-4 py-2 font-semibold text-white hover:bg-[#2F43C2]"
            >
              Lưu khách mời
            </button>
          </div>
        </form>
      </Modal>
    </FeatureShell>
  );
}
