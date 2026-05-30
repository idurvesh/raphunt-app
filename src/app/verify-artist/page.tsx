"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export default function VerifyArtistPage() {
  const { user, profile } = useAuth();
  const [handle, setHandle] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [existingStatus, setExistingStatus] = useState<"pending" | "approved" | "rejected" | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if user already has a verification request
  useEffect(() => {
    if (!user) return;
    supabase
      .from("verification_requests")
      .select("status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setExistingStatus(data.status as "pending" | "approved" | "rejected");
      });
  }, [user]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    await supabase.from("verification_requests").insert({
      user_id: user.id,
      instagram_handle: handle,
    });
    setSubmitted(true);
    setLoading(false);
  }

  // Already a verified artist
  if (profile?.role === "artist" || profile?.is_verified) return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-black">You&apos;re already verified!</h1>
        <p className="text-muted mt-2">Go drop some tracks.</p>
        <a href="/submit" className="inline-block mt-4">
          <Button>Drop a Track →</Button>
        </a>
      </div>
    </div>
  );

  const isPending = existingStatus === "pending" || submitted;
  const isRejected = existingStatus === "rejected";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🎤</div>
          <h1 className="text-2xl font-black">Get Artist Verified</h1>
          <p className="text-muted mt-2">DM us on Instagram to verify your artist account</p>
        </div>

        {isPending ? (
          <div className="bg-yellow-900/20 border border-yellow-800 rounded-2xl p-6 text-center space-y-2">
            <div className="text-3xl">⏳</div>
            <h2 className="font-bold text-yellow-400">Verification Pending</h2>
            <p className="text-sm text-muted">Your request is under review. We&apos;ll email you once approved, usually within 24–48 hours.</p>
            <p className="text-sm text-muted mt-1">Make sure you&apos;ve DM&apos;d <span className="text-white font-semibold">@RapHunt</span> on Instagram.</p>
          </div>
        ) : isRejected ? (
          <>
            <div className="bg-red-900/20 border border-red-800 rounded-2xl p-5 text-center space-y-2">
              <div className="text-3xl">❌</div>
              <h2 className="font-bold text-accent">Request Rejected</h2>
              <p className="text-sm text-muted">Your previous request was rejected. You can reapply below.</p>
            </div>
            <VerifyForm handle={handle} setHandle={setHandle} loading={loading} submit={submit} user={user} />
          </>
        ) : (
          <>
            <div className="bg-surface border border-border rounded-2xl p-5 space-y-3">
              <h2 className="font-bold">How it works</h2>
              <ol className="space-y-2 text-sm text-muted">
                <li className="flex gap-2"><span className="text-accent font-bold">1.</span> Enter your Instagram handle below</li>
                <li className="flex gap-2"><span className="text-accent font-bold">2.</span> DM <span className="text-white font-semibold">@RapHunt</span> on Instagram with your username</li>
                <li className="flex gap-2"><span className="text-accent font-bold">3.</span> Our team verifies and approves within 48 hours</li>
                <li className="flex gap-2"><span className="text-accent font-bold">4.</span> You get an email and can start dropping tracks</li>
              </ol>
            </div>
            <VerifyForm handle={handle} setHandle={setHandle} loading={loading} submit={submit} user={user} />
          </>
        )}
      </div>
    </div>
  );
}

function VerifyForm({ handle, setHandle, loading, submit, user }: {
  handle: string;
  setHandle: (v: string) => void;
  loading: boolean;
  submit: (e: React.FormEvent) => void;
  user: { id: string } | null;
}) {
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Your Instagram handle</label>
        <div className="flex">
          <span className="bg-surface border border-r-0 border-border rounded-l-xl px-3 flex items-center text-muted text-sm">@</span>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value.replace("@", ""))}
            className="flex-1 bg-surface-2 border border-border rounded-r-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
            placeholder="yourhandle"
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={loading || !user}>
        {loading ? "Submitting..." : "Submit Verification Request"}
      </Button>
      {!user && <p className="text-center text-sm text-accent">Please sign in first</p>}
    </form>
  );
}
