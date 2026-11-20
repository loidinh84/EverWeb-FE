import { useState } from "react";
import { useToast } from "./components/common";
import DashboardLayout from "./layouts/DashboardLayout";
import { DASHBOARD_NAV_ITEMS, SAMPLE_WEDDINGS } from "./layouts/navItems";
import DashboardOverview from "./pages/dashboard/overview/DashboardOverview";
import SeatingPlanPage from "./pages/dashboard/SeatingPlanPage";
import AlbumQrPage from "./pages/dashboard/album/AlbumQrPage";
import BudgetPage from "./pages/dashboard/budget/BudgetPage";
import GuestsPage from "./pages/dashboard/guests/GuestsPage";
import ServicesPage from "./pages/dashboard/services/ServicesPage";
import SchedulePage from "./pages/dashboard/schedule/SchedulePage";
import AssistantPage from "./pages/dashboard/assistant/AssistantPage";
import LandingPage from "./pages/LandingPage";
import WeddingAssistantChatbot from "./components/chat/WeddingAssistantChatbot";

function App() {
  const toast = useToast();
  const [view, setView] = useState("dashboard");
  const [activeKey, setActiveKey] = useState("seating");
  const [selectedWeddingId, setSelectedWeddingId] = useState(
    SAMPLE_WEDDINGS[0].id
  );

  const currentNav = DASHBOARD_NAV_ITEMS.find((item) => item.key === activeKey);
  const selectedWedding = SAMPLE_WEDDINGS.find(
    (w) => w.id === selectedWeddingId
  );

  return (
    <>
      {view === "landing" ? (
        <div className="relative">
          <LandingPage />
          <button
            type="button"
            onClick={() => setView("dashboard")}
            className="fixed left-5 bottom-5 z-40 rounded-full bg-[#3B2A1A] px-4 py-2.5 text-xs font-semibold text-white shadow-xl ring-2 ring-[#C5A059] transition hover:bg-[#4E3824]"
          >
            ← Quay lại Dashboard
          </button>
        </div>
      ) : (
        <DashboardLayout
          activeKey={activeKey}
          onNavigate={setActiveKey}
          weddings={SAMPLE_WEDDINGS}
          selectedWeddingId={selectedWeddingId}
          onSelectWedding={setSelectedWeddingId}
          onGoHome={() => setView("landing")}
          onBellClick={() => toast.info("Bạn có 2 xác nhận RSVP mới")}
        >
          {activeKey === "assistant" ? (
            <AssistantPage selectedWedding={selectedWedding} />
          ) : activeKey === "seating" ? (
            <SeatingPlanPage
              selectedWedding={selectedWedding}
              onOpenBudget={() => setActiveKey("budget")}
            />
          ) : activeKey === "budget" ? (
            <BudgetPage selectedWedding={selectedWedding} />
          ) : activeKey === "guests" ? (
            <GuestsPage selectedWedding={selectedWedding} />
          ) : activeKey === "services" ? (
            <ServicesPage selectedWedding={selectedWedding} />
          ) : activeKey === "schedule" ? (
            <SchedulePage selectedWedding={selectedWedding} />
          ) : activeKey === "album" ? (
            <AlbumQrPage selectedWedding={selectedWedding} />
          ) : activeKey === "overview" ? (
            <DashboardOverview
              selectedWedding={selectedWedding}
              onNavigate={setActiveKey}
            />
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
      )}

      {/* Trợ lý Kế hoạch Cưới Én Hỷ - Floating Chatbot */}
      <WeddingAssistantChatbot selectedWedding={selectedWedding} />
    </>
  );
}

export default App;
