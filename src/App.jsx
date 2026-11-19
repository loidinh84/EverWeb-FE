import { useState } from "react";
import { useToast } from "./components/common";
import DashboardLayout from "./layouts/DashboardLayout";
import { DASHBOARD_NAV_ITEMS, SAMPLE_WEDDINGS } from "./layouts/navItems";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import SeatingPlanPage from "./pages/dashboard/SeatingPlanPage";
import AlbumQrPage from "./pages/dashboard/AlbumQrPage";
import LandingPage from "./pages/LandingPage";

function App() {
  const toast = useToast();
  const [view, setView] = useState("dashboard");
  const [activeKey, setActiveKey] = useState("seating");
  const [selectedWeddingId, setSelectedWeddingId] = useState(
    SAMPLE_WEDDINGS[0].id
  );

  if (view === "landing") {
    return (
      <div className="relative">
        <LandingPage />
        <button
          type="button"
          onClick={() => setView("dashboard")}
          className="fixed right-5 bottom-5 z-50 rounded-full bg-[#3B2A1A] px-4 py-2.5 text-xs font-semibold text-white shadow-xl ring-2 ring-[#C5A059] transition hover:bg-[#4E3824]"
        >
          ← Quay lại Dashboard
        </button>
      </div>
    );
  }

  const currentNav = DASHBOARD_NAV_ITEMS.find((item) => item.key === activeKey);
  const selectedWedding = SAMPLE_WEDDINGS.find(
    (w) => w.id === selectedWeddingId
  );

  return (
    <DashboardLayout
      activeKey={activeKey}
      onNavigate={setActiveKey}
      weddings={SAMPLE_WEDDINGS}
      selectedWeddingId={selectedWeddingId}
      onSelectWedding={setSelectedWeddingId}
      onGoHome={() => setView("landing")}
      onBellClick={() => toast.info("Bạn có 2 xác nhận RSVP mới")}
    >
      {activeKey === "seating" ? (
        <SeatingPlanPage
          selectedWedding={selectedWedding}
          onOpenBudget={() => setActiveKey("budget")}
        />
      ) : activeKey === "album" ? (
        <AlbumQrPage selectedWedding={selectedWedding} />
      ) : activeKey === "overview" ? (
        <DashboardOverview selectedWedding={selectedWedding} />
      ) : (
        <div className="rounded-2xl border border-[#EAE3D8] bg-white p-10 text-center">
          <h2 className="text-2xl font-bold text-[#2C2117]">
            {currentNav?.label}
          </h2>
          <p className="mt-2 text-sm text-[#8C7A68]">
            Khu vực này đang chờ ghép màn hình chi tiết của{" "}
            <b>{selectedWedding?.label}</b> ở các task tiếp theo.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}

export default App;
