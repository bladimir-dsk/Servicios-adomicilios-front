import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_HOME, ROLES } from "@/config/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import Login from "@/view/auth/Login";
import Register from "@/view/auth/Register";
import NotFound from "@/view/shared/NotFound";
import PlaceholderPage from "@/view/shared/PlaceholderPage";

import AdminDashboard from "@/view/admin/Dashboard";
import AdminZones from "@/view/admin/Zones";
import AdminConfiguracion from "@/view/admin/Configuracion";
import AdminPerfilEmpresa from "@/view/admin/PerfilEmpresa";

import ClienteInicio from "@/view/cliente/Inicio";
import ClientePedidos from "@/view/cliente/Pedidos";
import ClienteSoporte from "@/view/cliente/Soporte";
import ClientePerfil from "@/view/cliente/Perfil";

import EmpleadoPanel from "@/view/empleado/Panel";
import EmpleadoTareas from "@/view/empleado/Tareas";
import EmpleadoClientes from "@/view/empleado/Clientes";
import EmpleadoPerfil from "@/view/empleado/Perfil";

function RootRedirect() {
  const { isAuthenticated, role } = useAuth();
  return (
    <Navigate
      to={isAuthenticated ? (ROLE_HOME[role] ?? "/login") : "/login"}
      replace
    />
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        {/* Públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="/admin/zonas" element={<AdminZones />} />
            <Route path="/admin/configuracion" element={<AdminConfiguracion />}>
              <Route
                index
                element={
                  <PlaceholderPage
                    title="Configuración"
                    description="Selecciona una opción"
                  />
                }
              />
              <Route path="perfil" element={<AdminPerfilEmpresa />} />
            </Route>
          </Route>
        </Route>

        {/* CLIENTE */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.CLIENTE]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/cliente" element={<ClienteInicio />} />
            <Route path="/cliente/pedidos" element={<ClientePedidos />} />
            <Route path="/cliente/soporte" element={<ClienteSoporte />} />
            <Route path="/cliente/perfil" element={<ClientePerfil />} />
          </Route>
        </Route>

        {/* EMPLEADO */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.EMPLEADO]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/empleado" element={<EmpleadoPanel />} />
            <Route path="/empleado/tareas" element={<EmpleadoTareas />} />
            <Route path="/empleado/clientes" element={<EmpleadoClientes />} />
            <Route path="/empleado/perfil" element={<EmpleadoPerfil />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
