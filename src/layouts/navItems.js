import {
  Bot,
  CalendarDays,
  Heart,
  Image,
  LayoutGrid,
  LayoutTemplate,
  Settings,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { DASHBOARD_ALLOWED_ROLES } from "../constants/roles";

export const DASHBOARD_NAV_ITEMS = [
  { key: "overview", label: "Tổng quan", icon: LayoutGrid, group: "workspace", roles: DASHBOARD_ALLOWED_ROLES },
  { key: "profile", label: "Hồ sơ cặp đôi", icon: Heart, group: "workspace", roles: DASHBOARD_ALLOWED_ROLES },
  { key: "assistant", label: "Trợ lý cưới AI", icon: Bot, group: "workspace", roles: DASHBOARD_ALLOWED_ROLES },
  { key: "seating", label: "Sơ đồ sảnh", icon: LayoutTemplate, group: "workspace", roles: DASHBOARD_ALLOWED_ROLES },
  { key: "budget", label: "Ngân sách", icon: Wallet, group: "workspace", roles: DASHBOARD_ALLOWED_ROLES },
  { key: "guests", label: "Khách mời", icon: Users, group: "workspace", roles: DASHBOARD_ALLOWED_ROLES },
  { key: "services", label: "Dịch vụ", icon: Sparkles, group: "workspace", roles: DASHBOARD_ALLOWED_ROLES },
  { key: "schedule", label: "Lịch trình", icon: CalendarDays, group: "workspace", roles: DASHBOARD_ALLOWED_ROLES },
  { key: "album", label: "Album ảnh", icon: Image, group: "workspace", roles: DASHBOARD_ALLOWED_ROLES },
  { key: "settings", label: "Cài đặt", icon: Settings, group: "footer", roles: DASHBOARD_ALLOWED_ROLES },
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
