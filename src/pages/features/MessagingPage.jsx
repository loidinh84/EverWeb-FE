import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  PanelLeft,
  Mail,
  MessageSquare,
  Users,
  Bed,
  MapPin,
  CheckCircle2,
  Clock,
  CheckCheck,
  Plus,
  ArrowRight,
  ArrowLeft,
  X,
  ChevronDown,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { useToast } from "../../components/common";
import weddingApi from "../../services/weddingApi";
import { extractApiError } from "../../services/api";
import { ROUTE_PATHS } from "../../constants/roles";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";
import weddingCouple from "../../assets/image/wedding-couple.jpg";
import galleryBouquet from "../../assets/image/gallery-bouquet.jpg";
import heroWedding from "../../assets/image/hero-wedding.jpg";
import galleryCeremony from "../../assets/image/gallery-ceremony.jpg";
import galleryDining from "../../assets/image/gallery-dining.jpg";

// Danh sách 6 mẫu tin nhắn nhanh (Việt hóa 100%, chuẩn 6 cột cân xứng)
const QUICK_TEMPLATES = [
  {
    id: "text_blast",
    label: "Tin nhắn SMS",
    vietLabel: "Gửi hàng loạt",
    icon: MessageSquare,
    color: "text-[#8B5CF6]",
    cardBg: "bg-[#F8F9FB] hover:bg-[#F2F4F8]",
    deliveryMethod: "text",
    subject: "Tin nhắn thông báo tiệc cưới",
    headline: "Đám cưới của tụi mình sắp diễn ra!",
    message:
      "Chào bạn, ngày trọng đại của tụi mình sắp đến rồi! Mọi thông tin chi tiết về địa điểm và lịch trình đã được cập nhật đầy đủ trên trang cưới. Bạn nhớ ghé xem nhé!",
    buttonText: "Xem trang cưới & Lịch trình",
    linkUrl: "https://everweb.vn/wedding/event-info",
  },
  {
    id: "email",
    label: "Email thông báo",
    vietLabel: "Thư điện tử",
    icon: Mail,
    color: "text-[#F97316]",
    cardBg: "bg-[#F8F9FB] hover:bg-[#F2F4F8]",
    deliveryMethod: "email",
    subject: "Tin tức mới nhất về ngày vui của tụi mình",
    headline: "Chúng mình rất vui được chia sẻ thông tin này đến bạn",
    message:
      "Tụi mình vô cùng hạnh phúc khi được chuẩn bị cho ngày trọng đại. Rất mong sẽ được gặp gỡ và chia sẻ niềm vui trọn vẹn cùng bạn và gia đình trong ngày chung đôi sắp tới!",
    buttonText: "Xem chi tiết sự kiện",
    linkUrl: "https://everweb.vn/wedding/invitation",
  },
  {
    id: "collect_contacts",
    label: "Thu thập liên hệ",
    vietLabel: "Xin SĐT & địa chỉ",
    icon: Users,
    color: "text-[#F43F5E]",
    cardBg: "bg-[#F8F9FB] hover:bg-[#F2F4F8]",
    deliveryMethod: "both",
    subject: "Cập nhật địa chỉ nhận thiệp cưới",
    headline: "Hãy gửi thông tin để tụi mình gửi thiệp cưới đến bạn nhé!",
    message:
      "Để chuẩn bị chu đáo nhất cho ngày vui sắp tới, tụi mình đang hoàn thiện danh sách gửi thiệp mời. Bạn vui lòng dành 1 phút chia sẻ địa chỉ nhận thiệp và số điện thoại nhé.",
    buttonText: "Cập nhật địa chỉ nhận thiệp",
    linkUrl: "https://everweb.vn/contact-collector",
  },
  {
    id: "hotel",
    label: "Nhắc đặt khách sạn",
    vietLabel: "Phòng nghỉ ưu đãi",
    icon: Bed,
    color: "text-[#3B82F6]",
    cardBg: "bg-[#F8F9FB] hover:bg-[#F2F4F8]",
    deliveryMethod: "email",
    subject: "Gợi ý khách sạn & xe đưa đón tiệc cưới",
    headline: "Bạn đã đặt phòng khách sạn cho ngày cưới chưa?",
    message:
      "Tụi mình đã liên hệ với các khách sạn gần địa điểm tổ chức tiệc cưới để có chính sách giá ưu đãi nhất cho bạn bè và người thân. Hãy đặt phòng sớm trước khi hết chỗ nhé!",
    buttonText: "Xem danh sách khách sạn ưu đãi",
    linkUrl: "https://everweb.vn/accommodations",
  },
  {
    id: "stay_details",
    label: "Thông tin nơi ở",
    vietLabel: "Cập nhật lưu trú",
    icon: MapPin,
    color: "text-[#6366F1]",
    cardBg: "bg-[#F8F9FB] hover:bg-[#F2F4F8]",
    deliveryMethod: "email",
    subject: "Bạn đã đặt phòng chưa? - Cập nhật nơi ở",
    headline: "Cập nhật thông tin lưu trú của bạn",
    message:
      "Dù bạn đã đặt phòng hay vẫn đang lựa chọn, hãy chia sẻ thông tin nơi ở cùng tụi mình để tụi mình tiện sắp xếp xe đưa đón và tiếp đón chu đáo nhất nhé.",
    buttonText: "Chia sẻ nơi ở của bạn",
    linkUrl: "https://everweb.vn/stay-details",
  },
  {
    id: "rsvp_reminder",
    label: "Nhắc xác nhận RSVP",
    vietLabel: "Chốt khách tham dự",
    icon: CheckCircle2,
    color: "text-[#EC4899]",
    cardBg: "bg-[#F8F9FB] hover:bg-[#F2F4F8]",
    deliveryMethod: "both",
    subject: "Nhắc nhở xác nhận tham dự tiệc cưới",
    headline: "Đừng quên xác nhận tham dự trước ngày chốt tiệc nhé!",
    message:
      "Chỉ còn ít ngày nữa là đến hạn chốt danh sách số lượng khách và bàn tiệc. Bạn nhớ bấm xác nhận tham dự để tụi mình đón tiếp bạn thật chu đáo nhé!",
    buttonText: "Xác nhận tham dự (RSVP)",
    linkUrl: "https://everweb.vn/rsvp",
  },
];

