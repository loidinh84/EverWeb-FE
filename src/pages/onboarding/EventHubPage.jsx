import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  Contact,
  Copy,
  ExternalLink,
  FileText,
  Gift,
  Globe,
  HelpCircle,
  Image as ImageIcon,
  Lightbulb,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Plane,
  Plus,
  Search,
  Settings,
  Share2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { Modal, useToast, UserProfileModal } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import weddingApi from "../../services/weddingApi";
import CollaboratorsModal from "./CollaboratorsModal";
import FeedbackModal from "./FeedbackModal";
import galleryCeremony from "../../assets/image/gallery-ceremony.jpg";
import heroWedding from "../../assets/image/hero-wedding.jpg";

const FEATURE_TILES = [
  {
    key: "website-design",
    label: "Website",
    icon: Globe,
    bg: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
    route: ROUTE_PATHS.WEBSITE_DESIGN,
    subItems: [
      { label: "Tổng quan & Thiết kế", route: ROUTE_PATHS.WEBSITE_DESIGN },
      { label: "Xem trước Website", route: ROUTE_PATHS.WEBSITE_PREVIEW },
      { label: "Ảnh cưới & Album", route: ROUTE_PATHS.PHOTO_MOMENTS },
      { label: "Cài đặt đường dẫn", route: ROUTE_PATHS.EVENT_SETTINGS },
    ],
  },
  {
    key: "registry",
    label: "Quà mừng",
    icon: Gift,
    bg: "bg-gradient-to-br from-rose-500 to-pink-600 text-white",
    route: ROUTE_PATHS.REGISTRY,
    subItems: [
      { label: "Quản lý Quà mừng", route: ROUTE_PATHS.REGISTRY },
      { label: "Quỹ mừng cưới & VietQR", route: ROUTE_PATHS.REGISTRY },
      { label: "Quỹ cưới & Ngân sách", route: ROUTE_PATHS.REGISTRY },
    ],
  },
  {
    key: "travel",
    label: "Lưu trú & Đi lại",
    badge: "Mới",
    icon: Plane,
    bg: "bg-gradient-to-br from-pink-400 to-rose-500 text-white",
    route: ROUTE_PATHS.TRAVEL,
    subItems: [
      { label: "Khách sạn đề xuất", route: ROUTE_PATHS.TRAVEL },
      { label: "Hướng dẫn di chuyển", route: ROUTE_PATHS.TRAVEL },
    ],
  },
  {
    key: "collect-contacts",
    label: "Thu thập liên hệ",
    icon: Contact,
    bg: "bg-gradient-to-br from-amber-400 to-orange-400 text-white",
    route: ROUTE_PATHS.COLLECT_CONTACTS,
  },
  {
    key: "schedule",
    label: "Lịch trình",
    icon: CalendarDays,
    bg: "bg-gradient-to-br from-yellow-400 to-amber-500 text-white",
    route: ROUTE_PATHS.SCHEDULE_EDITOR,
  },
  {
    key: "guests",
    label: "Khách mời",
    badge: "Mới",
    icon: Users,
    bg: "bg-gradient-to-br from-indigo-500 to-violet-600 text-white",
    subItems: [
      { label: "Danh sách khách mời", route: ROUTE_PATHS.GUEST_LIST },
      { label: "Sơ đồ bàn tiệc (Seating)", route: ROUTE_PATHS.SEATING_CHART },
      { label: "Theo dõi RSVP", route: ROUTE_PATHS.RSVP_BUILDER },
    ],
  },
  {
    key: "save-the-dates",
    label: "Save the Dates",
    icon: Bookmark,
    bg: "bg-gradient-to-br from-sky-400 to-blue-500 text-white",
    route: ROUTE_PATHS.INVITATIONS_STUDIO,
    state: { category: "Save the Dates" },
  },
  {
    key: "invitations-studio",
    label: "Thiệp mời",
    icon: Mail,
    bg: "bg-gradient-to-br from-teal-400 to-cyan-500 text-white",
    route: ROUTE_PATHS.INVITATIONS_STUDIO,
    state: { category: "Thiệp mời" },
  },
  {
    key: "stationery",
    label: "Thiệp & Menu",
    icon: FileText,
    bg: "bg-gradient-to-br from-emerald-400 to-teal-500 text-white",
    route: ROUTE_PATHS.INVITATIONS_STUDIO,
    subItems: [
      { label: "Save the Dates", route: ROUTE_PATHS.INVITATIONS_STUDIO, state: { category: "Save the Dates" } },
      { label: "Thiệp mời", route: ROUTE_PATHS.INVITATIONS_STUDIO, state: { category: "Thiệp mời" } },
      { label: "Thiệp cảm ơn", route: ROUTE_PATHS.INVITATIONS_STUDIO, state: { category: "Thiệp cảm ơn" } },
      { label: "Thực đơn & Bảng tên", route: ROUTE_PATHS.INVITATIONS_STUDIO, state: { category: "Thực đơn & Bảng tên" } },
    ],
  },
  {
    key: "rsvp-builder",
    label: "RSVP",
    icon: CheckSquare,
    bg: "bg-gradient-to-br from-orange-400 to-amber-500 text-white",
    route: ROUTE_PATHS.RSVP_BUILDER,
    subItems: [
      { label: "Câu hỏi RSVP", route: ROUTE_PATHS.RSVP_BUILDER },
      { label: "Phản hồi khách mời", route: ROUTE_PATHS.RSVP_BUILDER },
      { label: "Gửi nhắc RSVP", route: ROUTE_PATHS.MESSAGING },
    ],
  },
  {
    key: "album",
    label: "Album & QR",
    icon: ImageIcon,
    bg: "bg-gradient-to-br from-pink-500 to-rose-600 text-white",
    route: ROUTE_PATHS.PHOTO_MOMENTS,
  },
  {
    key: "messaging",
    label: "Nhắn tin",
    icon: MessageSquare,
    bg: "bg-gradient-to-br from-emerald-500 to-green-600 text-white",
    route: ROUTE_PATHS.MESSAGING,
  },
];

