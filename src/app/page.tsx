"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LaunchCard } from "@/components/launch/LaunchCard";
import { LaunchFilters } from "@/components/launch/LaunchFilters";
import { Tabs } from "@/components/ui/Tabs";
import type { Launch, News, Review } from "@/types/database";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

const HOME_TABS = [
  { label: "🔥 Launches", value: "launches" },
  { label: "📰 News", value: "news" },
  { label: "⭐ Reviews", value: "reviews" },
];

export default function HomePage() {
  const [tab, setTab] = useState("launches");
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filters, setFilters] = useState({ genre: "", language: "", sort: "new" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tab === "launches") fetchLaunches();
    if (tab === "news") fetchNews();
    if (tab === "reviews") fetchReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, filters]);

  async function fetchLaunches() {
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

    const { data } = await query.limit(24);
    setLaunches((data as Launch[]) ?? []);
    setLoading(false);
  }

  async function fetchNews() {
    setLoading(true);
    const { data } = await supabase
      .from("news")
      .select("*, profiles(id, username, display_name, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(20);
    setNews((data as News[]) ?? []);
    setLoading(false);
  }

  async function fetchReviews() {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*, profiles(id, username, display_name, avatar_url), launches(id, title)")
      .order("created_at", { ascending: false })
      .limit(20);
    setReviews((data as Review[]) ?? []);
    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center py-8 space-y-3">
        <h1 className="font-display font-black text-5xl md:text-7xl tracking-tighter">
          <span className="text-accent">RAP</span>HUNT
        </h1>
        <p className="text-muted text-base md:text-lg font-inter">Indian hip-hop drops. Discover. Upvote. Repeat.</p>
      </div>

      <Tabs tabs={HOME_TABS} active={tab} onChange={setTab} />

      {tab === "launches" && (
        <LaunchFilters filters={filters} onChange={setFilters} />
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : tab === "launches" ? (
        launches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {launches.map((launch) => <LaunchCard key={launch.id} launch={launch} />)}
          </div>
        ) : (
          <EmptyState message="No launches yet. Be the first to drop!" />
        )
      ) : tab === "news" ? (
        news.length > 0 ? (
          <div className="space-y-4">
            {news.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`}>
                <div className="bg-surface border border-border rounded-2xl p-5 hover:border-accent/50 transition-all">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-muted text-sm mt-1">{item.content.slice(0, 150)}…</p>
                  <p className="text-xs text-muted mt-2">by {item.profiles?.display_name} · {timeAgo(item.created_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState message="No news articles yet." />
        )
      ) : (
        reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Link key={review.id} href={`/reviews/${review.id}`}>
                <div className="bg-surface border border-border rounded-2xl p-5 hover:border-accent/50 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                    <span className="text-xs text-muted">for {review.launches?.title}</span>
                  </div>
                  <h3 className="font-bold">{review.title}</h3>
                  <p className="text-muted text-sm mt-1">{review.content.slice(0, 120)}…</p>
                  <p className="text-xs text-muted mt-2">by {review.profiles?.display_name} · {timeAgo(review.created_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState message="No reviews yet." />
        )
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 text-muted">
      <p className="text-4xl mb-3">🎤</p>
      <p>{message}</p>
    </div>
  );
}
