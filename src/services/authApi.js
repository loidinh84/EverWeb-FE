import api from "./api";

export const authApi = {
  async login({ email, password }) {
    const response = await api.post(
      "/auth/login",
      { email, password },
      { _skipAuthEvent: true }
    );
    return {
      user: response.data?.data?.user ?? null,
      token: response.data?.data?.token ?? null,
      message: response.data?.message || "Đăng nhập thành công!",
    };
  },

  async register({ email, password, full_name }) {
    const response = await api.post(
      "/auth/register",
      { email, password, full_name },
      { _skipAuthEvent: true }
    );
    return {
      user: response.data?.data?.user ?? null,
      token: response.data?.data?.token ?? null,
      message: response.data?.message || "Đăng ký tài khoản thành công!",
    };
  },

  async getMe() {
    const response = await api.get("/auth/me", { _skipAuthEvent: true });
    return response.data?.data?.user ?? null;
  },

  async checkAdminAccess() {
    const response = await api.get("/auth/admin-only");
    return response.data?.data ?? null;
  },

  async changePassword({ currentPassword, newPassword }) {
    const response = await api.patch("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post(
      "/auth/forgot-password",
      { email },
      { _skipAuthEvent: true }
    );
    return response.data;
  },

  async resetPassword({ token, newPassword }) {
    const response = await api.post(
      "/auth/reset-password",
      { token, newPassword },
      { _skipAuthEvent: true }
    );
    return response.data;
  },
};

export default authApi;
