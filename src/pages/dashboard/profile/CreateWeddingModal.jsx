import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { Modal } from "../../../components/common";
import { extractApiError } from "../../../services/api";
import {
  formatBudgetNumber,
  formatVnd,
  generateSuggestedSlug,
  parseBudgetValue,
  validateWeddingForm,
  WEDDING_STATUS_OPTIONS,
} from "../../../utils/weddingHelpers";

const INITIAL_VALUES = {
  title: "",
  groom_name: "",
  bride_name: "",
  wedding_date: "",
  venue_name: "",
  venue_address: "",
  slug: "",
  total_budget: 0,
  status: "draft",
};

function CreateWeddingForm({ onClose, onCreate }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [slugEditedManually, setSlugEditedManually] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value };
      if (
        !slugEditedManually &&
        (field === "title" || field === "groom_name" || field === "bride_name")
      ) {
        next.slug = generateSuggestedSlug(next);
      }
      return next;
    });

    setErrors((prev) => {
      if (!prev[field] && (slugEditedManually || !prev.slug)) return prev;
      const nextErrors = { ...prev };
      delete nextErrors[field];
      if (!slugEditedManually) delete nextErrors.slug;
      return nextErrors;
    });
    setSubmitError("");
  };

  const handleAutoSlug = () => {
    const suggested = generateSuggestedSlug(values);
    setSlugEditedManually(false);
    setValues((prev) => ({ ...prev, slug: suggested }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.slug;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateWeddingForm(values);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await onCreate({
        ...values,
        slug: String(values.slug).trim().toLowerCase(),
      });
      onClose();
    } catch (error) {
      const parsed = extractApiError(
        error,
        "Không thể tạo hồ sơ đám cưới, vui lòng thử lại."
      );
      if (Object.keys(parsed.fieldErrors).length > 0) {
        setErrors(parsed.fieldErrors);
      }
      setSubmitError(parsed.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-[#2C2117] outline-none transition placeholder:text-[#B6A38E] ${
      hasError
        ? "border-rose-400 focus:border-rose-500"
        : "border-[#E2D9CB] focus:border-[#C5A059]"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {submitError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
          {submitError}
        </div>
      )}

      <div>
        <label
          htmlFor="cw-title"
          className="mb-1 block text-xs font-semibold text-[#5E5042]"
        >
          Tên lễ cưới <span className="text-rose-500">*</span>
        </label>
        <input
          id="cw-title"
          type="text"
          maxLength={255}
          value={values.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Ví dụ: Lễ cưới Minh & An"
          className={inputClass(errors.title)}
          autoFocus
        />
        {errors.title && (
          <p className="mt-1 text-xs font-medium text-rose-600">{errors.title}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="cw-groom"
            className="mb-1 block text-xs font-semibold text-[#5E5042]"
          >
            Họ tên chú rể
          </label>
          <input
            id="cw-groom"
            type="text"
            maxLength={255}
            value={values.groom_name}
            onChange={(e) => updateField("groom_name", e.target.value)}
            placeholder="Nguyễn Hoàng Minh"
            className={inputClass(errors.groom_name)}
          />
          {errors.groom_name && (
            <p className="mt-1 text-xs font-medium text-rose-600">
              {errors.groom_name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="cw-bride"
            className="mb-1 block text-xs font-semibold text-[#5E5042]"
          >
            Họ tên cô dâu
          </label>
          <input
            id="cw-bride"
            type="text"
            maxLength={255}
            value={values.bride_name}
            onChange={(e) => updateField("bride_name", e.target.value)}
            placeholder="Lê Cát An"
            className={inputClass(errors.bride_name)}
          />
          {errors.bride_name && (
            <p className="mt-1 text-xs font-medium text-rose-600">
              {errors.bride_name}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="cw-date"
            className="mb-1 block text-xs font-semibold text-[#5E5042]"
          >
            Ngày tổ chức
          </label>
          <input
            id="cw-date"
            type="date"
            value={values.wedding_date}
            onChange={(e) => updateField("wedding_date", e.target.value)}
            className={inputClass(errors.wedding_date)}
          />
          {errors.wedding_date && (
            <p className="mt-1 text-xs font-medium text-rose-600">
              {errors.wedding_date}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="cw-budget"
            className="mb-1 block text-xs font-semibold text-[#5E5042]"
          >
            Ngân sách dự kiến (VNĐ)
          </label>
          <input
            id="cw-budget"
            type="text"
            inputMode="numeric"
            value={formatBudgetNumber(values.total_budget)}
            onChange={(e) =>
              updateField("total_budget", parseBudgetValue(e.target.value))
            }
            placeholder="0"
            className={`${inputClass(errors.total_budget)} font-semibold tabular-nums`}
          />
          <p className="mt-1 text-[11px] text-[#8C7A68] tabular-nums">
            {formatVnd(values.total_budget)}
          </p>
          {errors.total_budget && (
            <p className="mt-1 text-xs font-medium text-rose-600">
              {errors.total_budget}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="cw-venue"
            className="mb-1 block text-xs font-semibold text-[#5E5042]"
          >
            Tên địa điểm / sảnh tiệc
          </label>
          <input
            id="cw-venue"
            type="text"
            maxLength={255}
            value={values.venue_name}
            onChange={(e) => updateField("venue_name", e.target.value)}
            placeholder="Sảnh Hoa Mai - Palace Hotel"
            className={inputClass(errors.venue_name)}
          />
        </div>

        <div>
          <label
            htmlFor="cw-address"
            className="mb-1 block text-xs font-semibold text-[#5E5042]"
          >
            Địa chỉ tổ chức
          </label>
          <input
            id="cw-address"
            type="text"
            maxLength={255}
            value={values.venue_address}
            onChange={(e) => updateField("venue_address", e.target.value)}
            placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM"
            className={inputClass(errors.venue_address)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label
            htmlFor="cw-slug"
            className="mb-1 block text-xs font-semibold text-[#5E5042]"
          >
            Đường dẫn công khai (Slug) <span className="text-rose-500">*</span>
          </label>
          <div
            className={`flex items-stretch overflow-hidden rounded-xl border bg-white ${
              errors.slug ? "border-rose-400" : "border-[#E2D9CB] focus-within:border-[#C5A059]"
            }`}
          >
            <span className="hidden items-center border-r border-[#E6DFD3] bg-[#FAF7F2] px-2.5 font-mono text-[11px] text-[#8C7A68] sm:inline-flex">
              /w/
            </span>
            <input
              id="cw-slug"
              type="text"
              maxLength={100}
              value={values.slug}
              onChange={(e) => {
                setSlugEditedManually(true);
                updateField(
                  "slug",
                  e.target.value.toLowerCase().replace(/\s+/g, "-")
                );
              }}
              placeholder="minh-va-an"
              className="min-w-0 flex-1 px-3 py-2 font-mono text-sm text-[#2C2117] outline-none placeholder:text-[#B6A38E]"
            />
            <button
              type="button"
              onClick={handleAutoSlug}
              className="inline-flex shrink-0 items-center gap-1 border-l border-[#E6DFD3] bg-[#FAF7F2] px-2.5 text-xs font-semibold text-[#6D5B4B] hover:bg-[#F1E8D8]"
            >
              <Wand2 size={12} className="text-[#A67C37]" />
              Tự tạo
            </button>
          </div>
          {errors.slug && (
            <p className="mt-1 text-xs font-medium text-rose-600">{errors.slug}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="cw-status"
            className="mb-1 block text-xs font-semibold text-[#5E5042]"
          >
            Trạng thái ban đầu
          </label>
          <select
            id="cw-status"
            value={values.status}
            onChange={(e) => updateField("status", e.target.value)}
            className={inputClass(errors.status)}
          >
            {WEDDING_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2.5 border-t border-[#EFE8DC] pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-lg border border-[#E2D9CB] px-4 py-2 text-xs font-semibold text-[#5E5042] transition hover:bg-[#FAF7F2] disabled:opacity-50"
        >
          Huỷ
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#C5A059] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#B28D46] disabled:opacity-60"
        >
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          {isSubmitting ? "Đang tạo..." : "Tạo hồ sơ cưới"}
        </button>
      </div>
    </form>
  );
}

export default function CreateWeddingModal({ isOpen, onClose, onCreate }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo hồ sơ đám cưới mới"
      size="lg"
    >
      {isOpen && <CreateWeddingForm onClose={onClose} onCreate={onCreate} />}
    </Modal>
  );
}
