import {
  Bot,
  CalendarDays,
  Image,
  LayoutGrid,
  LayoutTemplate,
  Settings,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

export const DASHBOARD_NAV_ITEMS = [
  { key: "overview", label: "Tổng quan", icon: LayoutGrid, group: "workspace" },
  { key: "assistant", label: "Trợ lý cưới AI", icon: Bot, group: "workspace" },
  { key: "seating", label: "Sơ đồ sảnh", icon: LayoutTemplate, group: "workspace" },
  { key: "budget", label: "Ngân sách", icon: Wallet, group: "workspace" },
  { key: "guests", label: "Khách mời", icon: Users, group: "workspace" },
  { key: "services", label: "Dịch vụ", icon: Sparkles, group: "workspace" },
  { key: "schedule", label: "Lịch trình", icon: CalendarDays, group: "workspace" },
  { key: "album", label: "Album ảnh", icon: Image, group: "workspace" },
  { key: "settings", label: "Cài đặt", icon: Settings, group: "footer" },
];

export const SAMPLE_WEDDINGS = [
  {
    id: "w1",
    label: "Minh & An",
    couple: "Lê Cát Linh & Nam",
    hall: "Sảnh Hoa Mai",
    time: "18:00, 20/12/2026",
  },
  {
    id: "w2",
    label: "Khoa & Hà",
    couple: "Lê Minh Khoa & Phạm Thu Hà",
    hall: "White Palace",
    time: "11:30, 08/01/2027",
  },
  {
    id: "w3",
    label: "Anh & Mai",
    couple: "Hoàng Đức Anh & Võ Ngọc Mai",
    hall: "Riverside Palace",
    time: "18:30, 10/11/2026",
  },
];
