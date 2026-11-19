import heroWedding from "../assets/hero-wedding.jpg";
import galleryCeremony from "../assets/gallery-ceremony.jpg";
import galleryBouquet from "../assets/gallery-bouquet.jpg";
import galleryDining from "../assets/gallery-dining.jpg";

export const CHAPTER_NAV = [
  { id: "cover", label: "Bìa", href: "#cover" },
  { id: "pillars", label: "Công cụ", href: "#pillars" },
  { id: "lookbook", label: "Lookbook", href: "#lookbook" },
  { id: "journey", label: "Hành trình", href: "#journey" },
  { id: "pricing", label: "Gói cưới", href: "#pricing" },
];

export const COVER_PRESETS = [
  {
    id: "garden",
    label: "Sân vườn · 180 khách",
    guests: 180,
    tables: 18,
    budget: "250 triệu",
    vendors: "10 đối tác",
    aiTip: "Lễ hoàng hôn 16:30 giúp ánh sáng tự nhiên đẹp nhất và tiết kiệm đèn sân khấu.",
  },
  {
    id: "intimate",
    label: "Tiệc tối · 120 khách",
    guests: 120,
    tables: 12,
    budget: "165 triệu",
    vendors: "7 đối tác",
    aiTip: "Bàn tiệc dài kết hợp nến cao tạo cảm giác gần gũi và tối ưu chi phí hoa tươi.",
  },
  {
    id: "grand",
    label: "Đại tiệc · 300 khách",
    guests: 300,
    tables: 30,
    budget: "420 triệu",
    vendors: "14 đối tác",
    aiTip: "Nên khóa số bàn chính thức trước 21 ngày và chia hai cổng đón khách để tránh ùn ứ.",
  },
];

export const MARQUEE_ITEMS = [
  "Quản lý khách mời & sơ đồ bàn",
  "Dự toán ngân sách theo thời gian thực",
  "Tuyển chọn nhà cung cấp uy tín",
  "Trợ lý Chatbot AI đồng hành 24/7",
  "Kiểm soát RSVP hai họ minh bạch",
  "Đồng bộ kế hoạch cô dâu & chú rể",
];

export const GUEST_TABLES = [
  {
    id: "Bàn 01",
    group: "Gia đình nhà gái",
    confirmed: 10,
    capacity: 10,
    note: "Khu vực trung tâm · Thực đơn truyền thống",
  },
  {
    id: "Bàn 02",
    group: "Gia đình nhà trai",
    confirmed: 9,
    capacity: 10,
    note: "Khu vực trung tâm · 1 ghế dự phòng người lớn tuổi",
  },
  {
    id: "Bàn 03",
    group: "Bạn thân đại học",
    confirmed: 10,
    capacity: 10,
    note: "Gần sân khấu · Yêu cầu 2 suất ăn chay",
  },
  {
    id: "Bàn 04",
    group: "Đồng nghiệp cô dâu",
    confirmed: 8,
    capacity: 10,
    note: "Cánh trái sảnh · Chờ xác nhận 2 khách",
  },
  {
    id: "Bàn 05",
    group: "Đồng nghiệp chú rể",
    confirmed: 7,
    capacity: 10,
    note: "Cánh phải sảnh · Đã gửi nhắc RSVP",
  },
  {
    id: "Bàn 06",
    group: "Khách mời VIP",
    confirmed: 10,
    capacity: 10,
    note: "Hàng đầu · Kèm thiệp đón riêng",
  },
];

export const BUDGET_PRESETS = [150, 250, 400];

export const BUDGET_ALLOCATION = [
  { label: "Địa điểm & Tiệc", pct: 52, color: "#EC4899" },
  { label: "Trang trí & Hoa", pct: 18, color: "#F472B6" },
  { label: "Ảnh, Váy & Makeup", pct: 18, color: "#F9A8D4" },
  { label: "Dự phòng & Nghi lễ", pct: 12, color: "#9D174D" },
];

export const VENDOR_SHOWCASE = [
  {
    id: "atelier-garden",
    name: "Thảo Điền Garden Hall",
    category: "Sảnh tiệc ngoài trời",
    price: "Từ 6,8 triệu / bàn",
    rating: "4.9",
    style: "Sân vườn ánh nắng",
    image: galleryCeremony,
  },
  {
    id: "ivory-florals",
    name: "Ivory Floral Atelier",
    category: "Hoa cưới & Trang trí",
    price: "Từ 18 triệu / gói",
    rating: "5.0",
    style: "Hoa hồng vườn & lụa",
    image: galleryBouquet,
  },
  {
    id: "luxe-banquet",
    name: "Maison Ánh Nến",
    category: "Tiệc tối & Styling bàn",
    price: "Từ 8,5 triệu / bàn",
    rating: "4.8",
    style: "Tiệc tối ấm cúng",
    image: galleryDining,
  },
];

