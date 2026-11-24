export const ROLES = Object.freeze({
  ADMIN: "admin",
  COUPLE: "couple",
});

export const ROLE_LABELS = Object.freeze({
  [ROLES.ADMIN]: "Quản trị viên",
  [ROLES.COUPLE]: "Cặp đôi",
});

export const DASHBOARD_ALLOWED_ROLES = Object.freeze([
  ROLES.COUPLE,
  ROLES.ADMIN,
]);

export const ADMIN_ALLOWED_ROLES = Object.freeze([ROLES.ADMIN]);

export const ROUTE_PATHS = Object.freeze({
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  CREATE_EVENT: "/create-event",
  WEDDING_SETUP: "/onboarding/wedding",
  EVENT_HUB: "/hub",
  WEBSITE_PREVIEW: "/preview",
  EVENT_SETTINGS: "/event-settings",
  WEBSITE_DESIGN: "/website-design",
  COLLECT_CONTACTS: "/collect-contacts",
  RSVP_BUILDER: "/rsvp-builder",
  MESSAGING: "/messaging",
  TRAVEL: "/travel",
  INVITATIONS_STUDIO: "/invitations-studio",
  REGISTRY: "/registry",
  SCHEDULE_EDITOR: "/schedule-editor",
  GUEST_LIST: "/guest-list",
  SEATING_CHART: "/seating-chart",
  PHOTO_MOMENTS: "/photo-moments",
  INVITATION: "/invitation",
  DASHBOARD: "/hub",
  DASHBOARD_DEFAULT: "/hub",
  ADMIN: "/admin",
  UNAUTHORIZED: "/403",
});

const GUEST_AUTH_PATHS = new Set([
  ROUTE_PATHS.LOGIN,
  ROUTE_PATHS.REGISTER,
  ROUTE_PATHS.FORGOT_PASSWORD,
  ROUTE_PATHS.RESET_PASSWORD,
  ROUTE_PATHS.UNAUTHORIZED,
  "/unauthorized",
]);

export function hasRequiredRole(user, allowedRoles) {
  if (!user) return false;
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(user.role);
}

export function getDefaultRouteByRole(role) {
  return role === ROLES.ADMIN
    ? ROUTE_PATHS.ADMIN
    : ROUTE_PATHS.CREATE_EVENT;
}

export function getSafeRedirectPath(fromLocation, userRole) {
  if (!fromLocation) {
    return getDefaultRouteByRole(userRole);
  }

  let pathname = "";
  let search = "";
  let hash = "";

  if (typeof fromLocation === "string") {
    const trimmed = fromLocation.trim();
    if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
      return getDefaultRouteByRole(userRole);
    }
    const hashIdx = trimmed.indexOf("#");
    const beforeHash = hashIdx >= 0 ? trimmed.slice(0, hashIdx) : trimmed;
    hash = hashIdx >= 0 ? trimmed.slice(hashIdx) : "";
    const searchIdx = beforeHash.indexOf("?");
    pathname = searchIdx >= 0 ? beforeHash.slice(0, searchIdx) : beforeHash;
    search = searchIdx >= 0 ? beforeHash.slice(searchIdx) : "";
  } else if (typeof fromLocation === "object") {
    pathname =
      typeof fromLocation.pathname === "string" ? fromLocation.pathname : "";
    search =
      typeof fromLocation.search === "string" ? fromLocation.search : "";
    hash = typeof fromLocation.hash === "string" ? fromLocation.hash : "";
  }

  if (!pathname || !pathname.startsWith("/") || pathname.startsWith("//")) {
    return getDefaultRouteByRole(userRole);
  }

  if (GUEST_AUTH_PATHS.has(pathname)) {
    return getDefaultRouteByRole(userRole);
  }

  if (
    (pathname === ROUTE_PATHS.ADMIN ||
      pathname.startsWith(`${ROUTE_PATHS.ADMIN}/`)) &&
    userRole !== ROLES.ADMIN
  ) {
    return getDefaultRouteByRole(userRole);
  }

  return `${pathname}${search}${hash}`;
}
