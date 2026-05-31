"use client";

import { cn } from "@/lib/utils";

const GENRES = [
  { value: "trap", label: "Trap" },
  { value: "drill", label: "Drill" },
  { value: "boom_bap", label: "Boom Bap" },
  { value: "conscious", label: "Conscious" },
  { value: "gully", label: "Gully" },
  { value: "desi_hiphop", label: "Desi" },
  { value: "lofi_hiphop", label: "Lo-fi" },
  { value: "old_school", label: "Old School" },
  { value: "battle_rap", label: "Battle" },
  { value: "freestyle", label: "Freestyle" },
  { value: "spoken_word", label: "Spoken Word" },
  { value: "other", label: "Other" },
];

const LANGUAGES = [
  { value: "hindi", label: "Hindi" },
  { value: "english", label: "English" },
  { value: "marathi", label: "Marathi" },
  { value: "punjabi", label: "Punjabi" },
  { value: "tamil", label: "Tamil" },
  { value: "telugu", label: "Telugu" },
  { value: "bengali", label: "Bengali" },
  { value: "kannada", label: "Kannada" },
  { value: "malayalam", label: "Malayalam" },
  { value: "bhojpuri", label: "Bhojpuri" },
  { value: "haryanvi", label: "Haryanvi" },
  { value: "gujarati", label: "Gujarati" },
  { value: "odia", label: "Odia" },
  { value: "urdu", label: "Urdu" },
  { value: "other", label: "Other" },
];

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
      {/* Sort */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
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

      {/* Genre pills */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
        {GENRES.map((g) => (
          <button
            key={g.value}
            onClick={() => select("genre", g.value)}
            className={cn(
              "shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all border",
              filters.genre === g.value
                ? "bg-accent/20 border-accent text-accent"
                : "border-border text-muted hover:text-white"
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Language pills */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
        {LANGUAGES.map((l) => (
          <button
            key={l.value}
            onClick={() => select("language", l.value)}
            className={cn(
              "shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all border",
              filters.language === l.value
                ? "bg-accent/20 border-accent text-accent"
                : "border-border text-muted hover:text-white"
            )}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
