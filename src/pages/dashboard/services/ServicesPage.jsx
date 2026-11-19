import { useMemo, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  CircleDollarSign,
  FileDown,
  Hourglass,
  Plus,
  Store,
} from "lucide-react";
import { Modal, useToast } from "../../../components/common";
import ContractProgressCard from "./ContractProgressCard";
import ServiceListCard from "./ServiceListCard";
import VendorRemindersCard from "./VendorRemindersCard";

const INITIAL_SERVICES = [
  { id: "s1", name: "Đặt tiệc 30 bàn (Menu Premium)", vendor: "Sảnh Hoa Mai - Palace Hotel", category: "Ẩm thực & Sảnh tiệc", cost: 150000000, deposit: 50000000, status: "signed" },
  { id: "s2", name: "Trang trí hoa tươi & Gia tiên trọn gói", vendor: "La Rose Wedding Decor", category: "Trang trí & Hoa", cost: 55000000, deposit: 20000000, status: "signed" },
  { id: "s3", name: "Âm thanh, ánh sáng & MC tiệc", vendor: "Gold Sound & Lighting", category: "Âm thanh & Ánh sáng", cost: 25000000, deposit: 10000000, status: "signed" },
  { id: "s4", name: "Quay phim phóng sự & Chụp ảnh tiệc", vendor: "Meraki Wedding Studio", category: "Quay phim & Chụp ảnh", cost: 20000000, deposit: 10000000, status: "signed" },
  { id: "s5", name: "Thuê váy cưới & Vest chú rể", vendor: "L'Amour Bridal", category: "Trang phục & Makeup", cost: 15000000, deposit: 5000000, status: "negotiating" },
  { id: "s6", name: "Thiệp cưới & Quà tặng khách mời", vendor: "Tranh Giấy Craft Wedding", category: "Khác", cost: 5000000, deposit: 2000000, status: "negotiating" },
];

const REMINDERS = [
  { id: "r1", title: "Duyệt mẫu hoa trang trí bàn tiệc", vendor: "La Rose Decor", dueDate: "22/11/2026" },
  { id: "r2", title: "Thử váy cưới & vest chú rể lần 2", vendor: "L'Amour Bridal", dueDate: "25/11/2026" },
  { id: "r3", title: "Chốt danh sách bài hát & kịch bản MC", vendor: "Gold Sound", dueDate: "30/11/2026" },
];

export default function ServicesPage({ selectedWedding }) {
  const toast = useToast();
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [activeCategory, setActiveCategory] = useState("Tất cả (8)");
  const [searchValue, setSearchValue] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", vendor: "", cost: "" });

  const filteredServices = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    return services.filter((s) => {
      const matchCat =
        activeCategory === "Tất cả (8)" || s.category === activeCategory;
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.vendor.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [services, activeCategory, searchValue]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setServices((prev) => [
      {
        id: `s-${Date.now()}`,
        name: form.name.trim(),
        vendor: form.vendor.trim() || "Đối tác mới",
        category: "Trang trí & Hoa",
        cost: Number(form.cost) || 0,
        deposit: 0,
        status: "negotiating",
      },
      ...prev,
    ]);
    toast.success("Đã thêm dịch vụ mới");
    setForm({ name: "", vendor: "", cost: "" });
    setIsAddOpen(false);
  };

  const kpis = [
    { label: "Tổng số dịch vụ", value: "8 dịch vụ", sub: "Nhà cung cấp đã ký hợp đồng", icon: Briefcase },
    { label: "Đã chốt hợp đồng", value: "6 dịch vụ", sub: "Đã thanh toán cọc / tất toán", icon: CheckCircle2 },
    { label: "Đang thương thảo", value: "2 dịch vụ", sub: "Đang chờ duyệt báo giá", icon: Hourglass },
    { label: "Tổng chi phí dịch vụ", value: "145.000.000 đ", sub: "Chiếm 32,2% tổng ngân sách", icon: CircleDollarSign },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2C2117] sm:text-[26px]">
            Quản lý nhà cung cấp & Dịch vụ tiệc cưới.
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
            Thêm dịch vụ mới
          </button>
          <button
            type="button"
            onClick={() => toast.info("Đang mở danh sách nhà cung cấp gợi ý...")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2D9CB] bg-white px-3.5 py-2 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059]"
          >
            <Store size={13} className="text-[#7D6D5E]" />
            Tìm nhà cung cấp
          </button>
          <button
            type="button"
            onClick={() => toast.success("Đang xuất bản tổng hợp hợp đồng...")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2D9CB] bg-white px-3.5 py-2 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059]"
          >
            <FileDown size={13} className="text-[#7D6D5E]" />
            Xuất hợp đồng
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ServiceListCard
            services={filteredServices}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onViewContract={(row) => toast.info(`Xem hợp đồng: ${row.vendor}`)}
            onEdit={(row) => toast.info(`Chỉnh sửa dịch vụ: ${row.name}`)}
            onDelete={(id) => {
              setServices((prev) => prev.filter((item) => item.id !== id));
              toast.info("Đã xoá dịch vụ khỏi danh sách");
            }}
          />
        </div>

        <div className="space-y-5 lg:col-span-4">
          <ContractProgressCard />
          <VendorRemindersCard
            reminders={REMINDERS}
            onCall={(item) => toast.info(`Đang gọi đối tác ${item.vendor}...`)}
            onMessage={(item) => toast.info(`Gửi tin nhắn cho ${item.vendor}`)}
            onViewAll={() => toast.info("Đang mở danh bạ đối tác")}
          />
        </div>
      </div>

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Thêm dịch vụ tiệc cưới"
        size="sm"
      >
        <form onSubmit={handleAdd} className="space-y-3.5">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Tên dịch vụ
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ví dụ: Bánh cưới 3 tầng"
              className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2 text-sm outline-none focus:border-[#C5A059]"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Nhà cung cấp
            </label>
            <input
              type="text"
              value={form.vendor}
              onChange={(e) => setForm({ ...form, vendor: e.target.value })}
              placeholder="Tên đối tác"
              className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2 text-sm outline-none focus:border-[#C5A059]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Chi phí dự kiến (VNĐ)
            </label>
            <input
              type="number"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              placeholder="12000000"
              className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2 text-sm outline-none focus:border-[#C5A059]"
            />
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
              Thêm dịch vụ
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
