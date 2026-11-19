import { useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Gift,
  Users,
  Wallet,
} from "lucide-react";
import { useToast } from "../../../components/common";
import BudgetProgressCard from "./BudgetProgressCard";
import QuickSeatingCard from "./QuickSeatingCard";
import QuickTasksCard from "./QuickTasksCard";
import RecentActivityCard from "./RecentActivityCard";

const INITIAL_QUICK_TASKS = [
  { id: "qt1", title: "Thử váy cưới & vest lần cuối", meta: "Hạn: 25/11 • Cô dâu", done: false },
  { id: "qt2", title: "Duyệt kịch bản MC & âm nhạc", meta: "Hạn: 05/12 • Planner", done: false },
  { id: "qt3", title: "Chốt số lượng bàn & thực đơn", meta: "Hạn: 10/12 • Chú rể", done: false },
  { id: "qt4", title: "Đã hoàn tất đặt tiệc & cọc sảnh", meta: "Hoàn thành", done: true },
];

export default function DashboardOverview({ selectedWedding, onNavigate }) {
  const toast = useToast();
  const [tasks, setTasks] = useState(INITIAL_QUICK_TASKS);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const kpis = [
    { label: "Khách mời", value: "96 / 120 khách", sub: "80% đã xác nhận RSVP • 24 chờ", icon: Users },
    { label: "Ngân sách", value: "250.000.000 đ", sub: "Đã chi 55.5% • Còn lại 200.000.000 đ", icon: Wallet },
    { label: "Tiến độ công việc", value: "78% hoàn thành", sub: "54 / 69 đầu việc", icon: CheckCircle2 },
    { label: "Mừng cưới & QR", value: "145.200.000 đ", sub: "32 lượt giao dịch mừng cưới", icon: Gift },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2C2117] sm:text-[26px]">
            Tổng quan kế hoạch ngày chung đôi.
          </h1>
          <p className="mt-1 text-xs text-[#8C7A68]">
            {selectedWedding?.couple || "Lễ cưới Linh & Nam"} ·{" "}
            {selectedWedding?.hall || "Sảnh Hoa Mai"} ·{" "}
            {selectedWedding?.time || "18:00, 20/12/2026"} · Còn 30 ngày
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => toast.info("Đang mở xem trước thiệp mời online...")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2D9CB] bg-white px-3.5 py-2 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059]"
          >
            <ExternalLink size={13} className="text-[#7D6D5E]" />
            Xem thiệp mời online
          </button>
          <button
            type="button"
            onClick={() => toast.success("Đang xuất báo cáo tổng hợp...")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#C5A059] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#B28D46]"
          >
            <BarChart3 size={13} />
            Xem báo cáo tổng hợp
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

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <QuickSeatingCard onViewDetail={() => onNavigate?.("seating")} />
          <BudgetProgressCard onViewDetail={() => onNavigate?.("budget")} />
        </div>

        <div className="space-y-5 lg:col-span-4">
          <QuickTasksCard
            tasks={tasks}
            onToggleTask={toggleTask}
            onViewAll={() => onNavigate?.("schedule")}
          />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
}
