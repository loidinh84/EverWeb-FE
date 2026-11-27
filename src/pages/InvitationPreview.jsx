import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  Navigation,
  Users,
  Check,
  X,
  MessageSquare,
  Volume2,
  VolumeX,
  Copy,
  Sparkles,
  Menu,
  Gift,
  Camera,
  Upload,
  RotateCcw,
  QrCode,
  Share2,
  Globe,
  Eye,
  ExternalLink,
  Download,
  Send,
  Search,
  HeartHandshake,
  FileEdit,
  UserCheck,
  Mail,
} from "lucide-react";
import { Modal, useToast } from "../components/common";
import { ROUTE_PATHS } from "../constants/roles";
import {
  INVITATION_TEMPLATES,
  getInvitationTemplateById,
} from "../constants/invitationTemplates";
import { getGuestInvitation, getGuests } from "../services/guestApi.js";
import weddingApi from "../services/weddingApi.js";
import uploadApi from "../services/uploadApi.js";

// Import ảnh chất lượng cao từ assets EverWeb & ảnh mẫu ngoại cảnh biển N00
import beachHero from "../assets/image/template-beach-hero.webp";
import beachThumb from "../assets/image/template-beach-thumb.webp";
import weddingCouple from "../assets/image/wedding-couple.jpg";
import heroWedding from "../assets/image/hero-wedding.jpg";
import galleryCeremony from "../assets/image/gallery-ceremony.jpg";
import galleryDining from "../assets/image/gallery-dining.jpg";
import galleryBouquet from "../assets/image/gallery-bouquet.jpg";
import slurpeeCouple from "../assets/image/slurpee-couple.jpg";
import {
  INITIAL_GUEST_TRACKING,
  INITIAL_INVITATION_DATA,
  INITIAL_WISHES,
} from "./invitation/constants";
import { compressImageFile } from "./invitation/imageUtils";
import InvitationToolbar from "./invitation/InvitationToolbar";
import EnvelopeIntro from "./invitation/EnvelopeIntro";
import TemplateLayouts from "./invitation/TemplateLayouts";

