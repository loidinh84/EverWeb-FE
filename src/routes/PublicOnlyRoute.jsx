import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getSafeRedirectPath } from "../constants/roles";
import { useAuth } from "../hooks/useAuth";
import AuthLoadingScreen from "./AuthLoadingScreen";

export default function PublicOnlyRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    const target = getSafeRedirectPath(location.state?.from, user?.role);
    return <Navigate to={target} replace />;
  }

  return children ?? <Outlet />;
}
