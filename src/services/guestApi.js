import api from "./api.js";

export const getGuestInvitation = async (token) => {
  const response = await api.get(`/guests/invitation/${token}`);
  return response.data;
};
