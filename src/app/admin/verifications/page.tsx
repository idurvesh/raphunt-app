"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { timeAgo } from "@/lib/utils";
import type { VerificationRequest } from "@/types/database";

export default function VerificationsPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile && profile.role !== "admin") router.push("/");
  }, [profile, router]);

  useEffect(() => {
    if (!profile || profile.role !== "admin") return;
    supabase
      .from("verification_requests")
      .select("*, profiles(*)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRequests((data as VerificationRequest[]) ?? []);
        setLoading(false);
      });
  }, [profile]);

  async function handle(request: VerificationRequest, action: "approved" | "rejected") {
    await supabase
      .from("verification_requests")
      .update({ status: action })
      .eq("id", request.id);

    if (action === "approved") {
      await supabase
        .from("profiles")
        .update({ role: "artist", is_verified: true, instagram_handle: request.instagram_handle })
        .eq("id", request.user_id);
    }

    setRequests((prev) => prev.map((r) => r.id === request.id ? { ...r, status: action } : r));
  }

  if (authLoading) return (<div className="min-h-screen flex items-center justify-center text-muted">Loading…</div>);
  if (!profile || profile.role !== "admin") return (<div className="min-h-screen flex items-center justify-center text-center px-4"><div><p className="text-4xl mb-4">🔒</p><h2 className="text-xl font-bold">Admin Access Only</h2></div></div>);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-black">Verification Queue</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-4xl mb-3">✅</p>
          <p>No verification requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-surface border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold">{req.profiles?.display_name ?? req.profiles?.username}</p>
                  <p className="text-sm text-muted">@{req.profiles?.username}</p>
                  <p className="text-sm mt-1">Instagram: <span className="text-accent">@{req.instagram_handle}</span></p>
                  <p className="text-xs text-muted mt-1">{timeAgo(req.created_at)}</p>
                </div>
                <div className="shrink-0 space-y-2">
                  {req.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handle(req, "approved")}>Approve</Button>
                      <Button variant="danger" size="sm" onClick={() => handle(req, "rejected")}>Reject</Button>
                    </div>
                  ) : (
                    <Badge variant={req.status === "approved" ? "green" : "accent"}>
                      {req.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