export const AI_SCENARIOS = [
  {
    id: "timeline",
    prompt: "6 tuần cuối cần ưu tiên gì?",
    question: "Còn 6 tuần nữa đến ngày cưới, tụi mình cần chốt gấp những đầu việc nào trước?",
    answer:
      "Ưu tiên theo thứ tự: (1) Gửi nhắc RSVP để khóa danh sách bàn trong 7 ngày tới, (2) Chốt thực đơn và sơ đồ âm thanh với sảnh tiệc vào tuần thứ 4, (3) Thử váy lần cuối và duyệt kịch bản MC trước ngày cưới 10 ngày.",
  },
  {
    id: "budget",
    prompt: "Tối ưu ngân sách 250 triệu",
    question: "Với 250 triệu cho 180 khách, nên phân bổ thế nào để tránh phát sinh?",
    answer:
      "Tỷ lệ an toàn nhất là dành 52% (130tr) cho sảnh tiệc và thực đơn, 18% (45tr) cho hoa tươi trang trí, 18% (45tr) cho ảnh cưới và trang phục, giữ nguyên 12% (30tr) làm quỹ dự phòng cố định.",
  },
  {
    id: "decor",
    prompt: "Gợi ý concept sân vườn",
    question: "Nên chọn hoa và ánh sáng thế nào cho lễ cưới ngoài trời buổi chiều?",
    answer:
      "Chọn tông kem ngà phối xanh lá ô-liu để hòa vào nền cỏ tự nhiên. Tổ chức nghi thức lúc 16:30 để đón nắng vàng dịu, sau đó chuyển sang nến trụ cao và dây đèn ấm cho tiệc tối.",
  },
];

export const LOOKBOOK_SLIDES = [
  {
    index: "01",
    title: "Sảnh tiệc ánh vàng",
    meta: "250–300 khách · Đèn chùm & hoa vòm",
    caption: "Không gian trần cao kết hợp cổng hoa kem ngà và dãy bàn tiệc dài thanh lịch.",
    image: heroWedding,
  },
  {
    index: "02",
    title: "Lễ cưới sân vườn",
    meta: "150–180 khách · Hoàng hôn 16:30",
    caption: "Cổng hoa hồng vườn đặt giữa lối đi sỏi trắng và hàng ghế gỗ tự nhiên.",
    image: galleryCeremony,
  },
  {
    index: "03",
    title: "Bó hoa lụa Ivory",
    meta: "Phụ kiện cô dâu · Tông kem hồng",
    caption: "Hoa hồng David Austin phối mẫu đơn hồng phấn cùng dải lụa thô mềm mại.",
    image: galleryBouquet,
  },
  {
    index: "04",
    title: "Tiệc tối ánh nến",
    meta: "80–120 khách · Pha lê & nến cao",
    caption: "Bàn tiệc khăn linen tự nhiên điểm nến sáp cao và dao dĩa đồng ánh mờ.",
    image: galleryDining,
  },
];

export const JOURNEY_MILESTONES = [
  {
    step: "01",
    title: "Khởi tạo hồ sơ cưới",
    desc: "Thiết lập ngày dự kiến, quy mô khách mời và tổng ngân sách để hệ thống tự dựng khung chuẩn bị.",
  },
  {
    step: "02",
    title: "Kết nối & phân bổ",
    desc: "Sắp xếp cụm bàn khách mời, chia tỷ lệ từng hạng mục chi phí và lưu chọn các nhà cung cấp ưng ý.",
  },
  {
    step: "03",
    title: "AI đồng hành đến ngày lễ",
    desc: "Theo dõi RSVP theo ngày, kiểm soát khoản đặt cọc và hỏi đáp trợ lý Chatbot AI bất kỳ lúc nào.",
  },
];

export const PRICING_TIERS = {
  featured: {
    name: "Trọn vẹn",
    badge: "Lựa chọn phổ biến",
    price: "499.000đ",
    period: "trọn gói 1 tiệc cưới",
    desc: "Mở khóa toàn bộ công cụ đồng bộ cho cả cô dâu và chú rể trong suốt hành trình chuẩn bị.",
    features: [
      "Không giới hạn khách mời & sơ đồ bàn",
      "Bảng ngân sách đa hạng mục & nhắc hạn cọc",
      "So sánh báo giá trực tiếp từ nhà cung cấp",
      "Trợ lý Chatbot AI hỏi đáp không giới hạn",
      "Đồng bộ tài khoản hai người dùng theo thời gian thực",
      "Xuất file danh sách bàn tiệc & chi phí tổng hợp",
    ],
  },
  companions: [
    {
      name: "Cơ bản",
      price: "Miễn phí",
      desc: "Phù hợp cho cặp đôi mới lên khung ý tưởng và danh sách sơ bộ.",
      features: [
        "Quản lý tối đa 150 khách mời",
        "Dự toán ngân sách tiêu chuẩn",
        "20 lượt tư vấn Chatbot AI mỗi ngày",
      ],
    },
    {
      name: "Đồng hành",
      price: "1.290.000đ",
      desc: "Dành cho tiệc cưới quy mô lớn cần tư vấn kịch bản chuyên sâu.",
      features: [
        "Toàn bộ quyền lợi gói Trọn vẹn",
        "AI gợi ý kịch bản nghi lễ & timeline riêng",
        "Ưu tiên kết nối lịch hẹn với đối tác chọn lọc",
      ],
    },
  ],
};
