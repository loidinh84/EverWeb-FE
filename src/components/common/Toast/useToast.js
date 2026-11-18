import { useContext } from "react";
import { ToastContext } from "./ToastContext";

/**
 * const toast = useToast();
 * toast.success("Đã lưu thiệp mời");
 * toast.error("Có lỗi xảy ra", { duration: 5000 });
 */
export default function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast phải được dùng bên trong <ToastProvider>");
  }
  return context;
}
