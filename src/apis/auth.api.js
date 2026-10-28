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

// POST /customer-information -> Crear perfil cliente
export const createCustomerProfile = async (profileData) => {
  const { data } = await api.post("/customer-information", profileData);
  return data;
};

// GET /customer-information -> Obtener perfil cliente
export const getCustomerProfile = async () => {
  const { data } = await api.get("/customer-information");
  return data;
};

// PATCH /customer-information/{id} -> Actualizar perfil cliente
export const updateCustomerProfile = async (id, profileData) => {
  const { data } = await api.patch(`/customer-information/${id}`, profileData);
  return data;
};

// GET /auth/usuarios-empresa -> Obtener información del admin y empresa
export const getAdminCompanyInfo = async () => {
  const { data } = await api.get("/auth/usuarios-empresa");
  return data;
};

// PATCH /empresa -> Actualizar datos de la empresa
export const updateCompanyInfo = async (companyData) => {
  const { data } = await api.patch("/empresa", companyData);
  return data;
};
