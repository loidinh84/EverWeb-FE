import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Copy, ExternalLink, Search } from "lucide-react";
import { useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import { extractApiError } from "../../services/api";
import weddingApi from "../../services/weddingApi";
import CollaboratorsModal from "./CollaboratorsModal";

const SETTINGS_MENU = [
  { key: "general", label: "Cài đặt chung" },
  { key: "language", label: "Ngôn ngữ & Tiền tệ" },
  { key: "website", label: "Website" },
  { key: "registry", label: "Quà mừng" },
  { key: "rsvp", label: "Phản hồi RSVP" },
  { key: "admins", label: "Cộng tác viên" },
];

export default function EventSettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("general");
  const [wedding, setWedding] = useState(() => {
    if (location.state?.wedding) return location.state.wedding;
    try {
      const cached = sessionStorage.getItem("everweb_pending_wedding");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [groomName, setGroomName] = useState(wedding?.groom_name || "");
  const [brideName, setBrideName] = useState(wedding?.bride_name || "");
  const [venueName, setVenueName] = useState(wedding?.venue_name || "");
  const [weddingDate, setWeddingDate] = useState(
    wedding?.wedding_date ? String(wedding.wedding_date).slice(0, 10) : ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);

  useEffect(() => {
    if (wedding) return undefined;
    let cancelled = false;
    weddingApi
      .getAll()
      .then((items) => {
        if (cancelled || items.length === 0) return;
        const w = items[0];
        setWedding(w);
        setGroomName(w.groom_name || "");
        setBrideName(w.bride_name || "");
        setVenueName(w.venue_name || "");
        setWeddingDate(w.wedding_date ? String(w.wedding_date).slice(0, 10) : "");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [wedding]);

  const publicUrl = `everweb.vn/${wedding?.slug || "khang-an"}`;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!wedding?.id || String(wedding.id).startsWith("local-")) {
      toast.error("Chưa có hồ sơ đám cưới trên máy chủ để lưu");
      return;
    }

    setIsSaving(true);
    try {
      const updated = await weddingApi.update(wedding.id, {
        title: `${groomName.trim()} & ${brideName.trim()}`,
        groom_name: groomName.trim(),
        bride_name: brideName.trim(),
        venue_name: venueName.trim() || null,
        wedding_date: weddingDate || null,
      });
      setWedding(updated);
      sessionStorage.setItem("everweb_pending_wedding", JSON.stringify(updated));
      localStorage.setItem("everweb_recent_wedding", JSON.stringify(updated));
      toast.success("Đã lưu thay đổi cài đặt sự kiện!");
    } catch (error) {
      toast.error(extractApiError(error, "Không thể lưu thay đổi").message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1F1A17]">
      {/* Top Bar */}
      <header className="flex h-14 items-center justify-between border-b border-stone-200 px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(ROUTE_PATHS.EVENT_HUB, { state: { wedding } })
            }
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-[#1F1A17]"
          >
            <ArrowLeft size={15} />
            Quay lại
          </button>
          <span className="text-sm font-bold text-[#1F1A17]">
            Cài đặt sự kiện
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              navigate(ROUTE_PATHS.WEBSITE_PREVIEW, { state: { wedding } })
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-3.5 py-1.5 text-xs font-medium text-[#1F1A17] hover:border-[#3B52DE]"
          >
            <ExternalLink size={13} />
            Xem trước Website
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.DASHBOARD_DEFAULT)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#3B52DE] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2F43C2]"
          >
            <Search size={12} />
            Vào Dashboard
          </button>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 md:grid-cols-12">
        {/* Left Settings Sidebar */}
        <aside className="border-r border-stone-200 bg-stone-50 p-5 md:col-span-3 lg:col-span-2">
          <p className="mb-3 px-2 text-xs text-stone-500">
            Website / <b className="text-[#1F1A17]">Cài đặt</b>
          </p>
          <nav className="space-y-1">
            {SETTINGS_MENU.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    if (item.key === "admins") {
                      setIsCollabOpen(true);
                    } else {
                      setActiveTab(item.key);
                    }
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition ${
                    isActive
                      ? "bg-white font-semibold text-[#3B52DE] shadow-2xs ring-1 ring-[#E7E5E4]"
                      : "text-stone-700 hover:bg-white/70"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex flex-col justify-between md:col-span-9 lg:col-span-10">
          <form onSubmit={handleSave} className="mx-auto w-full max-w-2xl space-y-8 p-6 sm:p-10">
            <div>
              <h1 className="text-xl font-bold text-[#1F1A17]">
                Cài đặt chung
              </h1>
              <p className="mt-1 text-xs text-stone-500">
                Quản lý đường dẫn thiệp cưới và thông tin cặp đôi hiển thị trên Website
              </p>
            </div>

            {/* Event URL */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-[#1F1A17]">
                Đường dẫn sự kiện EverWeb
              </label>
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(`https://${publicUrl}`);
                  toast.success("Đã sao chép đường dẫn sự kiện!");
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5F5F4] py-2.5 text-xs font-semibold text-[#1F1A17] transition hover:bg-[#E5DEC9]"
              >
                <Copy size={14} />
                Sao chép đường dẫn sự kiện
              </button>
            </div>

            {/* Personal Info */}
            <div className="space-y-4 border-t border-stone-100 pt-6">
              <h2 className="text-sm font-bold text-[#1F1A17]">
                Thông tin cặp đôi
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">
                    Người thứ nhất (Chú rể)
                  </label>
                  <input
                    type="text"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3B52DE]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">
                    Người thứ hai (Cô dâu)
                  </label>
                  <input
                    type="text"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3B52DE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">
                    Địa điểm tổ chức
                  </label>
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3B52DE]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">
                    Ngày cưới
                  </label>
                  <input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3B52DE]"
                  />
                </div>
              </div>
            </div>

            {/* Footer Save Bar */}
            <div className="flex items-center justify-between border-t border-stone-100 pt-5">
              <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
                <Check size={14} className="text-emerald-600" />
                Đồng bộ trực tiếp với Neon Database
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-[#3B52DE] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2F43C2] disabled:opacity-60"
              >
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </main>
      </div>

      <CollaboratorsModal
        isOpen={isCollabOpen}
        onClose={() => setIsCollabOpen(false)}
        weddingId={wedding?.id}
      />
    </div>
  );
}
