import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Check,
  CheckCircle2,
  Clock,
  HelpCircle,
  Lock,
  Plus,
  Search,
  Send,
  Settings,
  Share2,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Modal, useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import FeatureShell from "./FeatureShell";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";

const INITIAL_QUESTIONS = [
  {
    id: "q1",
    title: "Bạn có thể đến chung vui cùng chúng mình không?",
    type: "Lựa chọn (Có / Không)",
    required: true,
    active: true,
    followUps: [
      "Chọn thực đơn (Mặn / Chay / Kiêng dị ứng)",
      "Bạn có cần hỗ trợ đặt phòng khách sạn gần sảnh không?",
      "Lời chúc gửi đến cô dâu & chú rể",
    ],
  },
  {
    id: "q2",
    title: "Số lượng người đi cùng bạn (bao gồm trẻ em)?",
    type: "Số lượng",
    required: true,
    active: true,
    followUps: [],
  },
  {
    id: "q3",
    title: "Bạn có tham dự tiệc tối thân mật trước ngày cưới không?",
    type: "Lựa chọn",
    required: false,
    active: false,
    followUps: [],
  },
];

const SAMPLE_ANSWERS = [
  { id: "a1", guest: "Nguyễn Thị Lan", status: "Vui vẻ nhận lời", meal: "Mặn", companions: 1, note: "Chúc hai bạn trăm năm hạnh phúc!" },
  { id: "a2", guest: "Trần Văn Minh", status: "Vui vẻ nhận lời", meal: "Ăn chay", companions: 2, note: "Sẽ có mặt đúng giờ" },
  { id: "a3", guest: "Nguyễn Văn Hùng", status: "Tiếc quá không dự được", meal: "—", companions: 0, note: "Chúc mừng hai em nhé!" },
];

