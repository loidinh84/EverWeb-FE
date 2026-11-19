import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleDollarSign,
  Download,
  Plus,
  Scale,
  Wallet,
} from "lucide-react";
import { Modal, useToast } from "../../../components/common";
import BudgetAllocationCard from "./BudgetAllocationCard";
import BudgetExpensesCard from "./BudgetExpensesCard";
import UpcomingPaymentsCard from "./UpcomingPaymentsCard";

const INITIAL_EXPENSES = [
  { id: "e1", name: "Tiệc cưới 30 bàn - Sảnh Hoa Mai", category: "Ẩm thực", estimated: 150000000, actual: 150000000, status: "paid" },
  { id: "e2", name: "Gói trang trí gia tiên & sảnh tiệc", category: "Trang trí", estimated: 55000000, actual: 45000000, status: "deposit" },
  { id: "e3", name: "Hệ thống âm thanh, ánh sáng & MC", category: "Âm thanh & Ánh sáng", estimated: 25000000, actual: 25000000, status: "paid" },
  { id: "e4", name: "Thuê xe hoa & chụp ảnh phóng sự", category: "Trang phục & Ảnh", estimated: 20000000, actual: 10000000, status: "deposit" },
  { id: "e5", name: "Váy cưới & Vest chú rể", category: "Trang phục & Ảnh", estimated: 15000000, actual: 15000000, status: "paid" },
  { id: "e6", name: "Thiệp cưới & Quà tặng khách", category: "Khác", estimated: 10000000, actual: 5000000, status: "unpaid" },
];

const UPCOMING_PAYMENTS = [
  { id: "p1", title: "Đợt 2: Tiệc cưới (Sảnh Hoa Mai)", dueDate: "05/12/2026", amount: "50.000.000 đ", status: "pending" },
  { id: "p2", title: "Thanh toán nốt trang trí hoa & sảnh", dueDate: "10/12/2026", amount: "10.000.000 đ", status: "due" },
  { id: "p3", title: "Thuê xe hoa & Chụp ảnh tiệc", dueDate: "15/12/2026", amount: "10.000.000 đ", status: "pending" },
];

export default function BudgetPage({ selectedWedding }) {
  const toast = useToast();
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchValue, setSearchValue] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Ẩm thực", estimated: "" });

  const filteredExpenses = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    return expenses.filter((item) => {
      const matchCat = activeCategory === "Tất cả" || item.category === activeCategory;
      const matchSearch = !q || item.name.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [expenses, activeCategory, searchValue]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const amount = Number(form.estimated) || 0;
    setExpenses((prev) => [
      {
        id: `e-${Date.now()}`,
        name: form.name.trim(),
        category: form.category,
        estimated: amount,
        actual: 0,
        status: "unpaid",
      },
      ...prev,
    ]);
    toast.success("Đã thêm khoản chi mới");
    setForm({ name: "", category: "Ẩm thực", estimated: "" });
    setIsAddOpen(false);
  };

  const kpis = [
    { label: "Tổng ngân sách dự kiến", value: "450.000.000 đ", sub: "Ngân sách ban đầu", icon: CircleDollarSign },
    { label: "Tổng đã chi thực tế", value: "250.000.000 đ", sub: "Đã sử dụng 55,6% • Đúng kế hoạch", icon: Wallet },
    { label: "Ngân sách còn lại", value: "200.000.000 đ", sub: "Khoản quỹ dự phòng sẵn sàng", icon: Scale },
    { label: "Đã thanh toán / Đặt cọc", value: "185.000.000 đ", sub: "Đã chi trả 74% số đã thực tế", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2C2117] sm:text-[26px]">
            Kiểm soát ngân sách, trọn vẹn ngày vui.
          </h1>
          <p className="mt-1 text-xs text-[#8C7A68]">
            {selectedWedding?.couple || "Lễ cưới Linh & Nam"} ·{" "}
            {selectedWedding?.hall || "Sảnh Hoa Mai"} ·{" "}
            {selectedWedding?.time || "18:00, 20/12/2026"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#C5A059] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#B28D46]"
          >
            <Plus size={14} />
            Thêm khoản chi
          </button>
          <button
            type="button"
            onClick={() => toast.success("Đang xuất báo cáo ngân sách...")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2D9CB] bg-white px-3.5 py-2 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059]"
          >
            <Download size={14} className="text-[#7D6D5E]" />
            Xuất báo cáo
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
              <p className="mt-1.5 text-xl font-bold tracking-tight text-[#2C2117] tabular-nums">
                {value}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-[#9C8B7A]">{sub}</p>
            </div>
            <Icon size={18} className="mt-0.5 shrink-0 text-[#B8A590]" />
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <BudgetExpensesCard
            items={filteredExpenses}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onEdit={(row) => toast.info(`Chỉnh sửa khoản chi: ${row.name}`)}
            onDelete={(id) => {
              setExpenses((prev) => prev.filter((item) => item.id !== id));
              toast.info("Đã xoá khoản chi");
            }}
          />
        </div>

        <div className="space-y-5 lg:col-span-4">
          <BudgetAllocationCard />
          <UpcomingPaymentsCard
            payments={UPCOMING_PAYMENTS}
            onViewAll={() => toast.info("Đang mở toàn bộ lịch thanh toán")}
          />
        </div>
      </div>

      {/* Modal thêm khoản chi */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Thêm khoản chi mới"
        size="sm"
      >
        <form onSubmit={handleAdd} className="space-y-3.5">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Tên khoản chi
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ví dụ: Hoa cầm tay cô dâu"
              className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2 text-sm outline-none focus:border-[#C5A059]"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Hạng mục
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2 text-sm outline-none focus:border-[#C5A059]"
            >
              {["Ẩm thực", "Trang trí", "Âm thanh & Ánh sáng", "Trang phục & Ảnh", "Khác"].map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Chi phí dự kiến (VNĐ)
            </label>
            <input
              type="number"
              value={form.estimated}
              onChange={(e) => setForm({ ...form, estimated: e.target.value })}
              placeholder="5000000"
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
              Lưu khoản chi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
