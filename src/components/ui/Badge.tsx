interface BadgeProps {
  children: React.ReactNode;
  tone?: "cocoa" | "success" | "danger" | "warn" | "neutral";
}

const TONE_STYLES: Record<NonNullable<BadgeProps["tone"]>, string> = {
  cocoa: "bg-cocoa/8 text-cocoa",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  warn: "bg-warn/10 text-warn",
  neutral: "bg-cocoa/5 text-cocoa/60",
};

export default function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_STYLES[tone]}`}
    >
      {children}
    </span>
  );
}
