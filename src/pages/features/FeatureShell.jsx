import { ArrowLeft, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../constants/roles";

/**
 * Thanh header dùng chung cho 7 trang chức năng mở từ Trung tâm sự kiện (/hub).
 */
export default function FeatureShell({
  title,
  subtitle,
  wedding,
  actions,
  children,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F6F3] text-[#2C2117]">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-[#EAE6DF] bg-white/95 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(ROUTE_PATHS.EVENT_HUB, { state: { wedding } })
            }
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#5E5042] transition-all duration-200 hover:bg-[#F3F0EA] hover:text-[#2C2117] active:scale-95"
          >
            <ArrowLeft size={15} />
            Trung tâm sự kiện
          </button>
          <span className="hidden h-4 w-px bg-[#E6DFD3] sm:block" />
          <div className="hidden sm:block">
            <h1 className="font-display text-lg leading-none font-semibold text-[#2C2117]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-[11px] text-[#8C7A68]">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {actions}
          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.DASHBOARD_DEFAULT)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E2D9CB] bg-white px-3.5 py-1.5 text-xs font-medium text-[#5E5042] transition-all duration-200 hover:border-[#3B52DE] hover:text-[#3B52DE] active:scale-95"
          >
            <LayoutGrid size={13} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        </div>
      </header>

      <main className="ew-slide-up mx-auto w-full max-w-[1440px] flex-1 p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
