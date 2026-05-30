"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { News } from "@/types/database";
import Link from "next/link";

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("news")
      .select("*, profiles(id, username, display_name, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => {
        setNews((data as News[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-black">📰 News</h1>
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : news.length > 0 ? (
        <div className="space-y-4">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`}>
              <div className="bg-surface border border-border rounded-2xl p-5 hover:border-accent/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  {item.is_sponsored && <Badge variant="yellow">Sponsored</Badge>}
                  <span className="text-xs text-muted">{timeAgo(item.created_at)}</span>
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-muted text-sm mt-1">{item.content.slice(0, 200)}…</p>
                <p className="text-xs text-muted mt-2">by {item.profiles?.display_name ?? item.profiles?.username}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted">
          <p className="text-4xl mb-3">📰</p>
          <p>No news yet.</p>
        </div>
      )}
    </div>
  );
}
