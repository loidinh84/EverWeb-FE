import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  MapPin,
  Monitor,
  Plus,
  Search,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import galleryCeremony from "../../assets/image/gallery-ceremony.jpg";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";

const DEFAULT_EVENTS = [
  {
    id: "ev1",
    day: "Trước ngày cưới",
    title: "Tổng duyệt nghi thức lễ (Rehearsal)",
    time: "16:00 - 17:00",
    venue: "Sảnh Hoa Mai - TP. Hồ Chí Minh",
    dresscode: "Trang phục lịch sự",
    description:
      "Buổi tổng duyệt ngắn cùng gia đình và dàn phù dâu, phù rể để mọi thứ diễn ra suôn sẻ.",
    audience: "Tất cả khách",
  },
  {
    id: "ev2",
    day: "Trước ngày cưới",
    title: "Tiệc tối thân mật (Rehearsal Dinner)",
    time: "18:30 - 20:30",
    venue: "Nhà hàng Riverside",
    dresscode: "Cocktail / Smart Casual",
    description:
      "Bữa tối ấm cúng chào đón bạn bè và người thân từ xa tới chung vui.",
    audience: "Gia đình & Bạn thân",
  },
  {
    id: "ev3",
    day: "Ngày cưới chính thức",
    title: "Đón khách & Chụp ảnh lưu niệm",
    time: "17:30 - 18:30",
    venue: "Sảnh Hoa Mai - TP. Hồ Chí Minh",
    dresscode: "Trắng / Be / Pastel",
    description:
      "Check-in tại sảnh hoa, thưởng thức tiệc nhẹ và lưu giữ khoảnh khắc cùng cô dâu chú rể.",
    audience: "Tất cả khách",
  },
  {
    id: "ev4",
    day: "Ngày cưới chính thức",
    title: "Lễ Thành Hôn & Tiệc tối",
    time: "18:30 - 21:30",
    venue: "Sảnh Hoa Mai - TP. Hồ Chí Minh",
    dresscode: "Lịch sự / Dạ tiệc",
    description:
      "Nghi thức trao nhẫn, cắt bánh kem, nâng ly chúc mừng và giao lưu âm nhạc.",
    audience: "Tất cả khách",
  },
  {
    id: "ev5",
    day: "Chưa chốt ngày",
    title: "Cà phê sáng chia tay (Post-Wedding Brunch)",
    time: "09:30 - 11:00",
    venue: "Sẽ thông báo sau",
    dresscode: "Thoải mái",
    description:
      "Gặp gỡ nhẹ nhàng trước khi mọi người quay trở lại thành phố.",
    audience: "Tất cả khách",
  },
];

