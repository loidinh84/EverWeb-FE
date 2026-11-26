import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Heart,
  Mail,
  User,
  Utensils,
  Sparkles,
  X,
  MessageSquareHeart,
} from "lucide-react";
import weddingApi from "../../services/weddingApi";
import useToast from "./Toast/useToast";

const COMPANION_OPTIONS = [
  { value: 0, label: "Đi một mình" },
  { value: 1, label: "+1 Người đi cùng" },
  { value: 2, label: "+2 Người đi cùng" },
  { value: 3, label: "+3 Người (Gia đình)" },
];

export default function PublicRsvpModal({ isOpen, onClose, wedding }) {
  const toast = useToast();

  const coupleNames = (
    wedding?.title || "Trần Thanh Khang & Mai Khanh"
  ).normalize("NFC");

  const displayDate = wedding?.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("vi-VN")
    : "23/08/2027";

  const displayVenue = (
    wedding?.venue_name || "Sảnh Hoa Mai - TP. Hồ Chí Minh"
  ).normalize("NFC");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    side: "Bạn bè",
    attendance: "attending", // "attending" | "declined"
    companions: 0,
    meal: "Món mặn truyền thống",
    allergy: "",
    attendCocktail: true,
    needsSupport: false,
    wishes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên của bạn");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại để ban tổ chức liên hệ");
      return;
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error("Vui lòng nhập đúng định dạng email (VD: name@domain.com)");
      return;
    }

    setIsSubmitting(true);
    try {
      const isAttending = form.attendance === "attending";
      const statusText = isAttending ? "Vui vẻ nhận lời" : "Tiếc quá không dự được";
      const rsvpStatus = isAttending ? "Tham dự" : "Từ chối";

      // 1. Chuẩn bị bản ghi câu trả lời RSVP
      const newAnswer = {
        id: `ans-${Date.now()}`,
        guest: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        status: statusText,
        attending: isAttending,
        companions: isAttending ? Number(form.companions) || 0 : 0,
        meal: isAttending ? form.meal : "—",
        allergy: form.allergy.trim() || "Không",
        tableGroup: form.side || "Bạn bè",
        note: form.wishes.trim() || "Chúc hai bạn trăm năm hạnh phúc!",
        time: "Vừa xong",
      };

      const weddingId = wedding?.id;
      let currentFeatures = {};
      if (weddingId) {
        try {
          currentFeatures = (await weddingApi.getFeatures(weddingId)) || {};
        } catch {
          currentFeatures = {};
        }
      }

      // 2. Cập nhật rsvp_config
      const existingAnswers = Array.isArray(currentFeatures?.rsvp_config?.answers)
        ? currentFeatures.rsvp_config.answers
        : [];
      const nextAnswers = [newAnswer, ...existingAnswers];

      if (weddingId) {
        await weddingApi.updateFeatureSection(weddingId, "rsvp_config", {
          answers: nextAnswers,
        });
      }

      // 3. Cập nhật vào Danh sách khách mời (collect_contacts.guestList)
      const existingGuests = Array.isArray(currentFeatures?.collect_contacts?.guestList)
        ? currentFeatures.collect_contacts.guestList
        : [];

      const normalizedName = form.fullName.trim().toLowerCase();
      const existingGuestIndex = existingGuests.findIndex(
        (g) =>
          `${g.lastName} ${g.firstName}`.toLowerCase().trim() === normalizedName ||
          (g.phone && g.phone === form.phone.trim())
      );

      let nextGuests = [...existingGuests];
      if (existingGuestIndex >= 0) {
        nextGuests[existingGuestIndex] = {
          ...nextGuests[existingGuestIndex],
          rsvp: rsvpStatus,
          companions: isAttending ? Number(form.companions) || 0 : 0,
          side: form.side || nextGuests[existingGuestIndex].side,
          phone: form.phone.trim() || nextGuests[existingGuestIndex].phone,
          email: form.email.trim() || nextGuests[existingGuestIndex].email || "",
        };
      } else {
        const parts = form.fullName.trim().split(/\s+/);
        const firstName = parts.length > 1 ? parts.pop() : parts[0];
        const lastName = parts.join(" ");

        const createdGuest = {
          id: `g-${Date.now()}`,
          lastName,
          firstName,
          side: form.side || "Bạn bè",
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: "",
          rsvp: rsvpStatus,
          companions: isAttending ? Number(form.companions) || 0 : 0,
          tag: isAttending ? (form.side || "Khách mời") : "Khách bận",
          tableId: null,
          tableName: "Chưa xếp bàn",
        };
        nextGuests = [createdGuest, ...nextGuests];
      }

      if (weddingId) {
        await weddingApi.updateFeatureSection(weddingId, "collect_contacts", {
          guestList: nextGuests,
        });
      }

      // 4. Bắn sự kiện đồng bộ hóa thời gian thực
      window.dispatchEvent(
        new CustomEvent("everweb:feature-updated", {
          detail: { section: "rsvp_config", data: { answers: nextAnswers } },
        })
      );
      window.dispatchEvent(
        new CustomEvent("everweb:feature-updated", {
          detail: { section: "collect_contacts", data: { guestList: nextGuests } },
        })
      );

      setIsSubmitted(true);
      toast.success(
        isAttending
          ? "Đã gửi xác nhận tham dự thành công!"
          : "Đã gửi lời chúc và phản hồi thành công!"
      );
    } catch (err) {
      console.error("Lỗi gửi biểu mẫu RSVP:", err);
      toast.error("Không thể gửi phản hồi, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg my-auto rounded-[32px] bg-white border border-stone-200/90 shadow-2xl overflow-hidden transition-all duration-300">
        {/* Nút đóng modal */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition cursor-pointer"
          aria-label="Đóng biểu mẫu"
        >
          <X size={16} />
        </button>

        {/* =========================================================================
            HEADER MODAL: LÃNG MẠN & CAO CẤP
           ========================================================================= */}
        <div className="bg-[#1F1A17] text-white px-6 py-7 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-amber-300 mb-2 border border-white/10">
            <Heart size={12} className="fill-amber-300" />
            <span>Hôn lễ {coupleNames}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-normal">
            Xác nhận tham dự hôn lễ
          </h3>

          <p className="mt-1.5 text-xs text-stone-300">
            {displayDate} · {displayVenue}
          </p>
        </div>

        {/* =========================================================================
            TRƯỜNG HỢP 1: ĐÃ GỬI THÀNH CÔNG (SUCCESS CONFIRMATION)
           ========================================================================= */}
        {isSubmitted ? (
          <div className="p-6 sm:p-8 text-center space-y-5 bg-stone-50/60">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-[#1F1A17]">
                {form.attendance === "attending"
                  ? "Cảm ơn bạn đã xác nhận tham dự!"
                  : "Cảm ơn lời chúc thân thương của bạn!"}
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                {form.attendance === "attending" ? (
                  <>
                    Sự hiện diện của <strong className="text-[#1F1A17]">{form.fullName}</strong> là niềm vinh hạnh to lớn cho gia đình chúng mình. Hẹn gặp bạn vào ngày <strong className="text-[#1F1A17]">{displayDate}</strong> nhé!
                  </>
                ) : (
                  <>
                    Dù bạn không thể đến chung vui trực tiếp, tình cảm và lời chúc của bạn là món quà vô cùng quý báu đối với <strong className="text-[#1F1A17]">{coupleNames}</strong>.
                  </>
                )}
              </p>
            </div>

            {/* Khối tóm tắt thông tin đã gửi */}
            {form.attendance === "attending" && (
              <div className="rounded-2xl border border-stone-200 bg-white p-4 text-left text-xs space-y-2 shadow-2xs">
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Khách mời:</span>
                  <span className="font-semibold text-[#1F1A17]">{form.fullName} ({form.phone})</span>
                </div>
                {form.email && (
                  <div className="flex justify-between border-b border-stone-100 pb-2">
                    <span className="text-stone-500">Email:</span>
                    <span className="font-semibold text-[#1F1A17] font-mono">{form.email}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Số người đi cùng:</span>
                  <span className="font-semibold text-[#1F1A17]">
                    {form.companions > 0 ? `+${form.companions} người` : "Đi 1 mình"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Khẩu phần ăn:</span>
                  <span className="font-semibold text-[#1F1A17]">{form.meal}</span>
                </div>
                {form.wishes && (
                  <div className="pt-1">
                    <span className="text-stone-500 block mb-0.5">Lời chúc gửi đôi uyên ương:</span>
                    <p className="italic text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      &ldquo;{form.wishes}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full rounded-full bg-[#1F1A17] py-2.5 text-xs font-semibold text-white hover:bg-stone-800 transition shadow-xs cursor-pointer"
              >
                Hoàn tất & Quay lại trang web
              </button>
            </div>
          </div>
        ) : (
          /* =========================================================================
              TRƯỜNG HỢP 2: BIỂU MẪU ĐIỀN CÂU HỎI RSVP
             ========================================================================= */
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 text-xs max-h-[70vh] overflow-y-auto">
            {/* 1. THÔNG TIN KHÁCH MỜI */}
            <div className="space-y-3">
              <h5 className="font-semibold text-xs text-stone-800 flex items-center gap-1.5">
                <User size={13} className="text-stone-500" />
                <span>1. Thông tin của bạn</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-stone-600 block mb-1">
                    Họ và tên của bạn *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="VD: Nguyễn Văn Anh"
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs text-[#1F1A17] outline-none focus:border-[#1F1A17] focus:ring-1 focus:ring-[#1F1A17] transition"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-600 block mb-1">
                    Số điện thoại di động *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="VD: 0909 123 456"
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs text-[#1F1A17] outline-none focus:border-[#1F1A17] focus:ring-1 focus:ring-[#1F1A17] transition"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-600 block mb-1">
                  Địa chỉ Email (để nhận thiệp & thông báo tiệc)
                </label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="VD: lananh.nguyen@gmail.com"
                    className="w-full rounded-xl border border-stone-200 pl-9 pr-3.5 py-2 text-xs text-[#1F1A17] outline-none focus:border-[#1F1A17] focus:ring-1 focus:ring-[#1F1A17] transition"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-600 block mb-1">
                  Mối quan hệ với cô dâu chú rể
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Nhà trai", "Nhà gái", "Bạn bè"].map((sideItem) => (
                    <button
                      key={sideItem}
                      type="button"
                      onClick={() => setForm({ ...form, side: sideItem })}
                      className={`rounded-xl py-1.5 text-xs font-medium border transition cursor-pointer ${
                        form.side === sideItem
                          ? "bg-[#1F1A17] text-white border-[#1F1A17]"
                          : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      {sideItem}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. CÂU HỎI XÁC NHẬN SỰ HIỆN DIỆN */}
            <div className="space-y-2.5 pt-2 border-t border-stone-100">
              <h5 className="font-semibold text-xs text-stone-800 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                <span>2. Bạn có thể đến chung vui cùng chúng mình không? *</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Lựa chọn 1: Có tham dự */}
                <div
                  onClick={() => setForm({ ...form, attendance: "attending" })}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                    form.attendance === "attending"
                      ? "border-[#1F1A17] bg-stone-50 shadow-xs"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      form.attendance === "attending"
                        ? "border-[#1F1A17] bg-[#1F1A17] text-white"
                        : "border-stone-300 bg-white"
                    }`}
                  >
                    {form.attendance === "attending" && <Check size={12} />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#1F1A17] block">Sẽ tham dự</span>
                    <span className="text-[11px] text-stone-500 block">Vui vẻ nhận lời chung vui</span>
                  </div>
                </div>

                {/* Lựa chọn 2: Bận không đến được */}
                <div
                  onClick={() => setForm({ ...form, attendance: "declined" })}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                    form.attendance === "declined"
                      ? "border-[#1F1A17] bg-stone-50 shadow-xs"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      form.attendance === "declined"
                        ? "border-[#1F1A17] bg-[#1F1A17] text-white"
                        : "border-stone-300 bg-white"
                    }`}
                  >
                    {form.attendance === "declined" && <Check size={12} />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#1F1A17] block">Rất tiếc bận</span>
                    <span className="text-[11px] text-stone-500 block">Gửi lời chúc từ xa</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. CHI TIẾT KHI THAM DỰ (CHỈ HIỂN THỊ KHI CHỌN THAM DỰ) */}
            {form.attendance === "attending" && (
              <div className="space-y-4 pt-2 border-t border-stone-100 animate-in fade-in duration-200">
                {/* Câu hỏi số người đi cùng */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-xs text-stone-800 block">
                    3. Số lượng người đi cùng bạn (bao gồm người lớn & trẻ em)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {COMPANION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, companions: opt.value })}
                        className={`rounded-xl py-2 px-2 text-center font-medium border text-xs transition cursor-pointer ${
                          form.companions === opt.value
                            ? "bg-[#1F1A17] text-white border-[#1F1A17]"
                            : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Câu hỏi thực đơn tiệc cưới */}
                <div className="space-y-2">
                  <label className="font-semibold text-xs text-stone-800 flex items-center gap-1.5">
                    <Utensils size={13} className="text-stone-500" />
                    <span>4. Lựa chọn khẩu phần ăn tiệc</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { key: "Món mặn truyền thống", desc: "Thực đơn tiệc cưới cao cấp đặc sắc" },
                      { key: "Món chay thanh tịnh", desc: "Thực đơn chay riêng biệt thanh tịnh" },
                    ].map((m) => (
                      <div
                        key={m.key}
                        onClick={() => setForm({ ...form, meal: m.key })}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                          form.meal === m.key
                            ? "border-[#1F1A17] bg-stone-50 font-semibold text-[#1F1A17]"
                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <div>
                          <span className="block text-xs">{m.key}</span>
                          <span className="block text-[10px] text-stone-400 font-normal">{m.desc}</span>
                        </div>
                        {form.meal === m.key && <Check size={14} className="text-[#1F1A17]" />}
                      </div>
                    ))}
                  </div>

                  <div>
                    <input
                      type="text"
                      value={form.allergy}
                      onChange={(e) => setForm({ ...form, allergy: e.target.value })}
                      placeholder="Ghi chú kiêng hoặc dị ứng thực phẩm (nếu có)..."
                      className="w-full rounded-xl border border-stone-200 px-3 py-1.5 text-xs text-[#1F1A17] outline-none focus:border-[#1F1A17]"
                    />
                  </div>
                </div>

                {/* Các lựa chọn phụ tiện ích */}
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.attendCocktail}
                      onChange={(e) => setForm({ ...form, attendCocktail: e.target.checked })}
                      className="rounded border-stone-300 text-[#1F1A17] focus:ring-0"
                    />
                    <span className="text-xs text-stone-700">
                      Tôi sẽ đến sớm lúc 17:30 để dự tiệc cocktail & chụp ảnh kỷ niệm
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.needsSupport}
                      onChange={(e) => setForm({ ...form, needsSupport: e.target.checked })}
                      className="rounded border-stone-300 text-[#1F1A17] focus:ring-0"
                    />
                    <span className="text-xs text-stone-700">
                      Tôi cần thông tin xe đưa đón hoặc hỗ trợ đặt phòng khách sạn gần sảnh
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* 4. LỜI CHÚC PHÚC THÂN THƯƠNG */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100">
              <label className="font-semibold text-xs text-stone-800 flex items-center gap-1.5">
                <MessageSquareHeart size={13} className="text-rose-500" />
                <span>Lời nhắn nhủ thân thương gửi đôi uyên ương</span>
              </label>
              <textarea
                rows={3}
                value={form.wishes}
                onChange={(e) => setForm({ ...form, wishes: e.target.value })}
                placeholder="Chúc hai bạn trăm năm hạnh phúc, mãi mãi yêu thương..."
                className="w-full rounded-xl border border-stone-200 p-3 text-xs text-[#1F1A17] outline-none focus:border-[#1F1A17] focus:ring-1 focus:ring-[#1F1A17] transition"
              />
            </div>

            {/* NÚT SUBMIT */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#1F1A17] py-3 text-xs font-semibold text-white hover:bg-stone-800 active:scale-95 transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Đang gửi xác nhận..." : "Gửi xác nhận tham dự"}
              </button>
              <p className="text-[10px] text-stone-400 text-center mt-2">
                Thông tin của bạn sẽ được chuyển trực tiếp đến cô dâu & chú rể để chuẩn bị chu đáo nhất.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
