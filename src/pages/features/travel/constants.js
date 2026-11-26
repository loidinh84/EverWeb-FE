import { Building2, Coffee, Compass, Utensils } from "lucide-react";
import galleryDining from "../../../assets/image/gallery-dining.jpg";
import galleryCeremony from "../../../assets/image/gallery-ceremony.jpg";
import heroWedding from "../../../assets/image/hero-wedding.jpg";

export const INITIAL_HOTELS = [
  {
    id: "h1",
    name: "Lotte Hotel Saigon",
    stars: 5,
    distance: "Cách sảnh 0.8 km",
    address: "2A-4A Tôn Đức Thắng, Bến Nghé, Quận 1, TP.HCM",
    price: "2.450.000 đ / đêm",
    originalPrice: "3.200.000 đ",
    code: "EVERWEB20",
    phone: "028 3823 3333",
    isHostHotel: true,
    rating: "9.5",
    reviewCount: 420,
    amenities: ["Bữa sáng buffet", "Hồ bơi vô cực", "Đưa đón sân bay", "Check-in sớm"],
    image: heroWedding,
    bookingUrl: "https://www.lottehotel.com/saigon",
  },
  {
    id: "h2",
    name: "Sheraton Saigon Grand Opera Hotel",
    stars: 5,
    distance: "Cách sảnh 1.5 km",
    address: "88 Đồng Khởi, Bến Nghé, Quận 1, TP.HCM",
    price: "3.100.000 đ / đêm",
    originalPrice: "3.900.000 đ",
    code: "EVERWEB20",
    phone: "028 3827 2828",
    isHostHotel: false,
    rating: "9.4",
    reviewCount: 380,
    amenities: ["Gần phố đi bộ", "Nhà hàng 5 sao", "Spa & Gym cao cấp"],
    image: galleryDining,
    bookingUrl: "https://www.marriott.com/sheraton-saigon",
  },
  {
    id: "h3",
    name: "Silverland Sakyo Hotel & Spa",
    stars: 4,
    distance: "Cách sảnh 650 m",
    address: "10A Lê Thánh Tôn, Bến Nghé, Quận 1, TP.HCM",
    price: "1.350.000 đ / đêm",
    originalPrice: "1.800.000 đ",
    code: "EVERWEB20",
    phone: "028 3829 5295",
    isHostHotel: false,
    rating: "9.1",
    reviewCount: 290,
    amenities: ["Hồ bơi tầng thượng", "Trà chiều miễn phí", "Bồn tắm Onsen Nhật"],
    image: galleryCeremony,
    bookingUrl: "https://silverlandhotels.com/sakyo-hotel",
  },
];

export const INITIAL_SHUTTLES = [];

export const INITIAL_LOCAL_GUIDES = [
  {
    id: "g1",
    title: "Cà phê & Bánh ngọt L'Usine Đồng Khởi",
    category: "Cà phê check-in",
    distance: "Cách sảnh 400 m",
    highlight: "Không gian kiến trúc Pháp hoài niệm, trà đào cam sả và bánh croissant chuẩn vị.",
    address: "151 Đồng Khởi, Quận 1",
    icon: Coffee,
  },
  {
    id: "g2",
    title: "Bến Bạch Đằng & Du thuyền Waterbus",
    category: "Ngắm cảnh & Trải nghiệm",
    distance: "Cách sảnh 800 m",
    highlight: "Ngắm hoàng hôn sông Sài Gòn, bờ sông thoáng đãng cực đẹp vào buổi chiều tà.",
    address: "Bến Bạch Đằng, Tôn Đức Thắng, Quận 1",
    icon: Compass,
  },
  {
    id: "g3",
    title: "Nhà hàng Cơm Niêu Sài Gòn",
    category: "Ẩm thực truyền thống",
    distance: "Cách sảnh 1.2 km",
    highlight: "Đặc sản cơm đập biểu diễn nghệ thuật, cá kho tộ và canh cua rau đay chuẩn vị Nam Bộ.",
    address: "27 Tú Xương, Võ Thị Sáu, Quận 3",
    icon: Utensils,
  },
  {
    id: "g4",
    title: "Bưu điện Trung tâm & Nhà thờ Đức Bà",
    category: "Địa danh di sản",
    distance: "Cách sảnh 900 m",
    highlight: "Kiến trúc Gothic cổ điển biểu tượng Sài Gòn, điểm chụp ảnh lưu niệm không thể bỏ qua.",
    address: "Công xã Paris, Bến Nghé, Quận 1",
    icon: Building2,
  },
];

export const SAMPLE_GUEST_NEEDS = [];
