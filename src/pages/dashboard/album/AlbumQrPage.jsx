import { useMemo, useState } from "react";
import {
  CircleDollarSign,
  Download,
  Heart,
  Image as ImageIcon,
  QrCode,
  Upload,
} from "lucide-react";
import { Modal, useToast } from "../../../components/common";
import GuestWishesCard from "./GuestWishesCard";
import RecentGiftsCard from "./RecentGiftsCard";
import SharedAlbumCard from "./SharedAlbumCard";
import TableStatsCard from "./TableStatsCard";
import VietQrCard, { VietQrPreview } from "./VietQrCard";
import galleryBouquet from "../../../assets/image/gallery-bouquet.jpg";
import galleryCeremony from "../../../assets/image/gallery-ceremony.jpg";
import galleryDining from "../../../assets/image/gallery-dining.jpg";
import heroWedding from "../../../assets/image/hero-wedding.jpg";

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
        <div className="space-y-5 lg:col-span-4">
          <VietQrCard
            selectedAmount={selectedAmount}
            onSelectAmount={setSelectedAmount}
            onDownload={() => toast.success(`Đã tải mã QR (${selectedAmount})`)}
            onPrint={() => toast.info("Đang chuẩn bị bản in thẻ QR đặt bàn...")}
          />
          <RecentGiftsCard gifts={RECENT_GIFTS} />
        </div>

        <div className="lg:col-span-5">
          <SharedAlbumCard
            photos={filteredPhotos}
            searchValue={photoSearch}
            onSearchChange={setPhotoSearch}
            onSelectPhoto={setPreviewPhoto}
            onViewAll={() => toast.info("Đang tải thêm toàn bộ 1.455 ảnh...")}
          />
        </div>

        <div className="space-y-5 lg:col-span-3">
          <GuestWishesCard wishes={wishes} onToggleLike={toggleWishLike} />
          <TableStatsCard
            rows={TABLE_STATS}
            onViewDetail={() =>
              toast.info("Báo cáo chi tiết mừng cưới sẽ mở ở tab Thống kê")
            }
          />
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
              className="max-h-[65vh] w-full rounded-xl bg-[#FAF7F2] object-contain"
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
