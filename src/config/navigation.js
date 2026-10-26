import {
  LayoutDashboard,
  Settings,
  Home,
  ShoppingBag,
  LifeBuoy,
  User,
  ClipboardList,
  Contact,
  MapPinned,
} from "lucide-react";

export const ROLES = {
  ADMIN: "admin",
  CLIENTE: "cliente",
  EMPLEADO: "empleado",
};

// Ruta de inicio por rol
export const ROLE_HOME = {
  admin: "/admin",
  cliente: "/cliente",
  empleado: "/empleado",
};

// Menú de cada rol (máx. 5 items para que quepa bien en la barra inferior móvil)
export const NAVIGATION = {
  admin: [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
    { label: "Zonas", path: "/admin/zonas", icon: MapPinned },
    { label: "Ajustes", path: "/admin/configuracion", icon: Settings },
  ],
  cliente: [
    { label: "Inicio", path: "/cliente", icon: Home, end: true },
    { label: "Pedidos", path: "/cliente/pedidos", icon: ShoppingBag },
    { label: "Soporte", path: "/cliente/soporte", icon: LifeBuoy },
    { label: "Perfil", path: "/cliente/perfil", icon: User },
  ],
  empleado: [
    { label: "Panel", path: "/empleado", icon: LayoutDashboard, end: true },
    { label: "Tareas", path: "/empleado/tareas", icon: ClipboardList },
    { label: "Clientes", path: "/empleado/clientes", icon: Contact },
    { label: "Perfil", path: "/empleado/perfil", icon: User },
  ],
};
