import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  CheckCircle2,
  FileText,
  Flower2,
  Home,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Palette,
  RefreshCw,
  Settings,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import { useToast } from "../../components/common";
import {
  ADMIN_ALLOWED_ROLES,
  ROLE_LABELS,
  ROUTE_PATHS,
} from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import { extractApiError } from "../../services/api";
import authApi from "../../services/authApi";

const RBAC_MATRIX = [
  {
    route: "/, /invitation, /invitation/:token",
    scope: "Công khai (Public)",
    guard: "Không yêu cầu đăng nhập",
    allowed: "Tất cả khách truy cập",
    tier: "public",
  },
  {
    route: "/login, /register",
    scope: "Khách chưa đăng nhập",
    guard: "PublicOnlyRoute",
    allowed: "Tự chuyển hướng vào workspace nếu đã đăng nhập",
    tier: "guest",
  },
  {
    route: "/dashboard/*",
    scope: "Quản trị tiệc cưới",
    guard: "ProtectedRoute + JWT Bearer",
    allowed: "Cặp đôi (couple), Quản trị viên (admin)",
    tier: "couple",
  },
  {
    route: "/admin/*",
    scope: "Quản trị hệ thống",
    guard: "ProtectedRoute + BE authorize('admin')",
    allowed: "Chỉ Quản trị viên (admin)",
    tier: "admin",
  },
];

