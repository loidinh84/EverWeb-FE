import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Heart,
  X,
} from "lucide-react";
import { DASHBOARD_NAV_ITEMS } from "./navItems";

function SidebarContent({
  activeKey,
  onSelect,
  weddings,
  selectedWeddingId,
  onSelectWedding,
  collapsed,
  onCloseMobile,
}) {
  const workspaceItems = DASHBOARD_NAV_ITEMS.filter(
    (item) => item.group === "workspace"
  );
  const footerItems = DASHBOARD_NAV_ITEMS.filter(
    (item) => item.group === "footer"
  );

  return (
    <div className="flex h-full flex-col bg-[#2F241D] text-[#EDE4D6]">
      {/* Brand header */}
      <div
        className={`flex h-16 items-center border-b border-white/10 ${
          collapsed ? "justify-center px-3" : "justify-between px-4"
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C5A059] text-[#2F241D] shadow-xs">
            <Flower2 size={19} />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight text-white">
                Hoa Tình Yêu
              </p>
              <p className="text-[10px] tracking-widest text-[#CBBBA8] uppercase">
                Ngày chung đôi
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onCloseMobile}
          className="rounded-lg p-1.5 text-[#CBBBA8] transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Đóng menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Wedding selector */}
      {!collapsed && weddings?.length > 0 && (
        <div className="border-b border-white/10 px-4 py-3.5">
          <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-[#B6A38E] uppercase">
            Tiệc cưới của bạn
          </p>
          <div className="relative">
            <select
              value={selectedWeddingId}
              onChange={(e) => onSelectWedding?.(e.target.value)}
              aria-label="Chọn tiệc cưới"
              className="w-full appearance-none rounded-xl border border-white/15 bg-white/5 py-2 pr-8 pl-3 text-sm font-medium text-white transition outline-none hover:border-[#C5A059]/60 focus:border-[#C5A059]"
            >
              {weddings.map((w) => (
                <option key={w.id} value={w.id} className="bg-[#3B2A1A] text-white">
                  {w.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[#CBBBA8]"
            />
          </div>
        </div>
      )}

      {/* Main navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <p className="px-3 pb-1.5 text-[10px] font-semibold tracking-wider text-[#B6A38E] uppercase">
            Không gian quản lý
          </p>
        )}

        {workspaceItems.map(({ key, label, icon: Icon }) => {
          const isActive = activeKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                onSelect?.(key);
                onCloseMobile?.();
              }}
              title={collapsed ? label : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-[#FBF5EA] font-semibold text-[#3B2A1A] shadow-xs"
                  : "font-medium text-[#DFD3C3] hover:bg-white/10 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon
                size={18}
                className={`shrink-0 ${
                  isActive ? "text-[#A67C37]" : "text-[#CBBBA8]"
                }`}
              />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Quote card + Settings footer */}
      <div className="space-y-3 border-t border-white/10 p-3">
        {!collapsed && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs leading-relaxed text-[#DFD3C3]">
            <Heart size={14} className="mb-1.5 text-[#D4AF6A]" />
            <p className="font-medium text-white">
              Từng chi tiết nhỏ, một ngày thật trọn vẹn.
            </p>
            <p className="mt-0.5 text-[11px] text-[#B6A38E]">
              Luôn đồng hành cùng bạn.
            </p>
          </div>
        )}

        {footerItems.map(({ key, label, icon: Icon }) => {
          const isActive = activeKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                onSelect?.(key);
                onCloseMobile?.();
              }}
              title={collapsed ? label : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-[#FBF5EA] font-semibold text-[#3B2A1A]"
                  : "font-medium text-[#CBBBA8] hover:bg-white/10 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Sidebar({
  activeKey,
  onSelect,
  weddings,
  selectedWeddingId,
  onSelectWedding,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) {
  return (
    <>
      <aside
        className={`relative hidden shrink-0 transition-all duration-200 lg:block ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent
          activeKey={activeKey}
          onSelect={onSelect}
          weddings={weddings}
          selectedWeddingId={selectedWeddingId}
          onSelectWedding={onSelectWedding}
          collapsed={collapsed}
        />

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          className="absolute top-5 -right-3 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-[#E6DDD0] bg-white text-[#5A4228] shadow-xs transition hover:scale-105 hover:border-[#C5A059]"
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-50 w-64 shadow-2xl">
            <SidebarContent
              activeKey={activeKey}
              onSelect={onSelect}
              weddings={weddings}
              selectedWeddingId={selectedWeddingId}
              onSelectWedding={onSelectWedding}
              collapsed={false}
              onCloseMobile={onCloseMobile}
            />
          </aside>
        </div>
      )}
    </>
  );
}
