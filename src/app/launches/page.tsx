"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LaunchCard } from "@/components/launch/LaunchCard";
import { LaunchFilters } from "@/components/launch/LaunchFilters";
import type { Launch } from "@/types/database";

export default function LaunchesPage() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [filters, setFilters] = useState({ genre: "", language: "", sort: "new" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let query = supabase
        .from("launches")
        .select("*, profiles(id, username, display_name, avatar_url, is_verified, role)");

      if (filters.genre) query = query.eq("genre", filters.genre);
      if (filters.language) query = query.eq("language", filters.language);
      if (filters.sort === "new") query = query.order("created_at", { ascending: false });
      else if (filters.sort === "alltime") query = query.order("upvotes_count", { ascending: false });
      else if (filters.sort === "week") {
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        query = query.gte("created_at", weekAgo).order("upvotes_count", { ascending: false });
      } else query = query.order("upvotes_count", { ascending: false });

      const { data } = await query.limit(48);
      setLaunches((data as Launch[]) ?? []);
      setLoading(false);
    }
    fetch();
  }, [filters]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-black">All Launches</h1>
      <LaunchFilters filters={filters} onChange={setFilters} />
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : launches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {launches.map((launch) => <LaunchCard key={launch.id} launch={launch} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-muted">
          <p className="text-4xl mb-3">🎤</p>
          <p>No launches match your filters.</p>
        </div>
      )}
    </div>
  );
}
