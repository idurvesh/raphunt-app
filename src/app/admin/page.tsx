"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Stats {
  launches: number;
  users: number;
  pending: number;
  news: number;
}

export default function AdminPage() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [stats, setStats] = useState<Stats>({ launches: 0, users: 0, pending: 0, news: 0 });

  useEffect(() => {
    if (profile && profile.role !== "admin") router.push("/");
  }, [profile, router]);

  useEffect(() => {
    if (!profile || profile.role !== "admin") return;
    Promise.all([
      supabase.from("launches").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("verification_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("news").select("*", { count: "exact", head: true }),
    ]).then(([l, u, v, n]) => {
      setStats({
        launches: l.count ?? 0,
        users: u.count ?? 0,
        pending: v.count ?? 0,
        news: n.count ?? 0,
      });
    });
  }, [profile]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-muted">Loading…</div>
  );

  if (!profile || profile.role !== "admin") return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <p className="text-4xl mb-4">🔒</p>
        <h2 className="text-xl font-bold">Admin Access Only</h2>
        <p className="text-muted mt-2 text-sm">You don&apos;t have permission to view this page.</p>
      </div>
    </div>
  );

  const cards = [
    { label: "Total Launches", value: stats.launches, href: "/launches", icon: "🎤" },
    { label: "Total Users", value: stats.users, href: "/admin/verifications", icon: "👥" },
    { label: "Pending Verifications", value: stats.pending, href: "/admin/verifications", icon: "⏳", accent: true },
    { label: "News Articles", value: stats.news, href: "/news", icon: "📰" },
  ];

  const links = [
    { label: "Verification Queue", href: "/admin/verifications", icon: "✅" },
    { label: "Analytics", href: "/admin/analytics", icon: "📊" },
    { label: "Sponsorships", href: "/admin/sponsorships", icon: "💰" },
    { label: "Flagged Content", href: "/admin/submissions", icon: "🚩" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-black">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div className={`bg-surface border rounded-2xl p-4 hover:border-accent/50 transition-all ${card.accent ? "border-accent/50" : "border-border"}`}>
              <p className="text-2xl">{card.icon}</p>
              <p className={`text-3xl font-black mt-2 ${card.accent ? "text-accent" : ""}`}>{card.value}</p>
              <p className="text-xs text-muted mt-1">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="font-bold mb-4">Admin Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="bg-surface border border-border rounded-2xl p-4 hover:border-accent/50 transition-all text-center">
                <p className="text-3xl">{link.icon}</p>
                <p className="text-sm font-semibold mt-2">{link.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
