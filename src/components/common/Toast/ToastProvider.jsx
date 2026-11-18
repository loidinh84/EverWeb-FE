import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { ToastContext } from "./ToastContext";

const DEFAULT_DURATION = 3000;
const MAX_TOASTS = 5;

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    classes: "border-emerald-200 bg-emerald-50 text-emerald-800",
    iconClass: "text-emerald-500",
  },
  error: {
    icon: XCircle,
    classes: "border-red-200 bg-red-50 text-red-800",
    iconClass: "text-red-500",
  },
  warning: {
    icon: AlertTriangle,
    classes: "border-amber-200 bg-amber-50 text-amber-800",
    iconClass: "text-amber-500",
  },
  info: {
    icon: Info,
    classes: "border-sky-200 bg-sky-50 text-sky-800",
    iconClass: "text-sky-500",
  },
};

function ToastItem({ toast, onClose }) {
  const { icon: Icon, classes, iconClass } = VARIANTS[toast.type] || VARIANTS.info;

  useEffect(() => {
    if (!toast.duration) return undefined;
    const timer = setTimeout(() => onClose(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      className={`ew-slide-in pointer-events-auto flex w-80 items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${classes}`}
    >
      <Icon size={20} className={`mt-0.5 shrink-0 ${iconClass}`} />
      <p className="flex-1 text-sm leading-5 break-words">{toast.message}</p>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="shrink-0 rounded p-0.5 opacity-60 transition hover:opacity-100"
        aria-label="Đóng thông báo"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((type, message, options = {}) => {
    idRef.current += 1;
    const id = idRef.current;
    const toast = {
      id,
      type,
      message,
      duration: options.duration ?? DEFAULT_DURATION,
    };
    setToasts((prev) => [...prev, toast].slice(-MAX_TOASTS));
    return id;
  }, []);

  const value = useMemo(
    () => ({
      show,
      dismiss,
      success: (message, options) => show("success", message, options),
      error: (message, options) => show("error", message, options),
      warning: (message, options) => show("warning", message, options),
      info: (message, options) => show("info", message, options),
    }),
    [show, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          className="pointer-events-none fixed top-4 right-4 z-[60] flex flex-col gap-3"
        >
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={dismiss} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
