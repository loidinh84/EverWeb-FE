export const WEDDING_STATUS_OPTIONS = [
  {
    value: "draft",
    label: "Bản nháp",
    description: "Đang thiết lập thông tin cơ bản",
    badgeClass: "bg-[#F3ECE1] text-[#6D5B4B] border-[#E2D9CB]",
    dotClass: "bg-[#9C8B7A]",
  },
  {
    value: "active",
    label: "Đang triển khai",
    description: "Hồ sơ đang dùng cho kế hoạch cưới",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  {
    value: "completed",
    label: "Đã hoàn thành",
    description: "Tiệc cưới đã diễn ra trọn vẹn",
    badgeClass: "bg-amber-50 text-[#9A712C] border-[#E6CFA3]",
    dotClass: "bg-[#C5A059]",
  },
  {
    value: "cancelled",
    label: "Đã huỷ",
    description: "Tạm dừng hoặc huỷ kế hoạch tiệc",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
  },
];

export const ALLOWED_WEDDING_STATUSES = WEDDING_STATUS_OPTIONS.map(
  (item) => item.value
);

export const RESERVED_SLUGS = [
  "admin",
  "api",
  "auth",
  "login",
  "register",
  "dashboard",
  "settings",
  "profile",
  "weddings",
  "guests",
  "invitation",
];

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_INPUT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MAX_BUDGET = 999999999999999;

export function getStatusMeta(status) {
  return (
    WEDDING_STATUS_OPTIONS.find((item) => item.value === status) ||
    WEDDING_STATUS_OPTIONS[0]
  );
}

export function slugifyVietnamese(text = "") {
  return String(text)
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");
}

export function generateSuggestedSlug({ groom_name, bride_name, title } = {}) {
  const groom = String(groom_name || "").trim();
  const bride = String(bride_name || "").trim();

  if (groom && bride) {
    return slugifyVietnamese(`${groom} ${bride}`);
  }
  if (title && String(title).trim()) {
    return slugifyVietnamese(title);
  }
  return slugifyVietnamese(groom || bride || "");
}

export function isValidSlugFormat(slug) {
  const value = String(slug || "").trim();
  if (value.length < 2 || value.length > 100) return false;
  if (!SLUG_REGEX.test(value)) return false;
  if (RESERVED_SLUGS.includes(value)) return false;
  return true;
}

export function formatVnd(amount) {
  const numeric = Math.max(0, Math.round(Number(amount) || 0));
  return `${new Intl.NumberFormat("vi-VN").format(numeric)} đ`;
}

export function formatBudgetNumber(amount) {
  if (amount === "" || amount === null || amount === undefined) return "";
  const numeric = Math.max(0, Math.round(Number(amount) || 0));
  return new Intl.NumberFormat("vi-VN").format(numeric);
}

export function parseBudgetValue(raw) {
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? Math.max(0, Math.round(raw)) : 0;
  }
  const digits = String(raw || "").replace(/\D+/g, "");
  if (!digits) return 0;
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
}

export function toDateInputValue(dateStr) {
  if (!dateStr) return "";
  const str = String(dateStr).trim();
  if (DATE_INPUT_REGEX.test(str)) return str;

  const isoPrefixMatch = str.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (isoPrefixMatch) return isoPrefixMatch[1];

  const parsed = new Date(str);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateVi(dateStr) {
  const ymd = toDateInputValue(dateStr);
  if (!ymd) return "";
  const [year, month, day] = ymd.split("-");
  return `${day}/${month}/${year}`;
}

export function getCountdownInfo(dateStr) {
  const ymd = toDateInputValue(dateStr);
  if (!ymd) {
    return {
      state: "unset",
      days: null,
      label: "Chưa ấn định",
      subLabel: "Hãy chọn ngày tổ chức lễ cưới",
    };
  }

  const [year, month, day] = ymd.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);

  if (diffDays > 0) {
    return {
      state: "upcoming",
      days: diffDays,
      label: `Còn ${diffDays} ngày`,
      subLabel: `Ngày cưới: ${formatDateVi(ymd)}`,
    };
  }

  if (diffDays === 0) {
    return {
      state: "today",
      days: 0,
      label: "Hôm nay",
      subLabel: `Ngày trọng đại • ${formatDateVi(ymd)}`,
    };
  }

  return {
    state: "past",
    days: Math.abs(diffDays),
    label: `Đã qua ${Math.abs(diffDays)} ngày`,
    subLabel: `Đã tổ chức ngày ${formatDateVi(ymd)}`,
  };
}

