import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import {
  getDefaultRouteByRole,
  ROLE_LABELS,
  ROUTE_PATHS,
} from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";

export default function UnauthorizedPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = user?.role || location.state?.currentRole || null;
  const requiredRoles = Array.isArray(location.state?.requiredRoles)
    ? location.state.requiredRoles
    : [];
  const deniedPath = location.state?.from?.pathname || "";

  const currentRoleLabel = currentRole
    ? ROLE_LABELS[currentRole] || currentRole
    : "Chưa đăng nhập";
  const requiredRoleLabels = requiredRoles.map(
    (role) => ROLE_LABELS[role] || role
  );

  const handleGoMyWorkspace = () => {
    if (isAuthenticated) {
      navigate(getDefaultRouteByRole(user?.role), { replace: true });
    } else {
      navigate(ROUTE_PATHS.LOGIN, { replace: true });
    }
  };

  const handleSwitchAccount = () => {
    logout({ silent: true });
    navigate(ROUTE_PATHS.LOGIN, {
      replace: true,
      state: location.state?.from ? { from: location.state.from } : undefined,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F2EA] px-4 py-12 text-[#2C2117]">
      <div className="w-full max-w-lg rounded-2xl border border-[#EAE3D8] bg-[#FCFBF8] p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600">
          <ShieldAlert size={28} />
        </div>

        <p className="font-mono-num mt-4 text-xs font-semibold tracking-widest text-rose-600 uppercase">
          403 · Forbidden
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold text-[#2C2117] sm:text-4xl">
          Không có quyền truy cập
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-[#7D6D5E]">
          Tài khoản hiện tại không đủ phân quyền để mở khu vực quản trị này.
        </p>

        <div className="mt-6 space-y-2 rounded-xl border border-[#EAE3D8] bg-[#F6F2EA]/70 p-4 text-left text-xs text-[#5A4228]">
          {deniedPath && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#8C7A68]">Đường dẫn yêu cầu:</span>
              <code className="font-mono-num rounded bg-white px-2 py-0.5 font-semibold text-[#2C2117]">
                {deniedPath}
              </code>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#8C7A68]">Vai trò hiện tại:</span>
            <span className="rounded-full bg-[#EFE6D6] px-2.5 py-0.5 font-semibold text-[#7A5622]">
              {currentRoleLabel}
            </span>
          </div>
          {requiredRoleLabels.length > 0 && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#8C7A68]">Quyền được phép:</span>
              <span className="rounded-full bg-[#2F241D] px-2.5 py-0.5 font-semibold text-[#E8CD94]">
                {requiredRoleLabels.join(", ")}
              </span>
            </div>
          )}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={handleGoMyWorkspace}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2F241D] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#44352B]"
          >
            <LayoutDashboard size={14} />
            <span>
              {isAuthenticated ? "Về không gian của tôi" : "Đi tới Đăng nhập"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#DFD5C5] bg-white px-4 py-2.5 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059]"
          >
            <ArrowLeft size={14} />
            <span>Quay lại</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.HOME)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#DFD5C5] bg-white px-4 py-2.5 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059]"
          >
            <Home size={14} />
            <span>Trang chủ</span>
          </button>
        </div>

        {isAuthenticated && (
          <div className="mt-5 border-t border-[#EAE3D8] pt-4">
            <button
              type="button"
              onClick={handleSwitchAccount}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C7A68] transition hover:text-rose-600"
            >
              <LogOut size={13} />
              <span>Đăng xuất và đổi tài khoản khác</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
