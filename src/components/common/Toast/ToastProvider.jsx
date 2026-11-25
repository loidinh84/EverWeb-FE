import { Bounce, ToastContainer } from "react-toastify";

/**
 * Bọc ngoài App để hiển thị toast (dùng thư viện react-toastify).
 * CSS của react-toastify v11 được tự động inject, không cần import.
 */
export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={5}
        newestOnTop
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss={false}
        draggable
        theme="light"
        transition={Bounce}
        toastClassName="!rounded-[18px] !border !border-white/75 !bg-white/65 !text-[#1F1A17] !shadow-xl !backdrop-blur-xl"
      />
    </>
  );
}
