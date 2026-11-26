export const PROMO_CONFIG = Object.freeze({
  code: "MUACUOI25",
  discountPercent: 25,
  label: "Ưu đãi mùa cưới",
  description: "Giảm 25% các mẫu thiệp số & website cưới cao cấp",
  extraCodes: {
    MUACUOI25: {
      code: "MUACUOI25",
      discountPercent: 25,
      label: "Ưu đãi mùa cưới (-25%)",
    },
    EVERWEB10: {
      code: "EVERWEB10",
      discountPercent: 10,
      label: "Mã bạn bè (-10%)",
    },
  },
});

export const BILLING_CYCLES = Object.freeze({
  EVENT: {
    id: "event",
    label: "Theo 1 Sự kiện",
    sublabel: "Lưu trữ 6 tháng",
    multiplier: 1,
  },
  LIFETIME: {
    id: "lifetime",
    label: "Lưu trữ Vĩnh viễn",
    sublabel: "Trọn đời kỷ niệm",
    multiplier: 1.45,
  },
});

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Cơ Bản",
    tagline: "Khởi tạo nhanh cho tiệc nhỏ & trải nghiệm",
    badge: null,
    popular: false,
    basePrice: 0,
    ctaText: "Bắt đầu miễn phí",
    accentColor: "#6B5E52",
    limits: {
      maxGuests: 50,
      aiDailyQuota: 10,
      customDomain: false,
      removeBranding: false,
      personalizedLinks: false,
    },
    highlights: [
      "1 Website cưới & 1 Thiệp số cơ bản",
      "Quản lý tối đa 50 khách mời & RSVP",
      "1 tài khoản VietQR Hộp mừng cưới",
      "Trợ lý AI EverWeb (10 lượt hỏi/ngày)",
      "Hiển thị chữ ký EverWeb ở chân trang",
    ],
  },
  {
    id: "pro",
    name: "Pro — Mùa Cưới",
    tagline: "Đầy đủ công cụ cho 90% cặp đôi Việt Nam",
    badge: "Phổ biến nhất",
    popular: true,
    basePrice: 499000,
    ctaText: "Chọn gói Pro",
    accentColor: "#3B52DE",
    limits: {
      maxGuests: Infinity,
      aiDailyQuota: 100,
      customDomain: false,
      removeBranding: true,
      personalizedLinks: true,
    },
    highlights: [
      "Mở khóa toàn bộ Website & Thiệp số cao cấp (N00 Biển, Gỗ Cổ Điển...)",
      "Không giới hạn khách mời, RSVP & xuất Excel",
      "Tạo không giới hạn link thiệp cá nhân hóa theo tên khách",
      "Hộp mừng cưới VietQR đủ 2 họ Nhà Trai & Nhà Gái",
      "AI tự động xếp bàn tiệc & lập ngân sách cưới",
      "Ẩn hoàn toàn logo EverWeb trên thiệp của bạn",
    ],
  },
  {
    id: "vip",
    name: "VIP — Trọn Gói",
    tagline: "Đẳng cấp riêng biệt, hỗ trợ 1-1 & tên miền riêng",
    badge: "Cao cấp",
    popular: false,
    basePrice: 999000,
    ctaText: "Chọn gói VIP",
    accentColor: "#C5A059",
    limits: {
      maxGuests: Infinity,
      aiDailyQuota: Infinity,
      customDomain: true,
      removeBranding: true,
      personalizedLinks: true,
    },
    highlights: [
      "Bao gồm toàn bộ tính năng của gói Pro — Mùa Cưới",
      "Tặng Tên miền riêng (.vn / .com) hoặc link rút gọn độc quyền",
      "Gửi thông báo & nhắc lịch RSVP hàng loạt tự động",
      "Thống kê chi tiết từng khách đã mở link nhưng chưa phản hồi",
      "Trợ lý AI không giới hạn lượt & hỗ trợ thiết kế riêng 1-1",
      "Lưu trữ Album ảnh cưới độ phân giải gốc",
    ],
  },
];