export default function RsvpBuilderPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { wedding } = useCurrentWedding();

  const { data: rsvpData, saveSection } = useWeddingFeature(
    wedding,
    "rsvp_config",
    {
      questions: INITIAL_QUESTIONS,
      answers: SAMPLE_ANSWERS,
      isRsvpOpen: true,
      requirePassword: false,
      rsvpPassword: "",
    }
  );

  const [tab, setTab] = useState("questions");
  const [browseMode, setBrowseMode] = useState("guest");
  const [responseSearch, setResponseSearch] = useState("");
  const questions = rsvpData.questions || INITIAL_QUESTIONS;
  const answers = useMemo(
    () => rsvpData.answers || SAMPLE_ANSWERS,
    [rsvpData.answers]
  );
  const isRsvpOpen = rsvpData.isRsvpOpen ?? true;
  const requirePassword = Boolean(rsvpData.requirePassword);
  const rsvpPassword = rsvpData.rsvpPassword || "";
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Lựa chọn");

  const attendingCount = answers.filter(
    (a) => a.status === "Vui vẻ nhận lời"
  ).length;
  const declinedCount = answers.filter(
    (a) => a.status !== "Vui vẻ nhận lời"
  ).length;
  const awaitingCount = 9;
  const totalGuests = attendingCount + declinedCount + awaitingCount;
  const respondedPct = Math.round(
    ((attendingCount + declinedCount) / Math.max(1, totalGuests)) * 100
  );

  const mealCounts = useMemo(() => {
    const counts = { "Mặn": 0, "Ăn chay": 0, "Trẻ em": 0 };
    for (const a of answers) {
      if (a.meal === "Mặn") counts["Mặn"] += 1 + (a.companions || 0);
      else if (a.meal === "Ăn chay") counts["Ăn chay"] += 1 + (a.companions || 0);
    }
    return counts;
  }, [answers]);

  const filteredAnswers = useMemo(() => {
    const q = responseSearch.trim().toLowerCase();
    return q
      ? answers.filter(
          (a) =>
            a.guest.toLowerCase().includes(q) ||
            a.note.toLowerCase().includes(q)
        )
      : answers;
  }, [answers, responseSearch]);

  const setQuestions = (updater) =>
    saveSection((prev) => ({
      ...prev,
      questions:
        typeof updater === "function"
          ? updater(prev.questions || INITIAL_QUESTIONS)
          : updater,
    }));
  const setIsRsvpOpen = (fn) =>
    saveSection((prev) => ({
      ...prev,
      isRsvpOpen: typeof fn === "function" ? fn(prev.isRsvpOpen ?? true) : fn,
    }));
  const setRequirePassword = (val) => saveSection({ requirePassword: val });
  const setRsvpPassword = (val) => saveSection({ rsvpPassword: val });

  const toggleActive = (id) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        title: newTitle.trim(),
        type: newType,
        required: false,
        active: true,
        followUps: [],
      },
    ]);
    toast.success("Đã thêm câu hỏi RSVP mới");
    setNewTitle("");
    setIsAddOpen(false);
  };

  return (
    <FeatureShell
      title="Câu hỏi & Phản hồi RSVP"
      subtitle="Tuỳ chỉnh form xác nhận tham dự gửi cho khách mời"
      wedding={wedding}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsRsvpOpen((p) => !p);
              toast.info(isRsvpOpen ? "Đã tạm đóng cổng RSVP" : "Đã mở cổng RSVP");
            }}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              isRsvpOpen
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isRsvpOpen ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {isRsvpOpen ? "RSVP Đang mở" : "RSVP Đã đóng"}
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(
                `https://everwed.vn/${wedding?.slug || "khang-an"}/rsvp`
              );
              toast.success("Đã sao chép đường dẫn RSVP");
            }}
            className="hidden items-center gap-1.5 rounded-full border border-[#E2D9CB] bg-white px-3 py-1.5 text-xs font-semibold text-[#2C2117] hover:border-[#3B52DE] sm:inline-flex"
          >
            <Share2 size={13} /> Chia sẻ
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#3B52DE] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2F43C2]"
          >
            <Plus size={14} /> Thêm câu hỏi
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left WithJoy RSVP Sidebar */}
        <aside className="rounded-2xl border border-[#E6DFD3] bg-white p-2.5 lg:col-span-2">
          <nav className="flex flex-row gap-1 lg:flex-col">
            {[
              {
                key: "questions",
                label: `Câu hỏi (${questions.filter((q) => q.active).length})`,
                icon: HelpCircle,
              },
              {
                key: "responses",
                label: `Phản hồi (${answers.length})`,
                icon: Users,
              },
              { key: "activity", label: "Hoạt động", icon: Activity },
              { key: "settings", label: "Cài đặt RSVP", icon: Settings },
            ].map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${
                    active
                      ? "bg-[#EEF2FF] text-[#3B52DE]"
                      : "text-[#5E5042] hover:bg-[#FAF8F5]"
                  }`}
                >
                  <Icon size={14} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="lg:col-span-10">

      {tab === "questions" ? (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className={`rounded-2xl border bg-white p-5 ${
                q.active ? "border-[#E6DFD3]" : "border-dashed border-[#D6CFC4] opacity-70"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-[#3B52DE]">
                    Câu {index + 1} · {q.type}
                  </span>
                  <h3 className="mt-1 text-sm font-bold text-[#2C2117]">
                    {q.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleActive(q.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      q.active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {q.active ? "Đang bật" : "Đang ẩn"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuestions((prev) => prev.filter((i) => i.id !== q.id));
                      toast.info("Đã xoá câu hỏi");
                    }}
                    aria-label="Xoá câu hỏi"
                    className="rounded-lg p-1.5 text-[#8C7A68] hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {q.followUps.length > 0 && (
                <div className="mt-4 rounded-xl border border-[#EFEAE1] bg-[#FAF8F5] p-3.5">
                  <p className="text-[11px] font-semibold text-[#6D5B4B]">
                    Nếu khách chọn &ldquo;Vui vẻ nhận lời&rdquo; sẽ hỏi thêm:
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-[#2C2117]">
                    {q.followUps.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-[#3B52DE]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : tab === "responses" ? (
        <div className="space-y-5">
          {/* At a Glance (WithJoy RSVP Answers Summary) */}
          <div className="rounded-2xl border border-[#E6DFD3] bg-white p-5">
            <h3 className="text-base font-bold text-[#2C2117]">
              Tổng quan phản hồi (At a Glance)
            </h3>
            <div className="mt-4 grid grid-cols-1 divide-y divide-[#F1ECE3] rounded-2xl border border-[#EFEAE1] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="p-4 text-center">
                <Check size={16} className="mx-auto text-[#3B52DE]" />
                <p className="mt-1 text-2xl font-bold text-[#3B52DE]">
                  {attendingCount}
                </p>
                <p className="text-[11px] text-[#7D6D5E]">Khách tham dự</p>
              </div>
              <div className="p-4 text-center">
                <X size={16} className="mx-auto text-rose-500" />
                <p className="mt-1 text-2xl font-bold text-rose-500">
                  {declinedCount}
                </p>
                <p className="text-[11px] text-[#7D6D5E]">Không tham dự</p>
              </div>
              <div className="p-4 text-center">
                <Clock size={16} className="mx-auto text-[#5E5042]" />
                <p className="mt-1 text-2xl font-bold text-[#2C2117]">
                  {awaitingCount}
                </p>
                <p className="text-[11px] text-[#7D6D5E]">Chờ phản hồi</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#FAF8F5] px-4 py-3 text-xs">
              <span className="text-[#5E5042]">
                Còn <b>{awaitingCount} khách mời</b> chưa xác nhận RSVP.
              </span>
              <button
                type="button"
                onClick={() =>
                  navigate(ROUTE_PATHS.MESSAGING, { state: { wedding } })
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-[#3B52DE] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2F43C2]"
              >
                <Send size={12} /> Tạo lời nhắc RSVP
              </button>
            </div>

            <div className="mt-3">
              <div className="mb-1 flex justify-between text-[11px] text-[#8C7A68]">
                <span>{respondedPct}% đã phản hồi</span>
                <span>
                  {attendingCount + declinedCount}/{totalGuests} khách
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#EFEAE1]">
                <div
                  className="h-full rounded-full bg-[#3B52DE]"
                  style={{ width: `${respondedPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Meal & Question Breakdown */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#E6DFD3] bg-white p-5">
              <h4 className="text-sm font-bold text-[#2C2117]">
                Thực đơn tiệc cưới
              </h4>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  { label: "Thực đơn Mặn", val: mealCounts["Mặn"], color: "bg-[#3B52DE]" },
                  { label: "Thực đơn Chay", val: mealCounts["Ăn chay"], color: "bg-emerald-500" },
                  { label: "Suất trẻ em", val: mealCounts["Trẻ em"], color: "bg-amber-500" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between rounded-xl border border-[#F1ECE3] px-3.5 py-2.5"
                  >
                    <span className="flex items-center gap-2 font-medium text-[#2C2117]">
                      <span className={`h-2.5 w-2.5 rounded-full ${m.color}`} />
                      {m.label}
                    </span>
                    <span className="font-bold tabular-nums">{m.val} suất</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#E6DFD3] bg-white p-5">
              <h4 className="text-sm font-bold text-[#2C2117]">
                Duyệt phản hồi (Browse Responses)
              </h4>
              <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-[#FAF8F5] p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setBrowseMode("guest")}
                  className={`rounded-lg py-1.5 ${
                    browseMode === "guest"
                      ? "bg-white text-[#2C2117] shadow-2xs"
                      : "text-[#8C7A68]"
                  }`}
                >
                  Theo Khách mời
                </button>
                <button
                  type="button"
                  onClick={() => setBrowseMode("question")}
                  className={`rounded-lg py-1.5 ${
                    browseMode === "question"
                      ? "bg-white text-[#2C2117] shadow-2xs"
                      : "text-[#8C7A68]"
                  }`}
                >
                  Theo Câu hỏi
                </button>
              </div>
              <div className="relative mt-3">
                <Search
                  size={13}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9C8B7A]"
                />
                <input
                  type="text"
                  value={responseSearch}
                  onChange={(e) => setResponseSearch(e.target.value)}
                  placeholder="Tìm tên khách mời hoặc lời chúc..."
                  className="w-full rounded-full border border-[#E2D9CB] bg-[#FAF8F5] py-2 pr-3 pl-8 text-xs outline-none focus:border-[#3B52DE]"
                />
              </div>
            </div>
          </div>

          {/* Responses Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E6DFD3] bg-white">
            <table className="min-w-full divide-y divide-[#F1ECE3] text-xs">
              <thead className="bg-[#FAF8F5] text-left font-semibold text-[#5E5042]">
                <tr>
                  <th className="px-4 py-3">Khách mời</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Thực đơn</th>
                  <th className="px-4 py-3 text-right">Đi cùng</th>
                  <th className="px-4 py-3">Lời nhắn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1ECE3]">
                {filteredAnswers.map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-3 font-semibold text-[#2C2117]">
                      {a.guest}
                    </td>
                    <td className="px-4 py-3">{a.status}</td>
                    <td className="px-4 py-3">{a.meal}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {a.companions}
                    </td>
                    <td className="px-4 py-3 text-[#6D5B4B]">{a.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : tab === "activity" ? (
        <div className="space-y-3 rounded-2xl border border-[#E6DFD3] bg-white p-5">
          <h3 className="text-sm font-bold text-[#2C2117]">
            Lịch sử phản hồi gần đây
          </h3>
          {SAMPLE_ANSWERS.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-[#EFEAE1] bg-[#FAF8F5] px-4 py-3 text-xs"
            >
              <div>
                <span className="font-semibold text-[#2C2117]">{a.guest}</span>{" "}
                <span className="text-[#6D5B4B]">đã phản hồi: {a.status}</span>
              </div>
              <span className="text-[11px] text-[#8C7A68]">Vừa xong</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-xl space-y-4 rounded-2xl border border-[#E6DFD3] bg-white p-5">
          <h3 className="text-sm font-bold text-[#2C2117]">
            Cài đặt bảo mật & Cổng RSVP
          </h3>
          <label className="flex items-center justify-between rounded-xl border border-[#EFEAE1] bg-[#FAF8F5] p-3.5 text-xs">
            <span className="inline-flex items-center gap-2 font-medium text-[#2C2117]">
              <Lock size={14} className="text-[#3B52DE]" />
              Yêu cầu mật khẩu khi khách xác nhận RSVP
            </span>
            <input
              type="checkbox"
              checked={requirePassword}
              onChange={(e) => setRequirePassword(e.target.checked)}
              className="h-4 w-4 accent-[#3B52DE]"
            />
          </label>
          {requirePassword && (
            <input
              type="text"
              value={rsvpPassword}
              onChange={(e) => setRsvpPassword(e.target.value)}
              placeholder="Nhập mã bảo mật (VD: KHANGAN2027)"
              className="w-full rounded-xl border border-[#E2D9CB] px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
            />
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => toast.success("Đã lưu cài đặt RSVP")}
              className="rounded-xl bg-[#3B52DE] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2F43C2]"
            >
              Lưu cài đặt
            </button>
          </div>
        </div>
      )}
        </div>
      </div>

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Thêm câu hỏi RSVP"
        size="sm"
      >
        <form onSubmit={handleAdd} className="space-y-3.5">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Nội dung câu hỏi
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ví dụ: Bạn có dị ứng thực phẩm nào không?"
              className="w-full rounded-xl border border-[#E2D9CB] px-3 py-2 text-sm outline-none focus:border-[#3B52DE]"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5E5042]">
              Kiểu trả lời
            </label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full rounded-xl border border-[#E2D9CB] px-3 py-2 text-sm outline-none focus:border-[#3B52DE]"
            >
              <option value="Lựa chọn">Lựa chọn (Trắc nghiệm)</option>
              <option value="Văn bản ngắn">Văn bản ngắn</option>
              <option value="Số lượng">Số lượng</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="rounded-lg border border-[#E2D9CB] px-4 py-2 text-xs font-medium"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#3B52DE] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2F43C2]"
            >
              Thêm
            </button>
          </div>
        </form>
      </Modal>
    </FeatureShell>
  );
}