const SYSTEM_MODULES = [
  {
    key: "users",
    title: "Quản lý tài khoản",
    description:
      "Theo dõi danh sách cặp đôi, phân quyền vai trò và trạng thái hoạt động tài khoản.",
    icon: Users,
    badge: "RBAC Ready",
  },
  {
    key: "templates",
    title: "Kho mẫu thiệp cưới",
    description:
      "Kiểm duyệt cấu hình bố cục mẫu thiệp số và trạng thái phát hành toàn hệ thống.",
    icon: Palette,
    badge: "Catalog",
  },
  {
    key: "settings",
    title: "Cấu hình hệ thống",
    description:
      "Thiết lập tham số vận hành nền tảng, prompt trợ lý AI và giới hạn dịch vụ.",
    icon: Settings,
    badge: "Core Config",
  },
  {
    key: "audit",
    title: "Nhật ký Audit",
    description:
      "Giám sát truy cập trái phép, thay đổi phân quyền và thao tác nhạy cảm trên hệ thống.",
    icon: FileText,
    badge: "Security",
  },
];

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [verification, setVerification] = useState({
    status: "checking",
    message: "Đang đối chiếu quyền với /api/auth/admin-only...",
    verifiedEmail: "",
  });

  useEffect(() => {
    let cancelled = false;

    authApi
      .checkAdminAccess()
      .then((data) => {
        if (cancelled) return;
        setVerification({
          status: "verified",
          message: "BE xác nhận JWT hợp lệ & vai trò Quản trị viên.",
          verifiedEmail: data?.user?.email || user?.email || "",
        });
      })
      .catch((error) => {
        if (cancelled) return;
        const status = error?.response?.status;
        if (status === 403) {
          navigate(ROUTE_PATHS.UNAUTHORIZED, {
            replace: true,
            state: {
              from: location,
              requiredRoles: ADMIN_ALLOWED_ROLES,
              currentRole: user?.role || null,
            },
          });
          return;
        }
        const parsed = extractApiError(
          error,
          "Không thể kiểm tra endpoint /api/auth/admin-only."
        );
        setVerification({
          status: "error",
          message: parsed.message,
          verifiedEmail: "",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [navigate, location, user?.email, user?.role]);

  const handleManualReverify = async () => {
    setVerification({
      status: "checking",
      message: "Đang kiểm tra lại phân quyền với máy chủ...",
      verifiedEmail: verification.verifiedEmail,
    });
    try {
      const data = await authApi.checkAdminAccess();
      setVerification({
        status: "verified",
        message: "BE xác nhận JWT hợp lệ & vai trò Quản trị viên.",
        verifiedEmail: data?.user?.email || user?.email || "",
      });
      toast.success("Xác thực quyền Admin với Backend thành công.");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 403) {
        navigate(ROUTE_PATHS.UNAUTHORIZED, {
          replace: true,
          state: {
            from: location,
            requiredRoles: ADMIN_ALLOWED_ROLES,
            currentRole: user?.role || null,
          },
        });
        return;
      }
      const parsed = extractApiError(
        error,
        "Không thể kiểm tra endpoint /api/auth/admin-only."
      );
      setVerification({
        status: "error",
        message: parsed.message,
        verifiedEmail: "",
      });
      toast.error(parsed.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  };

  const kpis = [
    {
      label: "Trạng thái bảo vệ tuyến",
      value: "Đang bật · RBAC",
      sub: "Chặn khách & tài khoản sai vai trò",
      icon: ShieldCheck,
    },
    {
      label: "Vai trò hiện tại",
      value: ROLE_LABELS[user?.role] || user?.role || "Quản trị viên",
      sub: user?.email || "Tài khoản hệ thống",
      icon: KeyRound,
    },
    {
      label: "Xác thực BE /admin-only",
      value:
        verification.status === "verified"
          ? "Hợp lệ (200)"
          : verification.status === "checking"
            ? "Đang kiểm tra..."
            : "Lỗi xác thực",
      sub: verification.message,
      icon: Activity,
    },
    {
      label: "Nhóm quyền hoạt động",
      value: "2 vai trò",
      sub: "Quản trị viên (admin) · Cặp đôi (couple)",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F2EA] text-[#2C2117]">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-20 border-b border-[#EAE3D8] bg-[#FCFBF8]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2F241D] text-[#C5A059] shadow-xs">
              <Flower2 size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-semibold text-[#2C2117]">
                  EverWeb Admin
                </span>
                <span className="rounded-full bg-[#2F241D] px-2.5 py-0.5 text-[10px] font-semibold text-[#E8CD94]">
                  {ROLE_LABELS[user?.role] || "Quản trị viên"}
                </span>
              </div>
              <p className="hidden text-[11px] text-[#8C7A68] sm:block">
                Trung tâm phân quyền & điều hành nền tảng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.DASHBOARD_DEFAULT)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DFD5C5] bg-white px-3 py-1.5 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059]"
            >
              <LayoutDashboard size={14} className="text-[#A67C37]" />
              <span className="hidden sm:inline">Không gian Cặp đôi</span>
              <span className="sm:hidden">Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.HOME)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DFD5C5] bg-white px-3 py-1.5 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059]"
            >
              <Home size={14} className="text-[#7D6D5E]" />
              <span className="hidden sm:inline">Trang chủ</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2F241D] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-7 sm:px-6 lg:px-8">
        {/* Hero Banner + Backend Verification Status */}
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-[#EAE3D8] bg-[#2F241D] p-6 text-[#EDE4D6] shadow-sm sm:flex-row sm:items-center sm:p-7">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold tracking-wider text-[#E8CD94] uppercase">
              Khu vực bảo mật cấp Quản trị viên
            </p>
            <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              Xin chào, {user?.full_name || user?.email}
            </h1>
            <p className="text-xs text-[#CBBBA8]">
              Tuyến{" "}
              <code className="font-mono-num rounded bg-white/10 px-1.5 py-0.5 text-[#E8CD94]">
                /admin/*
              </code>{" "}
              được bảo vệ đồng thời bởi FE Route Guard và Backend Middleware{" "}
              <code className="font-mono-num rounded bg-white/10 px-1.5 py-0.5 text-[#E8CD94]">
                authorize(&quot;admin&quot;)
              </code>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold ${
                verification.status === "verified"
                  ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                  : verification.status === "checking"
                    ? "border-amber-400/30 bg-amber-500/15 text-amber-200"
                    : "border-rose-400/30 bg-rose-500/15 text-rose-200"
              }`}
            >
              {verification.status === "verified" ? (
                <CheckCircle2 size={15} />
              ) : verification.status === "error" ? (
                <XCircle size={15} />
              ) : (
                <RefreshCw size={15} className="animate-spin" />
              )}
              <span>
                {verification.status === "verified"
                  ? "BE Admin Guard: Đã xác thực"
                  : verification.status === "checking"
                    ? "Đang kiểm tra BE..."
                    : "Không kết nối được BE Guard"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleManualReverify}
              disabled={verification.status === "checking"}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#C5A059] px-3.5 py-2 text-xs font-semibold text-[#2F241D] transition hover:bg-[#D5B26B] disabled:opacity-60"
            >
              <RefreshCw
                size={13}
                className={
                  verification.status === "checking" ? "animate-spin" : ""
                }
              />
              <span>Kiểm tra lại quyền</span>
            </button>
          </div>
        </section>

        {/* 4 KPI Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map(({ label, value, sub, icon: Icon }) => (
            <div
              key={label}
              className="flex items-start justify-between rounded-xl border border-[#E6DFD3] bg-white px-5 py-4"
            >
              <div className="min-w-0 pr-2">
                <p className="text-xs font-medium text-[#8C7A68]">{label}</p>
                <p className="mt-1.5 truncate text-lg font-bold tracking-tight text-[#2C2117]">
                  {value}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-[#9C8B7A]">
                  {sub}
                </p>
              </div>
              <Icon size={18} className="mt-0.5 shrink-0 text-[#B8A590]" />
            </div>
          ))}
        </section>

        {/* RBAC Route Matrix */}
        <section className="rounded-2xl border border-[#EAE3D8] bg-white p-6 shadow-xs">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#2C2117]">
                Ma trận Phân quyền Route (RBAC)
              </h2>
              <p className="mt-0.5 text-xs text-[#8C7A68]">
                Quy tắc bảo vệ các tuyến đường trên ứng dụng EverWeb Frontend
              </p>
            </div>
            <span className="rounded-full border border-[#EAE3D8] bg-[#FBF5EA] px-3 py-1 text-[11px] font-semibold text-[#7A5622]">
              Fail-closed Authentication
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#EAE3D8] text-[11px] font-semibold tracking-wider text-[#8C7A68] uppercase">
                  <th className="py-3 pr-4">Đường dẫn (Route)</th>
                  <th className="px-4 py-3">Phân khu</th>
                  <th className="px-4 py-3">Lớp bảo vệ</th>
                  <th className="py-3 pl-4">Vai trò được phép</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3ECE1]">
                {RBAC_MATRIX.map((row) => (
                  <tr key={row.route} className="hover:bg-[#FCFBF8]">
                    <td className="py-3.5 pr-4">
                      <code className="font-mono-num rounded bg-[#F6F2EA] px-2 py-1 font-semibold text-[#2C2117]">
                        {row.route}
                      </code>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#2C2117]">
                      {row.scope}
                    </td>
                    <td className="px-4 py-3.5 text-[#6D5B4B]">{row.guard}</td>
                    <td className="py-3.5 pl-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          row.tier === "admin"
                            ? "bg-[#2F241D] text-[#E8CD94]"
                            : row.tier === "couple"
                              ? "bg-[#EFE6D6] text-[#7A5622]"
                              : row.tier === "guest"
                                ? "bg-sky-50 text-sky-700"
                                : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {row.allowed}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* System Modules */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SYSTEM_MODULES.map(
            ({ key, title, description, icon: Icon, badge }) => (
              <div
                key={key}
                className="flex flex-col justify-between rounded-2xl border border-[#EAE3D8] bg-white p-6 transition hover:border-[#C5A059]/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBF5EA] text-[#A67C37]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#2C2117]">
                        {title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#7D6D5E]">
                        {description}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#EAE3D8] bg-[#FCFBF8] px-2.5 py-0.5 text-[10px] font-semibold text-[#8C7A68]">
                    {badge}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#F3ECE1] pt-3.5">
                  <span className="text-[11px] text-[#9C8B7A]">
                    Phạm vi truy cập: Chỉ Quản trị viên
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      toast.info(
                        `Module "${title}" đang sẵn sàng kết nối API quản trị chi tiết.`
                      )
                    }
                    className="text-xs font-semibold text-[#A67C37] transition hover:text-[#7A5622]"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            )
          )}
        </section>
      </main>
    </div>
  );
}
