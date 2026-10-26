import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

// Uso: const { user, token, role, login, logout, isAuthenticated } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