export const COMPARISON_GROUPS = [
  {
    category: "Thiết kế Website & Thiệp cưới số",
    rows: [
      {
        label: "Kho mẫu Website & Thiệp số cao cấp (N00, Botanical...)",
        free: "Mẫu cơ bản",
        pro: "Toàn bộ mẫu",
        vip: "Toàn bộ + Thiết kế riêng",
      },
      {
        label: "Link thiệp cá nhân hóa tên từng khách (?guest=...)",
        free: false,
        pro: true,
        vip: true,
      },
      {
        label: "Ẩn logo & chữ ký EverWeb ở chân thiệp",
        free: false,
        pro: true,
        vip: true,
      },
      {
        label: "Tên miền riêng (.vn / .com) & link rút gọn đẹp",
        free: false,
        pro: false,
        vip: true,
      },
    ],
  },
  {
    category: "Khách mời, RSVP & Mừng cưới",
    rows: [
      {
        label: "Số lượng khách mời quản lý & thu thập RSVP",
        free: "Tối đa 50 khách",
        pro: "Không giới hạn",
        vip: "Không giới hạn",
      },
      {
        label: "Thống kê lượt xem link & khách chưa phản hồi RSVP",
        free: "Cơ bản",
        pro: "Chi tiết theo khách",
        vip: "Chi tiết + Nhắc lịch tự động",
      },
      {
        label: "Hộp mừng cưới VietQR thông minh",
        free: "1 tài khoản",
        pro: "2 họ (Trai & Gái)",
        vip: "2 họ + Tùy biến giao diện",
      },
    ],
  },
  {
    category: "Cố vấn Cưới AI & Hậu cần",
    rows: [
      {
        label: "AI lập Checklist & phân bổ Ngân sách",
        free: "10 lượt/ngày",
        pro: "100 lượt/ngày",
        vip: "Không giới hạn",
      },
      {
        label: "AI tự động xếp chỗ vào sơ đồ bàn tiệc",
        free: false,
        pro: true,
        vip: true,
      },
      {
        label: "Hỗ trợ kỹ thuật ưu tiên 1-1 trước ngày cưới",
        free: "Qua cộng đồng",
        pro: "Qua Zalo / Chat",
        vip: "Chuyên viên riêng 24/7",
      },
    ],
  },
];

export const PRICING_FAQS = [
  {
    q: "Tôi có thể tạo thử miễn phí trước khi quyết định nâng cấp không?",
    a: "Hoàn toàn được! Bạn có thể dùng Gói Cơ Bản 0đ để tạo sự kiện, thử thiết kế Website cưới, Thiệp số và chia sẻ cho tối đa 50 khách. Khi cần mở khóa mẫu cao cấp hoặc mời nhiều khách hơn, bạn chỉ cần nâng cấp và toàn bộ dữ liệu cũ vẫn được giữ nguyên.",
  },
  {
    q: "Thanh toán một lần hay phải trả phí hàng tháng?",
    a: "EverWeb thiết kế gói thanh toán 1 lần duy nhất cho toàn bộ mùa cưới của bạn (không tự động gia hạn ẩn). Bạn có thể chọn gói Theo 1 Sự kiện (lưu trữ 6 tháng) hoặc gói Lưu trữ Vĩnh viễn để giữ kỷ niệm trọn đời.",
  },
  {
    q: "Mã giảm giá 25% mùa cưới áp dụng như thế nào?",
    a: "Mã MUACUOI25 được tự động áp dụng ngay khi bạn chọn gói Pro hoặc VIP trong mùa cưới hiện tại, giúp giảm trực tiếp 25% trên tổng giá trị đơn hàng.",
  },
  {
    q: "Khách mời của tôi có cần tải app hay đăng nhập để xem thiệp không?",
    a: "Không cần. Khách mời chỉ cần bấm vào đường link hoặc quét mã QR bằng Camera/Zalo là có thể mở phong bì thiệp, nghe nhạc, xem bản đồ, gửi RSVP và mừng cưới ngay trên trình duyệt.",
  },
];

export const SUBSCRIPTION_STORAGE_KEY = "everweb_active_subscription";

export function getCyclePrice(basePrice, cycleId = "event") {
  if (!basePrice) return 0;
  const cycle =
    Object.values(BILLING_CYCLES).find((c) => c.id === cycleId) ||
    BILLING_CYCLES.EVENT;
  return Math.round((basePrice * cycle.multiplier) / 1000) * 1000;
}

export function calculateDiscountedPrice(price, discountPercent = 0) {
  if (!price) return 0;
  const raw = price * (1 - discountPercent / 100);
  return Math.round(raw / 1000) * 1000;
}

export function formatVnd(amount) {
  if (!amount) return "0đ";
  return `${amount.toLocaleString("vi-VN")}đ`;
}

export function getActiveSubscription() {
  try {
    const raw = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveActiveSubscription(subscription) {
  try {
    localStorage.setItem(
      SUBSCRIPTION_STORAGE_KEY,
      JSON.stringify({
        ...subscription,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch {
    // ignore storage errors
  }
}

