import { AuthProvider } from "@/context/AuthContext";
import AppRouter from "@/route/AppRouter";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
