"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

interface Sponsorship {
  id: string;
  launch_id: string;
  sponsor_name: string | null;
  amount: number | null;
  starts_at: string | null;
  ends_at: string | null;
  launches?: { title: string };
}

export default function SponsorshipsPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [launchId, setLaunchId] = useState("");
  const [sponsorName, setSponsorName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile && profile.role !== "admin") router.push("/");
  }, [profile, router]);

  useEffect(() => {
    if (!profile || profile.role !== "admin") return;
    supabase
      .from("sponsorships")
      .select("*, launches(title)")
      .order("created_at", { ascending: false })
      .then(({ data }) => setSponsorships((data as Sponsorship[]) ?? []));
  }, [profile]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data } = await supabase
      .from("sponsorships")
      .insert({ launch_id: launchId, sponsor_name: sponsorName, amount: parseInt(amount) || null })
      .select("*, launches(title)")
      .single();
    if (data) {
      await supabase.from("launches").update({ is_sponsored: true }).eq("id", launchId);
      setSponsorships((prev) => [data as Sponsorship, ...prev]);
    }
    setLaunchId(""); setSponsorName(""); setAmount("");
    setLoading(false);
  }

  if (authLoading) return (<div className="min-h-screen flex items-center justify-center text-muted">Loading…</div>);
  if (!profile || profile.role !== "admin") return (<div className="min-h-screen flex items-center justify-center text-center px-4"><div><p className="text-4xl mb-4">🔒</p><h2 className="text-xl font-bold">Admin Access Only</h2></div></div>);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-black">Sponsorships</h1>

      <form onSubmit={create} className="bg-surface border border-border rounded-2xl p-5 space-y-4">
        <h2 className="font-bold">Add Sponsorship</h2>
        <input
          type="text"
          placeholder="Launch ID (UUID)"
          value={launchId}
          onChange={(e) => setLaunchId(e.target.value)}
          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Sponsor Name"
            value={sponsorName}
            onChange={(e) => setSponsorName(e.target.value)}
            className="bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
          />
          <input
            type="number"
            placeholder="Amount (INR)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
          />
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Adding…" : "Add Sponsorship"}</Button>
      </form>

      <div className="space-y-3">
        {sponsorships.map((s) => (
          <div key={s.id} className="bg-surface border border-border rounded-xl px-4 py-3">
            <p className="font-bold">{s.launches?.title ?? s.launch_id}</p>
            <p className="text-sm text-muted">
              {s.sponsor_name && <span>{s.sponsor_name} · </span>}
              {s.amount && <span>₹{s.amount}</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
