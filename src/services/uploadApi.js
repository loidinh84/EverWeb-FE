import api from "./api";

const uploadApi = {
  async getCloudinaryImages(folder = "everweb/images") {
    const res = await api.get("/uploads/images", { params: { folder } });
    return res.data?.data ?? [];
  },

  async uploadImage(file, folder = "everweb/images") {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);
    const res = await api.post("/uploads/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data ?? null;
  },
};

export default uploadApi;
