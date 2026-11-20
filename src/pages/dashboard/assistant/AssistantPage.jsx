import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bot,
  User,
  Send,
  RotateCcw,
  Check,
  Copy,
  Lightbulb,
  DollarSign,
  Calendar,
  Heart,
  ChevronRight,
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
    content: `### 🕊️ Chào hai bạn! Mình là Én Hỷ - Trợ lý Kế hoạch Cưới EverWeb

Mình ở đây để giúp hai bạn chuẩn bị ngày cưới trọn vẹn, nhẹ nhàng và tiết kiệm thời gian nhất:

- 💰 **Kiểm soát ngân sách:** Phân bổ chi phí hợp lý, tránh phát sinh.
- 📋 **Lộ trình chuẩn bị:** Checklist việc cần làm từng tháng, từng tuần.
- 💍 **Nghi lễ trọn vẹn:** Tư vấn thủ tục Dạm ngõ, Ăn hỏi, Gia tiên chuẩn phong tục.
- 💌 **Truyền thông cưới:** Gợi ý lời mời thiệp online, sơ đồ bàn tiệc.

> *Hai bạn có thể bấm chọn một chủ đề bên trên hoặc gõ câu hỏi bất kỳ phía dưới nhé!*`,
    createdAt: new Date(),
  },
];

export default function AssistantPage({ selectedWedding }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    if (window.confirm("Đặt lại cuộc trò chuyện này về trạng thái ban đầu?")) {
      setMessages(INITIAL_MESSAGES);
    }
  };

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
      const historyToSend = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await aiApi.chat({
        messages: historyToSend,
        provider: "openai",
        weddingId:
          selectedWedding?.id && selectedWedding.id.length === 36
            ? selectedWedding.id
            : undefined,
      });

      const replyText =
        response.data?.reply ||
        response.data ||
        "Xin lỗi, mình chưa nhận được phản hồi phù hợp.";

      setMessages((prev) => [
        ...prev,
        {
          id: createPageMessageId("assistant"),
          role: "assistant",
          content: replyText,
          model: response.data?.model,
          createdAt: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      const serverError =
        err.response?.data?.message ||
        err.message ||
        "Không thể kết nối đến máy chủ Backend.";

      setMessages((prev) => [
        ...prev,
        {
          id: createPageMessageId("err"),
          role: "assistant",
          content: `⚠️ **Thông báo:** ${serverError}\n\n*Gợi ý: Hãy kiểm tra file \`EverWeb-BE/.env\` và đảm bảo server Backend đang chạy (\`npm run dev\` ở thư mục EverWeb-BE).*`,
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

      {/* 3. KHU VỰC TRÒ CHUYỆN CHÍNH */}
      <div className="rounded-3xl bg-white border border-[#EAE3D8] shadow-sm overflow-hidden flex flex-col h-[700px]">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EAE1] bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#3B2A1A] to-[#5A3F27] text-[#C5A059] shadow-md">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2C2117]">
                Cuộc trò chuyện với Én Hỷ
              </h3>
              <p className="text-xs text-[#8C7A68]">
                Sẵn sàng giải đáp ngân sách, tiến độ và nghi lễ cưới
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E4DCD3] bg-white px-3 py-1.5 text-xs font-semibold text-[#5D4632] hover:bg-[#FAF8F5] transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Đặt lại
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF9F6]">
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

                {!isAssistant && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C5A059] text-white shadow-md mt-1">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3B2A1A] text-[#C5A059] shadow-md">
                <Sparkles className="h-4 w-4 animate-spin" />
              </div>
              <div className="rounded-3xl rounded-tl-sm bg-white border border-[#EAE3D8] px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C5A059] animate-bounce"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C5A059] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#C5A059] animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs font-medium text-[#7B6A58] ml-2">
                    Én Hỷ đang phân tích kế hoạch và tính toán số liệu...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white border-t border-[#EAE3D8] flex items-center gap-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi Én Hỷ bất cứ điều gì (ví dụ: 'Phân bổ ngân sách 300 triệu', 'Kịch bản lễ đón dâu')..."
            disabled={isLoading}
            className="flex-1 rounded-2xl bg-[#FAF8F5] border border-[#E4DCD3] px-5 py-3 text-sm text-[#2C2117] placeholder-[#9E8E7E] focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white transition disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#3B2A1A] text-white shadow-md hover:bg-[#523B25] active:scale-95 disabled:opacity-40 transition"
            title="Gửi câu hỏi"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

