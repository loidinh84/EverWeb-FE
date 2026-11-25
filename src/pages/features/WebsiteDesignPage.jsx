import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Heart,
  Image as ImageIcon,
  Layout,
  MapPin,
  Monitor,
  Palette,
  PanelLeft,
  Plus,
  RotateCcw,
  Smartphone,
  Sparkles,
  Trash2,
  Type,
  Upload,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import weddingApi from "../../services/weddingApi";
import { extractApiError } from "../../services/api";
import everwebLogo from "../../assets/image/everweb-logo.jpg";
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
    accent: "#5D4532",
    text: "#2C2117",
  },
  {
    id: "cobalt",
    name: "Xanh Hiện Đại",
    outerBg: "#E6EBF7",
    outerPattern: "linear-gradient(135deg, #E8EDFA 0%, #DCE3F5 100%)",
    bg: "#FAF8F5",
    accent: "#3B52DE",
    text: "#2C2117",
  },
  {
    id: "champagne",
    name: "Vàng Champagne",
    outerBg: "#EFE6D8",
    outerPattern: "linear-gradient(135deg, #F2EAE0 0%, #E7DBC9 100%)",
    bg: "#FAF6F0",
    accent: "#B88E44",
    text: "#3B2A1A",
  },
  {
    id: "sage",
    name: "Xanh Olive",
    outerBg: "#DDE4DA",
    outerPattern: "linear-gradient(135deg, #E2E8DF 0%, #CFD9CB 100%)",
    bg: "#F4F6F2",
    accent: "#5F7161",
    text: "#243025",
  },
  {
    id: "rose",
    name: "Hồng Phấn",
    outerBg: "#F5E2E5",
    outerPattern: "linear-gradient(135deg, #F8E8EB 0%, #EED5DA 100%)",
    bg: "#FDF6F6",
    accent: "#B85D6E",
    text: "#3B2127",
  },
];

const FONT_OPTIONS = [
  { id: "cormorant", label: "Cormorant Garamond", style: '"Cormorant Garamond", Georgia, serif', tag: "Cổ điển" },
  { id: "playfair", label: "Playfair Display", style: '"Playfair Display", Georgia, serif', tag: "Sang trọng" },
  { id: "lora", label: "Lora", style: '"Lora", Georgia, serif', tag: "Thanh lịch" },
  { id: "merriweather", label: "Merriweather", style: '"Merriweather", Georgia, serif', tag: "Trang trọng" },
  { id: "vietnam", label: "Be Vietnam Pro", style: '"Be Vietnam Pro", sans-serif', tag: "Hiện đại" },
  { id: "montserrat", label: "Montserrat", style: '"Montserrat", sans-serif', tag: "Tối giản" },
  { id: "dancing", label: "Dancing Script", style: '"Dancing Script", cursive', tag: "Chữ ký" },
];

const COVER_IMAGES = [
  { id: "hero", label: "Sảnh tiệc hoa", src: heroWedding },
  { id: "ceremony", label: "Cổng hoa ngoài trời", src: galleryCeremony },
  { id: "bouquet", label: "Hoa cưới cầm tay", src: galleryBouquet },
  { id: "dining", label: "Bàn tiệc tối", src: galleryDining },
];

const ART_STYLES = [
  { id: "lace", label: "Hoa ren góc cổ điển" },
  { id: "botanical", label: "Lá Botanical mềm mại" },
  { id: "deco", label: "Khung Art Deco" },
  { id: "minimal", label: "Viền tối giản" },
  { id: "none", label: "Không hoạ tiết" },
];

const ART_COLORS = ["#FFFFFF", "#E5C687", "#3B52DE", "#5D4532"];

