import { createContext, ReactNode, useContext, useState } from "react";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Contexto simples para permitir que páginas controlem o Topbar
 * sem precisar reimplementar o cabeçalho a cada tela.
 */
export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Injeta a função de abrir menu mobile nos filhos via prop pattern simples */}
        <MobileMenuContext.Provider value={{ openMobile: () => setMobileOpen(true) }}>
          {children}
        </MobileMenuContext.Provider>
      </div>
    </div>
  );
}

interface MobileMenuContextValue {
  openMobile: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextValue>({ openMobile: () => {} });

export function useMobileMenu() {
  return useContext(MobileMenuContext);
}
