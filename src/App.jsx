import { Suspense, lazy } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  ADMIN_ALLOWED_ROLES,
  DASHBOARD_ALLOWED_ROLES,
  getDefaultRouteByRole,
  ROUTE_PATHS,
} from "./constants/roles";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

const Landing = lazy(() => import("./pages/landing/Landing"));
const InvitationPreview = lazy(() => import("./pages/InvitationPreview"));
const PublicContactPage = lazy(() => import("./pages/PublicContactPage"));
const PublicWeddingPage = lazy(() => import("./pages/PublicWeddingPage"));
const PublicRsvpPage = lazy(() => import("./pages/PublicRsvpPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const CreateEventPage = lazy(() => import("./pages/onboarding/CreateEventPage"));
const WeddingSetupPage = lazy(() => import("./pages/onboarding/WeddingSetupPage"));
const EventHubPage = lazy(() => import("./pages/onboarding/EventHubPage"));
const WebsitePreviewPage = lazy(() => import("./pages/onboarding/WebsitePreviewPage"));
const EventSettingsPage = lazy(() => import("./pages/onboarding/EventSettingsPage"));
const WebsiteDesignPage = lazy(() => import("./pages/features/WebsiteDesignPage"));
const CollectContactsPage = lazy(() => import("./pages/features/CollectContactsPage"));
const RsvpBuilderPage = lazy(() => import("./pages/features/RsvpBuilderPage"));
const MessagingPage = lazy(() => import("./pages/features/MessagingPage"));
const TravelPage = lazy(() => import("./pages/features/TravelPage"));
const InvitationsStudioPage = lazy(() => import("./pages/features/InvitationsStudioPage"));
const RegistryPage = lazy(() => import("./pages/features/RegistryPage"));
const ScheduleEditorPage = lazy(() => import("./pages/features/ScheduleEditorPage"));
const GuestListPage = lazy(() => import("./pages/features/GuestListPage"));
const SeatingChartPage = lazy(() => import("./pages/features/SeatingChartPage"));
const PhotoMomentsPage = lazy(() => import("./pages/features/PhotoMomentsPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const UnauthorizedPage = lazy(() => import("./pages/errors/UnauthorizedPage"));
const NotFoundPage = lazy(() => import("./pages/errors/NotFoundPage"));
const WeddingAssistantChatbot = lazy(() =>
  import("./components/chat/WeddingAssistantChatbot")
);

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-stone-500">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-[#1F1A17]" />
        <span className="text-xs font-medium tracking-wide">Đang tải...</span>
      </div>
    </div>
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
  const location = useLocation();
  const isInvitationOrWebsite =
    location.pathname.startsWith(ROUTE_PATHS.INVITATION) ||
    location.pathname.startsWith("/w/") ||
    location.pathname.startsWith("/rsvp/") ||
    location.pathname.startsWith("/contact/");

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={ROUTE_PATHS.HOME} element={<HomeRoute />} />
        <Route path={ROUTE_PATHS.INVITATION} element={<InvitationPreview />} />
        <Route
          path={`${ROUTE_PATHS.INVITATION}/:token`}
          element={<InvitationPreview />}
        />
        <Route path="/contact/:slug" element={<PublicContactPage />} />
        <Route path="/w/:slug" element={<PublicWeddingPage />} />
        <Route path="/rsvp/:slug" element={<PublicRsvpPage />} />
        <Route
          path={ROUTE_PATHS.WEBSITE_PREVIEW}
          element={<WebsitePreviewPage />}
        />
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
      {!isInvitationOrWebsite && (
        <Suspense fallback={null}>
          <WeddingAssistantChatbot />
        </Suspense>
      )}
    </Suspense>
  );
}

export default App;
