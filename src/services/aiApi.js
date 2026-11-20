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
   * @param {string} payload.weddingId - ID đám cưới
   * @param {string} payload.message - Nội dung tin nhắn
   * @param {'gemini'|'openai'} [payload.provider]
   */
  async sessionChat(payload) {
    const response = await api.post("/ai/session-chat", payload);
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

