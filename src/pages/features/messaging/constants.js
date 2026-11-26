import {
  Bed,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Users,
} from "lucide-react";
import weddingCouple from "../../../assets/image/wedding-couple.jpg";
import galleryBouquet from "../../../assets/image/gallery-bouquet.jpg";
import heroWedding from "../../../assets/image/hero-wedding.jpg";
import galleryCeremony from "../../../assets/image/gallery-ceremony.jpg";
import galleryDining from "../../../assets/image/gallery-dining.jpg";

export const QUICK_TEMPLATES = [
  {
    id: "text_blast",
    label: "Tin nhắn SMS",
    vietLabel: "Gửi hàng loạt",
    icon: MessageSquare,
    color: "text-[#8B5CF6]",
    cardBg: "bg-[#F8F9FB] hover:bg-[#F2F4F8]",
    deliveryMethod: "text",
    subject: "Tin nhắn thông báo tiệc cưới",
    headline: "Đám cưới của tụi mình sắp diễn ra!",
    message:
      "Chào bạn, ngày trọng đại của tụi mình sắp đến rồi! Mọi thông tin chi tiết về địa điểm và lịch trình đã được cập nhật đầy đủ trên trang cưới. Bạn nhớ ghé xem nhé!",
    buttonText: "Xem trang cưới & Lịch trình",
    linkUrl: "https://everweb.vn/wedding/event-info",
  },
  {
    id: "email",
    label: "Email thông báo",
    vietLabel: "Thư điện tử",
    icon: Mail,
    color: "text-[#F97316]",
    cardBg: "bg-[#F8F9FB] hover:bg-[#F2F4F8]",
    deliveryMethod: "email",
    subject: "Tin tức mới nhất về ngày vui của tụi mình",
    headline: "Chúng mình rất vui được chia sẻ thông tin này đến bạn",
    message:
      "Tụi mình vô cùng hạnh phúc khi được chuẩn bị cho ngày trọng đại. Rất mong sẽ được gặp gỡ và chia sẻ niềm vui trọn vẹn cùng bạn và gia đình trong ngày chung đôi sắp tới!",
    buttonText: "Xem chi tiết sự kiện",
    linkUrl: "https://everweb.vn/wedding/invitation",
  },
  {
    id: "collect_contacts",
    label: "Thu thập liên hệ",
    vietLabel: "Xin SĐT & địa chỉ",
    icon: Users,
    color: "text-[#F43F5E]",
    cardBg: "bg-[#F8F9FB] hover:bg-[#F2F4F8]",
    deliveryMethod: "both",
    subject: "Cập nhật địa chỉ nhận thiệp cưới",
    headline: "Hãy gửi thông tin để tụi mình gửi thiệp cưới đến bạn nhé!",
    message:
      "Để chuẩn bị chu đáo nhất cho ngày vui sắp tới, tụi mình đang hoàn thiện danh sách gửi thiệp mời. Bạn vui lòng dành 1 phút chia sẻ địa chỉ nhận thiệp và số điện thoại nhé.",
    buttonText: "Cập nhật địa chỉ nhận thiệp",
    linkUrl: "https://everweb.vn/contact-collector",
  },
  {
    id: "hotel",
    label: "Nhắc đặt khách sạn",
    vietLabel: "Phòng nghỉ ưu đãi",
    icon: Bed,
    color: "text-[#3B82F6]",
    cardBg: "bg-[#F8F9FB] hover:bg-[#F2F4F8]",
    deliveryMethod: "email",
    subject: "Gợi ý khách sạn & xe đưa đón tiệc cưới",
    headline: "Bạn đã đặt phòng khách sạn cho ngày cưới chưa?",
    message:
      "Tụi mình đã liên hệ với các khách sạn gần địa điểm tổ chức tiệc cưới để có chính sách giá ưu đãi nhất cho bạn bè và người thân. Hãy đặt phòng sớm trước khi hết chỗ nhé!",
    buttonText: "Xem danh sách khách sạn ưu đãi",
    linkUrl: "https://everweb.vn/accommodations",
  },
  {
    id: "stay_details",
    label: "Thông tin nơi ở",
    vietLabel: "Cập nhật lưu trú",
    icon: MapPin,
    color: "text-[#6366F1]",
    cardBg: "bg-[#F8F9FB] hover:bg-[#F2F4F8]",
    deliveryMethod: "email",
    subject: "Bạn đã đặt phòng chưa? - Cập nhật nơi ở",
    headline: "Cập nhật thông tin lưu trú của bạn",
    message:
      "Dù bạn đã đặt phòng hay vẫn đang lựa chọn, hãy chia sẻ thông tin nơi ở cùng tụi mình để tụi mình tiện sắp xếp xe đưa đón và tiếp đón chu đáo nhất nhé.",
    buttonText: "Chia sẻ nơi ở của bạn",
    linkUrl: "https://everweb.vn/stay-details",
  },
  {
    id: "rsvp_reminder",
    label: "Nhắc xác nhận RSVP",
    vietLabel: "Chốt khách tham dự",
    icon: CheckCircle2,
    color: "text-[#EC4899]",
    cardBg: "bg-[#F8F9FB] hover:bg-[#F2F4F8]",
    deliveryMethod: "both",
    subject: "Nhắc nhở xác nhận tham dự tiệc cưới",
    headline: "Đừng quên xác nhận tham dự trước ngày chốt tiệc nhé!",
    message:
      "Chỉ còn ít ngày nữa là đến hạn chốt danh sách số lượng khách và bàn tiệc. Bạn nhớ bấm xác nhận tham dự để tụi mình đón tiếp bạn thật chu đáo nhé!",
    buttonText: "Xác nhận tham dự (RSVP)",
    linkUrl: "https://everweb.vn/rsvp",
  },
];

export const PAPER_DIGITAL_CARDS = [
  { title: "Báo hỷ ngày cưới", subtitle: "Save the Date", image: heroWedding },
  { title: "Thiệp mời chính thức", subtitle: "Thiệp cưới đại lễ", image: weddingCouple },
  { title: "Sơ đồ & Chỉ đường", subtitle: "Hướng dẫn sảnh tiệc", image: galleryBouquet },
  { title: "Thực đơn & Lịch trình", subtitle: "Chi tiết ngày cưới", image: galleryDining },
  { title: "Thiệp cảm ơn", subtitle: "Tri ân khách mời", image: galleryCeremony },
  { title: "Biển đón & Lời chúc", subtitle: "Đón tiếp sảnh tiệc", image: heroWedding },
];
