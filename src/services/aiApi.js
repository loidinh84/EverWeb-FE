import api from "./api";

/**
 * Service giao tiếp với module AI Trợ lý Kế hoạch Cưới ở Backend
 */
export const aiApi = {
  /**
   * Gửi tin nhắn chat nhanh (quick chat hoặc truyền mảng messages)
   * @param {Object} payload
   * @param {string} [payload.message] - Tin nhắn đơn
   * @param {Array<{role: string, content: string}>} [payload.messages] - Lịch sử trò chuyện
   * @param {string} [payload.weddingId] - ID đám cưới (để nhúng ngữ cảnh)
   * @param {'gemini'|'openai'} [payload.provider] - Chọn "gemini" hoặc "openai"
   * @param {string} [payload.model] - Tên model
   */
  async chat(payload) {
    const response = await api.post("/ai/chat", payload);
    return response.data;
  },

  /**
   * Chat theo phiên lưu trữ (lưu vào database)
   * @param {Object} payload
   * @param {string} [payload.sessionId] - ID phiên chat hiện tại (nếu có)
   * @param {string} [payload.weddingId] - ID đám cưới
   * @param {string} payload.message - Nội dung tin nhắn
   * @param {'gemini'|'openai'} [payload.provider]
   * @param {string} [payload.model]
   */
  async sessionChat(payload) {
    const response = await api.post("/ai/session-chat", payload);
    return response.data;
  },

  /**
   * Lấy danh sách các phiên trò chuyện (Lịch sử chat)
   * @param {string} [weddingId] - ID đám cưới
   * @param {number} [limit=20]
   */
  async getSessions(weddingId, limit = 20) {
    const response = await api.get("/ai/sessions", {
      params: {
        ...(weddingId ? { weddingId } : {}),
        limit,
      },
    });
    return response.data;
  },

  /**
   * Xem chi tiết 1 phiên trò chuyện kèm toàn bộ tin nhắn
   * @param {string} sessionId - ID phiên chat
   */
  async getSessionDetail(sessionId) {
    const response = await api.get(`/ai/sessions/${sessionId}`);
    return response.data;
  },

  /**
   * Tạo một phiên trò chuyện mới (New Chat)
   * @param {Object} [payload]
   * @param {string} [payload.weddingId]
   * @param {string} [payload.title]
   */
  async createSession(payload = {}) {
    const response = await api.post("/ai/sessions", payload);
    return response.data;
  },

  /**
   * Xóa một phiên trò chuyện
   * @param {string} sessionId
   */
  async deleteSession(sessionId) {
    const response = await api.delete(`/ai/sessions/${sessionId}`);
    return response.data;
  },

  /**
   * Xóa tất cả phiên trò chuyện
   * @param {string} [weddingId]
   */
  async clearAllSessions(weddingId) {
    const response = await api.delete("/ai/sessions", {
      params: weddingId ? { weddingId } : {},
    });
    return response.data;
  },

  /**
   * Lấy nội dung System Prompt của Trợ lý Kế hoạch Cưới
   * @param {string} [weddingId] - ID đám cưới (tùy chọn)
   */
  async getSystemPrompt(weddingId) {
    const response = await api.get("/ai/prompt", {
      params: weddingId ? { weddingId } : {},
    });
    return response.data;
  },
};

export default aiApi;

