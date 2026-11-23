import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flower2 } from "lucide-react";
import { useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import { extractApiError } from "../../services/api";
import weddingApi from "../../services/weddingApi";
import { slugifyVietnamese } from "../../utils/weddingHelpers";
import galleryBouquet from "../../assets/image/gallery-bouquet.jpg";
import galleryCeremony from "../../assets/image/gallery-ceremony.jpg";
import heroWedding from "../../assets/image/hero-wedding.jpg";

export default function WeddingSetupPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [yourName, setYourName] = useState("Trần Thanh Khang");
  const [partnerName, setPartnerName] = useState("Trần Ngọc An");
  const [venue, setVenue] = useState("Sảnh Hoa Mai - TP. Hồ Chí Minh");
  const [venueUndecided, setVenueUndecided] = useState(false);
  const [eventDate, setEventDate] = useState("2027-08-23");
  const [dateUndecided, setDateUndecided] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!yourName.trim() || !partnerName.trim()) {
      toast.error("Vui lòng nhập tên của bạn và người thương");
      return;
    }

    const groom = yourName.trim();
    const bride = partnerName.trim();
    const title = `${groom} & ${bride}`;
    const baseSlug = slugifyVietnamese(`${groom}-${bride}`) || "dam-cuoi";
    const slug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;

    const draftWedding = {
      id: `local-${Date.now()}`,
      title,
      groom_name: groom,
      bride_name: bride,
      venue_name: venueUndecided ? null : venue.trim() || null,
      wedding_date: dateUndecided ? null : eventDate || null,
      slug,
      status: "draft",
    };

    setIsSubmitting(true);
    try {
      const created = await weddingApi.create({
        title: draftWedding.title,
        groom_name: draftWedding.groom_name,
        bride_name: draftWedding.bride_name,
        venue_name: draftWedding.venue_name,
        wedding_date: draftWedding.wedding_date,
        slug: draftWedding.slug,
        status: draftWedding.status,
      });
      sessionStorage.setItem("everweb_pending_wedding", JSON.stringify(created));
      toast.success(`Đã tạo đám cưới ${title}!`);
      navigate(ROUTE_PATHS.EVENT_HUB, {
        replace: true,
        state: { wedding: created },
      });
    } catch (error) {
      if (error?.response?.status === 404) {
        sessionStorage.setItem(
          "everweb_pending_wedding",
          JSON.stringify(draftWedding)
        );
        toast.success(`Đã tạo đám cưới ${title}!`);
        navigate(ROUTE_PATHS.EVENT_HUB, {
          replace: true,
          state: { wedding: draftWedding },
        });
      } else {
        const msg = extractApiError(error, "Không thể tạo đám cưới.").message;
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-white text-[#2C2117] lg:grid-cols-12">
      {/* Left: Visual Preview Collage */}
      <div className="hidden flex-col justify-center gap-4 bg-[#FAF7F2] p-8 lg:col-span-6 lg:flex xl:p-12">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#EAE3D8] bg-white p-4 shadow-2xs">
            <div className="flex items-baseline gap-4">
              <div>
                <p className="text-2xl font-bold text-[#2C2117]">95</p>
                <p className="text-[11px] text-[#8C7A68]">Khách mời</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#3B52DE]">80</p>
                <p className="text-[11px] text-[#8C7A68]">Đã xác nhận</p>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-xs">
              <div className="rounded-lg bg-[#FAF8F5] px-2.5 py-1.5 font-medium text-[#5E5042]">
                60 Tham dự
              </div>
              <div className="rounded-lg bg-[#FAF8F5] px-2.5 py-1.5 text-[#8C7A68]">
                15 Chờ phản hồi
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#EAE3D8] bg-white p-2 shadow-2xs">
            <img
              src={galleryBouquet}
              alt="Thiệp cưới mẫu"
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[#EAE3D8] bg-white p-3 shadow-xs">
          <img
            src={heroWedding}
            alt="Trang web cưới"
            className="aspect-[16/9] w-full rounded-xl object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 p-4 text-center text-white">
            <p className="text-xs tracking-widest uppercase opacity-90">
              Xem trước trực tiếp
            </p>
            <p className="mt-1 text-2xl font-bold">
              {yourName || "Chú rể"} & {partnerName || "Cô dâu"}
            </p>
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-[#EAE3D8] bg-white p-2 xl:block">
          <img
            src={galleryCeremony}
            alt="Lễ cưới"
            className="h-28 w-full rounded-xl object-cover"
          />
        </div>
      </div>

      {/* Right: Registration Form */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:col-span-6">
        <div className="mx-auto w-full max-w-md">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B52DE] text-white">
              <Flower2 size={20} />
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#2C2117]">
              Hãy sẵn sàng lên kế hoạch.
            </h1>
            <p className="mt-1 text-xs text-[#8C7A68]">
              Nhập thông tin cơ bản để tạo thiệp mời & không gian quản trị riêng
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <input
              type="text"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder="Tên của bạn"
              className="w-full rounded-xl border border-[#E2D9CB] bg-white px-4 py-3 text-sm text-[#2C2117] placeholder-[#9C8B7A] outline-none focus:border-[#3B52DE]"
            />

            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="Tên người thương"
              className="w-full rounded-xl border border-[#E2D9CB] bg-white px-4 py-3 text-sm text-[#2C2117] placeholder-[#9C8B7A] outline-none focus:border-[#3B52DE]"
            />

            <div>
              <input
                type="text"
                value={venue}
                disabled={venueUndecided}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Địa điểm tổ chức"
                className="w-full rounded-xl border border-[#E2D9CB] bg-white px-4 py-3 text-sm text-[#2C2117] placeholder-[#9C8B7A] outline-none focus:border-[#3B52DE] disabled:bg-[#FAF8F5] disabled:text-[#9C8B7A]"
              />
              <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs text-[#7D6D5E]">
                <input
                  type="checkbox"
                  checked={venueUndecided}
                  onChange={(e) => setVenueUndecided(e.target.checked)}
                  className="h-4 w-4 rounded border-[#D6CFC4] accent-[#3B52DE]"
                />
                Chúng tôi vẫn đang cân nhắc
              </label>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-[#8C7A68]">
                Ngày dự kiến tổ chức
              </label>
              <input
                type="date"
                value={eventDate}
                disabled={dateUndecided}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-xl border border-[#E2D9CB] bg-white px-4 py-2.5 text-sm text-[#2C2117] outline-none focus:border-[#3B52DE] disabled:bg-[#FAF8F5] disabled:text-[#9C8B7A]"
              />
              <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs text-[#7D6D5E]">
                <input
                  type="checkbox"
                  checked={dateUndecided}
                  onChange={(e) => setDateUndecided(e.target.checked)}
                  className="h-4 w-4 rounded border-[#D6CFC4] accent-[#3B52DE]"
                />
                Chúng tôi vẫn đang cân nhắc
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-full bg-[#3B52DE] py-3 text-sm font-semibold text-white transition hover:bg-[#2F43C2] disabled:opacity-60"
            >
              {isSubmitting ? "Đang tạo sự kiện..." : "Create Event"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-[#8C7A68]">
            Không phải {user?.email || "tài khoản này"}?{" "}
            <button
              type="button"
              onClick={handleSignOut}
              className="font-medium text-[#2C2117] underline underline-offset-2"
            >
              Đăng xuất
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
