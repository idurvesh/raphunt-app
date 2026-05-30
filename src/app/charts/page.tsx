"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { formatCount } from "@/lib/utils";
import type { Launch } from "@/types/database";
import Link from "next/link";

const CHART_TABS = [
  { label: "🔥 This Week", value: "week" },
  { label: "🏆 All Time", value: "alltime" },
];

export default function ChartsPage() {
  const [tab, setTab] = useState("week");
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let query = supabase
        .from("launches")
        .select("*, profiles(id, username, display_name, avatar_url, is_verified)")
        .order("upvotes_count", { ascending: false })
        .limit(10);

      if (tab === "week") {
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        query = query.gte("created_at", weekAgo);
      }

      const { data } = await query;
      setLaunches((data as Launch[]) ?? []);
      setLoading(false);
    }
    fetch();
  }, [tab]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-black">🏆 Charts</h1>
        <p className="text-muted mt-1">Top Indian hip-hop by upvotes</p>
      </div>

      <Tabs tabs={CHART_TABS} active={tab} onChange={setTab} />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      ) : launches.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-4xl mb-3">📊</p>
          <p>No charts data yet. Start upvoting!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {launches.map((launch, i) => (
            <Link key={launch.id} href={`/launches/${launch.id}`}>
              <div className="flex items-center gap-4 bg-surface border border-border rounded-2xl p-4 hover:border-accent/50 transition-all">
                <span className={`text-2xl font-black w-8 text-center ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-muted"}`}>
                  {i + 1}
                </span>
                <Avatar src={launch.profiles?.avatar_url} name={launch.profiles?.display_name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{launch.title}</p>
                  <p className="text-sm text-muted flex items-center gap-1">
                    {launch.profiles?.display_name}
                    {launch.profiles?.is_verified && <span className="text-accent text-xs">✓</span>}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-accent">▲ {formatCount(launch.upvotes_count)}</p>
                  <div className="flex gap-1 justify-end mt-1">
                    {launch.genre && <Badge variant="muted">{launch.genre}</Badge>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
