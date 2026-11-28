import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Heart,
  HelpCircle,
  Info,
  MessageSquare,
  Plus,
  Search,
  Send,
  Settings,
  Share2,
  Sparkles,
  Trash2,
  Users,
  Utensils,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import { CLOUD_ASSETS } from "../../constants/cloudAssets";
import FeatureShell from "./FeatureShell";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";
import {
  INITIAL_ANSWERS,
  INITIAL_QUESTIONS,
} from "./rsvp-builder/constants";

export default function RsvpBuilderPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { wedding } = useCurrentWedding();

  const coupleNames = (wedding?.title || "Trần Thanh Khang & Mai Khanh").normalize("NFC");
  const rsvpSlug = wedding?.slug || "khang-an";
  const rsvpUrl = `${window.location.origin}/rsvp/${rsvpSlug}`;

  const { data: rsvpData, saveSection } = useWeddingFeature(
    wedding,
    "rsvp_config",
    {
      questions: INITIAL_QUESTIONS,
      answers: INITIAL_ANSWERS,
      isRsvpOpen: true,
      requirePassword: false,
      rsvpPassword: "",
      deadlineDate: "2027-08-15",
      thankYouMessage: "Cảm ơn bạn đã phản hồi! Sự hiện diện của bạn là niềm hạnh phúc lớn nhất của gia đình chúng mình.",
    }
  );

  const [activeTab, setActiveTab] = useState("questions"); // questions | responses | catering | settings
  const [responseSearch, setResponseSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | attending | declined
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Modal Add Question
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Lựa chọn (Có / Không)");
  const [newRequired, setNewRequired] = useState(false);

  const questions = useMemo(() => rsvpData.questions || INITIAL_QUESTIONS, [rsvpData.questions]);
  const answers = useMemo(() => rsvpData.answers || INITIAL_ANSWERS, [rsvpData.answers]);
  const isRsvpOpen = rsvpData.isRsvpOpen ?? true;
  const requirePassword = Boolean(rsvpData.requirePassword);
  const rsvpPassword = rsvpData.rsvpPassword || "";
  const deadlineDate = rsvpData.deadlineDate || "2027-08-15";
  const thankYouMessage = rsvpData.thankYouMessage || "Cảm ơn bạn đã phản hồi!";

  // Metrics
  const attendingGuests = useMemo(() => answers.filter((a) => a.attending), [answers]);
  const declinedGuests = useMemo(() => answers.filter((a) => !a.attending), [answers]);
  const totalAttendingSeats = useMemo(
    () => attendingGuests.reduce((sum, a) => sum + 1 + (Number(a.companions) || 0), 0),
    [attendingGuests]
  );
  const awaitingCount = 42;
  const totalGuests = totalAttendingSeats + declinedGuests.length + awaitingCount;
  const responsePct = Math.round(((attendingGuests.length + declinedGuests.length) / Math.max(1, totalGuests)) * 100);

  // Meal breakdown
  const mealBreakdown = useMemo(() => {
    let man = 0;
    let chay = 0;
    let treem = 0;
    for (const a of attendingGuests) {
      const seats = 1 + (Number(a.companions) || 0);
      if (a.meal === "Món chay" || a.allergy?.includes("chay")) {
        chay += seats;
      } else if (a.allergy?.includes("trẻ em")) {
        treem += 1;
        man += seats - 1;
      } else {
        man += seats;
      }
    }
    return { man, chay, treem, total: man + chay + treem };
  }, [attendingGuests]);

  // Filtered answers
  const filteredAnswers = useMemo(() => {
    const q = responseSearch.trim().toLowerCase();
    return answers.filter((a) => {
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "attending" && a.attending) ||
        (statusFilter === "declined" && !a.attending);
      const matchText =
        !q ||
        a.guest.toLowerCase().includes(q) ||
        a.note?.toLowerCase().includes(q) ||
        a.tableGroup?.toLowerCase().includes(q) ||
        a.meal?.toLowerCase().includes(q);
      return matchStatus && matchText;
    });
  }, [answers, responseSearch, statusFilter]);

  const handleCopy = (text, label) => {
    navigator.clipboard?.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  const toggleQuestionActive = (id) => {
    const next = questions.map((q) => (q.id === id ? { ...q, active: !q.active } : q));
    saveSection({ questions: next });
    toast.success("Đã cập nhật trạng thái câu hỏi");
  };

  const handleDeleteQuestion = (id) => {
    const next = questions.filter((q) => q.id !== id);
    saveSection({ questions: next });
    toast.info("Đã xóa câu hỏi khỏi form RSVP");
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const created = {
      id: `q-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      required: newRequired,
      active: true,
      desc: "Câu hỏi tùy chỉnh cho khách mời",
      followUps: [],
    };
    saveSection({ questions: [...questions, created] });
    toast.success("Đã thêm câu hỏi RSVP mới");
    setNewTitle("");
    setIsAddOpen(false);
  };

  const handleExportCsv = () => {
    const headers = "Họ và tên,Trạng thái tham dự,Số người đi cùng,Khẩu phần ăn,Yêu cầu kiêng dị ứng,Nhóm khách,Lời chúc,Thời gian\n";
    const rows = answers
      .map(
        (a) =>
          `"${a.guest}","${a.status}","${a.companions || 0}","${a.meal || ""}","${a.allergy || ""}","${a.tableGroup || ""}","${a.note || ""}","${a.time || ""}"`
      )
      .join("\n");
    const blob = new Blob([`\uFEFF${headers}${rows}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `danh-sach-rsvp-${rsvpSlug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất danh sách phản hồi RSVP ra file CSV");
  };

  return (
    <FeatureShell
      title="Câu hỏi & Phản hồi RSVP"
      subtitle={`Xác nhận tham dự trực tuyến · Điểm danh: ${totalAttendingSeats} khách đã nhận lời`}
      wedding={wedding}
      actions={
        <div className="flex items-center gap-2">
          {/* Toggle trạng thái RSVP */}
          <button
            type="button"
            onClick={() => {
              saveSection({ isRsvpOpen: !isRsvpOpen });
              toast.info(!isRsvpOpen ? "Đã mở cổng nhận phản hồi RSVP" : "Đã tạm đóng cổng nhận RSVP");
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
              isRsvpOpen
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-stone-100 text-stone-600"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isRsvpOpen ? "bg-emerald-600" : "bg-stone-400"}`} />
            <span>{isRsvpOpen ? "Cổng RSVP Đang mở" : "Cổng RSVP Đang đóng"}</span>
          </button>

          {/* Nút gửi nhắc nhở RSVP */}
          <button
            type="button"
            onClick={() =>
              navigate(ROUTE_PATHS.MESSAGING, {
                state: { wedding, draftType: "rsvp" },
              })
            }
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1F1A17] hover:border-[#3B52DE] hover:bg-stone-50 transition"
          >
            <MessageSquare size={13} className="text-[#3B52DE]" /> Gửi nhắc RSVP
          </button>

          {/* Nút Sao chép link */}
          <button
            type="button"
            onClick={() => handleCopy(rsvpUrl, "link RSVP")}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1F1A17] hover:border-[#3B52DE] hover:bg-stone-50 transition"
          >
            <Share2 size={13} /> Chia sẻ
          </button>

          {/* Nút Xem trước form */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1F1A17] px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition shadow-xs active:scale-95"
          >
            <Eye size={13} /> Xem trước form
          </button>
        </div>
      }
    >
      {/* =========================================================================
          HERO OVERVIEW: BẢO CHỨNG TIẾN ĐỘ RSVP & ĐỊNH LƯỢNG MÂM CỖ
         ========================================================================= */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Khối Tiến độ phản hồi */}
        <div className="lg:col-span-7 rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold tracking-wider text-stone-700 uppercase">
                <CheckCircle2 size={13} className="text-emerald-600" /> Tỷ lệ phản hồi khách mời
              </span>
              <span className="text-xs font-semibold text-stone-500">
                Hạn chót: <span className="font-bold text-[#1F1A17]">{deadlineDate}</span>
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1F1A17] tabular-nums">
                {totalAttendingSeats} <span className="text-lg font-normal text-stone-500">ghế tham dự</span>
              </h2>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                {responsePct}% phản hồi
              </span>
            </div>

            <p className="mt-1.5 text-xs text-stone-600">
              Đã nhận phản hồi từ {attendingGuests.length + declinedGuests.length} khách mời · Còn 42 khách đang chờ xác nhận
            </p>

            {/* Thanh tiến trình đa màu */}
            <div className="mt-5 space-y-1.5">
              <div className="h-3 w-full rounded-full bg-stone-100 overflow-hidden flex">
                <div
                  className="h-full bg-[#1F1A17] transition-all duration-500"
                  style={{ width: `${Math.max(10, Math.round((totalAttendingSeats / totalGuests) * 100))}%` }}
                  title="Tham dự"
                />
                <div
                  className="h-full bg-stone-400 transition-all duration-500"
                  style={{ width: `${Math.round((declinedGuests.length / totalGuests) * 100)}%` }}
                  title="Từ chối"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1.5 font-medium text-[#1F1A17]">
                  <span className="h-2 w-2 rounded-full bg-[#1F1A17]" />
                  <span>Sẽ tham dự ({totalAttendingSeats} người)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-stone-400" />
                  <span>Bận không đến ({declinedGuests.length} người)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-stone-200" />
                  <span>Chưa trả lời ({awaitingCount} người)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 pt-4 border-t border-stone-100 text-xs">
            <button
              type="button"
              onClick={() => handleCopy(rsvpUrl, "link RSVP")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-1.5 font-semibold text-stone-700 hover:bg-stone-100 transition"
            >
              <Copy size={13} /> Sao chép link form RSVP
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(ROUTE_PATHS.MESSAGING, {
                  state: { wedding, draftType: "rsvp" },
                })
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-1.5 font-semibold text-stone-700 hover:bg-stone-100 transition"
            >
              <Send size={13} /> Gửi tin nhắn nhắc 42 khách chưa trả lời
            </button>
          </div>
        </div>

        {/* Khối Tóm tắt Thực đơn tiệc cưới */}
        <div className="lg:col-span-5 rounded-3xl border border-stone-200 bg-stone-50/70 p-6 sm:p-7 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Định lượng suất ăn nhà hàng
              </span>
              <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-[11px] font-bold text-stone-700">
                Ước tính {Math.ceil(mealBreakdown.total / 10)} bàn tiệc
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5 text-center">
                <Utensils size={18} className="mx-auto text-amber-600 mb-1" />
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Món Mặn</span>
                <span className="text-xl font-bold text-[#1F1A17] tabular-nums">{mealBreakdown.man}</span>
                <span className="text-[10px] text-stone-400 block">suất</span>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-3.5 text-center">
                <Sparkles size={18} className="mx-auto text-emerald-600 mb-1" />
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Ăn Chay</span>
                <span className="text-xl font-bold text-[#1F1A17] tabular-nums">{mealBreakdown.chay}</span>
                <span className="text-[10px] text-stone-400 block">suất</span>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-3.5 text-center">
                <Heart size={18} className="mx-auto text-purple-600 mb-1" />
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Trẻ Em</span>
                <span className="text-xl font-bold text-[#1F1A17] tabular-nums">{mealBreakdown.treem}</span>
                <span className="text-[10px] text-stone-400 block">suất</span>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-3.5 text-xs space-y-1">
              <span className="font-semibold text-[#1F1A17] flex items-center gap-1.5">
                <Info size={14} className="text-[#3B52DE]" /> Lưu ý kiêng kỵ ẩm thực:
              </span>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Có 2 khách kiêng hải sản có vỏ, 1 khách ăn thuần chay không hành tỏi.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs">
            <span className="text-stone-500">Khẩu phần đã chốt: {mealBreakdown.total} suất</span>
            <button
              type="button"
              onClick={() => setActiveTab("catering")}
              className="font-semibold text-[#3B52DE] hover:underline"
            >
              Chi tiết thực đơn →
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB NAVIGATION CÂN ĐỐI
         ========================================================================= */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "questions", label: "Câu hỏi khảo sát RSVP", count: questions.length, icon: HelpCircle },
            { key: "responses", label: "Danh sách phản hồi", count: answers.length, icon: Users },
            { key: "catering", label: "Định lượng thực đơn & Bàn tiệc", count: null, icon: Utensils },
            { key: "settings", label: "Cài đặt & Hạn chót", count: null, icon: Settings },
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

        {activeTab === "questions" && (
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1F1A17] px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition shadow-xs cursor-pointer active:scale-95"
          >
            <Plus size={14} /> Thêm câu hỏi
          </button>
        )}

        {activeTab === "responses" && (
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
          TAB 1: CÂU HỎI KHẢO SÁT RSVP (2 CỘT: DANH SÁCH CÂU HỎI & LIVE PREVIEW FORM)
         ========================================================================= */}
      {activeTab === "questions" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI: DANH SÁCH CÂU HỎI */}
          <div className="lg:col-span-7 space-y-4">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={`rounded-3xl border bg-white p-5 sm:p-6 shadow-2xs transition-all ${
                  q.active ? "border-stone-200" : "border-stone-200/60 opacity-60 bg-stone-50/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 font-bold text-xs text-[#1F1A17]">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-[#1F1A17]">{q.title}</h4>
                        {q.required && (
                          <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[9px] font-bold text-stone-600 uppercase">
                            Bắt buộc
                          </span>
                        )}
                        <span className="rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
                          {q.type}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-stone-500">{q.desc}</p>
                    </div>
                  </div>

                  {/* Switch Bật/Tắt câu hỏi */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleQuestionActive(q.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                        q.active ? "bg-[#1F1A17]" : "bg-stone-300"
                      }`}
                      title={q.active ? "Tắt câu hỏi này" : "Bật câu hỏi này"}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          q.active ? "translate-x-4.5" : "translate-x-1"
                        }`}
                      />
                    </button>
                    {!q.required && (
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition rounded-lg"
                        title="Xóa câu hỏi"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Các câu hỏi phụ đi kèm (Follow-up logic) */}
                {q.followUps && q.followUps.length > 0 && (
                  <div className="mt-4 pt-3.5 border-t border-stone-100">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                      Logic câu hỏi đi kèm (Nếu khách chọn Có tham dự):
                    </span>
                    <div className="space-y-1.5 pl-3 border-l-2 border-stone-200">
                      {q.followUps.map((fu, fidx) => (
                        <p key={fidx} className="text-xs text-stone-600 flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-stone-400" />
                          <span>{fu}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CỘT PHẢI: MÔ PHỎNG LIVE FORM RSVP TRÊN ĐIỆN THOẠI */}
          <div className="lg:col-span-5 space-y-4 sticky top-20">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#1F1A17]">Mô phỏng biểu mẫu khách điền</span>
              <span className="text-[11px] text-stone-400">Live Preview</span>
            </div>

            {/* MOCKUP IPHONE */}
            <div className="mx-auto w-full max-w-[340px] rounded-[40px] border-[6px] border-[#1F1A17] bg-white p-3 shadow-xl overflow-hidden">
              <div className="mx-auto mb-3 h-4 w-24 rounded-full bg-[#1F1A17]" />

              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white text-xs">
                <img
                  src={CLOUD_ASSETS.RSVP_ARCH_029}
                  alt="Wedding"
                  className="h-32 w-full object-cover object-top"
                />
                <div className="p-4 space-y-4">
                  <div className="text-center">
                    <span className="font-display italic text-lg font-bold text-[#1F1A17]">
                      .EverWeb
                    </span>
                    <h4 className="mt-1 text-sm font-bold text-[#1F1A17]">
                      Xác nhận tham dự hôn lễ
                    </h4>
                    <p className="mt-0.5 text-[10px] text-stone-500">
                      {coupleNames}
                    </p>
                  </div>

                  {/* Mô phỏng câu hỏi 1 */}
                  <div className="rounded-xl border border-stone-200 p-3 space-y-2 bg-stone-50">
                    <p className="font-bold text-[#1F1A17] text-[11px]">
                      Bạn có thể đến chung vui cùng chúng mình không? *
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-[#1F1A17] text-white py-1.5 font-semibold text-[11px] shadow-2xs"
                      >
                        Vui vẻ nhận lời
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-stone-200 bg-white text-stone-600 py-1.5 font-medium text-[11px]"
                      >
                        Rất tiếc không thể
                      </button>
                    </div>
                  </div>

                  {/* Mô phỏng câu hỏi 2 */}
                  <div className="rounded-xl border border-stone-200 p-3 space-y-2 bg-stone-50">
                    <p className="font-bold text-[#1F1A17] text-[11px]">
                      Chọn khẩu phần ăn tiệc cưới
                    </p>
                    <div className="flex gap-2">
                      <span className="flex-1 text-center py-1 rounded-md border border-[#1F1A17] bg-white font-semibold text-[10px] text-[#1F1A17]">
                        Món mặn
                      </span>
                      <span className="flex-1 text-center py-1 rounded-md border border-stone-200 bg-white font-medium text-[10px] text-stone-600">
                        Ăn chay
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-xl bg-[#1F1A17] py-2.5 text-xs font-semibold text-white shadow-xs"
                  >
                    Gửi phản hồi RSVP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: DANH SÁCH PHẢN HỒI RSVP (RESPONSES TABLE)
         ========================================================================= */}
      {activeTab === "responses" && (
        <div className="space-y-5">
          {/* Thanh tìm kiếm & Bộ lọc */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-stone-200 bg-white p-4 sm:p-5 shadow-2xs">
            <div className="relative flex-1 min-w-[260px]">
              <Search
                size={14}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                value={responseSearch}
                onChange={(e) => setResponseSearch(e.target.value)}
                placeholder="Tìm tên khách, nhóm khách hoặc món ăn..."
                className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pr-4 pl-9 text-xs text-[#1F1A17] outline-none focus:border-[#3B52DE]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-stone-400 text-[11px] font-medium hidden sm:inline">Trạng thái:</span>
              {[
                { key: "all", label: "Tất cả" },
                { key: "attending", label: "Tham dự" },
                { key: "declined", label: "Từ chối" },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setStatusFilter(f.key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    statusFilter === f.key
                      ? "bg-[#1F1A17] text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200/70"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bảng dữ liệu phản hồi */}
          <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-2xs">
            <table className="min-w-full divide-y divide-stone-100 text-xs">
              <thead className="bg-stone-50 text-left font-semibold text-stone-700">
                <tr>
                  <th className="px-5 py-3.5">Khách mời</th>
                  <th className="px-5 py-3.5">Xác nhận tham dự</th>
                  <th className="px-5 py-3.5 text-center">Người đi cùng</th>
                  <th className="px-5 py-3.5">Thực đơn chọn</th>
                  <th className="px-5 py-3.5">Kiêng dị ứng</th>
                  <th className="px-5 py-3.5">Lời chúc mừng</th>
                  <th className="px-5 py-3.5 text-right">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredAnswers.map((a) => (
                  <tr key={a.id} className="hover:bg-stone-50/70 transition">
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#1F1A17]">{a.guest}</p>
                      <span className="inline-block mt-0.5 rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
                        {a.tableGroup}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          a.attending
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${a.attending ? "bg-emerald-600" : "bg-stone-400"}`} />
                        <span>{a.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-[#1F1A17]">
                      {a.companions > 0 ? `+${a.companions}` : "Đi 1 mình"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-stone-800">{a.meal}</span>
                    </td>
                    <td className="px-5 py-4 text-stone-500">
                      {a.allergy}
                    </td>
                    <td className="px-5 py-4 text-stone-600 italic max-w-xs truncate" title={a.note}>
                      "{a.note || "—"}"
                    </td>
                    <td className="px-5 py-4 text-right text-stone-400 text-[11px] whitespace-nowrap">
                      {a.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ĐỊNH LƯỢNG THỰC ĐƠN & BÀN TIỆC
         ========================================================================= */}
      {activeTab === "catering" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Utensils size={20} />
              </div>
              <h4 className="text-base font-bold text-[#1F1A17]">Suất Tiệc Mặn Tiêu Chuẩn</h4>
              <p className="text-2xl font-bold text-[#1F1A17] tabular-nums">
                {mealBreakdown.man} <span className="text-xs font-normal text-stone-500">suất chính</span>
              </p>
              <p className="text-xs text-stone-500 leading-relaxed">
                Áp dụng thực đơn 6 món cao cấp đã chọn tại Sảnh Hoa Mai.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Sparkles size={20} />
              </div>
              <h4 className="text-base font-bold text-[#1F1A17]">Suất Thực Đơn Chay</h4>
              <p className="text-2xl font-bold text-[#1F1A17] tabular-nums">
                {mealBreakdown.chay} <span className="text-xs font-normal text-stone-500">suất chay</span>
              </p>
              <p className="text-xs text-stone-500 leading-relaxed">
                Được chuẩn bị mâm tiệc chay riêng biệt, không dùng ngũ vị tân.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Users size={20} />
              </div>
              <h4 className="text-base font-bold text-[#1F1A17]">Suất Trẻ Em & Dự Phòng</h4>
              <p className="text-2xl font-bold text-[#1F1A17] tabular-nums">
                {mealBreakdown.treem + 10} <span className="text-xs font-normal text-stone-500">suất dự phòng</span>
              </p>
              <p className="text-xs text-stone-500 leading-relaxed">
                Nhà hàng giữ 1 bàn dự phòng (10 ghế) sẵn sàng phục vụ khách phát sinh.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs space-y-4">
            <h4 className="text-sm font-bold text-[#1F1A17]">Gợi ý sắp xếp bàn tiệc (10 người / bàn):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="rounded-2xl border border-stone-200 p-4 bg-stone-50">
                <span className="font-bold text-[#1F1A17] block">Bàn tiệc Họ hàng nhà trai</span>
                <span className="text-stone-500 text-[11px] mt-1 block">4 bàn · 40 khách</span>
              </div>
              <div className="rounded-2xl border border-stone-200 p-4 bg-stone-50">
                <span className="font-bold text-[#1F1A17] block">Bàn tiệc Họ hàng nhà gái</span>
                <span className="text-stone-500 text-[11px] mt-1 block">4 bàn · 40 khách</span>
              </div>
              <div className="rounded-2xl border border-stone-200 p-4 bg-stone-50">
                <span className="font-bold text-[#1F1A17] block">Bàn Bạn bè & Đồng nghiệp</span>
                <span className="text-stone-500 text-[11px] mt-1 block">5 bàn · 50 khách</span>
              </div>
              <div className="rounded-2xl border border-stone-200 p-4 bg-stone-50">
                <span className="font-bold text-[#1F1A17] block">Bàn Tiệc Chay & Trẻ em</span>
                <span className="text-stone-500 text-[11px] mt-1 block">1 bàn riêng · 10 khách</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CÀI ĐẶT & HẠN CHÓT RSVP
         ========================================================================= */}
      {activeTab === "settings" && (
        <div className="max-w-2xl rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xs space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-[#1F1A17]">Cài đặt & Bảo mật cổng RSVP</h3>
            <p className="mt-0.5 text-stone-500">Quản lý ngày hết hạn và mật khẩu bảo mật danh sách khách mời</p>
          </div>

          <div className="space-y-4">
            {/* Hạn chót */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block">Ngày hạn chót nhận phản hồi RSVP</label>
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => {
                  saveSection({ deadlineDate: e.target.value });
                  toast.success("Đã cập nhật ngày hạn chót");
                }}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 font-medium outline-none focus:border-[#3B52DE]"
              />
            </div>

            {/* Khóa mật khẩu */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#1F1A17] block">Yêu cầu mã PIN / Mật khẩu truy cập</span>
                  <span className="text-stone-500 text-[11px]">Chỉ những khách được cung cấp mã mới có thể điền form RSVP</span>
                </div>
                <input
                  type="checkbox"
                  checked={requirePassword}
                  onChange={(e) => {
                    saveSection({ requirePassword: e.target.checked });
                    toast.info(e.target.checked ? "Đã bật mật khẩu RSVP" : "Đã tắt mật khẩu RSVP");
                  }}
                  className="h-4 w-4 rounded-sm border-stone-300 accent-[#1F1A17]"
                />
              </div>

              {requirePassword && (
                <div className="pt-2">
                  <input
                    type="text"
                    value={rsvpPassword}
                    onChange={(e) => saveSection({ rsvpPassword: e.target.value })}
                    placeholder="Nhập mã PIN (VD: 2027)"
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 font-mono text-xs outline-none focus:border-[#3B52DE]"
                  />
                </div>
              )}
            </div>

            {/* Thông điệp cảm ơn sau khi gửi */}
            <div className="pt-2 border-t border-stone-100 space-y-1.5">
              <label className="font-semibold text-stone-700 block">Lời cảm ơn sau khi khách gửi RSVP thành công</label>
              <textarea
                rows={3}
                value={thankYouMessage}
                onChange={(e) => saveSection({ thankYouMessage: e.target.value })}
                className="w-full rounded-xl border border-stone-200 p-3 leading-relaxed outline-none focus:border-[#3B52DE]"
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: THÊM CÂU HỎI RSVP MỚI
         ========================================================================= */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Thêm câu hỏi RSVP mới"
        size="sm"
      >
        <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Tiêu đề câu hỏi *</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="VD: Bạn có cần hỗ trợ xe đưa đón không?"
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-[#3B52DE]"
              autoFocus
            />
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Loại câu trả lời</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-[#3B52DE]"
            >
              <option value="Lựa chọn (Có / Không)">Lựa chọn (Có / Không)</option>
              <option value="Chọn thực đơn (Mặn / Chay)">Chọn thực đơn (Mặn / Chay)</option>
              <option value="Số lượng người">Số lượng người</option>
              <option value="Điền văn bản tự do">Điền văn bản tự do</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="newReq"
              checked={newRequired}
              onChange={(e) => setNewRequired(e.target.checked)}
              className="h-4 w-4 rounded-sm border-stone-300 accent-[#1F1A17]"
            />
            <label htmlFor="newReq" className="text-xs font-semibold text-stone-800 cursor-pointer">
              Đánh dấu là câu hỏi bắt buộc trả lời
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#1F1A17] px-5 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition"
            >
              Thêm câu hỏi
            </button>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          MODAL: XEM TRƯỚC FORM RSVP HOÀN CHỈNH
         ========================================================================= */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Xem trước Form RSVP khách mời"
        size="sm"
      >
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white text-xs">
          <img
            src={CLOUD_ASSETS.RSVP_ARCH_029}
            alt="Cover"
            className="h-36 w-full object-cover object-top"
          />
          <div className="p-5 space-y-4">
            <div className="text-center">
              <span className="font-display italic text-lg font-bold text-[#1F1A17]">
                .EverWeb
              </span>
              <h4 className="mt-1 text-sm font-bold text-[#1F1A17]">
                Xác nhận tham dự hôn lễ
              </h4>
              <p className="mt-0.5 text-[11px] text-stone-500">
                {coupleNames}
              </p>
            </div>

            {questions
              .filter((q) => q.active)
              .map((q) => (
                <div key={q.id} className="rounded-xl border border-stone-200 bg-stone-50 p-3 space-y-1.5">
                  <label className="font-bold text-[#1F1A17] text-[11px] block">
                    {q.title} {q.required && <span className="text-rose-500">*</span>}
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="Khách mời sẽ chọn hoặc điền tại đây..."
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-400"
                  />
                </div>
              ))}

            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="w-full rounded-xl bg-[#1F1A17] py-2.5 text-xs font-semibold text-white shadow-xs"
            >
              Đóng xem trước
            </button>
          </div>
        </div>
      </Modal>
    </FeatureShell>
  );
}
