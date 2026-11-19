import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { DASHBOARD_NAV_ITEMS } from "./navItems";

/**
 * Layout Dashboard quản trị đám cưới theo thiết kế Figma Hoa Tình Yêu.
 */
export default function DashboardLayout({
  activeKey = "overview",
  onNavigate,
  weddings,
  selectedWeddingId,
  onSelectWedding,
  onGoHome,
  onBellClick,
  children,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentNav = DASHBOARD_NAV_ITEMS.find((item) => item.key === activeKey);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F2EA] text-[#2C2117]">
      <Sidebar
        activeKey={activeKey}
        onSelect={onNavigate}
        weddings={weddings}
        selectedWeddingId={selectedWeddingId}
        onSelectWedding={onSelectWedding}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          sectionLabel="Quản lý tiệc"
          pageLabel={currentNav?.label || "Tổng quan"}
          onOpenMobileMenu={() => setMobileOpen(true)}
          onGoHome={onGoHome}
          onGoServices={() => onNavigate?.("services")}
          onBellClick={onBellClick}
        />

        <main className="flex-1 overflow-y-auto p-5 sm:p-7 lg:px-8">
          <div className="mx-auto w-full max-w-[1480px] space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
