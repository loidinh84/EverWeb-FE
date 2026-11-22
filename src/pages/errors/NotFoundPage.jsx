import { useLocation, useNavigate } from "react-router-dom";
import { Compass, Home, LayoutDashboard } from "lucide-react";
import { getDefaultRouteByRole, ROUTE_PATHS } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";

export default function NotFoundPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F2EA] px-4 py-12 text-[#2C2117]">
      <div className="w-full max-w-md rounded-2xl border border-[#EAE3D8] bg-[#FCFBF8] p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBF5EA] text-[#A67C37]">
          <Compass size={28} />
        </div>

        <p className="font-mono-num mt-4 text-xs font-semibold tracking-widest text-[#A67C37] uppercase">
          404 · Not Found
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold text-[#2C2117] sm:text-4xl">
          Không tìm thấy trang
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-[#7D6D5E]">
          Đường dẫn{" "}
          <code className="font-mono-num rounded bg-[#F3ECE1] px-1.5 py-0.5 text-xs text-[#2C2117]">
            {location.pathname}
          </code>{" "}
          không tồn tại hoặc đã được chuyển đi.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.HOME)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2F241D] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#44352B]"
          >
            <Home size={14} />
            <span>Về trang chủ</span>
          </button>

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => navigate(getDefaultRouteByRole(user?.role))}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DFD5C5] bg-white px-4 py-2.5 text-xs font-semibold text-[#2C2117] transition hover:border-[#C5A059]"
            >
              <LayoutDashboard size={14} />
              <span>Về trang quản trị</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