function getLastWordInitial(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "";
  return parts[parts.length - 1].charAt(0).toUpperCase();
}

export function getCoupleMonogram(groomName, brideName, title) {
  const gInit = getLastWordInitial(groomName);
  const bInit = getLastWordInitial(brideName);
  if (gInit && bInit) return `${gInit} & ${bInit}`;

  const cleanedTitle = String(title || "")
    .replace(/^(lễ\s*cưới|đám\s*cưới|tiệc\s*cưới)\s+/i, "")
    .trim();
  const words = cleanedTitle.split(/[\s&]+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0].charAt(0).toUpperCase()} & ${words[words.length - 1]
      .charAt(0)
      .toUpperCase()}`;
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return "E & W";
}

export function buildPublicWeddingPath(slug) {
  const clean = String(slug || "").trim();
  return clean ? `everweb.vn/w/${clean}` : "everweb.vn/w/...";
}

export function buildPublicWeddingUrl(slug) {
  const clean = String(slug || "").trim();
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://everweb.vn";
  return clean ? `${origin}/w/${clean}` : origin;
}

export function buildQrCodeUrl(data, size = 300, margin = 0) {
  const marginParam = margin > 0 ? `&margin=${margin}` : "";
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}${marginParam}&data=${encodeURIComponent(
    String(data || "")
  )}`;
}

export const PENDING_WEDDING_STORAGE_KEY = "everweb_pending_wedding";

