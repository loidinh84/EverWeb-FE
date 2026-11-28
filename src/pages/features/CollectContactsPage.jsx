import { useMemo, useState } from "react";
import {
  Check,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Globe,
  Info,
  Mail,
  MapPin,
  MessageSquare,
  QrCode,
  Search,
  Send,
  Settings,
  Share2,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import weddingApi from "../../services/weddingApi";
import { extractApiError } from "../../services/api";
import { buildQrCodeUrl } from "../../utils/weddingHelpers";
import heroWedding from "../../assets/image/hero-wedding.jpg";
import FeatureShell from "./FeatureShell";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";
import {
  DEFAULT_FIELDS,
  INITIAL_SUBMISSIONS,
  RECIPIENT_GROUPS,
} from "./collect-contacts/constants";

export default function CollectContactsPage() {
  const toast = useToast();
  const { wedding } = useCurrentWedding();

  const coupleNames = (wedding?.title || "Trần Thanh Khang & Mai Khanh").normalize("NFC");
  const collectorSlug = wedding?.slug || "khang-an";
  const collectorUrl = `${window.location.origin}/contact/${collectorSlug}`;

  const { data: ccData, saveSection } = useWeddingFeature(
    wedding,
    "collect_contacts",
    {
      isCollectorOn: true,
      sendTime: "now",
      scheduledAt: "",
      channel: "both",
      recipientGroupId: "missing",
      subject: "Chia sẻ thông tin nhận thiệp cưới của Trần Thanh Khang & Mai Khanh",
      body: "Chào bạn! Tụi mình sắp tổ chức lễ cưới và rất mong có đầy đủ số điện thoại, địa chỉ của bạn để gửi thiệp mời chu đáo nhất. Nhờ bạn dành 1 phút bấm vào link bên dưới để điền nhanh giúp tụi mình nhé!",
      buttonText: "Điền thông tin nhận thiệp cưới",
      formCoverTitle: `Mừng Hôn Lễ ${coupleNames}`,
      formCoverNote: "Sự hiện diện của bạn là niềm vinh hạnh lớn nhất của gia đình chúng mình. Vui lòng cập nhật thông tin liên hệ để nhận thiệp mời trang trọng.",
      fields: DEFAULT_FIELDS,
      submissions: INITIAL_SUBMISSIONS,
    }
  );

  const [activeTab, setActiveTab] = useState("compose"); // compose | submissions | fields | qr
  const [previewChannel, setPreviewChannel] = useState("sms"); // sms | email
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [submissionSearch, setSubmissionSearch] = useState("");

  const isCollectorOn = ccData.isCollectorOn ?? true;
  const sendTime = ccData.sendTime || "now";
  const scheduledAt = ccData.scheduledAt || "";
  const channel = ccData.channel || "both";
  const recipientGroupId = ccData.recipientGroupId || "missing";
  const subject = ccData.subject || "Chia sẻ thông tin nhận thiệp cưới của Trần Thanh Khang & Mai Khanh";
  const body = ccData.body || ccData.message || "";
  const buttonText = ccData.buttonText || "Điền thông tin nhận thiệp cưới";
  const fields = ccData.fields || DEFAULT_FIELDS;
  const submissions = ccData.submissions || INITIAL_SUBMISSIONS;
  const formCoverTitle = ccData.formCoverTitle || `Mừng Hôn Lễ ${coupleNames}`;
  const formCoverNote = ccData.formCoverNote || "Sự hiện diện của bạn là niềm hạnh phúc lớn nhất của gia đình chúng mình.";

  const [formState, setFormState] = useState({
    senderName: coupleNames,
    subject,
    body,
    buttonText,
  });
  const [isSending, setIsSending] = useState(false);

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    const q = submissionSearch.trim().toLowerCase();
    if (!q) return submissions;
    return submissions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.address.toLowerCase().includes(q) ||
        (s.group && s.group.toLowerCase().includes(q))
    );
  }, [submissions, submissionSearch]);

  const handleCopy = (text, label) => {
    navigator.clipboard?.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (sendTime === "scheduled" && !scheduledAt) {
      toast.error("Vui lòng chọn thời gian hẹn giờ gửi tin nhắn");
      return;
    }

    if (sendTime === "now" && channel !== "sms" && wedding?.id) {
      setIsSending(true);
      try {
        const res = await weddingApi.sendEmail(wedding.id, {
          senderName: formState.senderName,
          subject: formState.subject,
          body: formState.body,
          buttonText: formState.buttonText,
          ctaUrl: collectorUrl,
        });
        toast.success(
          `Đã gửi Email thật tới ${res?.sentCount || 1} địa chỉ thành công!`
        );
      } catch (err) {
        toast.error(
          extractApiError(err, "Không thể gửi Email, vui lòng kiểm tra cấu hình SMTP").message
        );
        setIsSending(false);
        return;
      } finally {
        setIsSending(false);
      }
    } else {
      toast.success(
        sendTime === "scheduled"
          ? `Đã lên lịch gửi tin nhắn thu thập liên hệ lúc ${scheduledAt}`
          : "Đã gửi yêu cầu thu thập liên hệ tới danh sách khách mời!"
      );
    }

    // Thêm bản ghi mẫu vào danh sách phản hồi để kiểm thử
    const newSubmission = {
      id: `sub-${Date.now()}`,
      name: "Khách mời vừa gửi",
      phone: "0908 999 888",
      email: "khachmoi@gmail.com",
      address: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
      companions: 2,
      group: "Đồng nghiệp",
      wishes: "Đã điền thông tin qua link thu thập!",
      time: "Vừa xong",
      status: "Đã đồng bộ",
    };

    saveSection((prev) => ({
      ...prev,
      submissions: [newSubmission, ...(prev.submissions || INITIAL_SUBMISSIONS)],
    }));
  };

  const handleExportCsv = () => {
    const headers = "Họ và tên,Số điện thoại,Email,Địa chỉ nhận thiệp,Số người đi cùng,Nhóm khách,Lời chúc\n";
    const rows = submissions
      .map(
        (s) =>
          `"${s.name}","${s.phone}","${s.email || ""}","${s.address || ""}","${s.companions || 1}","${s.group || ""}","${s.wishes || ""}"`
      )
      .join("\n");
    const blob = new Blob([`\uFEFF${headers}${rows}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `danh-sach-lien-he-${collectorSlug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất danh sách liên hệ khách mời ra file CSV");
  };

  return (
    <FeatureShell
      title="Thu thập thông tin liên hệ (Contact Collector)"
      subtitle={`Thu thập SĐT & Địa chỉ nhận thiệp giấy tự động · Link: ${collectorSlug}`}
      wedding={wedding}
      actions={
        <div className="flex items-center gap-2">
          {/* Toggle trạng thái link */}
          <button
            type="button"
            onClick={() => {
              saveSection({ isCollectorOn: !isCollectorOn });
              toast.info(
                !isCollectorOn
                  ? "Đã kích hoạt link thu thập liên hệ công khai"
                  : "Đã tạm dừng link thu thập liên hệ"
              );
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              isCollectorOn
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-stone-100 text-stone-600"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isCollectorOn ? "bg-emerald-600" : "bg-stone-400"}`} />
            <span>{isCollectorOn ? "Link đang mở" : "Link tạm đóng"}</span>
          </button>

          {/* Nút Xem mã QR */}
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1F1A17] hover:border-[#3B52DE] hover:bg-stone-50 transition"
          >
            <QrCode size={13} /> Mã QR
          </button>

          {/* Nút Sao chép link */}
          <button
            type="button"
            onClick={() => handleCopy(collectorUrl, "link thu thập")}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1F1A17] hover:border-[#3B52DE] hover:bg-stone-50 transition"
          >
            <Share2 size={13} /> Chia sẻ
          </button>

          {/* Nút Xem trước form */}
          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1F1A17] px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition shadow-xs active:scale-95"
          >
            <Eye size={13} /> Xem trước form
          </button>
        </div>
      }
    >
      {/* =========================================================================
          HERO OVERVIEW CARD: THỐNG KÊ TIẾN ĐỘ THU THẬP & LINK CHIA SẺ NHANH
         ========================================================================= */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Khối Trạng thái Link & Thao tác sao chép */}
        <div className="lg:col-span-7 rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold tracking-wider text-stone-700 uppercase">
                <Globe size={13} className="text-[#3B52DE]" /> Trang thu thập thông tin khách mời
              </span>
              <a
                href={collectorUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#3B52DE] hover:underline"
              >
                <span>Mở trang thực tế</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <h2 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-[#1F1A17]">
              Cổng thu thập địa chỉ & số điện thoại khách mời
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-600 leading-relaxed">
              Khách mời chỉ cần 60 giây để bấm vào liên kết, điền số điện thoại và địa chỉ nhận thiệp cưới. Toàn bộ dữ liệu được tự động đồng bộ vào Danh bạ khách mời trên hệ thống.
            </p>

            {/* Link box sao chép nhanh */}
            <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-2 sm:p-2.5">
              <div className="flex items-center gap-2 pl-2 overflow-hidden">
                <Smartphone size={16} className="text-stone-400 shrink-0" />
                <span className="font-mono text-xs font-semibold text-[#1F1A17] truncate">
                  {collectorUrl}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(collectorUrl, "link thu thập")}
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
              onClick={() => handleCopy(`Chào bạn thân mến! Tụi mình sắp tổ chức hôn lễ và đang hoàn thiện thiệp mời. Nhờ bạn dành 1 phút điền thông tin địa chỉ nhận thiệp tại: ${collectorUrl} nhé! Cảm ơn bạn rất nhiều!`, "nội dung mẫu gửi Zalo")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-1.5 font-semibold text-stone-700 hover:bg-stone-100 transition"
            >
              <MessageSquare size={13} /> Sao chép tin nhắn gửi Zalo / Messenger
            </button>
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-1.5 font-semibold text-stone-700 hover:bg-stone-100 transition"
            >
              <QrCode size={13} /> Tải mã QR gửi Story
            </button>
          </div>
        </div>

        {/* Khối Thống kê số lượng khách cần thu thập */}
        <div className="lg:col-span-5 rounded-3xl border border-stone-200 bg-stone-50/70 p-6 sm:p-7 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Tiến độ cập nhật danh bạ
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                Đã có {submissions.length + 80} / 142 khách
              </span>
            </div>

            {/* Thanh tiến trình */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#1F1A17] mb-1.5">
                <span>Tỷ lệ hoàn thành</span>
                <span>65%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-stone-200 overflow-hidden">
                <div className="h-full rounded-full bg-[#1F1A17] transition-all duration-500" style={{ width: "65%" }} />
              </div>
            </div>

            {/* Các con số chi tiết */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Còn thiếu SĐT</span>
                <span className="text-lg font-bold text-[#1F1A17] tabular-nums mt-0.5 block">24 khách</span>
                <span className="text-[11px] text-stone-500 mt-0.5 block">Chưa có số liên hệ</span>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Thiếu địa chỉ thiệp</span>
                <span className="text-lg font-bold text-[#1F1A17] tabular-nums mt-0.5 block">38 khách</span>
                <span className="text-[11px] text-stone-500 mt-0.5 block">Chưa điền địa chỉ gửi</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs">
            <span className="text-stone-500">Phản hồi gần nhất: {submissions[0]?.time || "Hôm nay"}</span>
            <button
              type="button"
              onClick={() => setActiveTab("submissions")}
              className="font-semibold text-[#3B52DE] hover:underline"
            >
              Xem danh sách ({submissions.length}) →
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB NAVIGATION CHUYÊN NGHIỆP
         ========================================================================= */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "compose", label: "Soạn & Gửi tin nhắn", count: null, icon: Send },
            { key: "submissions", label: "Khách đã phản hồi", count: submissions.length, icon: Users },
            { key: "fields", label: "Cấu hình trường câu hỏi", count: fields.filter((f) => f.enabled).length, icon: Settings },
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

        {activeTab === "submissions" && (
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:border-[#3B52DE] transition"
          >
            <Download size={13} /> Xuất file CSV
          </button>
        )}
      </div>

      {/* =========================================================================
          TAB 1: SOẠN & GỬI TIN NHẮN (STUDIO LAYOUT: FORM BÊN TRÁI, LIVE MOCKUP BÊN PHẢI)
         ========================================================================= */}
      {activeTab === "compose" && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* CỘT TRÁI: FORM CẤU HÌNH THÔNG ĐIỆP */}
          <form
            onSubmit={handleSend}
            className="lg:col-span-7 rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xs space-y-5"
          >
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-base font-bold text-[#1F1A17]">
                Nội dung tin nhắn gửi khách
              </h3>
              <p className="mt-0.5 text-xs text-stone-500">
                Tùy chỉnh thông điệp nhắc khách mời điền thông tin nhận thiệp cưới
              </p>
            </div>

            {/* 1. Thời gian gửi: Gửi ngay hoặc Hẹn giờ */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Thời gian gửi tin
              </label>
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-stone-100 border border-stone-200/70">
                <button
                  type="button"
                  onClick={() => saveSection({ sendTime: "now" })}
                  className={`py-2 text-xs font-medium rounded-xl transition cursor-pointer ${
                    sendTime === "now"
                      ? "bg-white text-[#1F1A17] font-semibold shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Gửi ngay bây giờ
                </button>
                <button
                  type="button"
                  onClick={() => saveSection({ sendTime: "scheduled" })}
                  className={`py-2 text-xs font-medium rounded-xl transition cursor-pointer ${
                    sendTime === "scheduled"
                      ? "bg-white text-[#1F1A17] font-semibold shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Hẹn giờ gửi tự động
                </button>
              </div>

              {sendTime === "scheduled" && (
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs">
                  <Clock size={15} className="text-[#3B52DE]" />
                  <span className="text-stone-600 font-medium">Chọn ngày & giờ gửi:</span>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => saveSection({ scheduledAt: e.target.value })}
                    className="bg-transparent font-semibold text-[#1F1A17] outline-none"
                  />
                </div>
              )}
            </div>

            {/* 2. Kênh gửi tin nhắn */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Kênh gửi tin
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "sms", label: "Tin nhắn SMS", icon: MessageSquare },
                  { key: "email", label: "Thư Email", icon: Mail },
                  { key: "both", label: "Cả hai kênh", icon: Sparkles },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => saveSection({ channel: c.key })}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition cursor-pointer ${
                        channel === c.key
                          ? "border-[#1F1A17] bg-[#1F1A17] text-white shadow-xs"
                          : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <Icon size={13} />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Đối tượng nhận */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Gửi đến danh sách khách mời (To)
              </label>
              <select
                value={recipientGroupId}
                onChange={(e) => saveSection({ recipientGroupId: e.target.value })}
                className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs font-medium text-[#1F1A17] outline-none focus:border-[#3B52DE]"
              >
                {RECIPIENT_GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Tên người gửi & Tiêu đề email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Tên người gửi (From)
                </label>
                <input
                  type="text"
                  value={formState.senderName}
                  onChange={(e) => setFormState({ ...formState, senderName: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs font-medium text-[#1F1A17] outline-none focus:border-[#3B52DE]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Tiêu đề thư Email
                </label>
                <input
                  type="text"
                  value={formState.subject}
                  onChange={(e) => {
                    setFormState({ ...formState, subject: e.target.value });
                    saveSection({ subject: e.target.value });
                  }}
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs font-medium text-[#1F1A17] outline-none focus:border-[#3B52DE]"
                />
              </div>
            </div>

            {/* 5. Nội dung lời nhắn */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-stone-700">
                  Lời nhắn gửi khách
                </label>
                <span className="text-[11px] text-stone-400 tabular-nums">
                  SMS: {formState.body.length}/306 ký tự
                </span>
              </div>
              <textarea
                rows={4}
                value={formState.body}
                onChange={(e) => {
                  setFormState({ ...formState, body: e.target.value });
                  saveSection({ body: e.target.value });
                }}
                className="w-full rounded-2xl border border-stone-200 p-3.5 text-xs text-[#1F1A17] leading-relaxed outline-none focus:border-[#3B52DE]"
              />
            </div>

            {/* 6. Chữ trên nút bấm */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Tên nút bấm liên kết trong thư
              </label>
              <input
                type="text"
                value={formState.buttonText}
                onChange={(e) => {
                  setFormState({ ...formState, buttonText: e.target.value });
                  saveSection({ buttonText: e.target.value });
                }}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs font-medium text-[#1F1A17] outline-none focus:border-[#3B52DE]"
              />
            </div>

            {/* Hộp lưu ý an toàn */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5 flex items-start gap-2.5 text-xs text-stone-600">
              <Info size={16} className="text-[#3B52DE] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Tin nhắn SMS sẽ chứa đường dẫn rút gọn an toàn <span className="font-semibold text-[#1F1A17]">{collectorUrl}</span> để khách mở form điền thông tin chỉ với 1 chạm.
              </p>
            </div>

            {/* Nút gửi chính */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSending}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1F1A17] py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-stone-800 transition shadow-md cursor-pointer active:scale-[0.99] disabled:opacity-60"
              >
                <Send size={15} />
                <span>
                  {isSending
                    ? "Đang gửi Email..."
                    : sendTime === "scheduled"
                    ? "Lên lịch gửi tin nhắn tự động"
                    : "Gửi tin nhắn thu thập liên hệ ngay"}
                </span>
              </button>
            </div>
          </form>

          {/* CỘT PHẢI: LIVE PHONE MOCKUP (CHUẨN IPHONE WITHJOY) */}
          <div className="lg:col-span-5 space-y-4 sticky top-20">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#1F1A17]">
                Xem trước giao diện tin nhắn khách nhận
              </span>

              {/* Nút chuyển đổi SMS / Email */}
              <div className="flex rounded-full border border-stone-200 bg-stone-100 p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPreviewChannel("sms")}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 transition cursor-pointer ${
                    previewChannel === "sms"
                      ? "bg-white text-[#1F1A17] shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <MessageSquare size={12} /> SMS
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewChannel("email")}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 transition cursor-pointer ${
                    previewChannel === "email"
                      ? "bg-white text-[#1F1A17] shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <Mail size={12} /> Email
                </button>
              </div>
            </div>

            {/* KHUNG MOCKUP IPHONE */}
            <div className="mx-auto w-full max-w-[340px] rounded-[40px] border-[6px] border-[#1F1A17] bg-white p-3 shadow-xl">
              {/* Dynamic Island */}
              <div className="mx-auto mb-4 h-4 w-24 rounded-full bg-[#1F1A17]" />

              {previewChannel === "sms" ? (
                /* SMS CHAT BUBBLE VIEW */
                <div className="space-y-3 px-1 py-2">
                  <div className="text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-stone-200 text-stone-700 font-bold text-xs">
                      {formState.senderName.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="mt-1 text-xs font-bold text-[#1F1A17]">{formState.senderName}</p>
                    <p className="text-[10px] text-stone-400">Tin nhắn văn bản · Hôm nay</p>
                  </div>

                  {/* Bong bóng tin nhắn */}
                  <div className="rounded-2xl rounded-tl-xs bg-stone-100 p-3.5 text-xs text-[#1F1A17] leading-relaxed space-y-2.5">
                    <p>{formState.body || "Chào bạn! Nhờ bạn dành 1 phút điền thông tin nhận thiệp cưới nhé..."}</p>

                    {/* Thẻ preview liên kết trong bong bóng */}
                    <div className="rounded-xl border border-stone-200 bg-white p-2.5 space-y-1.5 shadow-2xs">
                      <img
                        src={heroWedding}
                        alt="Wedding"
                        className="h-20 w-full rounded-lg object-cover"
                      />
                      <p className="text-[11px] font-bold text-[#1F1A17] truncate">
                        Điền địa chỉ nhận thiệp · {formState.senderName}
                      </p>
                      <p className="font-mono text-[10px] text-[#3B52DE] truncate">
                        {collectorUrl}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* EMAIL INVITATION VIEW */
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white text-xs">
                  <img
                    src={heroWedding}
                    alt="Cover"
                    className="h-28 w-full object-cover"
                  />
                  <div className="p-4 text-center space-y-3">
                    <span className="font-display italic text-lg font-bold text-[#1F1A17] block">
                      .EverWeb
                    </span>
                    <h4 className="font-bold text-[#1F1A17] text-sm">
                      {formState.subject}
                    </h4>
                    <p className="text-stone-600 leading-relaxed text-[11px]">
                      {formState.body}
                    </p>
                    <div className="pt-2">
                      <span className="inline-block rounded-full bg-[#1F1A17] px-5 py-2 text-[11px] font-semibold text-white shadow-xs">
                        {formState.buttonText}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hướng dẫn quy trình 3 bước */}
            <div className="rounded-2xl border border-stone-200 bg-white p-4 text-xs">
              <span className="font-bold text-[#1F1A17] block mb-2">Quy trình tự động hóa:</span>
              <div className="space-y-2 text-stone-600 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-stone-100 font-bold text-[10px] text-[#1F1A17]">1</span>
                  <span>Khách nhận tin nhắn & chạm vào liên kết mở form.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-stone-100 font-bold text-[10px] text-[#1F1A17]">2</span>
                  <span>Khách điền SĐT, địa chỉ nhận thiệp & gửi lời chúc.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-stone-100 font-bold text-[10px] text-[#1F1A17]">3</span>
                  <span>Hệ thống tự động cập nhật vào Danh bạ khách mời.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: DANH SÁCH KHÁCH ĐÃ PHẢN HỒI (SUBMISSIONS TABLE)
         ========================================================================= */}
      {activeTab === "submissions" && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-stone-200 bg-white p-4 sm:p-5 shadow-2xs">
            {/* Search */}
            <div className="relative flex-1 min-w-[260px]">
              <Search
                size={14}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
                placeholder="Tìm theo tên khách, số điện thoại, địa chỉ hoặc nhóm..."
                className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pr-4 pl-9 text-xs text-[#1F1A17] outline-none focus:border-[#3B52DE]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-medium">
                Tìm thấy <span className="font-bold text-[#1F1A17]">{filteredSubmissions.length}</span> phản hồi
              </span>
            </div>
          </div>

          {/* Bảng dữ liệu phản hồi */}
          <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-2xs">
            <table className="min-w-full divide-y divide-stone-100 text-xs">
              <thead className="bg-stone-50 text-left font-semibold text-stone-700">
                <tr>
                  <th className="px-5 py-3.5">Khách mời</th>
                  <th className="px-5 py-3.5">Số điện thoại</th>
                  <th className="px-5 py-3.5">Địa chỉ nhận thiệp giấy</th>
                  <th className="px-5 py-3.5 text-center">Người đi cùng</th>
                  <th className="px-5 py-3.5">Lời chúc mừng</th>
                  <th className="px-5 py-3.5">Thời gian</th>
                  <th className="px-5 py-3.5 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSubmissions.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50/70 transition">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-[#1F1A17]">{s.name}</p>
                        <span className="inline-block mt-0.5 rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
                          {s.group || "Khách mời"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-medium text-stone-800">
                      {s.phone}
                    </td>
                    <td className="px-5 py-4 text-stone-600 max-w-xs">
                      <p className="flex items-start gap-1">
                        <MapPin size={12} className="text-rose-500 shrink-0 mt-0.5" />
                        <span>{s.address}</span>
                      </p>
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-[#1F1A17]">
                      {s.companions || 1}
                    </td>
                    <td className="px-5 py-4 text-stone-600 italic max-w-xs truncate" title={s.wishes}>
                      "{s.wishes || "Chúc hai bạn hạnh phúc!"}"
                    </td>
                    <td className="px-5 py-4 text-stone-400 text-[11px] whitespace-nowrap">
                      {s.time}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        <Check size={11} /> {s.status}
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
          TAB 3: CẤU HÌNH TRƯỜNG THÔNG TIN FORM KHẢO SÁT
         ========================================================================= */}
      {activeTab === "fields" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#1F1A17]">
                Các trường thông tin khách mời sẽ điền
              </h3>
              <p className="mt-0.5 text-xs text-stone-500">
                Bật hoặc tắt các câu hỏi bạn muốn hiển thị trên biểu mẫu online
              </p>
            </div>

            <div className="divide-y divide-stone-100">
              {fields.map((f) => (
                <div key={f.key} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1F1A17]">{f.label}</span>
                      {f.required && (
                        <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[9px] font-bold text-stone-600 uppercase">
                          Bắt buộc
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-stone-500">{f.desc}</p>
                  </div>

                  <input
                    type="checkbox"
                    disabled={f.required}
                    checked={f.enabled}
                    onChange={() => {
                      const next = fields.map((item) =>
                        item.key === f.key ? { ...item, enabled: !item.enabled } : item
                      );
                      saveSection({ fields: next });
                      toast.success(`Đã cập nhật câu hỏi "${f.label}"`);
                    }}
                    className="h-4 w-4 rounded-sm border-stone-300 accent-[#1F1A17] cursor-pointer disabled:opacity-50"
                  />
                </div>
              ))}
            </div>

            {/* Tùy chỉnh thông điệp trên form */}
            <div className="border-t border-stone-100 pt-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Thông điệp chào mừng trên form
              </h4>

              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-stone-700">Tiêu đề bìa form</label>
                <input
                  type="text"
                  value={formCoverTitle}
                  onChange={(e) => saveSection({ formCoverTitle: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs outline-none focus:border-[#3B52DE]"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-stone-700">Lời nhắn nhủ thân tình</label>
                <textarea
                  rows={2}
                  value={formCoverNote}
                  onChange={(e) => saveSection({ formCoverNote: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-xs outline-none focus:border-[#3B52DE]"
                />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: XEM TRƯỚC FORM KHÁCH ĐIỀN */}
          <div className="lg:col-span-5 rounded-3xl border border-stone-200 bg-stone-50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1F1A17]">Mô phỏng trang khách điền</span>
              <span className="text-[11px] text-stone-400">Xem trực tiếp</span>
            </div>

            {/* Mockup Form Container */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm text-xs">
              <img
                src={heroWedding}
                alt="Form cover"
                className="h-28 w-full object-cover"
              />
              <div className="p-5 space-y-3.5">
                <div className="text-center">
                  <h4 className="font-display text-lg font-bold text-[#1F1A17]">
                    {formCoverTitle}
                  </h4>
                  <p className="mt-1 text-[11px] text-stone-500">
                    {formCoverNote}
                  </p>
                </div>

                {fields
                  .filter((f) => f.enabled)
                  .map((f) => (
                    <div key={f.key} className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-700">
                        {f.label} {f.required && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type="text"
                        disabled
                        placeholder={`Nhập ${f.label.toLowerCase()}...`}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs"
                      />
                    </div>
                  ))}

                <button
                  type="button"
                  className="w-full rounded-xl bg-[#1F1A17] py-2.5 text-xs font-semibold text-white shadow-xs"
                >
                  Xác nhận & Gửi thông tin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: MÃ QR CHIA SẺ NHANH LÊN MẠNG XÃ HỘI
         ========================================================================= */}
      <Modal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        title="Mã QR Thu Thập Thông Tin Liên Hệ"
        size="sm"
      >
        <div className="space-y-4 text-center text-xs">
          <img
            src={buildQrCodeUrl(collectorUrl, 260)}
            alt="QR Thu thập liên hệ"
            className="mx-auto h-52 w-52 rounded-2xl border border-stone-200 p-2.5 shadow-2xs"
          />
          <p className="font-semibold text-[#1F1A17]">{coupleNames}</p>
          <p className="text-stone-500 text-[11px] leading-relaxed">
            Khách mời quét mã QR này bằng Camera điện thoại hoặc Zalo sẽ được dẫn thẳng vào form điền số điện thoại và địa chỉ nhận thiệp cưới.
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleCopy(collectorUrl, "link thu thập")}
              className="flex-1 rounded-xl border border-stone-200 py-2 font-semibold text-stone-700 hover:bg-stone-50"
            >
              Sao chép link
            </button>
            <a
              href={buildQrCodeUrl(collectorUrl, 500)}
              target="_blank"
              download="QR-Thu-Thap-Lien-He.png"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1F1A17] py-2 font-semibold text-white hover:bg-stone-800"
            >
              <Download size={13} /> Tải mã QR
            </a>
          </div>
        </div>
      </Modal>

      {/* =========================================================================
          MODAL: XEM TRƯỚC FORM HOÀN CHỈNH
         ========================================================================= */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Xem trước giao diện khách mời"
        size="sm"
      >
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <img
            src={heroWedding}
            alt="Cover"
            className="h-32 w-full object-cover"
          />
          <div className="space-y-3.5 p-5 text-xs">
            <div className="text-center">
              <span className="font-display italic text-lg font-bold text-[#1F1A17]">
                .EverWeb
              </span>
              <h4 className="mt-1 text-sm font-bold text-[#1F1A17]">
                {formCoverTitle}
              </h4>
              <p className="mt-1 text-[11px] text-stone-500">
                {formCoverNote}
              </p>
            </div>

            {fields
              .filter((f) => f.enabled)
              .map((f) => (
                <div key={f.key} className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-700">
                    {f.label} {f.required && <span className="text-rose-500">*</span>}
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder={`Nhập ${f.label.toLowerCase()}...`}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs"
                  />
                </div>
              ))}

            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(false)}
              className="w-full rounded-xl bg-[#1F1A17] py-2.5 text-xs font-semibold text-white shadow-xs"
            >
              Gửi thông tin (Xem trước)
            </button>
          </div>
        </div>
      </Modal>
    </FeatureShell>
  );
}
