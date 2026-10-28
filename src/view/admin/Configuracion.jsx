import { Link, Outlet, useLocation } from "react-router-dom";
import { Building2, Settings, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsItems = [
  {
    label: "General",
    path: "/admin/configuracion",
    icon: Settings,
    description: "Ajustes generales del sistema",
  },
  {
    label: "Perfil Empresa",
    path: "/admin/configuracion/perfil",
    icon: Building2,
    description: "Información de tu empresa",
  },
];

export default function Configuracion() {
  const location = useLocation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Ajustes del sistema</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent",
                isActive && "border-primary bg-primary/5",
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-2",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
}