export function readCachedWedding() {
  try {
    const raw =
      sessionStorage.getItem(PENDING_WEDDING_STORAGE_KEY) ||
      localStorage.getItem(PENDING_WEDDING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeCachedWedding(wedding) {
  try {
    if (!wedding) {
      sessionStorage.removeItem(PENDING_WEDDING_STORAGE_KEY);
      localStorage.removeItem(PENDING_WEDDING_STORAGE_KEY);
      return;
    }
    const serialized = JSON.stringify(wedding);
    sessionStorage.setItem(PENDING_WEDDING_STORAGE_KEY, serialized);
    localStorage.setItem(PENDING_WEDDING_STORAGE_KEY, serialized);
  } catch {
    // ignore storage quota errors
  }
}

function buildShortName(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : "";
}

export function normalizeWedding(raw) {
  if (!raw || typeof raw !== "object") return null;

  const title = String(raw.title || "").trim() || "Hồ sơ cưới chưa đặt tên";
  const brideName = raw.bride_name ? String(raw.bride_name).trim() : "";
  const groomName = raw.groom_name ? String(raw.groom_name).trim() : "";
  const weddingDate = toDateInputValue(raw.wedding_date);
  const venueName = raw.venue_name ? String(raw.venue_name).trim() : "";
  const venueAddress = raw.venue_address ? String(raw.venue_address).trim() : "";
  const slug = String(raw.slug || "").trim().toLowerCase();
  const totalBudget = parseBudgetValue(raw.total_budget);
  const status = ALLOWED_WEDDING_STATUSES.includes(raw.status)
    ? raw.status
    : "draft";

  const shortGroom = buildShortName(groomName);
  const shortBride = buildShortName(brideName);
  const label =
    shortGroom && shortBride ? `${shortGroom} & ${shortBride}` : title;
  const couple =
    groomName && brideName
      ? `${groomName} & ${brideName}`
      : groomName || brideName || title;
  const hall = venueName || "Chưa cập nhật địa điểm";
  const time = formatDateVi(weddingDate) || "Chưa ấn định ngày cưới";

  const rawCount = raw._count || {};
  const counts = {
    guests: Number(rawCount.guests) || 0,
    tasks: Number(rawCount.tasks) || 0,
    expenses: Number(rawCount.expenses) || 0,
  };

  return {
    id: String(raw.id || ""),
    owner_id: raw.owner_id ? String(raw.owner_id) : null,
    title,
    bride_name: brideName,
    groom_name: groomName,
    wedding_date: weddingDate || null,
    venue_name: venueName,
    venue_address: venueAddress,
    slug,
    total_budget: totalBudget,
    status,
    _count: counts,
    invitations: raw.invitations
      ? { is_published: Boolean(raw.invitations.is_published) }
      : null,
    label,
    couple,
    hall,
    time,
  };
}

export function weddingToFormValues(wedding) {
  return {
    title: wedding?.title || "",
    groom_name: wedding?.groom_name || "",
    bride_name: wedding?.bride_name || "",
    wedding_date: toDateInputValue(wedding?.wedding_date),
    venue_name: wedding?.venue_name || "",
    venue_address: wedding?.venue_address || "",
    slug: wedding?.slug || "",
    total_budget:
      wedding?.total_budget !== undefined && wedding?.total_budget !== null
        ? Number(wedding.total_budget) || 0
        : 0,
    status: ALLOWED_WEDDING_STATUSES.includes(wedding?.status)
      ? wedding.status
      : "draft",
  };
}

export function validateWeddingForm(values) {
  const errors = {};
  const title = String(values?.title || "").trim();
  const groomName = String(values?.groom_name || "").trim();
  const brideName = String(values?.bride_name || "").trim();
  const weddingDate = String(values?.wedding_date || "").trim();
  const venueName = String(values?.venue_name || "").trim();
  const venueAddress = String(values?.venue_address || "").trim();
  const slug = String(values?.slug || "").trim().toLowerCase();
  const budget = Number(values?.total_budget);
  const status = String(values?.status || "draft");

  if (!title) {
    errors.title = "Vui lòng nhập tên lễ cưới.";
  } else if (title.length > 255) {
    errors.title = "Tên lễ cưới tối đa 255 ký tự.";
  }

  if (groomName.length > 255) {
    errors.groom_name = "Tên chú rể tối đa 255 ký tự.";
  }

  if (brideName.length > 255) {
    errors.bride_name = "Tên cô dâu tối đa 255 ký tự.";
  }

  if (weddingDate) {
    if (!DATE_INPUT_REGEX.test(weddingDate)) {
      errors.wedding_date = "Ngày cưới không đúng định dạng YYYY-MM-DD.";
    } else {
      const [y, m, d] = weddingDate.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      if (
        dt.getFullYear() !== y ||
        dt.getMonth() !== m - 1 ||
        dt.getDate() !== d
      ) {
        errors.wedding_date = "Ngày cưới không hợp lệ.";
      }
    }
  }

  if (venueName.length > 255) {
    errors.venue_name = "Tên địa điểm tối đa 255 ký tự.";
  }

  if (venueAddress.length > 255) {
    errors.venue_address = "Địa chỉ tổ chức tối đa 255 ký tự.";
  }

  if (!slug) {
    errors.slug = "Vui lòng nhập đường dẫn công khai (slug).";
  } else if (slug.length < 2) {
    errors.slug = "Đường dẫn công khai cần ít nhất 2 ký tự.";
  } else if (slug.length > 100) {
    errors.slug = "Đường dẫn công khai tối đa 100 ký tự.";
  } else if (!SLUG_REGEX.test(slug)) {
    errors.slug =
      "Chỉ dùng chữ thường không dấu (a-z), số (0-9) và dấu gạch nối (-).";
  } else if (RESERVED_SLUGS.includes(slug)) {
    errors.slug = "Đường dẫn này trùng với từ khoá hệ thống, vui lòng chọn tên khác.";
  }

  if (Number.isNaN(budget) || budget < 0) {
    errors.total_budget = "Ngân sách dự kiến không được nhỏ hơn 0.";
  } else if (budget > MAX_BUDGET) {
    errors.total_budget = "Ngân sách dự kiến vượt quá giới hạn cho phép.";
  }

  if (!ALLOWED_WEDDING_STATUSES.includes(status)) {
    errors.status = "Trạng thái hồ sơ không hợp lệ.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
