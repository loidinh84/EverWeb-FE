import { useAuth } from "../hooks/useAuth";

export default function RoleGate({
  allowedRoles = [],
  fallback = null,
  children,
}) {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated || !hasRole(allowedRoles)) {
    return fallback;
  }

  return children;
}
