import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-accent hover:bg-accent-hover text-white": variant === "primary",
            "bg-surface-2 hover:bg-border text-white border border-border": variant === "secondary",
            "hover:bg-surface-2 text-white": variant === "ghost",
            "bg-red-900 hover:bg-red-800 text-white": variant === "danger",
          },
          {
            "text-xs px-3 py-1.5": size === "sm",
            "text-sm px-4 py-2": size === "md",
            "text-base px-6 py-3": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
