import { useMemo, useState } from "react";
import { Calendar, CheckCircle2, Clock, FileText, ListTodo, Plus } from "lucide-react";
import { Modal, useToast } from "../../../components/common";
import ChecklistCard from "./ChecklistCard";
import TimelineCard from "./TimelineCard";

const INITIAL_TASKS = [
  { id: "t1", title: "Hoàn tất đặt tiệc & cọc Sảnh Hoa Mai", dueDate: "01/10/2026", assignee: "Wedding Planner", phase: "before_month", status: "done" },
  { id: "t2", title: "Gửi thiệp mời online & chốt danh sách", dueDate: "15/11/2026", assignee: "Chú rể", phase: "before_month", status: "done" },
  { id: "t3", title: "Thử váy cưới & vest lần cuối", dueDate: "25/11/2026", assignee: "Cô dâu", phase: "before_month", status: "in_progress" },
  { id: "t4", title: "Duyệt kịch bản MC & âm thanh ánh sáng", dueDate: "05/12/2026", assignee: "Wedding Planner", phase: "wedding_week", status: "in_progress" },
  { id: "t5", title: "Chốt số lượng bàn & thực đơn chính thức", dueDate: "10/12/2026", assignee: "Chú rể", phase: "wedding_week", status: "urgent" },
  { id: "t6", title: "Kiểm tra sính lễ & hoa cầm tay", dueDate: "18/12/2026", assignee: "Cô dâu", phase: "wedding_day", status: "todo" },
];

const TIMELINE_EVENTS = [
  { id: "ev1", time: "07:00", title: "Lễ gia tiên & Rước dâu", location: "Nhà cô dâu & Nhà chú rể", description: "Rước dâu, làm lễ gia tiên tại nhà", owners: "Gia đình, MC" },
  { id: "ev2", time: "16:30", title: "Đón khách & Chụp ảnh sảnh", location: "Sảnh Hoa Mai - Tầng 2", description: "Đón khách tại backdrop, nhạc nền violin", owners: "Điều phối, Photographer" },
  { id: "ev3", time: "18:00", title: "Khai tiệc & Nghi thức lễ", location: "Sân khấu chính", description: "Chiếu video, cắt bánh, rót rượu", owners: "MC, Cô dâu & Chú rể" },
  { id: "ev4", time: "19:30", title: "Giao lưu & Tung hoa cưới", location: "Khu vực bàn tiệc & Sân khấu", description: "Gửi lời cảm ơn, tung hoa cưới, mini game", owners: "MC, Wedding Planner" },
  { id: "ev5", time: "21:00", title: "Tiễn khách & Kết thúc tiệc", location: "Sảnh đón khách", description: "Chụp ảnh lưu niệm, tiễn khách, quyết toán", owners: "Cô dâu, Chú rể, Gia đình" },
];

export default function SchedulePage({ selectedWedding }) {
  const toast = useToast();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activePhase, setActivePhase] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({ title: "", dueDate: "", assignee: "Wedding Planner" });

  const filteredTasks = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchPhase = activePhase === "all" || t.phase === activePhase;
      const matchSearch = !q || t.title.toLowerCase().includes(q);
      return matchPhase && matchSearch;
    });
  }, [tasks, activePhase, searchValue]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "done" ? "todo" : "done" }
          : t
      )
    );
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setTasks((prev) => [
      {
        id: `t-${Date.now()}`,
        title: form.title.trim(),
        dueDate: form.dueDate.trim() || "20/12/2026",
        assignee: form.assignee,
        phase: "wedding_week",
        status: "todo",
      },
      ...prev,
    ]);
    toast.success("Đã thêm đầu việc mới");
    setForm({ title: "", dueDate: "", assignee: "Wedding Planner" });
    setIsAddOpen(false);
  };

  const kpis = [
    { label: "Đếm ngược ngày cưới", value: "Còn 30 ngày", sub: "Ngày cưới: 20/12/2026", icon: Calendar },
    { label: "Tiến độ chuẩn bị", value: "78%", sub: "54 / 69 đầu việc hoàn thành", icon: CheckCircle2 },
    { label: "Công việc tuần này", value: "4 đầu việc", sub: "1 việc gấp sắp đến hạn", icon: ListTodo },
    { label: "Mốc sự kiện chính", value: "8 khung giờ", sub: "Kịch bản ngày cưới chính thức", icon: Clock },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2C2117] sm:text-[26px]">
            Kế hoạch & Kịch bản ngày trọng đại.
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
            Thêm đầu việc
          </button>
          <button
            type="button"
            onClick={() => toast.success("Đang xuất kịch bản MC ra file PDF...")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2D9CB] bg-white px-3.5 py-2 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059]"
          >
            <FileText size={13} className="text-[#7D6D5E]" />
            Xuất kịch bản MC
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
        <div className="lg:col-span-7">
          <ChecklistCard
            tasks={filteredTasks}
            activePhase={activePhase}
            onSelectPhase={setActivePhase}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onToggleTask={toggleTask}
          />
        </div>

        <div className="lg:col-span-5">
          <TimelineCard
            events={TIMELINE_EVENTS}
            onEditTimeline={() => toast.info("Chế độ chỉnh sửa timeline sẽ kết nối API")}
          />
        </div>
      </div>

      {/* Modal thêm đầu việc */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Thêm đầu việc chuẩn bị"
        size="sm"
      >
        <form onSubmit={handleAdd} className="space-y-3.5">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Tên công việc
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ví dụ: Xác nhận lại thực đơn với bếp"
              className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2 text-sm outline-none focus:border-[#C5A059]"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Hạn hoàn thành
            </label>
            <input
              type="text"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              placeholder="15/12/2026"
              className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2 text-sm outline-none focus:border-[#C5A059]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Người phụ trách
            </label>
            <select
              value={form.assignee}
              onChange={(e) => setForm({ ...form, assignee: e.target.value })}
              className="w-full rounded-lg border border-[#E6DDD0] px-3 py-2 text-sm outline-none focus:border-[#C5A059]"
            >
              {["Wedding Planner", "Chú rể", "Cô dâu", "Gia đình"].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
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
              Thêm đầu việc
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
