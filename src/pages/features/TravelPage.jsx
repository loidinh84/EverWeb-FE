import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BedDouble,
  Building2,
  Bus,
  Car,
  Check,
  Clock,
  Compass,
  Copy,
  Edit3,
  ExternalLink,
  Heart,
  Info,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Plane,
  Plus,
  Share2,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import heroWedding from "../../assets/image/hero-wedding.jpg";
import FeatureShell from "./FeatureShell";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";
import {
  INITIAL_HOTELS,
  INITIAL_LOCAL_GUIDES,
  INITIAL_SHUTTLES,
  SAMPLE_GUEST_NEEDS,
} from "./travel/constants";

export default function TravelPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { wedding } = useCurrentWedding();

  const venueName = wedding?.venue_name || "Sảnh Hoa Mai - Trung tâm Hội nghị White Palace";
  const venueAddress = wedding?.venue_address || "194 Hoàng Văn Thụ, Phường 9, Phú Nhuận, TP. Hồ Chí Minh";
  const promoCode = "EVERWEB20";

  const { data: travelData, saveSection } = useWeddingFeature(
    wedding,
    "travel_config",
    {
      hotels: INITIAL_HOTELS,
      shuttles: INITIAL_SHUTTLES,
      promoCode: "EVERWEB20",
      guestNote:
        "Tụi mình đã làm việc và giữ khối phòng ưu đãi riêng giảm đến 20% cho khách tham dự tiệc cưới. Quý khách ở xa hãy đọc mã EVERWEB20 hoặc đặt qua link bên dưới để nhận giá tốt nhất nhé!",
    }
  );

  const [activeTab, setActiveTab] = useState("hotels");
  const [starFilter, setStarFilter] = useState("all");

  const hotels = useMemo(() => travelData.hotels || INITIAL_HOTELS, [travelData.hotels]);
  const shuttles = useMemo(() => travelData.shuttles || INITIAL_SHUTTLES, [travelData.shuttles]);
  const guestNote = travelData.guestNote || "";

  // Modal States
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [hotelForm, setHotelForm] = useState({
    name: "",
    stars: 5,
    distance: "",
    address: "",
    price: "",
    originalPrice: "",
    code: "EVERWEB20",
    phone: "",
    isHostHotel: false,
    bookingUrl: "",
    amenitiesText: "Bữa sáng buffet, Hồ bơi, Gần sảnh tiệc",
  });

  const [isAddShuttleOpen, setIsAddShuttleOpen] = useState(false);
  const [shuttleForm, setShuttleForm] = useState({
    route: "",
    type: "Limousine 16 chỗ",
    departureTimes: "",
    pickupLocation: "",
    driverInfo: "",
    note: "",
  });

  const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState(guestNote);

  // Copy helper
  const handleCopy = (text, label) => {
    navigator.clipboard?.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  // Filtered Hotels
  const filteredHotels = useMemo(() => {
    if (starFilter === "all") return hotels;
    if (starFilter === "host") return hotels.filter((h) => h.isHostHotel);
    if (starFilter === "5star") return hotels.filter((h) => Number(h.stars) === 5);
    if (starFilter === "4star") return hotels.filter((h) => Number(h.stars) === 4);
    if (starFilter === "near") return hotels.filter((h) => h.distance.includes("m") || h.distance.includes("0."));
    return hotels;
  }, [hotels, starFilter]);

  // Hotel Handlers
  const handleOpenAddHotel = () => {
    setEditingHotel(null);
    setHotelForm({
      name: "",
      stars: 5,
      distance: "",
      address: "",
      price: "",
      originalPrice: "",
      code: promoCode,
      phone: "",
      isHostHotel: false,
      bookingUrl: "",
      amenitiesText: "Bữa sáng buffet, Hồ bơi, Check-in sớm",
    });
    setIsAddHotelOpen(true);
  };

  const handleOpenEditHotel = (h) => {
    setEditingHotel(h);
    setHotelForm({
      name: h.name,
      stars: h.stars || 5,
      distance: h.distance || "",
      address: h.address || "",
      price: h.price || "",
      originalPrice: h.originalPrice || "",
      code: h.code || promoCode,
      phone: h.phone || "",
      isHostHotel: Boolean(h.isHostHotel),
      bookingUrl: h.bookingUrl || "",
      amenitiesText: (h.amenities || []).join(", "),
    });
    setIsAddHotelOpen(true);
  };

  const handleSaveHotel = (e) => {
    e.preventDefault();
    if (!hotelForm.name.trim()) return;

    const amenitiesList = hotelForm.amenitiesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newHotel = {
      id: editingHotel ? editingHotel.id : `h-${Date.now()}`,
      name: hotelForm.name.trim(),
      stars: Number(hotelForm.stars) || 5,
      distance: hotelForm.distance.trim() || "Gần sảnh tiệc",
      address: hotelForm.address.trim() || venueAddress,
      price: hotelForm.price.trim() || "Liên hệ nhận giá ưu đãi",
      originalPrice: hotelForm.originalPrice.trim() || "",
      code: hotelForm.code.trim() || promoCode,
      phone: hotelForm.phone.trim() || "",
      isHostHotel: Boolean(hotelForm.isHostHotel),
      rating: editingHotel?.rating || "9.2",
      reviewCount: editingHotel?.reviewCount || 120,
      amenities: amenitiesList.length > 0 ? amenitiesList : ["Bữa sáng", "Wi-Fi miễn phí"],
      image: editingHotel?.image || heroWedding,
      bookingUrl: hotelForm.bookingUrl.trim() || "",
    };

    const nextHotels = editingHotel
      ? hotels.map((h) => (h.id === editingHotel.id ? newHotel : h))
      : [newHotel, ...hotels];

    saveSection({ hotels: nextHotels });
    toast.success(editingHotel ? "Đã cập nhật thông tin khách sạn" : "Đã thêm khách sạn gợi ý mới");
    setIsAddHotelOpen(false);
  };

  const handleDeleteHotel = (id) => {
    const nextHotels = hotels.filter((h) => h.id !== id);
    saveSection({ hotels: nextHotels });
    toast.info("Đã xóa khách sạn khỏi danh sách");
  };

  // Shuttle Handlers
  const handleSaveShuttle = (e) => {
    e.preventDefault();
    if (!shuttleForm.route.trim()) return;

    const newShuttle = {
      id: `sh-${Date.now()}`,
      route: shuttleForm.route.trim(),
      type: shuttleForm.type.trim() || "Xe 16 chỗ",
      departureTimes: shuttleForm.departureTimes.trim() || "Theo thông báo",
      pickupLocation: shuttleForm.pickupLocation.trim() || "Điểm đón trung tâm",
      driverInfo: shuttleForm.driverInfo.trim() || "Đang cập nhật",
      note: shuttleForm.note.trim() || "Xe đưa đón miễn phí dành cho khách mời.",
      status: "Đang mở đăng ký",
    };

    saveSection({ shuttles: [...shuttles, newShuttle] });
    toast.success("Đã thêm tuyến xe đưa đón khách mời");
    setIsAddShuttleOpen(false);
    setShuttleForm({
      route: "",
      type: "Limousine 16 chỗ",
      departureTimes: "",
      pickupLocation: "",
      driverInfo: "",
      note: "",
    });
  };

  const handleDeleteShuttle = (id) => {
    const next = shuttles.filter((s) => s.id !== id);
    saveSection({ shuttles: next });
    toast.info("Đã xóa tuyến xe đưa đón");
  };

  return (
    <FeatureShell
      title="Lưu trú & Đi lại (Travel & Accommodations)"
      subtitle={`Địa điểm tiệc cưới: ${venueName}`}
      wedding={wedding}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              navigate(ROUTE_PATHS.MESSAGING, {
                state: { wedding, draftType: "accommodations" },
              })
            }
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1F1A17] hover:border-[#3B52DE] hover:bg-stone-50 transition"
          >
            <MessageSquare size={13} className="text-[#3B52DE]" /> Gửi khảo sát nơi ở
          </button>
          <button
            type="button"
            onClick={() => handleCopy(`${window.location.origin}/w/${wedding?.slug || "khang-an"}`, "link cẩm nang")}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1F1A17] hover:border-[#3B52DE] hover:bg-stone-50 transition"
          >
            <Share2 size={13} /> Chia sẻ
          </button>
          <button
            type="button"
            onClick={handleOpenAddHotel}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1F1A17] px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition shadow-xs cursor-pointer active:scale-95"
          >
            <Plus size={14} /> Thêm khách sạn
          </button>
        </div>
      }
    >
      {/* =========================================================================
          HERO OVERVIEW: BẢO CHỨNG LƯU TRÚ & SẢNH CƯỚI
         ========================================================================= */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Khối Địa điểm tiệc cưới & Chỉ đường */}
        <div className="lg:col-span-7 rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold tracking-wider text-stone-700 uppercase">
                <MapPin size={13} className="text-rose-500" /> Địa điểm tổ chức hôn lễ
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venueName} ${venueAddress}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#3B52DE] hover:underline"
              >
                <span>Mở Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <h2 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-[#1F1A17]">
              {venueName}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-600 flex items-start gap-1.5">
              <span>{venueAddress}</span>
            </p>

            {/* Thống kê tiện ích sảnh */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-stone-100 pt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Plane size={15} />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400">Cách Tân Sơn Nhất</p>
                  <p className="font-semibold text-[#1F1A17]">25 phút taxi</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Car size={15} />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400">Bãi đỗ ô tô & xe máy</p>
                  <p className="font-semibold text-emerald-700">Miễn phí 100%</p>
                </div>
              </div>

              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Bus size={15} />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400">Xe đưa đón khách</p>
                  <p className="font-semibold text-[#1F1A17]">2 tuyến miễn phí</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => handleCopy(`${venueName}, ${venueAddress}`, "địa chỉ sảnh tiệc")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
            >
              <Copy size={13} /> Sao chép địa chỉ
            </button>
            <button
              type="button"
              onClick={() => handleCopy("WHITE_PALACE_PARKING", "chỉ dẫn đỗ xe")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
            >
              <Navigation size={13} /> Hướng dẫn đỗ xe
            </button>
          </div>
        </div>

        {/* Khối Khối phòng ưu đãi tiệc cưới (Wedding Room Block) */}
        <div className="lg:col-span-5 rounded-3xl border border-stone-200 bg-stone-50/70 p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-0.5 text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                <Sparkles size={12} className="text-amber-600" /> Khối phòng ưu đãi 20%
              </span>
              <button
                type="button"
                onClick={() => {
                  setNoteDraft(guestNote);
                  setIsEditNoteOpen(true);
                }}
                className="text-xs font-semibold text-[#3B52DE] hover:underline inline-flex items-center gap-1"
              >
                <Edit3 size={12} /> Chỉnh sửa
              </button>
            </div>

            <div>
              <p className="text-xs text-stone-500 font-medium">Mã đặt phòng đặc quyền tiệc cưới</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="rounded-2xl border-2 border-dashed border-stone-300 bg-white px-4 py-2 font-mono text-base sm:text-lg font-bold tracking-wider text-[#1F1A17]">
                  {promoCode}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(promoCode, "mã ưu đãi")}
                  className="rounded-xl bg-[#1F1A17] p-2.5 text-white hover:bg-stone-800 transition"
                  title="Sao chép mã ưu đãi"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-stone-600 bg-white/80 p-3.5 rounded-2xl border border-stone-200/60">
              "{guestNote}"
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-500">
            <span>Hạn áp dụng ưu đãi: Trước 7 ngày</span>
            <span className="font-semibold text-emerald-700">Tiết kiệm 400k - 800k/đêm</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB NAVIGATION CÂN ĐỐI
         ========================================================================= */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {[
            { key: "hotels", label: "Nơi lưu trú & Khách sạn", count: hotels.length, icon: Building2 },
            { key: "shuttles", label: "Xe đưa đón & Lộ trình", count: shuttles.length, icon: Bus },
            { key: "guides", label: "Ẩm thực & Điểm đến", count: INITIAL_LOCAL_GUIDES.length, icon: Compass },
            { key: "survey", label: "Nhu cầu khách ở xa", count: SAMPLE_GUEST_NEEDS.length, icon: BedDouble },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  active
                    ? "bg-[#1F1A17] text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900"
                }`}
              >
                <Icon size={14} />
                <span>{t.label}</span>
                <span
                  className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                    active ? "bg-white/20 text-white" : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {activeTab === "hotels" && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-400 text-[11px] font-medium hidden sm:inline">Lọc:</span>
            {[
              { key: "all", label: "Tất cả" },
              { key: "host", label: "Khách sạn chính" },
              { key: "5star", label: "5 sao" },
              { key: "4star", label: "4 sao" },
              { key: "near", label: "Gần nhất" },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setStarFilter(f.key)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                  starFilter === f.key
                    ? "bg-stone-200 text-[#1F1A17]"
                    : "text-stone-500 hover:bg-stone-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          TAB 1: KHÁCH SẠN & NƠI LƯU TRÚ
         ========================================================================= */}
      {activeTab === "hotels" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredHotels.map((h) => (
              <div
                key={h.id}
                className="group flex flex-col justify-between rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200"
              >
                {/* Ảnh Khách sạn */}
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={h.image || heroWedding}
                    alt={h.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                  {/* Badge Host Hotel nếu có */}
                  {h.isHostHotel && (
                    <div className="absolute top-3 left-3 rounded-full bg-amber-400 text-stone-950 px-2.5 py-0.5 text-[10px] font-bold shadow-xs flex items-center gap-1 uppercase tracking-wider">
                      <Heart size={10} className="fill-current" /> Nơi CD-CR ở
                    </div>
                  )}

                  {/* Badge số sao & Điểm */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1">
                      {Array.from({ length: h.stars || 5 }).map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                      ))}
                    </span>
                    <span className="rounded-lg bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[11px] font-bold">
                      ★ {h.rating || "9.4"} / 10
                    </span>
                  </div>
                </div>

                {/* Nội dung chi tiết */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-[#1F1A17] leading-snug group-hover:text-[#3B52DE] transition">
                        {h.name}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditHotel(h)}
                          className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition"
                          title="Sửa thông tin"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteHotel(h.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Xóa khách sạn"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-700">
                      <MapPin size={13} /> {h.distance}
                    </p>
                    <p className="mt-0.5 text-[11px] text-stone-500 line-clamp-1">{h.address}</p>

                    {/* Tiện ích */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(h.amenities || []).map((am, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600"
                        >
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Giá & Thao tác */}
                  <div className="border-t border-stone-100 pt-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Giá ưu đãi tiệc cưới</span>
                        <span className="text-sm sm:text-base font-bold text-[#1F1A17] tabular-nums">
                          {h.price}
                        </span>
                      </div>
                      {h.originalPrice && (
                        <span className="text-xs text-stone-400 line-through tabular-nums">
                          {h.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(`${h.name} - ĐT: ${h.phone || "028 3823 3333"} (Mã: ${h.code || promoCode})`, "thông tin đặt phòng")}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                      >
                        <Copy size={12} /> Sao chép
                      </button>
                      <a
                        href={h.bookingUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1F1A17] py-2 text-xs font-semibold text-white hover:bg-stone-800 transition"
                      >
                        <span>Đặt phòng</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hộp mẹo đặt phòng */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-5 flex items-start gap-3 text-xs text-stone-600">
            <Info size={18} className="text-[#3B52DE] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#1F1A17]">Mẹo cho cô dâu chú rể:</p>
              <p className="mt-0.5 leading-relaxed">
                Khi khách mời đặt phòng qua mã <span className="font-bold text-[#1F1A17]">{promoCode}</span>, khách sạn sẽ tự động ghi chú phòng tiệc cưới để hỗ trợ nhận phòng sớm (nếu có phòng trống) và chuẩn bị quà chào mừng đặc biệt từ gia đình.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: XE ĐƯA ĐÓN & LỘ TRÌNH DI CHUYỂN
         ========================================================================= */}
      {activeTab === "shuttles" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1F1A17]">Lịch trình xe đưa đón khách mời</h3>
              <p className="text-xs text-stone-500">Xe đời mới có điều hòa, nước khoáng & gắn biển đón đoàn cưới</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddShuttleOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1F1A17] hover:border-[#3B52DE]"
            >
              <Plus size={13} /> Thêm tuyến xe
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {shuttles.map((s) => (
              <div
                key={s.id}
                className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                        <Bus size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {s.type}
                        </span>
                        <h4 className="mt-1 text-sm font-bold text-[#1F1A17] leading-snug">{s.route}</h4>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteShuttle(s.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Xóa tuyến"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="rounded-2xl bg-stone-50 p-3.5 space-y-2 text-xs border border-stone-100">
                    <div className="flex items-center gap-2 text-stone-700">
                      <Clock size={13} className="text-stone-400" />
                      <span className="text-stone-500">Giờ xuất phát:</span>
                      <span className="font-bold text-[#1F1A17]">{s.departureTimes}</span>
                    </div>

                    <div className="flex items-start gap-2 text-stone-700">
                      <MapPin size={13} className="text-stone-400 mt-0.5" />
                      <div>
                        <span className="text-stone-500">Điểm đón: </span>
                        <span className="font-medium text-[#1F1A17]">{s.pickupLocation}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-stone-700">
                      <Phone size={13} className="text-stone-400" />
                      <span className="text-stone-500">Liên hệ tài xế:</span>
                      <span className="font-medium text-[#1F1A17]">{s.driverInfo}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 italic">"{s.note}"</p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <Check size={13} /> {s.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${s.route} - Giờ đón: ${s.departureTimes} - Điểm đón: ${s.pickupLocation} (${s.driverInfo})`, "lịch trình xe")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#3B52DE] hover:underline"
                  >
                    <Share2 size={12} /> Gửi cho khách
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Hướng dẫn phương tiện cá nhân */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3">
                <Car size={18} />
              </div>
              <h4 className="text-sm font-bold text-[#1F1A17]">Đi bằng Ô tô riêng</h4>
              <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                Hầm xe B1 & B2 có bảo vệ hướng dẫn trực tiếp. Quý khách vào sảnh chính bằng thang máy sảnh tiệc. Miễn phí gửi xe.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3">
                <Navigation size={18} />
              </div>
              <h4 className="text-sm font-bold text-[#1F1A17]">Đi bằng Grab / Taxi</h4>
              <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                Điểm trả khách tại sảnh chính: <span className="font-semibold text-[#1F1A17]">{venueName}</span>. Nhân viên sảnh sẽ mở cửa xe và hướng dẫn vào sảnh tiệc.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
                <Plane size={18} />
              </div>
              <h4 className="text-sm font-bold text-[#1F1A17]">Khách từ sân bay đến</h4>
              <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                Sân bay Tân Sơn Nhất cách sảnh khoảng 25 phút. Khuyên dùng Taxi Vinasun (028 3827 2727) hoặc Mai Linh tại làn đón khách ngoài sảnh ga.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: GỢI Ý ẨM THỰC & THAM QUAN
         ========================================================================= */}
      {activeTab === "guides" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#1F1A17]">Gợi ý địa điểm thư giãn quanh sảnh tiệc</h3>
            <p className="text-xs text-stone-500">Dành cho bạn bè và khách quý ở xa có thời gian khám phá Sài Gòn</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INITIAL_LOCAL_GUIDES.map(({ id, title, category, distance, highlight, address, icon: Icon }) => (
              <div
                key={id}
                className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-5 shadow-2xs hover:border-[#3B52DE] transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100 text-[#1F1A17]">
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider bg-stone-50 px-2 py-0.5 rounded-md">
                      {category}
                    </span>
                  </div>

                  <h4 className="mt-3 text-sm font-bold text-[#1F1A17]">{title}</h4>
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                    <MapPin size={11} /> {distance}
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-stone-600">
                    {highlight}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[11px] truncate max-w-[150px]">{address}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${title} ${address}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#3B52DE] hover:underline shrink-0"
                  >
                    Bản đồ →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: KHẢO SÁT NHU CẦU KHÁCH Ở XA
         ========================================================================= */}
      {activeTab === "survey" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#1F1A17]">Khảo sát & Tổng hợp nhu cầu lưu trú</h3>
              <p className="mt-0.5 text-xs text-stone-500">
                Gửi câu hỏi khảo sát trực tiếp qua SMS / Email để khách phản hồi thời gian đến và chọn xe đón
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                navigate(ROUTE_PATHS.MESSAGING, {
                  state: { wedding, draftType: "accommodations" },
                })
              }
              className="inline-flex items-center gap-2 rounded-full bg-[#1F1A17] px-5 py-2.5 text-xs font-semibold text-white hover:bg-stone-800 transition shadow-xs shrink-0"
            >
              <MessageSquare size={14} /> Soạn tin nhắn gửi khách ở xa
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white">
            <table className="min-w-full divide-y divide-stone-100 text-xs">
              <thead className="bg-stone-50 text-left font-semibold text-stone-700">
                <tr>
                  <th className="px-5 py-3.5">Khách mời / Nhóm</th>
                  <th className="px-5 py-3.5 text-center">Số lượng</th>
                  <th className="px-5 py-3.5">Khách sạn chọn</th>
                  <th className="px-5 py-3.5">Đăng ký xe đón</th>
                  <th className="px-5 py-3.5">Trạng thái hỗ trợ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {SAMPLE_GUEST_NEEDS.map((g) => (
                  <tr key={g.id} className="hover:bg-stone-50/70 transition">
                    <td className="px-5 py-4 font-bold text-[#1F1A17]">{g.name}</td>
                    <td className="px-5 py-4 text-center font-semibold text-stone-700">{g.count} người</td>
                    <td className="px-5 py-4 text-stone-600">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#1F1A17]">
                        <Building2 size={13} className="text-stone-400" /> {g.hotel}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                        <Bus size={13} /> {g.shuttle}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-800">
                        <Check size={11} className="text-emerald-600" /> {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: THÊM / SỬA KHÁCH SẠN
         ========================================================================= */}
      <Modal
        isOpen={isAddHotelOpen}
        onClose={() => setIsAddHotelOpen(false)}
        title={editingHotel ? "Chỉnh sửa thông tin khách sạn" : "Thêm khách sạn gợi ý mới"}
        size="md"
      >
        <form onSubmit={handleSaveHotel} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Tên khách sạn *</label>
            <input
              type="text"
              required
              value={hotelForm.name}
              onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
              placeholder="VD: Lotte Hotel Saigon"
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Hạng sao</label>
              <select
                value={hotelForm.stars}
                onChange={(e) => setHotelForm({ ...hotelForm, stars: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
              >
                <option value={5}>5 sao cao cấp</option>
                <option value={4}>4 sao sang trọng</option>
                <option value={3}>3 sao tiện nghi</option>
                <option value={2}>Căn hộ / Homestay</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Khoảng cách đến sảnh cưới</label>
              <input
                type="text"
                value={hotelForm.distance}
                onChange={(e) => setHotelForm({ ...hotelForm, distance: e.target.value })}
                placeholder="VD: Cách sảnh 800 m"
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Địa chỉ cụ thể</label>
            <input
              type="text"
              value={hotelForm.address}
              onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
              placeholder="VD: 2A-4A Tôn Đức Thắng, Quận 1"
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Giá ưu đãi tiệc cưới</label>
              <input
                type="text"
                value={hotelForm.price}
                onChange={(e) => setHotelForm({ ...hotelForm, price: e.target.value })}
                placeholder="VD: 2.400.000 đ / đêm"
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Giá gốc niêm yết (nếu có)</label>
              <input
                type="text"
                value={hotelForm.originalPrice}
                onChange={(e) => setHotelForm({ ...hotelForm, originalPrice: e.target.value })}
                placeholder="VD: 3.100.000 đ"
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Mã ưu đãi (Promo Code)</label>
              <input
                type="text"
                value={hotelForm.code}
                onChange={(e) => setHotelForm({ ...hotelForm, code: e.target.value })}
                placeholder="VD: EVERWEB20"
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Hotline / Số điện thoại lễ tân</label>
              <input
                type="text"
                value={hotelForm.phone}
                onChange={(e) => setHotelForm({ ...hotelForm, phone: e.target.value })}
                placeholder="VD: 028 3823 3333"
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Đường dẫn đặt phòng (Website / Agoda / Booking)</label>
            <input
              type="text"
              value={hotelForm.bookingUrl}
              onChange={(e) => setHotelForm({ ...hotelForm, bookingUrl: e.target.value })}
              placeholder="VD: https://www.lottehotel.com/saigon"
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Các tiện ích nổi bật (phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              value={hotelForm.amenitiesText}
              onChange={(e) => setHotelForm({ ...hotelForm, amenitiesText: e.target.value })}
              placeholder="VD: Bữa sáng buffet, Hồ bơi vô cực, Gần phố đi bộ"
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isHostHotel"
              checked={hotelForm.isHostHotel}
              onChange={(e) => setHotelForm({ ...hotelForm, isHostHotel: e.target.checked })}
              className="h-4 w-4 rounded-sm border-stone-300 accent-[#1F1A17]"
            />
            <label htmlFor="isHostHotel" className="text-xs font-semibold text-stone-800 cursor-pointer">
              Đánh dấu là "Khách sạn chính" (Nơi cô dâu chú rể hoặc gia đình 2 bên lưu trú)
            </label>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsAddHotelOpen(false)}
              className="rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#1F1A17] px-5 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition"
            >
              {editingHotel ? "Cập nhật khách sạn" : "Thêm vào danh sách"}
            </button>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          MODAL: THÊM TUYẾN XE ĐƯA ĐÓN
         ========================================================================= */}
      <Modal
        isOpen={isAddShuttleOpen}
        onClose={() => setIsAddShuttleOpen(false)}
        title="Thêm tuyến xe đưa đón khách mời"
        size="md"
      >
        <form onSubmit={handleSaveShuttle} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Tên lộ trình / Tuyến xe *</label>
            <input
              type="text"
              required
              value={shuttleForm.route}
              onChange={(e) => setShuttleForm({ ...shuttleForm, route: e.target.value })}
              placeholder="VD: Tuyến Sân bay Tân Sơn Nhất → Sảnh White Palace"
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Loại xe</label>
              <select
                value={shuttleForm.type}
                onChange={(e) => setShuttleForm({ ...shuttleForm, type: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
              >
                <option value="Limousine 16 chỗ">Limousine 16 chỗ</option>
                <option value="Xe Universe 29 chỗ">Xe Universe 29 chỗ</option>
                <option value="Xe Universe 45 chỗ">Xe Universe 45 chỗ</option>
                <option value="Xe 7 chỗ cao cấp">Xe 7 chỗ cao cấp</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Khung giờ xuất phát</label>
              <input
                type="text"
                value={shuttleForm.departureTimes}
                onChange={(e) => setShuttleForm({ ...shuttleForm, departureTimes: e.target.value })}
                placeholder="VD: 10:30 & 16:00"
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Điểm đón chi tiết</label>
            <input
              type="text"
              value={shuttleForm.pickupLocation}
              onChange={(e) => setShuttleForm({ ...shuttleForm, pickupLocation: e.target.value })}
              placeholder="VD: Cột 12 - Ga Quốc nội Tân Sơn Nhất"
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Thông tin tài xế & Biển số xe</label>
            <input
              type="text"
              value={shuttleForm.driverInfo}
              onChange={(e) => setShuttleForm({ ...shuttleForm, driverInfo: e.target.value })}
              placeholder="VD: Bác Tuấn (0908 123 456) · Biển 51B-289.45"
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#3B52DE]"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Ghi chú cho khách mời</label>
            <textarea
              rows={2}
              value={shuttleForm.note}
              onChange={(e) => setShuttleForm({ ...shuttleForm, note: e.target.value })}
              placeholder="VD: Xe có gắn biển tên 'Khang & Khanh Wedding' để khách dễ nhận diện."
              className="w-full rounded-xl border border-stone-200 p-2.5 text-xs outline-none focus:border-[#3B52DE]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsAddShuttleOpen(false)}
              className="rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#1F1A17] px-5 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition"
            >
              Thêm tuyến xe
            </button>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          MODAL: SỬA LỜI NHẮN & MÃ ƯU ĐÃI
         ========================================================================= */}
      <Modal
        isOpen={isEditNoteOpen}
        onClose={() => setIsEditNoteOpen(false)}
        title="Chỉnh sửa thông điệp lưu trú tiệc cưới"
        size="sm"
      >
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Lời nhắn gửi khách ở xa</label>
            <textarea
              rows={4}
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              className="w-full rounded-xl border border-stone-200 p-3 text-xs outline-none focus:border-[#3B52DE] leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsEditNoteOpen(false)}
              className="rounded-full border border-stone-200 px-4 py-1.5 text-xs font-semibold text-stone-700"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => {
                saveSection({ guestNote: noteDraft.trim() });
                toast.success("Đã cập nhật lời nhắn lưu trú");
                setIsEditNoteOpen(false);
              }}
              className="rounded-full bg-[#1F1A17] px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition"
            >
              Lưu lời nhắn
            </button>
          </div>
        </div>
      </Modal>
    </FeatureShell>
  );
}
