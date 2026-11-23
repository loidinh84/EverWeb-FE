import { useState } from "react";
import {
  Bell,
  Building2,
  Contact,
  Mail,
  MessageSquare,
  Send,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import FeatureShell from "./FeatureShell";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";

const MESSAGE_TEMPLATES = [
  { key: "sms", title: "Gửi tin nhắn hàng loạt", desc: "Nhắn SMS nhanh tới danh sách khách mời", icon: MessageSquare, color: "bg-sky-50 text-sky-600" },
  { key: "email", title: "Gửi Email thông báo", desc: "Gửi thư mời hoặc thông báo chi tiết qua Email", icon: Mail, color: "bg-[#EEF2FF] text-[#3B52DE]" },
  { key: "contacts", title: "Thu thập liên hệ", desc: "Gửi link để khách tự điền SĐT & địa chỉ", icon: Contact, color: "bg-amber-50 text-amber-600" },
  { key: "hotel", title: "Nhắc đặt khách sạn", desc: "Gửi thông tin phòng ưu đãi gần sảnh tiệc", icon: Building2, color: "bg-rose-50 text-rose-600" },
  { key: "rsvp", title: "Nhắc xác nhận RSVP", desc: "Nhắc những khách chưa phản hồi xác nhận tham dự", icon: Bell, color: "bg-emerald-50 text-emerald-600" },
];

export default function MessagingPage() {
  const toast = useToast();
  const { wedding } = useCurrentWedding();

  const { data: msgData, saveSection } = useWeddingFeature(
    wedding,
    "messaging_config",
    {
      sentMessages: [
        { id: "m1", title: "Nhắc xác nhận RSVP đợt 1", channel: "Email", recipients: "24 khách", time: "Hôm qua" },
      ],
    }
  );

  const [tab, setTab] = useState("create");
  const [composeTarget, setComposeTarget] = useState(null);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const sentList = msgData.sentMessages || [];

  const setSentList = (updater) =>
    saveSection((prev) => ({
      ...prev,
      sentMessages:
        typeof updater === "function"
          ? updater(prev.sentMessages || [])
          : updater,
    }));

  const handleOpenCompose = (tpl) => {
    setComposeTarget(tpl);
    setSubject(tpl.title);
    setContent(`Kính gửi Quý khách, lễ cưới của ${wedding?.title || "chúng mình"} sắp diễn ra...`);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSentList((prev) => [
      {
        id: `m-${Date.now()}`,
        title: subject.trim() || composeTarget.title,
        channel: composeTarget.key === "sms" ? "SMS" : "Email",
        recipients: "Toàn bộ khách mời",
        time: "Vừa xong",
      },
      ...prev,
    ]);
    toast.success(`Đã gửi "${subject || composeTarget.title}" thành công!`);
    setComposeTarget(null);
  };

  return (
    <FeatureShell
      title="Nhắn tin & Thông báo khách mời"
      subtitle="Gửi SMS, Email và lời nhắc tự động tới khách mời"
      wedding={wedding}
    >
      <div className="mb-5 flex gap-4 border-b border-[#EAE3D8]">
        {[
          { key: "create", label: "Tạo tin nhắn" },
          { key: "sent", label: `Đã gửi (${sentList.length})` },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`border-b-2 pb-2.5 text-xs font-semibold transition ${
              tab === t.key
                ? "border-[#3B52DE] text-[#3B52DE]"
                : "border-transparent text-[#8C7A68] hover:text-[#2C2117]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "create" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MESSAGE_TEMPLATES.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <button
                key={tpl.key}
                type="button"
                onClick={() => handleOpenCompose(tpl)}
                className="flex flex-col items-start rounded-2xl border border-[#E6DFD3] bg-white p-5 text-left transition hover:border-[#3B52DE] hover:shadow-xs"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tpl.color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#2C2117]">{tpl.title}</h3>
                <p className="mt-1 text-xs text-[#8C7A68]">{tpl.desc}</p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E6DFD3] bg-white p-5">
          <div className="divide-y divide-[#F1ECE3]">
            {sentList.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-3 text-xs">
                <div>
                  <p className="font-semibold text-[#2C2117]">{m.title}</p>
                  <p className="text-[#8C7A68]">
                    Kênh: {m.channel} · Người nhận: {m.recipients}
                  </p>
                </div>
                <span className="text-[#9C8B7A]">{m.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={!!composeTarget}
        onClose={() => setComposeTarget(null)}
        title={composeTarget?.title || "Soạn tin nhắn"}
        size="md"
      >
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Tiêu đề
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-[#E2D9CB] px-3 py-2 text-sm outline-none focus:border-[#3B52DE]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Nội dung gửi khách mời
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl border border-[#E2D9CB] px-3 py-2 text-sm outline-none focus:border-[#3B52DE]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setComposeTarget(null)}
              className="rounded-lg border border-[#E2D9CB] px-4 py-2 text-xs font-medium"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#3B52DE] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2F43C2]"
            >
              <Send size={13} /> Gửi ngay
            </button>
          </div>
        </form>
      </Modal>
    </FeatureShell>
  );
}
