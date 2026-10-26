import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NAVIGATION } from "@/config/navigation";
import { useAuth } from "@/hooks/useAuth";

// Barra inferior con iconos: solo visible en móvil
export default function MobileNav() {
  const { role } = useAuth();
  const items = NAVIGATION[role] ?? [];

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 backdrop-blur md:hidden">
      <ul className="flex items-stretch justify-around">
        {items.map(({ label, path, icon: Icon, end }) => (
          <li key={path} className="flex-1">
            <NavLink
              to={path}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex h-8 w-14 items-center justify-center rounded-full transition-colors",
                      isActive && "bg-accent"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="max-w-full truncate px-1">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
