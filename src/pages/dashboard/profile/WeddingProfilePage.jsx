import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarClock,
  Heart,
  Plus,
  RefreshCw,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useToast } from "../../../components/common";
import { extractApiError } from "../../../services/api";
import weddingApi from "../../../services/weddingApi";
import {
  formatVnd,
  generateSuggestedSlug,
  getCountdownInfo,
  getStatusMeta,
  isValidSlugFormat,
  validateWeddingForm,
  weddingToFormValues,
} from "../../../utils/weddingHelpers";
import DeleteWeddingModal from "./DeleteWeddingModal";
import WeddingLivePreviewCard from "./WeddingLivePreviewCard";
import WeddingProfileFormCard from "./WeddingProfileFormCard";
import WeddingSwitcherCard from "./WeddingSwitcherCard";

function areFormValuesEqual(a, b) {
  return (
    a.title === b.title &&
    a.groom_name === b.groom_name &&
    a.bride_name === b.bride_name &&
    a.wedding_date === b.wedding_date &&
    a.venue_name === b.venue_name &&
    a.venue_address === b.venue_address &&
    a.slug === b.slug &&
    Number(a.total_budget) === Number(b.total_budget) &&
    a.status === b.status
  );
}

function WeddingProfileWorkspace({
  selectedWedding,
  weddings,
  onSelectWedding,
  onUpdateWedding,
  onOpenCreate,
  onOpenDelete,
}) {
  const toast = useToast();
  const initialValues = useMemo(
    () => weddingToFormValues(selectedWedding),
    [selectedWedding]
  );

  const [savedSnapshot, setSavedSnapshot] = useState(initialValues);
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [slugState, setSlugState] = useState({ status: "idle", reason: "" });
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(
    () => !areFormValuesEqual(form, savedSnapshot),
    [form, savedSnapshot]
  );

  const candidateSlug = String(form.slug || "").trim().toLowerCase();
  const shouldCheckSlug =
    Boolean(candidateSlug) &&
    candidateSlug !== savedSnapshot.slug &&
    isValidSlugFormat(candidateSlug);

  useEffect(() => {
    if (!shouldCheckSlug) return undefined;

    let cancelled = false;
    const timer = setTimeout(async () => {
      setSlugState({ status: "checking", reason: "" });
      try {
        const res = await weddingApi.checkSlug(
          candidateSlug,
          selectedWedding.id
        );
        if (cancelled) return;
        setSlugState({
          status: res.available ? "available" : "taken",
          reason: res.reason || "",
        });
      } catch {
        if (!cancelled) {
          setSlugState({ status: "idle", reason: "" });
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [candidateSlug, shouldCheckSlug, selectedWedding.id]);

  const effectiveSlugState = shouldCheckSlug
    ? slugState
    : { status: "idle", reason: "" };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (field === "slug") {
      setSlugState({ status: "idle", reason: "" });
    }
  };

  const handleBudgetChange = (amount) => {
    handleFieldChange("total_budget", amount);
  };

  const handleAutoGenerateSlug = () => {
    const suggested = generateSuggestedSlug(form);
    if (!suggested) {
      toast.warning("Vui lòng nhập tên cô dâu, chú rể hoặc tên lễ cưới trước.");
      return;
    }
    handleFieldChange("slug", suggested);
  };

  const handleReset = () => {
    setForm(savedSnapshot);
    setErrors({});
    setSlugState({ status: "idle", reason: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateWeddingForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Vui lòng kiểm tra lại các trường thông tin chưa hợp lệ.");
      return;
    }

    setIsSaving(true);
    try {
      const updated = await onUpdateWedding(selectedWedding.id, {
        ...form,
        slug: candidateSlug,
      });
      const nextValues = weddingToFormValues(updated || form);
      setForm(nextValues);
      setSavedSnapshot(nextValues);
      setErrors({});
      setSlugState({ status: "idle", reason: "" });
    } catch (error) {
      const parsed = extractApiError(
        error,
        "Không thể lưu hồ sơ đám cưới, vui lòng thử lại."
      );
      if (Object.keys(parsed.fieldErrors).length > 0) {
        setErrors(parsed.fieldErrors);
      }
      toast.error(parsed.message);
    } finally {
      setIsSaving(false);
    }
  };

  const countdown = getCountdownInfo(form.wedding_date);
  const statusMeta = getStatusMeta(form.status);
  const counts = selectedWedding?._count || {
    guests: 0,
    tasks: 0,
    expenses: 0,
  };

  const kpis = [
    {
      label: "Đếm ngược ngày cưới",
      value: countdown.label,
      sub: countdown.subLabel,
      icon: CalendarClock,
    },
    {
      label: "Tổng ngân sách dự kiến",
      value: formatVnd(form.total_budget),
      sub: `${counts.expenses} khoản chi đã ghi nhận`,
      icon: Wallet,
    },
    {
      label: "Quy mô & tiến độ",
      value: `${counts.guests} khách mời`,
      sub: `${counts.tasks} đầu việc trong kế hoạch`,
      icon: Users,
    },
    {
      label: "Trạng thái hồ sơ",
      value: statusMeta.label,
      sub: statusMeta.description,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-5">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, sub, icon: Icon }) => (
          <div
            key={label}
            className="flex items-start justify-between rounded-xl border border-[#E6DFD3] bg-white px-5 py-4"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#8C7A68]">{label}</p>
              <p className="mt-1.5 truncate text-xl font-bold tracking-tight text-[#2C2117] tabular-nums">
                {value}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-[#9C8B7A]">{sub}</p>
            </div>
            <Icon size={18} className="mt-0.5 shrink-0 text-[#B8A590]" />
          </div>
        ))}
      </div>

      {/* Main 12-column asymmetric workspace */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <WeddingProfileFormCard
            values={form}
            errors={errors}
            slugState={effectiveSlugState}
            isDirty={isDirty}
            isSaving={isSaving}
            onFieldChange={handleFieldChange}
            onBudgetChange={handleBudgetChange}
            onAutoGenerateSlug={handleAutoGenerateSlug}
            onReset={handleReset}
            onSubmit={handleSubmit}
          />
        </div>

        <div className="space-y-5 lg:col-span-4">
          <WeddingLivePreviewCard values={form} />
          <WeddingSwitcherCard
            weddings={weddings}
            selectedWeddingId={selectedWedding.id}
            onSelectWedding={onSelectWedding}
            onOpenCreate={onOpenCreate}
            onOpenDelete={onOpenDelete}
            isDeletingDisabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
}

export default function WeddingProfilePage({
  weddings,
  selectedWedding,
  isLoading,
  loadError,
  onSelectWedding,
  onUpdateWedding,
  onDeleteWedding,
  onOpenCreate,
  onRetryLoad,
}) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2C2117] sm:text-[26px]">
            Hồ sơ cặp đôi.
          </h1>
          <p className="mt-1 text-xs text-[#8C7A68]">
            {selectedWedding
              ? `${selectedWedding.couple} · ${selectedWedding.hall} · ${selectedWedding.time}`
              : "Thiết lập thông tin chung cho toàn bộ kế hoạch và thiệp mời online"}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#C5A059] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#B28D46]"
        >
          <Plus size={14} />
          Tạo hồ sơ mới
        </button>
      </div>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-xl border border-[#E6DFD3] bg-white"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="h-[520px] animate-pulse rounded-2xl border border-[#E6DFD3] bg-white lg:col-span-8" />
            <div className="h-[380px] animate-pulse rounded-2xl border border-[#E6DFD3] bg-white lg:col-span-4" />
          </div>
        </div>
      ) : loadError && !selectedWedding ? (
        /* API load error state */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200/80 bg-white px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertCircle size={24} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#2C2117]">
            Không thể tải danh sách hồ sơ cưới
          </h2>
          <p className="mt-1.5 max-w-md text-xs leading-relaxed text-[#8C7A68]">
            {loadError}
          </p>
          {onRetryLoad && (
            <button
              type="button"
              onClick={onRetryLoad}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#2F241D] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#44352B]"
            >
              <RefreshCw size={14} />
              Thử lại
            </button>
          )}
        </div>
      ) : !selectedWedding ? (
        /* Empty state when no weddings exist */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DFD2BC] bg-white px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBF5EA] text-[#A67C37]">
            <Heart size={26} />
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold text-[#2C2117]">
            Chưa có hồ sơ đám cưới nào
          </h2>
          <p className="mt-1.5 max-w-md text-xs leading-relaxed text-[#8C7A68]">
            Hãy khởi tạo hồ sơ cặp đôi đầu tiên để đồng bộ tên cô dâu, chú rể,
            ngày trọng đại và đường dẫn thiệp mời cho toàn bộ không gian quản lý.
          </p>
          <button
            type="button"
            onClick={onOpenCreate}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#C5A059] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#B28D46]"
          >
            <Plus size={15} />
            Tạo hồ sơ đám cưới đầu tiên
          </button>
        </div>
      ) : (
        <WeddingProfileWorkspace
          key={selectedWedding.id}
          selectedWedding={selectedWedding}
          weddings={weddings}
          onSelectWedding={onSelectWedding}
          onUpdateWedding={onUpdateWedding}
          onOpenCreate={onOpenCreate}
          onOpenDelete={() => setIsDeleteOpen(true)}
        />
      )}

      <DeleteWeddingModal
        isOpen={isDeleteOpen}
        wedding={selectedWedding}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={onDeleteWedding}
      />
    </div>
  );
}
