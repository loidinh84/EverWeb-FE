import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Heart,
  Image as ImageIcon,
  Layout,
  LayoutGrid,
  MapPin,
  Monitor,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Smartphone,
  Sparkles,
  Type,
} from "lucide-react";
import { useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import weddingApi from "../../services/weddingApi";
import { extractApiError } from "../../services/api";
import galleryBouquet from "../../assets/image/gallery-bouquet.jpg";
import galleryCeremony from "../../assets/image/gallery-ceremony.jpg";
import galleryDining from "../../assets/image/gallery-dining.jpg";
import heroWedding from "../../assets/image/hero-wedding.jpg";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";

const COLOR_THEMES = [
  {
    id: "woodgrain",
    name: "Gỗ Cổ Điển",
    outerBg: "#4A3423",
    outerPattern:
      "repeating-linear-gradient(180deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 10px), linear-gradient(135deg, #563C28 0%, #3E2A1B 50%, #4E3725 100%)",
    bg: "#EDE8E1",
    cardBg: "#F7F4EF",
    accent: "#5D4532",
    text: "#2C2117",
  },
  {
    id: "cobalt",
    name: "Xanh Hiện Đại",
    outerBg: "#E6EBF7",
    outerPattern: "linear-gradient(135deg, #E8EDFA 0%, #DCE3F5 100%)",
    bg: "#FAF8F5",
    cardBg: "#FFFFFF",
    accent: "#3B52DE",
    text: "#2C2117",
  },
  {
    id: "champagne",
    name: "Vàng Champagne",
    outerBg: "#EFE6D8",
    outerPattern: "linear-gradient(135deg, #F2EAE0 0%, #E7DBC9 100%)",
    bg: "#FAF6F0",
    cardBg: "#FFFFFF",
    accent: "#B88E44",
    text: "#3B2A1A",
  },
  {
    id: "sage",
    name: "Xanh Olive",
    outerBg: "#DDE4DA",
    outerPattern: "linear-gradient(135deg, #E2E8DF 0%, #CFD9CB 100%)",
    bg: "#F4F6F2",
    cardBg: "#FFFFFF",
    accent: "#5F7161",
    text: "#243025",
  },
  {
    id: "rose",
    name: "Hồng Phấn",
    outerBg: "#F5E2E5",
    outerPattern: "linear-gradient(135deg, #F8E8EB 0%, #EED5DA 100%)",
    bg: "#FDF6F6",
    cardBg: "#FFFFFF",
    accent: "#B85D6E",
    text: "#3B2127",
  },
];

const FONT_OPTIONS = [
  { id: "serif", label: "Cormorant Garamond (Cổ điển)", className: "font-display" },
  { id: "sans", label: "Be Vietnam Pro (Hiện đại)", className: "font-sans" },
];

const COVER_IMAGES = [
  { id: "hero", label: "Sảnh tiệc hoa", src: heroWedding },
  { id: "ceremony", label: "Cổng hoa ngoài trời", src: galleryCeremony },
  { id: "bouquet", label: "Hoa cưới cầm tay", src: galleryBouquet },
  { id: "dining", label: "Bàn tiệc tối", src: galleryDining },
];

const ART_STYLES = [
  { id: "lace", label: "Hoa ren góc cổ điển" },
  { id: "gold", label: "Viền vàng tối giản" },
  { id: "none", label: "Không hoạ tiết" },
];

const INITIAL_PAGES = [
  { key: "welcome", label: "Chào mừng", visible: true },
  { key: "story", label: "Chuyện tình yêu", visible: true },
  { key: "schedule", label: "Lịch trình", visible: true },
  { key: "stay", label: "Nơi lưu trú", visible: true },
  { key: "party", label: "Phù dâu & Phù rể", visible: true },
  { key: "qa", label: "Hỏi đáp (Q&A)", visible: true },
  { key: "registry", label: "Quà mừng", visible: true },
  { key: "gallery", label: "Album ảnh", visible: true },
];

const CHECKLIST = [
  "Chọn mẫu giao diện & bảng màu",
  "Chọn ảnh bìa & hoạ tiết góc",
  "Kiểm tra lịch trình ngày cưới",
  "Cập nhật địa điểm & lưu trú",
  "Xuất bản Website cưới",
];

const DESIGN_TABS = [
  { key: "layout", label: "Bố cục & Ảnh bìa", icon: Layout },
  { key: "color", label: "Màu sắc", icon: Palette },
  { key: "font", label: "Phông chữ", icon: Type },
  { key: "art", label: "Hoạ tiết", icon: Sparkles },
  { key: "linkPreview", label: "Ảnh chia sẻ Link", icon: ImageIcon },
  { key: "pages", label: "Các trang hiển thị", icon: Eye },
  { key: "css", label: "Tuỳ chỉnh CSS", icon: Layout },
];

export default function WebsiteDesignPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { wedding, setWedding } = useCurrentWedding();

  const { data: webConfig, saveSection } = useWeddingFeature(
    wedding,
    "website_config",
    {
      themeId: "woodgrain",
      fontId: "serif",
      coverId: "ceremony",
      artId: "lace",
      fontScale: "md",
      pages: INITIAL_PAGES,
      doneSteps: [0, 1],
    }
  );

  const themeId = webConfig.themeId || "woodgrain";
  const fontId = webConfig.fontId || "serif";
  const coverId = webConfig.coverId || "ceremony";
  const artId = webConfig.artId || "lace";
  const fontScale = webConfig.fontScale || "md";
  const pages = webConfig.pages || INITIAL_PAGES;
  const doneSteps = webConfig.doneSteps || [0, 1];

  const [activeTab, setActiveTab] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const customCss = webConfig.customCss || "";
  const linkPreviewTitle = webConfig.linkPreviewTitle || "";
  const [device, setDevice] = useState("desktop");
  const [isPublishing, setIsPublishing] = useState(false);

  const activeTheme =
    COLOR_THEMES.find((t) => t.id === themeId) || COLOR_THEMES[0];
  const activeFont =
    FONT_OPTIONS.find((f) => f.id === fontId) || FONT_OPTIONS[0];
  const activeCover =
    COVER_IMAGES.find((c) => c.id === coverId) || COVER_IMAGES[1];

  const coupleName = (
    wedding?.title || "Trần Thanh Khang & Trần Ngọc An"
  ).normalize("NFC");
  const displayDate = wedding?.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("vi-VN")
    : "23/08/2027";
  const displayVenue = (
    wedding?.venue_name || "Sảnh Hoa Mai - TP. Hồ Chí Minh"
  ).normalize("NFC");
  const publicUrl = `everwed.vn/${wedding?.slug || "khang-an"}`;
  const isPublished = wedding?.status === "published";

  const isPageVisible = (key) =>
    pages.find((p) => p.key === key)?.visible ?? true;

  const togglePage = (key) => {
    saveSection((prev) => ({
      ...prev,
      pages: (prev.pages || INITIAL_PAGES).map((p) =>
        p.key === key ? { ...p, visible: !p.visible } : p
      ),
    }));
  };

  const toggleChecklist = (idx) => {
    saveSection((prev) => {
      const cur = prev.doneSteps || [];
      return {
        ...prev,
        doneSteps: cur.includes(idx)
          ? cur.filter((i) => i !== idx)
          : [...cur, idx],
      };
    });
  };

  const handleTogglePublish = async () => {
    if (!wedding?.id || String(wedding.id).startsWith("local-")) {
      toast.info("Cần lưu hồ sơ đám cưới trên máy chủ để xuất bản");
      return;
    }
    const nextStatus = isPublished ? "draft" : "published";
    setIsPublishing(true);
    try {
      const updated = await weddingApi.update(wedding.id, { status: nextStatus });
      setWedding(updated);
      sessionStorage.setItem("everweb_pending_wedding", JSON.stringify(updated));
      toast.success(
        nextStatus === "published"
          ? "Đã xuất bản Website cưới!"
          : "Đã chuyển Website về chế độ nháp"
      );
    } catch (error) {
      toast.error(extractApiError(error, "Không thể cập nhật trạng thái").message);
    } finally {
      setIsPublishing(false);
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(`preview-sec-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const titleSizeClass =
    fontScale === "lg"
      ? "text-3xl sm:text-4xl"
      : fontScale === "sm"
      ? "text-xl sm:text-2xl"
      : "text-2xl sm:text-3xl";

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F6F3] text-[#2C2117]">
      {/* Sticky Full-Width WithJoy Design Top Bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-[#EAE6DF] bg-white/95 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              navigate(ROUTE_PATHS.EVENT_HUB, { state: { wedding } })
            }
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-[#5E5042] transition hover:bg-[#F3F0EA] hover:text-[#2C2117]"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Trung tâm sự kiện</span>
          </button>
          <span className="hidden h-4 w-px bg-[#E6DFD3] sm:block" />
          <button
            type="button"
            onClick={() => setSidebarOpen((p) => !p)}
            title={sidebarOpen ? "Thu gọn thanh chỉnh sửa" : "Mở thanh chỉnh sửa"}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E2D9CB] bg-white px-3 py-1.5 text-xs font-medium text-[#5E5042] transition hover:border-[#3B52DE]"
          >
            {sidebarOpen ? (
              <PanelLeftClose size={14} />
            ) : (
              <PanelLeftOpen size={14} />
            )}
            <span className="hidden md:inline">
              {sidebarOpen ? "Thu gọn" : "Tuỳ chỉnh"}
            </span>
          </button>
        </div>

        {/* Center Desktop / Mobile Switcher (like WithJoy) */}
        <div className="flex items-center rounded-lg border border-[#E2D9CB] bg-[#FAF8F5] p-0.5">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            aria-label="Xem Desktop"
            className={`rounded-md px-2.5 py-1 ${
              device === "desktop"
                ? "bg-white text-[#3B52DE] shadow-2xs"
                : "text-[#8C7A68]"
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
                : "text-[#8C7A68]"
            }`}
          >
            <Smartphone size={15} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(`https://${publicUrl}`);
              toast.success(`Đã sao chép: ${publicUrl}`);
            }}
            className="hidden items-center gap-1.5 rounded-full border border-[#E2D9CB] bg-white px-3 py-1.5 text-[11px] font-medium text-[#5E5042] hover:border-[#3B52DE] lg:inline-flex"
          >
            <Copy size={11} /> {publicUrl}
          </button>
          <button
            type="button"
            onClick={() =>
              navigate(ROUTE_PATHS.WEBSITE_PREVIEW, { state: { wedding } })
            }
            className="hidden items-center gap-1.5 rounded-full border border-[#E2D9CB] bg-white px-3 py-1.5 text-xs font-medium text-[#2C2117] hover:border-[#3B52DE] sm:inline-flex"
          >
            <ExternalLink size={13} /> Xem trang
          </button>
          <button
            type="button"
            disabled={isPublishing}
            onClick={handleTogglePublish}
            className="rounded-full bg-[#3B52DE] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#2F43C2] disabled:opacity-60"
          >
            {isPublished ? "Ẩn Website" : "Xuất bản Website"}
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.DASHBOARD_DEFAULT)}
            title="Dashboard"
            className="hidden items-center gap-1 rounded-full border border-[#E2D9CB] bg-white p-1.5 text-[#5E5042] hover:border-[#3B52DE] sm:inline-flex"
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      </header>

      {/* Full-Bleed Split Layout: Sticky Sidebar + Full-Height Scrollable Site */}
      <div className="flex flex-1 items-start">
        {/* Left WithJoy Design Sidebar (Exact WithJoy Vertical Menu -> Sub-Panel) */}
        {sidebarOpen && (
          <aside className="sticky top-14 h-[calc(100vh-3.5rem)] w-80 shrink-0 overflow-y-auto border-r border-[#EAE6DF] bg-white">
            {/* Interactive Breadcrumb Header (WithJoy Style) */}
            <div className="border-b border-[#F1ECE3] px-6 py-4">
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#8C7A68]">
                <button
                  type="button"
                  onClick={() => setActiveTab("pages")}
                  className="transition hover:text-[#3B52DE] hover:underline"
                >
                  Website
                </button>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => setActiveTab(null)}
                  className={`transition hover:text-[#3B52DE] hover:underline ${
                    !activeTab ? "font-semibold text-[#2C2117]" : ""
                  }`}
                >
                  Thiết kế
                </button>
                {activeTab && (
                  <>
                    <span>/</span>
                    <span className="font-semibold text-[#2C2117]">
                      {DESIGN_TABS.find((t) => t.key === activeTab)?.label}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Root Menu List (exact WithJoy Design menu) */}
            {!activeTab ? (
              <nav className="ew-fade-in px-4 py-4">
                <ul className="space-y-1">
                  {DESIGN_TABS.map((t) => (
                    <li key={t.key}>
                      <button
                        type="button"
                        onClick={() => setActiveTab(t.key)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-medium text-[#2C2117] transition hover:bg-[#F7F6F3] hover:text-[#3B52DE]"
                      >
                        <span>{t.label}</span>
                        <span className="text-xs text-[#B0A393]">›</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              /* Active Sub-Panel */
              <div className="ew-slide-up border-b border-[#F1ECE3] p-5">
                <button
                  type="button"
                  onClick={() => setActiveTab(null)}
                  className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-[#3B52DE] hover:underline"
                >
                  ‹ Quay lại menu Thiết kế
                </button>
              {activeTab === "color" && (
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-[#2C2117]">
                    Chủ đề màu sắc
                  </h2>
                  <div className="space-y-2">
                    {COLOR_THEMES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => saveSection({ themeId: t.id })}
                        className={`flex w-full items-center justify-between rounded-xl border p-2.5 text-left text-xs transition ${
                          themeId === t.id
                            ? "border-[#3B52DE] bg-[#EEF2FF]/50 font-semibold"
                            : "border-[#E6DFD3] hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className="h-6 w-6 rounded-full border border-black/15"
                            style={{ background: t.outerPattern }}
                          />
                          {t.name}
                        </span>
                        <span
                          className="h-3.5 w-3.5 rounded-full"
                          style={{ backgroundColor: t.accent }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "font" && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#2C2117]">
                      Phông chữ tiêu đề
                    </h2>
                    <div className="mt-3 space-y-2">
                      {FONT_OPTIONS.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => saveSection({ fontId: f.id })}
                          className={`w-full rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                            fontId === f.id
                              ? "border-[#3B52DE] bg-[#EEF2FF]/50 font-semibold text-[#3B52DE]"
                              : "border-[#E6DFD3] text-[#5E5042] hover:bg-[#FAF8F5]"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#5E5042]">
                      Cỡ chữ tiêu đề
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {[
                        { key: "sm", label: "Nhỏ" },
                        { key: "md", label: "Vừa" },
                        { key: "lg", label: "Lớn" },
                      ].map((s) => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => saveSection({ fontScale: s.key })}
                          className={`rounded-lg border py-1.5 text-xs font-semibold ${
                            fontScale === s.key
                              ? "border-[#3B52DE] bg-[#EEF2FF] text-[#3B52DE]"
                              : "border-[#E6DFD3] text-[#5E5042]"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "layout" && (
                <div className="space-y-3">
                  <h2 className="flex items-center gap-1.5 text-sm font-bold text-[#2C2117]">
                    <ImageIcon size={15} className="text-[#3B52DE]" />
                    Ảnh bìa đầu trang
                  </h2>
                  <div className="grid grid-cols-2 gap-2.5">
                    {COVER_IMAGES.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => saveSection({ coverId: img.id })}
                        className={`overflow-hidden rounded-xl border text-left transition ${
                          coverId === img.id
                            ? "border-[#3B52DE] ring-2 ring-[#3B52DE]/20"
                            : "border-[#E6DFD3]"
                        }`}
                      >
                        <img
                          src={img.src}
                          alt={img.label}
                          className="h-16 w-full object-cover"
                        />
                        <p className="truncate px-2 py-1.5 text-[11px] font-medium text-[#2C2117]">
                          {img.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "art" && (
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-[#2C2117]">
                    Hoạ tiết trang trí góc
                  </h2>
                  <div className="space-y-2">
                    {ART_STYLES.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => saveSection({ artId: a.id })}
                        className={`w-full rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                          artId === a.id
                            ? "border-[#3B52DE] bg-[#EEF2FF]/50 font-semibold text-[#3B52DE]"
                            : "border-[#E6DFD3] text-[#5E5042] hover:bg-[#FAF8F5]"
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "linkPreview" && (
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-[#2C2117]">
                    Xem trước khi chia sẻ link
                  </h2>
                  <div className="overflow-hidden rounded-xl border border-[#E6DFD3] bg-[#FAF8F5]">
                    <img
                      src={activeCover.src}
                      alt="Link preview"
                      className="h-32 w-full object-cover"
                    />
                    <div className="p-3">
                      <p className="text-[10px] text-[#8C7A68] uppercase">
                        everwed.vn
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-[#2C2117]">
                        {linkPreviewTitle || coupleName}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#6D5B4B]">
                        {displayDate} · {displayVenue}
                      </p>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={linkPreviewTitle}
                    onChange={(e) =>
                      saveSection({ linkPreviewTitle: e.target.value })
                    }
                    placeholder="Tuỳ chỉnh tiêu đề khi gửi Zalo/FB..."
                    className="w-full rounded-xl border border-[#E2D9CB] px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
                  />
                </div>
              )}

              {activeTab === "css" && (
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-[#2C2117]">
                    Tuỳ chỉnh CSS (Nâng cao)
                  </h2>
                  <textarea
                    rows={6}
                    value={customCss}
                    onChange={(e) => saveSection({ customCss: e.target.value })}
                    placeholder="/* Ví dụ: #preview-sec-welcome h3 { letter-spacing: 2px; } */"
                    className="w-full rounded-xl border border-[#E2D9CB] bg-[#FAF8F5] p-3 font-mono text-[11px] outline-none focus:border-[#3B52DE]"
                  />
                </div>
              )}

              {activeTab === "pages" && (
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-[#2C2117]">
                      Các mục trên Website
                    </h2>
                    <span className="text-xs text-[#8C7A68]">
                      {pages.filter((p) => p.visible).length}/{pages.length} bật
                    </span>
                  </div>
                  <div className="mt-3 divide-y divide-[#F1ECE3]">
                    {pages.map((p) => (
                      <div
                        key={p.key}
                        className="flex items-center justify-between py-2 text-xs"
                      >
                        <span
                          className={
                            p.visible
                              ? "font-medium text-[#2C2117]"
                              : "text-[#9C8B7A] line-through"
                          }
                        >
                          {p.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePage(p.key)}
                          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium ${
                            p.visible
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {p.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                          {p.visible ? "Hiện" : "Ẩn"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Checklist Section (Flat Footer Block) */}
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold tracking-wide text-[#2C2117] uppercase">
                  Hoàn thiện Website
                </h2>
                <span className="text-xs font-semibold text-[#3B52DE] tabular-nums">
                  {doneSteps.length}/{CHECKLIST.length}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#EFEAE1]">
                <div
                  className="h-full rounded-full bg-[#3B52DE] transition-all"
                  style={{
                    width: `${(doneSteps.length / CHECKLIST.length) * 100}%`,
                  }}
                />
              </div>
              <ul className="mt-3 space-y-2">
                {CHECKLIST.map((step, idx) => {
                  const done = doneSteps.includes(idx);
                  return (
                    <li key={step}>
                      <button
                        type="button"
                        onClick={() => toggleChecklist(idx)}
                        className="flex w-full items-center gap-2 text-left text-xs"
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            done
                              ? "border-[#3B52DE] bg-[#3B52DE] text-white"
                              : "border-[#C9BFB0]"
                          }`}
                        >
                          {done && <Check size={10} />}
                        </span>
                        <span
                          className={
                            done
                              ? "text-[#8C7A68] line-through"
                              : "text-[#2C2117]"
                          }
                        >
                          {step}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        )}

        {/* Right Full-Page Scrollable Live Website Preview (Edge-to-Edge like WithJoy) */}
        <section className="min-w-0 flex-1">
          <div
            className="relative min-h-[calc(100vh-3.5rem)] w-full px-4 sm:px-8"
            style={{
              background: activeTheme.outerPattern,
            }}
          >
              {/* Decorative Corner Artwork (matching WithJoy Lace/Floral corners) */}
              {artId !== "none" && (
                <>
                  <svg
                    viewBox="0 0 140 140"
                    className="pointer-events-none sticky top-0 float-left -ml-6 h-28 w-28 opacity-80"
                    fill="none"
                  >
                    <path
                      d="M0 0 C50 10, 90 50, 120 0 M0 0 C10 50, 50 90, 0 120 M15 15 C45 35, 65 55, 95 25"
                      stroke={artId === "gold" ? "#E5C687" : "#FFFFFF"}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="14"
                      stroke={artId === "gold" ? "#E5C687" : "#FFFFFF"}
                      strokeWidth="1.2"
                    />
                  </svg>
                  <svg
                    viewBox="0 0 140 140"
                    className="pointer-events-none sticky top-0 float-right -mr-6 h-28 w-28 scale-x-[-1] opacity-80"
                    fill="none"
                  >
                    <path
                      d="M0 0 C50 10, 90 50, 120 0 M0 0 C10 50, 50 90, 0 120 M15 15 C45 35, 65 55, 95 25"
                      stroke={artId === "gold" ? "#E5C687" : "#FFFFFF"}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="14"
                      stroke={artId === "gold" ? "#E5C687" : "#FFFFFF"}
                      strokeWidth="1.2"
                    />
                  </svg>
                </>
              )}

              {/* Centered Wedding Website Column */}
              {customCss && <style>{customCss}</style>}
              <div
                className={`mx-auto min-h-full shadow-2xl transition-all duration-300 ${
                  device === "mobile" ? "max-w-[375px]" : "max-w-[740px]"
                } ${activeFont.className}`}
                style={{
                  backgroundColor: activeTheme.bg,
                  color: activeTheme.text,
                }}
              >
                {/* Sticky Mini Nav inside Preview */}
                <nav className="sticky top-0 z-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-black/10 bg-white/80 px-3 py-2.5 text-[10px] font-medium backdrop-blur-sm">
                  {pages
                    .filter((p) => p.visible)
                    .map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => scrollToSection(p.key)}
                        className="transition hover:underline"
                        style={{ color: activeTheme.text }}
                      >
                        {p.label}
                      </button>
                    ))}
                </nav>

                {/* 1. Hero / Welcome */}
                {isPageVisible("welcome") && (
                  <div id="preview-sec-welcome">
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <img
                        src={activeCover.src}
                        alt="Ảnh bìa đám cưới"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                    <div className="px-6 py-8 text-center">
                      <p className="text-[10px] tracking-[0.25em] uppercase opacity-70">
                        Trân trọng báo tin lễ thành hôn
                      </p>
                      <h3 className={`mt-2 font-semibold ${titleSizeClass}`}>
                        {coupleName}
                      </h3>
                      <p className="mt-2 text-xs opacity-80">
                        {displayDate} · {displayVenue}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1 text-[11px] font-semibold">
                        <Heart
                          size={12}
                          style={{ color: activeTheme.accent }}
                        />
                        Cùng đếm ngược tới ngày chung đôi
                      </div>
                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(ROUTE_PATHS.RSVP_BUILDER, {
                              state: { wedding },
                            })
                          }
                          className="rounded-full px-6 py-2 text-xs font-semibold text-white shadow-sm"
                          style={{ backgroundColor: activeTheme.accent }}
                        >
                          Xác nhận tham dự (RSVP)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Our Story */}
                {isPageVisible("story") && (
                  <div
                    id="preview-sec-story"
                    className="border-t border-black/10 px-6 py-8 text-center"
                  >
                    <h4 className="text-xl font-semibold">Chuyện tình yêu</h4>
                    <p className="mt-3 text-xs leading-relaxed opacity-85">
                      Từ những buổi chiều cà phê tình cờ đến lời hẹn ước trăm năm,
                      tụi mình rất hạnh phúc được chia sẻ khoảnh khắc đặc biệt này
                      cùng gia đình và những người bạn thân thương nhất.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-left">
                      <div className="rounded-xl bg-white/70 p-3">
                        <p className="text-[10px] font-bold uppercase opacity-60">
                          Lần đầu gặp gỡ
                        </p>
                        <p className="mt-1 text-xs">
                          Một ngày mưa nhẹ ở Sài Gòn cùng câu chào làm quen.
                        </p>
                      </div>
                      <div className="rounded-xl bg-white/70 p-3">
                        <p className="text-[10px] font-bold uppercase opacity-60">
                          Lời cầu hôn
                        </p>
                        <p className="mt-1 text-xs">
                          Dưới ánh hoàng hôn Đà Lạt với nhẫn và hoa hồng trắng.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Schedule (matching WithJoy Schedule timeline!) */}
                {isPageVisible("schedule") && (
                  <div
                    id="preview-sec-schedule"
                    className="border-t border-black/10 px-6 py-8"
                  >
                    <h4 className="text-center text-xl font-semibold">
                      Lịch trình ngày cưới
                    </h4>
                    <p className="mt-4 text-[10px] font-bold tracking-widest uppercase opacity-65">
                      Ngày {displayDate}
                    </p>
                    <div className="mt-3 space-y-4 border-l border-black/15 pl-4">
                      {[
                        {
                          time: "17:30 - 18:30",
                          name: "Đón khách & Chụp ảnh lưu niệm",
                          desc: "Check-in tại sảnh hoa, thưởng thức tiệc nhẹ và lưu giữ khoảnh khắc cùng cô dâu chú rể.",
                        },
                        {
                          time: "18:30 - 19:15",
                          name: "Nghi thức Lễ Thành Hôn",
                          desc: "Khoảnh khắc trao nhẫn, cắt bánh kem và nâng ly chúc mừng.",
                        },
                        {
                          time: "19:15 - 21:30",
                          name: "Tiệc tối & Giao lưu âm nhạc",
                          desc: "Thưởng thức thực đơn đặc biệt cùng ban nhạc acoustic và mini game.",
                        },
                      ].map((ev) => (
                        <div key={ev.name} className="relative">
                          <span
                            className="absolute top-1.5 -left-[21px] h-2.5 w-2.5 rounded-full border-2 border-white"
                            style={{ backgroundColor: activeTheme.accent }}
                          />
                          <p className="text-[10px] font-semibold opacity-65">
                            {ev.time}
                          </p>
                          <p className="text-sm font-bold">{ev.name}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] opacity-75">
                            <MapPin size={10} /> {displayVenue}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed opacity-80">
                            {ev.desc}
                          </p>
                          <p className="mt-1.5 flex items-center gap-2 text-[10px] font-semibold tracking-wider uppercase opacity-70">
                            <Calendar size={10} /> Thêm vào lịch · Chỉ đường
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Where to Stay */}
                {isPageVisible("stay") && (
                  <div
                    id="preview-sec-stay"
                    className="border-t border-black/10 px-6 py-8"
                  >
                    <h4 className="text-center text-xl font-semibold">
                      Nơi lưu trú gợi ý
                    </h4>
                    <div className="mt-4 space-y-2.5">
                      {[
                        { name: "Lotte Hotel Saigon", dist: "Cách sảnh 0.8 km" },
                        { name: "Fusion Original Saigon", dist: "Cách sảnh 1.4 km" },
                      ].map((h) => (
                        <div
                          key={h.name}
                          className="flex items-center justify-between rounded-xl bg-white/80 p-3 text-xs"
                        >
                          <div>
                            <p className="font-bold">{h.name}</p>
                            <p className="text-[11px] opacity-70">{h.dist}</p>
                          </div>
                          <span
                            className="rounded-full px-3 py-1 text-[10px] font-semibold text-white"
                            style={{ backgroundColor: activeTheme.accent }}
                          >
                            Đặt phòng
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Wedding Party */}
                {isPageVisible("party") && (
                  <div
                    id="preview-sec-party"
                    className="border-t border-black/10 px-6 py-8 text-center"
                  >
                    <h4 className="text-xl font-semibold">Phù dâu & Phù rể</h4>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        { name: "Minh Thư", role: "Phù dâu chính" },
                        { name: "Hoàng Nam", role: "Phù rể chính" },
                      ].map((m) => (
                        <div key={m.name} className="rounded-xl bg-white/75 p-3">
                          <div
                            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: activeTheme.accent }}
                          >
                            {m.name.slice(0, 2)}
                          </div>
                          <p className="mt-2 text-xs font-bold">{m.name}</p>
                          <p className="text-[10px] opacity-70">{m.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Q&A */}
                {isPageVisible("qa") && (
                  <div
                    id="preview-sec-qa"
                    className="border-t border-black/10 px-6 py-8"
                  >
                    <h4 className="text-center text-xl font-semibold">
                      Hỏi đáp (Q&A)
                    </h4>
                    <div className="mt-4 space-y-2.5 text-xs">
                      <div className="rounded-xl bg-white/75 p-3">
                        <p className="font-bold">Trang phục tham dự (Dresscode)?</p>
                        <p className="mt-1 opacity-80">
                          Lịch sự, ưu tiên tông trắng, be, nâu hoặc pastel nhẹ.
                        </p>
                      </div>
                      <div className="rounded-xl bg-white/75 p-3">
                        <p className="font-bold">Có chỗ gửi xe ô tô & xe máy không?</p>
                        <p className="mt-1 opacity-80">
                          Sảnh tiệc có hầm gửi xe miễn phí cho toàn bộ khách mời.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Registry */}
                {isPageVisible("registry") && (
                  <div
                    id="preview-sec-registry"
                    className="border-t border-black/10 px-6 py-8 text-center"
                  >
                    <h4 className="text-xl font-semibold">Quà mừng</h4>
                    <p className="mt-2 text-xs opacity-80">
                      Sự hiện diện của bạn là món quà quý giá nhất đối với tụi mình.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(ROUTE_PATHS.REGISTRY, { state: { wedding } })
                      }
                      className="mt-4 rounded-full border px-5 py-1.5 text-xs font-semibold"
                      style={{
                        borderColor: activeTheme.accent,
                        color: activeTheme.accent,
                      }}
                    >
                      Xem danh sách Quà mừng
                    </button>
                  </div>
                )}

                {/* 8. Gallery */}
                {isPageVisible("gallery") && (
                  <div
                    id="preview-sec-gallery"
                    className="border-t border-black/10 px-6 py-8"
                  >
                    <h4 className="text-center text-xl font-semibold">
                      Album ảnh cưới
                    </h4>
                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      {COVER_IMAGES.map((img) => (
                        <img
                          key={img.id}
                          src={img.src}
                          alt={img.label}
                          className="aspect-square w-full rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <footer className="border-t border-black/10 py-8 text-center text-[10px] opacity-65">
                  Được tạo với tất cả yêu thương trên EverWed
                </footer>
              </div>
          </div>
        </section>
      </div>
    </div>
  );
}
