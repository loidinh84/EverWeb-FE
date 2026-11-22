import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "../components/common";
import { hasRequiredRole, ROLES } from "../constants/roles";
import {
  AUTH_UNAUTHORIZED_EVENT,
  clearStoredAuthToken,
  getStoredAuthToken,
  setStoredAuthToken,
} from "../services/api";
import authApi from "../services/authApi";
import { AuthContext } from "./authContextObject";

export function AuthProvider({ children }) {
  const toast = useToast();
  const [token, setToken] = useState(() => getStoredAuthToken());
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getStoredAuthToken()));

  const tokenRef = useRef(token);
  const unauthorizedToastLockRef = useRef(0);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  // Hydrate user profile from backend when a stored token is present
  useEffect(() => {
    if (!token || user) {
      return undefined;
    }

    let cancelled = false;

    authApi
      .getMe()
      .then((me) => {
        if (cancelled) return;
        if (!me || me.is_active === false) {
          clearStoredAuthToken();
          setToken(null);
          setUser(null);
          return;
        }
        setUser(me);
      })
      .catch((error) => {
        if (cancelled) return;
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          clearStoredAuthToken();
          setToken(null);
          setUser(null);
        } else {
          // Fail-closed: do not grant authenticated state if session cannot be verified
          setUser(null);
          toast.warning(
            "Không thể xác thực phiên đăng nhập với máy chủ. Vui lòng thử lại."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, user, toast]);

  // Listen for global 401 unauthorized events from Axios interceptor
  useEffect(() => {
    const handleUnauthorized = (event) => {
      clearStoredAuthToken();
      setToken(null);
      setUser(null);
      setIsLoading(false);

      const now = Date.now();
      if (now - unauthorizedToastLockRef.current > 1500) {
        unauthorizedToastLockRef.current = now;
        toast.warning(
          event?.detail?.message ||
            "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại."
        );
      }
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [toast]);

  // Sync auth session across browser tabs
  useEffect(() => {
    const handleStorage = () => {
      const nextToken = getStoredAuthToken();
      if (!nextToken) {
        if (tokenRef.current !== null) {
          setToken(null);
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      if (nextToken !== tokenRef.current) {
        setIsLoading(true);
        setUser(null);
        setToken(nextToken);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const result = await authApi.login(credentials);
    if (!result?.token || !result?.user) {
      throw new Error("Phản hồi đăng nhập không hợp lệ.");
    }
    setStoredAuthToken(result.token);
    setToken(result.token);
    setUser(result.user);
    setIsLoading(false);
    return result;
  }, []);

  const register = useCallback(async (payload) => {
    const result = await authApi.register(payload);
    if (!result?.token || !result?.user) {
      throw new Error("Phản hồi đăng ký không hợp lệ.");
    }
    setStoredAuthToken(result.token);
    setToken(result.token);
    setUser(result.user);
    setIsLoading(false);
    return result;
  }, []);

  const logout = useCallback(
    ({ silent = false } = {}) => {
      clearStoredAuthToken();
      setToken(null);
      setUser(null);
      setIsLoading(false);
      if (!silent) {
        toast.info("Đã đăng xuất khỏi tài khoản.");
      }
    },
    [toast]
  );

  const refreshUser = useCallback(async () => {
    const currentToken = getStoredAuthToken();
    if (!currentToken) {
      setToken(null);
      setUser(null);
      return null;
    }

    try {
      const me = await authApi.getMe();
      if (!me || me.is_active === false) {
        clearStoredAuthToken();
        setToken(null);
        setUser(null);
        return null;
      }
      setUser(me);
      return me;
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        clearStoredAuthToken();
        setToken(null);
        setUser(null);
      }
      throw error;
    }
  }, []);

  const hasRole = useCallback(
    (allowedRoles) => hasRequiredRole(user, allowedRoles),
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      role: user?.role || null,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === ROLES.ADMIN,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      hasRole,
    }),
    [user, token, isLoading, login, register, logout, refreshUser, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
