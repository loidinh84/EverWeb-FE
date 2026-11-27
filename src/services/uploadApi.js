import api from "./api";

const uploadApi = {
  async getCloudinaryImages(folder = "everweb/images") {
    const res = await api.get("/uploads/images", { params: { folder } });
    return res.data?.data ?? [];
  },
};

export default uploadApi;

