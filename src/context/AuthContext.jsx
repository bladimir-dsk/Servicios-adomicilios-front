import { createContext, useCallback, useMemo, useState } from "react";
import { loginRequest, registerRequest } from "@/apis/auth.api";
import { storage, isTokenExpired } from "@/lib/storage";

export const AuthContext = createContext(null);

function loadSession() {
  const s = storage.get();
  if (!s?.token || isTokenExpired(s.token)) {
    storage.clear();
    return null;
  }
  return s;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  const login = useCallback(async (credentials) => {
    const data = await loginRequest(credentials);
    const newSession = {
      token: data.token,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        id_empresa: data.id_empresa,
      },
    };
    storage.set(newSession);
    setSession(newSession);
    return newSession.user;
  }, []);

  const register = useCallback((payload) => registerRequest(payload), []);

  const logout = useCallback(() => {
    storage.clear();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      role: session?.user?.role ?? null,
      isAuthenticated: !!session?.token,
      login,
      register,
      logout,
    }),
    [session, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
