import { Menu } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle?: string;
  onOpenMobile: () => void;
  action?: React.ReactNode;
}

export default function Topbar({ title, subtitle, onOpenMobile, action }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-cocoa/8 bg-surface/90 px-5 py-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Abrir menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-cocoa/70 hover:bg-cocoa/5 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-semibold text-cocoa sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-cocoa/55">{subtitle}</p>}
        </div>
      </div>
      {action}
    </header>
  );
}