export default function EventHubPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const menuRef = useRef(null);

  const [wedding, setWedding] = useState(() => {
    if (location.state?.wedding) return location.state.wedding;
    try {
      const cached =
        sessionStorage.getItem("everweb_pending_wedding") ||
        localStorage.getItem("everweb_recent_wedding");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openTileKey, setOpenTileKey] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [allWeddings, setAllWeddings] = useState([]);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const gridRef = useRef(null);

  useEffect(() => {
    if (wedding) return undefined;
    let cancelled = false;
    weddingApi
      .getAll()
      .then((items) => {
        if (!cancelled && items.length > 0) setWedding(items[0]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [wedding]);

  useEffect(() => {
    if (!isMenuOpen && !openTileKey) return undefined;
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (gridRef.current && !gridRef.current.contains(e.target)) {
        setOpenTileKey(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isMenuOpen, openTileKey]);

  const initials = (user?.full_name || user?.email || "U")
    .slice(0, 2)
    .toUpperCase();

  const rawCoupleName =
    wedding?.title ||
    (wedding?.groom_name && wedding?.bride_name
      ? `${wedding.groom_name} & ${wedding.bride_name}`
      : "Trần Thanh Khang & Trần Ngọc An");
  const coupleName = rawCoupleName.normalize("NFC");

  const displayDate = wedding?.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("vi-VN")
    : "Chưa chốt ngày";
  const weddingDateObj = wedding?.wedding_date
    ? new Date(wedding.wedding_date)
    : null;
  const scheduleMonthLabel = weddingDateObj
    ? `TH${weddingDateObj.getMonth() + 1}`
    : "TH8";
  const scheduleDayLabel = weddingDateObj ? weddingDateObj.getDate() : "23";

  const rawVenue = (wedding?.venue_name || "Đang cân nhắc địa điểm").normalize("NFC");
  const venueParts = rawVenue.includes(" - ") ? rawVenue.split(" - ") : [rawVenue];
  const displayVenue = venueParts[0];
  const displayCity = venueParts[1] || "TP. Hồ Chí Minh";
  const publicUrl = `everweb.vn/${wedding?.slug || "khang-an"}`;

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleOpenFeature = (tile) => {
    if (typeof tile === "string") {
      if (tile === "album") {
        navigate(ROUTE_PATHS.PHOTO_MOMENTS, { state: { wedding } });
        return;
      }
      if (tile === "overview" || tile === "settings") {
        navigate(ROUTE_PATHS.EVENT_SETTINGS, { state: { wedding } });
        return;
      }
      navigate(ROUTE_PATHS.EVENT_HUB, { state: { wedding } });
      return;
    }
    if (tile.subItems?.length) {
      setOpenTileKey((prev) => (prev === tile.key ? null : tile.key));
      return;
    }
    if (tile.route) {
      navigate(tile.route, { state: { wedding, ...(tile.state || {}) } });
      return;
    }
    navigate(ROUTE_PATHS.EVENT_HUB);
  };

  const handleOpenSubItem = (sub) => {
    setOpenTileKey(null);
    if (sub.route) {
      navigate(sub.route, { state: { wedding, ...(sub.state || {}) } });
      return;
    }
    if (sub.dashboardKey) {
      if (sub.dashboardKey === "album") {
        navigate(ROUTE_PATHS.PHOTO_MOMENTS, { state: { wedding } });
      } else if (sub.dashboardKey === "budget") {
        navigate(ROUTE_PATHS.REGISTRY, { state: { wedding } });
      } else {
        navigate(ROUTE_PATHS.EVENT_HUB);
      }
    }
  };

  const handleOpenManageEvents = async () => {
    setIsMenuOpen(false);
    setIsEventsModalOpen(true);
    try {
      const list = await weddingApi.getAll();
      setAllWeddings(list);
    } catch {
      setAllWeddings(wedding ? [wedding] : []);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  };

  const filteredTiles = searchQuery.trim()
    ? FEATURE_TILES.filter((t) =>
        t.label.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : FEATURE_TILES;

  return (
    <div className="grid min-h-screen grid-cols-1 bg-stone-50 text-[#1F1A17] lg:grid-cols-12">
      {/* Left Half: Couple Info + Search & Settings + 3x4 App Grid */}
      <div className="flex flex-col justify-between border-r border-stone-200 bg-white px-8 py-8 sm:px-12 sm:py-10 lg:col-span-6">
        <div className="flex flex-1 flex-col">
          <button
            type="button"
            onClick={() => navigate(-1)}
            title="Quay lại trang trước"
            className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-semibold text-stone-700 transition hover:border-[#3B52DE] hover:text-[#3B52DE]"
          >
            <ArrowLeft size={12} />
            Quay lại
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-[#1F1A17] sm:text-4xl">
                {coupleName}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-600">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1">
                  <CalendarDays size={13} className="text-[#3B52DE]" />
                  {displayDate}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1">
                  <MapPin size={13} className="text-[#3B52DE]" />
                  {displayVenue}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1">
                  <Globe size={13} className="text-[#3B52DE]" />
                  {displayCity}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(`https://${publicUrl}`);
                    toast.success(`Đã sao chép link: ${publicUrl}`);
                  }}
                  title="Chia sẻ / Sao chép link"
                  aria-label="Chia sẻ link"
                  className="rounded-full border border-stone-200 p-1.5 text-stone-700 hover:bg-stone-50"
                >
                  <Share2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    navigate(ROUTE_PATHS.WEBSITE_PREVIEW, { state: { wedding } })
                  }
                  title="Xem trước Website"
                  aria-label="Xem trước Website"
                  className="rounded-full border border-stone-200 p-1.5 text-stone-700 hover:bg-stone-50"
                >
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>

            {/* Search + Profile + Settings Gear Dropdown */}
            <div ref={menuRef} className="relative flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                aria-label="Tìm chức năng (Ctrl+K)"
                title="Tìm nhanh (Ctrl+K)"
                className="inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-stone-700 transition hover:bg-stone-50"
              >
                <Search size={16} />
                <span className="hidden rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 text-[10px] font-medium text-stone-500 sm:inline">
                  Ctrl+K
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 py-1 pr-2.5 pl-1 transition hover:border-[#3B52DE]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-bold text-[#3B52DE]">
                  {initials}
                </div>
                <Settings size={16} className="text-stone-700" />
              </button>

              {isMenuOpen && (
                <div className="ew-zoom-in absolute top-12 right-0 z-40 w-64 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-stone-100 px-3 py-3 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-bold text-[#3B52DE]">
                      {initials}
                    </div>
                    <p className="mt-2 truncate text-xs font-bold text-[#1F1A17]">
                      {coupleName}
                    </p>
                  </div>

                  <div className="space-y-0.5 py-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate(ROUTE_PATHS.WEBSITE_PREVIEW, { state: { wedding } });
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[#1F1A17] hover:bg-stone-50"
                    >
                      <ExternalLink size={15} className="text-stone-500" />
                      Xem trước Website
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate(ROUTE_PATHS.EVENT_SETTINGS, { state: { wedding } });
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[#1F1A17] hover:bg-stone-50"
                    >
                      <Settings size={15} className="text-stone-500" />
                      Cài đặt sự kiện
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsCollabOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[#1F1A17] hover:bg-stone-50"
                    >
                      <UserPlus size={15} className="text-stone-500" />
                      Mời cộng tác viên
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsFeedbackOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[#1F1A17] hover:bg-stone-50"
                    >
                      <Lightbulb size={15} className="text-stone-500" />
                      Gửi góp ý
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        toast.info("Hỗ trợ trực tuyến: support@everweb.vn");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[#1F1A17] hover:bg-stone-50"
                    >
                      <MessageSquare size={15} className="text-stone-500" />
                      Liên hệ hỗ trợ
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        toast.info("Hướng dẫn sử dụng đang được cập nhật");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[#1F1A17] hover:bg-stone-50"
                    >
                      <HelpCircle size={15} className="text-stone-500" />
                      Trợ giúp
                    </button>
                  </div>

                  <div className="space-y-0.5 border-t border-stone-100 pt-1.5 text-xs">
                    <button
                      type="button"
                      onClick={handleOpenManageEvents}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[#1F1A17] hover:bg-stone-50"
                    >
                      <CalendarDays size={15} className="text-stone-500" />
                      Quản lý sự kiện
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAccountModalOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[#1F1A17] hover:bg-stone-50"
                    >
                      <User size={15} className="text-stone-500" />
                      Thông tin tài khoản
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut size={15} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isSearchOpen && (
            <div className="ew-zoom-in mx-auto mt-6 w-full max-w-md">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nhanh chức năng (ví dụ: Thiệp mời, RSVP, Quà mừng)..."
                className="w-full rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs text-[#1F1A17] outline-none focus:border-[#3B52DE]"
              />
            </div>
          )}

          {/* App Icon Grid (3x4 circular icons matching WithJoy) */}
          <div
            ref={gridRef}
            className="mx-auto my-auto grid w-full max-w-xl grid-cols-3 gap-x-8 gap-y-11 py-8"
          >
            {filteredTiles.map((tile, index) => {
              const { key, label, icon: Icon, bg, badge, subItems } = tile;
              const isDropdownOpen = openTileKey === key;
              return (
                <div key={key} className="relative flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleOpenFeature(tile)}
                    style={{ animationDelay: `${index * 35}ms` }}
                    className="ew-pop-in group relative flex flex-col items-center gap-3 text-center"
                  >
                    {badge && (
                      <span className="absolute -top-1.5 right-0 z-10 rounded-full bg-[#3B52DE] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                        {badge}
                      </span>
                    )}
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-md group-active:scale-95 ${bg}`}
                    >
                      {key === "schedule" ? (
                        <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-white text-[#D97706] shadow-2xs">
                          <span className="text-[9px] leading-none font-bold uppercase">
                            {scheduleMonthLabel}
                          </span>
                          <span className="text-base leading-tight font-extrabold">
                            {scheduleDayLabel}
                          </span>
                        </div>
                      ) : (
                        <Icon size={26} />
                      )}
                    </div>
                    <span className="inline-flex items-center gap-0.5 text-[13px] font-medium text-[#3B2A1A] transition-colors group-hover:text-[#3B52DE]">
                      {label}
                      {subItems && (
                        <ChevronDown
                          size={12}
                          className={`transition-transform duration-200 ${
                            isDropdownOpen ? "rotate-180 text-[#3B52DE]" : ""
                          }`}
                        />
                      )}
                    </span>
                  </button>

                  {isDropdownOpen && subItems && (
                    <div className="ew-zoom-in absolute top-full z-30 mt-2 w-52 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl">
                      <p className="px-3 py-1 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                        {label}
                      </p>
                      <div className="my-1 h-px bg-[#F5F5F4]" />
                      {subItems.map((sub) => (
                        <button
                          key={sub.label}
                          type="button"
                          onClick={() => handleOpenSubItem(sub)}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-[#1F1A17] transition hover:bg-stone-50 hover:text-[#3B52DE]"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#3B52DE]/60" />
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimal Footer Link to Event Settings */}
        <div className="mt-10 flex items-center justify-center">
          <button
            type="button"
            onClick={() =>
              navigate(ROUTE_PATHS.EVENT_SETTINGS, { state: { wedding } })
            }
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-700 transition hover:border-[#3B52DE] hover:text-[#3B52DE]"
          >
            Cài đặt & Quản lý sự kiện →
          </button>
        </div>
      </div>

      {/* Right Half: WithJoy-style Tablet + Invitation Card + Phone Collage (3D Parallax) */}
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          setParallax({ x, y });
        }}
        onMouseLeave={() => setParallax({ x: 0, y: 0 })}
        className="flex flex-col items-center justify-center bg-[#F6F4F0] p-6 sm:p-10 lg:col-span-6"
      >
        <div
          className="ew-slide-up relative mx-auto w-full max-w-2xl pb-12"
          style={{ perspective: "1200px" }}
        >
          {/* Tablet Mockup (Background Top-Right) */}
          <div
            className="ml-auto w-[86%] overflow-hidden rounded-[22px] border-[7px] border-[#1F1A17] bg-white shadow-xl transition-transform duration-300 ease-out"
            style={{
              transform: `rotateY(${parallax.x * 2.5}deg) rotateX(${-parallax.y * 2.5}deg) translate3d(${parallax.x * 4}px, ${parallax.y * 4}px, 0)`,
            }}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={heroWedding}
                alt="Website cưới"
                className="ew-ken-burns h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 p-6 text-center text-white">
                <p className="text-[10px] tracking-[0.25em] uppercase opacity-90">
                  Save The Date
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  {coupleName}
                </h2>
                <p className="mt-1 text-[11px] opacity-90">
                  {displayDate} · {displayVenue}
                </p>
              </div>
              <div className="group/plus absolute top-3 right-3 flex items-center overflow-hidden rounded-full bg-white/95 text-[#1F1A17] shadow-md transition-all duration-300 hover:shadow-lg">
                <div className="flex max-w-0 items-center overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover/plus:max-w-[220px] group-hover/plus:px-3 group-hover/plus:opacity-100">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(ROUTE_PATHS.PHOTO_MOMENTS, { state: { wedding } })
                    }
                    className="pr-2.5 text-xs font-semibold transition hover:text-[#3B52DE]"
                  >
                    Thêm ảnh
                  </button>
                  <span className="h-3.5 w-px bg-[#E7E5E4]" />
                  <button
                    type="button"
                    onClick={() =>
                      navigate(ROUTE_PATHS.WEBSITE_DESIGN, { state: { wedding } })
                    }
                    className="pl-2.5 text-xs font-semibold transition hover:text-[#3B52DE]"
                  >
                    Sửa Website
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate(ROUTE_PATHS.WEBSITE_DESIGN, { state: { wedding } })
                  }
                  title="Chỉnh sửa Website"
                  className="flex h-8 w-8 shrink-0 items-center justify-center transition-transform duration-200 group-hover/plus:rotate-45"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Printed Invitation Card + Envelope (Bottom-Left Overlap) */}
          <div
            className="relative z-10 -mt-20 ml-2 w-[46%] transition-transform duration-300 ease-out hover:-translate-y-1.5 sm:-mt-28"
            style={{
              transform: `translate3d(${parallax.x * 10}px, ${parallax.y * 10}px, 0)`,
            }}
          >
            {/* Subtle envelope backing */}
            <div className="absolute -top-3 -left-3 h-full w-full rounded-lg border border-[#E5DEC9] bg-[#FAF8F4] shadow-sm" />
            <div className="ew-card-sheen relative rounded-lg border border-[#E5DEC9] bg-white p-5 text-center shadow-xl">
              <p className="text-[9px] tracking-[0.25em] text-stone-500 uppercase">
                Trân trọng kính mời
              </p>
              <p className="mt-3 font-display text-base leading-snug font-semibold text-[#1F1A17]">
                {coupleName}
              </p>
              <div className="mx-auto my-3 h-px w-10 bg-[#E7E5E4]" />
              <p className="text-[10px] text-stone-500">{displayDate}</p>
              <p className="mt-0.5 truncate text-[10px] text-stone-500">
                {displayVenue}
              </p>
              <div className="group/cardplus absolute right-2.5 bottom-2.5 flex items-center overflow-hidden rounded-full border border-stone-200 bg-white text-[#1F1A17] shadow-sm transition-all duration-300 hover:shadow-md">
                <button
                  type="button"
                  onClick={() =>
                    navigate(ROUTE_PATHS.INVITATIONS_STUDIO, {
                      state: { wedding, category: "Thiệp mời" },
                    })
                  }
                  className="max-w-0 overflow-hidden whitespace-nowrap text-[11px] font-semibold opacity-0 transition-all duration-300 hover:text-[#3B52DE] group-hover/cardplus:max-w-[130px] group-hover/cardplus:pl-3 group-hover/cardplus:pr-1 group-hover/cardplus:opacity-100"
                >
                  Chọn mẫu thiệp
                </button>
                <button
                  type="button"
                  onClick={() =>
                    navigate(ROUTE_PATHS.INVITATIONS_STUDIO, {
                      state: { wedding, category: "Thiệp mời" },
                    })
                  }
                  title="Chọn mẫu Thiệp mời"
                  className="flex h-7 w-7 shrink-0 items-center justify-center transition-transform duration-200 group-hover/cardplus:rotate-45"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Phone Mockup (Bottom-Right Overlap) */}
          <div
            className="ew-float-slow relative z-20 -mt-44 ml-auto mr-1 w-[30%] overflow-hidden rounded-[22px] border-[5px] border-[#1F1A17] bg-white shadow-2xl transition-transform duration-300 ease-out hover:-translate-y-1.5 sm:-mt-52"
            style={{
              transform: `translate3d(${parallax.x * 14}px, ${parallax.y * 14}px, 0)`,
            }}
          >
            <div className="relative">
              <img
                src={galleryCeremony}
                alt="Thiệp trên điện thoại"
                className="h-28 w-full object-cover"
              />
              <div className="p-2.5 text-center">
                <p className="truncate font-display text-[11px] font-semibold text-[#1F1A17]">
                  {coupleName}
                </p>
                <p className="mt-0.5 text-[9px] text-stone-500">
                  {displayDate}
                </p>
                <span className="mt-2 inline-block rounded-full border border-[#1F1A17] px-2.5 py-0.5 text-[9px] font-semibold tracking-wider text-[#1F1A17] uppercase">
                  RSVP
                </span>
              </div>
              <div className="group/phoneplus absolute right-2 bottom-2 flex items-center overflow-hidden rounded-full border border-stone-200 bg-white text-[#1F1A17] shadow-sm transition-all duration-300 hover:shadow-md">
                <button
                  type="button"
                  onClick={() =>
                    navigate(ROUTE_PATHS.RSVP_BUILDER, { state: { wedding } })
                  }
                  className="max-w-0 overflow-hidden whitespace-nowrap text-[10px] font-semibold opacity-0 transition-all duration-300 hover:text-[#3B52DE] group-hover/phoneplus:max-w-[100px] group-hover/phoneplus:pl-2.5 group-hover/phoneplus:pr-1 group-hover/phoneplus:opacity-100"
                >
                  Cài đặt RSVP
                </button>
                <button
                  type="button"
                  onClick={() =>
                    navigate(ROUTE_PATHS.RSVP_BUILDER, { state: { wedding } })
                  }
                  title="Cài đặt RSVP"
                  className="flex h-6 w-6 shrink-0 items-center justify-center transition-transform duration-200 group-hover/phoneplus:rotate-45"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Public URL Bar (WithJoy Style) */}
        <div className="mt-2 flex items-center gap-2.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs text-stone-700 shadow-2xs">
          <span
            className={`h-2 w-2 rounded-full ${
              wedding?.status === "published" ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          <span>
            {wedding?.status === "published" ? "Đã xuất bản" : "Chưa xuất bản"}
          </span>
          <span className="font-semibold text-[#1F1A17]">{publicUrl}</span>
          <div className="ml-1 flex items-center gap-1.5 border-l border-stone-200 pl-2.5 text-stone-600">
            <button
              type="button"
              onClick={() =>
                navigate(ROUTE_PATHS.EVENT_SETTINGS, { state: { wedding } })
              }
              title="Chỉnh sửa đường dẫn"
              aria-label="Chỉnh sửa đường dẫn"
              className="hover:text-[#3B52DE]"
            >
              <Pencil size={13} />
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(`https://${publicUrl}`);
                toast.success(`Đã sao chép: ${publicUrl}`);
              }}
              title="Sao chép đường dẫn"
              aria-label="Sao chép đường dẫn"
              className="hover:text-[#3B52DE]"
            >
              <Copy size={13} />
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(ROUTE_PATHS.WEBSITE_PREVIEW, { state: { wedding } })
              }
              title="Xem trước Website"
              aria-label="Xem trước Website"
              className="hover:text-[#3B52DE]"
            >
              <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Real API Modals */}
      <CollaboratorsModal
        isOpen={isCollabOpen}
        onClose={() => setIsCollabOpen(false)}
        weddingId={wedding?.id}
      />
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Manage Events Modal (WithJoy Account/Events style) */}
      <Modal
        isOpen={isEventsModalOpen}
        onClose={() => setIsEventsModalOpen(false)}
        title="Quản lý sự kiện của bạn"
        size="md"
      >
        <div className="space-y-3">
          {allWeddings.map((item) => {
            const isActive = item.id === wedding?.id;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-2xl border p-4 transition ${
                  isActive
                    ? "border-[#3B52DE] bg-[#F5F7FF]"
                    : "border-stone-200 bg-stone-50"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-semibold text-[#3B52DE]">
                      Đám cưới
                    </span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-stone-700">
                      Chủ sở hữu
                    </span>
                  </div>
                  <p className="font-display mt-1.5 text-lg font-semibold text-[#1F1A17]">
                    {(item.title || "Đám cưới chưa đặt tên").normalize("NFC")}
                  </p>
                  <p className="text-xs text-stone-500">
                    {item.wedding_date
                      ? new Date(item.wedding_date).toLocaleDateString("vi-VN")
                      : "Chưa chốt ngày"}{" "}
                    · {item.venue_name || "Chưa chọn địa điểm"}
                  </p>
                </div>
                {isActive ? (
                  <span className="rounded-full bg-[#3B52DE] px-3 py-1 text-[11px] font-semibold text-white">
                    Đang mở
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setWedding(item);
                      sessionStorage.setItem(
                        "everweb_pending_wedding",
                        JSON.stringify(item)
                      );
                      setIsEventsModalOpen(false);
                      toast.success("Đã chuyển sang sự kiện đã chọn");
                    }}
                    className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1F1A17] hover:border-[#3B52DE]"
                  >
                    Mở sự kiện
                  </button>
                )}
              </div>
            );
          })}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                setIsEventsModalOpen(false);
                navigate(ROUTE_PATHS.CREATE_EVENT);
              }}
              className="rounded-xl bg-[#3B52DE] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2F43C2]"
            >
              + Tạo sự kiện mới
            </button>
          </div>
        </div>
      </Modal>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        wedding={wedding}
      />

    </div>
  );
}
