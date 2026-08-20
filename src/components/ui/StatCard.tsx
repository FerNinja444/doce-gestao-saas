import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; direction: "up" | "down" };
  tone?: "cocoa" | "rose" | "gold" | "success" | "danger";
}

const TONE_STYLES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  cocoa: "bg-cocoa/8 text-cocoa",
  rose: "bg-rose/15 text-rose-deep",
  gold: "bg-gold/15 text-gold",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
};

export default function StatCard({ label, value, icon: Icon, trend, tone = "cocoa" }: StatCardProps) {
  return (
    <div className="card flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-cocoa/55">
          {label}
        </span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${TONE_STYLES[tone]}`}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="font-display text-2xl font-semibold text-cocoa">{value}</span>
        {trend && (
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${
              trend.direction === "up" ? "text-success" : "text-danger"
            }`}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
