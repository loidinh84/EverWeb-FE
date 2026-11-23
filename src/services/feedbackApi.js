import api from "./api";

export const feedbackApi = {
  async submit({ category, message }) {
    const response = await api.post("/feedbacks", { category, message });
    return response.data;
  },
};

export default feedbackApi;
