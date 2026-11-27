import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  Gift,
  Heart,
  MapPin,
  Plus,
  QrCode,
  Search,
  Send,
  Share2,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal, useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import galleryBouquet from "../../assets/image/gallery-bouquet.jpg";
import galleryCeremony from "../../assets/image/gallery-ceremony.jpg";
import galleryDining from "../../assets/image/gallery-dining.jpg";
import heroWedding from "../../assets/image/hero-wedding.jpg";
import FeatureShell from "./FeatureShell";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";
import giftApi from "../../services/giftApi";
import { extractApiError } from "../../services/api";

function parseVndNumber(val) {
  if (typeof val === "number") return val;
  const digits = String(val || "").replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function formatVnd(num) {
  return `${(Number(num) || 0).toLocaleString("vi-VN")} đ`;
}

const INITIAL_GIFTS = [
  {
    id: "rg1",
    title: "Quỹ Tuần Trăng Mật Đà Lạt",
    category: "Quỹ tiền mặt",
    target: "20.000.000 đ",
    received: "12.500.000 đ",
    status: "active",
    thanked: false,
  },
  {
    id: "rg2",
    title: "Máy pha cà phê Espresso",
    category: "Đồ gia dụng",
    target: "8.500.000 đ",
    received: "8.500.000 đ",
    status: "fulfilled",
    thanked: true,
  },
  {
    id: "rg3",
    title: "Bộ ấm trà gốm sứ Minh Long",
    category: "Bàn ăn",
    target: "2.200.000 đ",
    received: "0 đ",
    status: "active",
    thanked: false,
  },
];

const CATALOG_SUGGESTIONS = [
  {
    id: "cat1",
    title: "Quỹ Du Lịch Châu Âu",
    category: "Quỹ tiền mặt",
    price: "30.000.000 đ",
    image: galleryCeremony,
  },
  {
    id: "cat2",
    title: "Nồi chiên không dầu Philips",
    category: "Nhà bếp",
    price: "3.900.000 đ",
    image: galleryDining,
  },
  {
    id: "cat3",
    title: "Bộ chăn ga lụa Tencel cao cấp",
    category: "Phòng ngủ & Tắm",
    price: "4.500.000 đ",
    image: galleryBouquet,
  },
  {
    id: "cat4",
    title: "Voucher nghỉ dưỡng 3N2Đ Phú Quốc",
    category: "Trải nghiệm",
    price: "12.000.000 đ",
    image: heroWedding,
  },
];

const DEPARTMENTS = [
  "Tất cả",
  "Quỹ tiền mặt",
  "Nhà bếp",
  "Đồ gia dụng",
  "Bàn ăn",
  "Phòng ngủ & Tắm",
  "Trải nghiệm",
];

export default function RegistryPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { wedding } = useCurrentWedding();

  const { data: registryData, saveSection } = useWeddingFeature(
    wedding,
    "registry_config",
    {
      gifts: INITIAL_GIFTS,
      isPublic: true,
      guestEstimate: 100,
      shippingAddress: "",
      hideAddressUntilPurchased: true,
      greetingNote:
        "Sự hiện diện của bạn là món quà quý giá nhất đối với tụi mình! Nếu muốn gửi thêm quà mừng hoặc góp quỹ trăng mật, bạn có thể chọn bên dưới nhé.",
    }
  );

  const gifts = useMemo(
    () => registryData.gifts || INITIAL_GIFTS,
    [registryData.gifts]
  );
  const isPublic = registryData.isPublic ?? true;
  const guestEstimate = registryData.guestEstimate ?? 100;
  const greetingNote = registryData.greetingNote || "";
  const shippingAddress = registryData.shippingAddress || "";
  const hideAddressUntilPurchased =
    registryData.hideAddressUntilPurchased ?? true;

  const [tab, setTab] = useState("shop");
  const [department, setDepartment] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [guestInput, setGuestInput] = useState(String(guestEstimate));
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [thankTarget, setThankTarget] = useState(null);
  const [thankDraft, setThankDraft] = useState("");
  const [noteDraft, setNoteDraft] = useState(greetingNote);
  const [shippingDraft, setShippingDraft] = useState(shippingAddress);
  const [hideAddrDraft, setHideAddrDraft] = useState(hideAddressUntilPurchased);

  // Add Gift form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Quỹ tiền mặt");
  const [target, setTarget] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [allowGroupGift, setAllowGroupGift] = useState(true);
  const [allowCashSwap, setAllowCashSwap] = useState(true);

  // Neon DB: `gifts` contributions & `gift_accounts` bank info
  const [dbContributions, setDbContributions] = useState([]);
  const [bankForm, setBankForm] = useState({
    bank_code: "MB",
    account_number: "0987654321",
    account_name: "TRAN THANH KHANG",
  });
  const [isSavingBank, setIsSavingBank] = useState(false);

  // Record Contribution modal state
  const [recordGiftItem, setRecordGiftItem] = useState(null);
  const [giverName, setGiverName] = useState("");
  const [giftAmount, setGiftAmount] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!wedding?.id) return;
    let cancelled = false;
    giftApi
      .listByWedding(wedding.id)
      .then((res) => {
        if (cancelled) return;
        if (Array.isArray(res?.gifts)) {
          setDbContributions(res.gifts);
        }
        if (Array.isArray(res?.accounts) && res.accounts.length > 0) {
          const acc = res.accounts[0];
          setBankForm({
            bank_code: acc.bank_code || "MB",
            account_number: acc.account_number || "",
            account_name: acc.account_name || "",
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [wedding?.id]);

  const coupleName = (
    wedding?.title || "Trần Thanh Khang & Trần Ngọc An"
  ).normalize("NFC");

  const filteredGifts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return gifts.filter((g) => {
      const matchDept = department === "Tất cả" || g.category === department;
      const matchQ = !q || g.title.toLowerCase().includes(q);
      return matchDept && matchQ;
    });
  }, [gifts, department, search]);

  const filteredCatalog = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CATALOG_SUGGESTIONS.filter((c) => {
      const matchDept = department === "Tất cả" || c.category === department;
      const matchQ = !q || c.title.toLowerCase().includes(q);
      return matchDept && matchQ;
    });
  }, [department, search]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    saveSection((prev) => ({
      ...prev,
      gifts: [
        {
          id: `rg-${Date.now()}`,
          title: title.trim(),
          category,
          target: target.trim() || "Tuỳ chọn",
          received: "0 đ",
          externalUrl: externalUrl.trim() || "",
          allowGroupGift,
          allowCashSwap,
          status: "active",
          thanked: false,
        },
        ...(prev.gifts || INITIAL_GIFTS),
      ],
    }));
    toast.success("Đã thêm món quà vào Quà mừng (đã lưu Neon DB)");
    setTitle("");
    setTarget("");
    setExternalUrl("");
    setIsAddOpen(false);
  };

  const handleRecordContribution = async (e) => {
    e.preventDefault();
    if (!giverName.trim()) {
      toast.error("Vui lòng nhập tên người mừng.");
      return;
    }
    const amt = parseVndNumber(giftAmount);
    if (amt <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    setIsRecording(true);
    try {
      const noteText = recordGiftItem
        ? `[${recordGiftItem.title}] ${giftMessage.trim()}`.trim()
        : giftMessage.trim();

      if (wedding?.id) {
        const created = await giftApi.createGift({
          wedding_id: wedding.id,
          giver_name: giverName.trim(),
          amount: amt,
          message: noteText,
          status: "confirmed",
        });
        if (created) {
          setDbContributions((prev) => [created, ...prev]);
        }
      }

      if (recordGiftItem) {
        saveSection((prev) => ({
          ...prev,
          gifts: (prev.gifts || INITIAL_GIFTS).map((item) => {
            if (item.id !== recordGiftItem.id) return item;
            const nextReceived = parseVndNumber(item.received) + amt;
            const targetVal = parseVndNumber(item.target);
            return {
              ...item,
              received: formatVnd(nextReceived),
              status: targetVal > 0 && nextReceived >= targetVal ? "fulfilled" : "active",
            };
          }),
        }));
      }

      toast.success(`Đã ghi nhận ${formatVnd(amt)} từ ${giverName.trim()} lên Neon DB!`);
      setGiverName("");
      setGiftAmount("");
      setGiftMessage("");
      setRecordGiftItem(null);
      setIsRecordOpen(false);
    } catch (err) {
      toast.error(extractApiError(err, "Không thể ghi nhận khoản mừng cưới."));
    } finally {
      setIsRecording(false);
    }
  };

  const handleSaveBankAccount = async (e) => {
    e.preventDefault();
    if (!wedding?.id) {
      toast.info("Đã cập nhật thông tin QR tạm thời.");
      return;
    }
    setIsSavingBank(true);
    try {
      await giftApi.upsertBankAccount({
        wedding_id: wedding.id,
        ...bankForm,
      });
      toast.success("Đã lưu tài khoản VietQR lên bảng gift_accounts (Neon DB)!");
    } catch (err) {
      toast.error(extractApiError(err, "Không thể lưu tài khoản ngân hàng."));
    } finally {
      setIsSavingBank(false);
    }
  };

  const openThankComposer = (item, isContribution = false) => {
    const recipient = isContribution ? item.giver_name : "Quý khách";
    const giftLabel = isContribution
      ? formatVnd(item.amount)
      : item.title;
    setThankTarget({ item, isContribution });
    setThankDraft(
      `Thân gửi ${recipient},\n\n${coupleName} xin chân thành cảm ơn tình cảm và món quà (${giftLabel}) bạn đã gửi chúc phúc trong ngày trọng đại của tụi mình. Sự quan tâm của bạn là niềm hạnh phúc lớn lao đối với hai vợ chồng!\n\nTrân trọng,\n${coupleName}`
    );
  };

  const handleAddFromCatalog = (item) => {
    saveSection((prev) => ({
      ...prev,
      gifts: [
        {
          id: `rg-${Date.now()}`,
          title: item.title,
          category: item.category,
          target: item.price,
          received: "0 đ",
          status: "active",
          thanked: false,
        },
        ...(prev.gifts || INITIAL_GIFTS),
      ],
    }));
    toast.success(`Đã thêm "${item.title}" vào danh sách Quà mừng`);
  };

  const handleRemoveGift = (id) => {
    saveSection((prev) => ({
      ...prev,
      gifts: (prev.gifts || INITIAL_GIFTS).filter((g) => g.id !== id),
    }));
    toast.info("Đã xoá khỏi danh sách Quà mừng");
  };

  const handleMarkThanked = (g) => {
    saveSection((prev) => ({
      ...prev,
      gifts: (prev.gifts || INITIAL_GIFTS).map((item) =>
        item.id === g.id ? { ...item, thanked: true } : item
      ),
    }));
    toast.success(`Đã đánh dấu gửi lời cảm ơn cho "${g.title}"`);
  };

  const availableCount = gifts.filter((g) => g.status !== "fulfilled").length;
  const receivedCount = gifts.filter((g) => g.received !== "0 đ").length;

  return (
    <FeatureShell
      title="Quà mừng & Quỹ chung đôi (Registry)"
      subtitle="Thiết kế danh sách quà tặng, quỹ tiền mặt 0% phí & theo dõi lời cảm ơn"
      wedding={wedding}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              saveSection({ isPublic: !isPublic });
              toast.info(
                isPublic
                  ? "Đã chuyển Quà mừng sang Riêng tư"
                  : "Đã bật Công khai Quà mừng"
              );
            }}
            className={`hidden rounded-full border px-3 py-1.5 text-xs font-semibold sm:inline-flex ${
              isPublic
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-stone-200 bg-white text-stone-700"
            }`}
          >
            {isPublic ? "Công khai" : "Riêng tư"}
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(
                `https://everweb.vn/${wedding?.slug || "khang-an"}/registry`
              );
              toast.success("Đã sao chép đường dẫn Quà mừng");
            }}
            className="hidden items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1F1A17] hover:border-[#3B52DE] sm:inline-flex"
          >
            <Share2 size={13} /> Chia sẻ
          </button>
          <button
            type="button"
            onClick={() => {
              setShippingDraft(shippingAddress);
              setHideAddrDraft(hideAddressUntilPurchased);
              setIsShippingOpen(true);
            }}
            className="hidden items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1F1A17] hover:border-[#3B52DE] sm:inline-flex cursor-pointer"
          >
            <MapPin size={13} /> Địa chỉ nhận quà
          </button>
          <button
            type="button"
            onClick={() => setIsQrOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1F1A17] hover:border-[#3B52DE] cursor-pointer"
          >
            <QrCode size={13} /> VietQR
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1F1A17] px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition"
          >
            <Plus size={14} /> Thêm quà tặng
          </button>
        </div>
      }
    >
      {/* WithJoy Registry 3-Tab Sub-Header */}
      <div className="mb-5 rounded-2xl border border-stone-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "shop", label: "Thêm quà mừng" },
              { key: "manage", label: `Quản lý Quà mừng (${gifts.length})` },
              { key: "track", label: "Theo dõi & Cảm ơn" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  tab === t.key
                    ? "bg-[#1F1A17] text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200/70"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm quà tặng, quỹ mừng..."
                className="w-56 rounded-full border border-stone-200 bg-stone-50 py-1.5 pr-3 pl-8 text-xs outline-none focus:border-[#3B52DE] sm:w-72"
              />
            </div>
            <button
              type="button"
              onClick={() => setTab("manage")}
              className="hidden items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1F1A17] sm:inline-flex"
            >
              <Gift size={13} className="text-[#3B52DE]" />
              {gifts.length} Quà
            </button>
          </div>
        </div>

        {/* Department Links (WithJoy Style) */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setDepartment(dept)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                department === dept
                  ? "bg-[#3B52DE] text-white"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: ADD GIFTS (WithJoy Shop View) */}
      {tab === "shop" && (
        <div className="space-y-6">
          {/* Explore Your Registry Strip */}
          <div>
            <h2 className="mb-3 text-sm font-bold text-[#1F1A17]">
              Khám phá Quà mừng của bạn
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Gợi ý chuẩn cặp đôi",
                  sub: "Những món quà thiết thực nhất",
                  action: () => setDepartment("Đồ gia dụng"),
                },
                {
                  title: "Quà tặng dưới 3 triệu",
                  sub: "Phù hợp nhóm bạn thân",
                  action: () => setDepartment("Bàn ăn"),
                },
                {
                  title: "Tạo Quỹ Tuần Trăng Mật",
                  sub: "Nhận mừng cưới 0% phí",
                  action: () => {
                    setCategory("Quỹ tiền mặt");
                    setIsAddOpen(true);
                  },
                },
                {
                  title: "Mở mã VietQR nhanh",
                  sub: "Gắn thẳng lên Website cưới",
                  action: () => setIsQrOpen(true),
                },
              ].map((card) => (
                <button
                  key={card.title}
                  type="button"
                  onClick={card.action}
                  className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 text-left transition hover:border-[#3B52DE] hover:shadow-sm"
                >
                  <div>
                    <p className="text-xs font-bold text-[#1F1A17]">
                      {card.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-stone-500">
                      {card.sub}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-stone-500" />
                </button>
              ))}
            </div>
          </div>

          {/* WithJoy Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-[#1F1A17] text-white shadow-md">
            <img
              src={heroWedding}
              alt="Registry Hero"
              className="h-56 w-full object-cover opacity-45 sm:h-64"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                Quà mừng cưới tinh tế, trọn vẹn yêu thương.
              </h2>
              <p className="mt-2 max-w-xl text-xs text-white/90 sm:text-sm">
                Tổng hợp quà tặng gia đình, trải nghiệm du lịch và quỹ mừng cưới
                VietQR 0% phí tại một nơi duy nhất.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(true)}
                  className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-[#1F1A17] transition hover:bg-stone-50"
                >
                  + Tạo Quỹ / Quà mừng mới
                </button>
                <button
                  type="button"
                  onClick={() => setTab("manage")}
                  className="rounded-full border border-white/60 px-5 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  Xem danh sách ({gifts.length})
                </button>
              </div>
            </div>
          </div>

          {/* 3-Column Feature Cards (matching WithJoy screenshot) */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="font-display text-xl font-semibold text-[#1F1A17]">
                Chưa biết bắt đầu từ đâu?
              </p>
              <p className="mt-1 text-xs text-stone-600">
                Chọn nhanh từ bộ sưu tập gợi ý dành riêng cho tân gia & cặp đôi mới.
              </p>
              <button
                type="button"
                onClick={() => setDepartment("Tất cả")}
                className="mt-4 rounded-full bg-[#1F1A17] px-4 py-1.5 text-xs font-semibold text-white"
              >
                Xem gợi ý bên dưới
              </button>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <p className="font-display text-xl font-semibold text-[#1F1A17]">
                Quỹ mừng cưới 0% phí.
              </p>
              <p className="mt-1 text-xs text-stone-600">
                Tạo quỹ Tuần Trăng Mật hoặc Quỹ Tổ Ấm, nhận chuyển khoản trực tiếp.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategory("Quỹ tiền mặt");
                  setIsAddOpen(true);
                }}
                className="mt-4 rounded-full bg-[#3B52DE] px-4 py-1.5 text-xs font-semibold text-white"
              >
                Tạo Quỹ tiền mặt
              </button>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="font-display text-xl font-semibold text-[#1F1A17]">
                Ước tính số lượng khách mời
              </p>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={guestInput}
                  onChange={(e) => setGuestInput(e.target.value)}
                  className="w-24 rounded-xl border border-stone-200 px-3 py-1.5 text-xs font-semibold outline-none focus:border-[#3B52DE]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const num = Math.max(1, Number(guestInput) || 100);
                    saveSection({ guestEstimate: num });
                    toast.success(`Đã lưu ước tính ${num} khách mời lên Neon DB`);
                  }}
                  className="rounded-full border border-[#1F1A17] px-4 py-1.5 text-xs font-semibold text-[#1F1A17] hover:bg-[#1F1A17] hover:text-white"
                >
                  Lưu ước tính
                </button>
              </div>
            </div>
          </div>

          {/* Curated Catalog Grid */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-[#1F1A17]">
              Gợi ý thêm nhanh vào danh sách Quà mừng
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredCatalog.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:border-[#3B52DE] hover:shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-36 w-full object-cover"
                  />
                  <div className="p-4">
                    <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-semibold text-[#3B52DE]">
                      {item.category}
                    </span>
                    <h4 className="mt-2 text-sm font-bold text-[#1F1A17]">
                      {item.title}
                    </h4>
                    <p className="mt-0.5 text-xs font-semibold text-stone-600">
                      {item.price}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAddFromCatalog(item)}
                      className="mt-3 w-full rounded-xl bg-stone-50 py-2 text-xs font-semibold text-[#1F1A17] transition hover:bg-[#3B52DE] hover:text-white"
                    >
                      + Thêm vào Quà mừng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE REGISTRY */}
      {tab === "manage" && (
        <div className="space-y-5">
          {/* Couple Greeting Card */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5">
            <div className="max-w-2xl">
              <p className="font-display text-2xl font-semibold text-[#1F1A17]">
                {coupleName}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
                {greetingNote}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setNoteDraft(greetingNote);
                setIsNoteOpen(true);
              }}
              className="rounded-full border border-stone-200 px-4 py-1.5 text-xs font-semibold text-[#1F1A17] hover:border-[#3B52DE]"
            >
              Sửa lời chào
            </button>
          </div>

          {/* Gifts List with Group Gifting Progress */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {filteredGifts.map((g) => {
              const recvNum = parseVndNumber(g.received);
              const targNum = parseVndNumber(g.target);
              const pct =
                targNum > 0 ? Math.min(100, Math.round((recvNum / targNum) * 100)) : 0;

              return (
                <div
                  key={g.id}
                  className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#3B52DE]">
                          {g.category}
                        </span>
                        {g.allowGroupGift && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                            Góp chung
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveGift(g.id)}
                        aria-label="Xoá quà"
                        className="rounded-lg p-1 text-stone-500 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h3 className="mt-3 text-sm font-bold text-[#1F1A17]">
                      {g.title}
                    </h3>
                    {g.externalUrl && (
                      <a
                        href={g.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#3B52DE] hover:underline"
                      >
                        <ExternalLink size={11} /> Xem sản phẩm gốc
                      </a>
                    )}
                    <div className="mt-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-stone-500 tabular-nums">
                        <span>
                          Đã nhận: <b className="text-[#1F1A17]">{g.received}</b>
                        </span>
                        <span>{targNum > 0 ? `${pct}%` : g.target}</span>
                      </div>
                      {targNum > 0 && (
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                          <div
                            className="h-full rounded-full bg-[#3B52DE] transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                      <p className="text-[11px] text-stone-400">
                        Mục tiêu: {g.target}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRecordGiftItem(g);
                        setIsRecordOpen(true);
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-stone-100 hover:bg-stone-200 py-2 text-[11px] font-semibold text-[#1F1A17] transition cursor-pointer"
                    >
                      <Plus size={12} /> Ghi nhận
                    </button>
                    <button
                      type="button"
                      onClick={() => openThankComposer(g, false)}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-stone-200 py-2 text-[11px] font-semibold text-[#1F1A17] transition hover:border-[#3B52DE] hover:text-[#3B52DE] cursor-pointer"
                    >
                      <Heart size={12} /> {g.thanked ? "Đã cảm ơn" : "Cảm ơn"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: TRACK GIFTS & SEND THANKS */}
      {tab === "track" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-xs text-stone-500">Quà đang mở</p>
              <p className="mt-1 text-2xl font-bold text-[#1F1A17]">
                {availableCount}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-xs text-stone-500">Tổng tiền đã ghi nhận (Neon DB)</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">
                {dbContributions.length > 0
                  ? formatVnd(
                      dbContributions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0)
                    )
                  : `${receivedCount} mục`}
              </p>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5">
              <div>
                <p className="text-xs text-stone-500">Khách dự kiến</p>
                <p className="mt-1 text-2xl font-bold text-[#3B52DE]">
                  {guestEstimate}
                </p>
              </div>
              <Users size={22} className="text-[#3B52DE]" />
            </div>
          </div>

          {/* Real Neon DB `gifts` Contributions */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#1F1A17]">
                  Lịch sử khách mừng cưới (Bảng gifts · Neon DB)
                </h3>
                <p className="text-[11px] text-stone-500">
                  Theo dõi từng khoản mừng từ khách và soạn lời cảm ơn cá nhân hóa
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRecordGiftItem(null);
                  setIsRecordOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1F1A17] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 cursor-pointer"
              >
                <Plus size={13} /> Ghi nhận khoản mừng
              </button>
            </div>

            {dbContributions.length === 0 ? (
              <p className="rounded-xl bg-stone-50 p-4 text-center text-xs text-stone-500">
                Chưa có khoản mừng nào được ghi nhận trong bảng <code>gifts</code>. Bấm <b>&quot;+ Ghi nhận khoản mừng&quot;</b> để lưu thử vào Neon Database!
              </p>
            ) : (
              <div className="divide-y divide-stone-100">
                {dbContributions.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#1F1A17]">
                        {c.giver_name} ·{" "}
                        <span className="text-emerald-700 tabular-nums">
                          {formatVnd(c.amount)}
                        </span>
                      </p>
                      {c.message && (
                        <p className="text-stone-500 italic mt-0.5">&ldquo;{c.message}&rdquo;</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => openThankComposer(c, true)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#3B52DE] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2F43C2] cursor-pointer"
                    >
                      <Send size={12} /> Soạn lời cảm ơn
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1F1A17]">
                Theo dõi Quà đã nhận & Lời cảm ơn
              </h3>
              <button
                type="button"
                onClick={() =>
                  navigate(ROUTE_PATHS.INVITATIONS_STUDIO, {
                    state: { wedding, category: "Thiệp cảm ơn" },
                  })
                }
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#3B52DE] hover:underline"
              >
                <Sparkles size={13} /> Mở mẫu Thiệp cảm ơn
              </button>
            </div>
            <div className="divide-y divide-stone-100">
              {gifts.map((g) => (
                <div
                  key={g.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs"
                >
                  <div>
                    <p className="font-bold text-[#1F1A17]">{g.title}</p>
                    <p className="text-stone-500">
                      {g.category} · Đã nhận {g.received} / {g.target}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMarkThanked(g)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer ${
                      g.thanked
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-[#3B52DE] text-white hover:bg-[#2F43C2]"
                    }`}
                  >
                    <Check size={12} />
                    {g.thanked ? "Đã cảm ơn" : "Đánh dấu đã cảm ơn"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Gift Modal (Universal Link + Group Gifting) */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Thêm quà mừng mới"
        size="sm"
      >
        <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tên món quà hoặc quỹ (VD: Quỹ nội thất)"
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#3B52DE]"
            autoFocus
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#3B52DE]"
          >
            {DEPARTMENTS.filter((d) => d !== "Tất cả").map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Giá trị dự kiến (VD: 5.000.000 đ)"
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#3B52DE]"
          />
          <input
            type="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="Link sản phẩm ngoài (Shopee / Lazada / Tiki - tuỳ chọn)"
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
          />
          <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={allowGroupGift}
              onChange={(e) => setAllowGroupGift(e.target.checked)}
              className="rounded border-stone-300"
            />
            <span>Cho phép nhiều khách góp chung (Group Gifting)</span>
          </label>
          <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={allowCashSwap}
              onChange={(e) => setAllowCashSwap(e.target.checked)}
              className="rounded border-stone-300"
            />
            <span>Cho phép khách quy đổi thành tiền mặt 0% phí</span>
          </label>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="rounded-lg border border-stone-200 px-4 py-2 text-xs font-medium cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#3B52DE] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2F43C2] cursor-pointer"
            >
              Thêm & Lưu
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Gift Contribution Modal */}
      <Modal
        isOpen={isRecordOpen}
        onClose={() => !isRecording && setIsRecordOpen(false)}
        title={
          recordGiftItem
            ? `Ghi nhận đóng góp: ${recordGiftItem.title}`
            : "Ghi nhận khoản mừng cưới mới"
        }
        size="sm"
      >
        <form onSubmit={handleRecordContribution} className="space-y-3 text-xs">
          <input
            type="text"
            required
            value={giverName}
            onChange={(e) => setGiverName(e.target.value)}
            placeholder="Tên khách mừng (VD: Anh Hoàng Nam)"
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#3B52DE]"
            autoFocus
          />
          <input
            type="text"
            required
            value={giftAmount}
            onChange={(e) => setGiftAmount(e.target.value)}
            placeholder="Số tiền mừng (VD: 1000000)"
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-[#3B52DE]"
          />
          <textarea
            rows={2}
            value={giftMessage}
            onChange={(e) => setGiftMessage(e.target.value)}
            placeholder="Lời chúc kèm theo (tuỳ chọn)"
            className="w-full rounded-xl border border-stone-200 p-2.5 text-xs outline-none focus:border-[#3B52DE]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRecordOpen(false)}
              className="rounded-lg border border-stone-200 px-4 py-2 font-medium cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={isRecording}
              className="rounded-lg bg-[#3B52DE] px-4 py-2 font-semibold text-white hover:bg-[#2F43C2] disabled:opacity-60 cursor-pointer"
            >
              {isRecording ? "Đang lưu..." : "Lưu vào Neon DB"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Shipping Address Modal */}
      <Modal
        isOpen={isShippingOpen}
        onClose={() => setIsShippingOpen(false)}
        title="Địa chỉ nhận quà tặng vật lý"
        size="sm"
      >
        <div className="space-y-3 text-xs">
          <p className="text-stone-600">
            Địa chỉ để khách mời gửi quà tặng hiện vật (máy pha cà phê, đồ gia dụng...).
          </p>
          <textarea
            rows={3}
            value={shippingDraft}
            onChange={(e) => setShippingDraft(e.target.value)}
            placeholder="VD: Số 2, Đường Xô Viết Nghệ Tĩnh, TP. Hà Tĩnh (SĐT nhận hàng: 0909...)"
            className="w-full rounded-xl border border-stone-200 p-3 text-xs outline-none focus:border-[#3B52DE]"
          />
          <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={hideAddrDraft}
              onChange={(e) => setHideAddrDraft(e.target.checked)}
              className="rounded border-stone-300"
            />
            <span>Ẩn địa chỉ công khai (chỉ hiện khi khách bấm tặng quà)</span>
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsShippingOpen(false)}
              className="rounded-lg border border-stone-200 px-4 py-2 font-medium cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="button"
              onClick={() => {
                saveSection({
                  shippingAddress: shippingDraft.trim(),
                  hideAddressUntilPurchased: hideAddrDraft,
                });
                toast.success("Đã lưu địa chỉ nhận quà!");
                setIsShippingOpen(false);
              }}
              className="rounded-lg bg-[#3B52DE] px-4 py-2 font-semibold text-white cursor-pointer"
            >
              Lưu địa chỉ
            </button>
          </div>
        </div>
      </Modal>

      {/* Auto Thank-You Note Modal */}
      <Modal
        isOpen={Boolean(thankTarget)}
        onClose={() => setThankTarget(null)}
        title="Soạn lời cảm ơn cá nhân hóa"
        size="sm"
      >
        <div className="space-y-3 text-xs">
          <textarea
            rows={6}
            value={thankDraft}
            onChange={(e) => setThankDraft(e.target.value)}
            className="w-full rounded-xl border border-stone-200 p-3 text-xs leading-relaxed outline-none focus:border-[#3B52DE]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setThankTarget(null)}
              className="rounded-lg border border-stone-200 px-4 py-2 font-medium cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(thankDraft);
                if (thankTarget && !thankTarget.isContribution) {
                  handleMarkThanked(thankTarget.item);
                } else {
                  toast.success("Đã sao chép lời cảm ơn để gửi qua Zalo / Email!");
                }
                setThankTarget(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#3B52DE] px-4 py-2 font-semibold text-white hover:bg-[#2F43C2] cursor-pointer"
            >
              <Copy size={13} />
              <span>Copy & Đánh dấu đã cảm ơn</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Greeting Note Modal */}
      <Modal
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        title="Chỉnh sửa lời chào Quà mừng"
        size="sm"
      >
        <div className="space-y-3">
          <textarea
            rows={4}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            className="w-full rounded-xl border border-stone-200 p-3 text-xs outline-none focus:border-[#3B52DE]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNoteOpen(false)}
              className="rounded-lg border border-stone-200 px-4 py-2 text-xs font-medium"
            >
              Huỷ
            </button>
            <button
              type="button"
              onClick={() => {
                saveSection({ greetingNote: noteDraft.trim() });
                toast.success("Đã lưu lời chào lên Neon DB");
                setIsNoteOpen(false);
              }}
              className="rounded-lg bg-[#3B52DE] px-4 py-2 text-xs font-semibold text-white"
            >
              Lưu
            </button>
          </div>
        </div>
      </Modal>
      {/* VietQR Bank Transfer Modal (Synced with gift_accounts on Neon DB) */}
      <Modal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        title="Mã VietQR & Tài khoản Mừng Cưới"
        size="sm"
      >
        <form onSubmit={handleSaveBankAccount} className="space-y-3.5 text-center text-xs">
          <img
            src={`https://img.vietqr.io/image/${bankForm.bank_code || "MB"}-${bankForm.account_number || "0987654321"}-compact2.png?addInfo=${encodeURIComponent(
              `Mung cuoi ${coupleName}`
            )}&accountName=${encodeURIComponent(bankForm.account_name || coupleName)}`}
            alt="Mã VietQR Mừng Cưới"
            className="mx-auto h-48 w-48 rounded-2xl border border-stone-200 p-2 shadow-2xs bg-white object-contain"
          />
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-left space-y-2">
            <div>
              <label className="block text-[10px] font-semibold text-stone-500 mb-1">
                Mã ngân hàng (VD: MB, VCB, TCB, ACB)
              </label>
              <input
                type="text"
                value={bankForm.bank_code}
                onChange={(e) =>
                  setBankForm({ ...bankForm, bank_code: e.target.value.toUpperCase() })
                }
                className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-semibold outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-stone-500 mb-1">
                Số tài khoản
              </label>
              <input
                type="text"
                value={bankForm.account_number}
                onChange={(e) =>
                  setBankForm({ ...bankForm, account_number: e.target.value })
                }
                className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-mono font-bold outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-stone-500 mb-1">
                Tên chủ tài khoản
              </label>
              <input
                type="text"
                value={bankForm.account_name}
                onChange={(e) =>
                  setBankForm({ ...bankForm, account_name: e.target.value.toUpperCase() })
                }
                className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-semibold uppercase outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(bankForm.account_number);
                toast.success("Đã sao chép số tài khoản mừng cưới");
              }}
              className="flex-1 rounded-xl border border-stone-200 py-2.5 text-xs font-semibold text-[#1F1A17] hover:bg-stone-50 transition cursor-pointer"
            >
              Sao chép STK
            </button>
            <button
              type="submit"
              disabled={isSavingBank}
              className="flex-1 rounded-xl bg-[#1F1A17] py-2.5 text-xs font-semibold text-white hover:bg-stone-800 disabled:opacity-60 transition cursor-pointer"
            >
              {isSavingBank ? "Đang lưu..." : "Lưu vào Neon DB"}
            </button>
          </div>
        </form>
      </Modal>
    </FeatureShell>
  );
}
