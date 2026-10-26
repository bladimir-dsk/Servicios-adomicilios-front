import { api } from "./client";

// POST /auth/login  -> { token, email, id_empresa, role, id, name }
export const loginRequest = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

// POST /auth/register -> { name, email, password }
export const registerRequest = async ({ name, email, password }) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
};
