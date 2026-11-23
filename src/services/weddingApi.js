import api from "./api";
import {
  isValidSlugFormat,
  normalizeWedding,
  parseBudgetValue,
  RESERVED_SLUGS,
  slugifyVietnamese,
  toDateInputValue,
} from "../utils/weddingHelpers";

function buildPayload(data = {}) {
  const payload = {};
  if (data.title !== undefined) payload.title = String(data.title).trim();
  if (data.bride_name !== undefined) {
    payload.bride_name = String(data.bride_name || "").trim() || null;
  }
  if (data.groom_name !== undefined) {
    payload.groom_name = String(data.groom_name || "").trim() || null;
  }
  if (data.wedding_date !== undefined) {
    payload.wedding_date = toDateInputValue(data.wedding_date) || null;
  }
  if (data.venue_name !== undefined) {
    payload.venue_name = String(data.venue_name || "").trim() || null;
  }
  if (data.venue_address !== undefined) {
    payload.venue_address = String(data.venue_address || "").trim() || null;
  }
  if (data.slug !== undefined) {
    payload.slug = slugifyVietnamese(data.slug);
  }
  if (data.total_budget !== undefined) {
    payload.total_budget = parseBudgetValue(data.total_budget);
  }
  if (data.status !== undefined) {
    payload.status = data.status;
  }
  return payload;
}

function extractListFromResponse(body) {
  const candidates = [
    body?.data?.items,
    body?.data?.weddings,
    body?.data,
    body?.items,
    body,
  ];
  const found = candidates.find((c) => Array.isArray(c));
  return Array.isArray(found) ? found : [];
}

function extractItemFromResponse(body) {
  return body?.data?.wedding || body?.data || body?.wedding || body;
}

export const weddingApi = {
  async getAll(params = {}) {
    const response = await api.get("/weddings", { params });
    const rawItems = extractListFromResponse(response.data);
    return rawItems.map(normalizeWedding).filter(Boolean);
  },

  async getById(id) {
    const response = await api.get(`/weddings/${id}`);
    const item = extractItemFromResponse(response.data);
    return normalizeWedding(item);
  },

  async create(data) {
    const payload = buildPayload(data);
    const response = await api.post("/weddings", payload);
    const item = extractItemFromResponse(response.data);
    return normalizeWedding(item);
  },

  async update(id, data) {
    const payload = buildPayload(data);
    const response = await api.patch(`/weddings/${id}`, payload);
    const item = extractItemFromResponse(response.data);
    return normalizeWedding(item);
  },

  async remove(id) {
    await api.delete(`/weddings/${id}`);
    return { id };
  },

  async checkSlug(slug, excludeId) {
    const normalized = String(slug || "").trim().toLowerCase();
    if (!normalized || !isValidSlugFormat(normalized)) {
      const isReserved = RESERVED_SLUGS.includes(normalized);
      return {
        available: false,
        reason: isReserved
          ? "Đường dẫn trùng với từ khoá hệ thống."
          : "Đường dẫn chỉ gồm chữ thường không dấu, số và dấu gạch nối (tối thiểu 2 ký tự).",
      };
    }

    const response = await api.get("/weddings/check-slug", {
      params: {
        slug: normalized,
        ...(excludeId ? { excludeId } : {}),
      },
    });
    const data = response.data?.data ?? response.data;
    const available = Boolean(data?.available);
    return {
      available,
      reason: available
        ? undefined
        : data?.reason || "Đường dẫn này đã được sử dụng.",
    };
  },

  async getMembers(weddingId) {
    const response = await api.get(`/weddings/${weddingId}/members`);
    return response.data?.data ?? response.data;
  },

  async addMember(weddingId, payload) {
    const response = await api.post(`/weddings/${weddingId}/members`, payload);
    return response.data?.data ?? response.data;
  },

  async removeMember(weddingId, userId) {
    await api.delete(`/weddings/${weddingId}/members/${userId}`);
    return { userId };
  },

  async getFeatures(weddingId) {
    const response = await api.get(`/weddings/${weddingId}/features`);
    return response.data?.data ?? response.data;
  },

  async updateFeatureSection(weddingId, section, data) {
    const response = await api.patch(
      `/weddings/${weddingId}/features/${section}`,
      data
    );
    return response.data?.data ?? response.data;
  },
};

export default weddingApi;
