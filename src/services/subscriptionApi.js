import api from "./api";

const subscriptionApi = {
  async getPublicPlans() {
    const res = await api.get("/subscriptions/plans");
    return res.data?.data;
  },

  async getMySubscription() {
    const res = await api.get("/subscriptions/me");
    return res.data?.data;
  },

  async activateFreePlan(payload = {}) {
    const res = await api.post("/subscriptions/free", payload);
    return res.data?.data;
  },

  async createOrder(payload) {
    const res = await api.post("/subscriptions/orders", payload);
    return res.data?.data;
  },

  async confirmOrderPayment(orderId) {
    const res = await api.post(`/subscriptions/orders/${orderId}/confirm`);
    return res.data?.data;
  },
};

export default subscriptionApi;

