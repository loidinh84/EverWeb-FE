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
        theme="colored"
        transition={Bounce}
      />
    </>
  );
}
