import api from "./api.js";

export const getGuestInvitation = async (token) => {
  const response = await api.get(`/guests/invitation/${token}`);
  return response.data;
};

export const getGuests = async (weddingId, params = {}) => {
  const response = await api.get("/guests", {
    params: {
      wedding_id: weddingId,
      limit: 100,
      ...params,
    },
  });
  return response.data?.data ?? [];
};

export const createGuest = async (payload) => {
  const response = await api.post("/guests", payload);
  return response.data?.data;
};

export const updateGuest = async (id, payload) => {
  const response = await api.put(`/guests/${id}`, payload);
  return response.data?.data;
};

export const deleteGuest = async (id) => {
  const response = await api.delete(`/guests/${id}`);
  return response.data;
};

export const getGuestStats = async (weddingId) => {
  const response = await api.get("/guests/stats", {
    params: { wedding_id: weddingId },
  });
  return response.data?.data;
};
