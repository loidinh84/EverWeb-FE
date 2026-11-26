import beachHero from "../../assets/image/template-beach-hero.webp";
import beachThumb from "../../assets/image/template-beach-thumb.webp";
import weddingCouple from "../../assets/image/wedding-couple.jpg";
import slurpeeCouple from "../../assets/image/slurpee-couple.jpg";

export const INITIAL_INVITATION_DATA = {
  title: "LỄ THÀNH HÔN",
  groom_name: "Sơn Tùng",
  bride_name: "Như Ý",
  quote:
    "Ở thời điểm phù hợp nhất, mặc lên người bộ váy cưới đẹp nhất, gả cho người đáng tin cậy nhất.",
  groom_parents: "Ô. Nguyễn Văn Sơn & B. Lê Thị Tám",
  bride_parents: "Ô. Trần Thái & B. Vũ Thị Thạch",
  groom_address: "SN 73, Đường Đồng Quế, Phường Thạch Quý, TP. Hà Tĩnh",
  bride_address: "Đường Nguyễn Công Trứ, Phường Nam Hà, TP. Hà Tĩnh",
  wedding_date: "2026-11-13T11:00:00.000Z",
  wedding_date_display: "11:00 · THỨ SÁU, 13.11.2026",
  date_badge: "13.11.2026",
  lunar_date: "05 tháng 10 năm Bính Ngọ",
  venue_name: "Tư gia Nhà Trai",
  hall_name: "Sảnh Hoa Mai",
  venue_address: "Số 2, Đại Lộ Xô Viết Nghệ Tĩnh, TP. Hà Tĩnh",
  map_url: "https://maps.google.com/?q=So+2+Dai+Lo+Xo+Viet+Nghe+Tinh+Ha+Tinh",
  hero_photo: beachHero,
  groom_photo: slurpeeCouple,
  bride_photo: beachThumb,
  groom_bank: {
    bank_name: "Vietcombank",
    bank_id: "VCB",
    account_no: "",
    account_name: "",
  },
  bride_bank: {
    bank_name: "MB Bank",
    bank_id: "MB",
    account_no: "",
    account_name: "",
  },
  events: [
    {
      title: "LỄ THÀNH HÔN",
      time: "11:00 Thứ Sáu, 13.11.2026",
      venue: "Tư gia Nhà Trai - Sảnh Hoa Mai",
      address: "Số 2, Đại Lộ Xô Viết Nghệ Tĩnh, TP. Hà Tĩnh",
      photo: beachHero,
    },
    {
      title: "TIỆC CƯỚI NHÀ TRAI",
      time: "11:30 Thứ Sáu, 13.11.2026",
      venue: "Tư gia Nhà Trai",
      address: "SN 73, Đường Đồng Quế, TP. Hà Tĩnh",
      photo: beachThumb,
    },
    {
      title: "TIỆC CƯỚI NHÀ GÁI",
      time: "09:00 Thứ Năm, 12.11.2026",
      venue: "Tư gia Nhà Gái",
      address: "Đường Nguyễn Công Trứ, TP. Hà Tĩnh",
      photo: weddingCouple,
    },
  ],
  timeline: [
    { time: "10:30", label: "Đón khách", desc: "Đón tiếp quý khách & Chụp ảnh lưu niệm" },
    { time: "11:00", label: "Lễ thành hôn", desc: "Nghi thức hôn lễ trang trọng trước hai họ" },
    { time: "11:30", label: "Khai tiệc", desc: "Nâng ly chúc mừng và thưởng thức tiệc cưới" },
    { time: "12:30", label: "Chụp ảnh", desc: "Giao lưu âm nhạc và chụp ảnh kỷ niệm" },
  ],
};

export const INITIAL_WISHES = [];

export const INITIAL_GUEST_TRACKING = [];
