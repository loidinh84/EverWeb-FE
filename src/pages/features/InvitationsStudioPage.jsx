import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Camera,
  Check,
  Heart,
  Search,
  Sparkles,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import galleryBouquet from "../../assets/image/gallery-bouquet.jpg";
import galleryCeremony from "../../assets/image/gallery-ceremony.jpg";
import galleryDining from "../../assets/image/gallery-dining.jpg";
import heroWedding from "../../assets/image/hero-wedding.jpg";
import FeatureShell from "./FeatureShell";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";

const CATEGORIES = [
  "Tất cả",
  "Save the Dates",
  "Thiệp mời",
  "Thiệp cảm ơn",
  "Thực đơn & Bảng tên",
];

const STYLE_BUBBLES = [
  { key: "Tất cả", label: "Tất cả", img: heroWedding },
  { key: "Botanical", label: "Hoa lá", img: galleryBouquet },
  { key: "Cổ điển", label: "Cổ điển", img: galleryCeremony },
  { key: "Tối giản", label: "Tối giản", img: heroWedding },
  { key: "Sang trọng", label: "Sang trọng", img: galleryDining },
];

const CARD_TEMPLATES = [
  {
    id: "c1",
    name: "Gỗ Cổ Điển (Antique Woodgrain)",
    category: "Thiệp mời",
    style: "Cổ điển",
    matchesSite: true,
    isFree: true,
    image: galleryCeremony,
    colors: ["#4A3520", "#1F1A17", "#C5A059"],
  },
  {
    id: "c2",
    name: "Meadow Hoa Cỏ",
    category: "Thiệp mời",
    style: "Botanical",
    matchesSite: true,
    isFree: false,
    image: galleryBouquet,
    colors: ["#1E293B", "#3B52DE", "#5F7161", "#C5A059"],
  },
  {
    id: "c3",
    name: "Romantic Monogram",
    category: "Thiệp mời",
    style: "Sang trọng",
    matchesSite: false,
    isFree: false,
    image: heroWedding,
    colors: ["#1F1A17", "#C5A059", "#B85D6E"],
  },
  {
    id: "c4",
    name: "Simplicity Tối Giản",
    category: "Save the Dates",
    style: "Tối giản",
    matchesSite: true,
    isFree: true,
    image: galleryCeremony,
    colors: ["#1E293B", "#3B52DE", "#78716C"],
  },
  {
    id: "c5",
    name: "Botanical Arch",
    category: "Save the Dates",
    style: "Botanical",
    matchesSite: false,
    isFree: true,
    image: galleryBouquet,
    colors: ["#5F7161", "#C5A059", "#1F1A17"],
  },
  {
    id: "c6",
    name: "Concerto Tiệc Tối",
    category: "Thiệp cảm ơn",
    style: "Sang trọng",
    matchesSite: true,
    isFree: false,
    image: galleryDining,
    colors: ["#4A3520", "#C5A059", "#3B52DE"],
  },
  {
    id: "c7",
    name: "Menu & Place Card",
    category: "Thực đơn & Bảng tên",
    style: "Tối giản",
    matchesSite: false,
    isFree: true,
    image: galleryDining,
    colors: ["#1F1A17", "#78716C", "#3B52DE"],
  },
  {
    id: "c8",
    name: "Quill Thư Pháp",
    category: "Thiệp mời",
    style: "Cổ điển",
    matchesSite: false,
    isFree: true,
    image: galleryBouquet,
    colors: ["#3B52DE", "#B85D6E", "#5F7161"],
  },
];

