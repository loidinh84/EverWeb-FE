import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "./components/common";
import DashboardLayout from "./layouts/DashboardLayout";
import { DASHBOARD_NAV_ITEMS } from "./layouts/navItems";
import DashboardOverview from "./pages/dashboard/overview/DashboardOverview";
import WeddingProfilePage from "./pages/dashboard/profile/WeddingProfilePage";
import CreateWeddingModal from "./pages/dashboard/profile/CreateWeddingModal";
import SeatingPlanPage from "./pages/dashboard/SeatingPlanPage";
import AlbumQrPage from "./pages/dashboard/album/AlbumQrPage";
import BudgetPage from "./pages/dashboard/budget/BudgetPage";
import GuestsPage from "./pages/dashboard/guests/GuestsPage";
import ServicesPage from "./pages/dashboard/services/ServicesPage";
import SchedulePage from "./pages/dashboard/schedule/SchedulePage";
import AssistantPage from "./pages/dashboard/assistant/AssistantPage";
import LandingPage from "./pages/LandingPage";
import WeddingAssistantChatbot from "./components/chat/WeddingAssistantChatbot";
import { extractApiError } from "./services/api";
import weddingApi from "./services/weddingApi";

function App() {
  const toast = useToast();
  const [view, setView] = useState("dashboard");
  const [activeKey, setActiveKey] = useState("profile");
  const [weddings, setWeddings] = useState([]);
  const [selectedWeddingId, setSelectedWeddingId] = useState("");
  const [isLoadingWeddings, setIsLoadingWeddings] = useState(true);
  const [weddingsLoadError, setWeddingsLoadError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    weddingApi
      .getAll()
      .then((items) => {
        if (cancelled) return;
        setWeddings(items);
        setWeddingsLoadError("");
        setSelectedWeddingId((prev) =>
          items.some((w) => w.id === prev) ? prev : items[0]?.id || ""
        );
      })
      .catch((error) => {
        if (cancelled) return;
        const msg = extractApiError(
          error,
          "Không thể tải danh sách hồ sơ đám cưới."
        ).message;
        setWeddingsLoadError(msg);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingWeddings(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleReloadWeddings = useCallback(async () => {
    setIsLoadingWeddings(true);
    setWeddingsLoadError("");
    try {
      const items = await weddingApi.getAll();
      setWeddings(items);
      setSelectedWeddingId((prev) =>
        items.some((w) => w.id === prev) ? prev : items[0]?.id || ""
      );
      toast.success("Đã tải lại danh sách hồ sơ đám cưới.");
    } catch (error) {
      const msg = extractApiError(
        error,
        "Không thể tải lại danh sách hồ sơ đám cưới."
      ).message;
      setWeddingsLoadError(msg);
      toast.error(msg);
    } finally {
      setIsLoadingWeddings(false);
    }
  }, [toast]);

  const handleCreateWedding = async (payload) => {
    const wedding = await weddingApi.create(payload);
    setWeddings((prev) => [wedding, ...prev]);
    setSelectedWeddingId(wedding.id);
    setWeddingsLoadError("");
    setActiveKey("profile");
    toast.success(`Đã tạo hồ sơ "${wedding.title}"`);
    return wedding;
  };

  const handleUpdateWedding = async (id, payload) => {
    const wedding = await weddingApi.update(id, payload);
    setWeddings((prev) => prev.map((w) => (w.id === id ? wedding : w)));
    toast.success("Đã lưu thay đổi hồ sơ đám cưới");
    return wedding;
  };

  const handleDeleteWedding = async (id) => {
    try {
      await weddingApi.remove(id);
      setWeddings((prev) => {
        const remaining = prev.filter((w) => w.id !== id);
        if (selectedWeddingId === id) {
          setSelectedWeddingId(remaining[0]?.id || "");
        }
        return remaining;
      });
      toast.success("Đã xoá hồ sơ đám cưới");
    } catch (error) {
      toast.error(
        extractApiError(error, "Không thể xoá hồ sơ đám cưới.").message
      );
      throw error;
    }
  };

  const currentNav = DASHBOARD_NAV_ITEMS.find((item) => item.key === activeKey);
  const selectedWedding = useMemo(
    () => weddings.find((w) => w.id === selectedWeddingId) || weddings[0] || null,
    [weddings, selectedWeddingId]
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
          weddings={weddings}
          selectedWeddingId={selectedWedding?.id || ""}
          onSelectWedding={setSelectedWeddingId}
          onCreateWeddingClick={() => setIsCreateModalOpen(true)}
          onGoHome={() => setView("landing")}
          onBellClick={() => toast.info("Bạn có 2 xác nhận RSVP mới")}
        >
          {activeKey === "profile" ? (
            <WeddingProfilePage
              weddings={weddings}
              selectedWedding={selectedWedding}
              isLoading={isLoadingWeddings}
              loadError={weddingsLoadError}
              onSelectWedding={setSelectedWeddingId}
              onUpdateWedding={handleUpdateWedding}
              onDeleteWedding={handleDeleteWedding}
              onOpenCreate={() => setIsCreateModalOpen(true)}
              onRetryLoad={handleReloadWeddings}
            />
          ) : activeKey === "assistant" ? (
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
                {selectedWedding ? (
                  <>
                    Khu vực cài đặt nâng cao cho{" "}
                    <b>{selectedWedding.label}</b> sẽ tiếp tục hoàn thiện ở các
                    task tiếp theo.
                  </>
                ) : (
                  "Chưa có hồ sơ đám cưới nào được chọn."
                )}
              </p>
              <button
                type="button"
                onClick={() => setActiveKey("profile")}
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#C5A059] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#B28D46]"
              >
                Mở Hồ sơ cặp đôi
              </button>
            </div>
          )}
        </DashboardLayout>
      )}

      <CreateWeddingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateWedding}
      />

      {/* Trợ lý Kế hoạch Cưới Én Hỷ - Floating Chatbot */}
      <WeddingAssistantChatbot selectedWedding={selectedWedding} />
    </>
  );
}

export default App;
