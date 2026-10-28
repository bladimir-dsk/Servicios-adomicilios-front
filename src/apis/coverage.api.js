import { api } from "./client";

// GET /coverage-area -> { coverageAreas: { total, data: [...] } }
export const getCoverageAreas = async () => {
  const { data } = await api.get("/coverage-area");
  return data.coverageAreas?.data ?? [];
};

// POST /coverage-area
export const createCoverageArea = async (payload) => {
  const { data } = await api.post("/coverage-area", payload);
  return data;
};

export const updateCoverageArea = async (id, payload) => {
  const { data } = await api.patch(`/coverage-area/${id}`, payload);
  return data;
};
