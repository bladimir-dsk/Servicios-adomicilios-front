# App Roles — React + Vite + Tailwind

Proyecto base con 3 roles (`admin`, `cliente`, `empleado`), menú lateral (PC) / barra de iconos inferior (móvil), navbar, login y registro.

## Iniciar
```bash
npm install
npm run dev
```
La URL de la API está en `.env` (`VITE_API_URL=http://localhost:3001/api/v1`).

## Estructura
```
src/
├─ apis/        client.js (axios + token), auth.api.js (login / register)
├─ context/     AuthContext.jsx (sesión: token + usuario en localStorage)
├─ hooks/       useAuth, useTheme, useClickOutside
├─ config/      navigation.js  <- AQUÍ defines el menú y rutas de cada rol
├─ components/
│  ├─ ui/       button, input, label, card (estilo shadcn)
│  └─ layout/   Sidebar, MobileNav, Navbar, DashboardLayout
├─ view/        auth/, admin/, cliente/, empleado/, shared/
└─ route/       AppRouter, ProtectedRoute, PublicRoute
```

## Token
Se guarda en `localStorage` (clave `auth_session`) desde `AuthContext`.
Se lee en cualquier parte con `const { token, user, role } = useAuth()`.
`apis/client.js` lo agrega solo como `Authorization: Bearer <token>` y, si la API responde 401, cierra sesión.

## Agregar una pantalla nueva
1. Crea la vista en `src/view/<rol>/MiVista.jsx`
2. Agrégala en `src/config/navigation.js` (menú del rol)
3. Agrega su `<Route>` en `src/route/AppRouter.jsx`

## Devsloka UI
Devsloka UI se publica en 21st.dev y se instala con el CLI de shadcn (requiere API key de https://21st.dev/mcp).
El proyecto ya trae `components.json` y el alias `@`, así que funciona directo:
```bash
npx shadcn@latest add "https://21st.dev/r/priyanshugupta28/tabs-swicher?api_key=TU_API_KEY"
```
Los componentes se copian a `src/components/ui/` (algunos requieren `framer-motion`, que ya está instalado).
