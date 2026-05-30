"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface AnalyticsData {
  totalUsers: number;
  totalLaunches: number;
  totalUpvotes: number;
  newUsersThisWeek: number;
  newLaunchesThisWeek: number;
  topLaunches: { id: string; title: string; upvotes_count: number }[];
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (profile && profile.role !== "admin") router.push("/");
  }, [profile, router]);

  useEffect(() => {
    if (!profile || profile.role !== "admin") return;
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

    Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("launches").select("*", { count: "exact", head: true }),
      supabase.from("upvotes").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
      supabase.from("launches").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
      supabase.from("launches").select("id, title, upvotes_count").order("upvotes_count", { ascending: false }).limit(5),
    ]).then(([u, l, uv, nuw, nlw, top]) => {
      setData({
        totalUsers: u.count ?? 0,
        totalLaunches: l.count ?? 0,
        totalUpvotes: uv.count ?? 0,
        newUsersThisWeek: nuw.count ?? 0,
        newLaunchesThisWeek: nlw.count ?? 0,
        topLaunches: (top.data as { id: string; title: string; upvotes_count: number }[]) ?? [],
      });
    });
  }, [profile]);

  if (loading) return (<div className="min-h-screen flex items-center justify-center text-muted">Loading…</div>);
  if (!profile || profile.role !== "admin") return (<div className="min-h-screen flex items-center justify-center text-center px-4"><div><p className="text-4xl mb-4">🔒</p><h2 className="text-xl font-bold">Admin Access Only</h2></div></div>);
  if (!data) return <div className="min-h-screen flex items-center justify-center text-muted">Loading…</div>;

  const metrics = [
    { label: "Total Users", value: data.totalUsers, sub: `+${data.newUsersThisWeek} this week` },
    { label: "Total Launches", value: data.totalLaunches, sub: `+${data.newLaunchesThisWeek} this week` },
    { label: "Total Upvotes", value: data.totalUpvotes, sub: "all time" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-black">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-surface border border-border rounded-2xl p-5">
            <p className="text-4xl font-black text-accent">{m.value}</p>
            <p className="font-bold mt-1">{m.label}</p>
            <p className="text-xs text-muted">{m.sub}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-bold mb-4">Top Tracks (All Time)</h2>
        <div className="space-y-3">
          {data.topLaunches.map((launch, i) => (
            <div key={launch.id} className="flex items-center gap-4 bg-surface border border-border rounded-xl px-4 py-3">
              <span className="text-muted font-bold w-6 text-center">{i + 1}</span>
              <p className="flex-1 font-semibold truncate">{launch.title}</p>
              <p className="text-accent font-bold">▲ {launch.upvotes_count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
