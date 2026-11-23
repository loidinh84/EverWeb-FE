import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FolderPlus,
  Globe,
  Heart,
  Image as ImageIcon,
  LayoutGrid,
  Link2,
  Lock,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  QrCode,
  Trash2,
  Upload,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import galleryBouquet from "../../assets/image/gallery-bouquet.jpg";
import galleryCeremony from "../../assets/image/gallery-ceremony.jpg";
import galleryDining from "../../assets/image/gallery-dining.jpg";
import heroWedding from "../../assets/image/hero-wedding.jpg";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";

const DEFAULT_ALBUMS = [
  {
    id: "alb-pages",
    name: "Ảnh các trang Website",
    kind: "system",
    visibility: "Public",
    likesOn: true,
    commentsOn: true,
    photos: [
      { id: "p1", url: heroWedding, caption: "Ảnh bìa Sảnh tiệc" },
      { id: "p2", url: galleryCeremony, caption: "Cổng hoa ngoài trời" },
      { id: "p3", url: galleryBouquet, caption: "Hoa cưới cầm tay" },
      { id: "p4", url: galleryDining, caption: "Bàn tiệc tối" },
    ],
  },
  {
    id: "alb-event",
    name: "Ảnh sự kiện (Khách gửi qua QR)",
    kind: "event",
    visibility: "Public",
    likesOn: true,
    commentsOn: true,
    photos: [
      { id: "p5", url: galleryCeremony, caption: "Khoảnh khắc đón khách" },
      { id: "p6", url: galleryDining, caption: "Tiệc tối thân mật" },
    ],
  },
  {
    id: "alb-engagement",
    name: "Ảnh Pre-Wedding & Đính hôn",
    kind: "custom",
    visibility: "Public",
    likesOn: true,
    commentsOn: true,
    photos: [
      { id: "p7", url: heroWedding, caption: "Chụp tại Đà Lạt" },
      { id: "p8", url: galleryBouquet, caption: "Hoa cưới" },
      { id: "p9", url: galleryCeremony, caption: "Lễ đính hôn" },
    ],
  },
];

