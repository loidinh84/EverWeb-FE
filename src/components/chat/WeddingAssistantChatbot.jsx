import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  AlertCircle,
  Check,
  Copy,
} from "lucide-react";
import aiApi from "../../services/aiApi";
import MarkdownContent from "./MarkdownContent";

let idCounter = 0;
function createMessageId(prefix = "msg") {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

const QUICK_PROMPTS = [
  "📋 Lập checklist cưới 6 tháng",
  "💰 Phân bổ ngân sách 200 triệu",
  "💍 Quy trình Lễ Ăn hỏi & Gia tiên",
  "💌 Gợi ý lời mời thiệp cưới ý nghĩa",
  "🪑 Cách sắp xếp sơ đồ bàn tiệc",
];

const INITIAL_MESSAGES = [
  {
    id: "welcome-1",
    role: "assistant",
    content:
      "Chào bạn! Mình là **Én Hỷ** - Trợ lý Kế hoạch Cưới thông minh của EverWeb 🕊️✨\n\nMình có thể giúp hai bạn:\n- Lập **tiến độ & checklist** chuẩn bị cưới từ 6-12 tháng\n- Tư vấn **phân bổ ngân sách** chi tiết và tối ưu chi phí\n- Hướng dẫn các nghi lễ phong tục (Dạm ngõ, Ăn hỏi, Gia tiên)\n- Lên kịch bản ngày cưới và gợi ý nội dung thiệp mời online\n\nHãy chọn nhanh gợi ý bên dưới hoặc đặt câu hỏi bất kỳ cho mình nhé!",
    createdAt: new Date(),
  },
];

export default function WeddingAssistantChatbot({ selectedWedding }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc muốn đặt lại cuộc trò chuyện này không?")) {
      setMessages(INITIAL_MESSAGES);
      setErrorMsg("");
    }
  };

  const handleSend = async (userPrompt) => {
    const textToSend = (userPrompt || input).trim();
    if (!textToSend || isLoading) return;

    setErrorMsg("");
    const userMessage = {
      id: createMessageId("user"),
      role: "user",
      content: textToSend,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Chuẩn bị lịch sử trò chuyện gửi lên backend
      const historyToSend = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Gọi API backend (mặc định dùng OpenAI/Groq)
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
          id: createMessageId("assistant"),
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

      setErrorMsg(serverError);

      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId("err"),
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
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* 1. NÚT NỔI (FLOATING BUTTON) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-[#3B2A1A] to-[#5A3F27] p-3.5 text-white shadow-2xl ring-2 ring-[#C5A059]/50 transition-all duration-300 hover:scale-105 hover:ring-[#C5A059] active:scale-95"
          aria-label="Mở Trợ lý Cưới Én Hỷ"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#C5A059] text-white shadow-inner">
            <Sparkles className="h-5 w-5 animate-pulse text-[#3B2A1A]" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>

          <div className="hidden pr-2 text-left sm:block">
            <p className="text-xs font-bold tracking-wide uppercase text-[#EAD8B1]">
              Trợ lý cưới Én Hỷ
            </p>
            <p className="text-[11px] text-[#F3EADB]/80">Hỏi đáp & Lập kế hoạch AI</p>
          </div>
        </button>
      )}

      {/* 2. CỬA SỔ CHATBOT (CHAT MODAL WINDOW) */}
      {isOpen && (
        <div className="flex flex-col w-[94vw] sm:w-[480px] h-[660px] max-h-[88vh] rounded-3xl bg-white shadow-2xl border border-[#EAE3D8] overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95">
          {/* HEADER */}
          <div className="relative flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#3B2A1A] via-[#4A3522] to-[#3B2A1A] text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#C5A059] to-[#E7CE9B] text-[#3B2A1A] shadow-md ring-2 ring-white/20">
                <Bot className="h-6 w-6" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[#3B2A1A]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-wide text-white">
                    Én Hỷ • Trợ Lý Cưới
                  </h3>
                  <span className="rounded-full bg-[#C5A059]/30 px-2 py-0.5 text-[10px] font-medium text-[#F4E3C1] ring-1 ring-[#C5A059]/40">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-[#D8C7B5]">
                  {selectedWedding?.label
                    ? `Ngữ cảnh: Đám cưới ${selectedWedding.label}`
                    : "Đồng hành cùng ngày hạnh phúc"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Làm mới cuộc trò chuyện"
                className="rounded-lg p-1.5 text-[#D8C7B5] hover:bg-white/10 hover:text-white transition"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Đóng hộp chat"
                className="rounded-lg p-1.5 text-[#D8C7B5] hover:bg-white/10 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* CẢNH BÁO NẾU CÓ LỖI */}
          {errorMsg && (
            <div className="flex items-center justify-between gap-2 bg-amber-50 px-4 py-2 border-b border-amber-200 text-xs text-amber-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span className="truncate">{errorMsg}</span>
              </div>
              <button
                onClick={() => setErrorMsg("")}
                className="text-amber-700 hover:text-amber-900 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* NỘI DUNG CUỘC TRÒ CHUYỆN */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#FAF8F5]">
            {messages.map((msg) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${
                    isAssistant ? "justify-start" : "justify-end"
                  }`}
                >
                  {isAssistant && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C5A059] text-white shadow-sm mt-0.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#3B2A1A]" />
                    </div>
                  )}

                  <div className={`group relative max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${
                    isAssistant
                      ? msg.isError
                        ? "bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-sm"
                        : "bg-white border border-[#EAE3D8] text-[#2C2117] rounded-tl-sm"
                      : "bg-gradient-to-r from-[#3B2A1A] to-[#4F3925] text-white rounded-tr-sm"
                  }`}>
                    {/* Render nội dung tin nhắn */}
                    <div className="space-y-1">
                      {isAssistant ? (
                        <MarkdownContent content={msg.content} />
                      ) : (
                        <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      )}
                    </div>

                    {/* Metadata & Nút Copy */}
                    <div className={`mt-1.5 flex items-center justify-between gap-2 text-[10px] ${
                      isAssistant ? "text-[#9A8775]" : "text-white/60"
                    }`}>
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
                          className="opacity-0 group-hover:opacity-100 transition p-1 hover:text-[#3B2A1A]"
                          title="Sao chép nội dung"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4F3925] text-white shadow-sm mt-0.5">
                      <User className="h-3.5 w-3.5 text-[#EAD8B1]" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* TYPING INDICATOR */}
            {isLoading && (
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C5A059] text-white shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 animate-spin text-[#3B2A1A]" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white border border-[#EAE3D8] px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#C5A059] animate-bounce"></span>
                    <span className="h-2 w-2 rounded-full bg-[#C5A059] animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-2 w-2 rounded-full bg-[#C5A059] animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-xs font-medium text-[#8C7A68] ml-2">
                      Én Hỷ đang phân tích kế hoạch...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* GỢI Ý NHANH (PROMPT CHIPS) */}
          <div className="bg-white border-t border-[#F0EAE1] px-3 py-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSend(prompt)}
                  className="rounded-full bg-[#FAF5EE] border border-[#E6DCBF] px-3 py-1 text-xs text-[#5D4632] hover:bg-[#C5A059] hover:text-white hover:border-[#C5A059] transition active:scale-95 disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* THANH NHẬP LIỆU (INPUT AREA) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 p-3 bg-white border-t border-[#EAE3D8]"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi Én Hỷ về ngân sách, kịch bản, nghi lễ..."
              disabled={isLoading}
              className="flex-1 rounded-xl bg-[#FAF8F5] border border-[#E4DCD3] px-3.5 py-2.5 text-sm text-[#2C2117] placeholder-[#A49484] focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white transition disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3B2A1A] text-white shadow-md hover:bg-[#523B25] active:scale-95 disabled:opacity-40 disabled:hover:bg-[#3B2A1A] transition"
              title="Gửi câu hỏi"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
