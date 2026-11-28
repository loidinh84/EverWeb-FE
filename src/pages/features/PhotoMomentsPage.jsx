import { useMemo, useState } from "react";
import {
  Camera,
  Check,
  Copy,
  Download,
  ExternalLink,
  FolderPlus,
  Globe,
  Heart,
  Image as ImageIcon,
  Maximize2,
  Play,
  Plus,
  QrCode,
  Settings,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import galleryBouquet from "../../assets/image/gallery-bouquet.jpg";
import galleryCeremony from "../../assets/image/gallery-ceremony.jpg";
import galleryDining from "../../assets/image/gallery-dining.jpg";
import heroWedding from "../../assets/image/hero-wedding.jpg";
import weddingCouple from "../../assets/image/wedding-couple.jpg";
import FeatureShell from "./FeatureShell";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";
import { buildQrCodeUrl } from "../../utils/weddingHelpers";

const DEFAULT_ALBUMS = [
  {
    id: "alb-engagement",
    name: "Ảnh Pre-Wedding & Đính hôn",
    kind: "custom",
    visibility: "Công khai",
    likesOn: true,
    commentsOn: true,
    cover: heroWedding,
    photos: [
      { id: "p1", url: heroWedding, caption: "Khoảnh khắc hoàng hôn lãng mạn tại Đà Lạt", likes: 48 },
      { id: "p2", url: weddingCouple, caption: "Nụ cười rạng rỡ của cô dâu chú rể", likes: 62 },
      { id: "p3", url: galleryCeremony, caption: "Lễ đính hôn ấm cúng cùng hai bên gia đình", likes: 35 },
      { id: "p4", url: galleryBouquet, caption: "Bó hoa cưới hoa linh lan trắng tinh khôi", likes: 29 },
    ],
  },
  {
    id: "alb-event",
    name: "Khoảnh khắc tiệc cưới (Khách gửi qua QR)",
    kind: "event",
    visibility: "Công khai",
    likesOn: true,
    commentsOn: true,
    cover: galleryDining,
    photos: [
      { id: "p5", url: galleryCeremony, caption: "Khoảnh khắc tiến vào lễ đường cùng bố mẹ", likes: 54 },
      { id: "p6", url: galleryDining, caption: "Bàn tiệc tối lung linh ánh nến Sảnh Hoa Mai", likes: 41 },
      { id: "p7", url: heroWedding, caption: "Cắt bánh kem & nâng ly chúc mừng", likes: 38 },
    ],
  },
  {
    id: "alb-decor",
    name: "Không gian trang trí & Hậu trường",
    kind: "system",
    visibility: "Công khai",
    likesOn: true,
    commentsOn: true,
    cover: galleryBouquet,
    photos: [
      { id: "p8", url: galleryBouquet, caption: "Cổng hoa tươi nhập khẩu tông màu pastel", likes: 27 },
      { id: "p9", url: galleryDining, caption: "Chi tiết set bàn tiệc & bảng tên từng khách", likes: 33 },
    ],
  },
];

const SAMPLE_PHOTO_PRESETS = [
  { name: "Bàn tiệc tối lung linh", url: galleryDining },
  { name: "Cổng hoa lễ đường", url: galleryCeremony },
  { name: "Hoa cưới cầm tay", url: galleryBouquet },
  { name: "Cô dâu chú rể hạnh phúc", url: weddingCouple },
  { name: "Ảnh kỷ niệm ngoài trời", url: heroWedding },
];

export default function PhotoMomentsPage() {
  const toast = useToast();
  const { wedding } = useCurrentWedding();

  const coupleNames = (wedding?.title || "Trần Thanh Khang & Mai Khanh").normalize("NFC");
  const photoSlug = wedding?.slug || "khang-an";
  const shareUrl = `${window.location.origin}/w/${photoSlug}`;
  const qrImgUrl = buildQrCodeUrl(shareUrl, 300);

  const { data: webConfig, saveSection } = useWeddingFeature(
    wedding,
    "website_config",
    {
      photoAlbums: DEFAULT_ALBUMS,
      allowGuestUpload: true,
      requireModeration: false,
    }
  );

  const albums = useMemo(
    () => (Array.isArray(webConfig.photoAlbums) && webConfig.photoAlbums.length > 0 ? webConfig.photoAlbums : DEFAULT_ALBUMS),
    [webConfig.photoAlbums]
  );
  const allowGuestUpload = webConfig.allowGuestUpload ?? true;
  const requireModeration = webConfig.requireModeration ?? false;

  const [activeTab, setActiveTab] = useState("all"); // all | albums | qr | settings
  const [selectedAlbumId, setSelectedAlbumId] = useState("all");

  // Modals
  const [isAddAlbumOpen, setIsAddAlbumOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [targetAlbumId, setTargetAlbumId] = useState(albums[0]?.id || "alb-engagement");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState(null);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  // Flattened photos
  const allPhotos = useMemo(
    () =>
      albums.flatMap((a) =>
        a.photos.map((p) => ({
          ...p,
          albumId: a.id,
          albumName: a.name,
        }))
      ),
    [albums]
  );

  // Filtered photos based on album filter
  const displayedPhotos = useMemo(() => {
    if (selectedAlbumId === "all") return allPhotos;
    return allPhotos.filter((p) => p.albumId === selectedAlbumId);
  }, [allPhotos, selectedAlbumId]);

  const totalLikes = useMemo(
    () => allPhotos.reduce((sum, p) => sum + (Number(p.likes) || 0), 0),
    [allPhotos]
  );

  const handleCopy = (text, label) => {
    navigator.clipboard?.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  const handleCreateAlbum = (e) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;
    const created = {
      id: `alb-${Date.now()}`,
      name: newAlbumName.trim(),
      kind: "custom",
      visibility: "Công khai",
      likesOn: true,
      commentsOn: true,
      cover: heroWedding,
      photos: [],
    };
    saveSection({ photoAlbums: [...albums, created] });
    setNewAlbumName("");
    setIsAddAlbumOpen(false);
    toast.success(`Đã tạo album mới: "${created.name}"`);
  };

  const handleAddPhoto = (e) => {
    e.preventDefault();
    const finalUrl = photoUrl.trim();
    if (!finalUrl) {
      toast.error("Vui lòng nhập đường dẫn hoặc chọn ảnh mẫu");
      return;
    }
    const destId = targetAlbumId || albums[0]?.id;
    const newPhoto = {
      id: `ph-${Date.now()}`,
      url: finalUrl,
      caption: photoCaption.trim() || "Khoảnh khắc tiệc cưới đáng nhớ",
      likes: 1,
    };

    const next = albums.map((a) =>
      a.id === destId ? { ...a, photos: [newPhoto, ...a.photos], cover: finalUrl } : a
    );

    saveSection({ photoAlbums: next });
    setPhotoUrl("");
    setPhotoCaption("");
    setIsAddPhotoOpen(false);
    toast.success("Đã thêm ảnh vào album");
  };

  const handleDeletePhoto = (albumId, photoId) => {
    const next = albums.map((a) =>
      a.id === albumId ? { ...a, photos: a.photos.filter((p) => p.id !== photoId) } : a
    );
    saveSection({ photoAlbums: next });
    if (activeLightboxPhoto?.id === photoId) setActiveLightboxPhoto(null);
    toast.info("Đã xóa ảnh khỏi album");
  };

  const handleLikePhoto = (albumId, photoId) => {
    const next = albums.map((a) =>
      a.id === albumId
        ? {
            ...a,
            photos: a.photos.map((p) => (p.id === photoId ? { ...p, likes: (p.likes || 0) + 1 } : p)),
          }
        : a
    );
    saveSection({ photoAlbums: next });
    if (activeLightboxPhoto?.id === photoId) {
      setActiveLightboxPhoto((prev) => (prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null));
    }
    toast.success("Đã thả tim khoảnh khắc ❤️");
  };

  return (
    <FeatureShell
      title="Album ảnh & QR Khoảnh khắc"
      subtitle={`Lưu trữ ${allPhotos.length} ảnh kỷ niệm · Khách quét mã QR gửi ảnh trực tiếp`}
      wedding={wedding}
      actions={
        <div className="flex items-center gap-2">
          {/* Nút Live Slideshow cho màn hình LED */}
          <button
            type="button"
            onClick={() => {
              setSlideshowIndex(0);
              setIsSlideshowOpen(true);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1F1A17] hover:border-[#3B52DE] hover:bg-stone-50 transition"
          >
            <Play size={13} className="text-[#3B52DE]" /> Chiếu màn hình LED
          </button>

          {/* Nút In Standee / QR */}
          <button
            type="button"
            onClick={() => setActiveTab("qr")}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1F1A17] hover:border-[#3B52DE] hover:bg-stone-50 transition"
          >
            <QrCode size={13} /> QR để bàn tiệc
          </button>

          {/* Nút Thêm ảnh mới */}
          <button
            type="button"
            onClick={() => setIsAddPhotoOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1F1A17] px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition shadow-xs active:scale-95"
          >
            <Plus size={14} /> Thêm ảnh mới
          </button>
        </div>
      }
    >
      {/* =========================================================================
          HERO OVERVIEW CARD: THỐNG KÊ KHOẢNH KHẮC & TÍNH NĂNG QUÉT QR BÀN TIỆC
         ========================================================================= */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Khối Cổng Live Photo Stream cho khách tiệc cưới */}
        <div className="lg:col-span-7 rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold tracking-wider text-stone-700 uppercase">
                <Camera size={13} className="text-[#3B52DE]" /> Cổng thu thập ảnh tiệc cưới trực tiếp
              </span>
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#3B52DE] hover:underline"
              >
                <span>Xem Album công khai</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <h2 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-[#1F1A17]">
              Lưu giữ mọi góc nhìn & nụ cười từ khách mời
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-600 leading-relaxed">
              Khách tham dự chỉ cần dùng camera điện thoại quét mã QR đặt tại bàn tiệc để tải ảnh và gửi lời chúc lên album chung mà không cần cài đặt bất kỳ ứng dụng nào.
            </p>

            {/* Link box sao chép nhanh */}
            <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-2 sm:p-2.5">
              <div className="flex items-center gap-2 pl-2 overflow-hidden">
                <Globe size={16} className="text-stone-400 shrink-0" />
                <span className="font-mono text-xs font-semibold text-[#1F1A17] truncate">
                  {shareUrl}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(shareUrl, "link album ảnh")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F1A17] px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition shrink-0 cursor-pointer"
              >
                <Copy size={13} />
                <span>Sao chép link</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 pt-4 border-t border-stone-100 text-xs">
            <button
              type="button"
              onClick={() => {
                setSlideshowIndex(0);
                setIsSlideshowOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-1.5 font-semibold text-stone-700 hover:bg-stone-100 transition"
            >
              <Play size={13} className="text-[#3B52DE]" /> Bật trình chiếu Live Slideshow (LED)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("qr")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-1.5 font-semibold text-stone-700 hover:bg-stone-100 transition"
            >
              <QrCode size={13} /> Tải mã Standee in để bàn
            </button>
          </div>
        </div>

        {/* Khối Thống kê & Trạng thái tải ảnh */}
        <div className="lg:col-span-5 rounded-3xl border border-stone-200 bg-stone-50/70 p-6 sm:p-7 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Thống kê tương tác
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                {allowGuestUpload ? "Khách gửi ảnh tự do" : "Chỉ CD-CR tải ảnh"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5 text-center">
                <ImageIcon size={18} className="mx-auto text-blue-600 mb-1" />
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Tổng Ảnh</span>
                <span className="text-xl font-bold text-[#1F1A17] tabular-nums">{allPhotos.length}</span>
                <span className="text-[10px] text-stone-400 block">khoảnh khắc</span>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-3.5 text-center">
                <FolderPlus size={18} className="mx-auto text-amber-600 mb-1" />
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Số Album</span>
                <span className="text-xl font-bold text-[#1F1A17] tabular-nums">{albums.length}</span>
                <span className="text-[10px] text-stone-400 block">chủ đề</span>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-3.5 text-center">
                <Heart size={18} className="mx-auto text-rose-600 mb-1 fill-rose-500" />
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Thả Tim</span>
                <span className="text-xl font-bold text-[#1F1A17] tabular-nums">{totalLikes}</span>
                <span className="text-[10px] text-stone-400 block">yêu thích</span>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-3.5 text-xs space-y-1">
              <span className="font-semibold text-[#1F1A17] flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" /> Đặc quyền tiệc cưới WithJoy:
              </span>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Ảnh do khách chụp tại bàn tiệc sẽ tự động hiển thị mượt mà trên màn hình LED chính của sân khấu khi bạn bật chế độ Live Slideshow.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs">
            <span className="text-stone-500">Dung lượng: Không giới hạn</span>
            <button
              type="button"
              onClick={() => setIsAddAlbumOpen(true)}
              className="font-semibold text-[#3B52DE] hover:underline"
            >
              + Tạo album chủ đề mới →
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB NAVIGATION CÂN ĐỐI
         ========================================================================= */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "Tất cả khoảnh khắc", count: allPhotos.length, icon: ImageIcon },
            { key: "albums", label: "Danh sách Album cưới", count: albums.length, icon: FolderPlus },
            { key: "qr", label: "Mã QR & Standee bàn tiệc", count: null, icon: QrCode },
            { key: "settings", label: "Cài đặt & Kiểm duyệt", count: null, icon: Settings },
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
                {t.count !== null && (
                  <span
                    className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                      active ? "bg-white/20 text-white" : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === "all" && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-400 text-[11px] font-medium hidden sm:inline">Album:</span>
            <select
              value={selectedAlbumId}
              onChange={(e) => setSelectedAlbumId(e.target.value)}
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1F1A17] outline-none"
            >
              <option value="all">Tất cả Album ({allPhotos.length} ảnh)</option>
              {albums.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.photos.length} ảnh)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* =========================================================================
          TAB 1: LƯỚI ẢNH KHOẢNG KHẮC (MASONRY GRID CAO CẤP)
         ========================================================================= */}
      {activeTab === "all" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayedPhotos.map((p) => (
              <div
                key={p.id}
                className="group relative rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Khung ảnh */}
                <div className="relative h-56 w-full bg-stone-100 overflow-hidden cursor-pointer" onClick={() => setActiveLightboxPhoto(p)}>
                  <img
                    src={p.url}
                    alt={p.caption}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Nút phóng to ảnh */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs shadow-xs hover:bg-black">
                      <Maximize2 size={14} />
                    </span>
                  </div>

                  {/* Tag Album */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-black/50 backdrop-blur-xs text-white px-2.5 py-0.5 text-[10px] font-semibold">
                      {p.albumName}
                    </span>
                  </div>

                  {/* Lượt thả tim */}
                  <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-xs text-white px-2 py-0.5 text-[11px] font-bold">
                      <Heart size={11} className="fill-rose-500 text-rose-500" /> {p.likes || 1}
                    </span>
                  </div>
                </div>

                {/* Footer ảnh: Caption & Tác vụ */}
                <div className="p-4 flex items-center justify-between gap-2 border-t border-stone-100">
                  <p className="text-xs font-medium text-[#1F1A17] line-clamp-1 flex-1" title={p.caption}>
                    {p.caption}
                  </p>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleLikePhoto(p.albumId, p.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition"
                      title="Thả tim"
                    >
                      <Heart size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(p.albumId, p.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Xóa ảnh"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: DANH SÁCH ALBUM CƯỚI (ALBUMS MANAGER)
         ========================================================================= */}
      {activeTab === "albums" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {albums.map((a) => (
              <div
                key={a.id}
                className="rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                {/* Ảnh bìa Album */}
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={a.cover || a.photos[0]?.url || heroWedding}
                    alt={a.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="rounded-md bg-white/20 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {a.visibility || "Công khai"}
                    </span>
                    <span className="text-xs font-semibold">
                      {a.photos.length} hình ảnh
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#1F1A17]">{a.name}</h3>
                    <p className="mt-1 text-xs text-stone-500">
                      {a.kind === "event" ? "Khách mời quét mã QR gửi ảnh vào album này" : "Album tuyển chọn bởi cô dâu & chú rể"}
                    </p>
                  </div>

                  <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAlbumId(a.id);
                        setActiveTab("all");
                      }}
                      className="font-semibold text-[#3B52DE] hover:underline"
                    >
                      Xem ảnh trong album ({a.photos.length}) →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetAlbumId(a.id);
                        setIsAddPhotoOpen(true);
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-stone-700 hover:text-black"
                    >
                      <Plus size={13} /> Thêm ảnh
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: MÃ QR & IN STANDEE ĐỂ BÀN TIỆC
         ========================================================================= */}
      {activeTab === "qr" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#1F1A17]">Mã QR chia sẻ Album cho khách mời</h3>
              <p className="mt-0.5 text-xs text-stone-500">
                In Standee đặt tại mỗi bàn tiệc hoặc quầy đón khách (Reception desk) để khách quét mã tải ảnh trực tiếp
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-xs space-y-2">
              <span className="font-semibold text-[#1F1A17] flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600" /> Cách hoạt động tiện lợi:
              </span>
              <ul className="space-y-1.5 text-stone-600 list-disc pl-4 text-[11px]">
                <li>Khách mời dùng Camera iPhone/Android hoặc Zalo quét mã QR tại bàn tiệc.</li>
                <li>Không cần đăng ký tài khoản hay cài đặt app phức tạp.</li>
                <li>Chọn ảnh chụp trong buổi tiệc và gửi ngay lên màn hình LED tiệc cưới.</li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleCopy(shareUrl, "link album")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                <Copy size={13} /> Sao chép link album
              </button>
              <a
                href={qrImgUrl}
                download="QR-Album-Tiec-Cuoi.png"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F1A17] px-4 py-2.5 text-xs font-semibold text-white hover:bg-stone-800 transition"
              >
                <Download size={13} /> Tải file in Standee (PNG)
              </a>
            </div>
          </div>

          {/* MÔ PHỎNG TẤM STANDEE ĐỂ BÀN */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-xs rounded-3xl border-2 border-stone-300 bg-white p-7 text-center shadow-lg space-y-4">
              <span className="font-display italic text-2xl font-bold text-[#1F1A17] block">
                .EverWeb
              </span>
              <h4 className="text-base font-bold text-[#1F1A17]">
                Cùng lưu giữ khoảnh khắc!
              </h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Hãy mở camera quét mã QR bên dưới để tải ảnh chụp cùng cô dâu chú rể lên màn hình tiệc cưới nhé!
              </p>

              <div className="p-3 rounded-2xl border border-stone-200 bg-stone-50 inline-block shadow-inner">
                <img
                  src={qrImgUrl}
                  alt="QR Code"
                  className="h-44 w-44 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <p className="font-display italic text-sm font-bold text-[#1F1A17]">{coupleNames}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">Sảnh Hoa Mai · Cảm ơn bạn đã chung vui!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CÀI ĐẶT & KIỂM DUYỆT ẢNH
         ========================================================================= */}
      {activeTab === "settings" && (
        <div className="max-w-2xl rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xs space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-[#1F1A17]">Cài đặt tương tác & Quyền tải ảnh</h3>
            <p className="mt-0.5 text-stone-500">Quản lý cách khách mời đóng góp ảnh và bình luận vào album tiệc cưới</p>
          </div>

          <div className="space-y-4 divide-y divide-stone-100">
            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="font-semibold text-[#1F1A17] block">Cho phép khách mời tải ảnh lên qua QR</span>
                <span className="text-stone-500 text-[11px]">Khách tham dự có thể tải ảnh chụp tại bàn tiệc lên album chung</span>
              </div>
              <input
                type="checkbox"
                checked={allowGuestUpload}
                onChange={(e) => {
                  saveSection({ allowGuestUpload: e.target.checked });
                  toast.success(e.target.checked ? "Đã bật cho phép khách tải ảnh" : "Đã tắt cho phép khách tải ảnh");
                }}
                className="h-4 w-4 rounded-sm border-stone-300 accent-[#1F1A17]"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="font-semibold text-[#1F1A17] block">Kiểm duyệt trước khi chiếu màn hình LED</span>
                <span className="text-stone-500 text-[11px]">Ảnh khách gửi cần cô dâu chú rể duyệt trước khi hiện lên slideshow</span>
              </div>
              <input
                type="checkbox"
                checked={requireModeration}
                onChange={(e) => {
                  saveSection({ requireModeration: e.target.checked });
                  toast.info(e.target.checked ? "Đã bật kiểm duyệt ảnh" : "Đã tắt kiểm duyệt ảnh");
                }}
                className="h-4 w-4 rounded-sm border-stone-300 accent-[#1F1A17]"
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: THÊM ẢNH MỚI
         ========================================================================= */}
      <Modal
        isOpen={isAddPhotoOpen}
        onClose={() => setIsAddPhotoOpen(false)}
        title="Thêm ảnh vào Album cưới"
        size="md"
      >
        <form onSubmit={handleAddPhoto} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Chọn Album lưu ảnh</label>
            <select
              value={targetAlbumId}
              onChange={(e) => setTargetAlbumId(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-[#3B52DE]"
            >
              {albums.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Chọn ảnh mẫu có sẵn</label>
            <div className="grid grid-cols-5 gap-2">
              {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPhotoUrl(preset.url);
                    setPhotoCaption(preset.name);
                  }}
                  className={`relative rounded-xl overflow-hidden border h-16 transition ${
                    photoUrl === preset.url ? "border-[#1F1A17] ring-2 ring-[#1F1A17]" : "border-stone-200 hover:border-stone-400"
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Hoặc nhập đường dẫn ảnh (Image URL)</label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="VD: https://images.unsplash.com/photo-..."
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-[#3B52DE]"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Chú thích ảnh (Caption)</label>
            <input
              type="text"
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              placeholder="VD: Bàn tiệc tối ấm cúng cùng bạn thân"
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-[#3B52DE]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsAddPhotoOpen(false)}
              className="rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#1F1A17] px-5 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition"
            >
              Lưu vào Album
            </button>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          MODAL: TẠO ALBUM MỚI
         ========================================================================= */}
      <Modal
        isOpen={isAddAlbumOpen}
        onClose={() => setIsAddAlbumOpen(false)}
        title="Tạo Album chủ đề mới"
        size="sm"
      >
        <form onSubmit={handleCreateAlbum} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Tên Album mới *</label>
            <input
              type="text"
              required
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              placeholder="VD: Tiệc độc thân & Hậu trường"
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-[#3B52DE]"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsAddAlbumOpen(false)}
              className="rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#1F1A17] px-5 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition"
            >
              Tạo Album
            </button>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          MODAL: LIGHTBOX XEM ẢNH PHÓNG TO
         ========================================================================= */}
      <Modal
        isOpen={Boolean(activeLightboxPhoto)}
        onClose={() => setActiveLightboxPhoto(null)}
        title={activeLightboxPhoto?.albumName || "Chi tiết khoảnh khắc"}
        size="lg"
      >
        {activeLightboxPhoto && (
          <div className="space-y-4 text-xs">
            <div className="relative max-h-[70vh] overflow-hidden rounded-2xl bg-black flex items-center justify-center">
              <img
                src={activeLightboxPhoto.url}
                alt={activeLightboxPhoto.caption}
                className="max-h-[65vh] w-auto object-contain mx-auto"
              />
            </div>
            <div className="flex items-center justify-between gap-3 pt-1">
              <div>
                <p className="text-sm font-bold text-[#1F1A17]">{activeLightboxPhoto.caption}</p>
                <p className="text-stone-500 text-[11px] mt-0.5">{activeLightboxPhoto.albumName}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLikePhoto(activeLightboxPhoto.albumId, activeLightboxPhoto.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-600 px-3.5 py-1.5 font-bold hover:bg-rose-100 transition"
                >
                  <Heart size={14} className="fill-rose-500" />
                  <span>{activeLightboxPhoto.likes || 1} yêu thích</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* =========================================================================
          MODAL: FULLSCREEN LIVE SLIDESHOW CHO MÀN HÌNH LED TIỆC CƯỚI
         ========================================================================= */}
      {isSlideshowOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between text-white select-none">
          {/* Header Slideshow */}
          <div className="h-16 flex items-center justify-between px-8 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <span className="font-display italic text-xl font-bold tracking-wider">.EverWeb Live</span>
              <span className="text-stone-400">|</span>
              <span className="text-sm font-semibold">{coupleNames}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-400 font-mono">
                {slideshowIndex + 1} / {allPhotos.length}
              </span>
              <button
                type="button"
                onClick={() => setIsSlideshowOpen(false)}
                className="p-2 text-white hover:text-stone-300 rounded-full hover:bg-white/10 transition"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Ảnh trung tâm */}
          <div className="flex-1 flex items-center justify-center p-6 relative">
            <img
              src={allPhotos[slideshowIndex]?.url || heroWedding}
              alt="Slide"
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl transition-all duration-700"
            />
          </div>

          {/* Footer Slideshow */}
          <div className="h-20 flex items-center justify-between px-8 bg-gradient-to-t from-black/80 to-transparent">
            <div>
              <p className="text-base font-bold">{allPhotos[slideshowIndex]?.caption}</p>
              <p className="text-xs text-stone-400">{allPhotos[slideshowIndex]?.albumName}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSlideshowIndex((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1))}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-semibold backdrop-blur-xs"
              >
                ← Ảnh trước
              </button>
              <button
                type="button"
                onClick={() => setSlideshowIndex((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0))}
                className="px-4 py-2 rounded-xl bg-white text-black hover:bg-stone-200 text-xs font-bold backdrop-blur-xs"
              >
                Ảnh kế tiếp →
              </button>
            </div>
          </div>
        </div>
      )}
    </FeatureShell>
  );
}
