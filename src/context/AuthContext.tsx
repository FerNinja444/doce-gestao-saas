import { createContext, ReactNode, useContext } from "react";
import { AuthUser } from "../types";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

interface AuthContextValue {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Autenticação simplificada para este MVP: não há backend real, então
 * qualquer combinação de nome/e-mail "loga" o usuário localmente.
 * TODO (produção real): substituir por autenticação real (ex: e-mail+senha
 * com verificação no servidor, ou provedor tipo OAuth).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorageState<AuthUser | null>("doce-gestao:auth-user", null);

  function login(nextUser: AuthUser) {
    setUser(nextUser);
  }

  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
