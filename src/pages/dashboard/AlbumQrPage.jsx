import { useMemo, useState } from "react";
import {
  CircleDollarSign,
  Download,
  Heart,
  Image as ImageIcon,
  MoreHorizontal,
  Printer,
  QrCode,
  Search,
  Upload,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import galleryBouquet from "../../assets/image/gallery-bouquet.jpg";
import galleryCeremony from "../../assets/image/gallery-ceremony.jpg";
import galleryDining from "../../assets/image/gallery-dining.jpg";
import heroWedding from "../../assets/image/hero-wedding.jpg";

const INITIAL_PHOTOS = [
  { id: "p1", author: "Lan Phương", time: "12 phút trước", src: galleryCeremony },
  { id: "p2", author: "Mai Hương", time: "18 phút trước", src: galleryBouquet },
  { id: "p3", author: "Minh Tú", time: "25 phút trước", src: heroWedding },
  { id: "p4", author: "Lan Phương", time: "40 phút trước", src: galleryDining },
  { id: "p5", author: "Uyên Linh", time: "1 giờ trước", src: galleryBouquet },
  { id: "p6", author: "Sơn Hải", time: "1 giờ trước", src: galleryCeremony },
  { id: "p7", author: "Nam Bảo", time: "3 giờ trước", src: heroWedding },
  { id: "p8", author: "Thu Thảo", time: "3 giờ trước", src: galleryDining },
];

const RECENT_GIFTS = [
  { id: "g1", name: "Nguyễn Văn A", message: "Chúc hai bạn trăm năm hạnh phúc", amount: "1.000.000đ", time: "2 phút trước" },
  { id: "g2", name: "Trần Thị B", message: "Trăm năm hạnh phúc nhé Linh & Nam", amount: "500.000đ", time: "15 phút trước" },
  { id: "g3", name: "Lê Hoàng Nam", message: "Chúc mừng hạnh phúc gia đình nhỏ", amount: "2.000.000đ", time: "42 phút trước" },
  { id: "g4", name: "Phạm Minh Thắng", message: "Mãi hạnh phúc nhé!", amount: "1.000.000đ", time: "1 giờ trước" },
];

const INITIAL_WISHES = [
  { id: "w1", initials: "NA", name: "Nguyễn Văn A", text: "Chúc hai bạn trăm năm hạnh phúc, sớm có tin vui!", likes: 12, liked: false },
  { id: "w2", initials: "BH", name: "Gia đình Bác Hùng", text: "Chúc mừng hạnh phúc hai cháu, đầu bạc răng long.", likes: 8, liked: false },
  { id: "w3", initials: "ĐH", name: "Hội bạn Đại học", text: "Chúc cô dâu chú rể trăm năm hạnh phúc, sớm đón quý tử!", likes: 24, liked: true },
];

const TABLE_STATS = [
  { name: "Bàn 1 (VIP)", amount: "12.000.000 đ mừng", photos: "15 ảnh" },
  { name: "Bàn 4 (Bàn cô dâu)", amount: "8.500.000 đ mừng", photos: "42 ảnh" },
  { name: "Bàn 8 (Bàn chú rể)", amount: "11.000.000 đ mừng", photos: "56 ảnh" },
];

const QUICK_AMOUNTS = ["200.000đ", "500.000đ", "1.000.000đ", "Tuỳ chọn"];

function VietQrPreview() {
  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-xl border border-[#E6DFD3] bg-white p-2">
      <svg viewBox="0 0 100 100" className="h-full w-full text-[#2C2117]" aria-label="Mã VietQR">
        <rect x="4" y="4" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
        <rect x="11" y="11" width="12" height="12" rx="1" fill="currentColor" />
        <rect x="70" y="4" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
        <rect x="77" y="11" width="12" height="12" rx="1" fill="currentColor" />
        <rect x="4" y="70" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
        <rect x="11" y="77" width="12" height="12" rx="1" fill="currentColor" />
        <path
          d="M38 8h8v8h-8zM52 8h10v6H52zM38 22h12v6H38zM56 22h6v10h-6zM8 38h10v6H8zM24 38h8v12h-8zM68 38h10v8H68zM84 38h12v6H84zM68 54h14v6H68zM86 52h10v12H86zM8 52h12v10H8zM38 68h8v10h-8zM52 70h12v6H52zM70 70h10v10H70zM86 72h10v12H86zM38 84h14v10H38zM60 84h12v10H60zM78 88h14v6H78z"
          fill="currentColor"
        />
      </svg>
      <div className="absolute flex h-7 w-7 items-center justify-center rounded-full border border-[#E6DFD3] bg-[#FBF5EA] text-[#B88B3E] shadow-2xs">
        <Heart size={13} className="fill-current" />
      </div>
    </div>
  );
}

export default function AlbumQrPage({ selectedWedding }) {
  const toast = useToast();
  const [selectedAmount, setSelectedAmount] = useState("500.000đ");
  const [photoSearch, setPhotoSearch] = useState("");
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);
  const [wishes, setWishes] = useState(INITIAL_WISHES);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const filteredPhotos = useMemo(() => {
    const q = photoSearch.trim().toLowerCase();
    if (!q) return photos;
    return photos.filter((p) => p.author.toLowerCase().includes(q));
  }, [photos, photoSearch]);

  const toggleWishLike = (id) => {
    setWishes((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, liked: !w.liked, likes: w.liked ? w.likes - 1 : w.likes + 1 }
          : w
      )
    );
  };

  const handleMockUpload = () => {
    const sample = INITIAL_PHOTOS[photos.length % INITIAL_PHOTOS.length];
    setPhotos((prev) => [
      { id: `p-${Date.now()}`, author: "Khách mới", time: "Vừa xong", src: sample.src },
      ...prev,
    ]);
    toast.success("Đã tải ảnh kỷ niệm lên album chung!");
  };

  const kpis = [
    { label: "Tổng tiền mừng cưới", value: "124.200.000đ", sub: "84 lượt", icon: CircleDollarSign },
    { label: "Số lượt quét QR", value: "158", sub: "lần quét QR Code đặt tại bàn tiệc", icon: QrCode },
    { label: "Album ảnh chung", value: `${1447 + photos.length} ảnh`, sub: "284 khách mời gửi ảnh", icon: ImageIcon },
    { label: "Tương tác & Lời chúc", value: "3.250", sub: "384 khách mời gửi lời", icon: Heart },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2C2117] sm:text-[26px]">
            Mừng cưới QR & Album ảnh kỷ niệm chung
          </h1>
          <p className="mt-1 text-xs text-[#8C7A68]">
            {selectedWedding?.couple || "Lễ cưới Linh & Nam"} ·{" "}
            {selectedWedding?.hall || "Sảnh Hoa Mai"} ·{" "}
            {selectedWedding?.time || "18:00, 20/12/2026"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F241D] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#44352B]"
          >
            <QrCode size={14} />
            Tạo mã QR
          </button>
          <button
            type="button"
            onClick={handleMockUpload}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#7A5622] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#66461A]"
          >
            <Upload size={14} />
            Tải ảnh lên
          </button>
          <button
            type="button"
            onClick={() => toast.success("Đang xuất báo cáo mừng cưới & album...")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2D9CB] bg-white px-3.5 py-2 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059]"
          >
            <Download size={14} className="text-[#7D6D5E]" />
            Xuất báo cáo
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

      {/* Main 3-Column Bento Grid */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        {/* Left Column: VietQR + Recent Gifts (4/12) */}
        <div className="space-y-5 lg:col-span-4">
          <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
            <h2 className="text-sm font-semibold text-[#2C2117]">
              Mã QR Mừng Cưới (VietQR)
            </h2>

            <div className="mt-4 flex items-center gap-4">
              <VietQrPreview />
              <div className="min-w-0 space-y-1 text-xs">
                <p className="text-[11px] text-[#9C8B7A]">Receiver</p>
                <p className="text-sm font-bold text-[#2C2117]">Wedding VietQR</p>
                <p className="text-[#5E5042]">Ngân hàng Vietcombank (VCB)</p>
                <p className="font-medium text-[#2C2117] tabular-nums">STK 102456789</p>
                <p className="text-[#5E5042]">Chủ TK Nguyễn Đức Nam</p>
              </div>
            </div>

            {/* Quick amount pills */}
            <div className="mt-4 grid grid-cols-4 gap-1.5">
              {QUICK_AMOUNTS.map((amt) => {
                const isSelected = selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`rounded-lg border px-2 py-1.5 text-[11px] font-medium transition tabular-nums ${
                      isSelected
                        ? "border-[#C5A059] bg-[#FBF5EA] text-[#8A6121]"
                        : "border-[#E6DFD3] bg-white text-[#5E5042] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    {amt}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => toast.success(`Đã tải mã QR (${selectedAmount})`)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E2D9CB] bg-white py-2 text-xs font-semibold text-[#2C2117] transition hover:bg-[#FAF7F2]"
              >
                <Download size={13} />
                Tải mã QR
              </button>
              <button
                type="button"
                onClick={() => toast.info("Đang chuẩn bị bản in thẻ QR đặt bàn...")}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#EFEAE1] py-2 text-xs font-semibold text-[#3B2A1A] transition hover:bg-[#E5DEC9]"
              >
                <Printer size={13} />
                In bộ nhận diện
              </button>
            </div>
          </div>

          {/* Recent Gifts */}
          <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
            <h2 className="text-sm font-semibold text-[#2C2117]">
              Giao dịch mừng cưới gần đây
            </h2>

            <div className="mt-3 divide-y divide-[#F1ECE3]">
              {RECENT_GIFTS.map((gift) => (
                <div key={gift.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#2C2117]">{gift.name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-[#8C7A68]">
                      {gift.message}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-bold text-[#2C2117] tabular-nums">
                      {gift.amount}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#9C8B7A]">{gift.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: Shared Photo Album (5/12) */}
        <div className="rounded-xl border border-[#E6DFD3] bg-white p-5 lg:col-span-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#2C2117]">
              Album ảnh chung của khách mời
            </h2>
            <MoreHorizontal size={16} className="text-[#8C7A68]" />
          </div>

          {/* Search bar */}
          <div className="relative mt-3">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9C8B7A]"
            />
            <input
              type="text"
              value={photoSearch}
              onChange={(e) => setPhotoSearch(e.target.value)}
              placeholder="Tìm theo tên khách quét QR gửi ảnh (120 ảnh)..."
              className="w-full rounded-lg border border-[#E6DFD3] bg-[#FAF8F5] py-2 pr-3 pl-8 text-xs text-[#2C2117] placeholder-[#9C8B7A] outline-none focus:border-[#C5A059] focus:bg-white"
            />
          </div>

          {/* Photo Grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filteredPhotos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setPreviewPhoto(photo)}
                className="group text-left"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-[#EFEAE1] bg-[#FAF7F2]">
                  <img
                    src={photo.src}
                    alt={`Ảnh của ${photo.author}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-1.5 truncate text-xs font-semibold text-[#2C2117]">
                  {photo.author}
                </p>
                <p className="text-[11px] text-[#9C8B7A]">{photo.time}</p>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => toast.info("Đang tải thêm toàn bộ 1.455 ảnh...")}
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#6D5B4B] hover:text-[#2C2117]"
          >
            Xem toàn bộ album ›
          </button>
        </div>

        {/* Right Column: Wishes + Table Interaction Stats (3/12) */}
        <div className="space-y-5 lg:col-span-3">
          <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
            <h2 className="text-sm font-semibold text-[#2C2117]">
              Lời chúc & Tin nhắn từ khách mời
            </h2>

            <div className="mt-3 divide-y divide-[#F1ECE3]">
              {wishes.map((w) => (
                <div key={w.id} className="py-3 first:pt-1 last:pb-0">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EFE6D6] text-[10px] font-bold text-[#7A5622]">
                      {w.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#2C2117]">{w.name}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#5E5042]">
                        {w.text}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleWishLike(w.id)}
                        className={`mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium transition ${
                          w.liked ? "text-rose-600" : "text-[#9C8B7A] hover:text-rose-600"
                        }`}
                      >
                        <Heart size={11} className={w.liked ? "fill-current" : ""} />
                        {w.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
            <h2 className="text-sm font-semibold text-[#2C2117]">
              Thống kê tương tác theo bàn
            </h2>

            <div className="mt-3 divide-y divide-[#F1ECE3]">
              {TABLE_STATS.map((row) => (
                <div key={row.name} className="flex items-center justify-between py-2.5 text-xs">
                  <div>
                    <p className="font-semibold text-[#2C2117]">{row.name}</p>
                    <p className="text-[11px] text-[#8C7A68] tabular-nums">{row.amount}</p>
                  </div>
                  <span className="font-semibold text-[#5E5042] tabular-nums">
                    {row.photos}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => toast.info("Báo cáo chi tiết mừng cưới sẽ mở ở tab Thống kê")}
              className="mt-3 w-full rounded-lg bg-[#EFEAE1] py-2 text-xs font-semibold text-[#3B2A1A] transition hover:bg-[#E5DEC9]"
            >
              Xem báo cáo chi tiết mừng cưới
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal xem ảnh */}
      <Modal
        isOpen={!!previewPhoto}
        onClose={() => setPreviewPhoto(null)}
        title={previewPhoto ? `Ảnh của ${previewPhoto.author}` : ""}
        size="lg"
      >
        {previewPhoto && (
          <div className="space-y-3">
            <img
              src={previewPhoto.src}
              alt={previewPhoto.author}
              className="max-h-[65vh] w-full rounded-xl object-contain bg-[#FAF7F2]"
            />
            <p className="text-xs text-[#8C7A68]">Đăng tải {previewPhoto.time}</p>
          </div>
        )}
      </Modal>

      {/* Modal tạo mã QR */}
      <Modal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        title="Mã QR Mừng Cưới & Gửi Ảnh"
        size="sm"
      >
        <div className="flex flex-col items-center space-y-3 text-center">
          <VietQrPreview />
          <p className="text-sm font-semibold text-[#2C2117]">
            Wedding VietQR · {selectedAmount}
          </p>
          <p className="text-xs text-[#8C7A68]">
            Vietcombank (VCB) · STK 102456789 · Nguyễn Đức Nam
          </p>
          <button
            type="button"
            onClick={() => {
              toast.success("Đã sao chép liên kết QR đặt bàn");
              setIsQrModalOpen(false);
            }}
            className="w-full rounded-lg bg-[#2F241D] py-2 text-xs font-semibold text-white hover:bg-[#44352B]"
          >
            Sao chép liên kết QR
          </button>
        </div>
      </Modal>
    </div>
  );
}
