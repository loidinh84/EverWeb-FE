import {
  Eye,
  Image as ImageIcon,
  Layout,
  Palette,
  Sparkles,
  Type,
} from "lucide-react";
import galleryBouquet from "../../../assets/image/gallery-bouquet.jpg";
import galleryCeremony from "../../../assets/image/gallery-ceremony.jpg";
import galleryDining from "../../../assets/image/gallery-dining.jpg";
import heroWedding from "../../../assets/image/hero-wedding.jpg";
import { CLOUD_ASSETS } from "../../../constants/cloudAssets";

export const COLOR_THEMES = [
  {
    id: "woodgrain",
    name: "Gỗ Cổ Điển",
    outerBg: "#4A3423",
    outerPattern:
      "repeating-linear-gradient(180deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 10px), linear-gradient(135deg, #563C28 0%, #3E2A1B 50%, #4E3725 100%)",
    bg: "#EDE8E1",
    accent: "#5D4532",
    text: "#2C2117",
  },
  {
    id: "cobalt",
    name: "Xanh Hiện Đại",
    outerBg: "#E6EBF7",
    outerPattern: "linear-gradient(135deg, #E8EDFA 0%, #DCE3F5 100%)",
    bg: "#FAF8F5",
    accent: "#3B52DE",
    text: "#2C2117",
  },
  {
    id: "champagne",
    name: "Vàng Champagne",
    outerBg: "#EFE6D8",
    outerPattern: "linear-gradient(135deg, #F2EAE0 0%, #E7DBC9 100%)",
    bg: "#FAF6F0",
    accent: "#B88E44",
    text: "#3B2A1A",
  },
  {
    id: "sage",
    name: "Xanh Olive",
    outerBg: "#DDE4DA",
    outerPattern: "linear-gradient(135deg, #E2E8DF 0%, #CFD9CB 100%)",
    bg: "#F4F6F2",
    accent: "#5F7161",
    text: "#243025",
  },
  {
    id: "rose",
    name: "Hồng Phấn",
    outerBg: "#F5E2E5",
    outerPattern: "linear-gradient(135deg, #F8E8EB 0%, #EED5DA 100%)",
    bg: "#FDF6F6",
    accent: "#B85D6E",
    text: "#3B2127",
  },
];

export const FONT_OPTIONS = [
  { id: "cormorant", label: "Cormorant Garamond", style: '"Cormorant Garamond", Georgia, serif', tag: "Cổ điển" },
  { id: "playfair", label: "Playfair Display", style: '"Playfair Display", Georgia, serif', tag: "Sang trọng" },
  { id: "lora", label: "Lora", style: '"Lora", Georgia, serif', tag: "Thanh lịch" },
  { id: "merriweather", label: "Merriweather", style: '"Merriweather", Georgia, serif', tag: "Trang trọng" },
  { id: "vietnam", label: "Be Vietnam Pro", style: '"Be Vietnam Pro", sans-serif', tag: "Hiện đại" },
  { id: "montserrat", label: "Montserrat", style: '"Montserrat", sans-serif', tag: "Tối giản" },
  { id: "dancing", label: "Dancing Script", style: '"Dancing Script", cursive', tag: "Chữ ký" },
];

export const COVER_IMAGES = [
  { id: "hero", label: "Sảnh tiệc hoa", src: heroWedding },
  { id: "ceremony", label: "Cổng hoa ngoài trời", src: galleryCeremony },
  { id: "bouquet", label: "Hoa cưới cầm tay", src: galleryBouquet },
  { id: "dining", label: "Bàn tiệc tối", src: galleryDining },
  {
    id: "cloud-arch",
    label: "Cổng hoa kính (Cloud)",
    src: CLOUD_ASSETS.RSVP_ARCH_029,
  },
];

export const ART_STYLES = [
  { id: "lace", label: "Hoa ren góc cổ điển" },
  { id: "botanical", label: "Lá Botanical mềm mại" },
  { id: "deco", label: "Khung Art Deco" },
  { id: "minimal", label: "Viền tối giản" },
  { id: "none", label: "Không hoạ tiết" },
];

export const ART_COLORS = ["#FFFFFF", "#E5C687", "#3B52DE", "#5D4532"];

export const CSS_SNIPPETS = [
  {
    label: "Bo tròn ảnh Album",
    code: "#everweb-site-preview img { border-radius: 20px; }",
  },
  {
    label: "Nút RSVP đổ bóng nổi",
    code: "#everweb-site-preview .rsvp-cta-btn { box-shadow: 0 10px 25px rgba(59,82,222,0.35); transform: scale(1.04); }",
  },
  {
    label: "Tiêu đề giãn cách rộng",
    code: "#everweb-site-preview h3, #everweb-site-preview h4 { letter-spacing: 0.08em; }",
  },
];

export const INITIAL_PAGES = [
  { key: "welcome", label: "Chào mừng", visible: true },
  { key: "story", label: "Chuyện tình yêu", visible: true },
  { key: "schedule", label: "Lịch trình", visible: true },
  { key: "stay", label: "Nơi lưu trú", visible: true },
  { key: "party", label: "Phù dâu & Phù rể", visible: true },
  { key: "qa", label: "Hỏi đáp (Q&A)", visible: true },
  { key: "registry", label: "Quà mừng", visible: true },
  { key: "gallery", label: "Album ảnh", visible: true },
];

export const CHECKLIST = [
  "Chọn mẫu giao diện & bảng màu",
  "Chọn ảnh bìa & hoạ tiết góc",
  "Kiểm tra lịch trình ngày cưới",
  "Cập nhật địa điểm & lưu trú",
  "Xuất bản Website cưới",
];

export const DESIGN_TABS = [
  { key: "layout", label: "Bố cục & Ảnh bìa", icon: Layout },
  { key: "color", label: "Màu sắc", icon: Palette },
  { key: "font", label: "Phông chữ", icon: Type },
  { key: "art", label: "Hoạ tiết", icon: Sparkles },
  { key: "linkPreview", label: "Ảnh chia sẻ Link", icon: ImageIcon },
  { key: "pages", label: "Các trang hiển thị", icon: Eye },
  { key: "css", label: "Tuỳ chỉnh CSS", icon: Layout },
];
