"use client";

import { cn } from "@/lib/utils";

const GENRES = ["trap", "drill", "boom_bap", "conscious", "other"];
const LANGUAGES = ["hindi", "english", "tamil", "bengali", "punjabi", "other"];
const SORT_OPTIONS = [
  { label: "Trending", value: "trending" },
  { label: "New", value: "new" },
  { label: "Top This Week", value: "week" },
  { label: "All Time", value: "alltime" },
];

interface Filters {
  genre: string;
  language: string;
  sort: string;
}

interface LaunchFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function LaunchFilters({ filters, onChange }: LaunchFiltersProps) {
  const select = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: filters[key] === value ? "" : value });

  return (
    <div className="space-y-3">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange({ ...filters, sort: opt.value })}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
              filters.sort === opt.value
                ? "bg-accent border-accent text-white"
                : "border-border text-muted hover:text-white hover:border-muted"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => select("genre", g)}
            className={cn(
              "shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all border",
              filters.genre === g
                ? "bg-accent/20 border-accent text-accent"
                : "border-border text-muted hover:text-white"
            )}
          >
            {g}
          </button>
        ))}
        <span className="text-border">|</span>
        {LANGUAGES.map((l) => (
          <button
            key={l}
            onClick={() => select("language", l)}
            className={cn(
              "shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all border",
              filters.language === l
                ? "bg-accent/20 border-accent text-accent"
                : "border-border text-muted hover:text-white"
            )}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
