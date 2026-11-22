import { useContext } from "react";
import { AuthContext } from "../context/authContextObject";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider.");
  }
  return context;
}

export default useAuth;
