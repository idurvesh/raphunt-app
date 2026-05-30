"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export default function VerifyArtistPage() {
  const { user } = useAuth();
  const [handle, setHandle] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🎤</div>
          <h1 className="text-2xl font-black">Get Artist Verified</h1>
          <p className="text-muted mt-2">DM us on Instagram to verify your artist account</p>
        </div>

        {submitted ? (
          <div className="bg-green-900/30 border border-green-800 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2">✅</div>
            <h2 className="font-bold text-green-400">Request submitted!</h2>
            <p className="text-sm text-muted mt-2">
              We&apos;ll review your request and send you an email once verified. Usually takes 24–48 hours.
            </p>
          </div>
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
                {loading ? "Submitting…" : "Submit Verification Request"}
              </Button>
              {!user && <p className="text-center text-sm text-accent">Please sign in first</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
