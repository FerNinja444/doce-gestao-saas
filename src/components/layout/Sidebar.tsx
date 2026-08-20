import { NavLink } from "react-router-dom";
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  Sparkles,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { to: "/estoque", label: "Estoque", icon: Boxes },
  { to: "/precificacao", label: "Precificação", icon: ClipboardList },
  { to: "/vendas", label: "Vendas", icon: ShoppingCart },
];

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const { user, logout } = useAuth();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-6">
        <div className="flex items-center gap-2 text-cocoa">
          <Sparkles className="h-5 w-5 text-gold" strokeWidth={1.75} />
          <span className="font-display text-lg font-semibold">Doce Gestão</span>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Fechar menu"
          className="flex h-9 w-9 items-center justify-center rounded-full text-cocoa/60 hover:bg-cocoa/5 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Navegação principal">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-cocoa text-surface"
                  : "text-cocoa/70 hover:bg-cocoa/5"
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-cocoa/8 px-5 py-4">
        <p className="truncate text-sm font-semibold text-cocoa">{user?.name ?? "Convidado"}</p>
        <p className="truncate text-xs text-cocoa/50">{user?.email ?? ""}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-cocoa/60 transition-colors hover:bg-cocoa/5 hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-cocoa/8 bg-surface-panel lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-cocoa-deep/40"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative h-full w-72 bg-surface-panel shadow-soft">{content}</aside>
        </div>
      )}
    </>
  );
}
