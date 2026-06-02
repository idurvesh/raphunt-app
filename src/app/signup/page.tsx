"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"fan" | "artist" | null>(null);
  const [step, setStep] = useState<"role" | "details">("role");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, display_name: username } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Always create as "fan" - role only becomes "artist" after admin approval
      await supabase.from("profiles").upsert({
        id: data.user.id,
        username,
        display_name: username,
        role: "fan",
      });

      // If they signed up as artist, send them to verify, but they can't post until approved
      if (role === "artist") router.push("/verify-artist");
      else router.push("/");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-black"><span className="text-accent">RAP</span>HUNT</h1>
          <p className="text-muted mt-1">Join the movement</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Who are you?</label>
            <div className="grid grid-cols-2 gap-2">
              {(["fan", "artist"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setStep("details"); }}
                  className={cn(
                    "py-3 rounded-xl border font-semibold text-sm transition-all",
                    role === r
                      ? "bg-accent border-accent text-white"
                      : "bg-surface-2 border-border text-muted hover:text-white"
                  )}
                >
                  {r === "fan" ? "🎧 Fan" : "🎤 Artist"}
                </button>
              ))}
            </div>
          </div>

          {step === "details" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {role === "artist" && (
                <p className="text-xs text-muted">Artists go through a quick verification after signup to start dropping.</p>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                  className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
                  placeholder="your_handle"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
                  placeholder="min. 8 characters"
                  minLength={8}
                  required
                />
              </div>
              {error && <p className="text-accent text-sm">{error}</p>}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </Button>
              <button
                type="button"
                onClick={() => { setStep("role"); setRole(null); }}
                className="w-full text-sm text-muted hover:text-white transition-colors"
              >
                ← Change role
              </button>
            </div>
          )}
        </form>

        <p className="text-center text-sm text-muted">
          Already have an account? <Link href="/login" className="text-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