const CSS_SNIPPETS = [
  {
    label: "Bo tròn ảnh Album",
    code: "#everweb-site-preview img { border-radius: 20px; }",
  },
  {
    label: "Nút RSVP đổ bóng nổi",
    code: "#everweb-site-preview .rsvp-cta-btn { box-shadow: 0 10px 25px rgba(59,82,222,0.35); transform: scale(1.04); }",
  },
  {
    label: "Tiêu đề giãn cách rộng",
    code: "#everweb-site-preview h3, #everweb-site-preview h4 { letter-spacing: 0.08em; }",
  },
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

function CornerArtwork({ artId, color, opacity, flip = false }) {
  if (artId === "none") return null;
  return (
    <svg
      viewBox="0 0 140 140"
      className={`pointer-events-none sticky top-0 h-28 w-28 ${
        flip ? "float-right -mr-6 scale-x-[-1]" : "float-left -ml-6"
      }`}
      style={{ opacity: opacity / 100 }}
      fill="none"
    >
      {artId === "lace" && (
        <>
          <path
            d="M0 0 C50 10, 90 50, 120 0 M0 0 C10 50, 50 90, 0 120 M15 15 C45 35, 65 55, 95 25"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <circle cx="32" cy="32" r="14" stroke={color} strokeWidth="1.2" />
        </>
      )}
      {artId === "botanical" && (
        <>
          <path d="M5 5 Q55 15 95 65" stroke={color} strokeWidth="1.4" />
          <path
            d="M25 14 C35 2, 48 6, 42 20 M50 30 C65 18, 76 26, 66 40 M72 48 C88 40, 96 52, 82 62"
            stroke={color}
            strokeWidth="1.2"
          />
        </>
      )}
      {artId === "deco" && (
        <>
          <path d="M8 8 H115 M8 8 V115" stroke={color} strokeWidth="1.6" />
          <path d="M20 20 H80 V36 H36 V80 H20 Z" stroke={color} strokeWidth="1.1" />
        </>
      )}
      {artId === "minimal" && (
        <path d="M12 12 H90 M12 12 V90" stroke={color} strokeWidth="1.2" />
      )}
    </svg>
  );
}

export default function WebsiteDesignPage({ previewOnly = false }) {
  const toast = useToast();
  const navigate = useNavigate();
  const { wedding, setWedding } = useCurrentWedding();

  const { data: webConfig, saveSection } = useWeddingFeature(
    wedding,
    "website_config",
    {
      themeId: "woodgrain",
      colorMode: "light",
      customColors: null,
      layoutMode: "scroll",
      titlePosition: "below",
      overlayOpacity: 20,
      fontId: "cormorant",
      fontScale: "md",
      letterSpacing: "normal",
      coverId: "ceremony",
      customCoverUrl: "",
      artId: "lace",
      artColor: "#FFFFFF",
      artOpacity: 80,
      storyText:
        "Từ những buổi chiều cà phê tình cờ đến lời hẹn ước trăm năm, tụi mình rất hạnh phúc được chia sẻ khoảnh khắc đặc biệt này cùng gia đình và những người bạn thân thương nhất.",
      pages: INITIAL_PAGES,
      doneSteps: [0, 1],
    }
  );

  const themeId = webConfig.themeId || "woodgrain";
  const colorMode = webConfig.colorMode || "light";
  const customColors = webConfig.customColors || null;
  const layoutMode = webConfig.layoutMode || "scroll";
  const titlePosition = webConfig.titlePosition || "below";
  const overlayOpacity = webConfig.overlayOpacity ?? 20;
  const fontId = webConfig.fontId || "cormorant";
  const fontScale = webConfig.fontScale || "md";
  const letterSpacing = webConfig.letterSpacing || "normal";
  const coverId = webConfig.coverId || "ceremony";
  const customCoverUrl = webConfig.customCoverUrl || "";
  const artId = webConfig.artId || "lace";
  const artColor = webConfig.artColor || "#FFFFFF";
  const artOpacity = webConfig.artOpacity ?? 80;
  const storyText =
    webConfig.storyText ||
    "Từ những buổi chiều cà phê tình cờ đến lời hẹn ước trăm năm, tụi mình rất hạnh phúc được chia sẻ khoảnh khắc đặc biệt này cùng gia đình và những người bạn thân thương nhất.";
  const pages = webConfig.pages || INITIAL_PAGES;
  const doneSteps = webConfig.doneSteps || [0, 1];
  const customCss = webConfig.customCss || "";
  const linkPreviewTitle = webConfig.linkPreviewTitle || "";
  const linkPreviewDesc = webConfig.linkPreviewDesc || "";
  const linkPreviewImage = webConfig.linkPreviewImage || "";

  const [activeTab, setActiveTab] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [device, setDevice] = useState("desktop");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageContent, setNewPageContent] = useState("");
  const [editingPageKey, setEditingPageKey] = useState(null);

  const baseTheme =
    COLOR_THEMES.find((t) => t.id === themeId) || COLOR_THEMES[0];
  const activeBg =
    colorMode === "dark"
      ? "#1F1A17"
      : customColors?.bg || baseTheme.bg;
  const activeText = colorMode === "dark" ? "#FAF8F5" : baseTheme.text;
  const activeAccent = customColors?.accent || baseTheme.accent;
  const activeOuterBg = customColors?.outerBg
    ? customColors.outerBg
    : baseTheme.outerPattern;

  const activeFont =
    FONT_OPTIONS.find((f) => f.id === fontId) || FONT_OPTIONS[0];
  const presetCover =
    COVER_IMAGES.find((c) => c.id === coverId) || COVER_IMAGES[1];
  const coverSrc = customCoverUrl || presetCover.src;

  const coupleName = (
    wedding?.title || "Trần Thanh Khang & Trần Ngọc An"
  ).normalize("NFC");
  const displayDate = wedding?.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("vi-VN")
    : "23/08/2027";
  const displayVenue = (
    wedding?.venue_name || "Sảnh Hoa Mai - TP. Hồ Chí Minh"
  ).normalize("NFC");
  const publicUrl = `${window.location.origin}${ROUTE_PATHS.WEBSITE_PREVIEW}`;
  const isPublished =
    wedding?.status === "published" || wedding?.status === "active";

  const handleImageUpload = (file, fieldName) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        saveSection({ [fieldName]: reader.result });
        toast.success("Đã cập nhật ảnh mới");
      }
    };
    reader.readAsDataURL(file);
  };

  const togglePage = (key) => {
    saveSection((prev) => ({
      ...prev,
      pages: (prev.pages || INITIAL_PAGES).map((p) =>
        (p.key || p.id) === key ? { ...p, visible: !p.visible } : p
      ),
    }));
  };

  const movePage = (index, dir) => {
    const nextIdx = index + dir;
    if (nextIdx < 0 || nextIdx >= pages.length) return;
    const copy = [...pages];
    const [moved] = copy.splice(index, 1);
    copy.splice(nextIdx, 0, moved);
    saveSection({ pages: copy });
  };

  const handleAddCustomPage = (e) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;
    const newPage = {
      key: `custom-${pages.length + 1}-${newPageTitle.trim().length}`,
      label: newPageTitle.trim(),
      content:
        newPageContent.trim() ||
        "Nội dung đang được cô dâu & chú rể cập nhật.",
      visible: true,
      isCustom: true,
    };
    saveSection((prev) => ({
      ...prev,
      pages: [...(prev.pages || INITIAL_PAGES), newPage],
    }));
    toast.success(`Đã thêm trang "${newPage.label}" & lưu Neon DB`);
    setNewPageTitle("");
    setNewPageContent("");
    setIsAddPageOpen(false);
    setTimeout(() => scrollToSection(newPage.key), 150);
  };

  const handleDeleteCustomPage = (key) => {
    saveSection((prev) => ({
      ...prev,
      pages: (prev.pages || INITIAL_PAGES).filter(
        (p) => (p.key || p.id) !== key
      ),
    }));
    if (editingPageKey === key) setEditingPageKey(null);
    toast.info("Đã xoá trang tuỳ chỉnh");
  };

  const handleUpdatePage = (key, patch) => {
    saveSection((prev) => ({
      ...prev,
      pages: (prev.pages || INITIAL_PAGES).map((p) =>
        (p.key || p.id) === key ? { ...p, ...patch } : p
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
    const nextStatus = isPublished ? "draft" : "active";
    setIsPublishing(true);
    try {
      const updated = await weddingApi.update(wedding.id, { status: nextStatus });
      setWedding(updated);
      sessionStorage.setItem("everweb_pending_wedding", JSON.stringify(updated));
      toast.success(
        nextStatus === "active"
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

  const trackingClass =
    letterSpacing === "wide"
      ? "tracking-widest"
      : letterSpacing === "tight"
      ? "tracking-tight"
      : "tracking-normal";

  const renderPageSection = (p) => {
    if (!p.visible) return null;
    const pageKey = p.key || p.id;

    if (p.isCustom) {
      return (
        <div
          key={pageKey}
          id={`preview-sec-${pageKey}`}
          className="border-t border-black/10 px-6 py-10 text-center"
        >
          <h4 className={`text-xl font-semibold ${trackingClass}`}>{p.label}</h4>
          <p className="mt-3 whitespace-pre-line text-xs leading-relaxed opacity-80">
            {p.content || "Sắp ra mắt · Nội dung đang được cập nhật."}
          </p>
        </div>
      );
    }

    switch (pageKey) {
      case "welcome":
        return (
          <div key={pageKey} id="preview-sec-welcome">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img
                src={coverSrc}
                alt="Ảnh bìa đám cưới"
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})` }}
              />
              {titlePosition === "overlay" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                  <p className="text-[10px] tracking-[0.25em] uppercase opacity-90">
                    Trân trọng báo tin lễ thành hôn
                  </p>
                  <h3 className={`mt-2 font-semibold ${titleSizeClass} ${trackingClass}`}>
                    {coupleName}
                  </h3>
                  <p className="mt-1 text-xs opacity-90">
                    {displayDate} · {displayVenue}
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 py-8 text-center">
              {titlePosition !== "overlay" && (
                <>
                  <p className="text-[10px] tracking-[0.25em] uppercase opacity-70">
                    Trân trọng báo tin lễ thành hôn
                  </p>
                  <h3 className={`mt-2 font-semibold ${titleSizeClass} ${trackingClass}`}>
                    {coupleName}
                  </h3>
                  <p className="mt-2 text-xs opacity-80">
                    {displayDate} · {displayVenue}
                  </p>
                </>
              )}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1 text-[11px] font-semibold text-[#1F1A17]">
                <Heart size={12} style={{ color: activeAccent }} />
                Cùng đếm ngược tới ngày chung đôi
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() =>
                    navigate(ROUTE_PATHS.RSVP_BUILDER, { state: { wedding } })
                  }
                  className="rsvp-cta-btn rounded-full px-6 py-2 text-xs font-semibold text-white shadow-sm transition"
                  style={{ backgroundColor: activeAccent }}
                >
                  Xác nhận tham dự (RSVP)
                </button>
              </div>
            </div>
          </div>
        );

      case "story":
        return (
          <div
            key={p.key}
            id="preview-sec-story"
            className="border-t border-black/10 px-6 py-8 text-center"
          >
            <h4 className={`text-xl font-semibold ${trackingClass}`}>
              {p.label}
            </h4>
            <p className="mt-3 text-xs leading-relaxed opacity-85">
              {storyText}
            </p>
          </div>
        );

      case "schedule":
        return (
          <div
            key={p.key}
            id="preview-sec-schedule"
            className="border-t border-black/10 px-6 py-8"
          >
            <h4 className={`text-center text-xl font-semibold ${trackingClass}`}>
              {p.label}
            </h4>
            <p className="mt-4 text-[10px] font-bold tracking-widest uppercase opacity-65">
              Ngày {displayDate}
            </p>
            <div className="mt-3 space-y-4 border-l border-current/20 pl-4">
              {[
                { time: "17:30 - 18:30", name: "Đón khách & Chụp ảnh lưu niệm" },
                { time: "18:30 - 19:15", name: "Nghi thức Lễ Thành Hôn" },
                { time: "19:15 - 21:30", name: "Tiệc tối & Giao lưu âm nhạc" },
              ].map((ev) => (
                <div key={ev.name} className="relative">
                  <span
                    className="absolute top-1.5 -left-[21px] h-2.5 w-2.5 rounded-full border-2 border-white"
                    style={{ backgroundColor: activeAccent }}
                  />
                  <p className="text-[10px] font-semibold opacity-65">{ev.time}</p>
                  <p className="text-sm font-bold">{ev.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] opacity-75">
                    <MapPin size={10} /> {displayVenue}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-[10px] font-semibold uppercase opacity-70">
                    <Calendar size={10} /> Thêm vào lịch · Chỉ đường
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "stay":
        return (
          <div
            key={p.key}
            id="preview-sec-stay"
            className="border-t border-black/10 px-6 py-8"
          >
            <h4 className={`text-center text-xl font-semibold ${trackingClass}`}>
              {p.label}
            </h4>
            <div className="mt-4 space-y-2.5 text-[#1F1A17]">
              {[
                { name: "Lotte Hotel Saigon", dist: "Cách sảnh 0.8 km" },
                { name: "Fusion Original Saigon", dist: "Cách sảnh 1.4 km" },
              ].map((h) => (
                <div
                  key={h.name}
                  className="flex items-center justify-between rounded-xl bg-white/85 p-3 text-xs"
                >
                  <div>
                    <p className="font-bold">{h.name}</p>
                    <p className="text-[11px] opacity-70">{h.dist}</p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-semibold text-white"
                    style={{ backgroundColor: activeAccent }}
                  >
                    Đặt phòng
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "party":
        return (
          <div
            key={p.key}
            id="preview-sec-party"
            className="border-t border-black/10 px-6 py-8 text-center"
          >
            <h4 className={`text-xl font-semibold ${trackingClass}`}>
              {p.label}
            </h4>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[#1F1A17]">
              {[
                { name: "Minh Thư", role: "Phù dâu chính" },
                { name: "Hoàng Nam", role: "Phù rể chính" },
              ].map((m) => (
                <div key={m.name} className="rounded-xl bg-white/85 p-3">
                  <div
                    className="mx-auto flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: activeAccent }}
                  >
                    {m.name.slice(0, 2)}
                  </div>
                  <p className="mt-2 text-xs font-bold">{m.name}</p>
                  <p className="text-[10px] opacity-70">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "qa":
        return (
          <div
            key={p.key}
            id="preview-sec-qa"
            className="border-t border-black/10 px-6 py-8"
          >
            <h4 className={`text-center text-xl font-semibold ${trackingClass}`}>
              {p.label}
            </h4>
            <div className="mt-4 space-y-2.5 text-xs text-[#1F1A17]">
              <div className="rounded-xl bg-white/85 p-3">
                <p className="font-bold">Trang phục tham dự (Dresscode)?</p>
                <p className="mt-1 opacity-80">
                  Lịch sự, ưu tiên tông trắng, be, nâu hoặc pastel nhẹ.
                </p>
              </div>
              <div className="rounded-xl bg-white/85 p-3">
                <p className="font-bold">Có chỗ gửi xe ô tô & xe máy không?</p>
                <p className="mt-1 opacity-80">
                  Sảnh tiệc có hầm gửi xe miễn phí cho toàn bộ khách mời.
                </p>
              </div>
            </div>
          </div>
        );

      case "registry":
        return (
          <div
            key={p.key}
            id="preview-sec-registry"
            className="border-t border-black/10 px-6 py-8 text-center"
          >
            <h4 className={`text-xl font-semibold ${trackingClass}`}>
              {p.label}
            </h4>
            <p className="mt-2 text-xs opacity-80">
              Sự hiện diện của bạn là món quà quý giá nhất đối với tụi mình.
            </p>
            <button
              type="button"
              onClick={() =>
                navigate(ROUTE_PATHS.REGISTRY, { state: { wedding } })
              }
              className="mt-4 rounded-full border px-5 py-1.5 text-xs font-semibold"
              style={{ borderColor: activeAccent, color: activeAccent }}
            >
              Xem danh sách Quà mừng
            </button>
          </div>
        );

      case "gallery":
        return (
          <div
            key={pageKey}
            id="preview-sec-gallery"
            className="border-t border-black/10 px-6 py-8"
          >
            <h4 className={`text-center text-xl font-semibold ${trackingClass}`}>
              {p.label}
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
        );

      case "travel":
        return (
          <div
            key={pageKey}
            id="preview-sec-travel"
            className="border-t border-black/10 px-6 py-8 text-center"
          >
            <h4 className={`text-xl font-semibold ${trackingClass}`}>
              {p.label}
            </h4>
            <p className="mt-3 text-xs leading-relaxed opacity-80">
              Sảnh tiệc cách trung tâm Quận 1 khoảng 15 phút di chuyển và có bãi
              đỗ xe ô tô miễn phí cho toàn bộ khách mời.
            </p>
          </div>
        );

      case "dresscode":
        return (
          <div
            key={pageKey}
            id="preview-sec-dresscode"
            className="border-t border-black/10 px-6 py-8 text-center"
          >
            <h4 className={`text-xl font-semibold ${trackingClass}`}>
              {p.label}
            </h4>
            <p className="mt-3 text-xs opacity-80">
              Trang phục lịch sự, ưu tiên tông trắng, kem, be hoặc pastel nhẹ.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F6F3] text-[#1F1A17]">
      {/* Sticky Top Bar */}
      {!previewOnly && (
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-stone-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(ROUTE_PATHS.EVENT_HUB, { state: { wedding } })
            }
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-[#1F1A17]"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Trung tâm sự kiện</span>
          </button>
          <span className="hidden h-4 w-px bg-stone-200 sm:block" />
          <button
            type="button"
            onClick={() => setSidebarOpen((p) => !p)}
            title={sidebarOpen ? "Thu gọn thanh bên" : "Mở thanh bên"}
            className="cursor-pointer text-stone-700 transition hover:text-black"
          >
            <PanelLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            title="Quay lại trang trước"
            className="flex cursor-pointer items-center gap-2 transition hover:opacity-80"
          >
            <img
              src={everwebLogo}
              alt="EverWeb Logo"
              className="h-7 w-7 rounded-lg object-cover shadow-2xs"
            />
            <span className="font-display text-lg font-bold italic text-[#1F1A17]">
              EverWeb
            </span>
          </button>
        </div>

        {/* Center Desktop / Mobile Switcher */}
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(publicUrl);
              toast.success(`Đã sao chép: ${publicUrl}`);
            }}
            className="hidden items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-medium text-stone-600 hover:border-[#3B52DE] lg:inline-flex"
          >
            <Copy size={11} /> {publicUrl}
          </button>
          <button
            type="button"
            onClick={() =>
              navigate(ROUTE_PATHS.WEBSITE_PREVIEW, { state: { wedding } })
            }
            className="hidden items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-[#1F1A17] hover:border-[#3B52DE] sm:inline-flex"
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
        </div>
      </header>
      )}

      <div className="flex flex-1 items-start">
        {/* Left WithJoy Design Sidebar */}
        {!previewOnly && sidebarOpen && (
          <aside className="sticky top-14 h-[calc(100vh-3.5rem)] w-84 shrink-0 overflow-y-auto border-r border-stone-200 bg-white">
            {/* Breadcrumb */}
            <div className="border-b border-stone-100 px-6 py-4">
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-stone-500">
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
                    !activeTab ? "font-semibold text-[#1F1A17]" : ""
                  }`}
                >
                  Thiết kế
                </button>
                {activeTab && (
                  <>
                    <span>/</span>
                    <span className="font-semibold text-[#1F1A17]">
                      {DESIGN_TABS.find((t) => t.key === activeTab)?.label}
                    </span>
                  </>
                )}
              </div>
            </div>

            {!activeTab ? (
              <nav className="ew-fade-in px-4 py-4">
                <ul className="space-y-1">
                  {DESIGN_TABS.map((t) => (
                    <li key={t.key}>
                      <button
                        type="button"
                        onClick={() => setActiveTab(t.key)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-medium text-[#1F1A17] transition hover:bg-stone-50 hover:text-[#3B52DE]"
                      >
                        <span>{t.label}</span>
                        <span className="text-xs text-stone-400">›</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              <div className="ew-slide-up border-b border-stone-100 p-5">
                <button
                  type="button"
                  onClick={() => setActiveTab(null)}
                  className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-[#3B52DE] hover:underline"
                >
                  ‹ Quay lại menu Thiết kế
                </button>

                {/* 1. LAYOUT & COVER */}
                {activeTab === "layout" && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-[#1F1A17]">
                        Kiểu bố cục Website
                      </p>
                      <div className="mt-2 grid grid-cols-3 gap-1.5 text-[11px] font-semibold">
                        {[
                          { key: "scroll", label: "Cuộn 1 trang" },
                          { key: "split", label: "Chia đôi" },
                          { key: "classic", label: "Cổ điển" },
                        ].map((m) => (
                          <button
                            key={m.key}
                            type="button"
                            onClick={() => saveSection({ layoutMode: m.key })}
                            className={`rounded-xl border py-2 transition ${
                              layoutMode === m.key
                                ? "border-[#3B52DE] bg-[#EEF2FF] text-[#3B52DE]"
                                : "border-stone-200 text-stone-600"
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#1F1A17]">
                        Vị trí tiêu đề
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-semibold">
                        {[
                          { key: "below", label: "Dưới ảnh bìa" },
                          { key: "overlay", label: "Trên ảnh bìa" },
                        ].map((pos) => (
                          <button
                            key={pos.key}
                            type="button"
                            onClick={() =>
                              saveSection({ titlePosition: pos.key })
                            }
                            className={`rounded-xl border py-2 ${
                              titlePosition === pos.key
                                ? "border-[#3B52DE] bg-[#EEF2FF] text-[#3B52DE]"
                                : "border-stone-200 text-stone-600"
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-[#1F1A17]">
                          Độ tối lớp phủ ảnh
                        </span>
                        <span className="text-stone-500 tabular-nums">
                          {overlayOpacity}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={60}
                        value={overlayOpacity}
                        onChange={(e) =>
                          saveSection({
                            overlayOpacity: Number(e.target.value),
                          })
                        }
                        className="mt-1.5 w-full accent-[#3B52DE]"
                      />
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-bold text-[#1F1A17]">
                        Ảnh bìa đầu trang
                      </p>
                      <label className="mb-2.5 flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#3B52DE]/50 bg-[#EEF2FF]/40 py-2 text-xs font-semibold text-[#3B52DE] hover:bg-[#EEF2FF]">
                        <Upload size={13} /> Tải ảnh từ máy
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(
                              e.target.files?.[0],
                              "customCoverUrl"
                            )
                          }
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {COVER_IMAGES.map((img) => (
                          <button
                            key={img.id}
                            type="button"
                            onClick={() =>
                              saveSection({
                                coverId: img.id,
                                customCoverUrl: "",
                              })
                            }
                            className={`overflow-hidden rounded-xl border text-left transition ${
                              !customCoverUrl && coverId === img.id
                                ? "border-[#3B52DE] ring-2 ring-[#3B52DE]/20"
                                : "border-stone-200"
                            }`}
                          >
                            <img
                              src={img.src}
                              alt={img.label}
                              className="h-14 w-full object-cover"
                            />
                            <p className="truncate px-2 py-1 text-[10px] font-medium">
                              {img.label}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. COLOR */}
                {activeTab === "color" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                      {[
                        { key: "light", label: "Chế độ Sáng" },
                        { key: "dark", label: "Chế độ Tối" },
                      ].map((m) => (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => saveSection({ colorMode: m.key })}
                          className={`rounded-xl border py-2 ${
                            colorMode === m.key
                              ? "border-[#3B52DE] bg-[#EEF2FF] text-[#3B52DE]"
                              : "border-stone-200 text-stone-600"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      {COLOR_THEMES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() =>
                            saveSection({ themeId: t.id, customColors: null })
                          }
                          className={`flex w-full items-center justify-between rounded-xl border p-2.5 text-left text-xs transition ${
                            !customColors && themeId === t.id
                              ? "border-[#3B52DE] bg-[#EEF2FF]/50 font-semibold"
                              : "border-stone-200 hover:bg-stone-50"
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

                    <div className="border-t border-stone-100 pt-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1F1A17]">
                          Tự pha màu (Custom)
                        </span>
                        <button
                          type="button"
                          onClick={() => saveSection({ customColors: null })}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3B52DE]"
                        >
                          <RotateCcw size={11} /> Đặt lại
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        {[
                          { key: "outerBg", label: "Nền ngoài", def: baseTheme.outerBg },
                          { key: "bg", label: "Nền nội dung", def: baseTheme.bg },
                          { key: "accent", label: "Màu nhấn", def: baseTheme.accent },
                        ].map((c) => (
                          <label
                            key={c.key}
                            className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-stone-200 p-2"
                          >
                            <input
                              type="color"
                              value={customColors?.[c.key] || c.def}
                              onChange={(e) =>
                                saveSection({
                                  customColors: {
                                    outerBg:
                                      customColors?.outerBg || baseTheme.outerBg,
                                    bg: customColors?.bg || baseTheme.bg,
                                    accent:
                                      customColors?.accent || baseTheme.accent,
                                    [c.key]: e.target.value,
                                  },
                                })
                              }
                              className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent"
                            />
                            <span>{c.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. FONT */}
                {activeTab === "font" && (
                  <div className="space-y-4">
                    <div
                      className="rounded-xl border border-stone-200 bg-[#FAF8F5] p-3 text-center"
                      style={{ fontFamily: activeFont.style }}
                    >
                      <p className="text-[10px] text-stone-400 uppercase">
                        Xem thử phông chữ
                      </p>
                      <p className="mt-1 text-xl font-semibold text-[#1F1A17]">
                        {coupleName}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      {FONT_OPTIONS.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => saveSection({ fontId: f.id })}
                          className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition ${
                            fontId === f.id
                              ? "border-[#3B52DE] bg-[#EEF2FF]/50 font-semibold text-[#3B52DE]"
                              : "border-stone-200 text-stone-700 hover:bg-stone-50"
                          }`}
                        >
                          <span style={{ fontFamily: f.style }}>{f.label}</span>
                          <span className="text-[10px] text-stone-400">
                            {f.tag}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="mb-1.5 text-[11px] font-semibold text-stone-600">
                          Cỡ chữ
                        </p>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { key: "sm", label: "S" },
                            { key: "md", label: "M" },
                            { key: "lg", label: "L" },
                          ].map((s) => (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() => saveSection({ fontScale: s.key })}
                              className={`rounded-lg border py-1 text-xs font-semibold ${
                                fontScale === s.key
                                  ? "border-[#3B52DE] bg-[#EEF2FF] text-[#3B52DE]"
                                  : "border-stone-200"
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-1.5 text-[11px] font-semibold text-stone-600">
                          Giãn chữ
                        </p>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { key: "tight", label: "Hẹp" },
                            { key: "normal", label: "Vừa" },
                            { key: "wide", label: "Rộng" },
                          ].map((s) => (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() =>
                                saveSection({ letterSpacing: s.key })
                              }
                              className={`rounded-lg border py-1 text-[11px] font-semibold ${
                                letterSpacing === s.key
                                  ? "border-[#3B52DE] bg-[#EEF2FF] text-[#3B52DE]"
                                  : "border-stone-200"
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. ART */}
                {activeTab === "art" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      {ART_STYLES.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => saveSection({ artId: a.id })}
                          className={`w-full rounded-xl border px-3 py-2 text-left text-xs transition ${
                            artId === a.id
                              ? "border-[#3B52DE] bg-[#EEF2FF]/50 font-semibold text-[#3B52DE]"
                              : "border-stone-200 text-stone-700 hover:bg-stone-50"
                          }`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-bold text-[#1F1A17]">
                        Màu hoạ tiết
                      </p>
                      <div className="flex gap-2">
                        {ART_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            aria-label={`Chọn màu ${c}`}
                            onClick={() => saveSection({ artColor: c })}
                            className={`h-7 w-7 rounded-full border transition ${
                              artColor === c
                                ? "scale-110 border-[#3B52DE] ring-2 ring-[#3B52DE]/25"
                                : "border-stone-300"
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-[#1F1A17]">
                          Độ rõ hoạ tiết
                        </span>
                        <span className="text-stone-500 tabular-nums">
                          {artOpacity}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={100}
                        value={artOpacity}
                        onChange={(e) =>
                          saveSection({ artOpacity: Number(e.target.value) })
                        }
                        className="mt-1.5 w-full accent-[#3B52DE]"
                      />
                    </div>
                  </div>
                )}

                {/* 5. LINK PREVIEW */}
                {activeTab === "linkPreview" && (
                  <div className="space-y-3 text-xs">
                    <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                      <img
                        src={linkPreviewImage || coverSrc}
                        alt="Link preview"
                        className="h-32 w-full object-cover"
                      />
                      <div className="p-3">
                        <p className="text-[10px] text-stone-400 uppercase">
                          everwed.vn · Zalo / Facebook Card
                        </p>
                        <p className="mt-0.5 font-bold text-[#1F1A17]">
                          {linkPreviewTitle || coupleName}
                        </p>
                        <p className="mt-0.5 text-[11px] text-stone-500">
                          {linkPreviewDesc || `${displayDate} · ${displayVenue}`}
                        </p>
                      </div>
                    </div>

                    <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#3B52DE]/50 bg-[#EEF2FF]/40 py-2 font-semibold text-[#3B52DE]">
                      <Upload size={13} /> Đổi ảnh khi gửi link
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(
                            e.target.files?.[0],
                            "linkPreviewImage"
                          )
                        }
                      />
                    </label>

                    <input
                      type="text"
                      value={linkPreviewTitle}
                      onChange={(e) =>
                        saveSection({ linkPreviewTitle: e.target.value })
                      }
                      placeholder="Tiêu đề khi chia sẻ link..."
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-[#3B52DE]"
                    />
                    <textarea
                      rows={2}
                      value={linkPreviewDesc}
                      onChange={(e) =>
                        saveSection({ linkPreviewDesc: e.target.value })
                      }
                      placeholder="Mô tả ngắn hiển thị bên dưới link..."
                      className="w-full rounded-xl border border-stone-200 p-2.5 outline-none focus:border-[#3B52DE]"
                    />
                  </div>
                )}

                {/* 6. PAGES */}
                {activeTab === "pages" && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-bold text-[#1F1A17]">
                        Các mục trên Website
                      </h2>
                      <span className="text-xs text-stone-500">
                        {pages.filter((p) => p.visible).length}/{pages.length} bật
                      </span>
                    </div>
                    <div className="mt-3 divide-y divide-stone-100">
                      {pages.map((p, idx) => {
                        const pageKey = p.key || p.id;
                        return (
                        <div key={pageKey} className="py-2 text-xs">
                          <div className="flex items-center justify-between gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (p.isCustom || pageKey === "story") {
                                  setEditingPageKey(
                                    editingPageKey === pageKey ? null : pageKey
                                  );
                                }
                                if (p.visible) scrollToSection(pageKey);
                              }}
                              className={`flex-1 truncate text-left ${
                                p.visible
                                  ? "font-medium text-[#1F1A17] hover:text-[#3B52DE]"
                                  : "text-stone-400 line-through"
                              }`}
                            >
                              {p.label}
                            </button>
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => movePage(idx, -1)}
                                disabled={idx === 0}
                                title="Lên"
                                className="rounded p-1 text-stone-400 hover:bg-stone-100 disabled:opacity-30"
                              >
                                <ArrowUp size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={() => movePage(idx, 1)}
                                disabled={idx === pages.length - 1}
                                title="Xuống"
                                className="rounded p-1 text-stone-400 hover:bg-stone-100 disabled:opacity-30"
                              >
                                <ArrowDown size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={() => togglePage(pageKey)}
                                className={`ml-1 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium ${
                                  p.visible
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-stone-100 text-stone-500"
                                }`}
                              >
                                {p.visible ? (
                                  <Eye size={12} />
                                ) : (
                                  <EyeOff size={12} />
                                )}
                              </button>
                              {p.isCustom && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCustomPage(pageKey)}
                                  aria-label="Xoá trang"
                                  className="rounded-lg p-1 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>

                          {editingPageKey === pageKey &&
                            (p.isCustom || pageKey === "story") && (
                              <div className="mt-2 space-y-2 rounded-xl bg-[#FAF8F5] p-2.5">
                                {p.isCustom ? (
                                  <>
                                    <input
                                      type="text"
                                      value={p.label}
                                      onChange={(e) =>
                                        handleUpdatePage(pageKey, {
                                          label: e.target.value,
                                        })
                                      }
                                      className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-[#3B52DE]"
                                    />
                                    <textarea
                                      rows={2}
                                      value={p.content || ""}
                                      onChange={(e) =>
                                        handleUpdatePage(pageKey, {
                                          content: e.target.value,
                                        })
                                      }
                                      className="w-full rounded-lg border border-stone-200 bg-white p-2 text-xs outline-none focus:border-[#3B52DE]"
                                    />
                                  </>
                                ) : (
                                  <textarea
                                    rows={3}
                                    value={storyText}
                                    onChange={(e) =>
                                      saveSection({ storyText: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-stone-200 bg-white p-2 text-xs outline-none focus:border-[#3B52DE]"
                                  />
                                )}
                              </div>
                            )}
                        </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddPageOpen(true)}
                      className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#3B52DE]/40 bg-[#EEF2FF]/40 py-2 text-xs font-semibold text-[#3B52DE] transition hover:border-[#3B52DE] hover:bg-[#EEF2FF]"
                    >
                      <Plus size={14} /> Thêm trang mới
                    </button>
                  </div>
                )}

                {/* 7. CUSTOM CSS */}
                {activeTab === "css" && (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-[#1F1A17]">
                        Tuỳ chỉnh CSS (Cô lập)
                      </h2>
                      <button
                        type="button"
                        onClick={() => saveSection({ customCss: "" })}
                        className="text-[11px] font-semibold text-rose-600 hover:underline"
                      >
                        Xoá CSS
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {CSS_SNIPPETS.map((sn) => (
                        <button
                          key={sn.label}
                          type="button"
                          onClick={() =>
                            saveSection({
                              customCss: `${customCss}\n${sn.code}`.trim(),
                            })
                          }
                          className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-semibold text-stone-700 hover:border-[#3B52DE] hover:text-[#3B52DE]"
                        >
                          + {sn.label}
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={6}
                      value={customCss}
                      onChange={(e) => saveSection({ customCss: e.target.value })}
                      placeholder="#everweb-site-preview h3 { letter-spacing: 2px; }"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 font-mono text-[11px] outline-none focus:border-[#3B52DE]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Checklist Footer */}
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold tracking-wide text-[#1F1A17] uppercase">
                  Hoàn thiện Website
                </h2>
                <span className="text-xs font-semibold text-[#3B52DE] tabular-nums">
                  {doneSteps.length}/{CHECKLIST.length}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F5F5F4]">
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
                              : "border-stone-300"
                          }`}
                        >
                          {done && <Check size={10} />}
                        </span>
                        <span
                          className={
                            done ? "text-stone-400 line-through" : "text-[#1F1A17]"
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

        {/* Right Full-Page Scrollable Live Website Preview */}
        <section className="min-w-0 flex-1">
          <div
            className="relative min-h-[calc(100vh-3.5rem)] w-full px-4 sm:px-8"
            style={{ background: activeOuterBg }}
          >
            <CornerArtwork artId={artId} color={artColor} opacity={artOpacity} />
            <CornerArtwork
              artId={artId}
              color={artColor}
              opacity={artOpacity}
              flip
            />

            {customCss && <style>{customCss}</style>}
            <div
              id="everweb-site-preview"
              className={`mx-auto min-h-full shadow-2xl transition-all duration-300 ${
                device === "mobile"
                  ? "max-w-[375px]"
                  : layoutMode === "split"
                  ? "max-w-5xl"
                  : layoutMode === "classic"
                  ? "my-6 max-w-[680px] rounded-2xl overflow-hidden"
                  : "max-w-[740px]"
              }`}
              style={{
                backgroundColor: activeBg,
                color: activeText,
                fontFamily: activeFont.style,
              }}
            >
              {/* Sticky Mini Nav */}
              <nav className="sticky top-0 z-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-black/10 bg-white/85 px-3 py-2.5 text-[10px] font-medium text-[#1F1A17] backdrop-blur-sm">
                {pages
                  .filter((p) => p.visible)
                  .map((p) => {
                    const pageKey = p.key || p.id;
                    return (
                      <button
                        key={pageKey}
                        type="button"
                        onClick={() => scrollToSection(pageKey)}
                        className="transition hover:underline"
                      >
                        {p.label}
                      </button>
                    );
                  })}
              </nav>

              {layoutMode === "split" && device === "desktop" ? (
                <div className="grid grid-cols-12">
                  <div className="sticky top-10 col-span-5 h-[calc(100vh-6rem)]">
                    <img
                      src={coverSrc}
                      alt="Split cover"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="col-span-7">
                    {pages.map((p) => renderPageSection(p))}
                  </div>
                </div>
              ) : (
                pages.map((p) => renderPageSection(p))
              )}

              <footer className="border-t border-black/10 py-8 text-center text-[10px] opacity-65">
                Được tạo với tất cả yêu thương trên EverWeb
              </footer>
            </div>
          </div>
        </section>
      </div>

      {/* Add Custom Page Modal */}
      <Modal
        isOpen={isAddPageOpen}
        onClose={() => setIsAddPageOpen(false)}
        title="Thêm trang mới vào Website"
        size="sm"
      >
        <form onSubmit={handleAddCustomPage} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-stone-700">
              Tên trang (hiển thị trên thanh menu)
            </label>
            <input
              type="text"
              required
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              placeholder="VD: Thực đơn tiệc, Dresscode, Ghi chú..."
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-[#3B52DE]"
              autoFocus
            />
          </div>
          <div>
            <label className="font-semibold text-stone-700">
              Nội dung hiển thị
            </label>
            <textarea
              rows={4}
              value={newPageContent}
              onChange={(e) => setNewPageContent(e.target.value)}
              placeholder="Nhập thông tin bạn muốn gửi tới khách mời..."
              className="mt-1 w-full rounded-xl border border-stone-200 p-3 outline-none focus:border-[#3B52DE]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddPageOpen(false)}
              className="rounded-lg border border-stone-200 px-4 py-2 font-medium"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#3B52DE] px-4 py-2 font-semibold text-white hover:bg-[#2F43C2]"
            >
              Thêm trang
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