export default function ScheduleEditorPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { wedding } = useCurrentWedding();

  const { data: webConfig, saveSection } = useWeddingFeature(
    wedding,
    "website_config",
    {
      scheduleLayout: "timeline",
      scheduleEvents: DEFAULT_EVENTS,
    }
  );

  const layout = webConfig.scheduleLayout || "timeline";
  const events = useMemo(
    () =>
      Array.isArray(webConfig.scheduleEvents) &&
      webConfig.scheduleEvents.length > 0
        ? webConfig.scheduleEvents
        : DEFAULT_EVENTS,
    [webConfig.scheduleEvents]
  );

  const [device, setDevice] = useState("desktop");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const editingEvent = events.find((e) => e.id === editingId) || null;

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? events.filter((e) => e.title.toLowerCase().includes(q))
      : events;
  }, [events, search]);

  const groupedEvents = useMemo(() => {
    const groups = new Map();
    for (const ev of filteredEvents) {
      const day = ev.day || "Ngày cưới chính thức";
      if (!groups.has(day)) groups.set(day, []);
      groups.get(day).push(ev);
    }
    return Array.from(groups.entries());
  }, [filteredEvents]);

  const handleAddEvent = () => {
    const newEv = {
      id: `ev-${Date.now()}`,
      day: "Ngày cưới chính thức",
      title: "Sự kiện mới",
      time: "19:00 - 20:00",
      venue: wedding?.venue_name || "Sảnh Hoa Mai - TP. Hồ Chí Minh",
      dresscode: "Tự chọn",
      description: "Mô tả ngắn gọn về hoạt động này.",
      audience: "Tất cả khách",
    };
    saveSection({ scheduleEvents: [...events, newEv] });
    setEditingId(newEv.id);
    toast.success("Đã thêm sự kiện mới vào lịch trình");
  };

  const handleUpdateEvent = (id, patch) => {
    saveSection({
      scheduleEvents: events.map((ev) =>
        ev.id === id ? { ...ev, ...patch } : ev
      ),
    });
  };

  const handleDeleteEvent = (id) => {
    saveSection({
      scheduleEvents: events.filter((ev) => ev.id !== id),
    });
    if (editingId === id) setEditingId(null);
    toast.info("Đã xoá sự kiện khỏi lịch trình");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1F1A17] font-sans antialiased">
      {/* WithJoy Schedule Top Bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-stone-200 bg-white px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(ROUTE_PATHS.EVENT_HUB, { state: { wedding } })
            }
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-black transition cursor-pointer"
            title="Quay lại Trung tâm sự kiện"
          >
            <ArrowLeft size={15} />
            <span>Trung tâm sự kiện</span>
          </button>
          <span className="h-4 w-px bg-stone-200" />
          <div className="flex items-center gap-1.5">
            <span className="font-display italic font-bold text-lg text-[#1F1A17]">
              .EverWeb
            </span>
            <span className="text-stone-300">|</span>
            <h1 className="text-sm font-semibold text-[#1F1A17]">
              Lịch trình ngày cưới
            </h1>
          </div>
          <span className="rounded-md border border-stone-300 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
            LỊCH TRÌNH+
          </span>
        </div>

        <div className="flex items-center rounded-lg border border-stone-200 bg-stone-50 p-0.5">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            aria-label="Xem Desktop"
            className={`rounded-md px-2.5 py-1 ${
              device === "desktop"
                ? "bg-white text-[#3B52DE] shadow-2xs"
                : "text-stone-500"
            }`}
          >
            <Monitor size={15} />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            aria-label="Xem Mobile"
            className={`rounded-md px-2.5 py-1 ${
              device === "mobile"
                ? "bg-white text-[#3B52DE] shadow-2xs"
                : "text-stone-500"
            }`}
          >
            <Smartphone size={15} />
          </button>
        </div>
      </header>

      {/* Split Editor: Sticky White Left Sidebar + Full-Bleed Woodgrain Schedule Preview */}
      <div className="flex flex-1 items-start">
        {/* Left Sidebar */}
        <aside className="sticky top-14 flex h-[calc(100vh-3.5rem)] w-88 shrink-0 flex-col border-r border-stone-200 bg-white">
          <div className="border-b border-stone-100 px-5 py-3.5 text-xs font-medium text-stone-500">
            Website / Các trang /{" "}
            <span className="font-semibold text-[#1F1A17]">Lịch trình</span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {editingEvent ? (
              <div className="ew-slide-up space-y-3">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-xs font-semibold text-[#3B52DE] hover:underline"
                >
                  ‹ Quay lại danh sách sự kiện
                </button>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#1F1A17]">
                    Chỉnh sửa sự kiện
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(editingEvent.id)}
                    className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
                    title="Xoá sự kiện"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-700">
                    Tên sự kiện
                  </label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) =>
                      handleUpdateEvent(editingEvent.id, {
                        title: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-700">
                    Nhóm ngày
                  </label>
                  <select
                    value={editingEvent.day}
                    onChange={(e) =>
                      handleUpdateEvent(editingEvent.id, {
                        day: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
                  >
                    <option value="Trước ngày cưới">Trước ngày cưới</option>
                    <option value="Ngày cưới chính thức">
                      Ngày cưới chính thức
                    </option>
                    <option value="Chưa chốt ngày">Chưa chốt ngày</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-700">
                      Khung giờ
                    </label>
                    <input
                      type="text"
                      value={editingEvent.time}
                      onChange={(e) =>
                        handleUpdateEvent(editingEvent.id, {
                          time: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-700">
                      Trang phục
                    </label>
                    <input
                      type="text"
                      value={editingEvent.dresscode}
                      onChange={(e) =>
                        handleUpdateEvent(editingEvent.id, {
                          dresscode: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-700">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    value={editingEvent.venue}
                    onChange={(e) =>
                      handleUpdateEvent(editingEvent.id, {
                        venue: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-700">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    rows={3}
                    value={editingEvent.description}
                    onChange={(e) =>
                      handleUpdateEvent(editingEvent.id, {
                        description: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-stone-200 p-3 text-xs outline-none focus:border-[#3B52DE]"
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Layout Selector */}
                <div>
                  <label className="text-[11px] font-semibold text-stone-700">
                    Bố cục hiển thị (Layout)
                  </label>
                  <select
                    value={layout}
                    onChange={(e) =>
                      saveSection({ scheduleLayout: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-[#3B52DE]"
                  >
                    <option value="timeline">
                      Dòng thời gian (Timeline)
                    </option>
                    <option value="cards">Thẻ sự kiện (Cards)</option>
                  </select>
                </div>

                {/* Search + Add New */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search
                      size={13}
                      className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-stone-400"
                    />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Lọc sự kiện..."
                      className="w-full rounded-full border border-stone-200 bg-stone-50 py-1.5 pr-3 pl-8 text-xs outline-none focus:border-[#3B52DE]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEvent}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#1F1A17] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#3B52DE]"
                  >
                    <Plus size={13} /> Thêm mới
                  </button>
                </div>

                {/* Grouped Events List */}
                <div className="space-y-5">
                  {groupedEvents.map(([day, items]) => (
                    <div key={day}>
                      <p className="mb-2 text-xs font-bold text-[#1F1A17]">
                        {day}
                      </p>
                      <div className="divide-y divide-stone-100 rounded-xl border border-stone-200">
                        {items.map((ev) => (
                          <button
                            key={ev.id}
                            type="button"
                            onClick={() => setEditingId(ev.id)}
                            className="flex w-full items-center justify-between px-3.5 py-3 text-left transition hover:bg-stone-50"
                          >
                            <div>
                              <p className="text-xs font-bold text-[#1F1A17]">
                                {ev.title}
                              </p>
                              <p className="mt-0.5 text-[11px] text-stone-500">
                                {ev.time}
                              </p>
                              <span className="mt-1.5 inline-block rounded-full bg-[#F3F0EA] px-2 py-0.5 text-[10px] font-medium text-stone-700">
                                {ev.audience}
                              </span>
                            </div>
                            <ChevronRight
                              size={15}
                              className="shrink-0 text-stone-400"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50 px-5 py-3 text-xs">
            <span className="text-[11px] text-stone-500">
              Tự động lưu Neon DB
            </span>
            <button
              type="button"
              onClick={() => toast.success("Đã lưu lịch trình lên Neon DB")}
              className="rounded-full bg-[#1F1A17] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#3B52DE]"
            >
              Lưu
            </button>
          </div>
        </aside>

        {/* Right Live Woodgrain Schedule Preview */}
        <section
          className="min-h-[calc(100vh-3.5rem)] min-w-0 flex-1 px-4 sm:px-8"
          style={{
            background:
              "repeating-linear-gradient(180deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 10px), linear-gradient(135deg, #563C28 0%, #3E2A1B 50%, #4E3725 100%)",
          }}
        >
          <div
            className={`mx-auto min-h-full bg-[#E7E5E4] text-[#1F1A17] shadow-2xl transition-all ${
              device === "mobile" ? "max-w-[375px]" : "max-w-[740px]"
            }`}
          >
            <img
              src={galleryCeremony}
              alt="Schedule cover"
              className="h-52 w-full object-cover"
            />
            <div className="px-6 py-8">
              <h2 className="font-display text-center text-3xl font-semibold">
                Lịch trình
              </h2>

              <div className="mt-8 space-y-8">
                {groupedEvents.map(([day, items]) => (
                  <div key={day}>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-stone-500 uppercase">
                      {day}
                    </p>
                    <div
                      className={
                        layout === "cards"
                          ? "mt-3 space-y-3"
                          : "mt-3 space-y-5 border-l border-[#1F1A17]/20 pl-5"
                      }
                    >
                      {items.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={() => setEditingId(ev.id)}
                          className={`relative cursor-pointer transition ${
                            layout === "cards"
                              ? "rounded-2xl bg-white/80 p-4 shadow-2xs hover:bg-white"
                              : "hover:opacity-80"
                          }`}
                        >
                          {layout !== "cards" && (
                            <span className="absolute top-1.5 -left-[25px] h-2.5 w-2.5 rounded-full border-2 border-stone-200 bg-[#5D4532]" />
                          )}
                          <p className="text-[10px] font-semibold text-stone-500">
                            {ev.time}
                          </p>
                          <h3 className="mt-0.5 text-base font-bold">
                            {ev.title}
                          </h3>
                          <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-700">
                            <MapPin size={11} /> {ev.venue}
                          </p>
                          {ev.dresscode && (
                            <p className="mt-0.5 text-[11px] text-stone-500">
                              Trang phục: {ev.dresscode}
                            </p>
                          )}
                          <p className="mt-2 text-xs leading-relaxed text-[#4A3A2B]">
                            {ev.description}
                          </p>
                          <p className="mt-2 flex items-center gap-2 text-[10px] font-semibold tracking-wider text-[#5D4532] uppercase">
                            <Calendar size={10} /> Thêm vào lịch · Chỉ đường
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
