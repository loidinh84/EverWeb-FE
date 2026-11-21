import axios from "axios";

const TOKEN_STORAGE_KEYS = ["token", "accessToken", "everweb_token"];

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
