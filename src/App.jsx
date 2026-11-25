import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Landing from "./pages/landing/Landing";
import InvitationPreview from "./pages/InvitationPreview";
import PublicContactPage from "./pages/PublicContactPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import CreateEventPage from "./pages/onboarding/CreateEventPage";
import WeddingSetupPage from "./pages/onboarding/WeddingSetupPage";
import EventHubPage from "./pages/onboarding/EventHubPage";
import WebsitePreviewPage from "./pages/onboarding/WebsitePreviewPage";
import EventSettingsPage from "./pages/onboarding/EventSettingsPage";
import WebsiteDesignPage from "./pages/features/WebsiteDesignPage";
import CollectContactsPage from "./pages/features/CollectContactsPage";
import RsvpBuilderPage from "./pages/features/RsvpBuilderPage";
import MessagingPage from "./pages/features/MessagingPage";
import TravelPage from "./pages/features/TravelPage";
import InvitationsStudioPage from "./pages/features/InvitationsStudioPage";
import RegistryPage from "./pages/features/RegistryPage";
import ScheduleEditorPage from "./pages/features/ScheduleEditorPage";
import GuestListPage from "./pages/features/GuestListPage";
import SeatingChartPage from "./pages/features/SeatingChartPage";
import PhotoMomentsPage from "./pages/features/PhotoMomentsPage";
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

function HomeRoute() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  if (searchParams.has("token")) {
    return <InvitationPreview />;
  }

  if (location.hash.includes("dashboard") || location.hash.includes("hub")) {
    return <Navigate to={ROUTE_PATHS.EVENT_HUB} replace />;
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
    <>
      <Routes>
        <Route path={ROUTE_PATHS.HOME} element={<HomeRoute />} />
        <Route path={ROUTE_PATHS.INVITATION} element={<InvitationPreview />} />
        <Route
          path={`${ROUTE_PATHS.INVITATION}/:token`}
          element={<InvitationPreview />}
        />
        <Route path="/contact/:slug" element={<PublicContactPage />} />
        <Route path={ROUTE_PATHS.UNAUTHORIZED} element={<UnauthorizedPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
          <Route path={ROUTE_PATHS.REGISTER} element={<RegisterPage />} />
          <Route
            path={ROUTE_PATHS.FORGOT_PASSWORD}
            element={<ForgotPasswordPage />}
          />
          <Route
            path={ROUTE_PATHS.RESET_PASSWORD}
            element={<ForgotPasswordPage />}
          />
        </Route>

        <Route
          element={<ProtectedRoute allowedRoles={DASHBOARD_ALLOWED_ROLES} />}
        >
          <Route path={ROUTE_PATHS.CREATE_EVENT} element={<CreateEventPage />} />
          <Route path={ROUTE_PATHS.WEDDING_SETUP} element={<WeddingSetupPage />} />
          <Route path={ROUTE_PATHS.EVENT_HUB} element={<EventHubPage />} />
          <Route
            path={ROUTE_PATHS.WEBSITE_PREVIEW}
            element={<WebsitePreviewPage />}
          />
          <Route
            path={ROUTE_PATHS.EVENT_SETTINGS}
            element={<EventSettingsPage />}
          />
          <Route
            path={ROUTE_PATHS.WEBSITE_DESIGN}
            element={<WebsiteDesignPage />}
          />
          <Route
            path={ROUTE_PATHS.COLLECT_CONTACTS}
            element={<CollectContactsPage />}
          />
          <Route
            path={ROUTE_PATHS.RSVP_BUILDER}
            element={<RsvpBuilderPage />}
          />
          <Route path={ROUTE_PATHS.MESSAGING} element={<MessagingPage />} />
          <Route path={ROUTE_PATHS.TRAVEL} element={<TravelPage />} />
          <Route
            path={ROUTE_PATHS.INVITATIONS_STUDIO}
            element={<InvitationsStudioPage />}
          />
          <Route path={ROUTE_PATHS.REGISTRY} element={<RegistryPage />} />
          <Route
            path={ROUTE_PATHS.SCHEDULE_EDITOR}
            element={<ScheduleEditorPage />}
          />
          <Route path={ROUTE_PATHS.GUEST_LIST} element={<GuestListPage />} />
          <Route
            path={ROUTE_PATHS.SEATING_CHART}
            element={<SeatingChartPage />}
          />
          <Route
            path={ROUTE_PATHS.PHOTO_MOMENTS}
            element={<PhotoMomentsPage />}
          />
          <Route
            path="/dashboard"
            element={<Navigate to={ROUTE_PATHS.EVENT_HUB} replace />}
          />
          <Route
            path="/dashboard/*"
            element={<Navigate to={ROUTE_PATHS.EVENT_HUB} replace />}
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
      <WeddingAssistantChatbot />
    </>
  );
}

export default App;
