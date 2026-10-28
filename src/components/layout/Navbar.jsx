import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Moon, Sun, LogOut, Layers, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useClickOutside } from "@/hooks/useClickOutside";
import { NAVIGATION } from "@/config/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  const current = (NAVIGATION[role] ?? []).find((i) =>
    i.end ? pathname === i.path : pathname.startsWith(i.path),
  );
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground md:hidden">
          <Layers className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-semibold">
          {current?.label ?? "App Roles"}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label="Cambiar tema"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-secondary"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {initial}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-medium">{user?.name}</span>
              <span className="block text-xs capitalize text-muted-foreground">
                {role}
              </span>
            </span>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl border bg-card p-2 shadow-lg">
              <div className="border-b px-3 py-2">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
                <span className="mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-medium capitalize text-accent-foreground">
                  {role}
                </span>
              </div>
              <button
                onClick={logout}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
