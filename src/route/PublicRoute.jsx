import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_HOME } from "@/config/navigation";

// Login / registro: si ya hay sesión, manda al inicio de su rol
export default function PublicRoute() {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated) return <Navigate to={ROLE_HOME[role] ?? "/"} replace />;
  return <Outlet />;
}
