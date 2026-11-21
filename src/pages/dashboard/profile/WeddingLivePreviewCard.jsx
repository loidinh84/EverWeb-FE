import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  Copy,
  ExternalLink,
  Link2,
  MapPin,
  Wallet,
} from "lucide-react";
import { useToast } from "../../../components/common";
import {
  buildPublicWeddingPath,
  buildPublicWeddingUrl,
  formatDateVi,
  formatVnd,
  getCountdownInfo,
  getCoupleMonogram,
  getStatusMeta,
} from "../../../utils/weddingHelpers";

export default function WeddingLivePreviewCard({
  values,
  onOpenInvitationPreview,
}) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const statusMeta = getStatusMeta(values?.status);
  const countdown = getCountdownInfo(values?.wedding_date);
  const monogram = getCoupleMonogram(
    values?.groom_name,
    values?.bride_name,
    values?.title
  );

  const groom = String(values?.groom_name || "").trim();
  const bride = String(values?.bride_name || "").trim();
  const hasBothNames = Boolean(groom && bride);
  const displayHeadline = hasBothNames
    ? null
    : groom || bride || String(values?.title || "").trim() || "Chú rể & Cô dâu";

  const formattedDate = formatDateVi(values?.wedding_date);
  const publicPath = buildPublicWeddingPath(values?.slug);
  const publicUrl = buildPublicWeddingUrl(values?.slug);

  const handleCopyLink = async () => {
    if (!values?.slug) {
      toast.warning("Vui lòng nhập đường dẫn công khai (slug) trước khi sao chép.");
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(publicUrl);
      } else {
        const input = document.createElement("input");
        input.value = publicUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopied(true);
      toast.success("Đã sao chép đường dẫn hồ sơ cưới");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Không thể sao chép liên kết, vui lòng thử lại.");
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[#DFD2BC] bg-[#FCF9F2]">
      {/* Espresso stationery header */}
      <div className="flex items-center justify-between gap-3 bg-[#2F241D] px-5 py-4 text-[#EDE4D6]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C5A059]/60 bg-[#3D2F26] font-display text-sm font-semibold tracking-wide text-[#E8CD94]">
            {monogram}
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#CBBBA8]">
              Bìa hồ sơ cưới
            </p>
            <p className="text-xs font-semibold text-white">Xem trước trực tiếp</p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusMeta.badgeClass}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClass}`} />
          {statusMeta.label}
        </span>
      </div>

      {/* Stationery body */}
      <div className="space-y-4 p-5">
        <div>
          {hasBothNames ? (
            <h2 className="font-display text-[26px] leading-snug font-semibold text-[#2C2117]">
              {groom}{" "}
              <span className="font-normal text-[#A67C37]">&amp;</span>{" "}
              {bride}
            </h2>
          ) : (
            <h2 className="font-display text-[26px] leading-snug font-semibold text-[#2C2117]">
              {displayHeadline}
            </h2>
          )}

          <p className="mt-1 text-xs font-medium text-[#7D6D5E]">
            {String(values?.title || "").trim() || "Chưa đặt tên lễ cưới"}
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-[#C5A059]/50 via-[#C5A059]/20 to-transparent" />

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2.5">
            <CalendarDays size={15} className="mt-0.5 shrink-0 text-[#A67C37]" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[#2C2117]">
                  {formattedDate || "Chưa ấn định ngày cưới"}
                </span>
                {countdown.state !== "unset" && (
                  <span className="rounded-md bg-[#EFE6D6] px-1.5 py-0.5 text-[10px] font-semibold text-[#7A5622]">
                    {countdown.label}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[11px] text-[#8C7A68]">
                {countdown.subLabel}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin size={15} className="mt-0.5 shrink-0 text-[#A67C37]" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#2C2117]">
                {String(values?.venue_name || "").trim() ||
                  "Chưa cập nhật địa điểm"}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#8C7A68]">
                {String(values?.venue_address || "").trim() ||
                  "Thêm địa chỉ chi tiết để hiển thị trên thiệp mời"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Wallet size={15} className="mt-0.5 shrink-0 text-[#A67C37]" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#2C2117] tabular-nums">
                {formatVnd(values?.total_budget)}
              </p>
              <p className="mt-0.5 text-[11px] text-[#8C7A68]">
                Tổng ngân sách dự kiến
              </p>
            </div>
          </div>
        </div>

        {/* Public URL bar */}
        <div className="rounded-xl border border-[#E6DFD3] bg-white p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8C7A68]">
            <Link2 size={13} className="text-[#A67C37]" />
            <span>Đường dẫn công khai</span>
          </div>
          <p className="mt-1 truncate font-mono text-xs font-medium text-[#2C2117]">
            {publicPath}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#E2D9CB] bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059] hover:bg-[#F3ECE1]"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-600" />
                  Đã sao chép
                </>
              ) : (
                <>
                  <Copy size={13} className="text-[#7D6D5E]" />
                  Sao chép link
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                onOpenInvitationPreview
                  ? onOpenInvitationPreview(values)
                  : toast.info(`Liên kết xem trước: ${publicPath}`)
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2F241D] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#44352B]"
            >
              <ExternalLink size={13} />
              Xem trước
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
