import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
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
import Landing from "./pages/Landing";
import InvitationPreview from "./pages/InvitationPreview";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import UnauthorizedPage from "./pages/errors/UnauthorizedPage";
import NotFoundPage from "./pages/errors/NotFoundPage";
import WeddingAssistantChatbot from "./components/chat/WeddingAssistantChatbot";
import {
  ADMIN_ALLOWED_ROLES,
  DASHBOARD_ALLOWED_ROLES,
  getDefaultRouteByRole,
  ROUTE_PATHS,
} from "./constants/roles";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import { extractApiError } from "./services/api";
import weddingApi from "./services/weddingApi";

const VALID_DASHBOARD_SECTIONS = new Set(
  DASHBOARD_NAV_ITEMS.map((item) => item.key)
);

function DashboardWorkspace() {
  const toast = useToast();
  const navigate = useNavigate();
  const { section } = useParams();
  const { user, logout } = useAuth();

  const isValidSection = Boolean(section && VALID_DASHBOARD_SECTIONS.has(section));
  const activeKey = isValidSection ? section : "profile";

  const [weddings, setWeddings] = useState([]);
  const [selectedWeddingId, setSelectedWeddingId] = useState("");
  const [isLoadingWeddings, setIsLoadingWeddings] = useState(true);
  const [weddingsLoadError, setWeddingsLoadError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleNavigateSection = useCallback(
    (key) => {
      navigate(`${ROUTE_PATHS.DASHBOARD}/${key}`);
    },
    [navigate]
  );

  useEffect(() => {
    if (!isValidSection) return undefined;

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
  }, [isValidSection]);

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
    handleNavigateSection("profile");
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

  const handleLogout = useCallback(() => {
    logout();
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  }, [logout, navigate]);

  const handleGoAdmin = useCallback(() => {
    navigate(ROUTE_PATHS.ADMIN);
  }, [navigate]);

  const currentNav = DASHBOARD_NAV_ITEMS.find((item) => item.key === activeKey);
  const selectedWedding = useMemo(
    () => weddings.find((w) => w.id === selectedWeddingId) || weddings[0] || null,
    [weddings, selectedWeddingId]
  );

  if (!isValidSection) {
    return <Navigate to={ROUTE_PATHS.DASHBOARD_DEFAULT} replace />;
  }

  return (
    <>
      <DashboardLayout
        activeKey={activeKey}
        onNavigate={handleNavigateSection}
        weddings={weddings}
        selectedWeddingId={selectedWedding?.id || ""}
        onSelectWedding={setSelectedWeddingId}
        onCreateWeddingClick={() => setIsCreateModalOpen(true)}
        onGoHome={() => navigate(ROUTE_PATHS.HOME)}
        onBellClick={() => toast.info("Bạn có 2 xác nhận tham dự mới")}
        user={user}
        onLogout={handleLogout}
        onGoAdmin={handleGoAdmin}
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
            onOpenBudget={() => handleNavigateSection("budget")}
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
            onNavigate={handleNavigateSection}
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
              onClick={() => handleNavigateSection("profile")}
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#C5A059] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#B28D46]"
            >
              Mở Hồ sơ cặp đôi
            </button>
          </div>
        )}
      </DashboardLayout>

      <CreateWeddingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateWedding}
      />

      {/* Trợ lý Kế hoạch Cưới Én Hỷ - Chỉ hiển thị trong trang quản trị Dashboard */}
      <WeddingAssistantChatbot selectedWedding={selectedWedding} />
    </>
  );
}

function HomeRoute() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  if (searchParams.has("token")) {
    return <InvitationPreview />;
  }

  if (location.hash.includes("dashboard")) {
    return <Navigate to={ROUTE_PATHS.DASHBOARD_DEFAULT} replace />;
  }

  return (
    <Landing
      onOpenDashboard={() =>
        navigate(
          isAuthenticated ? getDefaultRouteByRole(user?.role) : ROUTE_PATHS.LOGIN
        )
      }
    />
  );
}

function App() {
  return (
    <Routes>
      <Route path={ROUTE_PATHS.HOME} element={<HomeRoute />} />
      <Route path={ROUTE_PATHS.INVITATION} element={<InvitationPreview />} />
      <Route
        path={`${ROUTE_PATHS.INVITATION}/:token`}
        element={<InvitationPreview />}
      />
      <Route path={ROUTE_PATHS.UNAUTHORIZED} element={<UnauthorizedPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
        <Route path={ROUTE_PATHS.REGISTER} element={<RegisterPage />} />
      </Route>

      <Route
        element={<ProtectedRoute allowedRoles={DASHBOARD_ALLOWED_ROLES} />}
      >
        <Route
          path={ROUTE_PATHS.DASHBOARD}
          element={<Navigate to={ROUTE_PATHS.DASHBOARD_DEFAULT} replace />}
        />
        <Route
          path={`${ROUTE_PATHS.DASHBOARD}/:section`}
          element={<DashboardWorkspace />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={ADMIN_ALLOWED_ROLES} />}>
        <Route path={ROUTE_PATHS.ADMIN} element={<AdminDashboardPage />} />
        <Route
          path={`${ROUTE_PATHS.ADMIN}/*`}
          element={<AdminDashboardPage />}
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
