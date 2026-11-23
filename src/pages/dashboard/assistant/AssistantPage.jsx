import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bot,
  Send,
  RotateCcw,
  Check,
  Copy,
  Lightbulb,
  DollarSign,
  Calendar,
  Heart,
  ChevronRight,
  History,
  Plus,
  Trash2,
  MessageSquare,
  PanelLeft,
} from "lucide-react";
import aiApi from "../../../services/aiApi";
import MarkdownContent from "../../../components/chat/MarkdownContent";

let pageIdCounter = 0;
function createPageMessageId(prefix = "msg") {
  pageIdCounter += 1;
  return `${prefix}-${pageIdCounter}`;
}

const TOPIC_CARDS = [
  {
    icon: DollarSign,
    title: "Phân bổ ngân sách",
    desc: "Tính toán chi tiết từng hạng mục tiệc, trang phục, chụp ảnh",
    prompt: "Gợi ý cho mình cách phân bổ ngân sách cưới 200 triệu đồng hợp lý nhất",
    badge: "Tài chính",
    color: "from-amber-500/10 to-amber-600/5 text-amber-700 border-amber-200",
  },
  {
    icon: Calendar,
    title: "Tiến độ & Checklist",
    desc: "Lộ trình việc cần làm từ 6 tháng đến tuần lễ trọng đại",
    prompt: "Lập cho mình danh sách việc cần làm (Checklist) trước ngày cưới 6 tháng",
    badge: "Timeline",
    color: "from-blue-500/10 to-blue-600/5 text-blue-700 border-blue-200",
  },
  {
    icon: Heart,
    title: "Nghi lễ truyền thống",
    desc: "Quy trình Lễ Dạm ngõ, Ăn hỏi và Gia tiên chuẩn 3 miền",
    prompt: "Quy trình Lễ Rước dâu và Lễ Gia tiên ngày cưới gồm những bước nào?",
    badge: "Phong tục",
    color: "from-rose-500/10 to-rose-600/5 text-rose-700 border-rose-200",
  },
  {
    icon: Lightbulb,
    title: "Lời mời & Thiệp cưới",
    desc: "Văn phong viết thiệp cưới số EverWeb trang trọng, ý nghĩa",
    prompt: "Gợi ý 3 mẫu lời mời thiệp cưới online trang trọng và xúc động",
    badge: "EverWeb",
    color: "from-emerald-500/10 to-emerald-600/5 text-emerald-700 border-emerald-200",
  },
];

const INITIAL_MESSAGES = [
  {
    id: "welcome",
    role: "assistant",
    content: `### Chào hai bạn, mình là Én Hỷ - Trợ lý Kế hoạch Cưới EverWeb

Mình ở đây để đồng hành cùng hai bạn chuẩn bị ngày cưới trọn vẹn, khoa học và tối ưu chi phí:

- **Kiểm soát ngân sách:** Phân bổ chi phí hợp lý, hạn chế phát sinh ngoài dự kiến.
- **Lộ trình chuẩn bị:** Danh sách việc cần làm (Checklist) chi tiết theo từng mốc thời gian.
- **Nghi lễ truyền thống:** Hướng dẫn đầy đủ thủ tục Dạm ngõ, Ăn hỏi, Gia tiên đúng chuẩn văn hoá.
- **Truyền thông cưới:** Gợi ý nội dung thiệp mời online, sơ đồ bàn tiệc thông minh.

> *Bạn có thể chọn nhanh một chủ đề phía trên hoặc đặt câu hỏi bất kỳ để bắt đầu.*`,
    createdAt: new Date(),
  },
];

const LOCAL_STORAGE_KEY_PREFIX = "everweb_ai_chat_";

