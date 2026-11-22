import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "../constants/roles";
import { useAuth } from "../hooks/useAuth";
import AuthLoadingScreen from "./AuthLoadingScreen";

export default function ProtectedRoute({
  allowedRoles = [],
  redirectTo = ROUTE_PATHS.LOGIN,
  unauthorizedTo = ROUTE_PATHS.UNAUTHORIZED,
  children,
}) {
  const { user, isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location, reason: "unauthenticated" }}
      />
    );
  }

  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return (
      <Navigate
        to={unauthorizedTo}
        replace
        state={{
          from: location,
          requiredRoles: allowedRoles,
          currentRole: user?.role || null,
        }}
      />
    );
  }

  return children ?? <Outlet />;
}
