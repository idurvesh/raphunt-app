import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "green" | "yellow" | "muted";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        {
          "bg-surface-2 text-white border border-border": variant === "default",
          "bg-accent/20 text-accent border border-accent/30": variant === "accent",
          "bg-green-900/30 text-green-400 border border-green-800": variant === "green",
          "bg-yellow-900/30 text-yellow-400 border border-yellow-800": variant === "yellow",
          "bg-surface text-muted border border-border": variant === "muted",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
