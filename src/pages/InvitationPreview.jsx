import { useEffect, useState } from "react";
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  Users,
  Check,
  Send,
  X,
  MessageSquare,
} from "lucide-react";
import { getGuestInvitation } from "../services/guestApi.js";

// Dữ liệu mẫu thiệp cưới chuẩn phong cách Việt Nam sang trọng (Pinterest Style)
const DEMO_DATA = {
  guestName: "Anh Hoàng Nam & Bạn gái",
  maxCompanions: 2,
  wedding: {
    title: "LỄ THÀNH HÔN",
    groom_name: "Nguyễn Minh Khang",
    bride_name: "Trần Ngọc Linh",
    groom_parents: "Ô. Nguyễn Văn Hùng & B. Lê Thị Mai",
    bride_parents: "Ô. Trần Đình Trọng & B. Phạm Thu Hà",
    wedding_date: "2026-12-26T18:00:00.000Z",
    lunar_date: "18 tháng 11 năm Bính Ngọ",
    venue_name: "Trung tâm Hội nghị Tiệc cưới White Palace",
    hall_name: "Sảnh Grand Ballroom (Tầng 2)",
    venue_address:
      "194 Hoàng Văn Thụ, Phường 9, Quận Phú Nhuận, TP. Hồ Chí Minh",
    map_url: "https://maps.google.com/?q=194+Hoang+Van+Thu+Phu+Nhuan",
  },
};

// Đọc token từ URL
const getUrlToken = () => {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("token");
};

