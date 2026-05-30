"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type PostType = "news" | "review";

export default function WritePage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [postType, setPostType] = useState<PostType>("news");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [launchId, setLaunchId] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canPost = profile && ["writer", "artist", "admin"].includes(profile.role);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !canPost) return;
    setLoading(true);
    setError("");

    if (postType === "news") {
      const { error: err } = await supabase.from("news").insert({
        author_id: user.id,
        title,
        content,
      });
      if (err) setError(err.message);
      else router.push("/news");
    } else {
      if (!launchId.trim()) { setError("Launch ID is required for reviews"); setLoading(false); return; }
      const { error: err } = await supabase.from("reviews").insert({
        author_id: user.id,
        launch_id: launchId,
        title,
        content,
        rating,
      });
      if (err) setError(err.message);
      else router.push("/reviews");
    }
    setLoading(false);
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <p className="text-2xl mb-4">🔒</p>
        <p className="text-muted">Please <a href="/login" className="text-accent hover:underline">sign in</a> to write.</p>
      </div>
    </div>
  );

  if (!canPost) return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <p className="text-4xl mb-4">✍️</p>
        <h2 className="text-xl font-bold mb-2">Writer Access Required</h2>
        <p className="text-muted">You need a writer or artist account to post content.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-black">Write ✍️</h1>

      <div className="flex gap-2">
        {(["news", "review"] as PostType[]).map((t) => (
          <button
            key={t}
            onClick={() => setPostType(t)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
              postType === t
                ? "bg-accent border-accent text-white"
                : "bg-surface-2 border-border text-muted hover:text-white"
            )}
          >
            {t === "news" ? "📰 News" : "⭐ Review"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-5">
        {postType === "review" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Launch ID *</label>
              <input
                type="text"
                value={launchId}
                onChange={(e) => setLaunchId(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
                placeholder="Paste the launch UUID"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className={`text-2xl transition-transform hover:scale-110 ${n <= rating ? "text-yellow-400" : "text-border"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
            placeholder={postType === "news" ? "News headline" : "Review headline"}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent resize-none"
            placeholder="Write your content here..."
            required
          />
        </div>

        {error && <p className="text-accent text-sm">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Publishing…" : "Publish"}
        </Button>
      </form>
    </div>
  );
}