export default function AssistantPage({ selectedWedding }) {
  const weddingKey = selectedWedding?.id || "default";
  const storageKey = `${LOCAL_STORAGE_KEY_PREFIX}${weddingKey}`;

  // Trạng thái hội thoại & lịch sử
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Bỏ qua lỗi parse
    }
    return INITIAL_MESSAGES;
  });

  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Lưu tin nhắn cục bộ vào LocalStorage để không mất khi F5
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // Bỏ qua lỗi quota
    }
  }, [messages, storageKey]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const weddingId = selectedWedding?.id;

  const refreshSessions = async () => {
    try {
      const res = await aiApi.getSessions(
        weddingId && weddingId.length === 36 ? weddingId : undefined
      );
      if (res.status === "success" && Array.isArray(res.data)) {
        setSessions(res.data);
      }
    } catch (err) {
      console.warn("Không thể tải danh sách phiên chat từ server:", err.message);
    }
  };

  // Tải danh sách phiên trò chuyện từ Backend
  useEffect(() => {
    let isMounted = true;
    const loadSessions = async () => {
      try {
        const res = await aiApi.getSessions(
          weddingId && weddingId.length === 36 ? weddingId : undefined
        );
        if (isMounted && res.status === "success" && Array.isArray(res.data)) {
          setSessions(res.data);
        }
      } catch (err) {
        console.warn("Không thể tải danh sách phiên chat từ server:", err.message);
      } finally {
        if (isMounted) {
          setIsLoadingSessions(false);
        }
      }
    };

    loadSessions();

    return () => {
      isMounted = false;
    };
  }, [weddingId]);

  // Chọn một phiên trò chuyện cũ để xem lại và tiếp tục
  const handleSelectSession = async (sessionId) => {
    if (sessionId === currentSessionId || isLoading) return;
    setIsLoading(true);
    try {
      const res = await aiApi.getSessionDetail(sessionId);
      if (res.status === "success" && res.data) {
        setCurrentSessionId(sessionId);
        if (Array.isArray(res.data.messages) && res.data.messages.length > 0) {
          setMessages(
            res.data.messages.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              createdAt: new Date(m.createdAt),
            }))
          );
        } else {
          setMessages(INITIAL_MESSAGES);
        }
      }
    } catch (err) {
      console.error("Lỗi khi tải phiên trò chuyện:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Bắt đầu cuộc trò chuyện mới
  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages(INITIAL_MESSAGES);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Bỏ qua
    }
    inputRef.current?.focus();
  };

  // Xóa một phiên trò chuyện cụ thể
  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc muốn xóa cuộc trò chuyện này khỏi lịch sử?")) return;

    try {
      await aiApi.deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Lỗi xóa phiên chat:", err);
    }
  };

  // Xóa toàn bộ lịch sử trò chuyện
  const handleClearAllHistory = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa TOÀN BỘ lịch sử trò chuyện không?")) return;

    try {
      await aiApi.clearAllSessions(
        selectedWedding?.id && selectedWedding.id.length === 36
          ? selectedWedding.id
          : undefined
      );
      setSessions([]);
      handleNewChat();
    } catch (err) {
      console.error("Lỗi xóa tất cả lịch sử:", err);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Gửi tin nhắn và lưu vào bộ nhớ lịch sử
  const handleSend = async (userPrompt) => {
    const textToSend = (userPrompt || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage = {
      id: createPageMessageId("user"),
      role: "user",
      content: textToSend,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Gọi API session-chat có lưu CSDL và duy trì trí nhớ ngữ cảnh
      const response = await aiApi.sessionChat({
        sessionId: currentSessionId || undefined,
        weddingId:
          selectedWedding?.id && selectedWedding.id.length === 36
            ? selectedWedding.id
            : undefined,
        message: textToSend,
      });

      const replyText =
        response.data?.reply ||
        response.data ||
        "Xin lỗi, mình chưa nhận được phản hồi phù hợp.";

      // Nếu tạo mới phiên, cập nhật lại sessionId
      if (response.data?.sessionId) {
        setCurrentSessionId(response.data.sessionId);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: response.data?.assistantMessage?.id || createPageMessageId("assistant"),
          role: "assistant",
          content: replyText,
          model: response.data?.model,
          createdAt: new Date(),
        },
      ]);

      // Cập nhật lại danh sách lịch sử
      refreshSessions();
    } catch (err) {
      console.error("Chat error:", err);
      const rawError =
        err.response?.data?.message ||
        err.message ||
        "Không thể kết nối đến máy chủ Backend.";

      let friendlyMsg = rawError;
      if (
        rawError.toLowerCase().includes("tokens per minute") ||
        rawError.toLowerCase().includes("request too large") ||
        rawError.toLowerCase().includes("tpm") ||
        rawError.toLowerCase().includes("rate limit")
      ) {
        friendlyMsg =
          "Hệ thống nhận nhiều yêu cầu cùng lúc hoặc nội dung quá dài (vượt giới hạn xử lý tạm thời trong 1 phút). Bạn vui lòng bấm nút 'Cuộc trò chuyện mới' hoặc rút ngắn câu hỏi và thử lại sau ít giây nhé!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: createPageMessageId("err"),
          role: "assistant",
          content: `**Thông báo:** ${friendlyMsg}\n\n*Gợi ý: Hãy bấm nút "+ Cuộc trò chuyện mới" để bắt đầu lượt trò chuyện mới hoặc kiểm tra file \`EverWeb-BE/.env\`.*`,
          createdAt: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3B2A1A] via-[#523B25] to-[#3B2A1A] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C5A059]/20 px-3 py-1 text-xs font-semibold text-[#F4E3C1] ring-1 ring-[#C5A059]/40 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
              EverWeb Wedding Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Én Hỷ • Trợ Lý Kế Hoạch Cưới AI
            </h1>
            <p className="text-sm text-[#E0D3C5] leading-relaxed">
              Người đồng hành đắc lực giúp bạn lên kế hoạch, tính toán chi phí, lập tiến độ và giải đáp mọi thắc mắc về nghi lễ cưới Việt Nam một cách trực quan, khoa học.
            </p>
          </div>

          {selectedWedding && (
            <div className="rounded-2xl bg-white/10 p-4 border border-white/15 backdrop-blur-md min-w-[240px]">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#C5A059]">
                Đang hỗ trợ đám cưới:
              </p>
              <h3 className="mt-1 text-base font-bold text-white">
                {selectedWedding.couple || selectedWedding.label}
              </h3>
              <p className="mt-0.5 text-xs text-[#D8C8B8]">
                {selectedWedding.hall} • {selectedWedding.time}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. CHỦ ĐỀ GỢI Ý NHANH (CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TOPIC_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSend(card.prompt)}
              className="group text-left rounded-2xl bg-white p-4 border border-[#EAE3D8] hover:border-[#C5A059] shadow-xs hover:shadow-md transition-all duration-200 active:scale-98 disabled:opacity-60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${card.color} border`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7A68]">
                    {card.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#2C2117] group-hover:text-[#C5A059] transition">
                  {card.title}
                </h4>
                <p className="mt-1 text-xs text-[#7B6A58] line-clamp-2 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#C5A059] group-hover:translate-x-1 transition">
                <span>Hỏi ngay</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. KHU VỰC TRÒ CHUYỆN KÈM BỘ NHỚ LỊCH SỬ CHAT */}
      <div className="rounded-3xl bg-white border border-[#EAE3D8] shadow-sm overflow-hidden flex flex-col h-[740px]">
        {/* Chat Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EAE1] bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              className={`p-2 rounded-xl border transition ${
                showHistory
                  ? "bg-[#3B2A1A] text-[#C5A059] border-[#3B2A1A]"
                  : "bg-white text-[#6F5B49] border-[#E4DCD3] hover:bg-[#F2ECE3]"
              }`}
              title={showHistory ? "Ẩn lịch sử trò chuyện" : "Hiện lịch sử trò chuyện"}
            >
              <PanelLeft className="h-4 w-4" />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#3B2A1A] to-[#5A3F27] text-[#C5A059] shadow-md">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2C2117]">
                {currentSessionId
                  ? sessions.find((s) => s.id === currentSessionId)?.title || "Cuộc trò chuyện với Én Hỷ"
                  : "Cuộc trò chuyện với Én Hỷ"}
              </h3>
              <p className="text-xs text-[#8C7A68]">
                {currentSessionId ? "Đang tiếp tục phiên trò chuyện đã lưu" : "Sẵn sàng giải đáp ngân sách, tiến độ và nghi lễ cưới"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNewChat}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#C5A059] bg-[#C5A059]/10 px-3 py-1.5 text-xs font-semibold text-[#8B6E32] hover:bg-[#C5A059]/20 transition"
              title="Khởi tạo cuộc trò chuyện mới"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Cuộc trò chuyện mới</span>
            </button>

            <button
              type="button"
              onClick={handleNewChat}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E4DCD3] bg-white px-3 py-1.5 text-xs font-semibold text-[#5D4632] hover:bg-[#FAF8F5] transition"
              title="Đặt lại màn hình chat"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>

        {/* Nội dung chính: Cột Lịch Sử + Cột Tin Nhắn */}
        <div className="flex flex-1 overflow-hidden">
          {/* 3.1. SIDEBAR LỊCH SỬ TRÒ CHUYỆN (BỘ NHỚ LỊCH SỬ) */}
          {showHistory && (
            <div className="w-72 border-r border-[#EAE3D8] bg-[#FDFBF7] flex flex-col justify-between shrink-0">
              <div className="p-3 border-b border-[#EAE3D8] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#3B2A1A]">
                  <History className="h-4 w-4 text-[#C5A059]" />
                  <span>Lịch sử trò chuyện ({sessions.length})</span>
                </div>
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="p-1.5 rounded-lg hover:bg-[#EFE9DF] text-[#5D4632] transition"
                  title="Tạo cuộc trò chuyện mới"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Danh sách các phiên trò chuyện */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {isLoadingSessions ? (
                  <div className="p-4 text-center text-xs text-[#8C7A68]">
                    Đang nạp lịch sử...
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#A59483]">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-[#D2C5B5] stroke-1" />
                    Chưa có lịch sử trò chuyện nào. Hãy đặt câu hỏi để bắt đầu!
                  </div>
                ) : (
                  sessions.map((sess) => {
                    const isActive = sess.id === currentSessionId;
                    return (
                      <div
                        key={sess.id}
                        onClick={() => handleSelectSession(sess.id)}
                        className={`group relative flex items-start justify-between gap-2 p-2.5 rounded-xl text-left cursor-pointer transition border ${
                          isActive
                            ? "bg-[#3B2A1A] text-white border-[#3B2A1A] shadow-xs"
                            : "bg-white text-[#3B2A1A] border-[#EAE3D8] hover:border-[#C5A059] hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          <MessageSquare
                            className={`h-4 w-4 mt-0.5 shrink-0 ${
                              isActive ? "text-[#C5A059]" : "text-[#8C7A68]"
                            }`}
                          />
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-semibold truncate ${
                                isActive ? "text-white" : "text-[#2C2117]"
                              }`}
                            >
                              {sess.title || "Cuộc trò chuyện"}
                            </p>
                            <p
                              className={`text-[10px] mt-0.5 ${
                                isActive ? "text-[#D8C8B8]" : "text-[#9A8775]"
                              }`}
                            >
                              {new Date(sess.createdAt).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {sess.messageCount > 0 && ` • ${sess.messageCount} tin nhắn`}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(e, sess.id)}
                          className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-rose-500/20 ${
                            isActive ? "text-white hover:text-rose-300" : "text-[#8C7A68] hover:text-rose-600"
                          }`}
                          title="Xóa phiên này"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Nút xóa tất cả lịch sử */}
              {sessions.length > 0 && (
                <div className="p-3 border-t border-[#EAE3D8] bg-[#F7F4EE]">
                  <button
                    type="button"
                    onClick={handleClearAllHistory}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-rose-200 bg-white text-xs font-medium text-rose-700 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Xóa toàn bộ lịch sử</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3.2. KHUNG STREAM TIN NHẮN */}
          <div className="flex-1 flex flex-col bg-[#FAF9F6] overflow-hidden">
            {/* Stream Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => {
                const isAssistant = msg.role === "assistant";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-4 ${
                      isAssistant ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isAssistant && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3B2A1A] text-[#C5A059] shadow-md mt-1">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`group relative max-w-[85%] lg:max-w-[78%] rounded-3xl p-5 shadow-sm ${
                        isAssistant
                          ? msg.isError
                            ? "bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-sm"
                            : "bg-white border border-[#EAE3D8] text-[#2C2117] rounded-tl-sm"
                          : "bg-[#3B2A1A] text-white rounded-tr-sm"
                      }`}
                    >
                      {isAssistant ? (
                        <MarkdownContent content={msg.content} />
                      ) : (
                        <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      )}

                      <div
                        className={`mt-3 flex items-center justify-between gap-4 text-[11px] pt-2 border-t ${
                          isAssistant
                            ? "border-[#F2ECE3] text-[#9A8775]"
                            : "border-white/15 text-white/60"
                        }`}
                      >
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {msg.model && ` • ${msg.model}`}
                        </span>

                        {isAssistant && (
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition p-1 hover:text-[#3B2A1A]"
                            title="Sao chép nội dung"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-600" />
                                <span className="text-emerald-600">Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Sao chép</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-4 justify-start items-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3B2A1A] text-[#C5A059] shadow-md animate-pulse">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl bg-white border border-[#EAE3D8] px-5 py-3.5 text-xs text-[#7B6A58] shadow-xs flex items-center gap-3">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-[#C5A059] animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 rounded-full bg-[#C5A059] animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 rounded-full bg-[#C5A059] animate-bounce"></div>
                    </div>
                    <span>Én Hỷ đang suy nghĩ và tính toán...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="p-4 bg-white border-t border-[#F0EAE1]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Hỏi Én Hỷ về dự trù kinh phí, lịch trình cưới, kịch bản MC, mẫu thiệp..."
                  disabled={isLoading}
                  className="w-full rounded-2xl border border-[#DED7CE] bg-[#FAF9F6] py-3.5 pl-4 pr-14 text-sm text-[#2C2117] placeholder-[#A39281] focus:border-[#C5A059] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#C5A059]/15 transition disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B2A1A] text-[#C5A059] hover:bg-[#4E3824] transition disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                  title="Gửi câu hỏi"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#A59483] px-1">
                <span>Nhấn Enter để gửi • Cuộc trò chuyện được tự động lưu vào bộ nhớ</span>
                <span>EverWeb AI Wedding Planner</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