export default function PhotoMomentsPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { wedding } = useCurrentWedding();

  const { data: webConfig, saveSection } = useWeddingFeature(
    wedding,
    "website_config",
    {
      photoAlbums: DEFAULT_ALBUMS,
    }
  );

  const albums = useMemo(
    () =>
      Array.isArray(webConfig.photoAlbums) && webConfig.photoAlbums.length > 0
        ? webConfig.photoAlbums
        : DEFAULT_ALBUMS,
    [webConfig.photoAlbums]
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedView, setSelectedView] = useState("overview"); // "overview" | "all" | albumId
  const [isAddAlbumOpen, setIsAddAlbumOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [isAddMediaOpen, setIsAddMediaOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");
  const [targetAlbumId, setTargetAlbumId] = useState("alb-engagement");
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameDraft, setRenameDraft] = useState("");

  const activeAlbum = albums.find((a) => a.id === selectedView) || null;
  const allPhotos = useMemo(
    () =>
      albums.flatMap((a) =>
        a.photos.map((p) => ({ ...p, albumId: a.id, albumName: a.name }))
      ),
    [albums]
  );

  const shareUrl = `https://everwed.vn/${wedding?.slug || "khang-an"}/photos`;
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    shareUrl
  )}`;

  const handleAddAlbum = (e) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;
    const created = {
      id: `alb-${Date.now()}`,
      name: newAlbumName.trim(),
      kind: "custom",
      visibility: "Public",
      likesOn: true,
      commentsOn: true,
      photos: [],
    };
    saveSection({ photoAlbums: [...albums, created] });
    setSelectedView(created.id);
    setNewAlbumName("");
    setIsAddAlbumOpen(false);
    toast.success(`Đã tạo Album "${created.name}" & lưu Neon DB`);
  };

  const handleAddPhoto = (urlToAdd, captionToAdd) => {
    const finalUrl = (urlToAdd || mediaUrl).trim();
    if (!finalUrl) return;
    const destId = activeAlbum?.id || targetAlbumId || albums[0]?.id;
    saveSection({
      photoAlbums: albums.map((a) =>
        a.id === destId
          ? {
              ...a,
              photos: [
                {
                  id: `ph-${Date.now()}`,
                  url: finalUrl,
                  caption: (captionToAdd || mediaCaption).trim() || "Ảnh cưới",
                },
                ...a.photos,
              ],
            }
          : a
      ),
    });
    setMediaUrl("");
    setMediaCaption("");
    setIsAddMediaOpen(false);
    toast.success("Đã thêm ảnh vào Album & lưu Neon DB");
  };

  const handleDeletePhoto = (albumId, photoId) => {
    saveSection({
      photoAlbums: albums.map((a) =>
        a.id === albumId
          ? { ...a, photos: a.photos.filter((p) => p.id !== photoId) }
          : a
      ),
    });
    toast.info("Đã xoá ảnh khỏi Album");
  };

  const updateActiveAlbum = (patch) => {
    if (!activeAlbum) return;
    saveSection({
      photoAlbums: albums.map((a) =>
        a.id === activeAlbum.id ? { ...a, ...patch } : a
      ),
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F6F3] text-[#2C2117]">
      {/* Top Bar */}
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
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E2D9CB] bg-white px-3 py-1.5 text-xs font-medium text-[#5E5042] hover:border-[#3B52DE]"
          >
            {sidebarOpen ? (
              <PanelLeftClose size={14} />
            ) : (
              <PanelLeftOpen size={14} />
            )}
            <span className="hidden md:inline">
              {sidebarOpen ? "Thu gọn" : "Menu Album"}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsQrOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E2D9CB] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#2C2117] hover:border-[#3B52DE]"
          >
            <QrCode size={13} /> Link & Mã QR
          </button>
          <button
            type="button"
            onClick={() => {
              if (activeAlbum) setTargetAlbumId(activeAlbum.id);
              setIsAddMediaOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#3B52DE] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2F43C2]"
          >
            <Plus size={14} /> Thêm ảnh
          </button>
          <button
            type="button"
            onClick={() => navigate(`${ROUTE_PATHS.DASHBOARD}/album`)}
            title="Mở trang Album & VietQR trong Dashboard"
            className="hidden rounded-full border border-[#E2D9CB] bg-white p-1.5 text-[#5E5042] hover:border-[#3B52DE] sm:inline-flex"
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 items-start">
        {/* Left WithJoy Photos Sidebar */}
        {sidebarOpen && (
          <aside className="sticky top-14 h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-[#EAE6DF] bg-white p-4">
            <p className="px-2 text-[11px] font-medium text-[#8C7A68]">
              Website /{" "}
              <span className="font-semibold text-[#2C2117]">
                Ảnh & Khoảnh khắc
              </span>
            </p>

            <button
              type="button"
              onClick={() => setSelectedView("overview")}
              className={`mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                selectedView === "overview"
                  ? "bg-[#EEF2FF] text-[#3B52DE]"
                  : "text-[#2C2117] hover:bg-[#FAF8F5]"
              }`}
            >
              <ImageIcon size={14} /> Tổng quan Album
            </button>

            <div className="mt-5">
              <p className="px-2 text-[10px] font-bold tracking-wider text-[#8C7A68] uppercase">
                Albums
              </p>
              <div className="mt-2 space-y-1">
                {albums.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelectedView(a.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition ${
                      selectedView === a.id
                        ? "bg-[#EEF2FF] font-semibold text-[#3B52DE]"
                        : "text-[#5E5042] hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <span className="truncate">{a.name}</span>
                    <span className="text-[11px] text-[#8C7A68] tabular-nums">
                      {a.photos.length}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsAddAlbumOpen(true)}
                  className="flex w-full items-center gap-1.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#3B52DE] hover:bg-[#EEF2FF]/50"
                >
                  <FolderPlus size={14} /> + Thêm Album
                </button>
              </div>
            </div>

            <div className="mt-5 border-t border-[#F1ECE3] pt-4">
              <p className="px-2 text-[10px] font-bold tracking-wider text-[#8C7A68] uppercase">
                Tải lên
              </p>
              <div className="mt-2 space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedView("all")}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition ${
                    selectedView === "all"
                      ? "bg-[#EEF2FF] font-semibold text-[#3B52DE]"
                      : "text-[#5E5042] hover:bg-[#FAF8F5]"
                  }`}
                >
                  <span>Thư viện ảnh (Tất cả)</span>
                  <span className="text-[11px] text-[#8C7A68] tabular-nums">
                    {allPhotos.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddMediaOpen(true)}
                  className="flex w-full items-center gap-1.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#2C2117] hover:bg-[#FAF8F5]"
                >
                  <Upload size={14} /> + Thêm ảnh mới
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-5 sm:p-8">
          {/* OVERVIEW */}
          {selectedView === "overview" && (
            <div className="mx-auto max-w-5xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E6DFD3] bg-white p-6">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#2C2117]">
                    Lưu giữ trọn vẹn mọi khoảnh khắc ngày cưới
                  </h2>
                  <p className="mt-1 text-xs text-[#6D5B4B]">
                    Tải lên tới 100 ảnh miễn phí và chia sẻ mã QR để khách mời
                    cùng gửi ảnh chụp tại tiệc.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddMediaOpen(true)}
                  className="rounded-full bg-[#3B52DE] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2F43C2]"
                >
                  + Thêm ảnh ngay
                </button>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2C2117]">
                  Danh sách Album ({albums.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddAlbumOpen(true)}
                  className="text-xs font-semibold text-[#3B52DE] hover:underline"
                >
                  + Tạo Album mới
                </button>
              </div>

              {/* WithJoy 3-Photo Collage Album Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {albums.map((a) => {
                  const p0 = a.photos[0]?.url;
                  const p1 = a.photos[1]?.url;
                  const p2 = a.photos[2]?.url;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setSelectedView(a.id)}
                      className="group overflow-hidden rounded-2xl border border-[#E6DFD3] bg-white text-left transition hover:border-[#3B52DE] hover:shadow-md"
                    >
                      <div className="grid h-44 grid-cols-3 gap-1 bg-[#FAF7F2] p-1">
                        <div className="col-span-2 overflow-hidden rounded-l-xl bg-[#EFEAE1]">
                          {p0 ? (
                            <img
                              src={p0}
                              alt={a.name}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-[#9C8B7A]">
                              Chưa có ảnh
                            </div>
                          )}
                        </div>
                        <div className="grid grid-rows-2 gap-1">
                          <div className="overflow-hidden rounded-tr-xl bg-[#EFEAE1]">
                            {p1 && (
                              <img
                                src={p1}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="overflow-hidden rounded-br-xl bg-[#EFEAE1]">
                            {p2 && (
                              <img
                                src={p2}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="text-sm font-bold text-[#2C2117]">
                            {a.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#8C7A68]">
                            {a.photos.length} ảnh ·{" "}
                            {a.visibility === "Public" ? "Công khai" : "Riêng tư"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ALL PHOTOS */}
          {selectedView === "all" && (
            <div className="mx-auto max-w-5xl space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedView("overview")}
                  className="text-xs font-semibold text-[#3B52DE] hover:underline"
                >
                  ← Quay lại Albums
                </button>
                <span className="text-xs text-[#8C7A68]">
                  Tổng cộng {allPhotos.length} ảnh
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {allPhotos.map((p) => (
                  <div
                    key={`${p.albumId}-${p.id}`}
                    className="group relative aspect-square overflow-hidden rounded-2xl border border-[#E6DFD3] bg-white"
                  >
                    <img
                      src={p.url}
                      alt={p.caption}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/55 px-2.5 py-1.5 text-[10px] text-white">
                      <p className="truncate font-semibold">{p.caption}</p>
                      <p className="truncate opacity-80">{p.albumName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SINGLE ALBUM + QUICK ACTIONS */}
          {activeAlbum && (
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-8">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedView("overview")}
                    className="text-xs font-semibold text-[#3B52DE] hover:underline"
                  >
                    ← Albums / {activeAlbum.name}
                  </button>
                  <span className="text-xs text-[#8C7A68]">
                    {activeAlbum.photos.length} ảnh
                  </span>
                </div>

                {activeAlbum.photos.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#D6CFC4] bg-white p-12 text-center">
                    <ImageIcon
                      size={28}
                      className="mx-auto text-[#9C8B7A]"
                    />
                    <p className="mt-2 text-sm font-bold text-[#2C2117]">
                      Album chưa có ảnh nào
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetAlbumId(activeAlbum.id);
                        setIsAddMediaOpen(true);
                      }}
                      className="mt-4 rounded-full bg-[#3B52DE] px-4 py-2 text-xs font-semibold text-white"
                    >
                      + Thêm ảnh đầu tiên
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {activeAlbum.photos.map((p) => (
                      <div
                        key={p.id}
                        className="group relative aspect-square overflow-hidden rounded-2xl border border-[#E6DFD3] bg-white"
                      >
                        <img
                          src={p.url}
                          alt={p.caption}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(activeAlbum.id, p.id)}
                          aria-label="Xoá ảnh"
                          className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 text-rose-600 opacity-0 shadow-sm transition group-hover:opacity-100"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Quick Actions Panel (WithJoy Style) */}
              <aside className="space-y-2 rounded-2xl border border-[#E6DFD3] bg-white p-5 lg:col-span-4">
                <h3 className="mb-3 text-sm font-bold text-[#2C2117]">
                  Thao tác nhanh (Quick actions)
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setTargetAlbumId(activeAlbum.id);
                    setIsAddMediaOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-[#EFEAE1] px-3.5 py-2.5 text-left text-xs font-semibold text-[#2C2117] hover:border-[#3B52DE]"
                >
                  <Upload size={14} className="text-[#3B52DE]" /> Thêm ảnh mới
                </button>
                <button
                  type="button"
                  onClick={() => setIsQrOpen(true)}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-[#EFEAE1] px-3.5 py-2.5 text-left text-xs font-semibold text-[#2C2117] hover:border-[#3B52DE]"
                >
                  <QrCode size={14} className="text-[#3B52DE]" /> Link & Mã QR
                  chia sẻ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRenameDraft(activeAlbum.name);
                    setIsRenameOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-[#EFEAE1] px-3.5 py-2.5 text-left text-xs font-semibold text-[#2C2117] hover:border-[#3B52DE]"
                >
                  <Link2 size={14} className="text-[#3B52DE]" /> Đổi tên Album
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextVis =
                      activeAlbum.visibility === "Public"
                        ? "Private"
                        : "Public";
                    updateActiveAlbum({ visibility: nextVis });
                    toast.info(
                      nextVis === "Public"
                        ? "Đã chuyển Album sang Công khai"
                        : "Đã chuyển Album sang Riêng tư"
                    );
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-[#EFEAE1] px-3.5 py-2.5 text-left text-xs font-semibold text-[#2C2117]"
                >
                  <span className="flex items-center gap-2.5">
                    {activeAlbum.visibility === "Public" ? (
                      <Globe size={14} className="text-emerald-600" />
                    ) : (
                      <Lock size={14} className="text-amber-600" />
                    )}
                    Hiển thị Album
                  </span>
                  <span className="text-[11px] text-[#6D5B4B]">
                    {activeAlbum.visibility === "Public"
                      ? "Công khai"
                      : "Riêng tư"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateActiveAlbum({ likesOn: !activeAlbum.likesOn })
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-[#EFEAE1] px-3.5 py-2.5 text-left text-xs font-semibold text-[#2C2117]"
                >
                  <span className="flex items-center gap-2.5">
                    <Heart size={14} className="text-rose-500" /> Lượt thích
                  </span>
                  <span className="text-[11px] text-[#3B52DE]">
                    {activeAlbum.likesOn ? "Đang bật" : "Đang tắt"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateActiveAlbum({ commentsOn: !activeAlbum.commentsOn })
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-[#EFEAE1] px-3.5 py-2.5 text-left text-xs font-semibold text-[#2C2117]"
                >
                  <span className="flex items-center gap-2.5">
                    <MessageCircle size={14} className="text-[#3B52DE]" /> Bình
                    luận
                  </span>
                  <span className="text-[11px] text-[#3B52DE]">
                    {activeAlbum.commentsOn ? "Đang bật" : "Đang tắt"}
                  </span>
                </button>
              </aside>
            </div>
          )}
        </main>
      </div>

      {/* Add Album Modal */}
      <Modal
        isOpen={isAddAlbumOpen}
        onClose={() => setIsAddAlbumOpen(false)}
        title="Tạo Album ảnh mới"
        size="sm"
      >
        <form onSubmit={handleAddAlbum} className="space-y-3 text-xs">
          <input
            type="text"
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
            placeholder="Tên Album (VD: Lễ Gia Tiên, Tiệc Tối)"
            className="w-full rounded-xl border border-[#E2D9CB] px-3 py-2 outline-none focus:border-[#3B52DE]"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddAlbumOpen(false)}
              className="rounded-lg border border-[#E2D9CB] px-4 py-2 font-medium"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#3B52DE] px-4 py-2 font-semibold text-white"
            >
              Tạo Album
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Media Modal */}
      <Modal
        isOpen={isAddMediaOpen}
        onClose={() => setIsAddMediaOpen(false)}
        title="Thêm ảnh vào Album"
        size="md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-[#5E5042]">
              Dán đường dẫn ảnh (URL)
            </label>
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-xl border border-[#E2D9CB] px-3 py-2 outline-none focus:border-[#3B52DE]"
            />
          </div>
          <div>
            <label className="font-semibold text-[#5E5042]">
              Chú thích ảnh
            </label>
            <input
              type="text"
              value={mediaCaption}
              onChange={(e) => setMediaCaption(e.target.value)}
              placeholder="VD: Khoảnh khắc trao nhẫn"
              className="mt-1 w-full rounded-xl border border-[#E2D9CB] px-3 py-2 outline-none focus:border-[#3B52DE]"
            />
          </div>

          <div>
            <p className="mb-2 font-semibold text-[#5E5042]">
              Hoặc chọn nhanh ảnh cưới mẫu:
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { src: heroWedding, label: "Sảnh hoa" },
                { src: galleryCeremony, label: "Cổng hoa" },
                { src: galleryBouquet, label: "Hoa cầm tay" },
                { src: galleryDining, label: "Bàn tiệc" },
              ].map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => handleAddPhoto(sample.src, sample.label)}
                  className="overflow-hidden rounded-xl border border-[#E6DFD3] hover:border-[#3B52DE]"
                >
                  <img
                    src={sample.src}
                    alt={sample.label}
                    className="h-16 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddMediaOpen(false)}
              className="rounded-lg border border-[#E2D9CB] px-4 py-2 font-medium"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => handleAddPhoto()}
              className="rounded-lg bg-[#3B52DE] px-4 py-2 font-semibold text-white"
            >
              Thêm ảnh
            </button>
          </div>
        </div>
      </Modal>

      {/* Link & QR Modal */}
      <Modal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        title="Link & Mã QR Album ảnh cưới"
        size="sm"
      >
        <div className="space-y-4 text-center text-xs">
          <img
            src={qrImgUrl}
            alt="QR Album"
            className="mx-auto h-44 w-44 rounded-2xl border border-[#E6DFD3] p-2"
          />
          <p className="text-[#6D5B4B]">
            In mã QR này đặt tại bàn tiệc để khách mời quét và xem / chia sẻ
            ảnh kỷ niệm cùng bạn.
          </p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(shareUrl);
              toast.success("Đã sao chép link Album ảnh");
            }}
            className="w-full rounded-xl bg-[#3B52DE] py-2 font-semibold text-white"
          >
            Sao chép link: {shareUrl}
          </button>
        </div>
      </Modal>

      {/* Rename Album Modal */}
      <Modal
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        title="Đổi tên Album"
        size="sm"
      >
        <div className="space-y-3 text-xs">
          <input
            type="text"
            value={renameDraft}
            onChange={(e) => setRenameDraft(e.target.value)}
            className="w-full rounded-xl border border-[#E2D9CB] px-3 py-2 outline-none focus:border-[#3B52DE]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRenameOpen(false)}
              className="rounded-lg border border-[#E2D9CB] px-4 py-2"
            >
              Huỷ
            </button>
            <button
              type="button"
              onClick={() => {
                if (renameDraft.trim()) {
                  updateActiveAlbum({ name: renameDraft.trim() });
                  toast.success("Đã đổi tên Album");
                }
                setIsRenameOpen(false);
              }}
              className="rounded-lg bg-[#3B52DE] px-4 py-2 font-semibold text-white"
            >
              Lưu
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
