import { useState, useRef, useEffect } from "react";
import {
  ArrowUp,
  X,
  RotateCcw,
  Loader2,
  Check,
  CheckCircle2,
  Copy,
  ClipboardList,
  Wallet,
  LayoutGrid,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import everwebLogo from "../../assets/image/everweb-logo.jpg";
import aiApi from "../../services/aiApi";
import { useToast } from "../common";
import { useCurrentWedding } from "../../pages/features/useCurrentWedding";
import { executeAiDirectAction } from "../../services/aiActionDispatcher";
import MarkdownContent from "./MarkdownContent";

const STORAGE_KEY = "everweb_ai_widget_chat";

let idCounter = 0;
function createMessageId(prefix = "msg") {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

const QUICK_PROMPTS = [
  {
    label: "Chuyển khách sang Bàn 2",
    icon: LayoutGrid,
    prompt: "Chuyển khách Lan Anh sang Bàn 2",
  },
  {
    label: "Tự động xếp bàn",
    icon: Sparkles,
    prompt: "Tự động xếp chỗ cho toàn bộ khách mời vào bàn",
  },
  {
    label: "Xóa khách khỏi bàn",
    icon: LayoutGrid,
    prompt: "Xóa khách Lan Anh khỏi bàn",
  },
  {
    label: "Checklist 6 tháng",
    icon: ClipboardList,
    prompt: "Lập danh sách việc cần làm (Checklist) trước ngày cưới 6 tháng",
  },
  {
    label: "Ngân sách 200tr",
    icon: Wallet,
    prompt: "Gợi ý cho mình cách phân bổ ngân sách cưới 200 triệu đồng hợp lý nhất",
  },
];

const INITIAL_MESSAGES = [
  {
    id: "welcome-1",
    role: "assistant",
    content:
      "Chào bạn, mình là **Trợ lý EverWeb AI**.\n\nMình có thể hỗ trợ bạn thiết kế website cưới, lên lịch trình, tính ngân sách, và **trực tiếp điều khiển sơ đồ bàn tiệc** (chuyển bàn, xóa khách khỏi bàn, tự động xếp chỗ).\n\nChỉ cần đưa ra yêu cầu — đơn giản như một cuộc trò chuyện.",
    createdAt: new Date().toISOString(),
  },
];

export default function WeddingAssistantChatbot({ selectedWedding }) {
  const toast = useToast();
  const { wedding: currentWedding } = useCurrentWedding();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load saved chat:", e);
    }
    return INITIAL_MESSAGES;
  });

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat:", e);
    }
  }, [messages]);

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
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error("Failed to clear chat storage:", e);
      }
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
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const historyToSend = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const effectiveWedding = selectedWedding || currentWedding;
      let replyText = "";
      let model = "";

      try {
        const response = await aiApi.chat({
          messages: historyToSend,
          provider: "openai",
          weddingId:
            effectiveWedding?.id && effectiveWedding.id.length === 36
              ? effectiveWedding.id
              : undefined,
        });

        replyText =
          response.data?.reply ||
          response.data ||
          "";
        model = response.data?.model;
      } catch (chatErr) {
        console.warn("AI chat API notice:", chatErr.message);
      }

      // THỰC THI LỆNH ĐIỀU KHIỂN TRỰC TIẾP TRÊN HỆ THỐNG
      const actionResult = await executeAiDirectAction({
        wedding: effectiveWedding,
        userPrompt: textToSend,
        aiResponseText: replyText,
      });

      let cleanedReply = (replyText || "").replace(/\[ACTION:[^\]]+\]/g, "").trim();

      if (actionResult?.handled && actionResult.success) {
        if (!cleanedReply) {
          cleanedReply = `Mình đã thực thi yêu cầu của bạn: ${actionResult.actionResult?.detail || "Đã cập nhật hệ thống thành công."}`;
        }
        toast.success(actionResult.actionResult?.title || "Đã thực hiện thành công");
      } else if (actionResult?.handled && !actionResult.success) {
        cleanedReply = actionResult.message || cleanedReply;
        toast.info(actionResult.message);
      } else if (!cleanedReply) {
        cleanedReply = "Mình đã ghi nhận câu hỏi của bạn. Hãy cho mình biết chi tiết thêm nhé!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId("assistant"),
          role: "assistant",
          content: cleanedReply,
          model,
          actionResult: actionResult?.handled && actionResult.success ? actionResult.actionResult : null,
          createdAt: new Date().toISOString(),
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
          content: `**Thông báo:** ${serverError}\n\n*Gợi ý: Hãy kiểm tra kết nối mạng và đảm bảo máy chủ Backend đang hoạt động.*`,
          createdAt: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[999] font-sans">
      {/* 1. NÚT NỔI (FLOATING LAUNCHER BUTTON) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 rounded-full bg-white pl-2 pr-4 py-2 text-[#231F1C] shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-stone-200/90 hover:shadow-[0_16px_44px_rgba(0,0,0,0.18)] hover:scale-[1.02] active:scale-95 transition-all duration-300"
          aria-label="Mở Trợ lý EverWeb AI"
        >
          {/* Logo Avatar */}
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-stone-200/80 bg-white flex items-center justify-center shrink-0 shadow-2xs">
            <img
              src={everwebLogo}
              alt="EverWeb"
              className="w-full h-full object-cover"
            />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white"></span>
            </span>
          </div>

          {/* Labels */}
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#231F1C]">
                EverWeb AI
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <p className="text-[11px] text-stone-400">Hỏi bất kỳ điều gì...</p>
          </div>
        </button>
      )}

      {/* 2. CỬA SỔ CHATBOT (CHUẨN SHOWCASE CARD DESIGN) */}
      {isOpen && (
        <div className="relative w-[94vw] sm:w-[480px] h-[640px] max-h-[88vh] bg-white rounded-[28px] border border-stone-200/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.14)] p-5 sm:p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95">
          {/* TOP BAR / HEADER TINH TẾ */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-stone-200/60 bg-white flex items-center justify-center shrink-0">
                <img
                  src={everwebLogo}
                  alt="EverWeb"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-semibold text-[#231F1C] truncate">
                    EverWeb AI
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                </div>
                <p className="text-[10px] text-stone-400 truncate">
                  {selectedWedding?.label
                    ? `Tiệc: ${selectedWedding.label}`
                    : "Trợ lý cưới thông minh"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                title="Làm mới cuộc trò chuyện"
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Thu nhỏ"
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CẢNH BÁO LỖI (NẾU CÓ) */}
          {errorMsg && (
            <div className="flex items-center justify-between gap-2 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200/80 text-xs text-amber-800 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{errorMsg}</span>
              </div>
              <button
                onClick={() => setErrorMsg("")}
                className="text-amber-700 hover:text-amber-900 font-bold p-0.5"
              >
                ✕
              </button>
            </div>
          )}

          {/* DANH SÁCH TIN NHẮN (MESSAGE STREAM) */}
          <div className="flex-1 overflow-y-auto space-y-4 my-2 pr-1 ew-no-scrollbar">
            {messages.map((msg) => {
              const isAssistant = msg.role === "assistant";

              if (!isAssistant) {
                // Tin nhắn người dùng: Khối xám nhạt bo cong như Showcase
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[85%] bg-[#F3F4F6] text-[#1E1E24] text-xs sm:text-sm rounded-2xl rounded-tr-sm px-4 py-3 leading-relaxed shadow-2xs whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              // Tin nhắn AI: Avatar logo EverWeb + Nội dung tự nhiên
              return (
                <div key={msg.id} className="flex items-start gap-2.5 group">
                  <div className="w-6 h-6 rounded-lg overflow-hidden border border-stone-200/60 bg-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <img
                      src={everwebLogo}
                      alt="EverWeb"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="text-xs sm:text-sm text-[#1E1E24] leading-relaxed">
                      <MarkdownContent content={msg.content} />
                    </div>

                    {msg.actionResult && (
                      <div className="mt-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs shadow-2xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{msg.actionResult.title}</span>
                        </div>
                        <p className="mt-1 text-emerald-700 leading-relaxed font-medium">
                          {msg.actionResult.detail}
                        </p>
                        <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/90 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          <span>Sơ đồ bàn tiệc đã cập nhật trực tiếp</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[10px] text-stone-400 pt-0.5">
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {!msg.isError && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="opacity-0 group-hover:opacity-100 transition hover:text-stone-700"
                          title="Sao chép nội dung"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-600 inline" />
                          ) : (
                            <Copy className="w-3 h-3 inline" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* TYPING / THINKING INDICATOR (CHUẨN SHOWCASE) */}
            {isLoading && (
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg overflow-hidden border border-stone-200/60 bg-white flex items-center justify-center shrink-0">
                  <img
                    src={everwebLogo}
                    alt="EverWeb"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-2 text-stone-600 bg-stone-50 border border-stone-200/60 rounded-xl px-3 py-1.5 shadow-2xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-500" />
                  <span className="text-xs">Đang xử lý...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* GỢI Ý NHANH (PROMPT CHIPS DẠNG PILL) */}
          <div className="flex items-center gap-1.5 overflow-x-auto ew-no-scrollbar pt-2 pb-1 border-t border-stone-100">
            {QUICK_PROMPTS.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSend(item.prompt)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 border border-stone-200/80 px-3 py-1.5 text-xs text-stone-600 hover:bg-[#231F1C] hover:text-white hover:border-[#231F1C] transition-all shadow-2xs active:scale-95 disabled:opacity-50 shrink-0"
                >
                  <IconComponent className="h-3 w-3 text-stone-500" />
                  <span className="font-normal">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* THANH NHẬP LIỆU (CHUẨN PILL SHOWCASE TỪ ẢNH CHỤP) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="pt-2"
          >
            <div className="relative flex items-center bg-[#F8F8FA] border border-stone-200/80 rounded-full px-4 py-2.5 shadow-inner focus-within:border-stone-400 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi bất kỳ điều gì..."
                disabled={isLoading}
                className="text-xs sm:text-sm text-[#1E1E24] placeholder-stone-400 outline-none flex-1 pr-2 font-normal bg-transparent disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                  input.trim() && !isLoading
                    ? "bg-[#231F1C] text-white hover:bg-stone-800 active:scale-95 shadow-xs cursor-pointer"
                    : "bg-stone-200 text-stone-400 cursor-default"
                }`}
                title="Gửi"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