export default function InvitationsStudioPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { wedding } = useCurrentWedding();

  const { data: stationeryData, saveSection } = useWeddingFeature(
    wedding,
    "stationery_config",
    {
      favorites: ["c1", "c4"],
      drafts: ["c1"],
      activeColors: {},
      selectedCardId: "c1",
      customGreeting:
        "Trân trọng kính mời Quý khách tới chung vui cùng gia đình chúng tôi.",
    }
  );

  const initialCategory = location.state?.category || "Tất cả";
  const [topTab, setTopTab] = useState("designs");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [styleFilter, setStyleFilter] = useState("Tất cả");
  const [onlyFree, setOnlyFree] = useState(false);
  const [usePhoto, setUsePhoto] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  const favorites = useMemo(
    () => stationeryData.favorites || ["c1", "c4"],
    [stationeryData.favorites]
  );
  const drafts = useMemo(
    () => stationeryData.drafts || ["c1"],
    [stationeryData.drafts]
  );
  const activeColors = stationeryData.activeColors || {};
  const selectedCardId = stationeryData.selectedCardId || "c1";
  const customGreeting =
    stationeryData.customGreeting ||
    "Trân trọng kính mời Quý khách tới chung vui cùng gia đình chúng tôi.";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CARD_TEMPLATES.filter((c) => {
      const matchTop =
        topTab === "favorites"
          ? favorites.includes(c.id)
          : topTab === "drafts"
          ? drafts.includes(c.id)
          : topTab === "orders"
          ? c.id === selectedCardId
          : true;
      const matchCat =
        categoryFilter === "Tất cả" || c.category === categoryFilter;
      const matchStyle = styleFilter === "Tất cả" || c.style === styleFilter;
      const matchFree = !onlyFree || c.isFree;
      const matchQ = !q || c.name.toLowerCase().includes(q);
      return matchTop && matchCat && matchStyle && matchFree && matchQ;
    });
  }, [
    topTab,
    favorites,
    drafts,
    selectedCardId,
    categoryFilter,
    styleFilter,
    onlyFree,
    search,
  ]);

  const toggleFav = (id) => {
    saveSection((prev) => {
      const cur = prev.favorites || [];
      return {
        ...prev,
        favorites: cur.includes(id)
          ? cur.filter((i) => i !== id)
          : [...cur, id],
      };
    });
  };

  const coupleName = (
    wedding?.title || "Trần Thanh Khang & Trần Ngọc An"
  ).normalize("NFC");
  const displayDate = wedding?.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("vi-VN")
    : "23/08/2027";
  const displayVenue = (
    wedding?.venue_name || "Sảnh Hoa Mai - TP. Hồ Chí Minh"
  ).normalize("NFC");

  return (
    <FeatureShell
      title="Thiệp mời & Menu tiệc cưới (Stationery)"
      subtitle="Save the Dates, Thiệp mời cưới, Thiệp cảm ơn & Ấn phẩm bàn tiệc"
      wedding={wedding}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.INVITATION)}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:border-[#1F1A17] hover:bg-stone-50 transition cursor-pointer"
          >
            <Heart size={13} className="text-rose-500 fill-rose-500" /> Xem Thiệp điện tử (Lễ Thành Hôn) →
          </button>
          <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 p-0.5 text-xs font-semibold">
            {[
              { key: "designs", label: "Mẫu thiết kế" },
              { key: "favorites", label: `Yêu thích (${favorites.length})` },
              { key: "drafts", label: `Bản nháp (${drafts.length})` },
              { key: "orders", label: "Đang chọn" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTopTab(t.key)}
                className={`rounded-full px-3 py-1 transition ${
                  topTab === t.key
                    ? "bg-white text-[#1F1A17] shadow-2xs"
                    : "text-stone-500 hover:text-[#1F1A17]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      {/* Centered Category Nav (matching WithJoy Stationery bar) */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2 border-b border-stone-200 pb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`border-b-2 px-3 py-1.5 text-xs font-semibold transition ${
              categoryFilter === cat
                ? "border-[#1F1A17] text-[#1F1A17]"
                : "border-transparent text-stone-500 hover:text-[#1F1A17]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Centered Heading + Circular Style Bubbles (WithJoy Wedding Invitations) */}
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-semibold text-[#1F1A17] sm:text-4xl">
          {categoryFilter === "Tất cả" ? "Thiệp mời cưới" : categoryFilter}
        </h2>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-5">
          {STYLE_BUBBLES.map((b) => {
            const active = styleFilter === b.key;
            return (
              <button
                key={b.key}
                type="button"
                onClick={() => setStyleFilter(b.key)}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className={`h-14 w-14 overflow-hidden rounded-full border-2 transition group-hover:scale-105 ${
                    active
                      ? "border-[#3B52DE] ring-2 ring-[#3B52DE]/20"
                      : "border-stone-200"
                  }`}
                >
                  <img
                    src={b.img}
                    alt={b.label}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span
                  className={`text-[11px] font-medium ${
                    active ? "font-bold text-[#3B52DE]" : "text-stone-700"
                  }`}
                >
                  {b.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar + Search + Use Your Photo Toggle */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyFree((p) => !p)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              onlyFree
                ? "border-[#3B52DE] bg-stone-100 text-[#1F1A17] font-bold"
                : "border-stone-200 bg-white text-stone-700"
            }`}
          >
            {onlyFree ? "✓ Chỉ mẫu miễn phí" : "Miễn phí"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mẫu thiệp..."
              className="w-56 rounded-full border border-stone-200 bg-white py-1.5 pr-3 pl-8 text-xs outline-none focus:border-[#3B52DE]"
            />
          </div>
          <button
            type="button"
            onClick={() => setUsePhoto((p) => !p)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              usePhoto
                ? "border-[#1F1A17] bg-[#1F1A17] text-white"
                : "border-stone-200 bg-white text-stone-700"
            }`}
          >
            <Camera size={13} /> Dùng ảnh của bạn
          </button>
        </div>
      </div>

      {/* Cards Grid (WithJoy Invitations Showcase) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Promo Card (matches WithJoy "Free Envelope Addressing") */}
        <div className="flex flex-col justify-between rounded-2xl bg-[#1E3A5F] p-6 text-white shadow-sm">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase opacity-80">
              Đặc quyền EverWeb
            </p>
            <h3 className="font-display mt-2 text-2xl leading-snug font-semibold">
              Miễn phí gắn tên khách mời lên phong bì & thiệp số
            </h3>
            <p className="mt-2 text-xs text-white/80">
              Tự động đồng bộ từ Danh sách Khách mời để gửi hàng loạt qua Zalo /
              Email.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedCard(CARD_TEMPLATES[0])}
            className="mt-4 w-fit rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#1E3A5F]"
          >
            Thử ngay →
          </button>
        </div>

        {filtered.map((card) => {
          const isFav = favorites.includes(card.id);
          const isChosen = selectedCardId === card.id;
          const chosenColor = activeColors[card.id] || card.colors[0];
          return (
            <div
              key={card.id}
              className={`group overflow-hidden rounded-2xl border bg-white transition hover:shadow-md ${
                isChosen
                  ? "border-[#3B52DE] ring-2 ring-[#3B52DE]/15"
                  : "border-stone-200 hover:border-[#3B52DE]"
              }`}
            >
              <div
                onClick={() => setSelectedCard(card)}
                className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-stone-50"
              >
                {usePhoto ? (
                  <img
                    src={card.image}
                    alt={card.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{ backgroundColor: chosenColor }}
                  />
                )}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center text-white"
                  style={{
                    background: `linear-gradient(to bottom, rgba(0,0,0,0.28), ${chosenColor}88)`,
                  }}
                >
                  <p className="text-[9px] tracking-[0.25em] uppercase opacity-90">
                    {card.category}
                  </p>
                  <p className="font-display mt-2 text-2xl leading-tight font-semibold">
                    {coupleName}
                  </p>
                  <div className="my-2.5 h-px w-10 bg-white/50" />
                  <p className="text-[10px] opacity-90">{displayDate}</p>
                  <p className="mt-0.5 text-[10px] opacity-80">
                    {displayVenue}
                  </p>
                </div>

                {card.matchesSite && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#1F1A17]/90 px-2.5 py-1 text-[10px] font-semibold text-white">
                    <Sparkles size={10} /> Hợp với Website
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFav(card.id);
                  }}
                  aria-label="Yêu thích"
                  className={`absolute top-3 right-3 rounded-full bg-white/90 p-2 transition ${
                    isFav ? "text-rose-500" : "text-stone-500 hover:text-rose-500"
                  }`}
                >
                  <Heart size={14} className={isFav ? "fill-current" : ""} />
                </button>
              </div>

              <div className="p-4 text-center">
                <h3 className="text-xs font-bold text-[#1F1A17]">
                  {card.name}
                </h3>
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  {card.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Chọn màu ${c}`}
                      onClick={() =>
                        saveSection({
                          activeColors: { ...activeColors, [card.id]: c },
                        })
                      }
                      className={`h-4 w-4 rounded-full border transition ${
                        chosenColor === c
                          ? "scale-115 border-[#1F1A17] ring-1 ring-[#1F1A17]/30"
                          : "border-black/10"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCard(card)}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-stone-50 py-2 text-xs font-semibold text-[#1F1A17] transition hover:bg-[#3B52DE] hover:text-white"
                >
                  {isChosen ? (
                    <>
                      <Check size={13} /> Mẫu đang chọn
                    </>
                  ) : (
                    "Tuỳ chỉnh & Áp dụng"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview & Customize Modal */}
      <Modal
        isOpen={Boolean(selectedCard)}
        onClose={() => setSelectedCard(null)}
        title={selectedCard?.name || "Tuỳ chỉnh mẫu thiệp"}
        size="md"
      >
        {selectedCard && (
          <div className="space-y-4">
            <div
              className="rounded-2xl border-2 bg-stone-50 p-6 text-center"
              style={{
                borderColor:
                  activeColors[selectedCard.id] || selectedCard.colors[0],
              }}
            >
              <p className="text-[10px] tracking-[0.25em] text-stone-500 uppercase">
                {selectedCard.category}
              </p>
              <h3 className="font-display mt-2 text-2xl font-bold text-[#1F1A17]">
                {coupleName}
              </h3>
              <p className="mt-2 text-xs text-stone-600">{customGreeting}</p>
              <p className="mt-3 text-xs font-semibold text-[#3B52DE]">
                {displayDate} · {displayVenue}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700">
                Lời mời trên thiệp
              </label>
              <textarea
                rows={2}
                value={customGreeting}
                onChange={(e) =>
                  saveSection({ customGreeting: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-stone-200 p-2.5 text-xs outline-none focus:border-[#3B52DE]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  saveSection({
                    drafts: drafts.includes(selectedCard.id)
                      ? drafts
                      : [...drafts, selectedCard.id],
                  });
                  toast.info("Đã lưu vào Bản nháp");
                  setSelectedCard(null);
                }}
                className="rounded-lg border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700"
              >
                Lưu bản nháp
              </button>
              <button
                type="button"
                onClick={() => {
                  saveSection({
                    selectedCardId: selectedCard.id,
                    drafts: drafts.includes(selectedCard.id)
                      ? drafts
                      : [...drafts, selectedCard.id],
                  });
                  toast.success(
                    `Đã áp dụng mẫu "${selectedCard.name}" (đã lưu Neon DB)`
                  );
                  setSelectedCard(null);
                }}
                className="rounded-lg bg-[#3B52DE] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2F43C2]"
              >
                Áp dụng mẫu này
              </button>
            </div>
          </div>
        )}
      </Modal>
    </FeatureShell>
  );
}
