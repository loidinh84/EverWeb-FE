import {
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  RotateCcw,
  Save,
  Sparkles,
  Users,
  Wand2,
  XCircle,
} from "lucide-react";
import {
  formatBudgetNumber,
  formatVnd,
  getCountdownInfo,
  parseBudgetValue,
  WEDDING_STATUS_OPTIONS,
} from "../../../utils/weddingHelpers";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-rose-600">{message}</p>;
}

export default function WeddingProfileFormCard({
  values,
  errors,
  slugState,
  isDirty,
  isSaving,
  onFieldChange,
  onBudgetChange,
  onAutoGenerateSlug,
  onReset,
  onSubmit,
}) {
  const countdown = getCountdownInfo(values?.wedding_date);

  const inputBaseClass = (hasError) =>
    `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2C2117] transition outline-none placeholder:text-[#B6A38E] ${
      hasError
        ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
        : "border-[#E2D9CB] focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/15"
    }`;

  const renderSlugStatus = () => {
    if (errors?.slug) {
      return <FieldError message={errors.slug} />;
    }

    if (slugState?.status === "checking") {
      return (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8C7A68]">
          <Loader2 size={13} className="animate-spin text-[#C5A059]" />
          Đang kiểm tra tính khả dụng của đường dẫn...
        </p>
      );
    }

    if (slugState?.status === "available") {
      return (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 size={13} />
          Đường dẫn khả dụng và sẵn sàng sử dụng.
        </p>
      );
    }

    if (slugState?.status === "taken") {
      return (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600">
          <XCircle size={13} />
          {slugState.reason || "Đường dẫn này đã được sử dụng."}
        </p>
      );
    }

    return (
      <p className="mt-1.5 text-[11px] text-[#8C7A68]">
        Chỉ sử dụng chữ thường không dấu (a-z), số (0-9) và dấu gạch nối (-).
      </p>
    );
  };

  const isSaveBlocked =
    !isDirty ||
    isSaving ||
    slugState?.status === "taken" ||
    slugState?.status === "checking";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="overflow-hidden rounded-2xl border border-[#E6DFD3] bg-white"
    >
      {/* Section 1: Thông tin cặp đôi & ngày cưới */}
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FBF5EA] text-[#A67C37]">
            <Users size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2C2117]">
              Thông tin cặp đôi &amp; ngày cưới
            </h2>
            <p className="text-xs text-[#8C7A68]">
              Thông tin hiển thị trên Dashboard và đầu trang thiệp mời
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="wp-title"
            className="mb-1.5 block text-xs font-semibold text-[#5E5042]"
          >
            Tên lễ cưới <span className="text-rose-500">*</span>
          </label>
          <input
            id="wp-title"
            type="text"
            maxLength={255}
            value={values.title}
            onChange={(e) => onFieldChange("title", e.target.value)}
            placeholder="Ví dụ: Lễ cưới Minh & An"
            className={inputBaseClass(errors?.title)}
          />
          <FieldError message={errors?.title} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="wp-groom"
              className="mb-1.5 block text-xs font-semibold text-[#5E5042]"
            >
              Họ tên chú rể
            </label>
            <input
              id="wp-groom"
              type="text"
              maxLength={255}
              value={values.groom_name}
              onChange={(e) => onFieldChange("groom_name", e.target.value)}
              placeholder="Ví dụ: Nguyễn Hoàng Minh"
              className={inputBaseClass(errors?.groom_name)}
            />
            <FieldError message={errors?.groom_name} />
          </div>

          <div>
            <label
              htmlFor="wp-bride"
              className="mb-1.5 block text-xs font-semibold text-[#5E5042]"
            >
              Họ tên cô dâu
            </label>
            <input
              id="wp-bride"
              type="text"
              maxLength={255}
              value={values.bride_name}
              onChange={(e) => onFieldChange("bride_name", e.target.value)}
              placeholder="Ví dụ: Lê Cát An"
              className={inputBaseClass(errors?.bride_name)}
            />
            <FieldError message={errors?.bride_name} />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="wp-date"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#5E5042]"
            >
              <Calendar size={13} className="text-[#A67C37]" />
              Ngày tổ chức lễ cưới
            </label>
            {countdown.state !== "unset" && (
              <span className="rounded-md bg-[#FBF5EA] px-2 py-0.5 text-[11px] font-semibold text-[#8E6727]">
                {countdown.label}
              </span>
            )}
          </div>
          <input
            id="wp-date"
            type="date"
            value={values.wedding_date}
            onChange={(e) => onFieldChange("wedding_date", e.target.value)}
            className={inputBaseClass(errors?.wedding_date)}
          />
          <FieldError message={errors?.wedding_date} />
        </div>
      </div>

      <div className="h-px bg-[#EFE8DC]" />

      {/* Section 2: Địa điểm tổ chức */}
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FBF5EA] text-[#A67C37]">
            <MapPin size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2C2117]">
              Địa điểm tổ chức
            </h2>
            <p className="text-xs text-[#8C7A68]">
              Trung tâm tiệc cưới, sảnh tiệc và địa chỉ hướng dẫn khách mời
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="wp-venue-name"
              className="mb-1.5 block text-xs font-semibold text-[#5E5042]"
            >
              Tên trung tâm / sảnh tiệc
            </label>
            <input
              id="wp-venue-name"
              type="text"
              maxLength={255}
              value={values.venue_name}
              onChange={(e) => onFieldChange("venue_name", e.target.value)}
              placeholder="Ví dụ: Sảnh Hoa Mai - Palace Hotel"
              className={inputBaseClass(errors?.venue_name)}
            />
            <FieldError message={errors?.venue_name} />
          </div>

          <div>
            <label
              htmlFor="wp-venue-address"
              className="mb-1.5 block text-xs font-semibold text-[#5E5042]"
            >
              Địa chỉ chi tiết
            </label>
            <input
              id="wp-venue-address"
              type="text"
              maxLength={255}
              value={values.venue_address}
              onChange={(e) => onFieldChange("venue_address", e.target.value)}
              placeholder="Ví dụ: 123 Nguyễn Huệ, Quận 1, TP.HCM"
              className={inputBaseClass(errors?.venue_address)}
            />
            <FieldError message={errors?.venue_address} />
          </div>
        </div>
      </div>

      <div className="h-px bg-[#EFE8DC]" />

      {/* Section 3: Đường dẫn công khai, Ngân sách & Trạng thái */}
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FBF5EA] text-[#A67C37]">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2C2117]">
              Đường dẫn, ngân sách &amp; trạng thái
            </h2>
            <p className="text-xs text-[#8C7A68]">
              Cấu hình địa chỉ chia sẻ thiệp online và hạn mức tài chính
            </p>
          </div>
        </div>

        {/* Slug input */}
        <div>
          <label
            htmlFor="wp-slug"
            className="mb-1.5 block text-xs font-semibold text-[#5E5042]"
          >
            Đường dẫn công khai (Slug) <span className="text-rose-500">*</span>
          </label>
          <div
            className={`flex items-stretch overflow-hidden rounded-xl border bg-white transition ${
              errors?.slug || slugState?.status === "taken"
                ? "border-rose-400 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100"
                : "border-[#E2D9CB] focus-within:border-[#C5A059] focus-within:ring-2 focus-within:ring-[#C5A059]/15"
            }`}
          >
            <span className="hidden items-center border-r border-[#E6DFD3] bg-[#FAF7F2] px-3 font-mono text-xs text-[#8C7A68] sm:inline-flex">
              everweb.vn/w/
            </span>
            <input
              id="wp-slug"
              type="text"
              maxLength={100}
              value={values.slug}
              onChange={(e) =>
                onFieldChange(
                  "slug",
                  e.target.value.toLowerCase().replace(/\s+/g, "-")
                )
              }
              placeholder="minh-va-an-2026"
              className="min-w-0 flex-1 px-3.5 py-2.5 font-mono text-sm text-[#2C2117] outline-none placeholder:text-[#B6A38E]"
            />
            <button
              type="button"
              onClick={onAutoGenerateSlug}
              className="inline-flex shrink-0 items-center gap-1.5 border-l border-[#E6DFD3] bg-[#FAF7F2] px-3 text-xs font-semibold text-[#6D5B4B] transition hover:bg-[#F1E8D8] hover:text-[#2C2117]"
              title="Tự tạo đường dẫn từ tên cô dâu, chú rể"
            >
              <Wand2 size={13} className="text-[#A67C37]" />
              Tự tạo
            </button>
          </div>
          {renderSlugStatus()}
        </div>

        {/* Total budget */}
        <div>
          <label
            htmlFor="wp-budget"
            className="mb-1.5 block text-xs font-semibold text-[#5E5042]"
          >
            Tổng ngân sách dự kiến
          </label>
          <div className="relative">
            <input
              id="wp-budget"
              type="text"
              inputMode="numeric"
              value={formatBudgetNumber(values.total_budget)}
              onChange={(e) => onBudgetChange(parseBudgetValue(e.target.value))}
              placeholder="0"
              className={`${inputBaseClass(errors?.total_budget)} pr-14 font-semibold tabular-nums`}
            />
            <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-semibold text-[#8C7A68]">
              VNĐ
            </span>
          </div>
          {errors?.total_budget ? (
            <FieldError message={errors.total_budget} />
          ) : (
            <p className="mt-1 text-[11px] text-[#8C7A68] tabular-nums">
              Hiển thị: <span className="font-medium text-[#5E5042]">{formatVnd(values.total_budget)}</span>
            </p>
          )}
        </div>

        {/* Status radio cards */}
        <div>
          <p className="mb-2 text-xs font-semibold text-[#5E5042]">
            Trạng thái hồ sơ
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {WEDDING_STATUS_OPTIONS.map((option) => {
              const isSelected = values.status === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onFieldChange("status", option.value)}
                  className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? "border-[#C5A059] bg-[#FBF5EA] ring-1 ring-[#C5A059]/30"
                      : "border-[#E6DFD3] bg-white hover:border-[#D5C7B2] hover:bg-[#FCFBF8]"
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${option.dotClass}`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#2C2117]">
                      {option.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#8C7A68]">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <FieldError message={errors?.status} />
        </div>
      </div>

      {/* Form Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EFE8DC] bg-[#FCFBF8] px-5 py-4 sm:px-6">
        <div className="text-xs">
          {isDirty ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-[#9A712C]">
              <span className="h-2 w-2 rounded-full bg-[#C5A059]" />
              Có thay đổi chưa lưu
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[#8C7A68]">
              <CheckCircle2 size={14} className="text-emerald-600" />
              Mọi thay đổi đã được lưu
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onReset}
            disabled={!isDirty || isSaving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2D9CB] bg-white px-3.5 py-2 text-xs font-semibold text-[#5E5042] transition hover:border-[#C5A059] hover:text-[#2C2117] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <RotateCcw size={13} />
            Hoàn tác
          </button>

          <button
            type="submit"
            disabled={isSaveBlocked}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#C5A059] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#B28D46] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={14} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
