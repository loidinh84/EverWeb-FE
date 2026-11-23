import { useState } from "react";
import {
  Activity,
  Clock,
  Copy,
  Eye,
  Mail,
  MessageSquare,
  Send,
  Settings,
  Share2,
  Users,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import heroWedding from "../../assets/image/hero-wedding.jpg";
import FeatureShell from "./FeatureShell";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";

const RECIPIENT_GROUPS = [
  "Khách chưa có SĐT & Địa chỉ (42 khách)",
  "Toàn bộ danh sách khách mời (120 khách)",
  "Nhóm bạn thân & Đồng nghiệp (35 khách)",
];

const DEFAULT_FIELDS = [
  { key: "fullName", label: "Họ và tên", enabled: true },
  { key: "phone", label: "Số điện thoại", enabled: true },
  { key: "email", label: "Email", enabled: true },
  { key: "address", label: "Địa chỉ nhận thiệp giấy", enabled: true },
  { key: "note", label: "Ghi chú thêm", enabled: false },
];

export default function CollectContactsPage() {
  const toast = useToast();
  const { wedding } = useCurrentWedding();

  const { data: ccData, saveSection } = useWeddingFeature(
    wedding,
    "collect_contacts",
    {
      isCollectorOn: true,
      sendTime: "now",
      scheduledAt: "",
      channel: "both",
      recipientGroup: RECIPIENT_GROUPS[0],
      subject: "Chia sẻ thông tin nhận thiệp cưới",
      body: "Chào bạn! Chúng mình sắp tổ chức lễ cưới và rất mong có đầy đủ SĐT, địa chỉ của bạn để gửi thiệp mời. Bấm vào nút bên dưới để điền nhanh nhé!",
      buttonText: "Điền thông tin liên hệ",
      fields: DEFAULT_FIELDS,
      submissions: [
        {
          id: "c1",
          name: "Nguyễn Thị Lan",
          phone: "0909 123 456",
          address: "Q. Bình Thạnh, TP.HCM",
          time: "10 phút trước",
        },
        {
          id: "c2",
          name: "Lê Minh Khoa",
          phone: "0912 345 678",
          address: "Q.1, TP.HCM",
          time: "1 giờ trước",
        },
      ],
    }
  );

  const [tab, setTab] = useState("send");
  const [previewMode, setPreviewMode] = useState("sms");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [senderName, setSenderName] = useState(
    (wedding?.title || "Trần Thanh Khang & Trần Ngọc An").normalize("NFC")
  );

  const isCollectorOn = ccData.isCollectorOn ?? true;
  const sendTime = ccData.sendTime || "now";
  const scheduledAt = ccData.scheduledAt || "";
  const channel = ccData.channel || "both";
  const recipientGroup = ccData.recipientGroup || RECIPIENT_GROUPS[0];
  const subject = ccData.subject || "";
  const body = ccData.body || ccData.message || "";
  const buttonText = ccData.buttonText || "Điền thông tin liên hệ";
  const fields = ccData.fields || DEFAULT_FIELDS;
  const submissions = ccData.submissions || [];

  const collectorUrl = `https://everwed.vn/contact/${wedding?.slug || "khang-an"}`;

  const handleSend = (e) => {
    e.preventDefault();
    toast.success(
      sendTime === "scheduled" && scheduledAt
        ? `Đã hẹn giờ gửi lúc ${scheduledAt} (đã lưu Neon DB)`
        : "Đã gửi yêu cầu thu thập liên hệ tới khách mời!"
    );
    saveSection((prev) => ({
      ...prev,
      submissions: [
        {
          id: `c-${Date.now()}`,
          name: "Khách mời mới",
          phone: "0908 888 999",
          address: "Đã gửi link thu thập",
          time: "Vừa xong",
        },
        ...(prev.submissions || []),
      ],
    }));
  };

  return (
    <FeatureShell
      title="Thu thập thông tin liên hệ"
      subtitle="Gửi link để khách mời tự điền SĐT, email & địa chỉ nhận thiệp"
      wedding={wedding}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              saveSection({ isCollectorOn: !isCollectorOn });
              toast.info(
                !isCollectorOn
                  ? "Đã bật link thu thập liên hệ"
                  : "Đã tạm tắt link thu thập liên hệ"
              );
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              isCollectorOn
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-stone-100 text-stone-600"
            }`}
          >
            {isCollectorOn ? "Link đang mở" : "Link đang tắt"}
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(collectorUrl);
              toast.success("Đã sao chép link thu thập");
            }}
            className="hidden items-center gap-1.5 rounded-full border border-[#E2D9CB] bg-white px-3 py-1.5 text-xs font-semibold text-[#2C2117] hover:border-[#3B52DE] sm:inline-flex"
          >
            <Share2 size={13} /> Chia sẻ
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#3B52DE] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2F43C2]"
          >
            <Eye size={13} /> Xem trước form
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left WithJoy Sidebar (Send / Activity / Settings) */}
        <aside className="rounded-2xl border border-[#E6DFD3] bg-white p-2.5 lg:col-span-2">
          <nav className="flex flex-row gap-1 lg:flex-col">
            {[
              { key: "send", label: "Gửi yêu cầu", icon: Send },
              {
                key: "activity",
                label: `Hoạt động (${submissions.length})`,
                icon: Activity,
              },
              { key: "settings", label: "Cài đặt", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  className={`flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${
                    active
                      ? "bg-[#EEF2FF] text-[#3B52DE]"
                      : "text-[#5E5042] hover:bg-[#FAF8F5]"
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-10">
          {tab === "send" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Compose Form */}
              <form
                onSubmit={handleSend}
                className="space-y-4 rounded-2xl border border-[#E6DFD3] bg-white p-5 lg:col-span-7"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#2C2117]">
                    Soạn tin nhắn thu thập liên hệ
                  </h2>
                  <div className="inline-flex rounded-full border border-[#E2D9CB] bg-[#FAF8F5] p-0.5 text-[11px] font-semibold">
                    {[
                      { key: "now", label: "Gửi ngay" },
                      { key: "scheduled", label: "Hẹn giờ" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => saveSection({ sendTime: opt.key })}
                        className={`rounded-full px-3 py-1 transition ${
                          sendTime === opt.key
                            ? "bg-white text-[#3B52DE] shadow-2xs"
                            : "text-[#7D6D5E]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {sendTime === "scheduled" && (
                  <div className="flex items-center gap-2 rounded-xl border border-[#E2D9CB] bg-[#FAF8F5] px-3 py-2 text-xs">
                    <Clock size={14} className="text-[#3B52DE]" />
                    <span className="text-[#6D5B4B]">Thời gian gửi:</span>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) =>
                        saveSection({ scheduledAt: e.target.value })
                      }
                      className="bg-transparent font-semibold text-[#2C2117] outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-[#5E5042]">
                    Kênh gửi
                  </label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {[
                      { key: "sms", label: "SMS" },
                      { key: "email", label: "Email" },
                      { key: "both", label: "Cả hai" },
                    ].map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => saveSection({ channel: c.key })}
                        className={`rounded-xl border py-2 text-xs font-semibold transition ${
                          channel === c.key
                            ? "border-[#3B52DE] bg-[#EEF2FF]/60 text-[#3B52DE]"
                            : "border-[#E6DFD3] text-[#5E5042]"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#5E5042]">
                    Người nhận (To)
                  </label>
                  <select
                    value={recipientGroup}
                    onChange={(e) =>
                      saveSection({ recipientGroup: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#E2D9CB] bg-white px-3 py-2 text-xs font-medium outline-none focus:border-[#3B52DE]"
                  >
                    {RECIPIENT_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-[#5E5042]">
                      Người gửi
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#E2D9CB] px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#5E5042]">
                      Tiêu đề Email
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => saveSection({ subject: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#E2D9CB] px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-[#5E5042]">
                      Nội dung tin nhắn
                    </label>
                    <span className="text-[11px] text-[#8C7A68] tabular-nums">
                      SMS: {body.length}/306 ký tự
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={body}
                    onChange={(e) => saveSection({ body: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E2D9CB] p-3 text-xs leading-relaxed outline-none focus:border-[#3B52DE]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#5E5042]">
                    Chữ trên nút bấm
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) =>
                      saveSection({ buttonText: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-[#E2D9CB] px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl bg-[#FAF8F5] px-3 py-2.5 text-xs">
                  <span className="truncate text-[#6D5B4B]">
                    {collectorUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(collectorUrl);
                      toast.success("Đã sao chép đường dẫn thu thập");
                    }}
                    className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#3B52DE]"
                  >
                    <Copy size={12} /> Sao chép
                  </button>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B52DE] py-2.5 text-xs font-semibold text-white transition hover:bg-[#2F43C2]"
                >
                  <Send size={14} />{" "}
                  {sendTime === "scheduled"
                    ? "Lên lịch gửi lời nhắc"
                    : "Gửi yêu cầu thu thập liên hệ"}
                </button>
              </form>

              {/* Live SMS / Email Preview + How It Works */}
              <div className="space-y-4 lg:col-span-5">
                <div className="rounded-2xl border border-[#E6DFD3] bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2C2117]">
                      Xem trước tin nhắn
                    </span>
                    <div className="flex rounded-lg border border-[#E2D9CB] bg-[#FAF8F5] p-0.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setPreviewMode("sms")}
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium ${
                          previewMode === "sms"
                            ? "bg-white text-[#3B52DE] shadow-2xs"
                            : "text-[#8C7A68]"
                        }`}
                      >
                        <MessageSquare size={12} /> SMS
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode("email")}
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium ${
                          previewMode === "email"
                            ? "bg-white text-[#3B52DE] shadow-2xs"
                            : "text-[#8C7A68]"
                        }`}
                      >
                        <Mail size={12} /> Email
                      </button>
                    </div>
                  </div>

                  {previewMode === "sms" ? (
                    <div className="mx-auto max-w-[280px] rounded-3xl border-4 border-[#2C2117] bg-[#FAF8F5] p-4">
                      <p className="text-center text-[10px] font-semibold text-[#8C7A68]">
                        Tin nhắn từ {senderName}
                      </p>
                      <div className="mt-3 rounded-2xl rounded-tl-xs bg-[#E5E7EB] p-3 text-xs leading-relaxed text-[#1F2937]">
                        {body}
                        <p className="mt-2 font-medium text-[#3B52DE] underline">
                          {collectorUrl}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-[#E6DFD3] bg-[#FAF8F5]">
                      <img
                        src={heroWedding}
                        alt="Cover"
                        className="h-24 w-full object-cover"
                      />
                      <div className="p-5 text-center">
                        <p className="font-display text-lg font-bold text-[#2C2117]">
                          {senderName}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#3B52DE]">
                          {subject}
                        </p>
                        <p className="mt-3 text-xs leading-relaxed text-[#5E5042]">
                          {body}
                        </p>
                        <span className="mt-4 inline-block rounded-full bg-[#3B52DE] px-5 py-2 text-xs font-semibold text-white">
                          {buttonText}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* How It Works */}
                <div className="rounded-2xl border border-[#E6DFD3] bg-white p-5">
                  <h3 className="text-xs font-bold text-[#2C2117]">
                    Cách hoạt động
                  </h3>
                  <ol className="mt-3 space-y-2.5 text-xs text-[#5E5042]">
                    <li className="flex gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[10px] font-bold text-[#3B52DE]">
                        1
                      </span>
                      Bật link thu thập liên hệ và chọn nhóm khách mời.
                    </li>
                    <li className="flex gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[10px] font-bold text-[#3B52DE]">
                        2
                      </span>
                      Gửi qua SMS, Email hoặc sao chép link gửi Zalo.
                    </li>
                    <li className="flex gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[10px] font-bold text-[#3B52DE]">
                        3
                      </span>
                      Khách tự điền SĐT & địa chỉ nhận thiệp, đồng bộ thẳng vào
                      danh sách.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {tab === "activity" && (
            <div className="rounded-2xl border border-[#E6DFD3] bg-white p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#2C2117]">
                <Users size={16} className="text-[#3B52DE]" />
                Khách mời đã phản hồi thông tin
              </h2>
              <div className="divide-y divide-[#F1ECE3]">
                {submissions.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#2C2117]">{s.name}</p>
                      <p className="text-[#7D6D5E]">
                        {s.phone} · {s.address}
                      </p>
                    </div>
                    <span className="text-[11px] text-[#8C7A68]">{s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="max-w-xl space-y-4 rounded-2xl border border-[#E6DFD3] bg-white p-5">
              <h2 className="text-sm font-bold text-[#2C2117]">
                Cài đặt trường thông tin cần hỏi khách
              </h2>
              <div className="divide-y divide-[#F1ECE3]">
                {fields.map((f) => (
                  <label
                    key={f.key}
                    className="flex items-center justify-between py-2.5 text-xs"
                  >
                    <span className="font-medium text-[#2C2117]">
                      {f.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={f.enabled}
                      onChange={() => {
                        saveSection((prev) => ({
                          ...prev,
                          fields: (prev.fields || DEFAULT_FIELDS).map((item) =>
                            item.key === f.key
                              ? { ...item, enabled: !item.enabled }
                              : item
                          ),
                        }));
                        toast.success("Đã cập nhật cấu hình lên Neon DB");
                      }}
                      className="h-4 w-4 accent-[#3B52DE]"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guest-Facing Form Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Xem trước Form khách mời sẽ điền"
        size="sm"
      >
        <div className="overflow-hidden rounded-2xl border border-[#E6DFD3] bg-[#FAF8F5]">
          <img
            src={heroWedding}
            alt="Form cover"
            className="h-28 w-full object-cover"
          />
          <div className="space-y-3 p-5">
            <div className="text-center">
              <p className="font-display text-xl font-bold text-[#2C2117]">
                {senderName}
              </p>
              <p className="mt-1 text-xs text-[#6D5B4B]">{subject}</p>
            </div>
            {fields
              .filter((f) => f.enabled)
              .map((f) => (
                <div key={f.key}>
                  <label className="text-[11px] font-semibold text-[#5E5042]">
                    {f.label}
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder={`Nhập ${f.label.toLowerCase()}...`}
                    className="mt-1 w-full rounded-xl border border-[#E2D9CB] bg-white px-3 py-2 text-xs"
                  />
                </div>
              ))}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="w-full rounded-xl bg-[#3B52DE] py-2 text-xs font-semibold text-white"
            >
              Gửi thông tin (Xem trước)
            </button>
          </div>
        </div>
      </Modal>
    </FeatureShell>
  );
}
