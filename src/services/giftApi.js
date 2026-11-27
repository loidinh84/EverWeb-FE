import api from "./api";

const giftApi = {
  async listByWedding(weddingId) {
    const res = await api.get("/gifts", { params: { wedding_id: weddingId } });
    return res.data?.data ?? { gifts: [], accounts: [] };
  },

  async createGift(payload) {
    const res = await api.post("/gifts", payload);
    return res.data?.data;
  },

  async updateGift(id, payload) {
    const res = await api.patch(`/gifts/${id}`, payload);
    return res.data?.data;
  },

  async deleteGift(id) {
    const res = await api.delete(`/gifts/${id}`);
    return res.data?.data;
  },

  async upsertBankAccount(payload) {
    const res = await api.put("/gifts/accounts", payload);
    return res.data?.data;
  },
};

export default giftApi;

