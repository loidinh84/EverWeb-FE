import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, Heart, Loader2, Send } from "lucide-react";
import weddingApi from "../services/weddingApi";

export default function PublicRsvpPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const prefillGuest = searchParams.get("guest") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [siteData, setSiteData] = useState(null);

  const [guestName, setGuestName] = useState(prefillGuest);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [attending, setAttending] = useState(true);
  const [companions, setCompanions] = useState(0);
  const [meal, setMeal] = useState("Món mặn");
  const [allergy, setAllergy] = useState("");
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    weddingApi
      .getPublicWeddingSite(slug)
      .then((data) => {
        if (!active) return;
        setSiteData(data);
        setError("");
      })
      .catch(() => {
        if (!active) return;
        setError("Không tìm thấy biểu mẫu RSVP cho đường dẫn này.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError("Vui lòng nhập họ và tên của bạn.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await weddingApi.submitPublicRsvp(slug, {
        guestName: guestName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        status: attending ? "attending" : "declined",
        attending,
        companions: attending ? Number(companions) || 0 : 0,
        meal: attending ? meal : "",
        allergy: attending ? allergy.trim() : "",
        note: note.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Không thể gửi xác nhận, vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Đang tải biểu mẫu RSVP...</span>
        </div>
      </div>
    );
  }

  const wedding = siteData?.wedding;
  const coupleNames =
    wedding?.title ||
    [wedding?.groom_name, wedding?.bride_name].filter(Boolean).join(" & ") ||
    "Cô dâu & Chú rể";

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-stone-200 shadow-lg overflow-hidden">
        <div className="bg-[#1F1A17] text-white px-6 py-7 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-amber-200/90 mb-2">
            <Heart className="w-3.5 h-3.5 fill-amber-200/90" />
            <span>Xác nhận tham dự (RSVP)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">{coupleNames}</h1>
          {wedding?.venue_name && (
            <p className="mt-1.5 text-xs text-stone-300">{wedding.venue_name}</p>
          )}
        </div>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-lg font-bold text-[#1F1A17]">
                Cảm ơn {guestName} đã xác nhận!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Phản hồi của bạn đã được lưu trực tiếp vào danh sách khách mời của{" "}
                <span className="font-semibold text-[#1F1A17]">{coupleNames}</span>.
              </p>
              <Link
                to={`/w/${slug}`}
                className="inline-flex items-center justify-center rounded-full bg-[#1F1A17] px-5 py-2.5 text-xs font-semibold text-white hover:bg-stone-800 transition"
              >
                Xem Website cưới
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-700">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Họ và tên khách mời <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-[#1F1A17] outline-none focus:border-[#3B52DE]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0901 234 567"
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-[#1F1A17] outline-none focus:border-[#3B52DE]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-[#1F1A17] outline-none focus:border-[#3B52DE]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Bạn có thể đến chung vui cùng chúng mình không?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`rounded-xl border py-2.5 text-xs font-semibold transition cursor-pointer ${
                      attending
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    Vui vẻ nhận lời
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`rounded-xl border py-2.5 text-xs font-semibold transition cursor-pointer ${
                      !attending
                        ? "border-rose-600 bg-rose-50 text-rose-800"
                        : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    Tiếc quá không dự được
                  </button>
                </div>
              </div>

              {attending && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Số người đi cùng
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={companions}
                      onChange={(e) => setCompanions(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-[#1F1A17] outline-none focus:border-[#3B52DE]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Khẩu phần ăn
                    </label>
                    <select
                      value={meal}
                      onChange={(e) => setMeal(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-[#1F1A17] outline-none focus:border-[#3B52DE]"
                    >
                      <option value="Món mặn">Món mặn</option>
                      <option value="Món chay">Món chay</option>
                      <option value="Suất trẻ em">Suất trẻ em</option>
                    </select>
                  </div>
                </div>
              )}

              {attending && (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Lưu ý dị ứng / Yêu cầu đặc biệt
                  </label>
                  <input
                    type="text"
                    value={allergy}
                    onChange={(e) => setAllergy(e.target.value)}
                    placeholder="VD: Không ăn hải sản, cần ghế trẻ em..."
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-[#1F1A17] outline-none focus:border-[#3B52DE]"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Lời chúc gửi cô dâu &amp; chú rể
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Chúc hai bạn trăm năm hạnh phúc!"
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-[#1F1A17] outline-none focus:border-[#3B52DE]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1F1A17] py-3 text-xs sm:text-sm font-semibold text-white hover:bg-stone-800 transition cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang gửi xác nhận...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi xác nhận RSVP</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
