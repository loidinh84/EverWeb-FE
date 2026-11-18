import { toast } from "react-toastify";

/**
 * Wrapper quanh react-toastify để cả dự án gọi toast theo một kiểu thống nhất.
 * Nếu sau này đổi thư viện, chỉ cần sửa file này.
 *
 * const toast = useToast();
 * toast.success("Đã lưu thiệp mời");
 * toast.error("Có lỗi xảy ra", { duration: 5000 });
 * toast.promise(api.post(...), { pending: "Đang lưu...", success: "Đã lưu", error: "Lỗi" });
 */
const toOptions = ({ duration, ...rest } = {}) => ({
  ...(duration !== undefined && { autoClose: duration }),
  ...rest,
});

const toastApi = {
  success: (message, options) => toast.success(message, toOptions(options)),
  error: (message, options) => toast.error(message, toOptions(options)),
  warning: (message, options) => toast.warning(message, toOptions(options)),
  info: (message, options) => toast.info(message, toOptions(options)),
  promise: (promise, messages, options) =>
    toast.promise(promise, messages, toOptions(options)),
  dismiss: (id) => toast.dismiss(id),
};

export default function useToast() {
  return toastApi;
}