// Danh sách 6 bộ sưu tập thiệp cưới (Việt hóa 100%, căn đều 6 cột)
const PAPER_DIGITAL_CARDS = [
  { title: "Báo hỷ ngày cưới", subtitle: "Save the Date", image: heroWedding },
  { title: "Thiệp mời chính thức", subtitle: "Thiệp cưới đại lễ", image: weddingCouple },
  { title: "Sơ đồ & Chỉ đường", subtitle: "Hướng dẫn sảnh tiệc", image: galleryBouquet },
  { title: "Thực đơn & Lịch trình", subtitle: "Chi tiết ngày cưới", image: galleryDining },
  { title: "Thiệp cảm ơn", subtitle: "Tri ân khách mời", image: galleryCeremony },
  { title: "Biển đón & Lời chúc", subtitle: "Đón tiếp sảnh tiệc", image: heroWedding },
];

export default function MessagingPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { wedding } = useCurrentWedding();

  const defaultCoupleName =
    wedding?.couple ||
    wedding?.title ||
    "Trần Thanh Khang & Trna";

  const defaultDrafts = useMemo(
    () => [
      {
        id: "draft-1",
        title: `Tin nhắn gửi từ ${defaultCoupleName}`,
        createdAt: "24 Th11, 2026",
        deliveryMethod: "both",
        recipients: "Tất cả khách mời (142 khách)",
        message:
          "Để chuẩn bị chu đáo nhất cho ngày vui sắp tới, tụi mình đang hoàn thiện danh sách gửi thiệp mời. Bạn vui lòng dành 1 phút chia sẻ địa chỉ nhé.",
      },
    ],
    [defaultCoupleName]
  );

  const { data: messagingData, saveSection } = useWeddingFeature(
    wedding,
    "messaging_config",
    {
      drafts: defaultDrafts,
      scheduledMessages: [],
      sentMessages: [
        {
          id: "sent-1",
          title: "Báo hỷ Save the Date - Ngày chung đôi",
          sentAt: "10 Th10, 2026 · 09:30",
          deliveryMethod: "both",
          recipients: "Tất cả khách mời (142)",
          deliveredCount: 140,
          openedCount: 118,
        },
      ],
    }
  );

  // Đảm bảo luôn có draft mẫu
  const drafts =
    messagingData.drafts && messagingData.drafts.length > 0
      ? messagingData.drafts
      : defaultDrafts;
  const scheduledMessages = messagingData.scheduledMessages || [];
  const sentMessages = messagingData.sentMessages || [];

  const updateDrafts = (updater) =>
    saveSection((prev) => ({
      ...prev,
      drafts: typeof updater === "function" ? updater(prev.drafts || drafts) : updater,
    }));

  const updateScheduled = (updater) =>
    saveSection((prev) => ({
      ...prev,
      scheduledMessages:
        typeof updater === "function"
          ? updater(prev.scheduledMessages || [])
          : updater,
    }));

  const updateSent = (updater) =>
    saveSection((prev) => ({
      ...prev,
      sentMessages:
        typeof updater === "function" ? updater(prev.sentMessages || []) : updater,
    }));

  // Sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Active navigation tab: "create" | "drafts" | "scheduled" | "sent"
  const [activeNav, setActiveNav] = useState("create");

  // View Mode: "hub" | "compose"
  const [viewMode, setViewMode] = useState("hub");

  // Form soạn tin nhắn (Compose Mode)
  const [composeForm, setComposeForm] = useState({
    id: null,
    deliveryMethod: "text",
    sendTime: "now",
    scheduledDate: "2026-12-01",
    scheduledTime: "09:00",
    recipientsGroup: "all",
    fromName: defaultCoupleName,
    subject: "Thông báo từ tiệc cưới của tụi mình",
    headline: "Chúng mình rất mong được đón tiếp bạn!",
    message:
      "Để chuẩn bị chu đáo nhất cho ngày vui sắp tới, tụi mình đang cập nhật thông tin liên lạc của khách mời. Bạn vui lòng chia sẻ thông tin nhé.",
    buttonText: "Xác nhận & Cập nhật thông tin",
    linkUrl: "https://everweb.vn/rsvp",
  });

  const [previewTab, setPreviewTab] = useState("text");
  const [isSending, setIsSending] = useState(false);

  const handleSelectTemplate = (template) => {
    setComposeForm((prev) => ({
      ...prev,
      id: `msg-${Date.now()}`,
      deliveryMethod: template.deliveryMethod,
      subject: template.subject,
      headline: template.headline || prev.headline,
      message: template.message,
      buttonText: template.buttonText,
      linkUrl: template.linkUrl,
    }));
    setPreviewTab(template.deliveryMethod === "email" ? "email" : "text");
    setViewMode("compose");
  };

  const handleSelectCard = (card) => {
    setComposeForm((prev) => ({
      ...prev,
      id: `card-${Date.now()}`,
      deliveryMethod: "both",
      subject: card.title,
      headline: card.subtitle,
      message: `Tụi mình thân gửi bạn ${card.title}. Mọi thông tin chi tiết và lịch trình ngày cưới đã được cập nhật đầy đủ, mời bạn cùng xem nhé!`,
      buttonText: "Xem chi tiết thiệp cưới",
      linkUrl: "https://everweb.vn/wedding/invitation",
    }));
    setPreviewTab("email");
    setViewMode("compose");
  };

  const handleOpenDraft = (draft) => {
    setComposeForm((prev) => ({
      ...prev,
      id: draft.id,
      deliveryMethod: draft.deliveryMethod || "both",
      message: draft.message,
      subject: draft.title,
    }));
    setViewMode("compose");
  };

  const handleSaveDraft = () => {
    const draftItem = {
      id: composeForm.id || `draft-${Date.now()}`,
      title: composeForm.subject || `Tin nhắn từ ${composeForm.fromName}`,
      createdAt: new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      deliveryMethod: composeForm.deliveryMethod,
      recipients:
        composeForm.recipientsGroup === "all"
          ? "Tất cả khách mời (142 khách)"
          : composeForm.recipientsGroup === "attending"
          ? "Khách đã xác nhận (88 khách)"
          : "Khách chưa phản hồi (45 khách)",
      message: composeForm.message,
    };

    updateDrafts((prev) => {
      const existingIndex = prev.findIndex((d) => d.id === draftItem.id);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = draftItem;
        return next;
      }
      return [draftItem, ...prev];
    });

    toast.success("Đã lưu bản nháp tin nhắn thành công!");
    setViewMode("hub");
  };

  const handleSendOrSchedule = async () => {
    if (!composeForm.message.trim()) {
      toast.error("Vui lòng nhập nội dung tin nhắn!");
      return;
    }

    if (
      composeForm.sendTime !== "scheduled" &&
      composeForm.deliveryMethod !== "text" &&
      wedding?.id
    ) {
      setIsSending(true);
      try {
        const res = await weddingApi.sendEmail(wedding.id, {
          senderName: composeForm.fromName,
          subject: composeForm.subject || `Thông báo từ ${composeForm.fromName}`,
          body: composeForm.message,
          buttonText: composeForm.buttonText || "Xem Website cưới",
          ctaUrl:
            composeForm.linkUrl && !composeForm.linkUrl.startsWith("https://everweb.vn")
              ? composeForm.linkUrl
              : `${window.location.origin}/contact/${wedding?.slug || "khang-an"}`,
        });
        toast.success(
          `Đã gửi Email thật tới ${res?.sentCount || 1} khách mời!`
        );
      } catch (err) {
        toast.error(
          extractApiError(err, "Không thể gửi Email").message
        );
        return;
      } finally {
        setIsSending(false);
      }
    }

    if (composeForm.sendTime === "scheduled") {
      const scheduledItem = {
        id: `sched-${Date.now()}`,
        title: composeForm.subject || `Tin nhắn từ ${composeForm.fromName}`,
        scheduledFor: `${composeForm.scheduledDate} lúc ${composeForm.scheduledTime}`,
        deliveryMethod: composeForm.deliveryMethod,
        recipients:
          composeForm.recipientsGroup === "all"
            ? "Tất cả khách mời"
            : "Nhóm khách chọn lọc",
        message: composeForm.message,
      };
      updateScheduled((prev) => [scheduledItem, ...prev]);
      toast.success(
        `Đã lên lịch gửi tin nhắn vào ${composeForm.scheduledDate} lúc ${composeForm.scheduledTime}!`
      );
    } else {
      const sentItem = {
        id: `sent-${Date.now()}`,
        title: composeForm.subject || `Tin nhắn từ ${composeForm.fromName}`,
        sentAt: "Vừa xong",
        deliveryMethod: composeForm.deliveryMethod,
        recipients:
          composeForm.recipientsGroup === "all"
            ? "Tất cả khách mời (142)"
            : "Khách chọn lọc",
        deliveredCount: 142,
        openedCount: 1,
      };
      updateSent((prev) => [sentItem, ...prev]);
      toast.success("Đã gửi tin nhắn thành công tới khách mời!");
    }

    if (composeForm.id) {
      updateDrafts((prev) => prev.filter((d) => d.id !== composeForm.id));
    }

    setViewMode("hub");
  };

  const smsCharCount = useMemo(() => {
    return composeForm.message.length;
  }, [composeForm.message]);

  // =========================================================================
  // TRÌNH SOẠN THẢO TOÀN MÀN HÌNH (DEDICATED FULLSCREEN STUDIO MODE)
  // Bấm vào 1 trong 6 chức năng sẽ nhảy thẳng vào đây mà không bị kẹp bên ngoài
  // =========================================================================
  if (viewMode === "compose") {
    return (
      <div className="min-h-screen bg-white text-[#1F1A17] font-sans antialiased flex flex-col">
        {/* Header trình soạn thảo chuyên biệt toàn màn hình: 1 header duy nhất */}
        <header className="h-14 flex items-center justify-between px-6 sm:px-10 border-b border-stone-200 bg-white sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode("hub")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-black transition cursor-pointer"
              title="Quay lại danh sách tin nhắn"
            >
              <ArrowLeft size={16} />
              <span>Quay lại</span>
            </button>
            <span className="h-4 w-px bg-stone-200" />
            <div className="flex items-center gap-2">
              <span className="font-display italic font-bold text-lg text-[#1F1A17]">
                .EverWeb
              </span>
              <span className="text-stone-300">|</span>
              <h1 className="text-sm font-semibold text-[#1F1A17]">
                Soạn tin nhắn
              </h1>
              <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600 border border-stone-200 uppercase tracking-wider">
                TIN NHẮN+
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode("hub")}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              title="Đóng trình soạn thảo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Thân 2 cột: Cột trái Form, Cột phải Live Preview */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-56px)]">
          {/* CỘT TRÁI: FORM CẤU HÌNH */}
          <div className="lg:col-span-6 p-8 lg:p-12 space-y-6 overflow-y-auto border-r border-stone-200">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#1F1A17]">
                Soạn tin nhắn gửi khách
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-stone-500">
                Tùy chỉnh thông điệp được gửi tới từng khách mời qua tin nhắn SMS và Email.
              </p>
            </div>

            {/* 1. Thời gian gửi */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Thời gian gửi
              </label>
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-stone-100 border border-stone-200/80">
                <button
                  type="button"
                  onClick={() =>
                    setComposeForm((prev) => ({ ...prev, sendTime: "now" }))
                  }
                  className={`py-2 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
                    composeForm.sendTime === "now"
                      ? "bg-white text-[#1F1A17] font-semibold shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Gửi ngay
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setComposeForm((prev) => ({
                      ...prev,
                      sendTime: "scheduled",
                    }))
                  }
                  className={`py-2 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
                    composeForm.sendTime === "scheduled"
                      ? "bg-white text-[#1F1A17] font-semibold shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Lên lịch gửi
                </button>
              </div>

              {composeForm.sendTime === "scheduled" && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] text-stone-500">Chọn ngày gửi</label>
                    <input
                      type="date"
                      value={composeForm.scheduledDate}
                      onChange={(e) =>
                        setComposeForm((prev) => ({
                          ...prev,
                          scheduledDate: e.target.value,
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#3B52DE]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500">Chọn giờ gửi</label>
                    <input
                      type="time"
                      value={composeForm.scheduledTime}
                      onChange={(e) =>
                        setComposeForm((prev) => ({
                          ...prev,
                          scheduledTime: e.target.value,
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#3B52DE]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Kênh gửi */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Kênh gửi tin nhắn
              </label>
              <div className="grid grid-cols-3 p-1 rounded-2xl bg-stone-100 border border-stone-200/80">
                {[
                  { id: "text", label: "Tin nhắn (SMS)" },
                  { id: "email", label: "Email" },
                  { id: "both", label: "Cả hai kênh" },
                ].map((item) => {
                  const isActive = composeForm.deliveryMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setComposeForm((prev) => ({
                          ...prev,
                          deliveryMethod: item.id,
                        }));
                        setPreviewTab(item.id === "email" ? "email" : "text");
                      }}
                      className={`py-2 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-[#1F1A17] font-semibold shadow-xs"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Người nhận */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Đối tượng nhận
              </label>
              <div className="relative">
                <select
                  value={composeForm.recipientsGroup}
                  onChange={(e) =>
                    setComposeForm((prev) => ({
                      ...prev,
                      recipientsGroup: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-stone-200 py-3 px-4 text-xs sm:text-sm font-semibold text-[#1F1A17] bg-white outline-none focus:border-[#3B52DE] transition cursor-pointer appearance-none shadow-2xs"
                >
                  <option value="all">
                    Tất cả khách mời (Toàn bộ 142 khách)
                  </option>
                  <option value="attending">
                    Khách đã xác nhận tham dự (88 khách)
                  </option>
                  <option value="pending">
                    Khách chưa phản hồi RSVP (45 khách)
                  </option>
                  <option value="bridesmaids">
                    Phù dâu & Bạn thân (12 khách)
                  </option>
                  <option value="vip">Khách VIP & Họ hàng (35 khách)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-4 pointer-events-none" />
              </div>
            </div>

            {/* 4. Người gửi */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Người gửi
              </label>
              <input
                type="text"
                value={composeForm.fromName}
                onChange={(e) =>
                  setComposeForm((prev) => ({ ...prev, fromName: e.target.value }))
                }
                placeholder="Tên cô dâu & chú rể"
                className="w-full rounded-2xl border border-stone-200 py-3 px-4 text-xs sm:text-sm text-[#1F1A17] bg-white outline-none focus:border-[#3B52DE] transition shadow-2xs"
              />
            </div>

            {/* 5. Tiêu đề Email */}
            {(composeForm.deliveryMethod === "email" ||
              composeForm.deliveryMethod === "both") && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                  <span>Tiêu đề thư Email</span>
                  <span className="text-[10px] text-stone-400 font-normal">
                    Chỉ hiển thị trên hộp thư Email
                  </span>
                </label>
                <input
                  type="text"
                  value={composeForm.subject}
                  onChange={(e) =>
                    setComposeForm((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  placeholder="Tiêu đề email gửi khách..."
                  className="w-full rounded-2xl border border-stone-200 py-3 px-4 text-xs sm:text-sm text-[#1F1A17] bg-white outline-none focus:border-[#3B52DE] transition shadow-2xs"
                />
              </div>
            )}

            {/* 6. Nội dung tin nhắn */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700">
                  Nội dung tin nhắn
                </label>
                <span className="text-[11px] font-mono text-stone-400">
                  SMS: {smsCharCount}/308 ký tự
                </span>
              </div>
              <textarea
                rows={4}
                value={composeForm.message}
                onChange={(e) =>
                  setComposeForm((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Nhập lời nhắn gửi đến khách mời..."
                className="w-full rounded-2xl border border-stone-200 p-4 text-xs sm:text-sm text-[#1F1A17] bg-white outline-none focus:border-[#3B52DE] transition shadow-2xs leading-relaxed"
              />
            </div>

            {/* 7. Nút bấm hành động */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  Tên nút bấm liên kết
                </label>
                <input
                  type="text"
                  value={composeForm.buttonText}
                  onChange={(e) =>
                    setComposeForm((prev) => ({
                      ...prev,
                      buttonText: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-stone-200 py-2.5 px-3 text-xs sm:text-sm text-[#1F1A17] outline-none focus:border-[#3B52DE]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  Đường link đính kèm
                </label>
                <input
                  type="text"
                  value={composeForm.linkUrl}
                  onChange={(e) =>
                    setComposeForm((prev) => ({ ...prev, linkUrl: e.target.value }))
                  }
                  className="w-full rounded-xl border border-stone-200 py-2.5 px-3 text-xs sm:text-sm text-[#1F1A17] outline-none focus:border-[#3B52DE]"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                Tin nhắn SMS và Email gửi hàng loạt yêu cầu khách mời phải có số
                điện thoại hoặc địa chỉ email hợp lệ trong danh bạ khách mời.
              </p>
            </div>

            {/* Nút hành động trực tiếp ngay bên dưới phần điền thông tin */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                disabled={isSending}
                onClick={handleSendOrSchedule}
                className="flex-1 py-3 px-6 rounded-2xl bg-[#1F1A17] text-white text-xs sm:text-sm font-semibold hover:bg-stone-800 transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
              >
                <span>
                  {isSending
                    ? "Đang gửi Email..."
                    : composeForm.sendTime === "scheduled"
                    ? "Lên lịch gửi tin nhắn"
                    : "Gửi ngay cho khách"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="py-3 px-5 rounded-2xl border border-stone-300 text-stone-700 text-xs sm:text-sm font-medium hover:bg-stone-50 transition cursor-pointer whitespace-nowrap active:scale-[0.99]"
              >
                Lưu bản nháp
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: XEM TRƯỚC THỰC TẾ TRÊN THIẾT BỊ */}
          <div className="lg:col-span-6 bg-stone-50/60 p-8 lg:p-12 flex flex-col items-center justify-between overflow-y-auto">
            <div className="w-full max-w-[360px] flex justify-center mb-6">
              <div className="inline-flex p-1 rounded-full bg-stone-200/80 border border-stone-300/60">
                <button
                  type="button"
                  onClick={() => setPreviewTab("text")}
                  className={`px-6 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    previewTab === "text"
                      ? "bg-white text-[#1F1A17] shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Xem tin nhắn SMS
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("email")}
                  className={`px-6 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    previewTab === "email"
                      ? "bg-white text-[#1F1A17] shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Xem thư Email
                </button>
              </div>
            </div>

            {previewTab === "text" ? (
              /* MOCKUP IPHONE SMS */
              <div className="w-[310px] sm:w-[330px] rounded-[44px] bg-[#1E1E24] p-3 shadow-2xl border-4 border-stone-800 ring-1 ring-black/10 select-none">
                <div className="w-full bg-white rounded-[34px] overflow-hidden min-h-[520px] flex flex-col justify-between p-4 border border-stone-200">
                  <div>
                    <div className="w-24 h-5 bg-black rounded-full mx-auto mb-3" />
                    <div className="border-b border-stone-100 pb-2.5 mb-3 flex items-center gap-1.5 text-xs">
                      <span className="text-stone-400">Đến:</span>
                      <span className="font-semibold text-[#1F1A17] bg-stone-100 px-2 py-0.5 rounded-md text-[11px] truncate max-w-[200px]">
                        {composeForm.recipientsGroup === "all"
                          ? "Tất cả khách mời"
                          : composeForm.recipientsGroup === "attending"
                          ? "Khách tham dự"
                          : "Khách chọn lọc"}
                      </span>
                    </div>

                    <div className="rounded-2xl rounded-tl-sm bg-[#E9E9EB] p-3.5 space-y-2 text-xs text-[#1F1A17] leading-relaxed shadow-2xs">
                      <p className="text-[11px] font-medium text-stone-500">
                        Tin nhắn từ{" "}
                        <span className="font-semibold text-[#1F1A17]">
                          {composeForm.fromName}
                        </span>
                        :
                      </p>
                      <p className="text-stone-800 whitespace-pre-wrap">
                        {composeForm.message || "Nội dung tin nhắn gửi khách..."}
                      </p>
                    </div>

                    <div className="mt-2.5 rounded-2xl border border-dashed border-stone-300/80 bg-stone-50/70 p-3 space-y-1.5 text-xs text-stone-600">
                      <div className="w-full h-20 rounded-xl overflow-hidden bg-stone-200">
                        <img
                          src={weddingCouple}
                          alt="Wedding Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-semibold text-[#1F1A17] truncate text-[11px] pt-1">
                        {composeForm.buttonText}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">
                        everweb.vn
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 text-[10px] text-center text-stone-400">
                    <span>SMS: {smsCharCount}/308 ký tự</span>
                  </div>
                </div>
              </div>
            ) : (
              /* MOCKUP EMAIL CARD */
              <div className="w-full max-w-[380px] bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden text-xs">
                <div className="p-3.5 bg-stone-50 border-b border-stone-200/80 space-y-1 text-[11px]">
                  <p className="text-stone-500">
                    <span className="font-semibold text-stone-700">Từ:</span>{" "}
                    {composeForm.fromName} &lt;no-reply@everweb.vn&gt;
                  </p>
                  <p className="text-stone-500 truncate">
                    <span className="font-semibold text-stone-700">Tiêu đề:</span>{" "}
                    {composeForm.subject}
                  </p>
                </div>

                <div className="p-5 space-y-4">
                  <div className="w-full h-36 rounded-2xl overflow-hidden border border-stone-200/60 shadow-inner">
                    <img
                      src={galleryBouquet}
                      alt="Floral Art"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-[11px] text-stone-400 uppercase tracking-widest font-medium">
                      Kính gửi Quý khách,
                    </p>
                    <h3 className="text-base font-bold text-[#1F1A17] mt-1 font-serif">
                      {composeForm.headline}
                    </h3>
                    <p className="text-stone-600 text-xs leading-relaxed mt-2 whitespace-pre-wrap">
                      {composeForm.message}
                    </p>
                  </div>

                  <div className="pt-1">
                    <a
                      href={composeForm.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full py-3 rounded-full bg-[#3B52DE] hover:bg-[#2F43C2] text-white font-semibold text-center text-xs shadow-xs transition"
                    >
                      {composeForm.buttonText}
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-[#1F1A17] text-white space-y-2 text-center text-[10px]">
                  <p className="font-display italic text-sm font-bold text-[#E8CD94]">
                    .EverWeb
                  </p>
                  <p className="text-stone-400">
                    Cùng bạn chuẩn bị trọn vẹn cho ngày hạnh phúc.
                  </p>
                  <p className="text-stone-500 text-[9px] pt-1">
                    Thư này được gửi tự động thay mặt cho {composeForm.fromName}.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-stone-200/60 w-full max-w-[400px] text-center">
              <p className="text-[11px] uppercase font-bold tracking-wider text-stone-400 mb-3">
                Quy trình gửi tin nhắn tự động
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-stone-600 text-[10px] leading-tight">
                    1. Soạn tin qua SMS hoặc Email
                  </span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-stone-600 text-[10px] leading-tight">
                    2. Khách mở link điền thông tin
                  </span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-stone-600 text-[10px] leading-tight">
                    3. Danh sách khách tự cập nhật
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-[#1F1A17] font-sans antialiased">
      {/* =========================================================================
          LEFT SIDEBAR: VIỆT HÓA TOÀN BỘ MENU
         ========================================================================= */}
      {isSidebarOpen && (
        <aside className="w-64 border-r border-stone-200 bg-white flex flex-col justify-between shrink-0 select-none z-20">
          <div>
            {/* Top Logo: Hamburger Menu + .EverWeb Tin nhắn */}
            <div className="h-14 flex items-center gap-3 px-6 border-b border-stone-100">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="text-stone-700 hover:text-black transition cursor-pointer"
                title="Đóng thanh bên"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-1.5">
                <span className="font-display italic font-bold text-xl text-[#1F1A17]">
                  .EverWeb
                </span>
                <span className="text-base font-semibold text-[#1F1A17]">
                  Tin nhắn
                </span>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="p-4 space-y-4">
              <div>
                <p className="px-3 text-[10px] font-bold text-stone-400 tracking-wider uppercase mb-2">
                  TIN NHẮN
                </p>
                <nav className="space-y-1">
                  {/* Tạo tin nhắn */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav("create");
                      setViewMode("hub");
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition cursor-pointer ${
                      activeNav === "create" && viewMode === "hub"
                        ? "bg-stone-100 text-stone-950 font-bold"
                        : "text-stone-700 hover:bg-stone-50 hover:text-stone-900 font-medium"
                    }`}
                  >
                    <span>Tạo tin nhắn</span>
                  </button>

                  {/* Bản nháp */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav("drafts");
                      setViewMode("hub");
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition cursor-pointer ${
                      activeNav === "drafts" && viewMode === "hub"
                        ? "bg-stone-100 text-stone-950 font-bold"
                        : "text-stone-700 hover:bg-stone-50 hover:text-stone-900 font-medium"
                    }`}
                  >
                    <span>Bản nháp</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
                      {drafts.length}
                    </span>
                  </button>

                  {/* Đã lên lịch */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav("scheduled");
                      setViewMode("hub");
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition cursor-pointer ${
                      activeNav === "scheduled" && viewMode === "hub"
                        ? "bg-stone-100 text-stone-950 font-bold"
                        : "text-stone-700 hover:bg-stone-50 hover:text-stone-900 font-medium"
                    }`}
                  >
                    <span>Đã lên lịch</span>
                    {scheduledMessages.length > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-800">
                        {scheduledMessages.length}
                      </span>
                    )}
                  </button>

                  {/* Đã gửi */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav("sent");
                      setViewMode("hub");
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition cursor-pointer ${
                      activeNav === "sent" && viewMode === "hub"
                        ? "bg-stone-100 text-stone-950 font-bold"
                        : "text-stone-700 hover:bg-stone-50 hover:text-stone-900 font-medium"
                    }`}
                  >
                    <span>Đã gửi</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* =========================================================================
          RIGHT MAIN CONTENT AREA: CĂN ĐỀU VỚI HEADER
         ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* TOP UTILITY HEADER: 1 NÚT BACK DUY NHẤT */}
        <header className="h-14 flex items-center justify-between px-8 lg:px-12 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Nút quay lại Trung tâm sự kiện duy nhất */}
            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.EVENT_HUB, { state: { wedding } })}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-black transition cursor-pointer"
              title="Quay lại Trung tâm sự kiện"
            >
              <ArrowLeft size={15} />
              <span>Trung tâm sự kiện</span>
            </button>

            <span className="h-4 w-px bg-stone-200" />

            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="text-stone-700 hover:text-black transition cursor-pointer"
              title={isSidebarOpen ? "Ẩn thanh bên" : "Mở thanh bên"}
            >
              <PanelLeft size={19} />
            </button>

            {/* Pill Badge */}
            <span className="rounded-md border border-stone-300 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
              TIN NHẮN+
            </span>
          </div>

          {/* Nút soạn tin mới bên phải */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setComposeForm((prev) => ({
                  ...prev,
                  id: `msg-${Date.now()}`,
                  deliveryMethod: "both",
                  subject: "Thông báo từ tiệc cưới",
                  message: "",
                }));
                setViewMode("compose");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1F1A17] text-white text-xs font-semibold hover:bg-stone-800 transition cursor-pointer shadow-xs"
            >
              <Plus size={14} />
              <span>Soạn tin mới</span>
            </button>
          </div>
        </header>

        {/* =========================================================================
            GIAO DIỆN CHÍNH: VIỆT HÓA TOÀN DIỆN, CĂN ĐỀU 6 CỘT
           ========================================================================= */}
        <main className="flex-1 w-full px-8 lg:px-12 py-8 sm:py-10 space-y-10">
            {/* 1. KHỐI: Mẫu tin nhắn nhanh (6 CỘT) */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-[#1F1A17]">
                Mẫu tin nhắn nhanh
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5">
                {QUICK_TEMPLATES.map((tmpl) => {
                  const Icon = tmpl.icon;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl)}
                      className="group flex flex-col items-center cursor-pointer select-none"
                    >
                      <div
                        className={`w-full aspect-[4/5] rounded-3xl ${tmpl.cardBg} border border-stone-200/80 flex items-center justify-center transition-all duration-200 group-hover:border-stone-400 group-hover:shadow-md group-hover:-translate-y-1`}
                      >
                        <Icon
                          className={`w-12 h-12 stroke-[1.4] ${tmpl.color} transition-transform duration-300 group-hover:scale-110`}
                        />
                      </div>
                      <div className="w-full text-center mt-2.5 min-h-[36px]">
                        <p className="text-xs sm:text-sm font-semibold text-[#1F1A17] group-hover:text-black leading-tight">
                          {tmpl.label}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5 leading-tight">
                          {tmpl.vietLabel}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 2. KHỐI: Bản nháp */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight text-[#1F1A17]">
                  Bản nháp
                </h3>
                <span className="rounded-full bg-stone-100 border border-stone-200 px-2 py-0.5 text-xs font-semibold text-stone-700">
                  {drafts.length}
                </span>
              </div>

              <div className="space-y-2">
                {drafts.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleOpenDraft(d)}
                    className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-stone-200/90 hover:border-stone-400 hover:shadow-xs transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-stone-600 group-hover:bg-[#1F1A17] group-hover:text-white transition shrink-0">
                        <Mail size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-900 group-hover:text-[#3B52DE] transition truncate">
                          {d.title}
                        </p>
                        <p className="text-xs text-stone-400 truncate mt-0.5">
                          {d.recipients} · Tạo ngày {d.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-stone-400 group-hover:text-stone-700 transition shrink-0 ml-4">
                      <span>Chỉnh sửa</span>
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. KHỐI: Khám phá Thiệp giấy & Thiệp số (6 CỘT) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight text-[#1F1A17]">
                  Khám phá Thiệp giấy & Thiệp số
                </h3>
                <span className="text-xs text-stone-400">
                  Mẫu thiệp in ấn & thiệp số đồng bộ
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5">
                {PAPER_DIGITAL_CARDS.map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectCard(card)}
                    className="group flex flex-col items-center cursor-pointer select-none"
                  >
                    <div className="w-full aspect-[4/3] rounded-2xl bg-stone-100 border border-stone-200/80 overflow-hidden shadow-2xs group-hover:shadow-md transition-all duration-300">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="w-full text-center mt-2.5 min-h-[36px]">
                      <p className="text-xs font-semibold text-[#1F1A17] group-hover:text-black leading-tight">
                        {card.title}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. TAB ĐÃ LÊN LỊCH */}
            {activeNav === "scheduled" && (
              <section className="rounded-2xl border border-stone-200 p-6 space-y-4 bg-white animate-in fade-in">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-base font-bold text-[#1F1A17]">
                    Tin nhắn đã lên lịch
                  </h3>
                  <span className="text-xs text-stone-400">
                    {scheduledMessages.length} tin
                  </span>
                </div>
                {scheduledMessages.length === 0 ? (
                  <p className="text-xs text-stone-400 text-center py-4">
                    Chưa có tin nhắn nào được lên lịch gửi.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {scheduledMessages.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/60"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-semibold text-stone-900">
                              {s.title}
                            </p>
                            <p className="text-[11px] text-blue-700">
                              {s.scheduledFor} · {s.recipients}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Đã hẹn giờ
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* 5. TAB ĐÃ GỬI */}
            {activeNav === "sent" && (
              <section className="rounded-2xl border border-stone-200 p-6 space-y-4 bg-white animate-in fade-in">
                <h3 className="text-base font-bold text-[#1F1A17]">
                  Lịch sử tin nhắn đã gửi
                </h3>
                <div className="divide-y divide-stone-100">
                  {sentMessages.map((sent) => (
                    <div
                      key={sent.id}
                      className="py-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCheck className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="text-xs font-semibold text-stone-900">
                            {sent.title}
                          </p>
                          <p className="text-[11px] text-stone-400">
                            Gửi lúc {sent.sentAt} · Đối tượng: {sent.recipients}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Đã gửi: {sent.deliveredCount}
                        </span>
                        <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          Đã xem: {sent.openedCount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
      </div>
    </div>
  );
}
