import axios from "axios";

const TOKEN_STORAGE_KEYS = ["token", "accessToken", "everweb_token"];

export const AUTH_UNAUTHORIZED_EVENT = "everweb:auth-unauthorized";

const PUBLIC_AUTH_ENDPOINT_PATTERNS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export function getStoredAuthToken() {
  if (typeof window === "undefined") return null;
  try {
    for (const key of TOKEN_STORAGE_KEYS) {
      const val = window.localStorage.getItem(key);
      if (val && val.trim()) return val.trim();
    }
  } catch {
    return null;
  }
  return null;
}

export function clearStoredAuthToken() {
  if (typeof window === "undefined") return;
  try {
    for (const key of TOKEN_STORAGE_KEYS) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage access errors in restricted contexts
  }
}

export function setStoredAuthToken(token) {
  if (typeof window === "undefined") return;
  clearStoredAuthToken();
  if (typeof token === "string" && token.trim()) {
    try {
      window.localStorage.setItem(TOKEN_STORAGE_KEYS[0], token.trim());
    } catch {
      // Ignore storage access errors in restricted contexts
    }
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = getStoredAuthToken();
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const config = error?.config;
    const url = String(config?.url || "");

    const isPublicAuthRequest = PUBLIC_AUTH_ENDPOINT_PATTERNS.some((pattern) =>
      url.includes(pattern)
    );

    if (
      status === 401 &&
      !config?._skipAuthEvent &&
      !isPublicAuthRequest &&
      typeof window !== "undefined"
    ) {
      const hadAuth =
        Boolean(config?.headers?.Authorization) || Boolean(getStoredAuthToken());

      if (hadAuth) {
        clearStoredAuthToken();
        window.dispatchEvent(
          new CustomEvent(AUTH_UNAUTHORIZED_EVENT, {
            detail: {
              message:
                error?.response?.data?.message ||
                "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",
            },
          })
        );
      }
    }

    return Promise.reject(error);
  }
);

export function extractApiError(
  error,
  fallbackMessage = "Đã xảy ra lỗi, vui lòng thử lại."
) {
  const responseData = error?.response?.data;
  const statusCode = error?.response?.status ?? error?.status ?? 500;
  const message =
    responseData?.message || error?.message || fallbackMessage;

  const fieldErrors = {};
  const rawErrors = responseData?.errors;

  if (Array.isArray(rawErrors)) {
    rawErrors.forEach((item) => {
      if (item?.field && item?.message) {
        fieldErrors[item.field] = item.message;
      }
    });
  } else if (rawErrors && typeof rawErrors === "object") {
    Object.entries(rawErrors).forEach(([field, msg]) => {
      if (typeof msg === "string" && msg.trim()) {
        fieldErrors[field] = msg;
      } else if (Array.isArray(msg) && msg[0]) {
        fieldErrors[field] = String(msg[0]);
      }
    });
  }

  if (error?.field && message) {
    fieldErrors[error.field] = message;
  }

  return {
    message,
    statusCode,
    fieldErrors,
  };
}

export default api;
