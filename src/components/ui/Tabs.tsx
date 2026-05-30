"use client";

import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 bg-surface rounded-xl p-1 border border-border", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all",
            active === tab.value
              ? "bg-accent text-white"
              : "text-muted hover:text-white"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
