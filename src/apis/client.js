import axios from "axios";
import { storage } from "@/lib/storage";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Adjunta el token a cada petición
api.interceptors.request.use((config) => {
  const session = storage.get();
  if (session?.token) config.headers.Authorization = `Bearer ${session.token}`;
  return config;
});

// Si el token ya no sirve, cerramos sesión
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthCall = error.config?.url?.includes("/auth/");
    if (error.response?.status === 401 && !isAuthCall) {
      storage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error, fallback = "Ocurrió un error inesperado") {
  if (!error.response) return "No se pudo conectar con el servidor";
  const data = error.response.data;
  return data?.message || data?.error || data?.msg || fallback;
}