export default function InvitationPreview() {
  const token = getUrlToken();

  const [invitation, setInvitation] = useState(token ? null : DEMO_DATA);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  // Form RSVP state
  const [rsvpStatus, setRsvpStatus] = useState("attending"); // "attending" | "declined"
  const [attendingCount, setAttendingCount] = useState(1);
  const [wish, setWish] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!token) return;

    getGuestInvitation(token)
      .then((res) => {
        const guest = res.data?.guest;
        setInvitation({
          guestName: guest.full_name,
          maxCompanions: guest.max_companions || 0,
          wedding: {
            ...DEMO_DATA.wedding,
            title: guest.weddings?.title,
            wedding_date:
              guest.weddings?.wedding_date || DEMO_DATA.wedding.wedding_date,
            venue_name:
              guest.weddings?.venue_name || DEMO_DATA.wedding.venue_name,
            venue_address:
              guest.weddings?.venue_address || DEMO_DATA.wedding.venue_address,
          },
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F3ED] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#8C6D3F]/30 border-t-[#8C6D3F] animate-spin" />
          <p className="text-stone-700 font-display italic text-lg">
            Đang mở phong thư thiệp cưới...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F6F3ED] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-stone-200">
          <div className="w-12 h-12 bg-rose-50 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <X className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-display font-semibold text-stone-900">
            Không Thể Mở Thiệp
          </h2>
          <p className="text-stone-600 mt-2 text-sm leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  const { guestName, maxCompanions, wedding } = invitation;

  return (
    <div className="min-h-screen bg-[#F4EFEA] py-10 px-4 flex justify-center items-center selection:bg-amber-100 selection:text-stone-900 font-sans">
      {/* Tấm thiệp cưới */}
      <div className="max-w-xl w-full bg-[#FCFAF6] rounded-2xl shadow-xl border border-[#D8C7A5] p-6 sm:p-10 relative overflow-hidden text-stone-900">
        {/* Khung viền chỉ vàng kim đôi thanh nhã chạy quanh thiệp */}
        <div className="absolute inset-2.5 sm:inset-3 border border-[#C5A86E]/40 rounded-xl pointer-events-none" />
        <div className="absolute inset-3.5 sm:inset-4.5 border border-[#D8C7A5]/30 rounded-lg pointer-events-none" />

        {/* 1. Phần Đầu Thiệp: */}
        <div className="text-center pt-3 pb-5 relative z-10">
          {/* Con dấu sáp đỏ hoàng gia */}
          <div className="inline-flex items-center justify-center w-11 h-11 bg-[#721531] text-[#EAD8B1] rounded-full shadow-md shadow-[#721531]/25 border border-[#C5A86E]/60 mb-3">
            <Heart className="w-4 h-4 fill-[#EAD8B1] text-[#EAD8B1]" />
          </div>

          <p className="text-[11px] uppercase tracking-[0.3em] text-[#8C6D3F] font-medium">
            Wedding Invitation
          </p>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-[#2C1810] mt-1 tracking-wider">
            {wedding.title}
          </h1>

          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#C5A86E] to-transparent mx-auto my-3" />

          <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-medium">
            Trân trọng báo tin hôn lễ của hai con
          </p>
        </div>

        {/* 2. Đại diện Song Thân Hai Họ */}
        <div className="grid grid-cols-2 gap-4 text-center py-4 border-y border-[#EAE0CD] relative z-10 text-xs sm:text-sm">
          <div className="space-y-0.5">
            <p className="font-semibold text-[#8C6D3F] uppercase tracking-wider text-[11px]">
              Nhà Trai
            </p>
            <p className="font-display text-base text-stone-800">
              {wedding.groom_parents}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="font-semibold text-[#8C6D3F] uppercase tracking-wider text-[11px]">
              Nhà Gái
            </p>
            <p className="font-display text-base text-stone-800">
              {wedding.bride_parents}
            </p>
          </div>
        </div>

        {/* 3. Tên Cô Dâu & Chú Rể  */}
        <div className="text-center py-7 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span className="text-2xl sm:text-3xl font-display font-semibold text-[#721531] tracking-wide">
              {wedding.groom_name}
            </span>
            <span className="text-xl sm:text-2xl font-display italic text-[#8C6D3F]">
              &
            </span>
            <span className="text-2xl sm:text-3xl font-display font-semibold text-[#721531] tracking-wide">
              {wedding.bride_name}
            </span>
          </div>
        </div>

        {/* 4. Tấm Thẻ Mời Cá Nhân Hóa */}
        <div className="bg-[#F8F4EC] rounded-xl border border-[#DCCBB0] p-5 text-center relative z-10 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#8C6D3F] font-semibold">
            Kính Mời
          </p>
          <h2 className="text-xl sm:text-2xl font-display font-semibold text-[#1C1613] mt-1">
            {guestName}
          </h2>
          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
            {maxCompanions > 0
              ? `Thiệp mời trân trọng gửi tới bạn cùng ${maxCompanions} người đồng hành`
              : "Thiệp mời trân quý gửi riêng tới bạn"}
          </p>
        </div>

        {/* 5. Chi tiết Thời Gian & Địa Điểm Tiệc Cưới */}
        <div className="py-6 space-y-3.5 relative z-10">
          {/* Khối Thời Gian */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-[#E4D9C4] shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#F8F4EC] flex items-center justify-center flex-shrink-0 text-[#8C6D3F] border border-[#DCCBB0]">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8C6D3F]">
                Thời Gian Tổ Chức
              </p>
              <p className="text-base font-display font-semibold text-stone-900 mt-0.5">
                Thứ Bảy, ngày 26 tháng 12 năm 2026
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-stone-600">
                <span className="inline-flex items-center gap-1 font-medium text-stone-800">
                  <Clock className="w-3.5 h-3.5 text-[#8C6D3F]" /> 17:30 Đón
                  khách — 18:30 Khai tiệc
                </span>
                <span>(Tức ngày {wedding.lunar_date})</span>
              </div>
            </div>
          </div>

          {/* Khối Địa Điểm */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-[#E4D9C4] shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#F8F4EC] flex items-center justify-center flex-shrink-0 text-[#8C6D3F] border border-[#DCCBB0]">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8C6D3F]">
                Địa Điểm Tổ Chức
              </p>
              <p className="text-base font-display font-semibold text-stone-900 mt-0.5">
                {wedding.venue_name}
              </p>
              <p className="text-xs font-medium text-[#721531] mt-0.5">
                {wedding.hall_name}
              </p>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {wedding.venue_address}
              </p>

              {/* Nút Xem Bản Đồ */}
              {wedding.map_url && (
                <a
                  href={wedding.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8C6D3F] hover:text-[#5E4726] underline mt-2"
                >
                  <Navigation className="w-3.5 h-3.5" /> Mở chỉ đường Google
                  Maps
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 6. Hộp Phản Hồi Tham Dự */}
        <div className="bg-white rounded-xl border border-[#DCCBB0] p-5 sm:p-6 shadow-sm relative z-10">
          <div className="text-center mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C6D3F]">
              Xác Nhận Tham Dự (RSVP)
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Sự hiện diện của bạn là niềm hạnh phúc trọn vẹn của gia đình chúng
              tôi
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#721531] mx-auto" />
              <p className="text-sm font-display font-semibold text-stone-900">
                Gửi phản hồi thành công
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                Chúng tôi đã ghi nhận phản hồi của bạn. Hân hạnh được đón tiếp
                bạn trong ngày vui!
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsSubmitted(true);
              }}
              className="space-y-4"
            >
              {/* Lựa chọn tham dự: Sử dụng SVG Icons thay cho text icon/emoji */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRsvpStatus("attending")}
                  className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    rsvpStatus === "attending"
                      ? "bg-[#721531] text-white border-[#721531] shadow-sm"
                      : "bg-[#FCFAF6] text-stone-700 border-stone-300 hover:border-[#721531]/40"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Sẽ tham dự</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRsvpStatus("declined")}
                  className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    rsvpStatus === "declined"
                      ? "bg-stone-800 text-white border-stone-800 shadow-sm"
                      : "bg-[#FCFAF6] text-stone-700 border-stone-300 hover:border-stone-400"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi lời chúc từ xa</span>
                </button>
              </div>

              {/* Lựa chọn số người đi cùng (Pill buttons tinh tế) */}
              {rsvpStatus === "attending" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                    Số lượng người tham dự cùng bạn:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((num) => {
                      if (num > maxCompanions + 1) return null;
                      const isSelected = attendingCount === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAttendingCount(num)}
                          className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-[#F3ECE0] border-[#8C6D3F] text-[#4A381A] font-semibold"
                              : "bg-[#FCFAF6] border-stone-200 text-stone-700 hover:bg-[#F8F4EC]"
                          }`}
                        >
                          <Users className="w-3.5 h-3.5 text-[#8C6D3F]" />
                          <span>{num === 1 ? "1 người" : `${num} người`}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Gửi lời chúc mừng */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#8C6D3F]" />
                  <span>Gửi lời chúc mừng:</span>
                </label>
                <textarea
                  rows={3}
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="Chúc hai bạn trăm năm hạnh phúc, vẹn tròn duyên thắm..."
                  className="w-full p-3 rounded-lg border border-[#DCCBB0] bg-[#FCFAF6] text-stone-900 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#8C6D3F] focus:border-[#8C6D3F] resize-none"
                />
              </div>

              {/* Nút gửi phản hồi */}
              <button
                type="submit"
                className="w-full py-3 bg-[#721531] hover:bg-[#5A1027] text-white font-medium rounded-xl shadow-sm text-xs sm:text-sm tracking-wide transition-all cursor-pointer active:scale-[0.99]"
              >
                Gửi Phản Hồi RSVP
              </button>
            </form>
          )}
        </div>

        {/* Chân Thiệp Trang Trí */}
        <div className="text-center pt-6 pb-1 text-xs text-[#8C6D3F] font-display italic relative z-10">
          Rất hân hạnh được đón tiếp Quý Khách
        </div>
      </div>
    </div>
  );
}