export default function InvitationPreview() {
  const navigate = useNavigate();
  const toast = useToast();
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = paramToken || searchParams.get("token");

  // Âm thanh nền đám cưới du dương
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  // Hiệu ứng mở phong bì thiệp cưới tương tác
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false);

  // Menu Speed-dial góc dưới phải (Image 1) & Modal Danh mục thiệp cưới (Image 2)
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  // Modal QR Mừng cưới (Bấm vào để mở ra popup)
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [activeGiftTab, setActiveGiftTab] = useState("groom"); // "groom" | "bride"

  // Modal Phóng to ảnh (Lightbox) & Modal Chọn mẫu thiệp điện tử & Kho ảnh Cloudinary
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [cloudinaryPhotos, setCloudinaryPhotos] = useState([]);
  const [cloudinaryTargetField, setCloudinaryTargetField] = useState(null);
  const [isLoadingCloudinary, setIsLoadingCloudinary] = useState(false);

  const openCloudinaryPicker = async (field) => {
    setCloudinaryTargetField(field);
    if (cloudinaryPhotos.length > 0) return;
    setIsLoadingCloudinary(true);
    try {
      const imgs = await uploadApi.getCloudinaryImages("everweb/images");
      setCloudinaryPhotos(Array.isArray(imgs) ? imgs : []);
    } catch {
      toast.error("Không thể tải ảnh từ thư mục everweb/images trên Cloudinary.");
    } finally {
      setIsLoadingCloudinary(false);
    }
  };

  // Hidden File Inputs cho việc thay ảnh nhanh trực tiếp
  const heroFileInputRef = useRef(null);
  const groomFileInputRef = useRef(null);
  const brideFileInputRef = useRef(null);

  const location = useLocation();

  // 1. Lấy thông tin sự kiện cưới hiện tại (active wedding)
  // Ưu tiên: location.state?.wedding -> sessionStorage -> localStorage
  const activeWedding = useMemo(() => {
    if (location.state?.wedding) return location.state.wedding;
    try {
      const pending = sessionStorage.getItem("everweb_pending_wedding");
      if (pending) {
        const parsed = JSON.parse(pending);
        if (parsed) return parsed;
      }
      const recent = localStorage.getItem("everweb_recent_wedding");
      if (recent) {
        const parsed = JSON.parse(recent);
        if (parsed) return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }, [location.state?.wedding]);

  // Đồng bộ sự kiện & cấu hình Thiệp số (stationery_config) từ Database PostgreSQL
  const paramWeddingId = searchParams.get("weddingId");
  const paramSlug = searchParams.get("slug");
  const [serverWedding, setServerWedding] = useState(null);

  useEffect(() => {
    let cancelled = false;
    weddingApi
      .getPublicInvitation({
        weddingId: activeWedding?.id || paramWeddingId || undefined,
        slug: activeWedding?.slug || paramSlug || undefined,
      })
      .then((res) => {
        if (cancelled || !res) return;
        if (!activeWedding && res.wedding) {
          setServerWedding(res.wedding);
        }
        if (res.customCard) {
          setCustomCard(res.customCard);
          try {
            localStorage.setItem(
              "everweb_custom_invitation_card",
              JSON.stringify(res.customCard)
            );
          } catch {
            // ignore quota errors
          }
        }
      })
      .catch(() => {
        if (activeWedding) return;
        weddingApi
          .getAll()
          .then((items) => {
            if (!cancelled && Array.isArray(items) && items.length > 0) {
              setServerWedding(items[0]);
            }
          })
          .catch(() => {});
      });
    return () => {
      cancelled = true;
    };
  }, [activeWedding, paramWeddingId, paramSlug]);

  const currentWedding = activeWedding || serverWedding;

  // 2. Tự động phân tích tên Chú Rể & Cô Dâu từ sự kiện đã chọn
  // Hỗ trợ mọi định dạng: groom_name/bride_name riêng biệt, hoặc từ title/couple:
  // "Lợi Đinh và Bích Trâm", "Lợi Đinh & Bích Trâm", "Lợi Đinh - Bích Trâm"
  const eventCoupleNames = useMemo(() => {
    if (!currentWedding) return null;

    let groom = (currentWedding.groom_name || "").trim();
    let bride = (currentWedding.bride_name || "").trim();

    if (!groom || !bride) {
      const rawTitle = (
        currentWedding.title ||
        currentWedding.couple ||
        ""
      ).trim();
      const separators = [" và ", " & ", " - ", " + ", " and "];
      for (const sep of separators) {
        if (rawTitle.includes(sep)) {
          const parts = rawTitle.split(sep);
          if (parts.length >= 2) {
            if (!groom) groom = parts[0].trim();
            if (!bride) bride = parts.slice(1).join(sep).trim();
            break;
          }
        }
      }
      if (!groom && !bride && rawTitle) {
        groom = rawTitle;
      }
    }

    return {
      groom: groom || null,
      bride: bride || null,
      title:
        currentWedding.title ||
        (groom && bride ? `${groom} & ${bride}` : "LỄ THÀNH HÔN"),
      venue_name: currentWedding.venue_name || null,
      venue_address: currentWedding.venue_address || null,
      wedding_date: currentWedding.wedding_date || null,
    };
  }, [currentWedding]);

  // 3. Tải customCard đã lưu
  const [customCard, setCustomCard] = useState(() => {
    try {
      const saved = localStorage.getItem("everweb_custom_invitation_card");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Kiểm tra customCard có thuộc về sự kiện hiện tại không
  const isCustomCardForThisEvent = useMemo(() => {
    if (!customCard) return false;
    if (customCard.wedding_id && currentWedding?.id) {
      return customCard.wedding_id === currentWedding.id;
    }
    // Nếu customCard có tên chú rể trùng với sự kiện hiện tại
    if (eventCoupleNames?.groom && customCard.groom_name) {
      return (
        customCard.groom_name.toLowerCase() ===
        eventCoupleNames.groom.toLowerCase()
      );
    }
    return false;
  }, [customCard, currentWedding?.id, eventCoupleNames?.groom]);

  // Mẫu thiệp điện tử đang chọn (hỗ trợ param ?template=... hoặc lưu trong customCard)
  const paramTemplateId = searchParams.get("template");
  const activeTemplate = useMemo(
    () =>
      getInvitationTemplateById(
        paramTemplateId ||
          (isCustomCardForThisEvent ? customCard?.template_id : null) ||
          customCard?.template_id
      ),
    [paramTemplateId, isCustomCardForThisEvent, customCard?.template_id]
  );

  // 4. Tổng hợp dữ liệu đám cưới hiển thị trên thiệp:
  // Luôn ưu tiên tên cô dâu chú rể từ sự kiện đã chọn ("Lợi Đinh và Bích Trâm")!
  const wedding = useMemo(() => {
    const resolvedGroom =
      (isCustomCardForThisEvent && customCard?.groom_name) ||
      eventCoupleNames?.groom ||
      INITIAL_INVITATION_DATA.groom_name;

    const resolvedBride =
      (isCustomCardForThisEvent && customCard?.bride_name) ||
      eventCoupleNames?.bride ||
      INITIAL_INVITATION_DATA.bride_name;

    const resolvedTitle =
      (isCustomCardForThisEvent && customCard?.title) ||
      eventCoupleNames?.title ||
      INITIAL_INVITATION_DATA.title;

    const resolvedDate =
      (isCustomCardForThisEvent && customCard?.wedding_date) ||
      eventCoupleNames?.wedding_date ||
      INITIAL_INVITATION_DATA.wedding_date;

    const resolvedVenue =
      (isCustomCardForThisEvent && customCard?.venue_name) ||
      eventCoupleNames?.venue_name ||
      INITIAL_INVITATION_DATA.venue_name;

    const resolvedAddress =
      (isCustomCardForThisEvent && customCard?.venue_address) ||
      eventCoupleNames?.venue_address ||
      INITIAL_INVITATION_DATA.venue_address;

    // Chuẩn hóa tên viết hoa cho tài khoản ngân hàng mừng cưới
    const groomUpper = resolvedGroom
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toUpperCase();

    const brideUpper = resolvedBride
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toUpperCase();

    // Format ngày cưới hiển thị
    let dateDisplay = INITIAL_INVITATION_DATA.wedding_date_display;
    let dateBadge = INITIAL_INVITATION_DATA.date_badge;
    if (resolvedDate) {
      try {
        const d = new Date(resolvedDate);
        if (!isNaN(d.getTime())) {
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          dateBadge = `${day}.${month}.${year}`;
          const weekdayNames = [
            "CHỦ NHẬT",
            "THỨ HAI",
            "THỨ BA",
            "THỨ TƯ",
            "THỨ NĂM",
            "THỨ SÁU",
            "THỨ BẢY",
          ];
          const weekday = weekdayNames[d.getDay()] || "THỨ SÁU";
          dateDisplay = `11:00 · ${weekday}, ${dateBadge}`;
        }
      } catch {
        // keep default
      }
    }

    return {
      title: resolvedTitle,
      groom_name: resolvedGroom,
      bride_name: resolvedBride,
      quote: customCard?.quote || INITIAL_INVITATION_DATA.quote,
      hero_photo:
        (isCustomCardForThisEvent && customCard?.hero_photo) ||
        activeTemplate.defaultPhotos.hero_photo,
      groom_photo:
        (isCustomCardForThisEvent && customCard?.groom_photo) ||
        activeTemplate.defaultPhotos.groom_photo,
      bride_photo:
        (isCustomCardForThisEvent && customCard?.bride_photo) ||
        activeTemplate.defaultPhotos.bride_photo,
      groom_parents:
        customCard?.groom_parents || INITIAL_INVITATION_DATA.groom_parents,
      bride_parents:
        customCard?.bride_parents || INITIAL_INVITATION_DATA.bride_parents,
      groom_address:
        customCard?.groom_address ||
        resolvedAddress ||
        INITIAL_INVITATION_DATA.groom_address,
      bride_address:
        customCard?.bride_address || INITIAL_INVITATION_DATA.bride_address,
      wedding_date: resolvedDate,
      wedding_date_display: customCard?.wedding_date_display || dateDisplay,
      date_badge: customCard?.date_badge || dateBadge,
      lunar_date: customCard?.lunar_date || INITIAL_INVITATION_DATA.lunar_date,
      venue_name: resolvedVenue,
      hall_name: customCard?.hall_name || INITIAL_INVITATION_DATA.hall_name,
      venue_address: resolvedAddress,
      map_url: customCard?.map_url || INITIAL_INVITATION_DATA.map_url,
      groom_bank: {
        bank_name:
          customCard?.groom_bank?.bank_name ||
          INITIAL_INVITATION_DATA.groom_bank.bank_name,
        bank_id:
          customCard?.groom_bank?.bank_id ||
          INITIAL_INVITATION_DATA.groom_bank.bank_id,
        account_no:
          customCard?.groom_bank?.account_no ||
          INITIAL_INVITATION_DATA.groom_bank.account_no,
        account_name:
          (isCustomCardForThisEvent && customCard?.groom_bank?.account_name) ||
          groomUpper ||
          INITIAL_INVITATION_DATA.groom_bank.account_name,
      },
      bride_bank: {
        bank_name:
          customCard?.bride_bank?.bank_name ||
          INITIAL_INVITATION_DATA.bride_bank.bank_name,
        bank_id:
          customCard?.bride_bank?.bank_id ||
          INITIAL_INVITATION_DATA.bride_bank.bank_id,
        account_no:
          customCard?.bride_bank?.account_no ||
          INITIAL_INVITATION_DATA.bride_bank.account_no,
        account_name:
          (isCustomCardForThisEvent && customCard?.bride_bank?.account_name) ||
          brideUpper ||
          INITIAL_INVITATION_DATA.bride_bank.account_name,
      },
      events: customCard?.events || [
        {
          title: "LỄ THÀNH HÔN",
          time: `11:00 ${dateBadge}`,
          venue: resolvedVenue || "Tư gia Nhà Trai - Sảnh Hoa Mai",
          address:
            resolvedAddress || "Số 2, Đại Lộ Xô Viết Nghệ Tĩnh, TP. Hà Tĩnh",
          photo:
            customCard?.hero_photo || INITIAL_INVITATION_DATA.events[0].photo,
        },
        {
          title: "TIỆC CƯỚI NHÀ TRAI",
          time: `11:30 ${dateBadge}`,
          venue: resolvedVenue || "Tư gia Nhà Trai",
          address: resolvedAddress || "SN 73, Đường Đồng Quế, TP. Hà Tĩnh",
          photo:
            customCard?.bride_photo || INITIAL_INVITATION_DATA.events[1].photo,
        },
        {
          title: "TIỆC CƯỚI NHÀ GÁI",
          time: "09:00 Ngày hôm trước",
          venue: "Tư gia Nhà Gái",
          address: "Đường Nguyễn Công Trứ, TP. Hà Tĩnh",
          photo: INITIAL_INVITATION_DATA.events[2].photo,
        },
      ],
      timeline: customCard?.timeline || INITIAL_INVITATION_DATA.timeline,
    };
  }, [eventCoupleNames, customCard, isCustomCardForThisEvent, activeTemplate]);

  const [invitationGuest, setInvitationGuest] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  // Form RSVP state theo đúng giao diện Image 1 của người dùng
  const [rsvpFullName, setRsvpFullName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpRelation, setRsvpRelation] = useState("ban_be"); // "nha_trai" | "nha_gai" | "ban_be"
  const [rsvpStatus, setRsvpStatus] = useState("attending"); // "attending" | "declined"
  const [attendingCount, setAttendingCount] = useState(1);
  const [mealPreference, setMealPreference] = useState("man"); // "man" | "chay"
  const [dietaryNote, setDietaryNote] = useState("");
  const [wish, setWish] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [wishesList, setWishesList] = useState(INITIAL_WISHES);

  // Modal chỉnh sửa thiệp
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(wedding);

  // Cập nhật editForm mỗi khi thông tin wedding sự kiện thay đổi
  useEffect(() => {
    setEditForm(wedding);
  }, [wedding]);

  // Modal Xuất bản & Lấy Link QR Thiệp Cưới
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeShareTab, setActiveShareTab] = useState("public"); // "public" | "personalized"
  const [personalizedName, setPersonalizedName] = useState("Anh Hoàng Nam & Bạn gái");

  // Modal Thống kê Lượt xem & Khách chưa phản hồi RSVP
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [statsFilter, setStatsFilter] = useState("viewed_not_responded"); // "viewed_not_responded" | "not_opened" | "attending" | "declined" | "all"
  const [statsSearch, setStatsSearch] = useState("");

  // Trạng thái xuất bản thiệp (Live / Draft)
  const [isPublished, setIsPublished] = useState(() => {
    try {
      const saved = localStorage.getItem("everweb_invitation_published");
      return saved !== "false";
    } catch {
      return true;
    }
  });

  // Số lượt xem/nhấp vào link thiệp cưới (tự động tăng khi mở trang)
  const [viewCount] = useState(() => {
    try {
      const saved = localStorage.getItem("everweb_invitation_view_count");
      const current = saved ? parseInt(saved, 10) : 168;
      const hasRecorded = sessionStorage.getItem("everweb_invitation_viewed");
      if (!hasRecorded) {
        sessionStorage.setItem("everweb_invitation_viewed", "true");
        const next = current + 1;
        localStorage.setItem("everweb_invitation_view_count", next.toString());
        return next;
      }
      return current;
    } catch {
      return 168;
    }
  });

  // Danh sách dữ liệu theo dõi khách (tự động cập nhật trạng thái đã xem nếu có param ?guest=)
  const [trackingGuests] = useState(() => {
    try {
      const saved = localStorage.getItem("everweb_guest_tracking");
      const list = saved ? JSON.parse(saved) : INITIAL_GUEST_TRACKING;
      const guestParam = new URLSearchParams(window.location.search).get("guest");
      if (guestParam) {
        const idx = list.findIndex(
          (g) => g.name.toLowerCase() === guestParam.toLowerCase()
        );
        if (idx >= 0) {
          list[idx] = {
            ...list[idx],
            hasOpened: true,
            lastOpenedAt: "Vừa xong",
            viewsCount: (list[idx].viewsCount || 0) + 1,
          };
        } else {
          list.unshift({
            id: `gt-${Date.now()}`,
            name: guestParam,
            role: "Khách mời",
            phone: "Chưa cập nhật",
            group: "Khách mời",
            status: "pending",
            hasOpened: true,
            lastOpenedAt: "Vừa xong",
            viewsCount: 1,
          });
        }
        localStorage.setItem("everweb_guest_tracking", JSON.stringify(list));
      }
      return list;
    } catch {
      return INITIAL_GUEST_TRACKING;
    }
  });

  // Kiểm tra chế độ xem: Chế độ Khách (Guest View) vs Chế độ Quản trị / Chỉnh sửa (Editor Mode)
  // Khách xem thiệp khi truy cập link có token, hoặc có ?view=true, ?mode=view, ?guest=...
  const isGuestMode = Boolean(
    token ||
    searchParams.get("view") === "true" ||
    searchParams.get("mode") === "view" ||
    searchParams.has("guest")
  );

  // Đường link thiệp cưới công khai xuất bản (Dành cho khách mời - không có thanh công cụ & nút sửa)
  const publicInvitationUrl = useMemo(() => {
    const widQuery = currentWedding?.id
      ? `&weddingId=${encodeURIComponent(currentWedding.id)}`
      : "";
    return `${window.location.origin}/invitation?view=true${widQuery}`;
  }, [currentWedding?.id]);

  // Đường link thiệp cưới cá nhân hóa theo tên khách
  const personalizedInvitationUrl = useMemo(() => {
    const cleanName = (personalizedName || "").trim();
    const widQuery = currentWedding?.id
      ? `&weddingId=${encodeURIComponent(currentWedding.id)}`
      : "";
    return cleanName
      ? `${window.location.origin}/invitation?view=true${widQuery}&guest=${encodeURIComponent(cleanName)}`
      : publicInvitationUrl;
  }, [personalizedName, publicInvitationUrl, currentWedding?.id]);

  // Mã QR công khai & cá nhân hóa (Dẫn thẳng tới bản thiệp xuất bản sạch đẹp cho khách)
  const publicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=12&data=${encodeURIComponent(
    publicInvitationUrl
  )}`;
  const personalizedQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=12&data=${encodeURIComponent(
    personalizedInvitationUrl
  )}`;

  // Toggle xuất bản thiệp cưới
  const togglePublish = () => {
    const nextState = !isPublished;
    setIsPublished(nextState);
    try {
      localStorage.setItem("everweb_invitation_published", nextState.toString());
    } catch (e) {
      console.error(e);
    }
    if (nextState) {
      toast.success("Thiệp cưới đã được XUẤT BẢN công khai! Khách mời có thể truy cập qua link và mã QR.");
    } else {
      toast.info("Đã chuyển thiệp cưới về chế độ Bản nháp riêng tư.");
    }
  };

  // Tải mã QR về máy (PNG)
  const handleDownloadQr = async (qrUrl, filename) => {
    try {
      toast.info("Đang tải ảnh mã QR về máy...");
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename || `QR-Thiep-Cuoi-${wedding.groom_name}-${wedding.bride_name}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Đã tải mã QR thành công!");
    } catch (e) {
      console.error(e);
      window.open(qrUrl, "_blank");
      toast.info("Đã mở ảnh mã QR trong tab mới để lưu.");
    }
  };

  // Tải danh sách khách mời thật từ Neon DB cho popup Thống kê RSVP
  const [realDbGuests, setRealDbGuests] = useState(null);
  useEffect(() => {
    if (!currentWedding?.id || isGuestMode) return;
    let cancelled = false;
    getGuests(currentWedding.id)
      .then((rows) => {
        if (!cancelled && Array.isArray(rows)) {
          setRealDbGuests(rows);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [currentWedding?.id, isGuestMode]);

  const effectiveTrackingGuests = useMemo(() => {
    if (Array.isArray(realDbGuests) && realDbGuests.length > 0) {
      return realDbGuests.map((row) => ({
        id: row.id,
        name: row.full_name,
        role: row.group?.name || "Khách mời",
        phone: row.phone || "Chưa cập nhật",
        group: row.group?.side === "bride" ? "Nhà gái" : "Nhà trai",
        status:
          row.rsvp_status === "accepted" || row.rsvp_status === "attending"
            ? "attending"
            : row.rsvp_status === "declined"
            ? "declined"
            : "pending",
        attendingCount: (Number(row.max_companions) || 0) + 1,
        hasOpened: row.rsvp_status !== "pending",
        lastOpenedAt: row.rsvp_status !== "pending" ? "Đã phản hồi" : "Chưa mở",
        viewsCount: row.rsvp_status !== "pending" ? 1 : 0,
      }));
    }
    return trackingGuests;
  }, [realDbGuests, trackingGuests]);

  // Tính toán thống kê khách & RSVP (từ Neon DB nếu có, fallback dữ liệu mẫu)
  const guestStats = useMemo(() => {
    if (Array.isArray(realDbGuests)) {
      const total = realDbGuests.length;
      const attending = realDbGuests.filter(
        (g) => g.rsvp_status === "accepted" || g.rsvp_status === "attending"
      ).length;
      const declined = realDbGuests.filter(
        (g) => g.rsvp_status === "declined"
      ).length;
      const pending = realDbGuests.filter(
        (g) => g.rsvp_status === "pending"
      ).length;
      const viewedNotResponded = 0;
      const notOpened = pending;
      const responseRate =
        total > 0 ? Math.round(((attending + declined) / total) * 100) : 0;

      return {
        total,
        attending,
        declined,
        pending,
        viewedNotResponded,
        notOpened,
        responseRate,
      };
    }

    const total = 142;
    const attending = 85;
    const declined = 12;
    const pending = 45;
    const viewedNotResponded = 28;
    const notOpened = 17;
    const responseRate = Math.round(((attending + declined) / total) * 100);

    return {
      total,
      attending,
      declined,
      pending,
      viewedNotResponded,
      notOpened,
      responseRate,
    };
  }, [realDbGuests]);

  // Lọc danh sách khách theo tab & từ khóa tìm kiếm
  const filteredTrackingGuests = useMemo(() => {
    return effectiveTrackingGuests.filter((g) => {
      if (statsSearch.trim()) {
        const q = statsSearch.toLowerCase();
        const matchName = g.name.toLowerCase().includes(q);
        const matchPhone = (g.phone || "").toLowerCase().includes(q);
        const matchGroup = (g.group || "").toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchGroup) return false;
      }

      if (statsFilter === "viewed_not_responded") {
        return g.status === "pending" && g.hasOpened;
      }
      if (statsFilter === "not_opened") {
        return !g.hasOpened;
      }
      if (statsFilter === "attending") {
        return g.status === "attending";
      }
      if (statsFilter === "declined") {
        return g.status === "declined";
      }
      return true; // "all"
    });
  }, [effectiveTrackingGuests, statsFilter, statsSearch]);

  // Đồng hồ đếm ngược ngày cưới
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(wedding.wedding_date || "2026-11-13T11:00:00.000Z").getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [wedding.wedding_date]);

  // Tải thông tin khách nếu có token
  useEffect(() => {
    if (!token) return;

    getGuestInvitation(token)
      .then((res) => {
        const guest = res.data?.guest;
        if (guest) {
          setInvitationGuest(guest);
          setRsvpFullName(guest.full_name || "");
          setRsvpPhone(guest.phone || "");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Không thể tìm thấy thiệp mời này.");
        setLoading(false);
      });
  }, [token]);

  // Xử lý mở phong thư tương tác
  const handleOpenEnvelope = () => {
    setIsOpeningAnimation(true);
    try {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlayingAudio(true);
        }).catch(() => {
          setIsPlayingAudio(false);
        });
      }
    } catch {
      // ignore audio errors
    }

    setTimeout(() => {
      setIsEnvelopeOpened(true);
      setIsOpeningAnimation(false);
    }, 600);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(() => {
        toast.info("Vui lòng chạm vào màn hình để bật nhạc nền.");
      });
    }
  };

  const copyToClipboard = (text, message = "Đã sao chép vào bộ nhớ tạm!") => {
    navigator.clipboard?.writeText(text);
    toast.success(message);
  };

  const scrollToSection = (id) => {
    setIsSpeedDialOpen(false);
    setIsCatalogModalOpen(false);
    if (!isEnvelopeOpened) setIsEnvelopeOpened(true);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Lưu cấu hình thiệp số vào cả localStorage và Database (stationery_config)
  const persistCustomCard = async (updated) => {
    setCustomCard(updated);
    try {
      localStorage.setItem(
        "everweb_custom_invitation_card",
        JSON.stringify(updated)
      );
    } catch {
      // ignore quota errors
    }
    if (currentWedding?.id) {
      await weddingApi
        .updateFeatureSection(currentWedding.id, "stationery_config", {
          customCard: updated,
        })
        .catch(() => {});
    }
  };

  // Đổi mẫu giao diện thiệp điện tử (N00, N01, N02, N03) & lưu vào Database
  const handleSelectTemplate = async (tpl) => {
    const updated = {
      ...(customCard || {}),
      wedding_id: currentWedding?.id || null,
      template_id: tpl.id,
    };
    await persistCustomCard(updated);
    setIsTemplateModalOpen(false);
    toast.success(`Đã đổi sang mẫu "${tpl.code} - ${tpl.name}"!`);
  };

  // Xử lý thay đổi ảnh nhanh trực tiếp từ giao diện
  const handleQuickImageUpload = async (file, photoKey) => {
    if (!file) return;
    try {
      toast.info("Đang xử lý ảnh...");
      const compressedDataUrl = await compressImageFile(file);
      const updated = {
        ...wedding,
        ...customCard,
        wedding_id: currentWedding?.id || null,
        [photoKey]: compressedDataUrl,
      };
      await persistCustomCard(updated);
      toast.success("Đã cập nhật & lưu ảnh lên hệ thống thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải ảnh lên. Vui lòng thử lại!");
    }
  };

  const guestName =
    invitationGuest?.full_name ||
    searchParams.get("guest") ||
    "Quý Khách";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF7] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#D4A034]/30 border-t-[#D4A034] animate-spin" />
          <p className="text-stone-700 font-display italic text-lg">
            Đang mở thiệp cưới...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFCF7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-stone-200">
          <div className="w-12 h-12 bg-rose-50 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <X className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-display font-semibold text-stone-900">
            Không Thể Mở Thiệp
          </h2>
          <p className="text-stone-600 mt-2 text-sm leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  // VietQR Links
  const groomQrUrl = `https://img.vietqr.io/image/${wedding.groom_bank.bank_id}-${wedding.groom_bank.account_no}-compact2.png?amount=0&addInfo=${encodeURIComponent(
    `Mung cuoi ${wedding.groom_name} va ${wedding.bride_name}`
  )}&accountName=${encodeURIComponent(wedding.groom_bank.account_name)}`;

  const brideQrUrl = `https://img.vietqr.io/image/${wedding.bride_bank.bank_id}-${wedding.bride_bank.account_no}-compact2.png?amount=0&addInfo=${encodeURIComponent(
    `Mung cuoi ${wedding.groom_name} va ${wedding.bride_name}`
  )}&accountName=${encodeURIComponent(wedding.bride_bank.account_name)}`;

  return (
    <div
      className="min-h-screen text-[#221F1C] selection:bg-amber-100 selection:text-stone-900 relative font-sans transition-colors duration-500"
      style={{ backgroundColor: activeTemplate.pageBg }}
    >
      {/* Audio Element cho nhạc nền cưới */}
      <audio
        ref={audioRef}
        loop
        src="https://s3-hcm-r2.s3cloud.vn/thiepcuoi-mehappy/audio-templates/custom/1929/363f8830-f18c-4328-86d4-2fc843e20951.mp3"
        preload="auto"
      />

      {/* Hidden File Inputs cho việc thay ảnh nhanh trực tiếp */}
      <input
        type="file"
        ref={heroFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleQuickImageUpload(e.target.files[0], "hero_photo")}
      />
      <input
        type="file"
        ref={groomFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleQuickImageUpload(e.target.files[0], "groom_photo")}
      />
      <input
        type="file"
        ref={brideFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleQuickImageUpload(e.target.files[0], "bride_photo")}
      />

      {/* ============================================================
          THANH CÔNG CỤ DÀNH CHO CÔ DÂU CHÚ RỂ (NỔI PHÍA TRÊN)
          CHỈ HIỂN THỊ TRONG CHẾ ĐỘ QUẢN TRỊ / CHỈNH SỬA (!isGuestMode)
          ============================================================ */}
      {!isGuestMode && (
        <InvitationToolbar
          navigate={navigate}
          wedding={wedding}
          isPublished={isPublished}
          publicInvitationUrl={publicInvitationUrl}
          activeTemplate={activeTemplate}
          onOpenShare={() => setIsShareModalOpen(true)}
          onOpenStats={() => setIsStatsModalOpen(true)}
          onOpenTemplates={() => setIsTemplateModalOpen(true)}
          onOpenEdit={() => {
            setEditForm(wedding);
            setIsEditOpen(true);
          }}
        />
      )}

      {/* ============================================================
          MÀN HÌNH 1: BÌA PHONG THƯ HOA & CON DẤU SÁP
          ============================================================ */}
      {!isEnvelopeOpened && (
        <EnvelopeIntro
          guestName={guestName}
          dateBadge={wedding.date_badge}
          isOpeningAnimation={isOpeningAnimation}
          onOpenEnvelope={handleOpenEnvelope}
          template={activeTemplate}
          wedding={wedding}
        />
      )}

      {/* ============================================================
          MÀN HÌNH 2: NỘI DUNG THIỆP (RENDER THEO TỪNG BỐ CỤC MẪU)
          ============================================================ */}
      {isEnvelopeOpened && (
        <main className="max-w-[420px] w-full mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden pb-24 animate-fade-in">
          {activeTemplate.layoutType !== "beach" ? (
            <TemplateLayouts
              template={activeTemplate}
              wedding={wedding}
              guestName={guestName}
              timeLeft={timeLeft}
              isGuestMode={isGuestMode}
              onUploadHero={() => heroFileInputRef.current?.click()}
              onUploadGroom={() => groomFileInputRef.current?.click()}
              onUploadBride={() => brideFileInputRef.current?.click()}
              onSelectPhoto={setSelectedPhoto}
              onCloseEnvelope={() => setIsEnvelopeOpened(false)}
            />
          ) : (
            <>
          {/* Header: Nắp phong bì mở phía trên */}
          <div
            className="w-full border-b border-[#E8E2D5] py-4 px-6 text-center relative"
            style={{ backgroundColor: activeTemplate.accentSoft }}
          >
            <button
              type="button"
              onClick={() => setIsEnvelopeOpened(false)}
              className="hover:underline font-medium inline-flex items-center gap-1 cursor-pointer text-xs"
              style={{ color: activeTemplate.accent }}
            >
              <span>← Đóng lại phong bì thiệp</span>
            </button>
          </div>

          {/* 1. KHỐI ẢNH CƯỚI BÌA CHÍNH (HERO PHOTO: SƠN TÙNG & NHƯ Ý TRÙM KHĂN VOAN) */}
          <section id="cover-section" className="relative w-full aspect-[9/13] overflow-hidden bg-stone-900 group">
            <img
              src={wedding.hero_photo}
              alt="Ảnh cưới bìa chính"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/35" />

            {/* Nút đổi ảnh bìa nhanh (cho cặp đôi khi xem thiệp) */}
            {!isGuestMode && (
              <button
                type="button"
                onClick={() => heroFileInputRef.current?.click()}
                className="absolute bottom-3 right-3 bg-black/60 hover:bg-black text-white px-2.5 py-1.5 rounded-full text-[11px] backdrop-blur-md flex items-center gap-1.5 cursor-pointer shadow-lg z-20 transition"
                title="Thay ảnh bìa chính"
              >
                <Camera size={13} />
                <span>Đổi ảnh bìa</span>
              </button>
            )}

            <div className="absolute top-8 left-0 right-0 text-center px-4 z-10 text-white space-y-2">
              <h2 className="text-4xl sm:text-5xl font-['Dancing_Script'] font-semibold drop-shadow-md">
                {wedding.groom_name} & {wedding.bride_name}
              </h2>
              <p className="text-xs sm:text-sm font-sans font-normal leading-relaxed drop-shadow max-w-[280px] mx-auto opacity-95">
                {wedding.quote}
              </p>
            </div>
          </section>

          {/* 2. THE MOMENTS (KHOẢNH KHẮC NGOẠI CẢNH BIỂN) */}
          <section id="moments-section" className="py-8 px-4 bg-white text-center">
            <h2 className="text-3xl sm:text-4xl font-['Dancing_Script'] font-semibold text-[#1F1B18] mb-6">
              The Moments
            </h2>

            {/* 2 Cột chân dung: Chú rể bên biển & Cô dâu bên biển */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="relative group">
                <div
                  onClick={() => setSelectedPhoto(wedding.groom_photo)}
                  className="aspect-[3/4] rounded-lg overflow-hidden cursor-pointer bg-stone-100"
                >
                  <img
                    src={wedding.groom_photo}
                    alt="Chú rể"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {!isGuestMode && (
                  <button
                    type="button"
                    onClick={() => groomFileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full text-xs shadow-md z-20 cursor-pointer"
                    title="Đổi ảnh Chú rể"
                  >
                    <Camera size={12} />
                  </button>
                )}
                <p className="text-[11px] font-medium text-stone-600 mt-1.5">
                  Chú rể ({wedding.groom_name})
                </p>
              </div>

              <div className="relative group">
                <div
                  onClick={() => setSelectedPhoto(wedding.bride_photo)}
                  className="aspect-[3/4] rounded-lg overflow-hidden cursor-pointer bg-stone-100"
                >
                  <img
                    src={wedding.bride_photo}
                    alt="Cô dâu"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {!isGuestMode && (
                  <button
                    type="button"
                    onClick={() => brideFileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full text-xs shadow-md z-20 cursor-pointer"
                    title="Đổi ảnh Cô dâu"
                  >
                    <Camera size={12} />
                  </button>
                )}
                <p className="text-[11px] font-medium text-stone-600 mt-1.5">
                  Cô dâu ({wedding.bride_name})
                </p>
              </div>
            </div>
          </section>

          {/* 3. KHỐI CỔNG VÒM (ARCH CARDS - SỰ KIỆN CƯỚI) */}
          <section
            id="arch-events-section"
            className="py-8 px-4 border-t border-[#EAE5D9]"
            style={{ backgroundColor: activeTemplate.accentSoft }}
          >
            <div
              className="w-full text-white py-4 rounded-t-full text-center mb-6 shadow-xs"
              style={{ backgroundColor: activeTemplate.bannerBg }}
            >
              <p className="text-[10px] uppercase tracking-[0.25em] font-medium opacity-90">
                Wedding Celebration
              </p>
              <h3 className="text-xl font-display font-semibold mt-0.5">
                Sự Kiện Cưới
              </h3>
            </div>

            <div className="space-y-6">
              {wedding.events.map((ev, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-[#EAE5D9] shadow-xs text-center space-y-3"
                >
                  <div className="w-36 h-44 mx-auto rounded-t-full overflow-hidden border border-stone-200 shadow-xs">
                    <img
                      src={ev.photo}
                      alt={ev.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-base text-stone-900 tracking-wide">
                      {ev.title}
                    </h4>
                    <p className="text-xs font-semibold text-[#8C6D3F]">
                      {ev.time}
                    </p>
                    <p className="text-xs text-stone-700 font-medium">
                      {ev.venue}
                    </p>
                    <p className="text-[11px] text-stone-500 leading-tight">
                      {ev.address}
                    </p>
                  </div>

                  <div className="pt-1">
                    <a
                      href={wedding.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-700 hover:text-black border border-stone-300 px-3.5 py-1.5 rounded-full shadow-2xs transition"
                    >
                      <Navigation size={11} />
                      <span>Xem chỉ đường</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. BANNER BIỂN TỐI SANG TRỌNG - TIMELINE & BẢN ĐỒ MINI */}
          <section id="dark-timeline-section" className="relative bg-[#1A232D] text-white py-12 px-5 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <img src={heroWedding} alt="Dark Ocean" className="w-full h-full object-cover" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-1">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#D5C19A] font-medium">
                  Program Schedule
                </p>
                <h3 className="text-2xl font-['Dancing_Script'] font-semibold">
                  Lịch Trình Hôn Lễ
                </h3>
              </div>

              <div className="space-y-4 max-w-xs mx-auto">
                {wedding.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-[#EAD8B1] font-bold text-xs">
                      {item.time}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-stone-300">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl overflow-hidden p-2 shadow-lg max-w-xs mx-auto text-stone-900">
                <div className="w-full h-32 bg-stone-100 rounded-lg flex items-center justify-center text-xs text-stone-500 border border-stone-200 relative overflow-hidden">
                  <iframe
                    title="Bản đồ chỉ đường"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.0!2d105.9!3d18.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDE4JzAwLjAiTiAxMDXCsDU0JzAwLjAiRQ!5e0!3m2!1svi!2s!4v1"
                    className="w-full h-full border-0 pointer-events-none opacity-85"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <a
                      href={wedding.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md text-stone-900 hover:bg-stone-50"
                    >
                      Mở Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. WEDDING COUNTDOWN & DẢI ẢNH POLAROID */}
          <section id="countdown-section" className="py-8 px-4 text-center bg-[#FAF9F5] border-b border-[#EAE5D9]">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C6D3F] font-semibold mb-3">
              Wedding Countdown
            </p>

            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-6">
              <div className="bg-white p-2.5 rounded-xl border border-[#DFD8C8] shadow-2xs">
                <span className="block text-xl font-display font-bold text-stone-900">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] uppercase text-stone-500 font-medium">
                  Ngày
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#DFD8C8] shadow-2xs">
                <span className="block text-xl font-display font-bold text-stone-900">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] uppercase text-stone-500 font-medium">
                  Giờ
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#DFD8C8] shadow-2xs">
                <span className="block text-xl font-display font-bold text-stone-900">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] uppercase text-stone-500 font-medium">
                  Phút
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#DFD8C8] shadow-2xs">
                <span className="block text-xl font-display font-bold text-stone-900">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] uppercase text-stone-500 font-medium">
                  Giây
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              <div onClick={() => setSelectedPhoto(beachHero)} className="aspect-[3/4] rounded-lg overflow-hidden border border-stone-200 shadow-2xs cursor-pointer">
                <img src={beachHero} alt="Photo 1" className="w-full h-full object-cover" />
              </div>
              <div onClick={() => setSelectedPhoto(weddingCouple)} className="aspect-[3/4] rounded-lg overflow-hidden border border-stone-200 shadow-2xs cursor-pointer">
                <img src={weddingCouple} alt="Photo 2" className="w-full h-full object-cover" />
              </div>
              <div onClick={() => setSelectedPhoto(beachThumb)} className="aspect-[3/4] rounded-lg overflow-hidden border border-stone-200 shadow-2xs cursor-pointer">
                <img src={beachThumb} alt="Photo 3" className="w-full h-full object-cover" />
              </div>
            </div>
          </section>

          {/* 6. DẢI BANNER TỐI MÀU (OUR STORY / KỶ NIỆM TÌNH YÊU) */}
          <section
            id="our-story-section"
            className="text-white py-10 px-4"
            style={{ backgroundColor: activeTemplate.bannerBg }}
          >
            <div className="text-center space-y-1 mb-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-300 font-medium">
                Memories
              </p>
              <h3 className="text-3xl font-['Dancing_Script'] font-semibold">
                Our Story
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-w-xs mx-auto">
              <div onClick={() => setSelectedPhoto(galleryBouquet)} className="aspect-[4/5] rounded-lg overflow-hidden border border-white/20 shadow-md cursor-pointer">
                <img src={galleryBouquet} alt="Story 1" className="w-full h-full object-cover" />
              </div>
              <div onClick={() => setSelectedPhoto(galleryCeremony)} className="aspect-[4/5] rounded-lg overflow-hidden border border-white/20 shadow-md cursor-pointer">
                <img src={galleryCeremony} alt="Story 2" className="w-full h-full object-cover" />
              </div>
              <div onClick={() => setSelectedPhoto(beachThumb)} className="aspect-[4/5] rounded-lg overflow-hidden border border-white/20 shadow-md cursor-pointer">
                <img src={beachThumb} alt="Story 3" className="w-full h-full object-cover" />
              </div>
              <div onClick={() => setSelectedPhoto(beachHero)} className="aspect-[4/5] rounded-lg overflow-hidden border border-white/20 shadow-md cursor-pointer">
                <img src={beachHero} alt="Story 4" className="w-full h-full object-cover" />
              </div>
            </div>
          </section>

          {/* 7. TRIPTYCH 3 KHUNG ẢNH DỌC (3 VERTICAL FLOATING CARDS) */}
          <section className="py-8 px-4 bg-white text-center border-b border-[#EAE5D9]">
            <div className="flex justify-center items-center gap-2 max-w-xs mx-auto">
              <div onClick={() => setSelectedPhoto(weddingCouple)} className="w-24 aspect-[2/3] rounded-lg overflow-hidden shadow-md -rotate-3 cursor-pointer">
                <img src={weddingCouple} alt="Triptych 1" className="w-full h-full object-cover" />
              </div>
              <div onClick={() => setSelectedPhoto(beachHero)} className="w-28 aspect-[2/3] rounded-lg overflow-hidden shadow-xl z-10 cursor-pointer">
                <img src={beachHero} alt="Triptych 2" className="w-full h-full object-cover" />
              </div>
              <div onClick={() => setSelectedPhoto(galleryDining)} className="w-24 aspect-[2/3] rounded-lg overflow-hidden shadow-md rotate-3 cursor-pointer">
                <img src={galleryDining} alt="Triptych 3" className="w-full h-full object-cover" />
              </div>
            </div>
          </section>
            </>
          )}

          {/* 8. FORM XÁC NHẬN THAM DỰ (RSVP CHUẨN IMAGE 1) */}
          <section id="rsvp-section" className="p-6 bg-[#FAF9F5] border-b border-[#EAE5D9]">
            <div className="text-center mb-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C6D3F] font-semibold">
                Hôn lễ {wedding.groom_name} & {wedding.bride_name}
              </p>
              <h3 className="text-2xl font-display font-bold text-stone-900 mt-1">
                Xác nhận tham dự hôn lễ
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {wedding.date_badge} · {wedding.hall_name}
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-white border border-[#DFD8C8] rounded-xl p-6 text-center space-y-2 shadow-xs">
                <CheckCircle2 className="w-9 h-9 text-[#8C6D3F] mx-auto" />
                <h4 className="text-base font-display font-bold text-stone-900">
                  Gửi phản hồi thành công!
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Cảm ơn <strong>{rsvpFullName || guestName}</strong> đã gửi phản hồi. Chúng mình rất mong chờ được đón tiếp bạn trong ngày vui!
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-[#8C6D3F] hover:underline pt-2 font-medium cursor-pointer"
                >
                  Gửi lại phản hồi khác
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!rsvpFullName.trim()) {
                    toast.error("Vui lòng nhập họ và tên của bạn");
                    return;
                  }
                  if (wish.trim()) {
                    setWishesList([
                      {
                        name: rsvpFullName,
                        time: "Vừa xong",
                        relation:
                          rsvpRelation === "nha_trai"
                            ? "Nhà trai"
                            : rsvpRelation === "nha_gai"
                            ? "Nhà gái"
                            : "Bạn bè",
                        content: wish.trim(),
                      },
                      ...wishesList,
                    ]);
                  }
                  setIsSubmitted(true);
                  toast.success("Đã ghi nhận phản hồi tham dự của bạn!");
                }}
                className="space-y-4 text-xs bg-white p-4 rounded-2xl border border-stone-200 shadow-xs"
              >
                {/* 1. Thông tin của bạn */}
                <div className="space-y-2.5">
                  <label className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
                    <Users size={13} className="text-[#8C6D3F]" />
                    <span>1. Thông tin của bạn</span>
                  </label>

                  <div className="space-y-2">
                    <div>
                      <span className="block text-[11px] text-stone-600 mb-1">
                        Họ và tên của bạn *
                      </span>
                      <input
                        type="text"
                        required
                        value={rsvpFullName}
                        onChange={(e) => setRsvpFullName(e.target.value)}
                        placeholder="VD: Nguyễn Văn Anh"
                        className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-stone-900 bg-[#FAF9F5]"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-stone-600 mb-1">
                        Số điện thoại di động *
                      </span>
                      <input
                        type="tel"
                        required
                        value={rsvpPhone}
                        onChange={(e) => setRsvpPhone(e.target.value)}
                        placeholder="VD: 0909 123 456"
                        className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-stone-900 bg-[#FAF9F5]"
                      />
                    </div>
                  </div>

                  {/* Mối quan hệ */}
                  <div>
                    <span className="block text-[11px] text-stone-600 mb-1.5">
                      Mối quan hệ với cô dâu chú rể
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "nha_trai", label: "Nhà trai" },
                        { id: "nha_gai", label: "Nhà gái" },
                        { id: "ban_be", label: "Bạn bè" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setRsvpRelation(item.id)}
                          className={`py-2 px-3 rounded-full text-xs font-medium border transition cursor-pointer ${
                            rsvpRelation === item.id
                              ? "bg-stone-900 text-white border-stone-900"
                              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Bạn có thể đến chung vui không? */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <label className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
                    <Sparkles size={13} className="text-[#8C6D3F]" />
                    <span>2. Bạn có thể đến chung vui cùng chúng mình không? *</span>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus("attending")}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                        rsvpStatus === "attending"
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-[#FAF9F5] text-stone-800 border-stone-200"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          rsvpStatus === "attending"
                            ? "bg-white text-stone-900 border-white"
                            : "border-stone-400"
                        }`}
                      >
                        {rsvpStatus === "attending" && <Check size={10} />}
                      </div>
                      <div>
                        <p className="font-semibold text-xs">Sẽ tham dự</p>
                        <p className="text-[10px] opacity-80">Vui vẻ nhận lời</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRsvpStatus("declined")}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                        rsvpStatus === "declined"
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-[#FAF9F5] text-stone-800 border-stone-200"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          rsvpStatus === "declined"
                            ? "bg-white text-stone-900 border-white"
                            : "border-stone-400"
                        }`}
                      >
                        {rsvpStatus === "declined" && <Check size={10} />}
                      </div>
                      <div>
                        <p className="font-semibold text-xs">Rất tiếc bận</p>
                        <p className="text-[10px] opacity-80">Gửi lời chúc từ xa</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 3. Số lượng người đi cùng bạn */}
                {rsvpStatus === "attending" && (
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <label className="font-semibold text-stone-800 block text-xs">
                      3. Số lượng người đi cùng bạn (bao gồm người lớn & trẻ em)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { count: 1, label: "Đi một mình" },
                        { count: 2, label: "+1 Người" },
                        { count: 3, label: "+2 Người" },
                        { count: 4, label: "+3 Người" },
                      ].map((item) => (
                        <button
                          key={item.count}
                          type="button"
                          onClick={() => setAttendingCount(item.count)}
                          className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition cursor-pointer ${
                            attendingCount === item.count
                              ? "bg-stone-900 text-white border-stone-900"
                              : "bg-[#FAF9F5] text-stone-700 border-stone-200"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Khẩu phần ăn tiệc */}
                {rsvpStatus === "attending" && (
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <label className="font-semibold text-stone-800 block text-xs">
                      4. Lựa chọn khẩu phần ăn tiệc
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setMealPreference("man")}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                          mealPreference === "man"
                            ? "bg-[#FAF9F5] border-stone-900 font-semibold text-stone-900"
                            : "bg-white border-stone-200 text-stone-700"
                        }`}
                      >
                        <div>
                          <p className="text-xs">Món mặn</p>
                          <p className="text-[10px] text-stone-500">Truyền thống</p>
                        </div>
                        {mealPreference === "man" && <Check size={12} className="text-stone-900" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setMealPreference("chay")}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                          mealPreference === "chay"
                            ? "bg-[#FAF9F5] border-stone-900 font-semibold text-stone-900"
                            : "bg-white border-stone-200 text-stone-700"
                        }`}
                      >
                        <div>
                          <p className="text-xs">Món chay</p>
                          <p className="text-[10px] text-stone-500">Thanh tịnh</p>
                        </div>
                        {mealPreference === "chay" && <Check size={12} className="text-stone-900" />}
                      </button>
                    </div>

                    <input
                      type="text"
                      value={dietaryNote}
                      onChange={(e) => setDietaryNote(e.target.value)}
                      placeholder="Ghi chú kiêng hoặc dị ứng thực phẩm (nếu có)..."
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-stone-900 bg-[#FAF9F5]"
                    />
                  </div>
                )}

                {/* 5. Gửi lời chúc mừng */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100">
                  <label className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
                    <MessageSquare size={13} className="text-[#8C6D3F]" />
                    <span>5. Gửi lời chúc mừng tới dâu rể:</span>
                  </label>
                  <textarea
                    rows={3}
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                    placeholder="Chúc hai bạn trăm năm hạnh phúc, vẹn tròn duyên thắm..."
                    className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 text-xs placeholder:text-stone-400 focus:outline-none focus:border-stone-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#221F1C] hover:bg-black text-white font-semibold rounded-xl shadow-md text-xs tracking-wide transition cursor-pointer"
                >
                  Gửi Phản Hồi RSVP
                </button>
              </form>
            )}

            <div className="mt-6 rounded-xl overflow-hidden border border-stone-200 shadow-xs">
              <img src={wedding.hero_photo} alt="Couple by coastal rail" className="w-full h-48 object-cover" />
            </div>
          </section>

          {/* 9. SỔ LƯU BÚT & LỜI CHÚC (GUESTBOOK) */}
          <section id="wishes-section" className="p-6 bg-white border-b border-[#EAE5D9]">
            <h4 className="text-xl font-display font-bold text-stone-900 text-center mb-4">
              Lời Chúc Mừng
            </h4>
            <div className="space-y-2.5 mb-6">
              {wishesList.slice(0, 4).map((w, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF9F5] rounded-xl p-3 border border-[#EAE5D9] shadow-2xs space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">
                      {w.name}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {w.time}
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed italic">
                    "{w.content}"
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl overflow-hidden border border-stone-200 shadow-xs">
              <img src={beachThumb} alt="Couple on yacht" className="w-full h-48 object-cover" />
            </div>
          </section>

          {/* 10. HỘP MỪNG CƯỚI (INTERACTIVE GIFT BOX VỚI POPUP) */}
          <section id="gift-section" className="p-8 bg-[#FAF9F5] border-b border-[#EAE5D9] text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-white border border-[#DFD8C8] mx-auto flex items-center justify-center shadow-xs">
              <Gift className="w-6 h-6 text-[#8C6D3F]" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C6D3F] font-semibold">
                Wedding Gift
              </p>
              <h3 className="text-3xl font-['Dancing_Script'] font-semibold text-[#1F1B18]">
                Hộp Mừng Cưới
              </h3>
              <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                Cảm ơn tất cả tình cảm và sự chúc phúc mà quý vị đã dành cho hai vợ chồng!
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsGiftModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[#221F1C] hover:bg-black text-white text-xs font-semibold px-6 py-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Gift size={15} className="text-[#E6C265]" />
                <span>Nhấn vào đây để mừng cưới qua mã QR</span>
              </button>
            </div>
          </section>

          {/* 11. THANK YOU (LỜI CẢM ƠN CUỐI THIỆP VỚI ẢNH ĐÔI BÊN BỜ ĐÁ) */}
          <section className="relative overflow-hidden bg-stone-900 text-white text-center py-16 px-4">
            <div className="absolute inset-0 opacity-40">
              <img src={heroWedding} alt="Thank you couple" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 space-y-3">
              <h3 className="text-4xl sm:text-5xl font-['Dancing_Script'] font-semibold drop-shadow-md">
                Thank You!
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 max-w-xs mx-auto leading-relaxed drop-shadow italic">
                "Sự hiện diện của Quý khách là niềm vinh hạnh cho gia đình chúng tôi!"
              </p>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 pt-4">
                EverWeb · Nền tảng thiệp cưới trực tuyến
              </p>
            </div>
          </section>
        </main>
      )}

      {/* ============================================================
          HAI NÚT ĐIỀU KHIỂN NỔI GÓC DƯỚI (BOTTOM FLOATING CONTROLS)
          ============================================================ */}
      <nav aria-label="Điều hướng nhanh thiệp cưới" className="fixed bottom-4 left-0 right-0 z-50 pointer-events-none px-4">
        <div className="max-w-[420px] mx-auto flex items-end justify-between pointer-events-auto relative">
          {/* Nút bật/tắt nhạc nền cưới (góc dưới trái) */}
          <button
            type="button"
            onClick={toggleAudio}
            className={`w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center transition-all cursor-pointer border-2 ${
              isPlayingAudio
                ? "border-[#E11D48] text-[#E11D48] animate-pulse"
                : "border-[#E11D48] text-[#E11D48]/80 hover:bg-rose-50"
            }`}
            title={isPlayingAudio ? "Tắt nhạc nền" : "Bật nhạc nền"}
          >
            {isPlayingAudio ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Cụm Speed-dial góc dưới phải (Image 1) */}
          <div className="relative flex flex-col items-center">
            {/* 4 Nút tròn xếp dọc mở rộng lên trên khi bấm nút */}
            {isSpeedDialOpen && (
              <div className="flex flex-col items-center gap-3 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {/* 1. Mừng cưới (Top-most) */}
                <div className="relative flex items-center group">
                  <span className="absolute right-12 px-2.5 py-1.5 bg-[#2B2B2B] text-white text-xs font-medium rounded-md whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:-right-1.5 after:border-y-4 after:border-y-transparent after:border-l-6 after:border-l-[#2B2B2B]">
                    Mừng cưới
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSpeedDialOpen(false);
                      setIsGiftModalOpen(true);
                    }}
                    className="w-10 h-10 rounded-full bg-[#968E8C] hover:bg-[#7D7472] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    title="Mừng cưới"
                  >
                    <HeartHandshake size={19} />
                  </button>
                </div>

                {/* 2. Gửi lời chúc mừng */}
                <div className="relative flex items-center group">
                  <span className="absolute right-12 px-2.5 py-1.5 bg-[#2B2B2B] text-white text-xs font-medium rounded-md whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:-right-1.5 after:border-y-4 after:border-y-transparent after:border-l-6 after:border-l-[#2B2B2B]">
                    Gửi lời chúc mừng
                  </span>
                  <button
                    type="button"
                    onClick={() => scrollToSection("wishes-section")}
                    className="w-10 h-10 rounded-full bg-[#968E8C] hover:bg-[#7D7472] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    title="Gửi lời chúc mừng"
                  >
                    <FileEdit size={19} />
                  </button>
                </div>

                {/* 3. Xác nhận tham dự (RSVP) */}
                <div className="relative flex items-center group">
                  <span className="absolute right-12 px-2.5 py-1.5 bg-[#2B2B2B] text-white text-xs font-medium rounded-md whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:-right-1.5 after:border-y-4 after:border-y-transparent after:border-l-6 after:border-l-[#2B2B2B]">
                    Xác nhận tham dự (RSVP)
                  </span>
                  <button
                    type="button"
                    onClick={() => scrollToSection("rsvp-section")}
                    className="w-10 h-10 rounded-full bg-[#968E8C] hover:bg-[#7D7472] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    title="Xác nhận tham dự"
                  >
                    <UserCheck size={19} />
                  </button>
                </div>

                {/* 4. Danh mục thiệp cưới */}
                <div className="relative flex items-center group">
                  <span className="absolute right-12 px-2.5 py-1.5 bg-[#2B2B2B] text-white text-xs font-medium rounded-md whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:-right-1.5 after:border-y-4 after:border-y-transparent after:border-l-6 after:border-l-[#2B2B2B]">
                    Danh mục thiệp cưới
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSpeedDialOpen(false);
                      setIsCatalogModalOpen(true);
                    }}
                    className="w-10 h-10 rounded-full bg-[#968E8C] hover:bg-[#7D7472] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    title="Danh mục thiệp cưới"
                  >
                    <Mail size={19} />
                  </button>
                </div>
              </div>
            )}

            {/* Nút bấm chính góc dưới phải (Trigger Button) */}
            <button
              type="button"
              onClick={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
              className={`w-11 h-11 rounded-full text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                isSpeedDialOpen
                  ? "bg-[#856578] hover:bg-[#745567]"
                  : "bg-[#7E7775] hover:bg-[#686260]"
              }`}
              title={isSpeedDialOpen ? "Đóng menu" : "Menu danh mục thiệp cưới"}
            >
              {isSpeedDialOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* POPUP MODAL DANH MỤC THIỆP CƯỚI (IMAGE 2) */}
      {isCatalogModalOpen && (
        <div
          onClick={() => setIsCatalogModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[320px] bg-white rounded-3xl shadow-2xl p-6 space-y-4 text-xs border border-stone-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-bold text-stone-900 text-sm">
                Danh mục thiệp cưới
              </span>
              <button
                type="button"
                onClick={() => setIsCatalogModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1 text-[13px] text-stone-700 font-medium">
              <button
                type="button"
                onClick={() => scrollToSection("cover-section")}
                className="w-full text-left py-2 px-2.5 rounded-xl hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer"
              >
                1. Bìa thiệp cưới & Lời tự sự
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("moments-section")}
                className="w-full text-left py-2 px-2.5 rounded-xl hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer"
              >
                2. The Moments (Ảnh cưới)
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("arch-events-section")}
                className="w-full text-left py-2 px-2.5 rounded-xl hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer"
              >
                3. Sự kiện cưới (Khung vòm)
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("dark-timeline-section")}
                className="w-full text-left py-2 px-2.5 rounded-xl hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer"
              >
                4. Lịch trình hôn lễ & Bản đồ
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("countdown-section")}
                className="w-full text-left py-2 px-2.5 rounded-xl hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer"
              >
                5. Đếm ngược ngày cưới
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("our-story-section")}
                className="w-full text-left py-2 px-2.5 rounded-xl hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer"
              >
                6. Our Story (Kỷ niệm ảnh)
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("rsvp-section")}
                className="w-full text-left py-2 px-2.5 rounded-xl hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer"
              >
                7. Xác nhận tham dự (RSVP)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCatalogModalOpen(false);
                  setIsGiftModalOpen(true);
                }}
                className="w-full text-left py-2 px-2.5 rounded-xl hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer"
              >
                8. Hộp mừng cưới & Mã QR
              </button>
            </div>

            <div className="pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  setIsCatalogModalOpen(false);
                  setIsSpeedDialOpen(false);
                  setIsEnvelopeOpened(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full text-center py-2 text-stone-500 hover:text-stone-900 text-xs font-semibold cursor-pointer"
              >
                Xem lại phong thư mở đầu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 1: HỘP MỪNG CƯỚI & MÃ VIETQR (KHI BẤM VÀO ĐỂ MỞ RA)
          ============================================================ */}
      <Modal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        title="Mừng cưới Cô Dâu & Chú Rể"
        size="md"
      >
        <div className="space-y-4 text-xs">
          {/* Tabs Chú rể / Cô dâu */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveGiftTab("groom")}
              className={`py-2 rounded-lg font-semibold transition cursor-pointer ${
                activeGiftTab === "groom"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Mừng Chú Rể ({wedding.groom_name})
            </button>
            <button
              type="button"
              onClick={() => setActiveGiftTab("bride")}
              className={`py-2 rounded-lg font-semibold transition cursor-pointer ${
                activeGiftTab === "bride"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Mừng Cô Dâu ({wedding.bride_name})
            </button>
          </div>

          <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-stone-200 text-center space-y-3">
            <div className="w-14 h-14 rounded-full overflow-hidden mx-auto border-2 border-stone-200 shadow-2xs">
              <img
                src={activeGiftTab === "groom" ? wedding.groom_photo : wedding.bride_photo}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200 inline-block shadow-xs">
              <img
                src={activeGiftTab === "groom" ? groomQrUrl : brideQrUrl}
                alt="Mã QR mừng cưới"
                className="w-44 h-44 object-contain mx-auto"
              />
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-bold text-stone-900 text-sm">
                {activeGiftTab === "groom"
                  ? wedding.groom_bank.account_name
                  : wedding.bride_bank.account_name}
              </p>
              <p className="text-stone-600">
                Ngân hàng:{" "}
                <strong>
                  {activeGiftTab === "groom"
                    ? wedding.groom_bank.bank_name
                    : wedding.bride_bank.bank_name}
                </strong>
              </p>
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200 mt-1">
                <span className="font-mono font-semibold text-stone-900 text-sm">
                  {activeGiftTab === "groom"
                    ? wedding.groom_bank.account_no
                    : wedding.bride_bank.account_no}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      activeGiftTab === "groom"
                        ? wedding.groom_bank.account_no
                        : wedding.bride_bank.account_no,
                      "Đã sao chép số tài khoản!"
                    )
                  }
                  className="text-stone-900 hover:text-black font-semibold inline-flex items-center gap-1 cursor-pointer"
                  title="Sao chép số tài khoản"
                >
                  <Copy size={13} />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-stone-500">
            Quý khách có thể quét mã VietQR bằng bất kỳ ứng dụng ngân hàng hoặc ví điện tử nào.
          </div>
        </div>
      </Modal>

      {/* ============================================================
          MODAL 2: XEM ẢNH PHÓNG TO (LIGHTBOX)
          ============================================================ */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[90vh]">
            <img
              src={selectedPhoto}
              alt="Phóng to ảnh"
              className="max-h-[85vh] w-auto mx-auto object-contain rounded-xl shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 3: CHỈNH SỬA THÔNG TIN & TẢI ẢNH CƯỚI (DÀNH CHO CẶP ĐÔI)
          ============================================================ */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Chỉnh sửa thông tin thiệp & Tải ảnh cưới"
        size="lg"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const updated = {
              ...editForm,
              wedding_id: currentWedding?.id || null,
            };
            await persistCustomCard(updated);
            setIsEditOpen(false);
            toast.success("Đã cập nhật thông tin & lưu lên hệ thống!");
          }}
          className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1"
        >
          {/* PHẦN 1: QUẢN LÝ & TẢI LÊN ẢNH CƯỚI */}
          <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                <Camera size={14} className="text-[#8C6D3F]" />
                <span>1. Tải lên và Tùy chỉnh ảnh cưới</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setEditForm({
                    ...editForm,
                    hero_photo: beachHero,
                    groom_photo: slurpeeCouple,
                    bride_photo: beachThumb,
                  });
                  toast.info("Đã khôi phục các ảnh mẫu ban đầu");
                }}
                className="text-[11px] text-stone-500 hover:text-stone-800 inline-flex items-center gap-1"
              >
                <RotateCcw size={11} />
                <span>Khôi phục ảnh mẫu</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Ảnh bìa chính */}
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 space-y-2 text-center">
                <span className="block font-semibold text-stone-800 text-[11px]">
                  Ảnh bìa chính
                </span>
                <div className="w-full aspect-[9/13] max-h-36 rounded-lg overflow-hidden border border-stone-200 mx-auto bg-stone-100">
                  <img src={editForm.hero_photo} alt="Hero preview" className="w-full h-full object-cover object-top" />
                </div>
                <label className="inline-flex items-center justify-center gap-1.5 w-full bg-stone-100 hover:bg-stone-200 text-stone-800 py-1.5 px-2 rounded-lg cursor-pointer transition text-[11px] font-medium">
                  <Upload size={12} />
                  <span>Chọn ảnh từ máy</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const compressed = await compressImageFile(file);
                        setEditForm({ ...editForm, hero_photo: compressed });
                        toast.success("Đã chọn ảnh bìa mới!");
                      }
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => openCloudinaryPicker("hero_photo")}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-800 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                >
                  Chọn từ Cloudinary
                </button>
              </div>

              {/* Ảnh Chú rể */}
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 space-y-2 text-center">
                <span className="block font-semibold text-stone-800 text-[11px]">
                  Ảnh Chú rể
                </span>
                <div className="w-full aspect-[3/4] max-h-36 rounded-lg overflow-hidden border border-stone-200 mx-auto bg-stone-100">
                  <img src={editForm.groom_photo} alt="Groom preview" className="w-full h-full object-cover" />
                </div>
                <label className="inline-flex items-center justify-center gap-1.5 w-full bg-stone-100 hover:bg-stone-200 text-stone-800 py-1.5 px-2 rounded-lg cursor-pointer transition text-[11px] font-medium">
                  <Upload size={12} />
                  <span>Chọn ảnh Chú rể</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const compressed = await compressImageFile(file);
                        setEditForm({ ...editForm, groom_photo: compressed });
                        toast.success("Đã chọn ảnh Chú rể mới!");
                      }
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => openCloudinaryPicker("groom_photo")}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-800 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                >
                  Chọn từ Cloudinary
                </button>
              </div>

              {/* Ảnh Cô dâu */}
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 space-y-2 text-center">
                <span className="block font-semibold text-stone-800 text-[11px]">
                  Ảnh Cô dâu
                </span>
                <div className="w-full aspect-[3/4] max-h-36 rounded-lg overflow-hidden border border-stone-200 mx-auto bg-stone-100">
                  <img src={editForm.bride_photo} alt="Bride preview" className="w-full h-full object-cover" />
                </div>
                <label className="inline-flex items-center justify-center gap-1.5 w-full bg-stone-100 hover:bg-stone-200 text-stone-800 py-1.5 px-2 rounded-lg cursor-pointer transition text-[11px] font-medium">
                  <Upload size={12} />
                  <span>Chọn ảnh Cô dâu</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const compressed = await compressImageFile(file);
                        setEditForm({ ...editForm, bride_photo: compressed });
                        toast.success("Đã chọn ảnh Cô dâu mới!");
                      }
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => openCloudinaryPicker("bride_photo")}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-800 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                >
                  Chọn từ Cloudinary
                </button>
              </div>
            </div>
          </div>

          {/* PHẦN 2: TIÊU ĐỀ & ĐÔI UYÊN ƯƠNG */}
          <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-stone-200 space-y-3">
            <span className="font-bold text-stone-900 block">
              2. Tiêu đề & Đôi Uyên Ương
            </span>
            <div>
              <label className="font-medium text-stone-700 block mb-1">
                Tiêu đề lễ cưới
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                placeholder="VD: LỄ THÀNH HÔN, LỄ VU QUY..."
                className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-stone-900 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-stone-700 block mb-1">
                  Tên Chú rể
                </label>
                <input
                  type="text"
                  value={editForm.groom_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, groom_name: e.target.value })
                  }
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-stone-900 bg-white"
                />
              </div>
              <div>
                <label className="font-medium text-stone-700 block mb-1">
                  Tên Cô dâu
                </label>
                <input
                  type="text"
                  value={editForm.bride_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bride_name: e.target.value })
                  }
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-stone-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">
                Câu nói / Trích dẫn tình yêu
              </label>
              <textarea
                rows={2}
                value={editForm.quote}
                onChange={(e) =>
                  setEditForm({ ...editForm, quote: e.target.value })
                }
                className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-stone-900 bg-white resize-none"
              />
            </div>
          </div>

          {/* PHẦN 3: SONG THÂN HAI HỌ */}
          <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-stone-200 space-y-3">
            <span className="font-bold text-stone-900 block">
              3. Đại diện Song Thân Hai Họ
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="font-medium text-stone-700 block">
                  Nhà trai (Họ tên Bố & Mẹ)
                </label>
                <input
                  type="text"
                  value={editForm.groom_parents}
                  onChange={(e) =>
                    setEditForm({ ...editForm, groom_parents: e.target.value })
                  }
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-stone-900 bg-white"
                />
                <label className="font-medium text-stone-700 block text-[11px]">
                  Địa chỉ Nhà trai
                </label>
                <input
                  type="text"
                  value={editForm.groom_address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, groom_address: e.target.value })
                  }
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-stone-900 bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="font-medium text-stone-700 block">
                  Nhà gái (Họ tên Bố & Mẹ)
                </label>
                <input
                  type="text"
                  value={editForm.bride_parents}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bride_parents: e.target.value })
                  }
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-stone-900 bg-white"
                />
                <label className="font-medium text-stone-700 block text-[11px]">
                  Địa chỉ Nhà gái
                </label>
                <input
                  type="text"
                  value={editForm.bride_address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bride_address: e.target.value })
                  }
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-stone-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* PHẦN 4: THỜI GIAN & ĐỊA ĐIỂM */}
          <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-stone-200 space-y-3">
            <span className="font-bold text-stone-900 block">
              4. Thời Gian & Địa Điểm Tiệc Cưới
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-stone-700 block mb-1">
                  Thời gian hiển thị
                </label>
                <input
                  type="text"
                  value={editForm.wedding_date_display}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      wedding_date_display: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-stone-900 bg-white"
                />
              </div>
              <div>
                <label className="font-medium text-stone-700 block mb-1">
                  Ngày số trên phong bì
                </label>
                <input
                  type="text"
                  value={editForm.date_badge}
                  onChange={(e) =>
                    setEditForm({ ...editForm, date_badge: e.target.value })
                  }
                  placeholder="VD: 13.11.2026"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-stone-900 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-stone-700 block mb-1">
                  Tên địa điểm
                </label>
                <input
                  type="text"
                  value={editForm.venue_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, venue_name: e.target.value })
                  }
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-stone-900 bg-white"
                />
              </div>
              <div>
                <label className="font-medium text-stone-700 block mb-1">
                  Sảnh tiệc
                </label>
                <input
                  type="text"
                  value={editForm.hall_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, hall_name: e.target.value })
                  }
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-stone-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">
                Địa chỉ chi tiết
              </label>
              <input
                type="text"
                value={editForm.venue_address}
                onChange={(e) =>
                  setEditForm({ ...editForm, venue_address: e.target.value })
                }
                className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-stone-900 bg-white"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">
                Link chỉ đường Google Maps
              </label>
              <input
                type="text"
                value={editForm.map_url}
                onChange={(e) =>
                  setEditForm({ ...editForm, map_url: e.target.value })
                }
                className="w-full rounded-xl border border-stone-200 px-3 py-2 outline-none focus:border-stone-900 bg-white"
              />
            </div>
          </div>

          {/* PHẦN 5: TÀI KHOẢN VIETQR MỪNG CƯỚI */}
          <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-stone-200 space-y-3">
            <span className="font-bold text-stone-900 block">
              5. Tài khoản VietQR mừng cưới
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Chú rể */}
              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                <span className="font-semibold text-stone-800 block text-[11px]">
                  Ngân hàng Chú rể
                </span>
                <input
                  type="text"
                  value={editForm.groom_bank?.bank_name}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      groom_bank: {
                        ...editForm.groom_bank,
                        bank_name: e.target.value,
                      },
                    })
                  }
                  placeholder="Tên ngân hàng"
                  className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 outline-none text-xs"
                />
                <input
                  type="text"
                  value={editForm.groom_bank?.bank_id}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      groom_bank: {
                        ...editForm.groom_bank,
                        bank_id: e.target.value,
                      },
                    })
                  }
                  placeholder="Mã VietQR (VD: VCB, MB)"
                  className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 outline-none text-xs"
                />
                <input
                  type="text"
                  value={editForm.groom_bank?.account_no}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      groom_bank: {
                        ...editForm.groom_bank,
                        account_no: e.target.value,
                      },
                    })
                  }
                  placeholder="Số tài khoản"
                  className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 outline-none text-xs font-mono"
                />
                <input
                  type="text"
                  value={editForm.groom_bank?.account_name}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      groom_bank: {
                        ...editForm.groom_bank,
                        account_name: e.target.value,
                      },
                    })
                  }
                  placeholder="Tên chủ tài khoản"
                  className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 outline-none text-xs uppercase"
                />
              </div>

              {/* Cô dâu */}
              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                <span className="font-semibold text-stone-800 block text-[11px]">
                  Ngân hàng Cô dâu
                </span>
                <input
                  type="text"
                  value={editForm.bride_bank?.bank_name}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      bride_bank: {
                        ...editForm.bride_bank,
                        bank_name: e.target.value,
                      },
                    })
                  }
                  placeholder="Tên ngân hàng"
                  className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 outline-none text-xs"
                />
                <input
                  type="text"
                  value={editForm.bride_bank?.bank_id}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      bride_bank: {
                        ...editForm.bride_bank,
                        bank_id: e.target.value,
                      },
                    })
                  }
                  placeholder="Mã VietQR (VD: MB, VCB)"
                  className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 outline-none text-xs"
                />
                <input
                  type="text"
                  value={editForm.bride_bank?.account_no}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      bride_bank: {
                        ...editForm.bride_bank,
                        account_no: e.target.value,
                      },
                    })
                  }
                  placeholder="Số tài khoản"
                  className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 outline-none text-xs font-mono"
                />
                <input
                  type="text"
                  value={editForm.bride_bank?.account_name}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      bride_bank: {
                        ...editForm.bride_bank,
                        account_name: e.target.value,
                      },
                    })
                  }
                  placeholder="Tên chủ tài khoản"
                  className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 outline-none text-xs uppercase"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="rounded-xl border border-stone-200 px-4 py-2 font-medium text-stone-600 hover:bg-stone-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#221F1C] px-5 py-2 font-semibold text-white hover:bg-black transition shadow-xs cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================
          MODAL 4: XUẤT BẢN & LẤY LINK QR THIỆP CƯỚI
          ============================================================ */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Xuất bản & Lấy Link QR Thiệp Cưới"
        size="lg"
      >
        <div className="space-y-5 text-xs text-stone-700">
          {/* Banner Trạng thái xuất bản */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isPublished
                ? "bg-emerald-50/80 border-emerald-200"
                : "bg-stone-100 border-stone-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isPublished
                      ? "bg-emerald-600 text-white"
                      : "bg-stone-400 text-white"
                  }`}
                >
                  <Globe size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">
                      {isPublished
                        ? "Thiệp cưới đang Hoạt động (Live)"
                        : "Thiệp cưới đang ở chế độ Bản nháp"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isPublished
                          ? "bg-emerald-200/80 text-emerald-900"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPublished
                            ? "bg-emerald-600 animate-pulse"
                            : "bg-stone-500"
                        }`}
                      />
                      {isPublished ? "Công khai" : "Riêng tư"}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    {isPublished
                      ? "Khách mời ở bất cứ đâu đều có thể mở link và quét mã QR để xem thiệp cưới và gửi phản hồi RSVP."
                      : "Chỉ bạn mới có thể xem trước. Hãy xuất bản để tạo đường link và mã QR gửi khách mời."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={togglePublish}
                className={`px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition cursor-pointer shrink-0 ${
                  isPublished
                    ? "bg-white text-stone-800 border border-stone-200 hover:bg-stone-50"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {isPublished ? "Chuyển về Bản nháp" : "Xuất bản thiệp ngay"}
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveShareTab("public")}
              className={`py-2 px-3 rounded-lg font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeShareTab === "public"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <QrCode size={14} />
              <span>1. Link Chung & Mã QR Thiệp</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveShareTab("personalized")}
              className={`py-2 px-3 rounded-lg font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeShareTab === "personalized"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Users size={14} />
              <span>2. Tạo Link Riêng Có Tên Khách</span>
            </button>
          </div>

          {/* TAB 1: LINK CHUNG & MÃ QR */}
          {activeShareTab === "public" && (
            <div className="space-y-4 animate-fade-in">
              {/* Ô hiển thị Link thiệp xuất bản */}
              <div className="p-3.5 bg-[#FAF9F5] rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-800 flex items-center gap-1.5 text-xs">
                    <Globe size={13} className="text-[#8C6D3F]" />
                    <span>Đường link xuất bản thiệp cưới (Dành cho khách mời):</span>
                  </label>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Bản sạch 100% · Không có nút chỉnh sửa
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicInvitationUrl}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        publicInvitationUrl,
                        "Đã sao chép đường link xuất bản gửi khách!"
                      )
                    }
                    className="inline-flex items-center gap-1.5 bg-[#221F1C] hover:bg-black text-white px-3.5 py-2 rounded-xl font-bold text-xs shrink-0 cursor-pointer shadow-xs transition"
                  >
                    <Copy size={13} />
                    <span>Copy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.open(publicInvitationUrl, "_blank")}
                    className="inline-flex items-center gap-1 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 px-3 py-2 rounded-xl font-bold text-xs shrink-0 cursor-pointer transition"
                    title="Mở link trong tab mới để kiểm tra giao diện khách xem"
                  >
                    <ExternalLink size={13} />
                    <span>Mở thử bản khách</span>
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 italic">
                  * Khách mở link này hoặc quét mã QR sẽ xem thiệp cưới hoàn chỉnh, không có thanh công cụ quản trị hay các nút đổi ảnh của dâu rể.
                </p>
              </div>

              {/* Khung Mã QR Thiệp cưới */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 text-center space-y-3 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-[#8C6D3F] font-bold block">
                  Mã QR Truy Cập Thiệp Cưới
                </span>
                <p className="text-stone-600 text-xs max-w-sm mx-auto leading-relaxed">
                  Khách mời chỉ cần dùng <strong>Camera điện thoại</strong> hoặc{" "}
                  <strong>ứng dụng Zalo</strong> để quét mã là xem được thiệp
                  ngay.
                </p>

                <div className="inline-block p-4 bg-[#FAF9F5] rounded-2xl border-2 border-[#DFD8C8] shadow-sm">
                  <img
                    src={publicQrUrl}
                    alt="Mã QR Thiệp cưới"
                    className="w-52 h-52 object-contain mx-auto rounded-lg bg-white p-2"
                  />
                  <div className="mt-2 text-center">
                    <p className="font-['Dancing_Script'] font-semibold text-base text-stone-900">
                      {wedding.groom_name} & {wedding.bride_name}
                    </p>
                    <p className="text-[10px] text-stone-500 font-medium">
                      {wedding.date_badge} · Lễ Thành Hôn
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadQr(
                        publicQrUrl,
                        `QR-Thiep-Cuoi-${wedding.groom_name}-${wedding.bride_name}.png`
                      )
                    }
                    className="inline-flex items-center gap-1.5 bg-[#8C6D3F] hover:bg-[#6E542D] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Tải ảnh mã QR về máy (PNG)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        publicInvitationUrl,
                        "Đã sao chép link để gửi khách!"
                      )
                    }
                    className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2.5 rounded-xl font-semibold text-xs transition cursor-pointer"
                  >
                    <Share2 size={13} />
                    <span>Gửi qua Zalo / Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TẠO LINK RIÊNG CÁ NHÂN HÓA TÊN KHÁCH */}
          {activeShareTab === "personalized" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900 text-xs leading-relaxed">
                <strong>Đặc quyền cá nhân hóa:</strong> Khi bạn tạo link riêng
                kèm tên, màn hình bìa phong thư sẽ in trang trọng tên người nhận{" "}
                <em>(ví dụ: "TRÂN TRỌNG KÍNH MỜI Quý Khách / Anh Hoàng Nam & Bạn gái")</em>.
              </div>

              <div className="p-3.5 bg-[#FAF9F5] rounded-xl border border-stone-200 space-y-3">
                <label className="font-bold text-stone-800 block text-xs">
                  Nhập tên khách mời muốn gửi thiệp:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={personalizedName}
                    onChange={(e) => setPersonalizedName(e.target.value)}
                    placeholder="VD: Anh Hoàng Nam & Bạn gái, Gia đình Bác Hải..."
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 outline-none focus:border-stone-900"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!personalizedName.trim()) {
                        toast.error("Vui lòng nhập tên khách mời");
                        return;
                      }
                      copyToClipboard(
                        personalizedInvitationUrl,
                        `Đã sao chép link riêng dành cho "${personalizedName}"!`
                      );
                    }}
                    className="inline-flex items-center gap-1 bg-[#221F1C] hover:bg-black text-white px-4 py-2 rounded-xl font-bold text-xs shrink-0 cursor-pointer shadow-xs transition"
                  >
                    <Copy size={13} />
                    <span>Copy Link Riêng</span>
                  </button>
                </div>

                {/* Gợi ý khách mời nhanh */}
                <div className="space-y-1">
                  <span className="text-[11px] text-stone-500 font-medium">
                    Gợi ý nhanh từ danh sách khách:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {[
                      "Anh Hoàng Nam & Bạn gái",
                      "Minh Thư (Phù dâu)",
                      "Lan Anh & Minh Trí",
                      "Cô Chú Bảy (Nhà Trai)",
                      "Bác Văn & Gia đình",
                    ].map((nameSuggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPersonalizedName(nameSuggestion)}
                        className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-800 rounded-lg border border-stone-200 text-[11px] font-medium transition cursor-pointer"
                      >
                        + {nameSuggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Link cá nhân */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-xs">
                    Link riêng cho:{" "}
                    <span className="text-[#8C6D3F]">
                      {personalizedName || "Quý Khách"}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => window.open(personalizedInvitationUrl, "_blank")}
                    className="text-stone-600 hover:text-black inline-flex items-center gap-1 font-semibold text-[11px]"
                  >
                    <ExternalLink size={12} />
                    <span>Mở xem thử bìa thư</span>
                  </button>
                </div>

                <input
                  type="text"
                  readOnly
                  value={personalizedInvitationUrl}
                  className="w-full bg-[#FAF9F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-800 outline-none select-all"
                />

                <div className="flex items-center justify-center gap-3 pt-2">
                  <div className="w-24 h-24 bg-[#FAF9F5] p-1.5 rounded-xl border border-stone-200 shrink-0">
                    <img
                      src={personalizedQrUrl}
                      alt="QR cá nhân"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-left space-y-1 text-xs">
                    <p className="font-semibold text-stone-900">
                      Mã QR cá nhân hóa
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Quét vào sẽ hiện đúng thiệp gửi riêng cho:{" "}
                      <strong>{personalizedName || "Quý Khách"}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadQr(
                          personalizedQrUrl,
                          `QR-Thiep-Cuoi-${encodeURIComponent(personalizedName)}.png`
                        )
                      }
                      className="inline-flex items-center gap-1 text-[11px] text-[#8C6D3F] hover:underline font-bold pt-1 cursor-pointer"
                    >
                      <Download size={12} />
                      <span>Tải QR này</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ============================================================
          MODAL 5: THỐNG KÊ LƯỢT XEM & KHÁCH CHƯA PHẢN HỒI RSVP
          ============================================================ */}
      <Modal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        title="Thống kê Lượt xem & Khách chưa phản hồi RSVP"
        size="xl"
      >
        <div className="space-y-5 text-xs text-stone-700">
          {/* HÀNG 4 THẺ SỐ LIỆU CHÍNH */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Tổng lượt mở link thiệp */}
            <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-blue-800">
                  Tổng lượt click link
                </span>
                <Eye size={14} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900">{viewCount}</p>
              <p className="text-[10px] text-blue-700">
                Lượt mở thiệp từ internet
              </p>
            </div>

            {/* 2. Đã xác nhận tham dự */}
            <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-800">
                  Đã xác nhận (Tham dự)
                </span>
                <CheckCircle2 size={14} className="text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-900">
                {guestStats.attending}
              </p>
              <p className="text-[10px] text-emerald-700">
                Khách chắc chắn sẽ đến
              </p>
            </div>

            {/* 3. Từ chối tham dự */}
            <div className="p-3.5 bg-stone-100 rounded-2xl border border-stone-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-700">
                  Từ chối tham dự
                </span>
                <X size={14} className="text-stone-500" />
              </div>
              <p className="text-2xl font-bold text-stone-800">
                {guestStats.declined}
              </p>
              <p className="text-[10px] text-stone-600">
                Gửi lời chúc từ xa
              </p>
            </div>

            {/* 4. Khách chưa phản hồi RSVP */}
            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-300 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900">
                  Chưa phản hồi RSVP
                </span>
                <Users size={14} className="text-amber-700" />
              </div>
              <p className="text-2xl font-bold text-amber-900">
                {guestStats.pending}
              </p>
              <p className="text-[10px] text-amber-700 font-medium">
                Cần theo dõi & nhắc nhở
              </p>
            </div>
          </div>

          {/* HỘP CẢNH BÁO CHI TIẾT VỀ KHÁCH CHƯA PHẢN HỒI (GIẢI PHÁP TRỌNG TÂM CỦA USER) */}
          <div className="p-4 bg-gradient-to-r from-amber-50 via-amber-50/60 to-orange-50 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h5 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Phân tích 45 khách chưa phản hồi RSVP:
                </h5>
                <div className="mt-1 space-y-1 text-xs text-stone-700">
                  <p>
                    • Có <strong>{guestStats.viewedNotResponded} khách ĐÃ NHẤP VÀO LINK XEM THIỆP</strong> nhưng chưa nhấn nút gửi phản hồi RSVP.
                  </p>
                  <p>
                    • Có <strong>{guestStats.notOpened} khách CHƯA TỪNG MỞ LINK</strong> (có thể tin nhắn bị trôi hoặc chưa gửi đúng số).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsStatsModalOpen(false);
                  navigate(ROUTE_PATHS.MESSAGING);
                  toast.info("Đã mở công cụ Soạn tin nhắn để gửi thông báo tới nhóm khách này.");
                }}
                className="inline-flex items-center justify-center gap-2 bg-[#221F1C] hover:bg-black text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition cursor-pointer shrink-0"
              >
                <Send size={13} className="text-amber-400" />
                <span>Gửi tin nhắn SMS nhắc RSVP</span>
              </button>
            </div>
          </div>

          {/* BỘ LỌC TABS & TÌM KIẾM KHÁCH MỜI */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1 p-1 bg-stone-100 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setStatsFilter("viewed_not_responded")}
                  className={`py-1.5 px-3 rounded-lg font-bold transition cursor-pointer ${
                    statsFilter === "viewed_not_responded"
                      ? "bg-white text-amber-900 shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Đã xem link - Chưa RSVP ({guestStats.viewedNotResponded})
                </button>
                <button
                  type="button"
                  onClick={() => setStatsFilter("not_opened")}
                  className={`py-1.5 px-3 rounded-lg font-medium transition cursor-pointer ${
                    statsFilter === "not_opened"
                      ? "bg-white text-stone-900 shadow-2xs font-bold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Chưa mở link ({guestStats.notOpened})
                </button>
                <button
                  type="button"
                  onClick={() => setStatsFilter("attending")}
                  className={`py-1.5 px-3 rounded-lg font-medium transition cursor-pointer ${
                    statsFilter === "attending"
                      ? "bg-white text-emerald-800 shadow-2xs font-bold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Đã xác nhận ({guestStats.attending})
                </button>
                <button
                  type="button"
                  onClick={() => setStatsFilter("all")}
                  className={`py-1.5 px-3 rounded-lg font-medium transition cursor-pointer ${
                    statsFilter === "all"
                      ? "bg-white text-stone-900 shadow-2xs font-bold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Tất cả (142)
                </button>
              </div>

              {/* Ô tìm kiếm */}
              <div className="relative w-full sm:w-56">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="text"
                  value={statsSearch}
                  onChange={(e) => setStatsSearch(e.target.value)}
                  placeholder="Tìm theo tên hoặc SĐT..."
                  className="w-full pl-8 pr-3 py-1.5 bg-[#FAF9F5] border border-stone-200 rounded-xl text-xs outline-none focus:border-stone-800"
                />
              </div>
            </div>

            {/* DANH SÁCH CHI TIẾT KHÁCH THEO BỘ LỌC */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                {filteredTrackingGuests.length === 0 ? (
                  <div className="p-8 text-center text-stone-400 text-xs">
                    Không tìm thấy khách mời nào phù hợp với bộ lọc hiện tại.
                  </div>
                ) : (
                  filteredTrackingGuests.map((guest) => {
                    const guestPersonalUrl = `${window.location.origin}/invitation?guest=${encodeURIComponent(
                      guest.name
                    )}`;
                    return (
                      <div
                        key={guest.id}
                        className="p-3 sm:px-4 flex items-center justify-between hover:bg-stone-50/70 transition gap-2"
                      >
                        {/* Cột 1: Thông tin khách */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-xs truncate">
                              {guest.name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 shrink-0 font-medium">
                              {guest.role || guest.group}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                            {guest.phone}
                          </p>
                        </div>

                        {/* Cột 2: Trạng thái mở thiệp */}
                        <div className="text-center shrink-0 hidden sm:block">
                          {guest.hasOpened ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <Eye size={11} />
                              <span>Đã mở ({guest.lastOpenedAt})</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                              Chưa mở link
                            </span>
                          )}
                        </div>

                        {/* Cột 3: Trạng thái RSVP & Thao tác */}
                        <div className="flex items-center gap-2 shrink-0">
                          {guest.status === "attending" && (
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                              Tham dự ({guest.attendingCount || 1} người)
                            </span>
                          )}
                          {guest.status === "declined" && (
                            <span className="text-[11px] text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
                              Từ chối
                            </span>
                          )}
                          {guest.status === "pending" && (
                            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                              Chờ phản hồi
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                guestPersonalUrl,
                                `Đã copy link riêng của "${guest.name}"!`
                              )
                            }
                            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition cursor-pointer"
                            title="Sao chép link riêng của khách này"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* ============================================================
          MODAL 6: KHO MẪU THIỆP MỜI ĐIỆN TỬ (CHỌN MẪU CHO THỦY/CẶP ĐÔI)
          ============================================================ */}
      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title="Chọn Mẫu Thiệp Mời Điện Tử"
        size="lg"
      >
        <div className="space-y-4 text-xs text-stone-700">
          <p className="text-stone-600 leading-relaxed">
            Chọn phong cách thiệp phù hợp với ngày vui của bạn. Toàn bộ thông tin tên cặp đôi, ngày cưới, ảnh bạn đã tải lên và số tài khoản VietQR đều được giữ nguyên khi đổi mẫu.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {INVITATION_TEMPLATES.map((tpl) => {
              const isSelected = activeTemplate.id === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`group text-left rounded-2xl border-2 p-3.5 transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? "border-[#3446EB] bg-indigo-50/40 shadow-md"
                      : "border-stone-200 bg-white hover:border-stone-400 hover:shadow-sm"
                  }`}
                >
                  {/* Mini Visual Preview theo đúng kiểu mở đầu của từng mẫu */}
                  <div
                    className="h-28 rounded-xl border p-2.5 flex items-center gap-3 mb-3 relative overflow-hidden"
                    style={{
                      backgroundColor: tpl.envelopeBg,
                      borderColor: tpl.envelopeBorder,
                    }}
                  >
                    {tpl.layoutType === "songhy" ? (
                      <div className="w-20 h-22 rounded-t-full border-2 border-[#D9B36C] bg-[#7D1626] relative shrink-0 flex items-center justify-center shadow-sm">
                        <div className="absolute inset-y-0 left-1/2 w-px bg-[#D9B36C]/50" />
                        <span className="w-7 h-7 rounded-full bg-[#F5D78E] text-[#7D1626] font-bold text-xs flex items-center justify-center shadow-xs z-10">
                          囍
                        </span>
                      </div>
                    ) : tpl.layoutType === "editorial" ? (
                      <div className="w-20 h-22 bg-white border border-stone-900 p-1.5 flex flex-col justify-between shrink-0 shadow-sm">
                        <span className="text-[7px] font-bold tracking-widest uppercase border-b border-stone-900 pb-0.5">
                          MAGAZINE
                        </span>
                        <div className="h-11 bg-stone-200 overflow-hidden">
                          <img
                            src={tpl.defaultPhotos.hero_photo}
                            alt={tpl.name}
                            className="w-full h-full object-cover grayscale"
                          />
                        </div>
                        <span className="h-2.5 rounded-full bg-stone-900 w-full" />
                      </div>
                    ) : tpl.layoutType === "botanical" ? (
                      <div className="w-20 h-22 rounded-t-full border-2 border-[#8FA88E] bg-[#FAFDF8] p-1.5 flex flex-col items-center justify-center shrink-0 shadow-sm">
                        <div className="w-10 h-12 rounded-t-full overflow-hidden border border-[#CAD6C4]">
                          <img
                            src={tpl.defaultPhotos.hero_photo}
                            alt={tpl.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[7px] font-bold text-[#4A634E] mt-1">
                          GARDEN
                        </span>
                      </div>
                    ) : (
                      <div
                        className="w-24 h-16 rounded-lg border shadow-sm relative shrink-0 overflow-hidden flex items-center justify-center"
                        style={{
                          backgroundColor: tpl.envelopeCardBg,
                          borderColor: tpl.envelopeBorder,
                        }}
                      >
                        <div
                          className="absolute top-0 left-0 right-0 h-1/2 border-b"
                          style={{
                            backgroundColor: tpl.envelopeFlapBg,
                            borderColor: tpl.envelopeBorder,
                            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                          }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white/60 shadow-xs z-10"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${tpl.sealFrom}, ${tpl.sealVia}, ${tpl.sealTo})`,
                          }}
                        />
                      </div>
                    )}

                    {/* Mini Cover Photo */}
                    <div className="w-16 h-22 rounded-lg overflow-hidden border border-white shadow-sm shrink-0">
                      <img
                        src={tpl.defaultPhotos.hero_photo}
                        alt={tpl.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Color Palette Dots */}
                    <div className="flex flex-col gap-1.5 ml-auto">
                      {[tpl.envelopeCardBg, tpl.bannerBg, tpl.accent, tpl.flowerPrimary].map(
                        (hex, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: hex }}
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* Template Meta */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                          style={{ backgroundColor: tpl.accent }}
                        >
                          {tpl.code}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm">
                          {tpl.name}
                        </h4>
                      </div>
                      <p className="text-[11px] font-medium text-stone-500 mt-0.5">
                        {tpl.tag}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#3446EB] text-white px-2.5 py-1 text-[10px] font-bold shrink-0">
                        <Check size={11} />
                        Đang chọn
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-600 mt-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </Modal>

      {/* ============================================================
          MODAL 7: KHO ẢNH CLOUDINARY (THƯ MỤC everweb/images)
          ============================================================ */}
      <Modal
        isOpen={Boolean(cloudinaryTargetField)}
        onClose={() => setCloudinaryTargetField(null)}
        title="Chọn ảnh từ Cloudinary (everweb/images)"
        size="lg"
      >
        <div className="space-y-3 text-xs">
          <p className="text-stone-600">
            Bấm chọn bất kỳ ảnh nào từ thư mục <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded">everweb/images</code> trên Cloudinary để áp dụng ngay:
          </p>

          {isLoadingCloudinary ? (
            <div className="py-12 text-center text-stone-500">
              Đang tải danh sách ảnh từ Cloudinary...
            </div>
          ) : cloudinaryPhotos.length === 0 ? (
            <div className="py-10 text-center text-stone-500 bg-stone-50 rounded-xl">
              Chưa tải được ảnh nào từ thư mục <code>everweb/images</code>.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {cloudinaryPhotos.map((img) => (
                <button
                  key={img.publicId}
                  type="button"
                  onClick={() => {
                    setEditForm((prev) => ({
                      ...prev,
                      [cloudinaryTargetField]: img.url,
                    }));
                    toast.success("Đã chọn ảnh từ Cloudinary!");
                    setCloudinaryTargetField(null);
                  }}
                  className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-stone-200 hover:border-[#3446EB] hover:ring-2 hover:ring-[#3446EB]/30 transition cursor-pointer bg-stone-100"
                  title={img.publicId}
                >
                  <img
                    src={img.url}
                    alt={img.publicId}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
