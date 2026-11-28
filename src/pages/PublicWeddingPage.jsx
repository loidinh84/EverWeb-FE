import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Gift, Heart, Loader2, MapPin, BedDouble } from "lucide-react";
import weddingApi from "../services/weddingApi";
import {
  COLOR_THEMES,
  COVER_IMAGES,
  FONT_OPTIONS,
} from "./features/website-design/constants";
import CornerArtwork from "./features/website-design/CornerArtwork";

export default function PublicWeddingPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [siteData, setSiteData] = useState(null);

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
        setError("Không tìm thấy trang đám cưới cho đường dẫn này.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Đang tải Website cưới...</span>
        </div>
      </div>
    );
  }

  if (error || !siteData?.wedding) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl bg-white border border-stone-200 p-8 text-center space-y-3 shadow-sm">
          <h1 className="text-lg font-bold text-[#1F1A17]">
            {error || "Website cưới chưa sẵn sàng"}
          </h1>
          <p className="text-xs text-stone-500">
            Vui lòng kiểm tra lại đường dẫn hoặc liên hệ cô dâu &amp; chú rể.
          </p>
        </div>
      </div>
    );
  }

  const { wedding, features } = siteData;
  const webConfig = features?.website_config || {};
  const travelConfig = features?.travel_config || {};
  const registryConfig = features?.registry_config || {};

  const theme =
    COLOR_THEMES.find((t) => t.id === webConfig.themeId) || COLOR_THEMES[0];
  const font =
    FONT_OPTIONS.find((f) => f.id === webConfig.fontId) || FONT_OPTIONS[0];
  const coverSrc =
    webConfig.customCoverUrl ||
    (COVER_IMAGES.find((c) => c.id === webConfig.coverId) || COVER_IMAGES[1]).src;

  const coupleName =
    wedding.title ||
    [wedding.groom_name, wedding.bride_name].filter(Boolean).join(" & ") ||
    "EverWed";
  const displayDate = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("vi-VN")
    : "Đang cập nhật";
  const displayVenue = wedding.venue_name || "Đang cập nhật địa điểm";

  const pages = Array.isArray(webConfig.pages) ? webConfig.pages : [];
  const visiblePages = pages.filter((p) => p.visible !== false);

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6"
      style={{
        background: theme.outerPattern || theme.outerBg,
        fontFamily: font.style,
      }}
    >
      <div
        className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-black/10 relative"
        style={{ backgroundColor: theme.bg, color: theme.text }}
      >
        <CornerArtwork
          artId={webConfig.artId || "lace"}
          color={webConfig.artColor || "#FFFFFF"}
          opacity={webConfig.artOpacity ?? 80}
        />
        <CornerArtwork
          artId={webConfig.artId || "lace"}
          color={webConfig.artColor || "#FFFFFF"}
          opacity={webConfig.artOpacity ?? 80}
          flip
        />

        {/* Hero */}
        <div className="relative">
          <img
            src={coverSrc}
            alt={coupleName}
            className="w-full h-72 sm:h-96 object-cover"
          />
          <div className="p-8 sm:p-10 text-center space-y-3">
            <p className="text-[11px] uppercase tracking-[0.25em] opacity-75">
              TRÂN TRỌNG BÁO TIN LỄ THÀNH HÔN
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold">{coupleName}</h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm opacity-80">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} />
                {displayDate}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {displayVenue}
              </span>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={`/rsvp/${wedding.slug}`}
                className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                style={{ backgroundColor: theme.accent }}
              >
                <Heart size={14} />
                Xác nhận tham dự (RSVP)
              </Link>
              <Link
                to={`/contact/${wedding.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-current/25 px-5 py-2.5 text-xs sm:text-sm font-semibold transition hover:bg-black/5"
              >
                Gửi thông tin liên hệ
              </Link>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="border-t border-black/10 px-6 sm:px-10 py-8 text-center space-y-3">
          <h2 className="text-2xl font-semibold">Chuyện tình yêu</h2>
          <p className="text-sm opacity-80 leading-relaxed max-w-xl mx-auto">
            {webConfig.storyText ||
              "Từ những buổi chiều cà phê tình cờ đến lời hẹn ước trăm năm, tụi mình rất hạnh phúc được chia sẻ khoảnh khắc đặc biệt này cùng gia đình và những người bạn thân thương nhất."}
          </p>
        </div>

        {/* Hotels if configured */}
        {Array.isArray(travelConfig.hotels) && travelConfig.hotels.length > 0 && (
          <div className="border-t border-black/10 px-6 sm:px-10 py-8 space-y-4">
            <h2 className="text-2xl font-semibold text-center inline-flex items-center justify-center gap-2 w-full">
              <BedDouble size={20} />
              Lưu trú &amp; Khách sạn
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {travelConfig.hotels.map((h, idx) => (
                <div
                  key={h.id || idx}
                  className="rounded-2xl bg-white/75 border border-black/10 p-4 space-y-1 text-left"
                >
                  <p className="font-semibold text-sm">{h.name}</p>
                  {h.distance && <p className="text-xs opacity-70">{h.distance}</p>}
                  {h.price && <p className="text-xs font-medium">{h.price}</p>}
                  {h.code && (
                    <p className="text-[11px] opacity-80">
                      Mã ưu đãi: <span className="font-bold">{h.code}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registry if configured */}
        {Array.isArray(registryConfig.gifts) && registryConfig.gifts.length > 0 && (
          <div className="border-t border-black/10 px-6 sm:px-10 py-8 space-y-4">
            <h2 className="text-2xl font-semibold text-center inline-flex items-center justify-center gap-2 w-full">
              <Gift size={20} />
              Quà mừng
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {registryConfig.gifts.map((g, idx) => (
                <div
                  key={g.id || idx}
                  className="rounded-2xl bg-white/75 border border-black/10 p-4 space-y-1 text-left"
                >
                  <p className="font-semibold text-sm">{g.title}</p>
                  {g.category && <p className="text-xs opacity-70">{g.category}</p>}
                  {g.target && <p className="text-xs font-medium">{g.target}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visible pages pills */}
        {visiblePages.length > 0 && (
          <div className="border-t border-black/10 px-6 py-6 text-center text-[11px] opacity-65">
            Được tạo với tất cả yêu thương trên EverWeb · {coupleName}
          </div>
        )}
      </div>
    </div>
  );
}
